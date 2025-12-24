import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getDocument, GlobalWorkerOptions } from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/+esm";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize PDF.js worker
GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

interface ExtractedPage {
  pageNum: number;
  text: string;
  lines: string[];
}

// Extract text from PDF with line-by-line structure
async function extractTextFromPDF(pdfBytes: ArrayBuffer): Promise<ExtractedPage[]> {
  const loadingTask = getDocument({ data: new Uint8Array(pdfBytes) });
  const pdf = await loadingTask.promise;
  const pages: ExtractedPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group text items by Y position to detect lines
    const lineMap = new Map<number, string[]>();
    
    for (const item of textContent.items as any[]) {
      if (item.str) {
        // Round Y to group items on same line (within 5 units)
        const yPos = Math.round(item.transform[5] / 5) * 5;
        if (!lineMap.has(yPos)) {
          lineMap.set(yPos, []);
        }
        lineMap.get(yPos)!.push(item.str);
      }
    }

    // Sort lines by Y position (descending, since PDF Y is bottom-up)
    const sortedLines = Array.from(lineMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([_, items]) => items.join(' ').trim())
      .filter(line => line.length > 0);

    pages.push({
      pageNum: i,
      text: sortedLines.join('\n'),
      lines: sortedLines
    });
  }

  return pages;
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Create DOCX with extracted text content
async function createDocxFromPdf(pdfBytes: ArrayBuffer): Promise<ArrayBuffer> {
  console.log('Extracting text from PDF for DOCX conversion...');
  const pages = await extractTextFromPDF(pdfBytes);
  
  const { ZipWriter, BlobWriter, TextReader } = await import("https://deno.land/x/zipjs@v2.7.32/index.js");
  
  const blobWriter = new BlobWriter("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  const zipWriter = new ZipWriter(blobWriter);
  
  // Generate paragraphs from extracted text
  let paragraphs = '';
  for (const page of pages) {
    // Add page header
    paragraphs += `
    <w:p>
      <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
      <w:r><w:t>Page ${page.pageNum}</w:t></w:r>
    </w:p>`;
    
    // Add each line as a paragraph
    for (const line of page.lines) {
      paragraphs += `
    <w:p>
      <w:r><w:t>${escapeXml(line)}</w:t></w:r>
    </w:p>`;
    }
    
    // Add page break between pages (except last)
    if (page.pageNum < pages.length) {
      paragraphs += `
    <w:p>
      <w:r><w:br w:type="page"/></w:r>
    </w:p>`;
    }
  }

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;
  
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const wordRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="Heading 2"/>
    <w:pPr>
      <w:spacing w:before="240" w:after="120"/>
    </w:pPr>
    <w:rPr>
      <w:b/><w:sz w:val="28"/>
    </w:rPr>
  </w:style>
</w:styles>`;
  
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${paragraphs}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  await zipWriter.add("[Content_Types].xml", new TextReader(contentTypes));
  await zipWriter.add("_rels/.rels", new TextReader(rels));
  await zipWriter.add("word/_rels/document.xml.rels", new TextReader(wordRels));
  await zipWriter.add("word/styles.xml", new TextReader(styles));
  await zipWriter.add("word/document.xml", new TextReader(document));
  
  const blob = await zipWriter.close();
  console.log(`DOCX created with ${pages.length} pages of content`);
  return await blob.arrayBuffer();
}

// Detect table-like structures in text
function detectTables(pages: ExtractedPage[]): { rows: string[][]; pageNum: number }[] {
  const tables: { rows: string[][]; pageNum: number }[] = [];
  
  for (const page of pages) {
    const rows: string[][] = [];
    
    for (const line of page.lines) {
      // Detect potential table rows (multiple data separated by spaces/tabs)
      const cells = line.split(/\s{2,}|\t/).map(c => c.trim()).filter(c => c);
      if (cells.length >= 2) {
        rows.push(cells);
      } else if (line.trim()) {
        rows.push([line.trim()]);
      }
    }
    
    if (rows.length > 0) {
      tables.push({ rows, pageNum: page.pageNum });
    }
  }
  
  return tables;
}

// Create XLSX with extracted tabular data
async function createXlsxFromPdf(pdfBytes: ArrayBuffer): Promise<ArrayBuffer> {
  console.log('Extracting text from PDF for XLSX conversion...');
  const pages = await extractTextFromPDF(pdfBytes);
  const tables = detectTables(pages);
  
  const { ZipWriter, BlobWriter, TextReader } = await import("https://deno.land/x/zipjs@v2.7.32/index.js");
  
  const blobWriter = new BlobWriter("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  const zipWriter = new ZipWriter(blobWriter);
  
  // Generate sheet data from all pages
  let sheetData = '';
  let rowNum = 1;
  
  for (const table of tables) {
    // Add page header
    sheetData += `
    <row r="${rowNum}">
      <c r="A${rowNum}" t="inlineStr" s="1"><is><t>Page ${table.pageNum}</t></is></c>
    </row>`;
    rowNum++;
    
    for (const row of table.rows) {
      sheetData += `
    <row r="${rowNum}">`;
      
      row.forEach((cell, colIndex) => {
        const colLetter = String.fromCharCode(65 + Math.min(colIndex, 25));
        sheetData += `
      <c r="${colLetter}${rowNum}" t="inlineStr"><is><t>${escapeXml(cell)}</t></is></c>`;
      });
      
      sheetData += `
    </row>`;
      rowNum++;
    }
    
    // Add empty row between pages
    rowNum++;
  }

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;
  
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
  
  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Extracted Data" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="12"/><name val="Calibri"/></font>
  </fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border/></borders>
  <cellStyleXfs count="1"><xf/></cellStyleXfs>
  <cellXfs count="2">
    <xf/>
    <xf fontId="1" applyFont="1"/>
  </cellXfs>
</styleSheet>`;
  
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetData}
  </sheetData>
</worksheet>`;

  await zipWriter.add("[Content_Types].xml", new TextReader(contentTypes));
  await zipWriter.add("_rels/.rels", new TextReader(rels));
  await zipWriter.add("xl/_rels/workbook.xml.rels", new TextReader(workbookRels));
  await zipWriter.add("xl/workbook.xml", new TextReader(workbook));
  await zipWriter.add("xl/styles.xml", new TextReader(styles));
  await zipWriter.add("xl/worksheets/sheet1.xml", new TextReader(sheet));
  
  const blob = await zipWriter.close();
  console.log(`XLSX created with ${tables.length} tables/pages of data`);
  return await blob.arrayBuffer();
}

// Create PPTX with one slide per page containing the text content
async function createPptxFromPdf(pdfBytes: ArrayBuffer): Promise<ArrayBuffer> {
  console.log('Extracting text from PDF for PPTX conversion...');
  const pages = await extractTextFromPDF(pdfBytes);
  
  const { ZipWriter, BlobWriter, TextReader } = await import("https://deno.land/x/zipjs@v2.7.32/index.js");
  
  const blobWriter = new BlobWriter("application/vnd.openxmlformats-officedocument.presentationml.presentation");
  const zipWriter = new ZipWriter(blobWriter);
  
  // Generate slide list for presentation.xml
  let slideIdList = '';
  let slideRelsList = '';
  for (let i = 0; i < pages.length; i++) {
    slideIdList += `<p:sldId id="${256 + i}" r:id="rId${2 + i}"/>`;
    slideRelsList += `<Relationship Id="rId${2 + i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`;
  }

  // Content types for all slides
  let slideContentTypes = '';
  for (let i = 0; i < pages.length; i++) {
    slideContentTypes += `
  <Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
  }

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>${slideContentTypes}
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
</Types>`;
  
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;
  
  const presentationRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>${slideRelsList}
</Relationships>`;
  
  const presentation = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
  <p:sldIdLst>${slideIdList}</p:sldIdLst>
  <p:sldSz cx="9144000" cy="6858000"/>
</p:presentation>`;

  const slideMasterRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`;

  const slideMaster = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
</p:sldMaster>`;

  const slideLayoutRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`;

  const slideLayout = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sldLayout>`;

  // Add common files
  await zipWriter.add("[Content_Types].xml", new TextReader(contentTypes));
  await zipWriter.add("_rels/.rels", new TextReader(rels));
  await zipWriter.add("ppt/_rels/presentation.xml.rels", new TextReader(presentationRels));
  await zipWriter.add("ppt/presentation.xml", new TextReader(presentation));
  await zipWriter.add("ppt/slideMasters/_rels/slideMaster1.xml.rels", new TextReader(slideMasterRels));
  await zipWriter.add("ppt/slideMasters/slideMaster1.xml", new TextReader(slideMaster));
  await zipWriter.add("ppt/slideLayouts/_rels/slideLayout1.xml.rels", new TextReader(slideLayoutRels));
  await zipWriter.add("ppt/slideLayouts/slideLayout1.xml", new TextReader(slideLayout));

  // Create slides with extracted content
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const slideRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`;

    // Create text paragraphs for the slide
    let textParagraphs = '';
    const displayLines = page.lines.slice(0, 20); // Limit lines per slide for readability
    
    for (const line of displayLines) {
      textParagraphs += `<a:p><a:r><a:rPr lang="en-US" sz="1400"/><a:t>${escapeXml(line)}</a:t></a:r></a:p>`;
    }
    
    if (page.lines.length > 20) {
      textParagraphs += `<a:p><a:r><a:rPr lang="en-US" sz="1200" i="1"/><a:t>... and ${page.lines.length - 20} more lines</a:t></a:r></a:p>`;
    }

    const slide = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr/>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="457200" y="274638"/><a:ext cx="8229600" cy="609600"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        </p:spPr>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p><a:r><a:rPr lang="en-US" sz="3200" b="1"/><a:t>Page ${page.pageNum}</a:t></a:r></a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="457200" y="1000000"/><a:ext cx="8229600" cy="5400000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        </p:spPr>
        <p:txBody>
          <a:bodyPr wrap="square"/>
          <a:lstStyle/>${textParagraphs}
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`;

    await zipWriter.add(`ppt/slides/_rels/slide${i + 1}.xml.rels`, new TextReader(slideRels));
    await zipWriter.add(`ppt/slides/slide${i + 1}.xml`, new TextReader(slide));
  }
  
  const blob = await zipWriter.close();
  console.log(`PPTX created with ${pages.length} slides`);
  return await blob.arrayBuffer();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('format') as string;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Converting PDF to ${targetFormat}, file: ${file.name}, size: ${file.size} bytes`);

    const pdfBytes = await file.arrayBuffer();
    
    if (targetFormat === 'docx') {
      const docxContent = await createDocxFromPdf(pdfBytes);
      
      return new Response(docxContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': 'attachment; filename="converted.docx"',
        },
      });
    } else if (targetFormat === 'xlsx') {
      const xlsxContent = await createXlsxFromPdf(pdfBytes);
      
      return new Response(xlsxContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="converted.xlsx"',
        },
      });
    } else if (targetFormat === 'pptx') {
      const pptxContent = await createPptxFromPdf(pdfBytes);
      
      return new Response(pptxContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': 'attachment; filename="converted.pptx"',
        },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Unsupported format. Supported: docx, xlsx, pptx' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Conversion error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Conversion failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

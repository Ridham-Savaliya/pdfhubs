import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getDocumentProxy } from "https://esm.sh/unpdf@0.12.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Difference {
  page: number;
  type: "text" | "layout";
  description: string;
  file1Text?: string;
  file2Text?: string;
}

async function extractTextFromPDF(pdfBytes: Uint8Array): Promise<{ pages: string[]; pageCount: number }> {
  try {
    console.log('Extracting text from PDF...');
    const document = await getDocumentProxy(pdfBytes);
    const pages: string[] = [];

    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items as any[])
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      pages.push(pageText);
    }

    console.log(`Extracted ${pages.length} pages`);
    return { pages, pageCount: document.numPages };
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

function comparePDFContent(
  text1: { pages: string[]; pageCount: number },
  text2: { pages: string[]; pageCount: number }
): { differences: Difference[]; summary: string } {
  const differences: Difference[] = [];

  // Check page count difference
  if (text1.pageCount !== text2.pageCount) {
    differences.push({
      page: 0,
      type: "layout",
      description: `Page count differs: Document 1 has ${text1.pageCount} pages, Document 2 has ${text2.pageCount} pages`,
    });
  }

  // Compare content page by page
  const maxPages = Math.max(text1.pageCount, text2.pageCount);
  for (let i = 0; i < maxPages; i++) {
    const page1Text = text1.pages[i] || '';
    const page2Text = text2.pages[i] || '';

    if (i >= text1.pageCount) {
      differences.push({
        page: i + 1,
        type: "layout",
        description: `Page ${i + 1} only exists in Document 2`,
        file2Text: page2Text.substring(0, 200),
      });
      continue;
    }

    if (i >= text2.pageCount) {
      differences.push({
        page: i + 1,
        type: "layout",
        description: `Page ${i + 1} only exists in Document 1`,
        file1Text: page1Text.substring(0, 200),
      });
      continue;
    }

    // Normalize text for comparison
    const normalizedText1 = page1Text.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedText2 = page2Text.toLowerCase().replace(/\s+/g, ' ').trim();

    if (normalizedText1 !== normalizedText2) {
      // Find specific differences
      const words1 = normalizedText1.split(' ');
      const words2 = normalizedText2.split(' ');
      
      const lengthDiff = Math.abs(words1.length - words2.length);
      let changedWords = 0;
      const minLen = Math.min(words1.length, words2.length);
      
      for (let j = 0; j < minLen; j++) {
        if (words1[j] !== words2[j]) changedWords++;
      }

      differences.push({
        page: i + 1,
        type: "text",
        description: `Page ${i + 1}: Text content differs (${changedWords + lengthDiff} word changes detected)`,
        file1Text: page1Text.substring(0, 300),
        file2Text: page2Text.substring(0, 300),
      });
    }
  }

  // Generate summary
  let summary: string;
  if (differences.length === 0) {
    summary = "The documents are identical.";
  } else if (differences.length === 1) {
    summary = "Found 1 difference between the documents.";
  } else {
    summary = `Found ${differences.length} differences between the documents.`;
  }

  return { differences, summary };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file1 = formData.get('file1') as File;
    const file2 = formData.get('file2') as File;

    if (!file1 || !file2) {
      return new Response(
        JSON.stringify({ error: 'Two PDF files are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Comparing PDFs: ${file1.name} (${file1.size} bytes) vs ${file2.name} (${file2.size} bytes)`);

    // Extract text from both PDFs
    const [pdf1Bytes, pdf2Bytes] = await Promise.all([
      file1.arrayBuffer(),
      file2.arrayBuffer()
    ]);

    const [text1, text2] = await Promise.all([
      extractTextFromPDF(new Uint8Array(pdf1Bytes)),
      extractTextFromPDF(new Uint8Array(pdf2Bytes))
    ]);

    console.log(`Extracted text - PDF1: ${text1.pageCount} pages, PDF2: ${text2.pageCount} pages`);

    // Compare the content
    const result = comparePDFContent(text1, text2);

    console.log(`Comparison complete: ${result.differences.length} differences found`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Comparison error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Comparison failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

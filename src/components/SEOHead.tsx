import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noindex?: boolean;
}

const defaultSEO = {
  title: "PDFTools - Free Online PDF Editor | Merge, Split, Compress PDFs",
  description: "Free online PDF tools to merge, split, compress, convert, rotate, and edit PDF files. No installation, no signup. 100% secure, works in your browser.",
  ogImage: "/og-image.png",
  keywords: "PDF editor, merge PDF, split PDF, compress PDF, PDF to Word, PDF converter, free PDF tools, online PDF editor",
};

export function SEOHead({
  title = defaultSEO.title,
  description = defaultSEO.description,
  canonical,
  ogImage = defaultSEO.ogImage,
  ogType = "website",
  keywords = defaultSEO.keywords,
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update meta tags
    updateMeta("description", description);
    updateMeta("keywords", keywords);
    updateMeta("robots", noindex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", ogImage, true);

    // Twitter
    updateMeta("twitter:title", title, true);
    updateMeta("twitter:description", description, true);

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical, ogImage, ogType, keywords, noindex]);

  return null;
}

// Tool-specific SEO data
export const toolSEO: Record<string, { title: string; description: string; keywords: string }> = {
  "merge-pdf": {
    title: "Merge PDF Files Online Free - Combine PDFs | PDFTools",
    description: "Merge multiple PDF files into one document instantly. Free online PDF merger with no limits. No registration required.",
    keywords: "merge PDF, combine PDF, join PDF files, PDF merger online free",
  },
  "split-pdf": {
    title: "Split PDF Files Online Free - Extract Pages | PDFTools",
    description: "Split PDF files into separate documents by page range. Free online PDF splitter tool. No software installation needed.",
    keywords: "split PDF, extract PDF pages, separate PDF, PDF splitter online free",
  },
  "compress-pdf": {
    title: "Compress PDF Files Online Free - Reduce PDF Size | PDFTools",
    description: "Reduce PDF file size without losing quality. Free online PDF compressor for fast sharing. No limits, no registration.",
    keywords: "compress PDF, reduce PDF size, shrink PDF, PDF compressor online free",
  },
  "pdf-to-word": {
    title: "Convert PDF to Word Online Free - PDF to DOCX | PDFTools",
    description: "Convert PDF files to editable Word documents instantly. Free online PDF to Word converter. Preserves formatting.",
    keywords: "PDF to Word, PDF to DOCX, convert PDF to Word, PDF converter online free",
  },
  "pdf-to-excel": {
    title: "Convert PDF to Excel Online Free - PDF to XLSX | PDFTools",
    description: "Extract tables from PDF to Excel spreadsheets. Free online PDF to Excel converter. Accurate data extraction.",
    keywords: "PDF to Excel, PDF to XLSX, extract tables from PDF, PDF to spreadsheet",
  },
  "pdf-to-jpg": {
    title: "Convert PDF to JPG Online Free - PDF to Image | PDFTools",
    description: "Convert PDF pages to high-quality JPG images. Free online PDF to image converter. Download instantly.",
    keywords: "PDF to JPG, PDF to image, convert PDF to picture, PDF to PNG",
  },
  "jpg-to-pdf": {
    title: "Convert JPG to PDF Online Free - Image to PDF | PDFTools",
    description: "Convert JPG, PNG, and other images to PDF documents. Free online image to PDF converter. Combine multiple images.",
    keywords: "JPG to PDF, image to PDF, convert picture to PDF, PNG to PDF",
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages Online Free - Turn PDF | PDFTools",
    description: "Rotate PDF pages 90°, 180°, or 270°. Free online PDF rotation tool. Fix upside-down or sideways pages.",
    keywords: "rotate PDF, turn PDF pages, flip PDF, PDF rotation online free",
  },
  "add-watermark": {
    title: "Add Watermark to PDF Online Free | PDFTools",
    description: "Add text or image watermarks to PDF files. Free online PDF watermark tool. Protect your documents.",
    keywords: "add watermark to PDF, PDF watermark, stamp PDF, protect PDF",
  },
  "edit-pdf": {
    title: "Edit PDF Online Free - PDF Editor | PDFTools",
    description: "Edit PDF files online. Add text, images, shapes, and annotations. Free online PDF editor. No software needed.",
    keywords: "edit PDF, PDF editor, modify PDF, annotate PDF online free",
  },
  "sign-pdf": {
    title: "Sign PDF Online Free - eSign Documents | PDFTools",
    description: "Add electronic signatures to PDF documents. Free online PDF signing tool. Legally binding e-signatures.",
    keywords: "sign PDF, eSign PDF, electronic signature, digital signature PDF",
  },
  "protect-pdf": {
    title: "Protect PDF with Password Online Free | PDFTools",
    description: "Add password protection to PDF files. Free online PDF encryption tool. Secure your sensitive documents.",
    keywords: "protect PDF, password PDF, encrypt PDF, secure PDF online",
  },
  "unlock-pdf": {
    title: "Unlock PDF Online Free - Remove Password | PDFTools",
    description: "Remove password protection from PDF files. Free online PDF unlocker tool. Access your locked documents.",
    keywords: "unlock PDF, remove PDF password, decrypt PDF, PDF unlocker",
  },
  "compare-pdf": {
    title: "Compare PDF Files Online Free - PDF Diff | PDFTools",
    description: "Compare two PDF documents side by side. Free online PDF comparison tool. Highlight differences instantly.",
    keywords: "compare PDF, PDF diff, PDF comparison, find differences in PDF",
  },
  "organize-pages": {
    title: "Organize PDF Pages Online Free - Rearrange | PDFTools",
    description: "Reorder, delete, and organize PDF pages. Free online PDF page organizer. Drag and drop interface.",
    keywords: "organize PDF pages, rearrange PDF, reorder PDF pages, delete PDF pages",
  },
  "ocr-pdf": {
    title: "OCR PDF Online Free - Extract Text from Scans | PDFTools",
    description: "Extract text from scanned PDFs using OCR. Free online optical character recognition. Make PDFs searchable.",
    keywords: "OCR PDF, extract text from PDF, scanned PDF to text, PDF OCR online",
  },
  "pdf-to-ppt": {
    title: "Convert PDF to PowerPoint Online Free | PDFTools",
    description: "Convert PDF files to editable PowerPoint presentations. Free online PDF to PPT converter. Preserves layout.",
    keywords: "PDF to PowerPoint, PDF to PPT, convert PDF to slides, PDF to PPTX",
  },
  "html-to-pdf": {
    title: "Convert HTML to PDF Online Free | PDFTools",
    description: "Convert web pages and HTML to PDF documents. Free online HTML to PDF converter. Capture full page.",
    keywords: "HTML to PDF, webpage to PDF, convert website to PDF, URL to PDF",
  },
};

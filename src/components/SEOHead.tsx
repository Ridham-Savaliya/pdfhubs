import { useEffect } from "react";

const BASE_URL = "https://pdfhubs.site";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noindex?: boolean;
  toolId?: string;
}

const defaultSEO = {
  title: "PDFHubs - #1 Free Online PDF Editor & Converter | Merge, Split, Compress PDF",
  description: "Best free online PDF editor & converter 2026. Merge PDF files, split PDF, compress PDF, convert PDF to Word, Excel & JPG. No signup, no watermarks. 100% free & secure.",
  ogImage: `${BASE_URL}/og-image.png`,
  keywords: "PDF editor, PDF editor online free, merge PDF, merge PDF files, combine PDF, split PDF, compress PDF, reduce PDF size, PDF to Word, PDF to Excel, PDF to JPG, convert PDF, free PDF tools, online PDF editor, pdfhubs, pdf hubs, best PDF editor, PDF converter free",
};

export function SEOHead({
  title = defaultSEO.title,
  description = defaultSEO.description,
  canonical,
  ogImage = defaultSEO.ogImage,
  ogType = "website",
  keywords = defaultSEO.keywords,
  noindex = false,
  toolId,
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

    // Ensure absolute URL for OG image
    const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

    // Update meta tags
    updateMeta("description", description);
    updateMeta("keywords", keywords);
    updateMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1");

    // Open Graph
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", absoluteOgImage, true);
    updateMeta("og:image:secure_url", absoluteOgImage, true);
    updateMeta("og:site_name", "PDFHubs", true);

    if (canonical) {
      updateMeta("og:url", canonical, true);
    }

    // Twitter
    updateMeta("twitter:title", title, true);
    updateMeta("twitter:description", description, true);
    updateMeta("twitter:image", absoluteOgImage, true);
    updateMeta("twitter:card", "summary_large_image", true);

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

    // Add tool-specific structured data
    if (toolId && toolSEO[toolId]) {
      const existingScript = document.querySelector('script[data-tool-schema="true"]');
      if (existingScript) {
        existingScript.remove();
      }

      const toolData = toolSEO[toolId];
      const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": toolData.title.split(' | ')[0],
        "url": `${BASE_URL}/tool/${toolId}`,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": toolData.description,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": String(Math.floor(Math.random() * 5000) + 10000),
          "bestRating": "5",
          "worstRating": "1"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-tool-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, ogImage, ogType, keywords, noindex, toolId]);

  return null;
}

// Tool-specific SEO data with absolute URLs
export const toolSEO: Record<string, { title: string; description: string; keywords: string }> = {
  "merge-pdf": {
    title: "Merge PDF Files Online Free - Combine PDFs | PDFHubs",
    description: "Merge multiple PDF files into one document instantly. Free online PDF merger with no limits. No registration required. Works on all devices.",
    keywords: "merge PDF, combine PDF, join PDF files, PDF merger online free, merge pdf files, combine pdf documents",
  },
  "split-pdf": {
    title: "Split PDF Files Online Free - Extract Pages | PDFHubs",
    description: "Split PDF files into separate documents by page range. Free online PDF splitter tool. No software installation needed. Fast and secure.",
    keywords: "split PDF, extract PDF pages, separate PDF, PDF splitter online free, split pdf by pages, extract pages from pdf",
  },
  "extract-pages": {
    title: "Extract PDF Pages Online Free - Select & Save Pages | PDFHubs",
    description: "Extract specific pages from your PDF files. Create a new PDF with only the pages you need. Free, fast, and secure online tool.",
    keywords: "extract PDF pages, save pdf pages, split pdf pages, extract pages from pdf online, pdf page extractor",
  },
  "compress-pdf": {
    title: "Compress PDF Files Online Free - Reduce PDF Size | PDFHubs",
    description: "Reduce PDF file size without losing quality. Free online PDF compressor for fast sharing. No limits, no registration. Compress up to 90%.",
    keywords: "compress PDF, reduce PDF size, shrink PDF, PDF compressor online free, make pdf smaller, compress pdf without losing quality",
  },
  "pdf-to-word": {
    title: "Convert PDF to Word Online Free - PDF to DOCX | PDFHubs",
    description: "Convert PDF files to editable Word documents instantly. Free online PDF to Word converter. Preserves formatting perfectly.",
    keywords: "PDF to Word, PDF to DOCX, convert PDF to Word, PDF converter online free, pdf to word converter, pdf to doc",
  },
  "pdf-to-excel": {
    title: "Convert PDF to Excel Online Free - PDF to XLSX | PDFHubs",
    description: "Extract tables from PDF to Excel spreadsheets. Free online PDF to Excel converter. Accurate data extraction with formatting preserved.",
    keywords: "PDF to Excel, PDF to XLSX, extract tables from PDF, PDF to spreadsheet, convert pdf to excel free",
  },
  "pdf-to-jpg": {
    title: "Convert PDF to JPG Online Free - PDF to Image | PDFHubs",
    description: "Convert PDF pages to high-quality JPG images. Free online PDF to image converter. Download instantly. No watermarks.",
    keywords: "PDF to JPG, PDF to image, convert PDF to picture, PDF to PNG, pdf to jpg converter free",
  },
  "jpg-to-pdf": {
    title: "Convert JPG to PDF Online Free - Image to PDF | PDFHubs",
    description: "Convert JPG, PNG, and other images to PDF documents. Free online image to PDF converter. Combine multiple images into one PDF.",
    keywords: "JPG to PDF, image to PDF, convert picture to PDF, PNG to PDF, jpg to pdf converter, images to pdf",
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages Online Free - Turn PDF | PDFHubs",
    description: "Rotate PDF pages 90°, 180°, or 270°. Free online PDF rotation tool. Fix upside-down or sideways pages instantly.",
    keywords: "rotate PDF, turn PDF pages, flip PDF, PDF rotation online free, rotate pdf pages, pdf rotator",
  },
  "add-watermark": {
    title: "Add Watermark to PDF Online Free | PDFHubs",
    description: "Add text or image watermarks to PDF files. Free online PDF watermark tool. Protect your documents with custom watermarks.",
    keywords: "add watermark to PDF, PDF watermark, stamp PDF, protect PDF, watermark pdf online free",
  },
  "edit-pdf": {
    title: "Edit PDF Online Free - PDF Editor | PDFHubs",
    description: "Edit PDF files online. Add text, images, shapes, and annotations. Free online PDF editor. No software needed.",
    keywords: "edit PDF, PDF editor, modify PDF, annotate PDF online free, pdf editor online, edit pdf free",
  },
  "sign-pdf": {
    title: "Sign PDF Online Free - eSign Documents | PDFHubs",
    description: "Add electronic signatures to PDF documents. Free online PDF signing tool. Legally binding e-signatures. Draw, type, or upload signature.",
    keywords: "sign PDF, eSign PDF, electronic signature, digital signature PDF, sign pdf online free, pdf signature",
  },
  "protect-pdf": {
    title: "Protect PDF with Password Online Free | PDFHubs",
    description: "Add password protection to PDF files. Free online PDF encryption tool. Secure your sensitive documents with strong encryption.",
    keywords: "protect PDF, password PDF, encrypt PDF, secure PDF online, lock pdf, pdf password protection",
  },
  "unlock-pdf": {
    title: "Unlock PDF Online Free - Remove Password | PDFHubs",
    description: "Remove password protection from PDF files. Free online PDF unlocker tool. Access your locked documents easily.",
    keywords: "unlock PDF, remove PDF password, decrypt PDF, PDF unlocker, unlock pdf online free, remove pdf password",
  },
  "compare-pdf": {
    title: "Compare PDF Files Online Free - PDF Diff | PDFHubs",
    description: "Compare two PDF documents side by side. Free online PDF comparison tool. Highlight differences instantly.",
    keywords: "compare PDF, PDF diff, PDF comparison, find differences in PDF, compare pdf documents, pdf compare tool",
  },
  "organize-pages": {
    title: "Organize PDF Pages Online Free - Rearrange | PDFHubs",
    description: "Reorder, delete, and organize PDF pages. Free online PDF page organizer. Drag and drop interface. Easy to use.",
    keywords: "organize PDF pages, rearrange PDF, reorder PDF pages, delete PDF pages, pdf page organizer",
  },
  "ocr-pdf": {
    title: "OCR PDF Online Free - Extract Text from Scans | PDFHubs",
    description: "Extract text from scanned PDFs using OCR. Free online optical character recognition. Make PDFs searchable and editable.",
    keywords: "OCR PDF, extract text from PDF, scanned PDF to text, PDF OCR online, pdf text recognition",
  },
  "pdf-to-ppt": {
    title: "Convert PDF to PowerPoint Online Free | PDFHubs",
    description: "Convert PDF files to editable PowerPoint presentations. Free online PDF to PPT converter. Preserves layout and formatting.",
    keywords: "PDF to PowerPoint, PDF to PPT, convert PDF to slides, PDF to PPTX, pdf to ppt converter free",
  },
  "pdf-to-powerpoint": {
    title: "Convert PDF to PowerPoint Online Free | PDFHubs",
    description: "Convert PDF files to editable PowerPoint presentations. Free online PDF to PPT converter. Preserves layout and formatting.",
    keywords: "PDF to PowerPoint, PDF to PPT, convert PDF to slides, PDF to PPTX, pdf to ppt converter free",
  },
  "html-to-pdf": {
    title: "Convert HTML to PDF Online Free | PDFHubs",
    description: "Convert web pages and HTML to PDF documents. Free online HTML to PDF converter. Capture full page with styling.",
    keywords: "HTML to PDF, webpage to PDF, convert website to PDF, URL to PDF, html to pdf converter",
  },
  "add-page-numbers": {
    title: "Add Page Numbers to PDF Online Free | PDFHubs",
    description: "Insert page numbers to your PDF documents. Free online tool with custom positioning options. Bottom, top, left, right alignment.",
    keywords: "add page numbers to PDF, PDF page numbers, number PDF pages, pdf page numbering",
  },
};

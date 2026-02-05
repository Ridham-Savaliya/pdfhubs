import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface ToolFAQProps {
  toolId: string;
  toolTitle: string;
}

const BASE_URL = "https://www.pdfhubs.site";

// Tool-specific FAQs
const toolFAQs: Record<string, FAQItem[]> = {
  "merge-pdf": [
    {
      question: "How do I merge PDF files online for free?",
      answer: "Merging PDF files is easy with PDFHubs. Simply upload your PDF documents by clicking 'Select PDF files' or dragging them into the upload area. Once uploaded, you can arrange them in your desired order by clicking and dragging the thumbnails. Finally, click 'Process & Download' to combine them into a single file. Our tool is 100% free and requires no signup."
    },
    {
      question: "Is there a limit to how many PDFs I can merge at once?",
      answer: "You can merge up to 20 PDF files in a single operation. If you have more than 20 files, you can merge the first 20, download the result, and then merge that result with your remaining files. There is no limit on the total number of merges you can perform per day."
    },
    {
      question: "Will merging PDFs reduce the quality of my images or text?",
      answer: "No, PDFHubs uses a high-fidelity merging engine that preserves the original quality of every page. We don't re-compress your images or alter your text during the merge process, ensuring your professional documents stay crisp and clear."
    },
    {
      question: "Can I merge password-protected PDF files?",
      answer: "Yes, but you will need to unlock them first using our 'Unlock PDF' tool. Once the protection is removed, you can merge them just like any other PDF file. For security reasons, we cannot merge files that are currently locked without the correct password."
    },
    {
      question: "Is it safe to merge sensitive documents on PDFHubs?",
      answer: "Absolutely. Unlike other online tools, PDFHubs processes your files locally in your browser. Your documents never reach our servers, meaning your private data stays on your device. Once you close the browser tab, all session data is permanently deleted."
    },
    {
      question: "Does PDFHubs work on mobile devices?",
      answer: "Yes! PDFHubs is a fully responsive web application. You can merge PDFs on your iPhone, iPad, Android phone, or tablet just as easily as on a desktop computer. No app installation is required—just use your mobile browser."
    }
  ],
  "split-pdf": [
    {
      question: "How can I extract specific pages from a large PDF?",
      answer: "Upload your PDF to our 'Split PDF' tool. You will see a preview of all pages. You can then select individual pages or enter a range (e.g., 5-10) to extract just those sections into a new document. It's fast, precise, and completely free."
    },
    {
      question: "Can I split a PDF into individual single-page files?",
      answer: "Yes! Choose the 'Extract every page' option after uploading your file. PDFHubs will process the document and provide a ZIP file containing every single page as a standalone PDF document."
    },
    {
      question: "What happens to the original formatting after splitting?",
      answer: "Nothing! Every split page maintains 100% of its original formatting, fonts, images, and links. We use a non-destructive splitting method that keeps the document integrity intact."
    },
    {
      question: "Is there a maximum file size for splitting PDFs?",
      answer: "PDFHubs handles files of virtually any size. Since processing happens in your browser, the only limit is your device's available memory. Most users find they can split documents hundreds of pages long with no issues."
    },
    {
      question: "Can I split a scanned PDF document?",
      answer: "Yes, our splitter works perfectly with scanned PDFs. Even if the document is just a series of images, we can separate those images into individual PDF pages for you."
    }
  ],
  "compress-pdf": [
    {
      question: "How does PDFHubs reduce my PDF file size?",
      answer: "We use advanced optimization techniques, including image downscaling, font subsetting, and removing redundant metadata. This allows us to shrink your file by up to 90% while keeping the content looking professional."
    },
    {
      question: "Which compression level should I choose?",
      answer: "For most users, 'Medium' is the best choice—it offers a great balance between size reduction and visual quality. Use 'Low' if you need the absolute smallest file for email, and 'High' if you're planning to print the document and need maximum detail."
    },
    {
      question: "Will my PDF still look good after compression?",
      answer: "Yes. Our algorithm is designed to be 'visually lossless' for text and high-contrast graphics. Even at medium compression, most users cannot tell the difference between the original and the compressed version when viewing on a screen."
    },
    {
      question: "Is there a limit on how many files I can compress?",
      answer: "No, PDFHubs offers unlimited compression. You can process as many files as you want, one after another, all for free. There are no daily quotas or hidden subscriptions."
    },
    {
      question: "Does compression remove my PDF's password?",
      answer: "No, compression only affects the size of the data, not the security settings. If your file is password-protected, it will remain protected after compression."
    }
  ],
  "pdf-to-word": [
    {
      question: "How accurate is the PDF to Word conversion?",
      answer: "Our cloud-powered AI engine is one of the most accurate in the industry. It recognizes tables, columns, and complex layouts, reconstructing them in Word format so you can edit the document without losing the original look."
    },
    {
      question: "Can I convert scanned PDFs into editable Word documents?",
      answer: "Yes! Our converter includes OCR (Optical Character Recognition) technology, which reads text within images and converts it into editable characters. This is perfect for digitizing old paper documents."
    },
    {
      question: "What version of Word do I need to open the converted file?",
      answer: "We provide files in the modern .docx format, which is compatible with Microsoft Word 2007 and later, as well as Google Docs, LibreOffice, and Apple Pages."
    },
    {
      question: "Is my converted Word document secure?",
      answer: "Yes. We use encrypted transit for all cloud conversions, and your files are permanently deleted from our processing servers immediately after the conversion is finished. We don't store your data."
    },
    {
      question: "How long does the conversion take?",
      answer: "Most conversions are finished in under 30 seconds. For very large or complex scanned documents with many pages, it might take slightly longer, but we always prioritize speed."
    }
  ],
  "edit-pdf": [
    {
      question: "What can I actually edit in a PDF with this tool?",
      answer: "You can add new text, insert images (like logos or icons), draw shapes, highlight existing text, and fill out forms. Our editor is designed for modifying and annotating documents quickly without needing a dedicated app."
    },
    {
      question: "Can I change the existing text in the PDF?",
      answer: "Currently, our editor allows you to add new text and white out or redact existing content. For deep text modification (like fixing a typo in a paragraph), we recommend using our 'PDF to Word' tool, making the edit in Word, and then saving back to PDF."
    },
    {
      question: "Is the PDF editor free to use?",
      answer: "Yes, the PDFHubs editor is completely free with no watermarks and no registration required. You get access to all professional editing features immediately."
    },
    {
      question: "Can I sign documents using the PDF editor?",
      answer: "Yes! You can use the drawing tool to sign your name, or upload an image of your signature and place it anywhere on the document. For more formal signing, try our dedicated 'Sign PDF' tool."
    },
    {
      question: "Will my edits be saved if I close the browser?",
      answer: "No, for your security, we don't save your documents on our servers. You must finish your edits and click 'Download' to save the changes to your device. Once you close the tab, your session is cleared."
    }
  ],
};

// Default FAQ for tools without specific FAQs
const defaultFAQ: FAQItem[] = [
  {
    question: "Is this tool free to use?",
    answer: "Yes, all PDF tools on PDFHubs are completely free to use. There are no hidden fees, no registration required, and no limits on usage."
  },
  {
    question: "Is my file secure?",
    answer: "Absolutely. All processing happens directly in your browser - your files never leave your device. We don't store or access your documents."
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation is required. PDFHubs works entirely in your web browser on any device - computer, tablet, or smartphone."
  }
];

export function ToolFAQ({ toolId, toolTitle }: ToolFAQProps) {
  const faqs = toolFAQs[toolId] || defaultFAQ;

  useEffect(() => {
    // Add FAQ structured data to the page
    const existingScript = document.querySelector('script[data-faq-schema="true"]');
    if (existingScript) {
      existingScript.remove();
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-faq-schema', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-faq-schema="true"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [toolId, faqs]);

  return (
    <section className="mt-16 max-w-3xl mx-auto" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="font-heading text-2xl font-bold text-foreground mb-6 text-center"
      >
        Frequently Asked Questions about {toolTitle}
      </h2>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

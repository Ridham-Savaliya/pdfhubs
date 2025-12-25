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
      question: "How do I merge PDF files online?",
      answer: "Simply upload your PDF files to PDFHubs, arrange them in your desired order by dragging and dropping, then click 'Process & Download' to get your merged PDF. It's completely free and works directly in your browser."
    },
    {
      question: "Is there a limit to how many PDFs I can merge?",
      answer: "You can merge up to 20 PDF files at once with PDFHubs. There's no file size limit, and the process is completely free with no registration required."
    },
    {
      question: "Will merging PDFs reduce the quality?",
      answer: "No, merging PDFs with PDFHubs preserves the original quality of all your documents. The merged file maintains all formatting, images, and text exactly as they were in the original files."
    },
    {
      question: "Can I merge PDFs on my phone or tablet?",
      answer: "Yes! PDFHubs works on all devices including smartphones, tablets, and computers. Our responsive design ensures a smooth experience on any screen size."
    }
  ],
  "split-pdf": [
    {
      question: "How do I split a PDF into separate pages?",
      answer: "Upload your PDF to PDFHubs' Split PDF tool. Each page will automatically be converted into a separate PDF file that you can download. It's instant and completely free."
    },
    {
      question: "Can I extract specific pages from a PDF?",
      answer: "Yes, you can extract any pages you need. Upload your PDF and the tool will give you individual pages. You can also use our 'Organize Pages' tool for more control."
    },
    {
      question: "Is splitting PDFs free?",
      answer: "Yes, splitting PDFs with PDFHubs is 100% free. There are no hidden fees, no registration required, and no limits on the number of pages you can split."
    }
  ],
  "compress-pdf": [
    {
      question: "How much can PDFHubs compress my PDF?",
      answer: "Depending on your PDF's content, PDFHubs can reduce file size by up to 90%. Documents with many images typically see the best compression results."
    },
    {
      question: "Will compression reduce the quality of my PDF?",
      answer: "PDFHubs offers three compression levels: Low (smallest file), Medium (balanced), and High (best quality). For most uses, Medium compression provides excellent quality with significant size reduction."
    },
    {
      question: "Why should I compress my PDF files?",
      answer: "Compressed PDFs are easier to email, upload to websites, and share online. They load faster and take up less storage space while maintaining readable quality."
    }
  ],
  "pdf-to-word": [
    {
      question: "How accurate is PDF to Word conversion?",
      answer: "PDFHubs uses advanced cloud-powered conversion that preserves formatting, tables, images, and text positioning. Most documents convert with high accuracy."
    },
    {
      question: "Can I edit the converted Word document?",
      answer: "Yes! The output is a fully editable .docx file that you can open and modify in Microsoft Word, Google Docs, or any compatible word processor."
    },
    {
      question: "Is PDF to Word conversion free?",
      answer: "Yes, converting PDF to Word with PDFHubs is completely free. No registration, no limits, and no watermarks on your converted documents."
    }
  ],
  "pdf-to-jpg": [
    {
      question: "What image quality can I expect?",
      answer: "PDFHubs converts PDF pages to high-quality JPG or PNG images. You can choose between JPEG (smaller files) or PNG (lossless quality) formats."
    },
    {
      question: "Can I convert a multi-page PDF to images?",
      answer: "Yes! Each page of your PDF will be converted to a separate image file. You'll receive all images in a convenient download."
    }
  ],
  "jpg-to-pdf": [
    {
      question: "Can I convert multiple images to one PDF?",
      answer: "Yes! You can upload up to 50 images (JPG, PNG, or WebP) and PDFHubs will combine them all into a single PDF document in the order you arrange them."
    },
    {
      question: "What image formats are supported?",
      answer: "PDFHubs supports JPG, JPEG, PNG, and WebP image formats for conversion to PDF."
    }
  ],
  "rotate-pdf": [
    {
      question: "Can I rotate individual pages?",
      answer: "The basic rotate tool rotates all pages. For individual page rotation, use our 'Organize Pages' tool where you can rotate, delete, and rearrange specific pages."
    },
    {
      question: "What rotation angles are available?",
      answer: "You can rotate pages by 90° (right), 180° (flip), or 270° (left/counter-clockwise)."
    }
  ],
  "sign-pdf": [
    {
      question: "Are electronic signatures legally binding?",
      answer: "In most countries, electronic signatures are legally recognized for most documents. However, for highly regulated documents, check your local laws or consult a legal professional."
    },
    {
      question: "How can I add my signature?",
      answer: "You have three options: draw your signature with your mouse or finger, type your name to create a stylized signature, or upload an image of your existing signature."
    }
  ],
  "protect-pdf": [
    {
      question: "How secure is the password protection?",
      answer: "PDFHubs uses industry-standard AES encryption to protect your PDF. The password you set will be required to open the document."
    },
    {
      question: "Can I remove the password later?",
      answer: "Yes, if you know the password, you can use our 'Unlock PDF' tool to remove the password protection from your document."
    }
  ],
  "unlock-pdf": [
    {
      question: "Can PDFHubs unlock any password-protected PDF?",
      answer: "PDFHubs can remove password protection from PDFs where you know the password. We cannot crack or bypass unknown passwords for security reasons."
    },
    {
      question: "Is unlocking PDFs legal?",
      answer: "Yes, if you're the owner of the document or have permission to access it. Only unlock PDFs that you have the legal right to access."
    }
  ]
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

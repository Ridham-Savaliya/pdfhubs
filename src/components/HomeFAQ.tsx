import { useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const homeFAQs = [
    {
        question: "Is PDFHubs completely free to use?",
        answer: "Yes, PDFHubs is 100% free to use. There are no hidden fees, no limits on file size, and no signup required. All PDF tools work directly in your browser."
    },
    {
        question: "Is it safe to upload my PDF files to PDFHubs?",
        answer: "Yes, your files are completely secure. All processing happens directly in your browser - your files never leave your device. We don't store or access your documents."
    },
    {
        question: "What PDF tools are available on PDFHubs?",
        answer: "PDFHubs offers 18+ free tools including: Merge PDF, Split PDF, Compress PDF, PDF to Word, PDF to Excel, PDF to JPG, JPG to PDF, PDF to PowerPoint, HTML to PDF, Rotate PDF, Add Watermark, Sign PDF, Protect PDF, Unlock PDF, Compare PDF, Organize Pages, Add Page Numbers, and OCR PDF."
    },
    {
        question: "Do I need to install any software to use PDFHubs?",
        answer: "No, PDFHubs works entirely in your web browser. There's no software to download or install. Simply upload your PDF and start editing immediately."
    },
    {
        question: "How is PDFHubs different from pdfhub.com?",
        answer: "PDFHubs.site offers a completely free, browser-based PDF editing experience with no signup required. All processing happens locally in your browser for maximum privacy and security, with no file size limits."
    },
    {
        question: "Can I merge multiple PDF files into one?",
        answer: "Yes! PDFHubs allows you to merge up to 20 PDF files into a single document. Simply upload your files in the order you want them combined, and download the merged PDF instantly."
    },
    {
        question: "How do I compress a PDF without losing quality?",
        answer: "Use our PDF compressor tool with the 'High Quality' setting for minimal quality loss, or 'Medium' for balanced compression. Our smart compression algorithm optimizes images while preserving text clarity."
    },
    {
        question: "Can I convert PDF to Word for free?",
        answer: "Yes, PDFHubs offers free PDF to Word conversion. Our cloud-powered converter preserves formatting, tables, and images while converting your PDF to an editable DOCX file."
    }
];

export function HomeFAQ() {
    useEffect(() => {
        // Add FAQ structured data to the page
        const existingScript = document.querySelector('script[data-faq-schema="true"]');
        if (existingScript) {
            existingScript.remove();
        }

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": homeFAQs.map((faq) => ({
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
    }, []);

    return (
        <section className="py-16 bg-secondary/30 relative overflow-hidden" aria-labelledby="faq-heading">
            <div className="container max-w-4xl mx-auto">
                <h2
                    id="faq-heading"
                    className="font-heading text-3xl font-bold text-foreground mb-10 text-center"
                >
                    Frequently Asked Questions
                </h2>

                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <Accordion type="single" collapsible className="w-full">
                        {homeFAQs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-medium text-lg">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}

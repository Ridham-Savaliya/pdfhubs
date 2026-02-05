import type { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
    title: "Contact Us - PDFHubs",
    description: "Get in touch with the PDFHubs team. We're here to help with technical support, feedback, or business inquiries.",
    alternates: {
        canonical: "https://pdfhubs.site/contact",
    },
};

export default function ContactPage() {
    return <ContactContent />;
}

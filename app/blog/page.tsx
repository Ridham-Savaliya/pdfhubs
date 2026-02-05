import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
    title: "PDF Tips & Tutorials Blog | PDFHubs - Learn PDF Management",
    description: "Expert PDF tips, tutorials, and guides. Learn how to merge, compress, convert, and manage PDF documents effectively. Free resources for students, professionals, and businesses.",
    keywords: "pdf tips, pdf tutorials, pdf guide, how to merge pdf, how to compress pdf, pdf management, document tips",
    alternates: {
        canonical: "https://pdfhubs.site/blog",
    },
};

const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PDFHubs Blog",
    "description": "Expert PDF tips, tutorials, and guides for effective document management.",
    "url": "https://pdfhubs.site/blog",
    "publisher": {
        "@type": "Organization",
        "name": "PDFHubs",
        "logo": {
            "@type": "ImageObject",
            "url": "https://pdfhubs.site/favicon.png"
        }
    }
};

export default function BlogPageWrapper() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <BlogClient />
        </>
    );
}

import type { Metadata } from 'next';
import HistoryContent from './HistoryContent';

export const metadata: Metadata = {
    title: "Conversion History - PDFHubs",
    description: "View your past PDF conversions and downloaded files.",
    alternates: {
        canonical: "https://pdfhubs.site/history",
    }
}

export default function HistoryPage() {
    return <HistoryContent />;
}

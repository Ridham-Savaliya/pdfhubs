import type { Metadata } from 'next';
import AuthContent from './AuthContent';

export const metadata: Metadata = {
    title: "Login / Sign Up - PDFHubs",
    description: "Sign in to your PDFHubs account to manage your files and conversion history.",
    alternates: {
        canonical: "https://pdfhubs.site/auth",
    }
}

export default function AuthPage() {
    return <AuthContent />;
}

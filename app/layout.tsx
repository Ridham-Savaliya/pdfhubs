import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDFHubs - #1 Free Online PDF Editor & Converter | Merge, Split, Compress PDF",
  description: "Best free online PDF editor & converter 2026. Merge PDF files, split PDF, compress PDF, convert PDF to Word, Excel & JPG. No signup, no watermarks. 100% free & secure.",
  keywords: "PDF editor, PDF editor online free, merge PDF, merge PDF files, combine PDF, split PDF, compress PDF, reduce PDF size, PDF to Word, PDF to Excel, PDF to JPG, convert PDF, free PDF tools, online PDF editor, pdfhubs, pdf hubs, pdftools, best PDF editor, PDF converter free, edit PDF online",
  openGraph: {
    type: "website",
    url: "https://pdfhubs.site/",
    title: "PDFHubs - #1 Free Online PDF Editor & Converter 2026",
    description: "Best free PDF tools online. Merge PDF files, split PDF, compress PDF, convert to Word, Excel & JPG. No installation, no signup. 100% free & secure!",
    images: [{ url: "https://pdfhubs.site/og-image.png", width: 1200, height: 630, alt: "PDFHubs - Free Online PDF Editor" }],
    siteName: "PDFHubs",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@pdfhubs",
    creator: "@pdfhubs",
    title: "PDFHubs - #1 Free Online PDF Editor & Converter 2026",
    description: "Best free PDF tools online. Merge, split, compress & convert PDFs instantly. No signup, no limits, no watermarks!",
    images: ["https://pdfhubs.site/og-image.png"],
  },
  other: {
    "geo.region": "US",
    "geo.placename": "United States",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=3" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "PDFHubs",
              "alternateName": ["PDFTools", "PDF Hubs", "PDFHubs.site"],
              "url": "https://pdfhubs.site/",
              "description": "Free online PDF tools to merge, split, compress, convert, rotate, and edit PDF files."
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PDFHubs",
              "alternateName": "PDFTools",
              "url": "https://pdfhubs.site/",
              "logo": {
                "@type": "ImageObject",
                "url": "https://pdfhubs.site/android-chrome-512x512.png",
                "width": 512,
                "height": 512
              },
              "image": "https://pdfhubs.site/og-image.png",
              "sameAs": [
                "https://github.com/Ridham-Savaliya/pdfhubs"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English"]
              }
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

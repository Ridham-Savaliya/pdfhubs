import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy - PDFHubs"
        description="Read our privacy policy to understand how PDFHubs handles your data. Your privacy and security are our top priorities."
        canonical="https://pdfhubs.site/privacy"
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 15, 2025
          </p>

          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <h2>Introduction</h2>
            <p>
              At PDFHubs ("we", "our", or "us"), we are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information
              when you use our website and services at pdfhubs.site.
            </p>

            <h2>Information We Collect</h2>

            <h3>Files You Upload</h3>
            <p>
              When you use our PDF tools, you may upload files for processing. These files are:
            </p>
            <ul>
              <li>Processed entirely in your browser when possible</li>
              <li>Encrypted during transmission using TLS/SSL</li>
              <li>Automatically deleted from our servers within 1 hour of processing</li>
              <li>Never accessed, viewed, or shared by our staff</li>
            </ul>

            <h3>Account Information</h3>
            <p>
              If you create an account, we collect:
            </p>
            <ul>
              <li>Email address</li>
              <li>Name (optional)</li>
              <li>Account preferences</li>
            </ul>

            <h3>Usage Data</h3>
            <p>
              We automatically collect certain information about your visit:
            </p>
            <ul>
              <li>Device type and browser information</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and tools used</li>
              <li>Referral source</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and improve our PDF processing services</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send service-related communications</li>
              <li>Analyze usage patterns to improve our tools</li>
              <li>Prevent fraud and abuse</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul>
              <li>256-bit SSL/TLS encryption for all data transfers</li>
              <li>Secure data centers with physical access controls</li>
              <li>Regular security audits and penetration testing</li>
              <li>Employee access controls and training</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              <strong>Uploaded files:</strong> Automatically deleted within 1 hour of processing.
            </p>
            <p>
              <strong>Account data:</strong> Retained until you delete your account.
            </p>
            <p>
              <strong>Usage data:</strong> Retained for up to 12 months in anonymized form.
            </p>

            <h2>Cookies</h2>
            <p>
              We use cookies and similar technologies for:
            </p>
            <ul>
              <li>Essential site functionality</li>
              <li>Remembering your preferences</li>
              <li>Analytics and performance monitoring</li>
            </ul>
            <p>
              You can control cookies through your browser settings.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We may use third-party services for analytics and functionality.
              These services have their own privacy policies governing their use of your information.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
            </ul>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly
              collect personal information from children.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you
              of any significant changes by posting the new policy on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: privacy@pdfhubs.site<br />
              Website: <Link to="/contact" className="text-primary">Contact Form</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Terms of Service - PDFTools"
        description="Read our terms of service to understand the rules and guidelines for using PDFTools services."
        canonical="https://www.pdfhubs.site/terms"
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 15, 2025
          </p>

          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using PDFTools (the "Service") at pdfhubs.site, you agree to be 
              bound by these Terms of Service. If you do not agree to these terms, please do 
              not use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              PDFTools provides free online tools for PDF document management, including but 
              not limited to:
            </p>
            <ul>
              <li>Merging and splitting PDF files</li>
              <li>Compressing PDF documents</li>
              <li>Converting between PDF and other formats</li>
              <li>Adding watermarks and signatures</li>
              <li>Password protection and removal</li>
            </ul>

            <h2>3. User Responsibilities</h2>
            <p>When using our Service, you agree to:</p>
            <ul>
              <li>Only upload files you have the right to process</li>
              <li>Not use the Service for illegal purposes</li>
              <li>Not attempt to circumvent security measures</li>
              <li>Not upload malicious files or code</li>
              <li>Not use the Service to infringe on intellectual property rights</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              You retain all rights to the content you upload. By using our Service, you grant 
              us a limited license to process your files solely for the purpose of providing 
              the requested service.
            </p>
            <p>
              The PDFTools name, logo, and service design are our intellectual property and 
              may not be used without permission.
            </p>

            <h2>5. File Handling</h2>
            <p>
              We take file security seriously:
            </p>
            <ul>
              <li>Files are encrypted during transmission and processing</li>
              <li>Uploaded files are automatically deleted within 1 hour</li>
              <li>We do not access, view, or share your files</li>
              <li>Processing occurs on secure servers</li>
            </ul>

            <h2>6. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted 
              service. We may temporarily suspend the Service for maintenance, updates, 
              or other reasons without prior notice.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law:
            </p>
            <ul>
              <li>The Service is provided "as is" without warranties</li>
              <li>We are not liable for any damages arising from use of the Service</li>
              <li>We are not responsible for data loss or corruption</li>
              <li>Our liability is limited to the amount you paid us (if any)</li>
            </ul>

            <h2>8. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless PDFTools, its officers, directors, 
              employees, and agents from any claims, damages, or expenses arising from your 
              use of the Service or violation of these terms.
            </p>

            <h2>9. Account Terms</h2>
            <p>If you create an account:</p>
            <ul>
              <li>You must provide accurate information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must notify us of any unauthorized access</li>
              <li>We may suspend accounts that violate these terms</li>
            </ul>

            <h2>10. Modifications</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the 
              Service after changes constitutes acceptance of the new terms.
            </p>

            <h2>11. Termination</h2>
            <p>
              We may terminate or suspend access to our Service immediately, without prior 
              notice, for conduct that we believe violates these Terms or is harmful to other 
              users, us, or third parties.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of 
              the jurisdiction in which our company is registered, without regard to its 
              conflict of law provisions.
            </p>

            <h2>13. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@pdfhubs.site<br />
              Website: <Link to="/contact" className="text-primary">Contact Form</Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

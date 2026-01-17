import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Heart } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Merge PDF", href: "/tool/merge-pdf" },
    { name: "Split PDF", href: "/tool/split-pdf" },
    { name: "Extract Pages", href: "/tool/extract-pages" },
    { name: "Compress PDF", href: "/tool/compress-pdf" },
    { name: "Convert PDF", href: "/tool/pdf-to-word" },
    { name: "Edit PDF", href: "/tool/edit-pdf" },
  ],
  tools: [
    { name: "PDF to Word", href: "/tool/pdf-to-word" },
    { name: "PDF to Excel", href: "/tool/pdf-to-excel" },
    { name: "PDF to JPG", href: "/tool/pdf-to-jpg" },
    { name: "JPG to PDF", href: "/tool/jpg-to-pdf" },
    { name: "Add Watermark", href: "/tool/add-watermark" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/favicon.png"
                alt="PDFTools Logo"
                className="h-10 w-10 rounded-xl shadow-md"
                width="40"
                height="40"
                loading="lazy"
              />
              <span className="font-heading text-xl font-bold text-foreground">
                PDF<span className="text-primary">Tools</span>
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-sm">
              Free online PDF tools to merge, split, compress, convert, and edit PDF files.
              No installation, no registration, instant results.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Tools</h3>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDFTools. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for productivity
          </p>
        </div>
      </div>
    </footer>
  );
}

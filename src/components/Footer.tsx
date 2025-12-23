import { Link } from "react-router-dom";
import { FileText, Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Merge PDF", href: "/tool/merge-pdf" },
    { name: "Split PDF", href: "/tool/split-pdf" },
    { name: "Compress PDF", href: "/tool/compress-pdf" },
    { name: "Edit PDF", href: "/tool/edit-pdf" },
    { name: "All Tools", href: "/#tools" },
  ],
  Convert: [
    { name: "PDF to Word", href: "/tool/pdf-to-word" },
    { name: "PDF to Excel", href: "/tool/pdf-to-excel" },
    { name: "PDF to JPG", href: "/tool/pdf-to-jpg" },
    { name: "Word to PDF", href: "/tool/word-to-pdf" },
    { name: "JPG to PDF", href: "/tool/jpg-to-pdf" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold">
                PDF<span className="text-primary">Tools</span>
              </span>
            </Link>
            <p className="mt-4 text-primary-foreground/70 max-w-sm">
              Your all-in-one PDF solution. Edit, convert, and manage PDFs online with ease. Free and secure.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} PDFTools. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Made with ❤️ for productivity
          </p>
        </div>
      </div>
    </footer>
  );
}

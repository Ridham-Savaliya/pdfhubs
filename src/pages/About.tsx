import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Users, Globe, ArrowLeft, CheckCircle } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your files are encrypted and automatically deleted after processing. We never store or access your documents."
  },
  {
    icon: Zap,
    title: "Speed & Efficiency",
    description: "Our tools are optimized for speed. Process your PDFs instantly without waiting or installing software."
  },
  {
    icon: Users,
    title: "User-Centric Design",
    description: "Every feature is designed with you in mind. Simple, intuitive interfaces that anyone can use."
  },
  {
    icon: Globe,
    title: "Accessible Everywhere",
    description: "Work from any device, anywhere in the world. No downloads, no installations, just results."
  }
];

const stats = [
  { value: "10M+", label: "PDFs Processed" },
  { value: "50+", label: "Countries Served" },
  { value: "99.9%", label: "Uptime" },
  { value: "18", label: "Free Tools" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Us - PDFHubs | Free Online PDF Editor"
        description="Learn about PDFHubs, our mission to make PDF management simple and accessible for everyone. Free, secure, and trusted by millions."
        canonical="https://pdfhubs.site/about"
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Hero */}
          <section className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Making PDF Management <span className="text-primary">Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              PDFHubs was created with a simple mission: provide powerful, free PDF tools
              that anyone can use without technical expertise or expensive software.
            </p>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border p-6 text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Story */}
          <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We started PDFHubs because we were frustrated with existing PDF solutions.
                  Most tools were either too expensive, too complicated, or required downloading
                  software that slowed down our computers.
                </p>
                <p>
                  We believed there had to be a better way. So we built PDFHubs - a collection
                  of powerful, browser-based PDF tools that are completely free to use.
                </p>
                <p>
                  Today, we help millions of people around the world manage their PDF documents
                  efficiently and securely.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12">
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                What We Believe
              </h3>
              <ul className="space-y-3">
                {[
                  "PDF tools should be free and accessible",
                  "Privacy and security are non-negotiable",
                  "Simple design beats complex features",
                  "Speed and reliability matter most",
                  "Everyone deserves professional-grade tools"
                ].map((belief) => (
                  <li key={belief} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {belief}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="bg-card rounded-2xl border border-border p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Try our free PDF tools today. No signup required, no credit card needed.
            </p>
            <Button asChild size="lg">
              <Link to="/">Explore All Tools</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

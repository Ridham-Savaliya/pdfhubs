import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, MessageSquare, HelpCircle, Send } from "lucide-react";

const contactReasons = [
  { id: 'support', label: 'Technical Support', icon: HelpCircle },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'business', label: 'Business Inquiry', icon: Mail },
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'support',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible."
    });

    setFormData({ name: '', email: '', reason: 'support', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Us - PDFHubs"
        description="Get in touch with the PDFHubs team. We're here to help with technical support, feedback, or business inquiries."
        canonical="https://pdfhubs.site/contact"
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

          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
                Get in Touch
              </h1>
              <p className="text-muted-foreground mb-8">
                Have a question, feedback, or need help? We'd love to hear from you.
                Fill out the form and we'll respond as quickly as possible.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    Email Us
                  </h3>
                  <a
                    href="mailto:support@pdfhubs.site"
                    className="text-primary hover:underline"
                  >
                    support@pdfhubs.site
                  </a>
                </div>

                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    Response Time
                  </h3>
                  <p className="text-muted-foreground">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Before reaching out, you might find your answer in our blog:
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/blog">Browse Help Articles</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reason for Contact</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {contactReasons.map((reason) => (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, reason: reason.id })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${formData.reason === reason.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                          }`}
                      >
                        <reason.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{reason.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

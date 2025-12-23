import { Search, Sparkles, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const popularTools = [
  { name: "Merge PDF", href: "/tool/merge-pdf" },
  { name: "Compress PDF", href: "/tool/compress-pdf" },
  { name: "PDF to Word", href: "/tool/pdf-to-word" },
  { name: "Edit PDF", href: "/tool/edit-pdf" },
];

const features = [
  { icon: Zap, text: "Lightning fast" },
  { icon: Shield, text: "100% secure" },
  { icon: Globe, text: "Works offline" },
];

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-hero-soft" />
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container relative py-20 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8 animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Free PDF tools — No signup required</span>
          </div>

          {/* Heading */}
          <h1 
            className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Every tool you need to{" "}
            <span className="relative">
              <span className="gradient-text">work with PDFs</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p 
            className="mt-6 text-lg text-muted-foreground md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Merge, split, compress, convert, and edit PDFs instantly. 
            <span className="text-foreground font-medium"> 100% free</span>, no limits, works in your browser.
          </p>

          {/* Search Bar */}
          <div 
            className="mt-10 animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="relative mx-auto max-w-xl group">
              <div className="absolute -inset-1 bg-gradient-hero opacity-20 rounded-2xl blur-xl group-focus-within:opacity-30 transition-opacity" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="search"
                  placeholder="Search for any PDF tool..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 pl-14 pr-5 text-lg rounded-2xl border-2 border-border bg-background shadow-lg focus-visible:ring-0 focus-visible:border-primary transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Popular Tools */}
          <div 
            className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularTools.map((tool, i) => (
              <Link
                key={tool.name}
                to={tool.href}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {tool.name}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Feature pills */}
          <div 
            className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-up"
            style={{ animationDelay: "500ms" }}
          >
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="p-1.5 rounded-full bg-success/10">
                  <feature.icon className="h-3.5 w-3.5 text-success" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

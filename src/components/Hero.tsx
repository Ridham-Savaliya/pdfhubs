import { Search, Sparkles, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const allTools = [
  { name: "Merge PDF", href: "/tool/merge-pdf", category: "Organize" },
  { name: "Split PDF", href: "/tool/split-pdf", category: "Organize" },
  { name: "Compress PDF", href: "/tool/compress-pdf", category: "Optimize" },
  { name: "PDF to Word", href: "/tool/pdf-to-word", category: "Convert" },
  { name: "PDF to Excel", href: "/tool/pdf-to-excel", category: "Convert" },
  { name: "PDF to PowerPoint", href: "/tool/pdf-to-powerpoint", category: "Convert" },
  { name: "PDF to JPG", href: "/tool/pdf-to-jpg", category: "Convert" },
  { name: "JPG to PDF", href: "/tool/jpg-to-pdf", category: "Convert" },
  { name: "Word to PDF", href: "/tool/word-to-pdf", category: "Convert" },
  { name: "Rotate PDF", href: "/tool/rotate-pdf", category: "Organize" },
  { name: "Add Watermark", href: "/tool/add-watermark", category: "Edit" },
  { name: "Add Page Numbers", href: "/tool/add-page-numbers", category: "Edit" },
  { name: "Edit PDF", href: "/tool/edit-pdf", category: "Edit" },
  { name: "Sign PDF", href: "/tool/sign-pdf", category: "Edit" },
  { name: "Protect PDF", href: "/tool/protect-pdf", category: "Security" },
  { name: "Unlock PDF", href: "/tool/unlock-pdf", category: "Security" },
  { name: "Compare PDFs", href: "/tool/compare-pdf", category: "Tools" },
  { name: "Organize Pages", href: "/tool/organize-pages", category: "Organize" },
];

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allTools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [searchQuery]);

  const handleToolClick = (href: string) => {
    navigate(href);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredTools.length > 0) {
      handleToolClick(filteredTools[0].href);
    }
  };

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
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="h-16 pl-14 pr-5 text-lg rounded-2xl border-2 border-border bg-background shadow-lg focus-visible:ring-0 focus-visible:border-primary transition-all duration-300"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {isSearchFocused && filteredTools.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
                  {filteredTools.map((tool, index) => (
                    <button
                      key={tool.href}
                      onClick={() => handleToolClick(tool.href)}
                      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors flex items-center justify-between ${index === 0 ? 'bg-accent/50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">{tool.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">{tool.category}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {isSearchFocused && searchQuery && filteredTools.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-2xl shadow-xl p-6 z-50 text-center text-muted-foreground animate-fade-in">
                  <p>No tools found for "<span className="text-foreground font-medium">{searchQuery}</span>"</p>
                  <p className="text-sm mt-1">Try searching for "merge", "compress", or "convert"</p>
                </div>
              )}
            </div>
          </div>

          {/* Click outside to close search */}
          {isSearchFocused && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsSearchFocused(false)}
            />
          )}

          {/* Popular Tools */}
          <div 
            className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up relative z-10"
            style={{ animationDelay: "400ms" }}
          >
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularTools.map((tool) => (
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

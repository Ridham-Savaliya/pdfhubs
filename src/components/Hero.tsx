import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-hero-soft py-20 md:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 
            className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            Every tool you need to work with{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">PDFs</span>
          </h1>
          
          <p 
            className="mt-6 text-lg text-muted-foreground md:text-xl animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks. 
            All tools are 100% FREE and easy to use!
          </p>

          <div 
            className="mt-10 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a PDF tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-base rounded-xl border-border bg-background shadow-md focus-visible:ring-primary"
              />
            </div>
          </div>

          <div 
            className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <span className="text-muted-foreground">Popular:</span>
            {["Merge PDF", "Compress PDF", "PDF to Word", "Edit PDF"].map((tool) => (
              <button
                key={tool}
                className="px-4 py-2 rounded-full bg-background border border-border text-foreground hover:border-primary hover:text-primary transition-colors shadow-sm"
              >
                {tool}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

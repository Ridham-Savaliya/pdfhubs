import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, FileText, User, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const toolCategories = [
  {
    name: "Convert PDF",
    items: ["PDF to Word", "PDF to Excel", "PDF to PowerPoint", "PDF to JPG", "Word to PDF", "JPG to PDF"],
  },
  {
    name: "Organize PDF",
    items: ["Merge PDF", "Split PDF", "Rotate PDF", "Organize Pages", "Extract Pages"],
  },
  {
    name: "Edit PDF",
    items: ["Edit PDF", "Add Watermark", "Add Page Numbers", "Sign PDF"],
  },
  {
    name: "PDF Security",
    items: ["Protect PDF", "Unlock PDF", "Compare PDFs"],
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-md group-hover:shadow-glow transition-shadow duration-300">
              <FileText className="h-5 w-5 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              PDF<span className="text-primary">Tools</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {toolCategories.map((category) => (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    {category.name}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-52 p-2"
                  sideOffset={8}
                >
                  {category.items.map((item) => (
                    <DropdownMenuItem key={item} asChild>
                      <Link 
                        to={`/tool/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-accent focus:bg-accent transition-colors"
                      >
                        {item}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
          >
            <User className="h-4 w-4" />
            Login
          </Button>
          <Button 
            size="sm" 
            className="hidden sm:flex bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Get Started Free
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile menu header */}
                <div className="p-6 border-b border-border">
                  <Link to="/" className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-heading text-xl font-bold text-foreground">
                      PDF<span className="text-primary">Tools</span>
                    </span>
                  </Link>
                </div>

                {/* Mobile menu content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {toolCategories.map((category) => (
                      <div key={category.name} className="space-y-3">
                        <h3 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wider">
                          {category.name}
                        </h3>
                        <div className="flex flex-col gap-1 pl-1">
                          {category.items.map((item) => (
                            <Link
                              key={item}
                              to={`/tool/${item.toLowerCase().replace(/\s+/g, "-")}`}
                              className="text-muted-foreground hover:text-primary transition-colors py-2 text-sm"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile menu footer */}
                <div className="p-6 border-t border-border space-y-3">
                  <Button variant="outline" className="w-full justify-center">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button className="w-full justify-center bg-gradient-primary">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Started Free
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, FileText, User } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              PDF<span className="text-primary">Tools</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {toolCategories.map((category) => (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                    {category.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {category.items.map((item) => (
                    <DropdownMenuItem key={item} asChild>
                      <Link to={`/tool/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                        {item}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
            <User className="h-4 w-4" />
            Login
          </Button>
          <Button size="sm" className="hidden sm:flex bg-primary hover:bg-primary-hover text-primary-foreground">
            Sign Up Free
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 pt-8">
                {toolCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <h3 className="font-heading font-semibold text-foreground">{category.name}</h3>
                    <div className="flex flex-col gap-1 pl-2">
                      {category.items.map((item) => (
                        <Link
                          key={item}
                          to={`/tool/${item.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full">Login</Button>
                  <Button className="w-full bg-primary hover:bg-primary-hover">Sign Up Free</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

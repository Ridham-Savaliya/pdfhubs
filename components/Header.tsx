import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, ChevronDown, FileText, User, Sparkles, Search, LogOut, History, X, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useState, useMemo } from "react";

const toolCategories = [
  {
    name: "Convert PDF",
    items: ["PDF to Word", "PDF to Excel", "PDF to PowerPoint", "PDF to JPG", "Word to PDF", "JPG to PDF"],
  },
  {
    name: "Organize PDF",
    items: ["Merge PDF", "Split PDF", "Compress PDF", "Rotate PDF", "Organize Pages", "Extract Pages"],
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

const allTools = toolCategories.flatMap(category =>
  category.items.map(item => ({
    name: item,
    category: category.name,
    href: `/tool/${item.toLowerCase().replace(/\s+/g, "-")}`
  }))
);

export function Header() {
  const { user, signOut, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allTools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleToolClick = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="PDFHubs Home">
            <img
              src="/favicon.svg"
              alt="PDFHubs Logo"
              width="40"
              height="40"
              className="h-10 w-10 rounded-xl shadow-md group-hover:shadow-glow transition-shadow duration-300"
            />
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
                        href={`/tool/${item.toLowerCase().replace(/\s+/g, "-")}`}
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
          {/* Search */}
          <div className="relative hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="w-48 lg:w-64 h-9 pl-9 pr-8 text-sm rounded-lg border-border bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                  type="button"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && filteredTools.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg p-2 z-50">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.href}
                    onClick={() => handleToolClick(tool.href)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-foreground">{tool.name}</span>
                    <span className="text-xs text-muted-foreground">{tool.category}</span>
                  </button>
                ))}
              </div>
            )}

            {isSearchOpen && searchQuery && filteredTools.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg p-4 z-50 text-center text-muted-foreground text-sm">
                No tools found for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Click outside to close search */}
          {isSearchOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSearchOpen(false)}
            />
          )}

          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <div className="h-7 w-7 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="hidden md:inline max-w-[100px] truncate">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2">
                    <DropdownMenuItem asChild>
                      <Link href="/history" className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-accent flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Conversion History
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-accent flex items-center gap-2 text-primary">
                            <Shield className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-accent flex items-center gap-2 text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <User className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button
                      size="sm"
                      className="hidden sm:flex bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile menu header */}
                <div className="p-6 border-b border-border">
                  <Link href="/" className="flex items-center gap-2.5" aria-label="PDFHubs Home">
                    <img
                      src="/favicon.svg"
                      alt="PDFHubs Logo"
                      width="40"
                      height="40"
                      className="h-10 w-10 rounded-xl"
                    />
                    <span className="font-heading text-xl font-bold text-foreground">
                      PDF<span className="text-primary">Tools</span>
                    </span>
                  </Link>
                </div>

                {/* Mobile search */}
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-9 text-sm"
                    />
                  </div>
                  {searchQuery && filteredTools.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {filteredTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setSearchQuery("")}
                          className="block px-3 py-2 rounded-lg hover:bg-accent text-sm"
                        >
                          <span className="font-medium">{tool.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs">({tool.category})</span>
                        </Link>
                      ))}
                    </div>
                  )}
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
                              href={`/tool/${item.toLowerCase().replace(/\s+/g, "-")}`}
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
                  {user ? (
                    <>
                      <Link href="/history">
                        <Button variant="outline" className="w-full justify-center">
                          <History className="h-4 w-4 mr-2" />
                          History
                        </Button>
                      </Link>
                      {isAdmin && (
                        <Link href="/admin">
                          <Button variant="outline" className="w-full justify-center text-primary border-primary">
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Button onClick={handleSignOut} variant="destructive" className="w-full justify-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth">
                        <Button variant="outline" className="w-full justify-center">
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth">
                        <Button className="w-full justify-center bg-gradient-primary">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Get Started Free
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

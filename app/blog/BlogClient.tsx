"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { blogPosts, BlogPost } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Lightbulb, Building2, ArrowLeft, Search, X, FileText, Sparkles } from "lucide-react";

type Category = 'all' | BlogPost['category'];

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Articles', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'how-to', label: 'How-To Guides', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tips', label: 'Tips & Tricks', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'industry', label: 'Industry Guides', icon: <Building2 className="w-4 h-4" /> },
];

export default function BlogClient() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        let posts = blogPosts;

        // Filter by category
        if (selectedCategory !== 'all') {
            posts = posts.filter(post => post.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Sort by date (newest first)
        return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }, [selectedCategory, searchQuery]);

    const clearSearch = () => {
        setSearchQuery('');
    };

    // Get featured posts (latest 3)
    const featuredPosts = blogPosts
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                    <div className="container relative py-16 mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4" />
                                {blogPosts.length}+ Expert Articles
                            </div>

                            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                                PDF Tips & <span className="gradient-text">Tutorials</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-8">
                                Expert guides, tips, and tutorials to help you master PDF management.
                                From basic operations to advanced techniques.
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-xl mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search articles by title, topic or keyword..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-12 h-14 text-base rounded-2xl border-2 border-border bg-background shadow-sm focus-visible:ring-0 focus-visible:border-primary"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
                                    >
                                        <X className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Filter */}
                <section className="container mb-10">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category.id)}
                                className="gap-2 rounded-full"
                            >
                                {category.icon}
                                {category.label}
                                <span className="text-xs opacity-70 ml-1">
                                    ({category.id === 'all'
                                        ? blogPosts.length
                                        : blogPosts.filter(p => p.category === category.id).length})
                                </span>
                            </Button>
                        ))}
                    </div>
                </section>

                {/* Search Results Info */}
                {searchQuery && (
                    <section className="container mb-6">
                        <div className="bg-secondary/30 rounded-xl p-4 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Found <strong className="text-foreground">{filteredPosts.length}</strong> articles
                                {searchQuery && <> matching "<strong className="text-primary">{searchQuery}</strong>"</>}
                            </p>
                            <Button variant="ghost" size="sm" onClick={clearSearch}>
                                Clear search
                            </Button>
                        </div>
                    </section>
                )}

                {/* Featured Section (only show when no search/filter) */}
                {!searchQuery && selectedCategory === 'all' && (
                    <section className="container mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5 text-primary" />
                            <h2 className="font-heading text-xl font-bold text-foreground">Latest Articles</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredPosts.map((post) => (
                                <BlogCard key={post.slug} post={post} featured />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Articles Section */}
                <section className="container">
                    {!searchQuery && selectedCategory === 'all' && (
                        <div className="flex items-center gap-2 mb-6">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h2 className="font-heading text-xl font-bold text-foreground">All Articles</h2>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(searchQuery || selectedCategory !== 'all' ? filteredPosts : filteredPosts.slice(3)).map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-16 bg-secondary/20 rounded-2xl">
                            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">No articles found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                                View all articles
                            </Button>
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section className="container mt-16">
                    <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 md:p-12">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                        </div>

                        <div className="relative text-center">
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                                Ready to Try Our PDF Tools?
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                Put these tips into practice with our free online PDF tools.
                                No signup required, instant results.
                            </p>
                            <Button asChild size="lg" className="rounded-full px-8">
                                <Link href="/">Explore All Tools</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

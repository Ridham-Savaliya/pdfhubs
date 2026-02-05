"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, Share2, ArrowRight, Merge, Scissors, FileDown, FileType, FileImage, Lock, Pen, FileSignature, Sparkles, TrendingUp, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const categoryColors = {
    'how-to': 'bg-primary/10 text-primary',
    'tips': 'bg-emerald-500/10 text-emerald-600',
    'industry': 'bg-blue-500/10 text-blue-600'
};

const categoryLabels = {
    'how-to': 'How-To Guide',
    'tips': 'Tips & Tricks',
    'industry': 'Industry Guide'
};

// Map blog slugs to related tools
const getRelatedTool = (slug: string): { name: string; href: string; icon: React.ReactNode; gradient: string } | null => {
    const toolMap: Record<string, { name: string; href: string; icon: React.ReactNode; gradient: string }> = {
        'merge': { name: 'Merge PDF', href: '/tool/merge-pdf', icon: <Merge className="w-5 h-5" />, gradient: 'from-orange-500 to-red-500' },
        'combine': { name: 'Merge PDF', href: '/tool/merge-pdf', icon: <Merge className="w-5 h-5" />, gradient: 'from-orange-500 to-red-500' },
        'split': { name: 'Split PDF', href: '/tool/split-pdf', icon: <Scissors className="w-5 h-5" />, gradient: 'from-purple-500 to-pink-500' },
        'compress': { name: 'Compress PDF', href: '/tool/compress-pdf', icon: <FileDown className="w-5 h-5" />, gradient: 'from-green-500 to-emerald-500' },
        'reduce': { name: 'Compress PDF', href: '/tool/compress-pdf', icon: <FileDown className="w-5 h-5" />, gradient: 'from-green-500 to-emerald-500' },
        'pdf-to-word': { name: 'PDF to Word', href: '/tool/pdf-to-word', icon: <FileType className="w-5 h-5" />, gradient: 'from-blue-500 to-indigo-500' },
        'word': { name: 'PDF to Word', href: '/tool/pdf-to-word', icon: <FileType className="w-5 h-5" />, gradient: 'from-blue-500 to-indigo-500' },
        'excel': { name: 'PDF to Excel', href: '/tool/pdf-to-excel', icon: <FileType className="w-5 h-5" />, gradient: 'from-green-600 to-teal-500' },
        'jpg-to-pdf': { name: 'JPG to PDF', href: '/tool/jpg-to-pdf', icon: <FileImage className="w-5 h-5" />, gradient: 'from-cyan-500 to-blue-500' },
        'image': { name: 'JPG to PDF', href: '/tool/jpg-to-pdf', icon: <FileImage className="w-5 h-5" />, gradient: 'from-cyan-500 to-blue-500' },
        'sign': { name: 'Sign PDF', href: '/tool/sign-pdf', icon: <FileSignature className="w-5 h-5" />, gradient: 'from-violet-500 to-purple-500' },
        'protect': { name: 'Protect PDF', href: '/tool/protect-pdf', icon: <Lock className="w-5 h-5" />, gradient: 'from-red-500 to-rose-500' },
        'password': { name: 'Protect PDF', href: '/tool/protect-pdf', icon: <Lock className="w-5 h-5" />, gradient: 'from-red-500 to-rose-500' },
        'watermark': { name: 'Add Watermark', href: '/tool/add-watermark', icon: <Pen className="w-5 h-5" />, gradient: 'from-amber-500 to-orange-500' },
        'edit': { name: 'Edit PDF', href: '/tool/edit-pdf', icon: <Pen className="w-5 h-5" />, gradient: 'from-indigo-500 to-violet-500' },
        'form': { name: 'Edit PDF', href: '/tool/edit-pdf', icon: <FileText className="w-5 h-5" />, gradient: 'from-teal-500 to-cyan-500' },
        'fill': { name: 'Edit PDF', href: '/tool/edit-pdf', icon: <FileText className="w-5 h-5" />, gradient: 'from-teal-500 to-cyan-500' },
    };

    const slugLower = slug.toLowerCase();
    for (const [key, value] of Object.entries(toolMap)) {
        if (slugLower.includes(key)) {
            return value;
        }
    }

    return null;
};

// Get banner info from slug
const getBlogBanner = (slug: string): { image: string | null; gradient: string; icon: React.ReactNode; label: string } => {
    const bannerMap: Record<string, { image: string | null; gradient: string; icon: React.ReactNode; label: string }> = {
        'merge': { image: '/blog-images/blog-merge-pdf.png', gradient: 'from-orange-400 via-orange-500 to-red-500', icon: <Merge className="w-12 h-12" />, label: 'Merge PDF' },
        'combine': { image: '/blog-images/blog-merge-pdf.png', gradient: 'from-orange-400 via-orange-500 to-red-500', icon: <Merge className="w-12 h-12" />, label: 'Combine PDF' },
        'split': { image: '/blog-images/blog-split-pdf.png', gradient: 'from-purple-400 via-purple-500 to-pink-500', icon: <Scissors className="w-12 h-12" />, label: 'Split PDF' },
        'compress': { image: '/blog-images/blog-compress-pdf.png', gradient: 'from-green-400 via-green-500 to-emerald-500', icon: <FileDown className="w-12 h-12" />, label: 'Compress PDF' },
        'reduce': { image: '/blog-images/blog-compress-pdf.png', gradient: 'from-green-400 via-green-500 to-emerald-500', icon: <FileDown className="w-12 h-12" />, label: 'Compress PDF' },
        'word': { image: '/blog-images/blog-pdf-to-word.png', gradient: 'from-blue-400 via-blue-500 to-indigo-500', icon: <FileType className="w-12 h-12" />, label: 'PDF to Word' },
        'excel': { image: '/blog-images/blog-pdf-to-word.png', gradient: 'from-green-500 via-green-600 to-teal-500', icon: <FileType className="w-12 h-12" />, label: 'PDF to Excel' },
        'jpg': { image: '/blog-images/blog-jpg-to-pdf.png', gradient: 'from-cyan-400 via-cyan-500 to-blue-500', icon: <FileImage className="w-12 h-12" />, label: 'Image PDF' },
        'image': { image: '/blog-images/blog-jpg-to-pdf.png', gradient: 'from-cyan-400 via-cyan-500 to-blue-500', icon: <FileImage className="w-12 h-12" />, label: 'Image PDF' },
        'sign': { image: '/blog-images/blog-sign-pdf.png', gradient: 'from-violet-400 via-violet-500 to-purple-500', icon: <FileSignature className="w-12 h-12" />, label: 'Sign PDF' },
        'protect': { image: '/blog-images/blog-protect-pdf.png', gradient: 'from-red-400 via-red-500 to-rose-500', icon: <Lock className="w-12 h-12" />, label: 'Protect PDF' },
        'password': { image: '/blog-images/blog-protect-pdf.png', gradient: 'from-red-400 via-red-500 to-rose-500', icon: <Lock className="w-12 h-12" />, label: 'Protect PDF' },
        'watermark': { image: '/blog-images/blog-watermark-pdf.png', gradient: 'from-amber-400 via-amber-500 to-orange-500', icon: <Pen className="w-12 h-12" />, label: 'Watermark' },
        'edit': { image: '/blog-images/blog-edit-pdf.png', gradient: 'from-indigo-400 via-indigo-500 to-violet-500', icon: <Pen className="w-12 h-12" />, label: 'Edit PDF' },
        'form': { image: '/blog-images/blog-fill-form.png', gradient: 'from-teal-400 via-teal-500 to-cyan-500', icon: <FileText className="w-12 h-12" />, label: 'PDF Forms' },
        'fill': { image: '/blog-images/blog-fill-form.png', gradient: 'from-teal-400 via-teal-500 to-cyan-500', icon: <FileText className="w-12 h-12" />, label: 'PDF Forms' },
        'best': { image: '/blog-images/blog-best-pdf-editor.png', gradient: 'from-yellow-400 via-yellow-500 to-orange-500', icon: <Sparkles className="w-12 h-12" />, label: 'Best Tools' },
        'vs': { image: '/blog-images/blog-pdf-comparison.png', gradient: 'from-pink-400 via-pink-500 to-rose-500', icon: <TrendingUp className="w-12 h-12" />, label: 'Comparison' },
    };

    const slugLower = slug.toLowerCase();
    for (const [key, value] of Object.entries(bannerMap)) {
        if (slugLower.includes(key)) {
            return value;
        }
    }

    return { image: null, gradient: 'from-primary/80 via-primary to-primary/90', icon: <FileText className="w-12 h-12" />, label: 'PDF Guide' };
};

export default function BlogPostClient({ slug }: { slug: string }) {
    const { toast } = useToast();
    const router = useRouter();

    const post = slug ? getBlogPostBySlug(slug) : undefined;
    const relatedPosts = slug ? getRelatedPosts(slug, 3) : [];
    const relatedTool = slug ? getRelatedTool(slug) : null;
    const banner = slug ? getBlogBanner(slug) : { image: null, gradient: 'from-primary to-primary/80', icon: <FileText className="w-12 h-12" />, label: 'PDF Guide' };

    useEffect(() => {
        if (!post) {
            router.replace('/blog');
        }
    }, [post, router]);

    if (!post) {
        return null;
    }

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: post.title, url });
            } catch { }
        } else {
            await navigator.clipboard.writeText(url);
            toast({ title: "Link copied!", description: "Article link copied to clipboard" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 pb-16">
                <article className="container max-w-4xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        <span>/</span>
                        <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
                    </nav>

                    {/* Hero Banner */}
                    <div className={`relative rounded-3xl overflow-hidden mb-8 min-h-[200px] md:min-h-[260px] flex flex-col justify-end bg-gradient-to-br ${banner.gradient}`}>
                        {banner.image && (
                            <img
                                src={banner.image}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                                style={{ opacity: 0 }}
                                onError={(e) => {
                                    (e.currentTarget.style.display = 'none');
                                }}
                            />
                        )}

                        {/* Background pattern / Glassmorphism effect */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full blur-2xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        <div className="relative z-10 p-8 md:p-12 text-white">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
                                    {banner.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm px-3 py-1">
                                            {categoryLabels[post.category]}
                                        </Badge>
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-white/90 drop-shadow-md">
                                            <Clock className="w-4 h-4" />
                                            {post.readTime} min read
                                        </span>
                                    </div>
                                    <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-2xl">
                                        {post.title}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Tool CTA - at the top */}
                    {relatedTool && (
                        <div className={`mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br ${relatedTool.gradient} p-1`}>
                            <Link
                                href={relatedTool.href}
                                className="flex items-center justify-between p-4 bg-background rounded-xl hover:bg-transparent group transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${relatedTool.gradient} text-white`}>
                                        {relatedTool.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">Try this tool now</p>
                                        <p className="font-heading font-semibold text-foreground group-hover:text-white transition-colors">
                                            {relatedTool.name} — Free & Online
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-primary group-hover:text-white transition-colors">
                                    <span className="hidden sm:inline font-medium">Use Tool</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Article Meta */}
                    <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border mb-8">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            {post.author}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {post.description}
                    </p>

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none 
              prose-headings:font-heading prose-headings:text-foreground prose-headings:scroll-mt-24
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
              prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-ul:my-4 prose-ol:my-4
              prose-li:my-1 prose-li:marker:text-primary
              prose-table:border prose-table:border-border prose-table:rounded-xl prose-table:overflow-hidden prose-table:my-6
              prose-th:bg-secondary prose-th:p-3 prose-th:text-left prose-th:text-foreground prose-th:font-semibold
              prose-td:p-3 prose-td:border-t prose-td:border-border
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-secondary/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              mb-12"
                        dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                    />

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pb-8 border-b border-border">
                        <span className="text-sm text-muted-foreground mr-2">Tags:</span>
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="my-12 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-50">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
                        </div>
                        <div className="relative">
                            <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                                Ready to try these tips?
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Use our free PDF tools to put this knowledge into practice.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {relatedTool ? (
                                    <>
                                        <Button asChild>
                                            <Link href={relatedTool.href}>
                                                {relatedTool.icon}
                                                <span className="ml-2">{relatedTool.name}</span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link href="/">All PDF Tools</Link>
                                        </Button>
                                    </>
                                ) : (
                                    <Button asChild>
                                        <Link href="/">Explore PDF Tools</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <section>
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                                Related Articles
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <BlogCard key={relatedPost.slug} post={relatedPost} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Back to Blog */}
                    <div className="mt-12 text-center">
                        <Button variant="outline" asChild>
                            <Link href="/blog">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to All Articles
                            </Link>
                        </Button>
                    </div>
                </article>
            </main>
        </div>
    );
}

function formatContent(content: string): string {
    // 1. Normalize line endings and whitespace
    let formatted = content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim();

    // 2. Headings (ensure proper spacing and ID generation)
    formatted = formatted
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">$1</h3>')
        .replace(/^## (.*$)/gm, (match, title) => {
            const id = title.toLowerCase().replace(/[^\w]+/g, '-');
            return `<h2 id="${id}" class="text-2xl font-bold mt-12 mb-6 pb-2 border-b border-border scroll-mt-24">${title}</h2>`;
        });

    // 3. Bold, Italic, Code (inline styles)
    formatted = formatted
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>');

    // 4. Code Blocks
    formatted = formatted
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-secondary/50 border border-border rounded-xl p-4 my-6 overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>');

    // 5. Lists (Handle both bullet and numbered lists robustly)
    formatted = formatted
        // Checkmark lists
        .replace(/^- ✅ (.*$)/gm, '<li class="flex items-start gap-3 my-2"><span class="text-green-500 mt-1 shrink-0">✅</span><span>$1</span></li>')
        .replace(/^- ❌ (.*$)/gm, '<li class="flex items-start gap-3 my-2"><span class="text-red-500 mt-1 shrink-0">❌</span><span>$1</span></li>')
        // Standard bullets
        .replace(/^- (.*$)/gm, '<li class="flex items-start gap-2 my-1"><span class="text-primary mt-1.5 shrink-0">•</span><span>$1</span></li>')
        // Numbered lists
        .replace(/^(\d+)\. (.*$)/gm, '<li class="flex items-start gap-2 my-1"><span class="font-bold text-primary shrink-0">$1.</span><span>$2</span></li>');

    // Group adjacent list items into ul/ol
    formatted = formatted.replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-6 space-y-2 pl-2">$&</ul>');

    // 6. Tables
    formatted = formatted.replace(/^\|(.+)\|$/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim().length > 0);
        if (cells.some(c => c.includes('---'))) return ''; // Skip separator lines

        const tag = 'td';
        const rowContent = cells.map(c => `<${tag} class="p-4 border-b border-border align-top">${c.trim()}</${tag}>`).join('');
        return `<tr class="hover:bg-secondary/20 transition-colors">${rowContent}</tr>`;
    });

    // Wrap table rows
    formatted = formatted.replace(/(<tr.*<\/tr>\n?)+/g, '<div class="my-8 overflow-x-auto rounded-xl border border-border"><table class="w-full text-sm text-left"><tbody>$&</tbody></table></div>');

    // 7. Paragraphs (Wrap remaining text runs in <p>)
    const chunks = formatted.split('\n\n');
    formatted = chunks.map(chunk => {
        if (chunk.trim().match(/^<(h2|h3|ul|div|pre|blockquote)/)) {
            return chunk;
        }
        return `<p class="leading-relaxed text-muted-foreground mb-6">${chunk.trim()}</p>`;
    }).join('\n');

    // 8. Clean up empty paragraphs or extra whitespace
    formatted = formatted.replace(/<p>\s*<\/p>/g, '');

    return formatted;
}

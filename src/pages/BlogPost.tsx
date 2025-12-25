import { useParams, Link, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogSEO } from "@/components/blog/BlogSEO";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const relatedPosts = slug ? getRelatedPosts(slug, 3) : [];

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Article link copied to clipboard" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogSEO post={post} />
      <Header />
      
      <main className="pt-24 pb-16">
        <article className="container max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground truncate">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className={categoryColors[post.category]}>
                {categoryLabels[post.category]}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
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
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none 
              prose-headings:font-heading prose-headings:text-foreground 
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-code:bg-secondary prose-code:px-1 prose-code:rounded
              prose-pre:bg-secondary prose-pre:border prose-pre:border-border
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:marker:text-primary
              prose-table:border prose-table:border-border
              prose-th:bg-secondary prose-th:p-3 prose-th:text-left prose-th:text-foreground
              prose-td:p-3 prose-td:border-t prose-td:border-border
              mb-12"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pb-8 border-b border-border">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* CTA */}
          <div className="my-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">
              Ready to try these tips?
            </h3>
            <p className="text-muted-foreground mb-4">
              Use our free PDF tools to put this knowledge into practice.
            </p>
            <Button asChild>
              <Link to="/">Explore PDF Tools</Link>
            </Button>
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
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Articles
              </Link>
            </Button>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}

function formatContent(content: string): string {
  // Convert markdown-style content to HTML
  return content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([^`]+)```/gs, '<pre><code>$1</code></pre>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.some(c => c.includes('---'))) return '';
      const isHeader = cells[0].trim().match(/^[A-Z]/);
      const tag = isHeader ? 'th' : 'td';
      const row = cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('');
      return `<tr>${row}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, '<table><tbody>$&</tbody></table>');
}

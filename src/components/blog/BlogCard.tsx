import { Link } from "react-router-dom";
import { Clock, ArrowRight, FileText, Merge, Scissors, FileDown, FileType, FileImage, Lock, Pen, FileSignature, Sparkles, TrendingUp } from "lucide-react";
import { BlogPost } from "@/data/blogPosts";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const categoryColors = {
  'how-to': 'bg-primary/10 text-primary border-primary/20',
  'tips': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'industry': 'bg-blue-500/10 text-blue-600 border-blue-500/20'
};

const categoryLabels = {
  'how-to': 'How-To Guide',
  'tips': 'Tips & Tricks',
  'industry': 'Industry Guide'
};

// Map blog slugs to banner images and fallback icons
const getBlogBanner = (slug: string): { image: string | null; icon: React.ReactNode; gradient: string; label: string } => {
  const bannerMap: Record<string, { image: string | null; icon: React.ReactNode; gradient: string; label: string }> = {
    'merge': { image: '/blog-images/blog-merge-pdf.png', icon: <Merge className="w-8 h-8" />, gradient: 'from-orange-400 via-orange-500 to-red-500', label: 'Merge PDF' },
    'combine': { image: '/blog-images/blog-merge-pdf.png', icon: <Merge className="w-8 h-8" />, gradient: 'from-orange-400 via-orange-500 to-red-500', label: 'Combine PDF' },
    'split': { image: '/blog-images/blog-split-pdf.png', icon: <Scissors className="w-8 h-8" />, gradient: 'from-purple-400 via-purple-500 to-pink-500', label: 'Split PDF' },
    'compress': { image: '/blog-images/blog-compress-pdf.png', icon: <FileDown className="w-8 h-8" />, gradient: 'from-green-400 via-green-500 to-emerald-500', label: 'Compress PDF' },
    'reduce': { image: '/blog-images/blog-compress-pdf.png', icon: <FileDown className="w-8 h-8" />, gradient: 'from-green-400 via-green-500 to-emerald-500', label: 'Compress PDF' },
    'word': { image: '/blog-images/blog-pdf-to-word.png', icon: <FileType className="w-8 h-8" />, gradient: 'from-blue-400 via-blue-500 to-indigo-500', label: 'PDF to Word' },
    'excel': { image: '/blog-images/blog-pdf-to-word.png', icon: <FileType className="w-8 h-8" />, gradient: 'from-green-500 via-green-600 to-teal-500', label: 'PDF to Excel' },
    'jpg': { image: '/blog-images/blog-jpg-to-pdf.png', icon: <FileImage className="w-8 h-8" />, gradient: 'from-cyan-400 via-cyan-500 to-blue-500', label: 'Image PDF' },
    'image': { image: '/blog-images/blog-jpg-to-pdf.png', icon: <FileImage className="w-8 h-8" />, gradient: 'from-cyan-400 via-cyan-500 to-blue-500', label: 'Image PDF' },
    'sign': { image: '/blog-images/blog-sign-pdf.png', icon: <FileSignature className="w-8 h-8" />, gradient: 'from-violet-400 via-violet-500 to-purple-500', label: 'Sign PDF' },
    'protect': { image: '/blog-images/blog-protect-pdf.png', icon: <Lock className="w-8 h-8" />, gradient: 'from-red-400 via-red-500 to-rose-500', label: 'Protect PDF' },
    'password': { image: '/blog-images/blog-protect-pdf.png', icon: <Lock className="w-8 h-8" />, gradient: 'from-red-400 via-red-500 to-rose-500', label: 'Protect PDF' },
    'watermark': { image: '/blog-images/blog-watermark-pdf.png', icon: <Pen className="w-8 h-8" />, gradient: 'from-amber-400 via-amber-500 to-orange-500', label: 'Watermark' },
    'edit': { image: '/blog-images/blog-edit-pdf.png', icon: <Pen className="w-8 h-8" />, gradient: 'from-indigo-400 via-indigo-500 to-violet-500', label: 'Edit PDF' },
    'form': { image: '/blog-images/blog-fill-form.png', icon: <FileText className="w-8 h-8" />, gradient: 'from-teal-400 via-teal-500 to-cyan-500', label: 'PDF Forms' },
    'fill': { image: '/blog-images/blog-fill-form.png', icon: <FileText className="w-8 h-8" />, gradient: 'from-teal-400 via-teal-500 to-cyan-500', label: 'PDF Forms' },
    'best': { image: '/blog-images/blog-best-pdf-editor.png', icon: <Sparkles className="w-8 h-8" />, gradient: 'from-yellow-400 via-yellow-500 to-orange-500', label: 'Best Tools' },
    'comparison': { image: '/blog-images/blog-pdf-comparison.png', icon: <TrendingUp className="w-8 h-8" />, gradient: 'from-pink-400 via-pink-500 to-rose-500', label: 'Comparison' },
    'vs': { image: '/blog-images/blog-pdf-comparison.png', icon: <TrendingUp className="w-8 h-8" />, gradient: 'from-pink-400 via-pink-500 to-rose-500', label: 'Comparison' },
  };

  const slugLower = slug.toLowerCase();
  for (const [key, value] of Object.entries(bannerMap)) {
    if (slugLower.includes(key)) {
      return value;
    }
  }

  // Default
  return { image: null, icon: <FileText className="w-8 h-8" />, gradient: 'from-primary/80 via-primary to-primary/90', label: 'PDF Guide' };
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const banner = getBlogBanner(post.slug);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 ${featured ? 'md:scale-[1.02]' : ''}`}
    >
      {/* Banner Image or Gradient */}
      <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${banner.gradient}`}>
        {banner.image ? (
          <>
            <img
              src={banner.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                // If image fails to load, hide it to show gradient
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
          </>
        ) : null}

        {/* Floating Icons/Patterns for all (even with images) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-xl" />
        </div>

        {/* Centered Icon and Label (Always show if no image or as overlay) */}
        {!banner.image && (
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {banner.icon}
            </div>
            <span className="text-sm font-medium opacity-90">{banner.label}</span>
          </div>
        )}

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-primary text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="outline" className={`${categoryColors[post.category]} text-xs`}>
            {categoryLabels[post.category]}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} min
          </span>
        </div>

        <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          Read Article
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

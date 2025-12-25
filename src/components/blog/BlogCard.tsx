import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/data/blogPosts";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

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

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <img 
          src="/favicon.png" 
          alt={post.title}
          className="w-16 h-16 opacity-50 group-hover:opacity-70 transition-opacity"
          loading="lazy"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="secondary" className={categoryColors[post.category]}>
            {categoryLabels[post.category]}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime} min read
          </span>
        </div>
        
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {post.description}
        </p>
        
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          Read More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

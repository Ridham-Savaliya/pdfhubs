import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  delay?: number;
}

export function ToolCard({ title, description, icon: Icon, href, color, delay = 0 }: ToolCardProps) {
  return (
    <Link
      to={href}
      className="group block animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-full p-6 rounded-2xl bg-card border border-border shadow-sm transition-all duration-500 ease-out-expo hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-2 overflow-hidden">
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon container */}
        <div className="relative">
          <div
            className={cn(
              "mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 ease-out-expo group-hover:scale-110 group-hover:shadow-lg",
              color
            )}
          >
            <Icon className="h-7 w-7 text-primary-foreground transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
            {title}
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
}

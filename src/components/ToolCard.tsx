import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
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
      className="group animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-full p-6 rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-1">
        <div
          className={cn(
            "mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            color
          )}
        >
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
        
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}

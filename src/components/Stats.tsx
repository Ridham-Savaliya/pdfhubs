import { Users, FileText, Globe, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "2M+",
    label: "Happy Users",
    description: "Trust our tools daily",
  },
  {
    icon: FileText,
    value: "50M+",
    label: "PDFs Processed",
    description: "And counting every day",
  },
  {
    icon: Globe,
    value: "190+",
    label: "Countries",
    description: "Worldwide coverage",
  },
  {
    icon: Star,
    value: "4.9",
    label: "User Rating",
    description: "Based on 10K+ reviews",
  },
];

export function Stats() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/30 border-y border-border/50">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                <stat.icon className="h-6 w-6" />
              </div>
              
              <div className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                {stat.value}
              </div>
              
              <div className="mt-1 text-base font-semibold text-foreground">
                {stat.label}
              </div>
              
              <div className="mt-0.5 text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

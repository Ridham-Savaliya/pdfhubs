const stats = [
  { value: "50M+", label: "PDFs Processed" },
  { value: "10M+", label: "Happy Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "25+", label: "PDF Tools" },
];

export function Stats() {
  return (
    <section className="py-16 border-y border-border bg-background">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="font-heading text-4xl font-bold text-primary md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

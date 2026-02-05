import { Shield, Zap, Globe, Lock, Infinity, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process PDFs in seconds with our optimized algorithms. No waiting, no queues.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Files are processed locally in your browser. Your data never leaves your device.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Use on any device with a browser. Desktop, tablet, or mobile — it just works.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "No data collection, no tracking. Your PDFs are yours and yours alone.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Infinity,
    title: "Unlimited Usage",
    description: "No file limits, no daily caps. Process as many PDFs as you need, free forever.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Sparkles,
    title: "Pro Features Free",
    description: "Access premium tools that others charge for. OCR, compression, batch processing.",
    gradient: "from-primary to-primary-glow",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      <div className="container relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6 animate-fade-up">
            <Sparkles className="h-4 w-4" />
            <span>Why choose PDFHubs</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-up" style={{ animationDelay: "100ms" }}>
            Built for Speed, Privacy & Power
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
            Everything you need to handle PDFs like a pro, without the complexity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="mt-6 font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

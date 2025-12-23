import { Shield, Zap, Globe, Cloud } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your files are encrypted and automatically deleted after processing. We never store your documents.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process your PDFs in seconds with our optimized servers. No waiting, no hassle.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Access our tools from any device, any browser. No installation needed.",
  },
  {
    icon: Cloud,
    title: "Cloud Based",
    description: "All processing happens in the cloud. Save your device resources.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Why choose PDFTools?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            The most complete online PDF solution trusted by millions worldwide.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

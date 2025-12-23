import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ToolsGrid } from "@/components/ToolsGrid";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ToolsGrid />
        <Stats />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

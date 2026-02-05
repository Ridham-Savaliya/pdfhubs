"use client";

import { Header } from "@/components/Header";
import { DynamicHero } from "@/components/DynamicHero";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ToolsGrid } from "@/components/ToolsGrid";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Footer } from "@/components/Footer";
import { HomeFAQ } from "@/components/HomeFAQ";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <DynamicHero />
        <ToolsGrid />
        <Stats />
        <Features />
        <HomeFAQ />
      </main>
      <Footer />
    </div>
  );
}

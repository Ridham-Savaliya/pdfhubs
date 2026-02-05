import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageNavigatorProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PageNavigator({
  pdfDoc,
  currentPage,
  totalPages,
  onPageChange,
}: PageNavigatorProps) {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateThumbnails = async () => {
      if (!pdfDoc) return;

      setIsLoading(true);
      const thumbs: string[] = [];

      for (let i = 1; i <= totalPages; i++) {
        try {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 0.2 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          } as unknown as any).promise;

          thumbs.push(canvas.toDataURL("image/jpeg", 0.7));
        } catch (error) {
          console.error(`Error generating thumbnail for page ${i}:`, error);
          thumbs.push("");
        }
      }

      setThumbnails(thumbs);
      setIsLoading(false);
    };

    generateThumbnails();
  }, [pdfDoc, totalPages]);

  const scrollToPage = (direction: "up" | "down") => {
    if (direction === "up" && currentPage > 1) {
      onPageChange(currentPage - 1);
    } else if (direction === "down" && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-24">
      <Button
        variant="outline"
        size="sm"
        onClick={() => scrollToPage("up")}
        disabled={currentPage === 1}
        className="w-full"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      <div
        ref={scrollRef}
        className="flex flex-col gap-2 overflow-y-auto max-h-[400px] scrollbar-thin"
      >
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
              <div
                key={i}
                className="w-full aspect-[3/4] bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          thumbnails.map((thumb, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={cn(
                "relative w-full aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all hover:border-primary/50",
                currentPage === index + 1
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border"
              )}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt={`Page ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-xs py-0.5 text-center font-medium">
                {index + 1}
              </div>
            </button>
          ))
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => scrollToPage("down")}
        disabled={currentPage === totalPages}
        className="w-full"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      <div className="text-center text-xs text-muted-foreground">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
}

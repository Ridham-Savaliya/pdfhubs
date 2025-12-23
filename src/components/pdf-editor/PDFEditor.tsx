import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { EditorToolbar } from "./EditorToolbar";
import { EditorCanvas } from "./EditorCanvas";
import { TextEditor } from "./TextEditor";
import { ImageUploader } from "./ImageUploader";
import { PageNavigator } from "./PageNavigator";
import { Download, Loader2, ZoomIn, ZoomOut } from "lucide-react";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

export type EditorTool = "select" | "text" | "draw" | "highlight" | "image" | "erase";

export interface TextAnnotation {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
  fontFamily?: string;
}

export interface DrawAnnotation {
  id: string;
  page: number;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  type: "pen" | "highlight";
}

export interface ImageAnnotation {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

interface PDFEditorProps {
  file: File;
  onSave?: (blob: Blob) => void;
}

const fontMap: Record<string, typeof StandardFonts[keyof typeof StandardFonts]> = {
  "Helvetica": StandardFonts.Helvetica,
  "Times-Roman": StandardFonts.TimesRoman,
  "Courier": StandardFonts.Courier,
  "Arial": StandardFonts.Helvetica,
  "Georgia": StandardFonts.TimesRoman,
  "Verdana": StandardFonts.Helvetica,
};

export function PDFEditor({ file, onSave }: PDFEditorProps) {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<EditorTool>("select");
  const [activeColor, setActiveColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [fontSize, setFontSize] = useState(16);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Annotations state
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);
  const [drawAnnotations, setDrawAnnotations] = useState<DrawAnnotation[]>([]);
  const [imageAnnotations, setImageAnnotations] = useState<ImageAnnotation[]>([]);
  
  // Text editing state
  const [editingText, setEditingText] = useState<TextAnnotation | null>(null);
  const [showImageUploader, setShowImageUploader] = useState(false);

  // Load PDF
  useEffect(() => {
    const loadPDF = async () => {
      setIsLoading(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        toast.success(`PDF loaded: ${pdf.numPages} pages`);
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.error("Failed to load PDF");
      } finally {
        setIsLoading(false);
      }
    };
    loadPDF();
  }, [file]);

  const handleAddText = useCallback((x: number, y: number) => {
    const newText: TextAnnotation = {
      id: `text-${Date.now()}`,
      page: currentPage,
      x,
      y,
      text: "Click to edit",
      fontSize,
      color: activeColor,
      fontWeight: "normal",
      fontFamily: "Helvetica",
    };
    setTextAnnotations((prev) => [...prev, newText]);
    setEditingText(newText);
    // Switch to select tool after adding text
    setActiveTool("select");
  }, [currentPage, fontSize, activeColor]);

  const handleUpdateText = useCallback((id: string, updates: Partial<TextAnnotation>) => {
    setTextAnnotations((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    if (editingText?.id === id) {
      setEditingText((prev) => prev ? { ...prev, ...updates } : null);
    }
  }, [editingText]);

  const handleDeleteAnnotation = useCallback((id: string, type: "text" | "draw" | "image") => {
    if (type === "text") {
      setTextAnnotations((prev) => prev.filter((t) => t.id !== id));
      if (editingText?.id === id) setEditingText(null);
    } else if (type === "draw") {
      setDrawAnnotations((prev) => prev.filter((d) => d.id !== id));
    } else {
      setImageAnnotations((prev) => prev.filter((i) => i.id !== id));
    }
  }, [editingText]);

  const handleAddDrawing = useCallback((points: { x: number; y: number }[]) => {
    const newDraw: DrawAnnotation = {
      id: `draw-${Date.now()}`,
      page: currentPage,
      points,
      color: activeColor,
      width: brushSize,
      type: activeTool === "highlight" ? "highlight" : "pen",
    };
    setDrawAnnotations((prev) => [...prev, newDraw]);
  }, [currentPage, activeColor, brushSize, activeTool]);

  const handleAddImage = useCallback((dataUrl: string, width: number, height: number) => {
    const newImage: ImageAnnotation = {
      id: `image-${Date.now()}`,
      page: currentPage,
      x: 50,
      y: 50,
      width: Math.min(width, 200),
      height: Math.min(height, 200),
      dataUrl,
    };
    setImageAnnotations((prev) => [...prev, newImage]);
    setShowImageUploader(false);
    setActiveTool("select");
    toast.success("Image added! Drag to reposition.");
  }, [currentPage]);

  const handleUpdateImage = useCallback((id: string, updates: Partial<ImageAnnotation>) => {
    setImageAnnotations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  }, []);

  const handleEditText = useCallback((annotation: TextAnnotation | null) => {
    // Only set editing text, don't create new annotations
    setEditingText(annotation);
  }, []);

  const handleSave = async () => {
    if (!pdfDoc) return;
    
    setIsSaving(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfLibDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfLibDoc.getPages();
      
      // Add text annotations
      for (const annotation of textAnnotations) {
        const page = pages[annotation.page - 1];
        if (!page) continue;
        
        const { height } = page.getSize();
        const color = hexToRgb(annotation.color);
        
        // Get the appropriate font
        const fontKey = fontMap[annotation.fontFamily || "Helvetica"] || StandardFonts.Helvetica;
        const font = await pdfLibDoc.embedFont(
          annotation.fontWeight === "bold" 
            ? (fontKey === StandardFonts.Helvetica ? StandardFonts.HelveticaBold :
               fontKey === StandardFonts.TimesRoman ? StandardFonts.TimesRomanBold :
               StandardFonts.CourierBold)
            : fontKey
        );
        
        page.drawText(annotation.text, {
          x: annotation.x,
          y: height - annotation.y - annotation.fontSize,
          size: annotation.fontSize,
          font,
          color: rgb(color.r, color.g, color.b),
        });
      }
      
      // Add draw annotations
      for (const annotation of drawAnnotations) {
        const page = pages[annotation.page - 1];
        if (!page || annotation.points.length < 2) continue;
        
        const { height } = page.getSize();
        const color = hexToRgb(annotation.color);
        const opacity = annotation.type === "highlight" ? 0.3 : 1;
        
        for (let i = 1; i < annotation.points.length; i++) {
          const prev = annotation.points[i - 1];
          const curr = annotation.points[i];
          
          page.drawLine({
            start: { x: prev.x, y: height - prev.y },
            end: { x: curr.x, y: height - curr.y },
            thickness: annotation.width,
            color: rgb(color.r, color.g, color.b),
            opacity,
          });
        }
      }
      
      // Add image annotations
      for (const annotation of imageAnnotations) {
        const page = pages[annotation.page - 1];
        if (!page) continue;
        
        const { height } = page.getSize();
        
        // Convert data URL to bytes
        const base64Data = annotation.dataUrl.split(",")[1];
        const binaryString = atob(base64Data);
        const imageBytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          imageBytes[i] = binaryString.charCodeAt(i);
        }
        
        let image;
        if (annotation.dataUrl.includes("image/png")) {
          image = await pdfLibDoc.embedPng(imageBytes);
        } else {
          image = await pdfLibDoc.embedJpg(imageBytes);
        }
        
        page.drawImage(image, {
          x: annotation.x,
          y: height - annotation.y - annotation.height,
          width: annotation.width,
          height: annotation.height,
        });
      }
      
      const pdfBytes = await pdfLibDoc.save();
      const pdfBuffer = new ArrayBuffer(pdfBytes.length);
      const pdfView = new Uint8Array(pdfBuffer);
      pdfView.set(pdfBytes);
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      
      if (onSave) {
        onSave(blob);
      } else {
        // Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `edited-${file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast.success("PDF saved successfully!");
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.error("Failed to save PDF");
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      if (direction === "in") return Math.min(prev + 0.25, 3);
      return Math.max(prev - 0.25, 0.5);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/30 rounded-xl border border-border">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
        <EditorToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          activeColor={activeColor}
          onColorChange={setActiveColor}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          onImageClick={() => setShowImageUploader(true)}
        />
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom("out")}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom("in")}
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save PDF"}
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex gap-4">
        {/* Page navigator */}
        <PageNavigator
          pdfDoc={pdfDoc}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        
        {/* Canvas area */}
        <div className="flex-1 overflow-auto bg-muted/30 rounded-xl border border-border p-4">
          {pdfDoc && (
            <EditorCanvas
              pdfDoc={pdfDoc}
              currentPage={currentPage}
              zoom={zoom}
              activeTool={activeTool}
              activeColor={activeColor}
              brushSize={brushSize}
              textAnnotations={textAnnotations.filter((t) => t.page === currentPage)}
              drawAnnotations={drawAnnotations.filter((d) => d.page === currentPage)}
              imageAnnotations={imageAnnotations.filter((i) => i.page === currentPage)}
              onAddText={handleAddText}
              onAddDrawing={handleAddDrawing}
              onUpdateText={handleUpdateText}
              onUpdateImage={handleUpdateImage}
              onDeleteAnnotation={handleDeleteAnnotation}
              editingText={editingText}
              onEditText={handleEditText}
            />
          )}
        </div>
      </div>

      {/* Text editor modal */}
      {editingText && (
        <TextEditor
          annotation={editingText}
          onUpdate={(updates) => handleUpdateText(editingText.id, updates)}
          onClose={() => setEditingText(null)}
          onDelete={() => handleDeleteAnnotation(editingText.id, "text")}
        />
      )}

      {/* Image uploader modal */}
      {showImageUploader && (
        <ImageUploader
          onUpload={handleAddImage}
          onClose={() => setShowImageUploader(false)}
        />
      )}
    </div>
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
}

import { useRef, useEffect, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { EditorTool, TextAnnotation, DrawAnnotation, ImageAnnotation } from "./PDFEditor";

interface EditorCanvasProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  currentPage: number;
  zoom: number;
  activeTool: EditorTool;
  activeColor: string;
  brushSize: number;
  textAnnotations: TextAnnotation[];
  drawAnnotations: DrawAnnotation[];
  imageAnnotations: ImageAnnotation[];
  onAddText: (x: number, y: number) => void;
  onAddDrawing: (points: { x: number; y: number }[]) => void;
  onUpdateText: (id: string, updates: Partial<TextAnnotation>) => void;
  onUpdateImage: (id: string, updates: Partial<ImageAnnotation>) => void;
  onDeleteAnnotation: (id: string, type: "text" | "draw" | "image") => void;
  editingText: TextAnnotation | null;
  onEditText: (annotation: TextAnnotation | null) => void;
}

const fontFamilyMap: Record<string, string> = {
  "Helvetica": "Helvetica, Arial, sans-serif",
  "Times-Roman": "Times New Roman, Times, serif",
  "Courier": "Courier New, Courier, monospace",
  "Arial": "Arial, Helvetica, sans-serif",
  "Georgia": "Georgia, Times New Roman, serif",
  "Verdana": "Verdana, Geneva, sans-serif",
};

export function EditorCanvas({
  pdfDoc,
  currentPage,
  zoom,
  activeTool,
  activeColor,
  brushSize,
  textAnnotations,
  drawAnnotations,
  imageAnnotations,
  onAddText,
  onAddDrawing,
  onUpdateText,
  onUpdateImage,
  onDeleteAnnotation,
  editingText,
  onEditText,
}: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [draggingImage, setDraggingImage] = useState<string | null>(null);
  const [draggingText, setDraggingText] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Render PDF page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !pdfCanvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: zoom * 1.5 });

        const canvas = pdfCanvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setCanvasSize({ width: viewport.width, height: viewport.height });

        await page.render({
          canvasContext: context,
          viewport: viewport,
        } as unknown as any).promise;

        // Sync draw canvas size
        if (drawCanvasRef.current) {
          drawCanvasRef.current.width = viewport.width;
          drawCanvasRef.current.height = viewport.height;
        }
      } catch (error) {
        console.error("Error rendering page:", error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, zoom]);

  // Draw existing annotations
  useEffect(() => {
    if (!drawCanvasRef.current) return;

    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all draw annotations
    for (const annotation of drawAnnotations) {
      if (annotation.points.length < 2) continue;

      ctx.beginPath();
      ctx.strokeStyle = annotation.color;
      ctx.lineWidth = annotation.width * zoom * 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (annotation.type === "highlight") {
        ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1;
      }

      const scaledPoints = annotation.points.map((p) => ({
        x: p.x * zoom * 1.5,
        y: p.y * zoom * 1.5,
      }));

      ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
      for (let i = 1; i < scaledPoints.length; i++) {
        ctx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw current path
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize * zoom * 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (activeTool === "highlight") {
        ctx.globalAlpha = 0.3;
      }

      ctx.moveTo(currentPath[0].x * zoom * 1.5, currentPath[0].y * zoom * 1.5);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x * zoom * 1.5, currentPath[i].y * zoom * 1.5);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }, [drawAnnotations, currentPath, activeColor, brushSize, zoom, activeTool]);

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent): { x: number; y: number } => {
      const canvas = pdfCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / (zoom * 1.5),
        y: (e.clientY - rect.top) / (zoom * 1.5),
      };
    },
    [zoom]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);

    if (activeTool === "text") {
      // Only add new text when in text mode
      onAddText(coords.x, coords.y);
    } else if (activeTool === "draw" || activeTool === "highlight") {
      setIsDrawing(true);
      setCurrentPath([coords]);
    } else if (activeTool === "select") {
      // Check if clicking on an image
      for (const img of imageAnnotations) {
        if (
          coords.x >= img.x &&
          coords.x <= img.x + img.width &&
          coords.y >= img.y &&
          coords.y <= img.y + img.height
        ) {
          setDraggingImage(img.id);
          setDragOffset({ x: coords.x - img.x, y: coords.y - img.y });
          return;
        }
      }

      // Check if clicking on text for dragging
      for (const text of textAnnotations) {
        const textWidth = text.text.length * text.fontSize * 0.6;
        if (
          coords.x >= text.x &&
          coords.x <= text.x + textWidth &&
          coords.y >= text.y &&
          coords.y <= text.y + text.fontSize
        ) {
          setDraggingText(text.id);
          setDragOffset({ x: coords.x - text.x, y: coords.y - text.y });
          return;
        }
      }
    } else if (activeTool === "erase") {
      // Check if erasing a drawing
      for (const draw of drawAnnotations) {
        for (const point of draw.points) {
          const distance = Math.sqrt(
            Math.pow(coords.x - point.x, 2) + Math.pow(coords.y - point.y, 2)
          );
          if (distance < 20) {
            onDeleteAnnotation(draw.id, "draw");
            return;
          }
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);

    if (isDrawing && (activeTool === "draw" || activeTool === "highlight")) {
      setCurrentPath((prev) => [...prev, coords]);
    } else if (draggingImage) {
      onUpdateImage(draggingImage, {
        x: coords.x - dragOffset.x,
        y: coords.y - dragOffset.y,
      });
    } else if (draggingText) {
      onUpdateText(draggingText, {
        x: coords.x - dragOffset.x,
        y: coords.y - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath.length > 1) {
      onAddDrawing(currentPath);
    }
    setIsDrawing(false);
    setCurrentPath([]);
    setDraggingImage(null);
    setDraggingText(null);
  };

  const handleTextDoubleClick = (e: React.MouseEvent, annotation: TextAnnotation) => {
    e.stopPropagation();
    e.preventDefault();
    // Open editor on double click
    onEditText(annotation);
  };

  const getCursor = () => {
    switch (activeTool) {
      case "text":
        return "text";
      case "draw":
      case "highlight":
        return "crosshair";
      case "erase":
        return "pointer";
      case "image":
        return "copy";
      default:
        return "default";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block mx-auto"
      style={{ cursor: getCursor() }}
    >
      {/* PDF layer */}
      <canvas
        ref={pdfCanvasRef}
        className="rounded-lg shadow-lg"
      />

      {/* Drawing layer */}
      <canvas
        ref={drawCanvasRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />

      {/* Interactive layer */}
      <div
        className="absolute top-0 left-0"
        style={{ width: canvasSize.width, height: canvasSize.height }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Text annotations */}
        {textAnnotations.map((annotation) => (
          <div
            key={annotation.id}
            className={`absolute select-none ${editingText?.id === annotation.id
                ? "ring-2 ring-primary rounded"
                : draggingText === annotation.id
                  ? "ring-2 ring-primary/50 rounded cursor-grabbing"
                  : "hover:ring-1 hover:ring-primary/50 rounded cursor-grab"
              }`}
            style={{
              left: annotation.x * zoom * 1.5,
              top: annotation.y * zoom * 1.5,
              fontSize: annotation.fontSize * zoom * 1.5,
              color: annotation.color,
              fontWeight: annotation.fontWeight,
              fontFamily: fontFamilyMap[annotation.fontFamily || "Helvetica"],
              cursor: activeTool === "select" ? (draggingText === annotation.id ? "grabbing" : "grab") : "default",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
            onDoubleClick={(e) => handleTextDoubleClick(e, annotation)}
          >
            {annotation.text}
          </div>
        ))}

        {/* Image annotations */}
        {imageAnnotations.map((annotation) => (
          <img
            key={annotation.id}
            src={annotation.dataUrl}
            alt="Annotation"
            className={`absolute ${draggingImage === annotation.id ? "ring-2 ring-primary" : ""
              } ${activeTool === "select" ? "cursor-move" : ""}`}
            style={{
              left: annotation.x * zoom * 1.5,
              top: annotation.y * zoom * 1.5,
              width: annotation.width * zoom * 1.5,
              height: annotation.height * zoom * 1.5,
            }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  MousePointer2,
  Type,
  Pencil,
  Highlighter,
  Image,
  Eraser,
  Palette,
} from "lucide-react";
import { EditorTool } from "./PDFEditor";

interface EditorToolbarProps {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onImageClick: () => void;
}

const tools: { id: EditorTool; icon: React.ReactNode; label: string }[] = [
  { id: "select", icon: <MousePointer2 className="h-4 w-4" />, label: "Select" },
  { id: "text", icon: <Type className="h-4 w-4" />, label: "Text" },
  { id: "draw", icon: <Pencil className="h-4 w-4" />, label: "Draw" },
  { id: "highlight", icon: <Highlighter className="h-4 w-4" />, label: "Highlight" },
  { id: "image", icon: <Image className="h-4 w-4" />, label: "Image" },
  { id: "erase", icon: <Eraser className="h-4 w-4" />, label: "Erase" },
];

const colors = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FF6600",
  "#9900FF",
  "#666666",
];

export function EditorToolbar({
  activeTool,
  onToolChange,
  activeColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  fontSize,
  onFontSizeChange,
  onImageClick,
}: EditorToolbarProps) {
  const handleToolClick = (tool: EditorTool) => {
    if (tool === "image") {
      onImageClick();
    } else {
      onToolChange(tool);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Tool buttons */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => handleToolClick(tool.id)}
            className={
              activeTool === tool.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-background"
            }
            title={tool.label}
          >
            {tool.icon}
          </Button>
        ))}
      </div>

      <div className="h-6 w-px bg-border" />

      {/* Color picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <div
              className="h-4 w-4 rounded border border-border"
              style={{ backgroundColor: activeColor }}
            />
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    activeColor === color
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Custom:</Label>
              <input
                type="color"
                value={activeColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="h-8 w-16 cursor-pointer rounded border-0"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Brush size (for draw/highlight) */}
      {(activeTool === "draw" || activeTool === "highlight") && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Size: {brushSize}px
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium">Brush Size</Label>
              <Slider
                value={[brushSize]}
                onValueChange={([value]) => onBrushSizeChange(value)}
                min={1}
                max={20}
                step={1}
              />
              <span className="text-xs text-muted-foreground text-center">
                {brushSize}px
              </span>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Font size (for text) */}
      {activeTool === "text" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Font: {fontSize}px
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium">Font Size</Label>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => onFontSizeChange(value)}
                min={8}
                max={72}
                step={2}
              />
              <span className="text-xs text-muted-foreground text-center">
                {fontSize}px
              </span>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

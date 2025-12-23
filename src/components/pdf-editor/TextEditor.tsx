import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X, Trash2, Bold } from "lucide-react";
import { TextAnnotation } from "./PDFEditor";

interface TextEditorProps {
  annotation: TextAnnotation;
  onUpdate: (updates: Partial<TextAnnotation>) => void;
  onClose: () => void;
  onDelete: () => void;
}

const colors = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FF6600",
];

export function TextEditor({ annotation, onUpdate, onClose, onDelete }: TextEditorProps) {
  const [text, setText] = useState(annotation.text);

  const handleTextChange = (value: string) => {
    setText(value);
    onUpdate({ text: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-xl border border-border shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">Edit Text</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Text input */}
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Input
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter text..."
              autoFocus
            />
          </div>

          {/* Font size */}
          <div className="space-y-2">
            <Label>Font Size: {annotation.fontSize}px</Label>
            <Slider
              value={[annotation.fontSize]}
              onValueChange={([value]) => onUpdate({ fontSize: value })}
              min={8}
              max={72}
              step={2}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    annotation.color === color
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdate({ color })}
                />
              ))}
              <input
                type="color"
                value={annotation.color}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded border-0"
              />
            </div>
          </div>

          {/* Font weight */}
          <div className="space-y-2">
            <Label>Style</Label>
            <Button
              variant={annotation.fontWeight === "bold" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onUpdate({
                  fontWeight: annotation.fontWeight === "bold" ? "normal" : "bold",
                })
              }
            >
              <Bold className="h-4 w-4 mr-2" />
              Bold
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={onClose} className="bg-gradient-primary">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

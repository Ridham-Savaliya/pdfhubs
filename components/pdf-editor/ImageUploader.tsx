import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUpload: (dataUrl: string, width: number, height: number) => void;
  onClose: () => void;
}

export function ImageUploader({ onUpload, onClose }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        
        // Get image dimensions
        const img = new window.Image();
        img.onload = () => {
          onUpload(dataUrl, img.width, img.height);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(event);
      }
    },
    [handleFileChange]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-xl border border-border shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">Insert Image</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Drop an image here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports JPG, PNG, WebP (max 5MB)
              </p>
            </div>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

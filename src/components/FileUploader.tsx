import { useState, useCallback, useRef } from "react";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

export function FileUploader({
  accept = ".pdf",
  multiple = true,
  maxFiles = 20,
  onFilesSelected,
  className,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
      
      const validFiles = fileArray.filter((file) => {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        const mimeType = file.type.toLowerCase();
        return acceptedTypes.some(
          (type) => ext === type || mimeType.includes(type.replace(".", ""))
        );
      });

      const combinedFiles = [...files, ...validFiles].slice(0, maxFiles);
      setFiles(combinedFiles);
      onFilesSelected(combinedFiles);
    },
    [accept, files, maxFiles, onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onFilesSelected(newFiles);
    },
    [files, onFilesSelected]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          files.length > 0 && "py-8"
        )}
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] rounded-2xl pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className={cn(
          "relative flex flex-col items-center transition-transform duration-300",
          isDragging && "scale-110"
        )}>
          <div className={cn(
            "p-4 rounded-2xl mb-4 transition-all duration-300",
            isDragging 
              ? "bg-primary text-primary-foreground shadow-glow" 
              : "bg-primary/10 text-primary"
          )}>
            <Upload className="h-8 w-8" />
          </div>
          
          <p className="font-heading text-lg font-semibold text-foreground mb-1">
            {isDragging ? "Drop files here" : "Drop files or click to upload"}
          </p>
          
          <p className="text-sm text-muted-foreground">
            Supports {accept.replace(/\./g, "").toUpperCase()} • Max {maxFiles} files
          </p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFiles([]);
                onFilesSelected([]);
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          </div>

          <div className="grid gap-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

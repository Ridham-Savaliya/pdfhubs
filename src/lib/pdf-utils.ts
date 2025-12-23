import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

// Helper to create blob from Uint8Array
function createPdfBlob(pdfBytes: Uint8Array): Blob {
  const buffer = new ArrayBuffer(pdfBytes.length);
  const view = new Uint8Array(buffer);
  view.set(pdfBytes);
  return new Blob([buffer], { type: "application/pdf" });
}

// Helper to download a file
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download multiple files as zip or individually
export function downloadFiles(blobs: Blob[], filenames: string[]) {
  blobs.forEach((blob, index) => {
    setTimeout(() => {
      downloadFile(blob, filenames[index]);
    }, index * 200);
  });
}

// Helper to read file as ArrayBuffer
async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Convert canvas to blob
function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      },
      type,
      quality
    );
  });
}

// Render PDF page to canvas using PDF.js
async function renderPageToCanvas(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNum: number,
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  
  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;
  
  return canvas;
}

// ========== MERGE PDFs ==========
export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return createPdfBlob(pdfBytes);
}

// ========== SPLIT PDF ==========
export async function splitPDF(file: File): Promise<Blob[]> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const blobs: Blob[] = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);
    const pdfBytes = await newPdf.save();
    blobs.push(createPdfBlob(pdfBytes));
  }

  return blobs;
}

// ========== REAL COMPRESSION ==========
// This actually compresses by re-rendering pages as compressed images
export async function compressPDF(
  file: File,
  quality: "low" | "medium" | "high" = "medium",
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const qualitySettings = {
    low: { scale: 1.0, imageQuality: 0.5 },
    medium: { scale: 1.5, imageQuality: 0.7 },
    high: { scale: 2.0, imageQuality: 0.85 },
  };
  
  const settings = qualitySettings[quality];
  const arrayBuffer = await readFileAsArrayBuffer(file);
  
  // Load with PDF.js for rendering
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  
  // Create new PDF with compressed images
  const newPdf = await PDFDocument.create();
  
  for (let i = 1; i <= numPages; i++) {
    // Render page to canvas
    const canvas = await renderPageToCanvas(pdfDoc, i, settings.scale);
    
    // Convert to compressed JPEG
    const jpegBlob = await canvasToBlob(canvas, "image/jpeg", settings.imageQuality);
    const jpegBytes = await jpegBlob.arrayBuffer();
    
    // Embed in new PDF
    const image = await newPdf.embedJpg(jpegBytes);
    const page = newPdf.addPage([canvas.width / settings.scale, canvas.height / settings.scale]);
    
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
    
    if (onProgress) {
      onProgress((i / numPages) * 100);
    }
  }
  
  const pdfBytes = await newPdf.save();
  return createPdfBlob(pdfBytes);
}

// ========== ROTATE PDF ==========
export async function rotatePDF(file: File, rotation: 0 | 90 | 180 | 270): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotation));
  });

  const pdfBytes = await pdf.save();
  return createPdfBlob(pdfBytes);
}

// ========== ADD WATERMARK ==========
export async function addWatermark(
  file: File,
  text: string,
  options: {
    opacity?: number;
    fontSize?: number;
    color?: { r: number; g: number; b: number };
    position?: "center" | "diagonal" | "tiled";
  } = {}
): Promise<Blob> {
  const { 
    opacity = 0.3, 
    fontSize = 60, 
    color = { r: 0.7, g: 0.7, b: 0.7 },
    position = "diagonal"
  } = options;
  
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    
    if (position === "tiled") {
      // Add multiple watermarks across the page
      for (let y = 50; y < height; y += 150) {
        for (let x = 50; x < width; x += textWidth + 100) {
          page.drawText(text, {
            x,
            y,
            size: fontSize * 0.5,
            font,
            color: rgb(color.r, color.g, color.b),
            opacity: opacity * 0.5,
            rotate: degrees(-30),
          });
        }
      }
    } else if (position === "center") {
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity,
      });
    } else {
      // Diagonal
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity,
        rotate: degrees(-45),
      });
    }
  });

  const pdfBytes = await pdf.save();
  return createPdfBlob(pdfBytes);
}

// ========== ADD PAGE NUMBERS ==========
export async function addPageNumbers(
  file: File,
  options: {
    position?: "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
    format?: string;
    fontSize?: number;
    startNumber?: number;
  } = {}
): Promise<Blob> {
  const { 
    position = "bottom-center", 
    format = "Page {n} of {total}",
    fontSize = 11,
    startNumber = 1
  } = options;
  
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const totalPages = pages.length;
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const pageNum = startNumber + index;
    const text = format
      .replace("{n}", String(pageNum))
      .replace("{total}", String(totalPages));
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    
    let x: number;
    let y: number;
    
    // Determine X position
    if (position.includes("left")) {
      x = 40;
    } else if (position.includes("right")) {
      x = width - textWidth - 40;
    } else {
      x = (width - textWidth) / 2;
    }
    
    // Determine Y position
    if (position.includes("top")) {
      y = height - 30;
    } else {
      y = 30;
    }
    
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdf.save();
  return createPdfBlob(pdfBytes);
}

// ========== PDF TO IMAGES ==========
export async function pdfToImages(
  file: File,
  options: {
    format?: "jpeg" | "png";
    quality?: number;
    scale?: number;
  } = {},
  onProgress?: (progress: number) => void
): Promise<Blob[]> {
  const { format = "jpeg", quality = 0.9, scale = 2.0 } = options;
  
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  
  const blobs: Blob[] = [];
  
  for (let i = 1; i <= numPages; i++) {
    const canvas = await renderPageToCanvas(pdfDoc, i, scale);
    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const blob = await canvasToBlob(canvas, mimeType, quality);
    blobs.push(blob);
    
    if (onProgress) {
      onProgress((i / numPages) * 100);
    }
  }
  
  return blobs;
}

// ========== IMAGES TO PDF ==========
export async function imagesToPDF(files: File[]): Promise<Blob> {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    let image;
    
    const isJpeg = file.type === "image/jpeg" || 
                   file.name.toLowerCase().endsWith(".jpg") ||
                   file.name.toLowerCase().endsWith(".jpeg");
    
    if (isJpeg) {
      image = await pdf.embedJpg(arrayBuffer);
    } else if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
      image = await pdf.embedPng(arrayBuffer);
    } else {
      // Try to convert other formats via canvas
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const jpegBlob = await canvasToBlob(canvas, "image/jpeg", 0.9);
      const jpegBuffer = await jpegBlob.arrayBuffer();
      image = await pdf.embedJpg(jpegBuffer);
    }

    // Create page with image dimensions (max A4 size, scaled proportionally)
    const maxWidth = 595; // A4 width in points
    const maxHeight = 842; // A4 height in points
    
    let width = image.width;
    let height = image.height;
    
    // Scale down if larger than A4
    if (width > maxWidth || height > maxHeight) {
      const scaleX = maxWidth / width;
      const scaleY = maxHeight / height;
      const scale = Math.min(scaleX, scaleY);
      width *= scale;
      height *= scale;
    }
    
    const page = pdf.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const pdfBytes = await pdf.save();
  return createPdfBlob(pdfBytes);
}

// Helper to load image from file
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// ========== EXTRACT PAGES ==========
export async function extractPages(file: File, pageNumbers: number[]): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  const validPages = pageNumbers
    .map((n) => n - 1)
    .filter((n) => n >= 0 && n < pdf.getPageCount());
  
  const pages = await newPdf.copyPages(pdf, validPages);
  pages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return createPdfBlob(pdfBytes);
}

// ========== DELETE PAGES ==========
export async function deletePages(file: File, pageNumbers: number[]): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  const pagesToDelete = new Set(pageNumbers.map((n) => n - 1));
  const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i)
    .filter((i) => !pagesToDelete.has(i));
  
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pagesToKeep);
  pages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return createPdfBlob(pdfBytes);
}

// ========== REORDER PAGES ==========
export async function reorderPages(file: File, newOrder: number[]): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  // newOrder is 1-indexed, convert to 0-indexed
  const validOrder = newOrder
    .map((n) => n - 1)
    .filter((n) => n >= 0 && n < pdf.getPageCount());
  
  const pages = await newPdf.copyPages(pdf, validOrder);
  pages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return createPdfBlob(pdfBytes);
}

// ========== GET PDF INFO ==========
export async function getPDFInfo(file: File): Promise<{
  pageCount: number;
  title?: string;
  author?: string;
  fileSize: number;
}> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    fileSize: file.size,
  };
}

// ========== GET PAGE THUMBNAILS ==========
export async function getPageThumbnails(
  file: File,
  maxPages: number = 20
): Promise<string[]> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = Math.min(pdfDoc.numPages, maxPages);
  
  const thumbnails: string[] = [];
  
  for (let i = 1; i <= numPages; i++) {
    const canvas = await renderPageToCanvas(pdfDoc, i, 0.3);
    thumbnails.push(canvas.toDataURL("image/jpeg", 0.7));
  }
  
  return thumbnails;
}


// Helper to create blob from Uint8Array
export function createPdfBlob(pdfBytes: Uint8Array): Blob {
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
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Helper to load image from file
export function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

// Convert canvas to blob
export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
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

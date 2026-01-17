import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Modern browsers target for smaller and faster code
    target: "esnext",
    // Use esbuild for minification (fastest and handles dead code well)
    minify: "esbuild",
    // Better CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: false, // Disabling speeds up builds slightly
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React vendor chunk (critical for FCP)
          if (id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }

          // React Router (navigation)
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor';
          }

          // UI Component library (Radix UI - split by component if possible, or group small ones)
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }

          // Heavy Libraries - Lazy load them aggressively!
          if (id.includes('pdfjs-dist')) return 'pdfjs';
          if (id.includes('pdf-lib')) return 'pdflib';
          if (id.includes('pdfmake')) return 'pdfmake';
          if (id.includes('lucide-react')) return 'lucide-icons';

          // Data fetching and state
          if (id.includes('@tanstack/react-query')) return 'react-query';
          if (id.includes('@supabase/')) return 'supabase';

          // Utilities
          if (id.includes('date-fns')) return 'date-fns';
        },
        // Stable file names for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  // Aggressively pre-bundle dependencies during dev for speed
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "clsx",
      "tailwind-merge"
    ],
  },
}));

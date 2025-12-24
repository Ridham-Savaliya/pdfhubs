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
    // Enable minification
    minify: "esbuild",
    // Target modern browsers for smaller bundles
    target: "es2020",
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Vendor chunk for React and core libraries
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor';
          }
          // UI components chunk - lazy load
          if (id.includes('@radix-ui/')) {
            return 'ui';
          }
          // PDF libraries chunk - only load on tool pages
          if (id.includes('pdf-lib') || id.includes('pdfjs-dist') || id.includes('pdfmake')) {
            return 'pdf';
          }
          // Query and state management
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          // Supabase client
          if (id.includes('@supabase/')) {
            return 'supabase';
          }
        },
      },
    },
    // No source maps in production for smaller bundles
    sourcemap: false,
    // Compress CSS
    cssMinify: true,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));

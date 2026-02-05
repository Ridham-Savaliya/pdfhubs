// vite.config.ts
import { defineConfig } from "file:///C:/Users/Ridham%20Savaliya/Desktop/PdfHubs/pdf-edit-pro/node_modules/.pnpm/vite@5.4.21_@types+node@22.19.7/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Ridham%20Savaliya/Desktop/PdfHubs/pdf-edit-pro/node_modules/.pnpm/@vitejs+plugin-react-swc@3._169e0fd9ef335513015f93764fd52c59/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/Ridham%20Savaliya/Desktop/PdfHubs/pdf-edit-pro/node_modules/.pnpm/lovable-tagger@1.1.13_vite@5.4.21_@types+node@22.19.7_/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Ridham Savaliya\\Desktop\\PdfHubs\\pdf-edit-pro";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Modern browsers target for smaller and faster code
    target: "esnext",
    // Use esbuild for minification (fastest and handles dead code well)
    minify: "esbuild",
    // Better CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: false,
    // Disabling speeds up builds slightly
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/scheduler/")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/react-router")) {
            return "router-vendor";
          }
          if (id.includes("@radix-ui")) {
            return "radix-ui";
          }
          if (id.includes("pdfjs-dist")) return "pdfjs";
          if (id.includes("pdf-lib")) return "pdflib";
          if (id.includes("pdfmake")) return "pdfmake";
          if (id.includes("lucide-react")) return "lucide-icons";
          if (id.includes("@tanstack/react-query")) return "react-query";
          if (id.includes("@supabase/")) return "supabase";
          if (id.includes("date-fns")) return "date-fns";
        },
        // Stable file names for better caching
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]"
      }
    }
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
    ]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSaWRoYW0gU2F2YWxpeWFcXFxcRGVza3RvcFxcXFxQZGZIdWJzXFxcXHBkZi1lZGl0LXByb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmlkaGFtIFNhdmFsaXlhXFxcXERlc2t0b3BcXFxcUGRmSHVic1xcXFxwZGYtZWRpdC1wcm9cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1JpZGhhbSUyMFNhdmFsaXlhL0Rlc2t0b3AvUGRmSHVicy9wZGYtZWRpdC1wcm8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW3JlYWN0KCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvLyBNb2Rlcm4gYnJvd3NlcnMgdGFyZ2V0IGZvciBzbWFsbGVyIGFuZCBmYXN0ZXIgY29kZVxyXG4gICAgdGFyZ2V0OiBcImVzbmV4dFwiLFxyXG4gICAgLy8gVXNlIGVzYnVpbGQgZm9yIG1pbmlmaWNhdGlvbiAoZmFzdGVzdCBhbmQgaGFuZGxlcyBkZWFkIGNvZGUgd2VsbClcclxuICAgIG1pbmlmeTogXCJlc2J1aWxkXCIsXHJcbiAgICAvLyBCZXR0ZXIgQ1NTIGNvZGUgc3BsaXR0aW5nXHJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXHJcbiAgICAvLyBSZXBvcnQgY29tcHJlc3NlZCBzaXplXHJcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsIC8vIERpc2FibGluZyBzcGVlZHMgdXAgYnVpbGRzIHNsaWdodGx5XHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XHJcbiAgICAgICAgICAvLyBDb3JlIFJlYWN0IHZlbmRvciBjaHVuayAoY3JpdGljYWwgZm9yIEZDUClcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LycpIHx8XHJcbiAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QtZG9tLycpIHx8XHJcbiAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvc2NoZWR1bGVyLycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncmVhY3QtdmVuZG9yJztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBSZWFjdCBSb3V0ZXIgKG5hdmlnYXRpb24pXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXInKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3JvdXRlci12ZW5kb3InO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFVJIENvbXBvbmVudCBsaWJyYXJ5IChSYWRpeCBVSSAtIHNwbGl0IGJ5IGNvbXBvbmVudCBpZiBwb3NzaWJsZSwgb3IgZ3JvdXAgc21hbGwgb25lcylcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQHJhZGl4LXVpJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdyYWRpeC11aSc7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gSGVhdnkgTGlicmFyaWVzIC0gTGF6eSBsb2FkIHRoZW0gYWdncmVzc2l2ZWx5IVxyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdwZGZqcy1kaXN0JykpIHJldHVybiAncGRmanMnO1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdwZGYtbGliJykpIHJldHVybiAncGRmbGliJztcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncGRmbWFrZScpKSByZXR1cm4gJ3BkZm1ha2UnO1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdsdWNpZGUtcmVhY3QnKSkgcmV0dXJuICdsdWNpZGUtaWNvbnMnO1xyXG5cclxuICAgICAgICAgIC8vIERhdGEgZmV0Y2hpbmcgYW5kIHN0YXRlXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScpKSByZXR1cm4gJ3JlYWN0LXF1ZXJ5JztcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQHN1cGFiYXNlLycpKSByZXR1cm4gJ3N1cGFiYXNlJztcclxuXHJcbiAgICAgICAgICAvLyBVdGlsaXRpZXNcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZGF0ZS1mbnMnKSkgcmV0dXJuICdkYXRlLWZucyc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBTdGFibGUgZmlsZSBuYW1lcyBmb3IgYmV0dGVyIGNhY2hpbmdcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0uW2hhc2hdLmpzJyxcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0uW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0uW2hhc2hdLltleHRdJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBBZ2dyZXNzaXZlbHkgcHJlLWJ1bmRsZSBkZXBlbmRlbmNpZXMgZHVyaW5nIGRldiBmb3Igc3BlZWRcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFtcclxuICAgICAgXCJyZWFjdFwiLFxyXG4gICAgICBcInJlYWN0LWRvbVwiLFxyXG4gICAgICBcInJlYWN0LXJvdXRlci1kb21cIixcclxuICAgICAgXCJsdWNpZGUtcmVhY3RcIixcclxuICAgICAgXCJAcmFkaXgtdWkvcmVhY3QtZGlhbG9nXCIsXHJcbiAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnVcIixcclxuICAgICAgXCJjbHN4XCIsXHJcbiAgICAgIFwidGFpbHdpbmQtbWVyZ2VcIlxyXG4gICAgXSxcclxuICB9LFxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1YsU0FBUyxvQkFBb0I7QUFDNVgsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUEsSUFFTCxRQUFRO0FBQUE7QUFBQSxJQUVSLFFBQVE7QUFBQTtBQUFBLElBRVIsY0FBYztBQUFBO0FBQUEsSUFFZCxzQkFBc0I7QUFBQTtBQUFBLElBQ3RCLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWMsQ0FBQyxPQUFPO0FBRXBCLGNBQUksR0FBRyxTQUFTLHFCQUFxQixLQUNuQyxHQUFHLFNBQVMseUJBQXlCLEtBQ3JDLEdBQUcsU0FBUyx5QkFBeUIsR0FBRztBQUN4QyxtQkFBTztBQUFBLFVBQ1Q7QUFHQSxjQUFJLEdBQUcsU0FBUywyQkFBMkIsR0FBRztBQUM1QyxtQkFBTztBQUFBLFVBQ1Q7QUFHQSxjQUFJLEdBQUcsU0FBUyxXQUFXLEdBQUc7QUFDNUIsbUJBQU87QUFBQSxVQUNUO0FBR0EsY0FBSSxHQUFHLFNBQVMsWUFBWSxFQUFHLFFBQU87QUFDdEMsY0FBSSxHQUFHLFNBQVMsU0FBUyxFQUFHLFFBQU87QUFDbkMsY0FBSSxHQUFHLFNBQVMsU0FBUyxFQUFHLFFBQU87QUFDbkMsY0FBSSxHQUFHLFNBQVMsY0FBYyxFQUFHLFFBQU87QUFHeEMsY0FBSSxHQUFHLFNBQVMsdUJBQXVCLEVBQUcsUUFBTztBQUNqRCxjQUFJLEdBQUcsU0FBUyxZQUFZLEVBQUcsUUFBTztBQUd0QyxjQUFJLEdBQUcsU0FBUyxVQUFVLEVBQUcsUUFBTztBQUFBLFFBQ3RDO0FBQUE7QUFBQSxRQUVBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=

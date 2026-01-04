import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // In build mode, only build the enhancement script
  const isBuild = command === 'build';
  
  return {
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
      outDir: "build/2026",
      emptyOutDir: false, // Don't empty, we write index.html there
      base: "/2026/",
      assetsDir: "assets",
      rollupOptions: isBuild ? {
        input: path.resolve(__dirname, "src/enhance.tsx"),
        output: {
          entryFileNames: "assets/enhance.js",
          chunkFileNames: (chunkInfo) => {
            // Name chunks based on their content
            const name = chunkInfo.name || '';
            if (name.includes('enhance-reader') || name.includes('page')) {
              return 'assets/page-[hash].js';
            }
            if (name.includes('enhance-raw') || name.includes('raw')) {
              return 'assets/raw-[hash].js';
            }
            return 'assets/[name]-[hash].js';
          },
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      } : undefined,
    },
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  base: "/",

  build: {
    sourcemap: false,
    target: "es2020",
    cssTarget: "chrome100",
    assetsInlineLimit: 2048,
    reportCompressedSize: false,
  },

  server: {
    port: 5173,
    open: true,
  },

  plugins: [
    react(),
    Sitemap({
      hostname: "https://webnika-studio.vercel.app",
      exclude: ["/google8108b5e11dc186b5", "/google8108b5e11dc186b5.html"],
      readable: true,
    }),
  ],
});

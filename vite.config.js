import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),

    Sitemap({
      hostname: "https://webnika-studio.vercel.app",

      dynamicRoutes: ["/"],

      readable: true,
    }),
  ],
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  base: "/webnika-studio/",

  plugins: [
    react(),

    Sitemap({
      hostname: "https://veronikapetrushka.github.io",

      dynamicRoutes: [
        "/webnika-studio/",
      ],

      exclude: [
        "/",
        "/google8108b5e11dc186b5",
        "/google8108b5e11dc186b5.html",
      ],

      readable: true,
    }),
  ],
});
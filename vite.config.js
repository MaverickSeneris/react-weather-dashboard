import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// Default theme color (Catppuccin dark bg0)
// This is used at build time. The manifest theme colors are updated dynamically at runtime
// based on the user's selected theme via the updateManifestTheme function in themes.js
const defaultThemeColor = "#1e1e2e"; // Catppuccin dark bg0 - default theme

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt"],
      manifest: {
        name: "Ernie",
        short_name: "Earnie",
        description: "Smart weather app",
        start_url: "/", // Ensures proper routing when launched from home screen
        display: "standalone",
        theme_color: defaultThemeColor, // Default theme - updated dynamically at runtime
        background_color: defaultThemeColor, // Default theme - updated dynamically at runtime
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});

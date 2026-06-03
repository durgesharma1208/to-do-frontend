import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Switch to injectManifest strategy
      strategies: "injectManifest",
      // Specify our custom service worker file
      srcDir: "src",
      filename: "sw.js",
      // PWA manifest configuration
      manifest: {
        name: "MERN-STACK-PROD-TRACKER",
        short_name: "ProdTracker",
        description: "A production-ready MERN stack productivity tracker.",
        theme_color: "#2A303C",
        background_color: "#1E222A",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      // Workbox options for injectManifest
      injectManifest: {
        // Define which assets to precache
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
        // IMPORTANT: Exclude the old Firebase SW if it exists, and other files we don't want to precache.
        globIgnores: ["**/firebase-messaging-sw.js"],
      },
      devOptions: {
        enabled: true,
        // Specify the entry point for the service worker in development
        entry: "src/sw.js",
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "esnext",
  },
});

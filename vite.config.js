import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Register service worker type
      registerType: "autoUpdate",

      // PWA manifest configuration
      manifest: {
        id: "/",
        name: "Todo App",
        short_name: "Todos",
        description:
          "A full-featured todo application with PWA support - manage tasks offline",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        theme_color: "#3B82F6",
        background_color: "#FFFFFF",
        dir: "ltr",
        lang: "en",
        categories: ["productivity"],

        // App icons for different sizes
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],

        // Screenshots for app store
        screenshots: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            form_factor: "narrow",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
          },
        ],
      },

      // Service worker generation
      workbox: {
        // Cache all static assets
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2}",
        ],

        // Skip service worker caching for API calls
        globIgnores: ["**/node_modules/**"],

        // Max file size to cache (5MB)
        maximumFileSizeToCacheInBytes: 5000000,

        // Workbox runtime caching strategies
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/api\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 3600, // 1 hour
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },

      // Development options
      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },

      // Strategy for service worker updates
      strategies: "generateSW",
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
    target: "ES2020",
  },
});

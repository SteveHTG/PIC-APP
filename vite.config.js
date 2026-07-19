import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages project site is served from a subpath: /<repo>/.
// Keep this in sync with the repo name (it survives an ownership transfer).
// If you later add a custom domain (served at root), set this back to "/".
const PROD_BASE = "/PIC-APP/";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Root in dev (so `npm run dev` stays at http://localhost:5173/),
  // subpath only for the production build that GitHub Pages serves.
  const base = mode === "production" ? PROD_BASE : "/";

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["apple-touch-icon.png", "logo-mark.svg"],
        manifest: {
          name: "Plugged In Charging",
          short_name: "PIC",
          description:
            "Find nearby power-bank charging stations, check availability, and get directions.",
          theme_color: "#13294B",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          start_url: base,
          scope: base,
          icons: [
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,jpg,ico}"],
          navigateFallback: base,
        },
      }),
    ],
  };
});

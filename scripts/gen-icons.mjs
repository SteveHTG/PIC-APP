// Regenerate PWA/app icons from the icon-only logo mark.
// Usage: node scripts/gen-icons.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(resolve(root, "public/logo-mark.svg"));
const white = { r: 255, g: 255, b: 255, alpha: 1 };

// [size, filename, padding fraction per side]
const targets = [
  [192, "pwa-192x192.png", 0.1],
  [512, "pwa-512x512.png", 0.1],
  [180, "apple-touch-icon.png", 0.08],
];

for (const [size, name, pad] of targets) {
  const inner = Math.round(size * (1 - 2 * pad));
  const mark = await sharp(svg, { density: 400 })
    .resize(inner, inner, { fit: "contain", background: white })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: white },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(resolve(root, "public", name));

  console.log("wrote", name);
}

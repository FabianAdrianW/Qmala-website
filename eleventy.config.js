import Image from "@11ty/eleventy-img";
import fs from "node:fs";
import path from "node:path";

/* Zdjęcie z panelu (/uploads/...) → miniatura 640 px i pełne 1600 px.
   Adres zewnętrzny (https://...) zostaje bez zmian. */
async function photo(src) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return { thumb: src, full: src, w: 640, h: 480 };
  const file = path.join("src", src.replace(/^\//, ""));
  if (!fs.existsSync(file)) return null;
  const meta = await Image(file, {
    widths: [640, 1600],
    formats: ["jpeg"],
    outputDir: "_site/img/",
    urlPath: "img/",
    sharpJpegOptions: { quality: 78 },
  });
  const small = meta.jpeg[0], big = meta.jpeg[meta.jpeg.length - 1];
  return { thumb: small.url.replace(/^\//, ""), full: big.url.replace(/^\//, ""), w: small.width, h: small.height };
}

export default function (cfg) {
  cfg.addPassthroughCopy({ "src/assets": "." });
  cfg.addPassthroughCopy("src/admin");
  cfg.addPassthroughCopy({ "src/images": "images" }); // zdjęcia ze starej strony, adresy /images/... muszą zostać
  cfg.ignores.add("src/admin/**");
  cfg.addGlobalData("baseUrl", () => (process.env.URL || "https://qmala.pl").replace(/\/$/, "")); // Netlify podaje adres strony w URL
  cfg.addGlobalData("teraz", () => new Date().getFullYear());

  cfg.addFilter("tel", (n) => "tel:+48" + String(n || "").replace(/\D/g, ""));
  cfg.addFilter("digits", (n) => String(n || "").replace(/\D/g, ""));

  cfg.addFilter("ileZdjec", (items) => items.reduce((n, i) => n + i.data.foto.length, 0));
  cfg.addFilter("lata", (items) => [...new Set(items.map((i) => i.data.rok).filter(Boolean))]);

  cfg.addCollection("realizacje", async (api) => {
    const items = api.getFilteredByGlob("src/realizacje/*.md");
    for (const it of items) {
      const list = Array.isArray(it.data.zdjecia) ? it.data.zdjecia : [];
      it.data.foto = (await Promise.all(list.map(photo))).filter(Boolean);
      it.data.znak = it.data.etykieta || it.data.rok || "";
    }
    items.sort((a, b) => (b.data.rok || 0) - (a.data.rok || 0) || a.inputPath.localeCompare(b.inputPath));
    const seen = new Set();
    for (const it of items) { it.data.pierwszy = !!it.data.rok && !seen.has(it.data.rok); seen.add(it.data.rok); }
    return items;
  });

  return { dir: { input: "src", output: "_site" }, markdownTemplateEngine: false, htmlTemplateEngine: false };
}

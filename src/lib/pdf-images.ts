import path from "path";
import fs from "fs";

export interface PdfAssets {
  logoDataUri?: string | null;
  rooftopImageDataUri?: string | null;
}

export function getPdfAssets(): PdfAssets {
  const publicDir = path.join(process.cwd(), "public");

  function getFileAsDataUri(relativePaths: string[]): string | null {
    for (const rel of relativePaths) {
      const fullPath = path.join(publicDir, rel);
      if (fs.existsSync(fullPath)) {
        try {
          const buffer = fs.readFileSync(fullPath);
          const ext = path.extname(fullPath).toLowerCase().replace(".", "");
          const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
          return `data:${mime};base64,${buffer.toString("base64")}`;
        } catch (err) {
          console.error(`Error reading ${fullPath}:`, err);
        }
      }
    }
    return null;
  }

  const logoDataUri = getFileAsDataUri([
    "images/sp-surya-logo.jpeg",
    "images/sp-surya-logo.jpg",
    "images/sp-surya-logo.png",
    "logos/sp-surya-logo.jpg",
    "logos/sp-surya-logo.png",
    "images/logo.png",
    "images/logo.jpg",
  ]);

  const rooftopImageDataUri = getFileAsDataUri([
    "images/rooftop-house.png",
    "images/rooftop-house.jpg",
    "images/rooftop-house.jpeg",
    "images/house.png",
    "images/house.jpg",
    "images/solar-house.png",
  ]);

  return {
    logoDataUri,
    rooftopImageDataUri,
  };
}

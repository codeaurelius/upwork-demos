import fs from "fs";
import path from "path";

export interface DemoMeta {
  slug: string;
  title: string;
  description?: string;
}

export function getDemos(): DemoMeta[] {
  const demoDir = path.join(process.cwd(), "src", "app", "demo");
  if (!fs.existsSync(demoDir)) return [];

  const slugs = fs
    .readdirSync(demoDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  return slugs.map((slug) => {
    const metaPath = path.join(demoDir, slug, "meta.json");
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      return { slug, ...meta };
    }
    return { slug, title: slug };
  });
}

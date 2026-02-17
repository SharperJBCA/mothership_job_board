import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readBriefForSlug(slug: string, fallbackBrief: string | null | undefined) {
  const filename = `${slug.trim().toLowerCase()}.md`;
  const briefPath = path.join(process.cwd(), "briefs", filename);

  try {
    const markdown = await readFile(briefPath, "utf8");
    if (markdown.trim()) return markdown;
  } catch {
    // Fallback to DB brief when no markdown brief file exists.
  }

  return fallbackBrief ?? "";
}

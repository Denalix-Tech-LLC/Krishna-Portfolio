import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "@/types/content";

const CONTENT_PATH = path.join(process.cwd(), "content", "site-content.json");

/**
 * Server-side content loader. Reads content/site-content.json on each request
 * so edits made through /admin (or by hand) appear without a rebuild when
 * running on a Node server.
 */
export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export { CONTENT_PATH };

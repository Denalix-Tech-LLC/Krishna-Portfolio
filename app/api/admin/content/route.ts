import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { CONTENT_PATH } from "@/lib/content";
import { isAuthed } from "@/lib/adminAuth";

/**
 * /api/admin/content — read/write content/site-content.json for the /admin
 * editor. Guarded by the same basic single-password cookie as the login
 * route (fine for a personal site; not meant for multi-user setups).
 *
 *   GET  → the current JSON file (auth required)
 *   POST → replace the file with the posted content object (auth required)
 */

// fs access → Node.js runtime only.
export const runtime = "nodejs";

const READ_ONLY_ERROR =
  "This host has a read-only filesystem (e.g. Vercel). Use Export JSON and replace content/site-content.json in the repo instead.";

/** Top-level keys that must exist for the payload to look like real site content. */
const REQUIRED_KEYS = ["personal", "hero", "projects", "skills"] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Serializes writes so concurrent saves can't interleave, and writes
 * atomically (temp file + rename) so a public request reading the file
 * mid-save never sees a truncated/partial JSON.
 */
let writeChain: Promise<void> = Promise.resolve();

function writeContentAtomically(data: string): Promise<void> {
  const run = writeChain.then(async () => {
    const tmpPath = `${CONTENT_PATH}.tmp`;
    await fs.writeFile(tmpPath, data, "utf-8");
    await fs.rename(tmpPath, CONTENT_PATH);
  });
  // Keep the chain alive even if this write fails.
  writeChain = run.catch(() => {});
  return run;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    // Return the raw file so underscore-prefixed documentation keys survive.
    return new NextResponse(raw, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not read content/site-content.json on the server" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await req.json().catch(() => undefined);

  if (!isPlainObject(body)) {
    return NextResponse.json(
      { error: "Body must be the full site-content JSON object" },
      { status: 400 }
    );
  }

  const missing = REQUIRED_KEYS.filter((key) => !(key in body));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Content is missing required sections: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // Ensure the payload survives a stringify/parse round-trip before writing.
  let pretty: string;
  try {
    pretty = JSON.stringify(body, null, 2);
    JSON.parse(pretty);
  } catch {
    return NextResponse.json(
      { error: "Content is not JSON-serializable" },
      { status: 400 }
    );
  }

  try {
    await writeContentAtomically(`${pretty}\n`);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException | null)?.code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return NextResponse.json({ error: READ_ONLY_ERROR }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to write content file on the server" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

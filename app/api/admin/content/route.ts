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
  "This host has a read-only filesystem (e.g. Vercel). Either set GITHUB_TOKEN + GITHUB_REPO env vars so Save commits to your repo, or use Export JSON and replace content/site-content.json manually.";

const GITHUB_CONTENT_PATH = "content/site-content.json";

/**
 * Fallback for read-only hosts (Vercel): commit the content file to the
 * GitHub repo via the Contents API. The connected host then redeploys with
 * the new content automatically. Needs env vars:
 *   GITHUB_TOKEN  — fine-grained PAT with Contents read/write on the repo
 *   GITHUB_REPO   — "owner/repo"
 *   GITHUB_BRANCH — optional, defaults to "main"
 */
async function saveToGitHub(
  pretty: string
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) {
    return { ok: false, status: 500, error: READ_ONLY_ERROR };
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${GITHUB_CONTENT_PATH}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-admin-editor",
  };

  // The Contents API needs the current file SHA to update (absent = create).
  let sha: string | undefined;
  const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
    headers,
    cache: "no-store",
  });
  if (getRes.ok) {
    sha = ((await getRes.json()) as { sha?: string }).sha;
  } else if (getRes.status !== 404) {
    return {
      ok: false,
      status: 502,
      error: `GitHub read failed (${getRes.status}) — check GITHUB_TOKEN permissions and GITHUB_REPO ("owner/repo")`,
    };
  }

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "Update site content via admin editor",
      content: Buffer.from(pretty, "utf-8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!putRes.ok) {
    const detail = (await putRes.json().catch(() => null)) as {
      message?: string;
    } | null;
    return {
      ok: false,
      status: 502,
      error: `GitHub save failed (${putRes.status}${detail?.message ? `: ${detail.message}` : ""})`,
    };
  }
  return { ok: true };
}

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
      // Read-only host (e.g. Vercel) — fall back to committing via GitHub.
      const gh = await saveToGitHub(`${pretty}\n`);
      if (gh.ok) {
        return NextResponse.json({
          ok: true,
          mode: "github",
          message:
            "Saved to GitHub — the host is redeploying; changes go live in a minute or two.",
        });
      }
      return NextResponse.json({ error: gh.error }, { status: gh.status });
    }
    return NextResponse.json(
      { error: "Failed to write content file on the server" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, mode: "file" });
}

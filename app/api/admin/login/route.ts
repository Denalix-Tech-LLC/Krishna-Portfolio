import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, isAuthed } from "@/lib/adminAuth";

/**
 * /api/admin/login — session management for the hidden /admin editor.
 * Basic single-password protection, suitable for a personal portfolio site.
 *
 *   POST   { password } → sets the admin cookie on success
 *   GET    → { authed: boolean }
 *   DELETE → clears the cookie (logout)
 */

// node:crypto + env access → must run on the Node.js runtime, not Edge.
export const runtime = "nodejs";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function cookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    // Local dev runs over http; only require https in production.
    secure: process.env.NODE_ENV === "production",
  };
}

export async function POST(req: NextRequest) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on the server" },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { password?: unknown }
    | null;
  const submitted = typeof body?.password === "string" ? body.password : "";

  if (submitted !== configured) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = adminToken();
  if (!token) {
    // Should be unreachable (env checked above) but keeps TS + runtime safe.
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on the server" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    ...cookieOptions(),
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ authed: isAuthed(req) });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  // maxAge 0 instructs the browser to drop the cookie immediately.
  res.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return res;
}

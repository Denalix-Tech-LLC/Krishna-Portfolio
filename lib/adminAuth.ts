import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Server-only auth helpers for the hidden /admin content editor.
 *
 * NOTE: this is deliberately simple, single-password protection — perfectly
 * adequate for a personal portfolio site, but not a substitute for a real
 * auth system on anything multi-user or high-stakes. The password itself is
 * never stored in the cookie; only a salted SHA-256 digest of it is.
 */

/** Name of the httpOnly session cookie set after a successful login. */
export const ADMIN_COOKIE = "portfolio_admin";

const TOKEN_SALT = ":kkr-portfolio-salt";

/**
 * Deterministic session token: sha256 hex of ADMIN_PASSWORD + salt.
 * Returns null when ADMIN_PASSWORD is not configured on the server so
 * callers can take the "return false / respond 500" path.
 */
export function adminToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`${password}${TOKEN_SALT}`).digest("hex");
}

/**
 * True when the request carries a cookie matching the current admin token.
 * Missing ADMIN_PASSWORD or missing/mismatched cookie → false.
 */
export function isAuthed(req: NextRequest): boolean {
  const expected = adminToken();
  if (!expected) return false;
  const provided = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!provided) return false;
  const a = Buffer.from(provided, "utf-8");
  const b = Buffer.from(expected, "utf-8");
  // Length differs → definitely not the token (timingSafeEqual requires equal lengths).
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

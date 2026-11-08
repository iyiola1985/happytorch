import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSessionToken, SESSION_COOKIE, signSession } from "@/lib/auth-token";

export function adminConfigError() {
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return "Set AUTH_SECRET to a random string of at least 32 characters.";
  }
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return "Set ADMIN_EMAIL and ADMIN_PASSWORD in the server environment.";
  }
  return null;
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function matches(input: string, expected: string) {
  return timingSafeEqual(digest(input), digest(expected));
}

export async function readSession() {
  const jar = await cookies();
  return readSessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function attemptLogin(email: string, password: string) {
  const problem = adminConfigError();
  if (problem) return { ok: false as const, error: problem };
  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!matches(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase()) || !matches(password, expectedPassword)) {
    return { ok: false as const, error: "Those details were not recognised." };
  }
  const token = await signSession(expectedEmail);
  if (!token) return { ok: false as const, error: "The studio desk is not configured." };
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { ok: true as const };
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

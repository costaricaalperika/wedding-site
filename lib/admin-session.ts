/**
 * HMAC imzalı oturum çerezi — Edge (middleware) ve Route Handler ile uyumlu.
 */

export const ADMIN_SESSION_COOKIE = "alperduygu_session";

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 gün

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set (min 16 chars) in environment variables"
    );
  }
  return s;
}

function uint8ToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  const exp = Date.now() + SESSION_MAX_AGE_MS;
  const payload = JSON.stringify({ exp });
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const sigB64 = uint8ToBase64Url(new Uint8Array(sig));
  const payloadB64 = uint8ToBase64Url(enc.encode(payload));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }

  let payloadBytes: Uint8Array;
  try {
    payloadBytes = base64UrlToUint8(payloadB64);
  } catch {
    return false;
  }

  const enc = new TextEncoder();
  const payloadStr = new TextDecoder().decode(payloadBytes);

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  let sigBytes: Uint8Array;
  try {
    sigBytes = base64UrlToUint8(sigB64);
  } catch {
    return false;
  }

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    new Uint8Array(sigBytes),
    new Uint8Array(payloadBytes)
  );
  if (!valid) return false;

  try {
    const data = JSON.parse(payloadStr) as { exp?: number };
    if (typeof data.exp !== "number" || Date.now() > data.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function sessionCookieMaxAgeSec(): number {
  return Math.floor(SESSION_MAX_AGE_MS / 1000);
}

import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_MODE_COOKIE = "admin_mode";

function getSecret(): string {
  const s = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("Missing ADMIN_SECRET or ADMIN_PASSWORD");
  return s;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payloadB64: string) {
  return base64url(createHmac("sha256", getSecret()).update(payloadB64).digest());
}

export type AdminPayload = { role: "admin"; exp: number };

export function createAdminSession(days = 7): string {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  const payload: AdminPayload = { role: "admin", exp };
  const payloadB64 = base64url(JSON.stringify(payload));
  const sig = sign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function verifyAdminSession(token?: string | null): boolean {
  try {
    if (!token) return false;
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return false;
    const expectedSig = sign(payloadB64);
    if (expectedSig.length !== sig.length) return false;
    const okSig = timingSafeEqual(Buffer.from(expectedSig), Buffer.from(sig));
    if (!okSig) return false;
    const payloadJson = Buffer.from(
      payloadB64.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf8");
    const payload = JSON.parse(payloadJson) as AdminPayload;
    return payload.role === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
}


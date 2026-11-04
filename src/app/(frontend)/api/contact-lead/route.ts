import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import {
  appendContactLead,
  validateContactLead,
  type ContactLead,
} from "@/lib/googleSheets";

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Rate-limiting config
// Allow 5 submissions per IP per 60-second window.
// Redis keys are prefixed "rate:contact:<ip>" and expire automatically.
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60;

// Redis client is initialised once per cold-start from the Upstash env vars
// injected by Vercel (KV_REST_API_URL + KV_REST_API_TOKEN).
const redis = Redis.fromEnv();

// ---------------------------------------------------------------------------
// CSRF: allowed origins for the contact form POST
// ---------------------------------------------------------------------------
function isAllowedOrigin(origin: string): boolean {
  if (!origin) return true; // Same-origin or non-browser client
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "designasylum.studio" ||
      host.endsWith(".designasylum.studio") ||
      host === "designasylum.vercel.app" ||
      host.endsWith(".vercel.app")
    ) {
      return true;
    }
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
      const serverUrl = new URL(process.env.NEXT_PUBLIC_SERVER_URL);
      if (serverUrl.hostname.toLowerCase() === host) return true;
    }
  } catch {
    return false;
  }
  return false;
}

export async function POST(request: Request) {
  // --- CSRF guard -----------------------------------------------------------
  // Reject cross-origin POSTs from unauthorized third-party sites.
  const origin = request.headers.get("origin") ?? "";
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
  }

  // --- Rate limit -----------------------------------------------------------
  // Extract the real client IP from the Vercel forwarded-for header.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitKey = `rate:contact:${ip}`;

  try {
    const count = await redis.incr(rateLimitKey);
    if (count === 1) {
      // First request in this window — set the TTL so the key expires cleanly.
      await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS);
    }
    if (count > RATE_LIMIT_MAX) {
      return NextResponse.json(
        { ok: false, error: "Too many submissions. Please wait a minute and try again." },
        { status: 429 },
      );
    }
  } catch (redisError) {
    // If Redis is unreachable, log and continue — don't block legitimate users.
    console.error("Rate-limit Redis check failed (continuing without limit)", redisError);
  }

  // --- Parse body -----------------------------------------------------------
  let body: Partial<ContactLead>;
  try {
    body = (await request.json()) as Partial<ContactLead>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  // --- Validate & submit ----------------------------------------------------
  const validated = validateContactLead(body);
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, error: validated.error },
      { status: validated.status },
    );
  }

  try {
    await appendContactLead(validated.lead);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact lead submit failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not save your details. Please try again." },
      { status: 500 },
    );
  }
}

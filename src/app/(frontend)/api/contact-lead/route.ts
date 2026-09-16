import { NextResponse } from "next/server";
import {
  appendContactLead,
  validateContactLead,
  type ContactLead,
} from "@/lib/googleSheets";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Partial<ContactLead>;

  try {
    body = (await request.json()) as Partial<ContactLead>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const validated = validateContactLead(body);
  if (!validated.ok || !validated.lead) {
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

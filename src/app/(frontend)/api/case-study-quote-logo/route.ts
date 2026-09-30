import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QueryResult = { rows?: Record<string, unknown>[] };

function mediaId(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  if (typeof value === "object" && "id" in value) {
    return mediaId((value as { id: unknown }).id);
  }
  return null;
}

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Sign in to the CMS first." },
      { status: 401 },
    );
  }

  let body: { id?: unknown; logo?: unknown };
  try {
    body = (await request.json()) as { id?: unknown; logo?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const studyId = mediaId(body.id);
  if (studyId == null) {
    return NextResponse.json({ ok: false, error: "Missing case study." }, { status: 400 });
  }

  const clearing = body.logo == null || body.logo === "";
  const logo = clearing ? null : mediaId(body.logo);
  if (!clearing && logo == null) {
    return NextResponse.json({ ok: false, error: "Invalid logo." }, { status: 400 });
  }

  if (logo != null) {
    const media = await payload
      .findByID({ collection: "media", id: logo, depth: 0 })
      .catch(() => null);
    if (!media) {
      return NextResponse.json(
        { ok: false, error: "That file is not in the media library." },
        { status: 400 },
      );
    }
  }

  const db = payload.db as unknown as {
    drizzle: { execute: (query: ReturnType<typeof sql>) => Promise<QueryResult> };
  };

  const found = await db.drizzle.execute(sql`
    SELECT c.slug AS client_slug, s.slug AS study_slug
    FROM case_studies s
    JOIN clients c ON c.id = s.client_id
    WHERE s.id = ${studyId}
    LIMIT 1
  `);
  const row = found.rows?.[0];
  const clientSlug = typeof row?.client_slug === "string" ? row.client_slug : null;
  const studySlug = typeof row?.study_slug === "string" ? row.study_slug : null;
  if (!clientSlug || !studySlug) {
    return NextResponse.json({ ok: false, error: "Case study not found." }, { status: 404 });
  }

  await db.drizzle.execute(sql`
    UPDATE case_studies
    SET details_logo_id = ${logo}, updated_at = NOW()
    WHERE id = ${studyId}
  `);

  revalidatePath(`/clients/${clientSlug}/${studySlug}`);
  return NextResponse.json({ ok: true });
}

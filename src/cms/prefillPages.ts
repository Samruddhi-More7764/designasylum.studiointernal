import { createHash } from "node:crypto";
import type { Payload } from "payload";

import { pageEntries } from "./pageEntries";
import { faqDetails } from "../data/faqDetailPage";
import { faqEntries } from "../data/faqPage";
import {
  ahmedabadBreadcrumbCurrent,
  ahmedabadCallout,
  ahmedabadCta,
  ahmedabadFaqItems,
  ahmedabadHero,
  ahmedabadLead,
  ahmedabadProjectTabs,
  ahmedabadSections,
} from "../data/ahmedabadLocationPage";
import { brandingProjects, relatedBlogs } from "../data/brandingAgencyPage";

const FINGERPRINT_KEY = "cms-page-entries";

type QueryClient = {
  query: <T extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ) => Promise<{ rows: T[]; rowCount: number | null }>;
  release: () => void;
};

/**
 * Writes the public page copy into a CMS global only when that global has
 * no saved fields yet. A document the client has saved is never updated:
 * a global write replaces the stored row, so a partial fill could rewrite
 * lists and uploads that were left out of the patch.
 */
export async function prefillPageEntries(payload: Payload): Promise<void> {
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  try {
    await fillEmptyEntries(payload);
    await prefillCollections(payload);
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: "Could not fill empty CMS page entries. Existing content was not changed.",
    });
  }
}

async function prefillCollections(payload: Payload): Promise<void> {
  // 1. Prefill FAQ Details collection
  try {
    const existingFaqs = await payload.find({
      collection: "faq-details" as any,
      limit: 100,
      depth: 0,
      overrideAccess: true,
    });
    const existingSlugs = new Set(
      existingFaqs.docs.map((doc: any) => String(doc.slug || "").trim().toLowerCase()),
    );

    // Defense-tech detail
    const defense = faqDetails["defense-tech"];
    if (defense && !existingSlugs.has("defense-tech")) {
      await payload.create({
        collection: "faq-details" as any,
        data: {
          slug: "defense-tech",
          question: defense.question,
          lead: defense.lead,
          breadcrumbCurrent: "Sevenloop Brand Website Redesign",
          sections: defense.sections.map((s) => ({
            anchor: s.id,
            title: s.title,
            body: s.body,
          })),
        },
        overrideAccess: true,
      });
      existingSlugs.add("defense-tech");
      payload.logger.info({ msg: "Prefilled FAQ Detail: defense-tech" });
    }

    // Prefill remaining faqEntries
    for (const item of faqEntries) {
      const slug = (item.detailSlug || item.id).trim().toLowerCase();
      if (!slug || existingSlugs.has(slug)) continue;

      await payload.create({
        collection: "faq-details" as any,
        data: {
          slug,
          question: item.question,
          lead: item.answer || item.question,
          breadcrumbCurrent: item.question,
          sections: [
            {
              anchor: "strategic-overview",
              title: "Strategic Overview",
              body:
                item.answer ||
                "Developing a rigorous brand framework requires direct alignment with market expectations and commercial objectives.",
            },
            {
              anchor: "messaging-positioning",
              title: "Messaging & Positioning",
              body:
                "Clear differentiation stems from translating complex technical value into unambiguous commercial incentives for enterprise decision-makers.",
            },
            {
              anchor: "execution-impact",
              title: "Execution & Commercial Impact",
              body:
                "A disciplined identity system accelerates sales velocity, elevates market perception, and establishes lasting authority across competitive sectors.",
            },
          ],
        },
        overrideAccess: true,
      });
      existingSlugs.add(slug);
    }
  } catch (err) {
    payload.logger.warn({ err, msg: "Skipped prefilling faq-details collection." });
  }

  // 2. Prefill Location Pages collection
  try {
    const existingLocations = await payload.find({
      collection: "location-pages" as any,
      where: { slug: { equals: "ahmedabad" } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    if (existingLocations.docs.length === 0) {
      await payload.create({
        collection: "location-pages" as any,
        data: {
          title: "Ahmedabad",
          slug: "ahmedabad",
          breadcrumbCurrent: ahmedabadBreadcrumbCurrent,
          heroTitle: ahmedabadHero.title,
          heroIntro: ahmedabadHero.intro,
          clientsBefore: "Design projects for ",
          clientsAccent: "Ahmedabad",
          clientsAfter: " brands",
          clientTabs: ahmedabadProjectTabs.map((tab) => ({
            tabId: tab.id,
            label: tab.label,
          })),
          projects: brandingProjects.map((p) => ({
            name: p.name,
            description: p.description,
            href: p.href,
          })),
          calloutBefore: ahmedabadCallout.before,
          calloutAccent: ahmedabadCallout.accent,
          calloutAfter: ahmedabadCallout.after,
          calloutBody: ahmedabadCallout.body,
          lead: ahmedabadLead,
          sections: ahmedabadSections.map((s) => ({
            anchor: s.id,
            tocLabel: s.tocLabel,
            headingBefore: s.before,
            headingAccent: s.accent,
            headingAfter: s.after,
            paragraphs: s.paragraphs.map((text) => ({ text })),
            blocks: (s.blocks ?? []).map((b) => ({
              title: b.title,
              paragraphs: b.paragraphs.map((text) => ({ text })),
            })),
            pointers: (s.pointers ?? []).map((p) => ({ text: p.text })),
          })),
          ctaHeadingBefore: "Ready to ",
          ctaHeadingAccent: "transform",
          ctaHeadingAfter: " your Ahmedabad brand?",
          ctaBody: ahmedabadCta.body,
          ctaButtonLabel: ahmedabadCta.button,
          ctaButtonHref: ahmedabadCta.href,
          faqs: ahmedabadFaqItems.map((f) => ({
            question: f.question,
            answer: f.answer || undefined,
          })),
          relatedBefore: "",
          relatedAccent: "Related ",
          relatedAfter: "blogs",
          relatedBlogs: relatedBlogs.map((b) => ({
            date: b.date,
            readTime: b.readTime,
            title: b.title,
            href: b.href,
          })),
        },
        overrideAccess: true,
      });
      payload.logger.info({ msg: "Prefilled Location Page: Ahmedabad" });
    }
  } catch (err) {
    payload.logger.warn({ err, msg: "Skipped prefilling location-pages collection." });
  }
}

async function fillEmptyEntries(payload: Payload): Promise<void> {
  const entries = pageEntries();
  const fingerprint = createHash("sha256")
    .update(entries.map((entry) => entry.slug).join("|"))
    .digest("hex");
  const db = payload.db as Payload["db"] & {
    pool?: { connect: () => Promise<unknown> };
  };
  if (!db.pool) return;

  const client = (await db.pool.connect()) as QueryClient;
  try {
    if ((await readFingerprint(client)) === fingerprint) return;
  } finally {
    client.release();
  }

  const filled: string[] = [];
  for (const entry of entries) {
    const current = (await payload.findGlobal({
      slug: entry.slug as "site-footer",
      depth: 0,
      overrideAccess: true,
    })) as unknown as Record<string, unknown>;
    if (hasSavedContent(current, entry.data)) continue;
    await payload.updateGlobal({
      slug: entry.slug as "site-footer",
      data: entry.data,
    } as Parameters<typeof payload.updateGlobal>[0]);
    filled.push(entry.slug);
  }

  const writer = (await db.pool.connect()) as QueryClient;
  try {
    await writeFingerprint(writer, fingerprint);
  } finally {
    writer.release();
  }

  if (filled.length) {
    payload.logger.info({
      msg: `Filled empty CMS page entries: ${filled.join(", ")}. Saved fields were kept.`,
    });
  }
}

function hasSavedContent(
  current: Record<string, unknown>,
  designed: Record<string, unknown>,
): boolean {
  return Object.entries(designed).some(([key, value]) => {
    if (value === undefined) return false;
    return !isEmpty(current[key]);
  });
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

async function readFingerprint(client: QueryClient): Promise<string | null> {
  const table = await client.query<{ exists: string | null }>(
    `SELECT to_regclass('public.payload_kv') AS exists`,
  );
  if (!table.rows[0]?.exists) return null;
  const { rows } = await client.query<{ data: { hash?: string } | null }>(
    `SELECT data FROM payload_kv WHERE key = $1 LIMIT 1`,
    [FINGERPRINT_KEY],
  );
  return rows[0]?.data?.hash ?? null;
}

async function writeFingerprint(client: QueryClient, fingerprint: string): Promise<void> {
  const table = await client.query<{ exists: string | null }>(
    `SELECT to_regclass('public.payload_kv') AS exists`,
  );
  if (!table.rows[0]?.exists) return;
  const data = JSON.stringify({ hash: fingerprint });
  const updated = await client.query(`UPDATE payload_kv SET data = $2::jsonb WHERE key = $1`, [
    FINGERPRINT_KEY,
    data,
  ]);
  if (updated.rowCount) return;
  await client.query(`INSERT INTO payload_kv (key, data) VALUES ($1, $2::jsonb)`, [
    FINGERPRINT_KEY,
    data,
  ]);
}

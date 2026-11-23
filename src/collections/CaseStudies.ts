import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type CollectionBeforeValidateHook,
  type CollectionConfig,
} from "payload";
import { caseStudyFields } from "../fields/caseStudyFields";
import { seoTab } from "../fields/seoFields";
import type { CaseStudy } from "../payload-types";

type GalleryRow = NonNullable<CaseStudy["gallery"]>[number];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const source = String(data.slug || data.title || "");
  if (source) data.slug = slugify(source);
  return data;
};

const computeCaseStudyAdminTitle: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data;
  let clientName = "";
  const clientRef = data.client;
  const clientId =
    typeof clientRef === "object" && clientRef !== null
      ? (clientRef as { id?: string | number; name?: string; slug?: string }).id
      : clientRef;

  if (typeof clientRef === "object" && clientRef !== null) {
    clientName = String((clientRef as { name?: string }).name || (clientRef as { slug?: string }).slug || "").trim();
  }
  if (!clientName && clientId != null) {
    try {
      const client = await req.payload.findByID({
        collection: "clients",
        id: clientId,
        depth: 0,
        req,
      });
      clientName = String(client?.name || client?.slug || "").trim();
    } catch {}
  }

  const studyTitle = String(data.title || data.slug || "Case study").trim();
  const autoTitle = clientName ? `${clientName} — ${studyTitle}` : studyTitle;
  if (!data.adminTitle || typeof data.adminTitle !== "string" || !data.adminTitle.trim()) {
    data.adminTitle = autoTitle;
  }
  return data;
};

const uniqueSlugPerClient: CollectionBeforeValidateHook = async ({
  data,
  req,
  originalDoc,
}) => {
  if (!data?.slug || !data?.client) return data;
  const clientId =
    typeof data.client === "object" && data.client !== null
      ? (data.client as { id?: string | number }).id
      : data.client;
  if (clientId == null) return data;

  const existing = await req.payload.find({
    collection: "case-studies",
    where: {
      and: [
        { slug: { equals: data.slug } },
        { client: { equals: clientId } },
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
    limit: 1,
    depth: 0,
    req,
  });
  if (existing.docs.length) {
    throw new APIError("This client already has a case study with that slug.", 400);
  }
  return data;
};

type MediaRef = { image?: unknown; alt?: string | null } | null | undefined;

function filled(value: unknown): boolean {
  return value != null && value !== "";
}

/** Hidden layout fields are omitted on save. Put the previous file back. */
const preserveHiddenMedia: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data;

  const prevHero = originalDoc?.hero;
  if (data.hero && prevHero) {
    if (data.hero.layout === "split") {
      if (!filled(data.hero.image?.image) && filled(prevHero.image?.image)) {
        data.hero.image = prevHero.image;
      }
    } else {
      if (!filled(data.hero.left?.image) && filled(prevHero.left?.image)) {
        data.hero.left = prevHero.left;
      }
      if (!filled(data.hero.right?.image) && filled(prevHero.right?.image)) {
        data.hero.right = prevHero.right;
      }
    }
  }

  if (Array.isArray(data.gallery) && Array.isArray(originalDoc?.gallery)) {
    const savedGallery = originalDoc.gallery as GalleryRow[];
    const previous = new Map(
      savedGallery
        .filter((row): row is GalleryRow & { id: string } => Boolean(row?.id))
        .map((row) => [String(row.id), row]),
    );
    data.gallery = (data.gallery as GalleryRow[]).map((row) => {
      if (!row?.id) return row;
      const old = previous.get(String(row.id));
      if (!old) return row;
      if (row.layout === "split") {
        if (!filled(row.image) && filled(old.image)) row.image = old.image;
        if (!filled(row.alt) && filled(old.alt)) row.alt = old.alt;
      } else {
        const left = row.left as MediaRef;
        const right = row.right as MediaRef;
        const oldLeft = old.left as MediaRef;
        const oldRight = old.right as MediaRef;
        if (!filled(left?.image) && filled(oldLeft?.image)) row.left = old.left;
        if (!filled(right?.image) && filled(oldRight?.image)) row.right = old.right;
      }
      return row;
    });
  }

  return data;
};

const revalidatePublishedStudy: CollectionAfterChangeHook = async ({ doc, req }) => {
  try {
    const clientRef = doc.client;
    let clientSlug =
      typeof clientRef === "object" && clientRef !== null
        ? (clientRef as { slug?: string }).slug
        : undefined;
    const clientId =
      typeof clientRef === "object" && clientRef !== null
        ? (clientRef as { id?: string | number }).id
        : clientRef;
    if (!clientSlug && clientId != null) {
      const client = await req.payload.findByID({
        collection: "clients",
        id: clientId,
        depth: 0,
        req,
      });
      clientSlug = client.slug;
    }
    if (clientSlug && doc.slug) {
      const { revalidatePath } = await import("next/cache");
      revalidatePath(`/clients/${clientSlug}/${doc.slug}`);
    }
  } catch {
    // Seed and scripts run outside a Next.js request.
  }
  return doc;
};

const syncCaseStudyToClient: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipFeaturedAttach && context?.skipHeroSync) return doc;
  const clientRef = doc.client;
  const clientId =
    typeof clientRef === "object" && clientRef !== null
      ? (clientRef as { id?: string | number }).id
      : clientRef;
  if (clientId == null) return doc;

  try {
    const client = await req.payload.findByID({
      collection: "clients",
      id: clientId,
      depth: 0,
      req,
    });
    if (!client) return doc;

    const dataToUpdate: Record<string, unknown> = {};

    // 1. Attach as featuredStudy for direct clients if empty
    if (!context?.skipFeaturedAttach && client.projectType === "direct" && !client.featuredStudy) {
      dataToUpdate.featuredStudy = doc.id;
    }

    // 2. Sync hero to placements if needed
    if (!context?.skipHeroSync) {
      const heroImageId =
        doc.hero?.layout === "split"
          ? (typeof doc.hero?.left?.image === "object" && doc.hero?.left?.image !== null
              ? (doc.hero.left.image as { id?: string | number }).id
              : doc.hero?.left?.image) ||
            (typeof doc.hero?.right?.image === "object" && doc.hero?.right?.image !== null
              ? (doc.hero.right.image as { id?: string | number }).id
              : doc.hero?.right?.image)
          : typeof doc.hero?.image?.image === "object" && doc.hero?.image?.image !== null
            ? (doc.hero.image.image as { id?: string | number }).id
            : doc.hero?.image?.image;

      const heroHeading = String(doc.hero?.heading || doc.title || "").trim();

      const placements = (client.placements || {}) as Record<string, Record<string, unknown>>;
      let modified = false;

      const updatePlacement = (
        key: "clientsPage" | "workPage" | "featuredProject" | "portfolioItem",
        defaults: { image?: unknown; service?: string },
      ) => {
        const current = placements[key] || {};
        const updated = { ...current };
        let changed = false;

        if (defaults.image != null && !current.image) {
          updated.image = defaults.image;
          changed = true;
        }
        if (defaults.service && !current.service) {
          updated.service = defaults.service;
          changed = true;
        }

        if (changed) {
          placements[key] = updated;
          modified = true;
        }
      };

      if (heroImageId != null) {
        updatePlacement("clientsPage", { image: heroImageId, service: heroHeading });
        updatePlacement("workPage", { image: heroImageId, service: heroHeading });
        updatePlacement("featuredProject", { image: heroImageId });
        updatePlacement("portfolioItem", { image: heroImageId });
      } else if (heroHeading) {
        updatePlacement("clientsPage", { service: heroHeading });
        updatePlacement("workPage", { service: heroHeading });
      }

      if (modified) {
        dataToUpdate.placements = placements;
      }
    }

    if (Object.keys(dataToUpdate).length > 0) {
      // Single direct DB update in the same transaction — eliminates connection deadlocks.
      await req.payload.db.updateOne({
        collection: "clients",
        id: clientId,
        data: dataToUpdate,
        req,
      });
    }
  } catch (err) {
    // Under NO circumstances should secondary client placement sync fail the case study save.
    req.payload.logger.error({
      err,
      msg: `Could not sync case study ${doc.id} to client ${clientId}`,
    });
  }

  return doc;
};

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case study", plural: "Case studies" },
  admin: {
    group: "Work",
    useAsTitle: "adminTitle",
    defaultColumns: ["adminTitle", "client", "slug", "updatedAt"],
    description:
      "Belongs to a Client. Hub clients can have many; a Direct client usually has one.",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug, computeCaseStudyAdminTitle, uniqueSlugPerClient],
    beforeChange: [preserveHiddenMedia],
    afterChange: [syncCaseStudyToClient],
  },
  fields: [
    {
      name: "adminTitle",
      label: "Display Name (Lists & Select)",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          "Shown in lists and dropdowns (e.g. Puma — Logo Design). Auto-generated from Client and Title if left empty.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Case Study",
          fields: [
            { name: "title", type: "text", required: true },
            {
              name: "slug",
              type: "text",
              required: true,
              index: true,
              admin: {
                description:
                  "URL: /clients/{client}/{slug}. Example: case-study, website, branding.",
              },
            },
            {
              name: "client",
              type: "relationship",
              relationTo: "clients",
              required: true,
              admin: {
                description:
                  "The brand this study belongs to. If the Client does not exist yet, create and save it first — leave Featured study empty. After you save this Case study, Direct clients pick it up automatically.",
                // Required stays on for the form. The condition keeps the Postgres column
                // nullable so deleting a client clears this link instead of leaving an id
                // the admin cannot open.
                condition: () => true,
              },
            },
            ...caseStudyFields,
          ],
        },
        seoTab,
      ],
    },
  ],
};

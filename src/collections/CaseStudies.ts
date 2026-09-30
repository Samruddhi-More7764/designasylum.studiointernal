import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type CollectionBeforeValidateHook,
  type CollectionConfig,
} from "payload";
import { caseStudyFields } from "../fields/caseStudyFields";

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
    const previous = new Map(
      originalDoc.gallery
        .filter((row) => row?.id)
        .map((row) => [String(row.id), row]),
    );
    data.gallery = data.gallery.map((row) => {
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

const attachAsFeaturedIfNeeded: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipFeaturedAttach) return doc;
  const clientRef = doc.client;
  const clientId =
    typeof clientRef === "object" && clientRef !== null
      ? (clientRef as { id?: string | number }).id
      : clientRef;
  if (clientId == null) return doc;

  const client = await req.payload.findByID({
    collection: "clients",
    id: clientId,
    depth: 0,
  });
  if (client.projectType !== "direct" || client.featuredStudy) return doc;

  // Direct DB write — avoid nested payload.update() deadlock on uncommitted study.
  try {
    await req.payload.db.updateOne({
      collection: "clients",
      id: clientId,
      data: { featuredStudy: doc.id },
      req,
    });
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Could not set featuredStudy on client ${clientId} for case study ${doc.id}`,
    });
  }

  return doc;
};

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case study", plural: "Case studies" },
  admin: {
    group: "Work",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "client"],
    description:
      "Belongs to a Client. Hub clients can have many; a Direct client usually has one.",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug, uniqueSlugPerClient],
    beforeChange: [preserveHiddenMedia],
    afterChange: [attachAsFeaturedIfNeeded, revalidatePublishedStudy],
  },
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
      },
    },
    ...caseStudyFields,
  ],
};

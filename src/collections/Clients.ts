import type {
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
} from "payload";
import { clientHubFields } from "../fields/clientHubFields";
import { clientPlacementsFields } from "../fields/clientPlacementsFields";
import { syncClientPlacementsAfterChange } from "../cms/hooks/syncClientPlacements";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const source = String(data.slug || data.name || "");
  if (source) data.slug = slugify(source);
  return data;
};

const computeClientAdminTitle: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data;
  const name = String(data.name || data.slug || "Client").trim();
  const type = data.projectType === "hub" ? "Hub" : "Direct";
  let studyTitle = "";
  const studyRef = data.featuredStudy;
  const studyId =
    typeof studyRef === "object" && studyRef !== null
      ? (studyRef as { id?: string | number; title?: string }).id
      : studyRef;
  if (typeof studyRef === "object" && studyRef !== null && "title" in studyRef) {
    studyTitle = String((studyRef as { title?: string }).title || "").trim();
  }
  if (!studyTitle && studyId != null) {
    try {
      const study = await req.payload.findByID({
        collection: "case-studies",
        id: studyId,
        depth: 0,
        req,
      });
      studyTitle = String(study?.title || study?.slug || "").trim();
    } catch {}
  }

  let autoTitle = "";
  if (type === "Hub") {
    autoTitle = `${name} (Client Hub)`;
  } else if (studyTitle) {
    autoTitle = `${name} — ${studyTitle}`;
  } else {
    autoTitle = `${name} (${type})`;
  }

  if (!data.adminTitle || typeof data.adminTitle !== "string" || !data.adminTitle.trim()) {
    data.adminTitle = autoTitle;
  }
  return data;
};

const autoPopulatePlacements: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data;

  data.placements = data.placements || {};
  const placements = data.placements as Record<string, Record<string, unknown>>;

  // If new client, ensure clientsPage and workPage are enabled by default
  if (!originalDoc) {
    placements.clientsPage = placements.clientsPage || {};
    if (placements.clientsPage.enabled === undefined) {
      placements.clientsPage.enabled = true;
    }
    placements.workPage = placements.workPage || {};
    if (placements.workPage.enabled === undefined) {
      placements.workPage.enabled = true;
    }
  }

function extractMediaId(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === "object") {
    if ("id" in value && (value as { id: unknown }).id != null) {
      return extractMediaId((value as { id: unknown }).id);
    }
    if ("image" in value && (value as { image: unknown }).image != null) {
      return extractMediaId((value as { image: unknown }).image);
    }
  }
  return null;
}

  // 1. Check for hero image from client's own hero field (Client Hub)
  let heroImageId: number | null = extractMediaId(data.hero?.image);
  let heroHeading = String(data.hero?.heading || "").trim();

  // 2. If no hero image yet, look up linked case study (featured study or any study assigned to this client)
  const studyId = extractMediaId(data.featuredStudy);
  const clientId = data.id || (originalDoc as { id?: unknown } | undefined)?.id;

  if (!heroImageId) {
    try {
      let study: Record<string, unknown> | null = null;
      if (studyId) {
        study = (await req.payload.findByID({
          collection: "case-studies",
          id: studyId,
          depth: 0,
          req,
        })) as unknown as Record<string, unknown>;
      }
      if (!study && clientId) {
        const found = await req.payload.find({
          collection: "case-studies",
          where: { client: { equals: clientId } },
          limit: 1,
          depth: 0,
          req,
        });
        study = (found.docs[0] as unknown as Record<string, unknown>) || null;
      }
      if (study) {
        const studyHero = study.hero as {
          layout?: string;
          left?: unknown;
          right?: unknown;
          image?: unknown;
          heading?: string;
        } | undefined;
        const candidateLeft = extractMediaId(studyHero?.left);
        const candidateRight = extractMediaId(studyHero?.right);
        const candidateImg = extractMediaId(studyHero?.image);
        heroImageId =
          studyHero?.layout === "split"
            ? candidateLeft || candidateRight || candidateImg
            : candidateImg || candidateLeft || candidateRight;
        if (!heroHeading) {
          heroHeading = String(studyHero?.heading || study.title || "").trim();
        }
      }
    } catch {
      // Study lookup skipped
    }
  }

  const defaultService = heroHeading || String(data.name || "").trim();

  const updateIfEmpty = (
    key: "clientsPage" | "workPage" | "featuredProject" | "portfolioItem",
    opts: { image?: unknown; service?: string },
  ) => {
    placements[key] = placements[key] || {};
    const target = placements[key];
    if (opts.image != null && !target.image) {
      target.image = opts.image;
    }
    if (opts.service && !target.service) {
      target.service = opts.service;
    }
  };

  if (heroImageId != null) {
    updateIfEmpty("clientsPage", { image: heroImageId, service: defaultService });
    updateIfEmpty("workPage", { image: heroImageId, service: defaultService });
    updateIfEmpty("featuredProject", { image: heroImageId });
    updateIfEmpty("portfolioItem", { image: heroImageId });
  } else if (defaultService) {
    updateIfEmpty("clientsPage", { service: defaultService });
    updateIfEmpty("workPage", { service: defaultService });
  }

  return data;
};

export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Client", plural: "Clients" },
  admin: {
    group: "Work",
    useAsTitle: "adminTitle",
    defaultColumns: ["adminTitle", "slug", "projectType", "updatedAt"],
    description:
      "One record per brand. Hub = 2+ projects (library). Direct = one project, skip hub.",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [ensureSlug, computeClientAdminTitle],
    beforeChange: [autoPopulatePlacements],
    afterChange: [syncClientPlacementsAfterChange],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Brand & Hub",
          fields: [
            {
              name: "adminTitle",
              label: "Display Name (Lists & Select)",
              type: "text",
              admin: {
                position: "sidebar",
                description:
                  "Shown in lists and dropdowns (e.g. Puma (Direct) or Sevenloop (Client Hub)). Auto-generated if left empty.",
              },
            },
            { name: "name", type: "text", required: true },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              index: true,
              admin: {
                description: "URL: /clients/{slug}. Example: sevenloop, puma.",
              },
            },
            {
              name: "projectType",
              type: "radio",
              required: true,
              defaultValue: "direct",
              options: [
                {
                  label:
                    "Client hub — 2+ projects; homepage opens the library; hub sections open case studies",
                  value: "hub",
                },
                {
                  label:
                    "Direct case study — one project; homepage skips the hub and opens the study",
                  value: "direct",
                },
              ],
              admin: {
                description:
                  "Homepage cards follow this. Hub = library. Direct = one study. If creating from a Case study, save the Client first — Featured study fills in after the study is saved.",
              },
            },
            {
              name: "featuredStudy",
              type: "relationship",
              relationTo: "case-studies",
              admin: {
                condition: (_data, siblingData: { projectType?: string }) =>
                  siblingData?.projectType === "direct",
                allowCreate: false,
                description:
                  "Homepage opens this study when Project type is Direct. Create the Case study first (or save this Client, then the study) — do not create a study from this field.",
              },
              // No filterOptions: CaseStudies.afterChange sets this in the same
              // transaction; Payload filter validation cannot see the new study yet.
            },
            ...clientHubFields,
          ],
        },
        {
          label: "Website Placements",
          fields: clientPlacementsFields,
        },
      ],
    },
  ],
};

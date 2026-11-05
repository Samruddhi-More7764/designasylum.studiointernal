import type { CollectionBeforeValidateHook, Payload } from "payload";

/**
 * Autofill helper for Logos array in blueprint page collections.
 */
export async function autofillBlueprintLogos(
  logos: unknown,
  payload: Payload,
): Promise<void> {
  if (!Array.isArray(logos)) return;

  for (const row of logos) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    if (!item.clientLogo) continue;

    const logoId =
      typeof item.clientLogo === "object" && item.clientLogo !== null && "id" in item.clientLogo
        ? (item.clientLogo as { id: string | number }).id
        : (item.clientLogo as string | number);
    if (!logoId) continue;

    if (!item.image || !item.name) {
      try {
        const logoDoc = await payload.findByID({
          collection: "client-logos",
          id: logoId,
          depth: 0,
        });
        if (logoDoc) {
          if (!item.image && logoDoc.image) item.image = logoDoc.image;
          if (!item.name && logoDoc.name) item.name = logoDoc.name;
        }
      } catch {
        // ignore lookup error
      }
    }
  }
}

/**
 * Autofill helper for Projects array (Clients tab) in blueprint page collections.
 */
export async function autofillBlueprintProjects(
  projects: unknown,
  payload: Payload,
): Promise<void> {
  if (!Array.isArray(projects)) return;

  for (let i = 0; i < projects.length; i++) {
    const row = projects[i];
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;

    if (item.order == null) item.order = i;

    // Synchronize heading <-> name and category <-> tab for cross-collection compatibility
    if (item.heading && !item.name) item.name = item.heading;
    if (item.name && !item.heading) item.heading = item.name;
    if (item.category && !item.tab) item.tab = item.category;
    if (item.tab && !item.category) item.category = item.tab;

    if (!item.client) continue;

    const clientId =
      typeof item.client === "object" && item.client !== null && "id" in item.client
        ? (item.client as { id: string | number }).id
        : (item.client as string | number);
    if (!clientId) continue;

    if (!item.heading || !item.name || !item.image || !item.description || !item.href) {
      try {
        const clientDoc = await payload.findByID({
          collection: "clients",
          id: clientId,
          depth: 0,
        });
        if (clientDoc) {
          if (!item.heading && clientDoc.name) item.heading = clientDoc.name;
          if (!item.name && clientDoc.name) item.name = clientDoc.name;
          const heroImg = clientDoc.hero?.image;
          if (!item.image && heroImg) item.image = heroImg;
          if (!item.description) {
            item.description =
              clientDoc.adminTitle || clientDoc.hero?.subheading || clientDoc.hero?.heading || "";
          }
          if (clientDoc.slug) {
            const cleanSlug = clientDoc.slug.replace(/^\/+|\/+$/g, "").trim();
            item.href = `/clients/${cleanSlug}`;
          }
        }
      } catch {
        // ignore lookup error
      }
    }
  }
}

/**
 * Autofill helper for Experts array in blueprint page collections.
 */
export async function autofillBlueprintExperts(
  experts: unknown,
  payload: Payload,
): Promise<void> {
  if (!Array.isArray(experts)) return;

  for (const row of experts) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    if (!item.member) continue;

    const memberId =
      typeof item.member === "object" && item.member !== null && "id" in item.member
        ? (item.member as { id: string | number }).id
        : (item.member as string | number);
    if (!memberId) continue;

    if (!item.name || !item.role || !item.image) {
      try {
        const memberDoc = await payload.findByID({
          collection: "team-members",
          id: memberId,
          depth: 0,
        });
        if (memberDoc) {
          if (!item.name && memberDoc.name) item.name = memberDoc.name;
          if (!item.role && memberDoc.role) item.role = memberDoc.role;
          if (!item.image) {
            const defaultPhoto = memberDoc.photoOne || memberDoc.photoTwo;
            if (defaultPhoto) item.image = defaultPhoto;
          }
        }
      } catch {
        // ignore lookup error
      }
    }
  }
}

/**
 * Autofill helper for Related Blogs array in blueprint page collections.
 */
export async function autofillBlueprintRelatedBlogs(
  relatedBlogs: unknown,
  payload: Payload,
): Promise<void> {
  if (!Array.isArray(relatedBlogs)) return;

  for (const row of relatedBlogs) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    if (!item.post) continue;

    const postId =
      typeof item.post === "object" && item.post !== null && "id" in item.post
        ? (item.post as { id: string | number }).id
        : (item.post as string | number);
    if (!postId) continue;

    if (!item.image || !item.title || !item.date || !item.readTime) {
      try {
        const postDoc = await payload.findByID({
          collection: "blog-posts",
          id: postId,
          depth: 0,
        });
        if (postDoc) {
          if (!item.image) {
            const defaultImg = postDoc.heroImage || postDoc.image;
            if (defaultImg) item.image = defaultImg;
          }
          if (!item.title && postDoc.title) item.title = postDoc.title;
          if (!item.date && postDoc.date) item.date = postDoc.date;
          if (!item.readTime && postDoc.readTime) item.readTime = postDoc.readTime;
        }
      } catch {
        // ignore lookup error
      }
    }
  }
}

/**
 * Master beforeValidate hook for blueprint page collections:
 * IndustryPages, ServicePages, SolutionPages, and WorkServicePages.
 */
export const autofillBlueprintFields: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data || !req?.payload) return data;

  await autofillBlueprintLogos(data.logos, req.payload);
  await autofillBlueprintProjects(data.projects, req.payload);
  await autofillBlueprintExperts(data.experts, req.payload);
  await autofillBlueprintRelatedBlogs(data.relatedBlogs, req.payload);

  return data;
};


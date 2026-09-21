/** URL helpers for Client hub vs Direct case study routing. */

export function clientHubPath(clientSlug: string) {
  return `/clients/${clientSlug}`;
}

export function caseStudyPath(clientSlug: string, studySlug: string) {
  return `/clients/${clientSlug}/${studySlug}`;
}

type RelDoc = { slug?: string | null; id?: string | number } | string | number | null | undefined;

export function relatedSlug(value: RelDoc): string | null {
  if (value == null) return null;
  if (typeof value === "object") return value.slug?.trim() || null;
  return null;
}

export function relatedId(value: RelDoc): string | number | null {
  if (value == null) return null;
  if (typeof value === "object") return value.id ?? null;
  return value;
}

type ClientLike = {
  slug?: string | null;
  projectType?: "hub" | "direct" | null;
  featuredStudy?: RelDoc;
};

/** Homepage / card target for a Client document. */
export function resolvedClientHref(
  client: ClientLike | null | undefined,
  fallbackStudySlug?: string | null,
): string | null {
  const slug = client?.slug?.trim();
  if (!slug) return null;

  if (client?.projectType === "hub") {
    return clientHubPath(slug);
  }

  const studySlug = relatedSlug(client?.featuredStudy) || fallbackStudySlug?.trim();
  if (studySlug) return caseStudyPath(slug, studySlug);
  // Direct with no study yet — hub path redirects once a study exists.
  return clientHubPath(slug);
}

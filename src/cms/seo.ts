import type { Metadata } from "next";
import { resolveMediaUrl } from "./media";

export type SeoInput = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: unknown;
  noIndex?: boolean | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

export function buildMetadata({
  metaTitle,
  metaDescription,
  ogImage,
  noIndex,
  fallbackTitle,
  fallbackDescription,
}: SeoInput): Metadata {
  const title = metaTitle?.trim() || fallbackTitle;
  const description = metaDescription?.trim() || fallbackDescription;
  const imageUrl = resolveMediaUrl(ogImage);

  const metadata: Metadata = {};

  if (title) {
    metadata.title = title;
  }

  if (description) {
    metadata.description = description;
  }

  if (title || description || imageUrl) {
    metadata.openGraph = {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    };

    metadata.twitter = {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(imageUrl ? { images: [imageUrl] } : {}),
    };
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}


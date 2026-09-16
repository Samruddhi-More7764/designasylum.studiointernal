/**
 * Turn a Payload upload, a leftover `/assets/...` path, or a populated Media
 * doc into a URL the frontend can pass to next/image or <video>.
 *
 * Same-origin Payload URLs (http://localhost:3000/api/media/file/...) are
 * rewritten to a path so next/image treats them as local.
 */
export function resolveMediaUrl(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("/") || trimmed.startsWith("http")) {
      return toNextImageSrc(trimmed);
    }
    return null;
  }

  if (typeof value === "object") {
    const url = "url" in value ? (value as { url?: string | null }).url : null;
    const trimmed = url?.trim();
    if (trimmed) return toNextImageSrc(trimmed);
  }

  return null;
}

function toNextImageSrc(url: string): string {
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    const configured = process.env.NEXT_PUBLIC_SERVER_URL;
    const sameOrigin =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      (configured ? parsed.origin === new URL(configured).origin : false);

    if (sameOrigin) return `${parsed.pathname}${parsed.search}`;
    return url;
  } catch {
    return url;
  }
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i;

export function isVideoSrc(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    return VIDEO_EXT.test(new URL(url, "http://local.invalid").pathname);
  } catch {
    return VIDEO_EXT.test(url);
  }
}

export function isVideoMedia(value: unknown): boolean {
  if (value && typeof value === "object" && "mimeType" in value) {
    const mime = (value as { mimeType?: string | null }).mimeType || "";
    if (mime.startsWith("video/")) return true;
  }
  return isVideoSrc(resolveMediaUrl(value));
}

export function resolveMediaAlt(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const alt = "alt" in value ? (value as { alt?: string | null }).alt : null;
  return alt?.trim() || null;
}

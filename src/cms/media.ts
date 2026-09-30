/**
 * Turn a Payload upload, a leftover `/assets/...` path, or a populated Media
 * doc into a URL the frontend can pass to next/image or <video>.
 *
 * Priority is deliberately conditional, not a fixed order:
 *   1. Seeded record whose file was never replaced -> its `public/` asset.
 *   2. A real CMS upload, when Blob is configured -> the public Blob URL.
 *   3. Anything else -> the stored upload `url`.
 *
 * Reason: Payload stores `/api/media/file/...` even after the bytes are in
 * Vercel Blob. That route has no file on Vercel's disk, so next/image 500s.
 * Seeded records must keep their bundled asset. Editor uploads must use the
 * Blob object, which is named with the media `filename`.
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
    const sourcePath =
      "sourcePath" in value
        ? (value as { sourcePath?: string | null }).sourcePath?.trim()
        : null;
    const filename =
      "filename" in value
        ? (value as { filename?: string | null }).filename?.trim()
        : null;

    // A seeded record still pointing at its original public/ file: serve that.
    // Without object storage configured, `/api/media/file/...` has no bytes to
    // return on Vercel (serverless disk is empty on every cold start), so the
    // bundled asset is the only thing that actually resolves.
    //
    // Once an editor replaces the file, `filename` no longer matches the seeded
    // path's basename — that means a real upload exists and should win.
    if (sourcePath?.startsWith("/")) {
      const seededName = sourcePath.split("/").pop();
      if (!seededName || !filename || !isReplacedUpload(filename, seededName)) {
        return toNextImageSrc(sourcePath);
      }
    }

    const url = "url" in value ? (value as { url?: string | null }).url : null;
    const trimmed = url?.trim();
    if (trimmed) {
      const uploadedName = filename || payloadMediaFilename(trimmed);
      if (uploadedName && payloadMediaFilename(trimmed)) {
        const blobUrl = publicBlobUrl(uploadedName);
        if (blobUrl) return blobUrl;
      }
      return toNextImageSrc(trimmed);
    }

    // Replaced file but the upload URL is unavailable — fall back rather than
    // render nothing.
    if (sourcePath?.startsWith("/")) return toNextImageSrc(sourcePath);
  }

  return null;
}

/**
 * True when `filename` looks like a genuinely different file from the seeded
 * one, rather than Payload's own de-duplication suffix.
 *
 * The seed reuses one source file for several records (e.g. team-member.jpg for
 * three team slots), and Payload stores the extras as `team-member-1.jpg`.
 * Those are still the seeded image, so they must keep using `sourcePath`.
 */
function isReplacedUpload(filename: string, seededName: string): boolean {
  if (filename === seededName) return false;

  const strip = (name: string) => {
    const dot = name.lastIndexOf(".");
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : "";
    return { stem: stem.replace(/-\d+$/, ""), ext };
  };

  const a = strip(filename);
  const b = strip(seededName);
  return a.stem !== b.stem || a.ext !== b.ext;
}

/** Filename stored on a Payload `/api/media/file/<name>` URL, or null. */
function payloadMediaFilename(url: string): string | null {
  try {
    const parsed = url.startsWith("/")
      ? new URL(url, "http://local.invalid")
      : new URL(url);
    const marker = "/api/media/file/";
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    const name = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    return name || null;
  } catch {
    return null;
  }
}

/**
 * Public URL for a Blob object uploaded under `filename`.
 * Matches `@payloadcms/storage-vercel-blob` (store id parsed from the token,
 * filename passed through encodeURIComponent).
 */
function publicBlobUrl(filename: string): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const storeId = token
    .match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]
    ?.toLowerCase();
  if (!storeId && !process.env.STORAGE_VERCEL_BLOB_BASE_URL) return null;
  const base =
    process.env.STORAGE_VERCEL_BLOB_BASE_URL ||
    `https://${storeId}.public.blob.vercel-storage.com`;
  return `${base.replace(/\/$/, "")}/${encodeURIComponent(filename)}`;
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
const GIF_EXT = /\.gif(\?|$)/i;

export function isVideoSrc(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    return VIDEO_EXT.test(new URL(url, "http://local.invalid").pathname);
  } catch {
    return VIDEO_EXT.test(url);
  }
}

export function isGifSrc(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    return GIF_EXT.test(new URL(url, "http://local.invalid").pathname);
  } catch {
    return GIF_EXT.test(url);
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

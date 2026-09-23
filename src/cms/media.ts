/**
 * Turn a Payload upload, a leftover `/assets/...` path, or a populated Media
 * doc into a URL the frontend can pass to next/image or <video>.
 *
 * Priority is deliberately conditional, not a fixed order:
 *   1. Seeded record whose file was never replaced -> its `public/` asset.
 *   2. Anything else -> the upload `url`.
 *
 * Reason: `/api/media/file/...` only serves bytes when object storage is
 * configured (BLOB_READ_WRITE_TOKEN). Without it, Vercel's serverless disk is
 * empty on every cold start and that route 404s, so seeded records must keep
 * using their bundled asset. Preferring `url` unconditionally 404s the whole
 * site; preferring `sourcePath` unconditionally ignores editor uploads.
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
    if (trimmed) return toNextImageSrc(trimmed);

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

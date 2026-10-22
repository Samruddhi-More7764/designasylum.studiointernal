import { existsSync } from "node:fs";
import path from "node:path";
import { resolveMediaUrl, publicBlobUrl } from "@/cms/media";

const mediaDir = path.join(process.cwd(), "media");

/** Return the resolved media URL if available on disk or blob, otherwise the fallback path. */
export function storedImage(upload: unknown, fallback: string): string {
  const src = resolveMediaUrl(upload);
  if (!src) return fallback;
  if (!src.startsWith("/api/media/file/")) return src;

  const filename = decodeURIComponent(src.slice("/api/media/file/".length).split("?")[0]);
  const onDisk = path.basename(filename);
  if (onDisk && existsSync(path.join(mediaDir, onDisk))) return src;

  const blobUrl = publicBlobUrl(filename);
  if (blobUrl) return blobUrl;

  if (upload && typeof upload === "object" && "sourcePath" in upload) {
    const sourcePath = (upload as { sourcePath?: string | null }).sourcePath?.trim();
    if (sourcePath?.startsWith("/")) return sourcePath;
  }

  return fallback;
}

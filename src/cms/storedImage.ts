import { existsSync } from "node:fs";
import path from "node:path";
import { resolveMediaUrl } from "@/cms/media";

/** Prefer an uploaded file that exists on disk, otherwise the designed public path. */
export function storedImage(upload: unknown, fallback: string): string {
  const src = resolveMediaUrl(upload);
  if (!src) return fallback;
  if (!src.startsWith("/api/media/file/")) return src;
  const filename = decodeURIComponent(src.slice("/api/media/file/".length).split("?")[0]);
  const onDisk = path.join(process.cwd(), "media", path.basename(filename));
  return existsSync(onDisk) ? src : fallback;
}

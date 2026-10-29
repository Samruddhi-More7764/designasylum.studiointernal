import { existsSync, createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { publicBlobUrl } from "@/cms/media";
import { getPayloadClient } from "@/cms/getPayload";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

type Props = {
  params: Promise<{ filename: string[] }>;
};

function isInternalMediaUrl(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed.includes("/api/media/file/") || trimmed.startsWith("/api/media/file/")) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.includes("/api/media/file/")) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
}

async function serveLocalFile(filePath: string, label: string) {
  const fileStat = await stat(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  const nodeStream = createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  console.log(`[media-route] serving from ${label}: ${path.basename(filePath)}`);
  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": fileStat.size.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function GET(request: Request, { params }: Props) {
  const resolved = await params;
  const rawSegments = resolved.filename || [];
  if (!rawSegments.length) {
    return new NextResponse("File not specified", { status: 400 });
  }

  const rawPath = rawSegments.join("/");
  let filename = rawPath;
  try {
    filename = decodeURIComponent(rawPath);
  } catch {
    // Keep rawPath if decoding fails
  }

  console.log(`[media-route] GET /api/media/file/${filename}`);

  // 1. Check local disk (for local development or seeded media files)
  const onDiskName = path.basename(filename);
  let localFilePath = path.join(process.cwd(), "media", onDiskName);

  if (!existsSync(localFilePath) && /-\d+\.[^.]+$/.test(onDiskName)) {
    const baseName = onDiskName.replace(/-\d+(\.[^.]+)$/, "$1");
    const baseFilePath = path.join(process.cwd(), "media", baseName);
    if (existsSync(baseFilePath)) {
      localFilePath = baseFilePath;
    }
  }

  if (existsSync(localFilePath)) {
    try {
      return await serveLocalFile(localFilePath, "local disk");
    } catch {
      // Fall through to Blob resolution on stream failure
    }
  }

  // 2. Resolve to Vercel Blob CDN if token is available
  let blobUrl = publicBlobUrl(filename);
  if (blobUrl) {
    console.log(`[media-route] resolving blob CDN: ${blobUrl.slice(0, 80)}`);
    try {
      let blobRes = await fetch(blobUrl, { signal: AbortSignal.timeout(5000) });

      // If the file returned 404 and has a Payload de-duplication suffix like image-1.png or image-6.png,
      // try the base filename (image.png) in Blob storage.
      if (!blobRes.ok && /-\d+\.[^.]+$/.test(filename)) {
        const baseFilename = filename.replace(/-\d+(\.[^.]+)$/, "$1");
        const fallbackUrl = publicBlobUrl(baseFilename);
        if (fallbackUrl) {
          const fallbackRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(5000) });
          if (fallbackRes.ok && fallbackRes.body) {
            blobUrl = fallbackUrl;
            blobRes = fallbackRes;
          }
        }
      }

      if (blobRes.ok && blobRes.body) {
        const headers = new Headers();
        headers.set(
          "Content-Type",
          blobRes.headers.get("Content-Type") ||
            MIME_TYPES[path.extname(filename).toLowerCase()] ||
            "application/octet-stream",
        );
        const len = blobRes.headers.get("Content-Length");
        if (len) headers.set("Content-Length", len);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        return new NextResponse(blobRes.body as ReadableStream, {
          status: 200,
          headers,
        });
      }
    } catch (err) {
      console.warn(`[media-route] direct blob fetch failed for ${filename}:`, err);
    }
  }

  // 3. Fallback: Query Payload database for media record with exact Blob URL (handles addRandomSuffix)
  try {
    const payload = await getPayloadClient();
    if (payload) {
      const mediaResult = await payload.find({
        collection: "media",
        where: { filename: { equals: filename } },
        limit: 1,
        depth: 0,
      });
      const doc = mediaResult.docs[0];
      if (doc) {
        // If the record has a sourcePath pointing to a bundled file in public/, serve it.
        const sourcePath =
          "sourcePath" in doc && typeof doc.sourcePath === "string"
            ? doc.sourcePath.trim()
            : null;
        if (sourcePath?.startsWith("/")) {
          const publicFilePath = path.join(process.cwd(), "public", sourcePath.replace(/^\//, ""));
          if (existsSync(publicFilePath)) {
            try {
              return await serveLocalFile(publicFilePath, "public asset (sourcePath)");
            } catch {
              // Fall through
            }
          }
        }

        const storedUrl = doc.url;
        // Only fetch or redirect if storedUrl is a genuine external CDN (NOT our own /api/media/file/ route).
        if (
          storedUrl &&
          (storedUrl.startsWith("http://") || storedUrl.startsWith("https://")) &&
          !isInternalMediaUrl(storedUrl)
        ) {
          console.log(`[media-route] found remote CDN URL in DB: ${storedUrl.slice(0, 80)}`);
          try {
            const dbRes = await fetch(storedUrl, { signal: AbortSignal.timeout(5000) });
            if (dbRes.ok && dbRes.body) {
              const headers = new Headers();
              headers.set(
                "Content-Type",
                dbRes.headers.get("Content-Type") ||
                  MIME_TYPES[path.extname(filename).toLowerCase()] ||
                  "application/octet-stream",
              );
              const len = dbRes.headers.get("Content-Length");
              if (len) headers.set("Content-Length", len);
              headers.set("Cache-Control", "public, max-age=31536000, immutable");
              return new NextResponse(dbRes.body as ReadableStream, {
                status: 200,
                headers,
              });
            }
            return NextResponse.redirect(storedUrl, 307);
          } catch (fetchErr) {
            console.warn(`[media-route] remote CDN fetch failed for ${filename}:`, fetchErr);
          }
        }
      }
    }
  } catch (dbErr) {
    console.warn(`[media-route] payload lookup failed for ${filename}:`, dbErr);
  }

  console.warn(`[media-route] 404 — file not found on disk, blob, or database: ${filename}`);
  return new NextResponse("File not found", { status: 404 });
}


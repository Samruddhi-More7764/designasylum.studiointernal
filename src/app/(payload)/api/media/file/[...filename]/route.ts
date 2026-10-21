import { existsSync, createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { publicBlobUrl } from "@/cms/media";

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

  // 1. Check local disk (for local development or seeded media files)
  const onDiskName = path.basename(filename);
  const localFilePath = path.join(process.cwd(), "media", onDiskName);

  if (existsSync(localFilePath)) {
    try {
      const fileStat = await stat(localFilePath);
      const ext = path.extname(localFilePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      const nodeStream = createReadStream(localFilePath);
      const webStream = Readable.toWeb(nodeStream) as ReadableStream;

      return new NextResponse(webStream, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": fileStat.size.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Fall through to Blob resolution on stream failure
    }
  }

  // 2. Resolve to Vercel Blob CDN if token is available
  const blobUrl = publicBlobUrl(filename);
  if (blobUrl) {
    try {
      const blobRes = await fetch(blobUrl);
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

      // If streaming was non-200, issue redirect so client/CDN handles it directly
      return NextResponse.redirect(blobUrl, 307);
    } catch {
      return NextResponse.redirect(blobUrl, 307);
    }
  }

  return new NextResponse("File not found", { status: 404 });
}

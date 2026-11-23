import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const sharpTrace = [
  "./node_modules/sharp/**/*",
  "./node_modules/@img/sharp-linux-x64/**/*",
  "./node_modules/@img/sharp-libvips-linux-x64/**/*",
];

// Payload admin uses eval() internally (via its rich text editor and dynamic
// imports). The standard Next.js CSP blocks eval, which prevents the admin UI
// from saving documents. We apply a relaxed Content-Security-Policy ONLY on
// the /admin routes so the public site is not affected.
//
// We do NOT use 'unsafe-inline' on the public routes — that is a separate,
// higher-risk allowance. Only 'unsafe-eval' is added for /admin.
const adminCsp = [
  "default-src 'self'",
  // Allow eval() and inline scripts — Payload admin requires both.
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  // Allow blob: for Vercel Blob uploads in the media uploader.
  "connect-src 'self' blob: https://*.blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
  // Allow images from the CDN and inline data URIs (thumbnails).
  "img-src 'self' data: blob: https://*.blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
  // Allow media (video previews) from the CDN.
  "media-src 'self' blob: https://*.blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
  // Fonts: self + Google Fonts (used by some Payload admin elements).
  "font-src 'self' data: https://fonts.gstatic.com",
  // Style: allow inline styles — Payload admin injects them at runtime.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Required for Payload's iframe-based rich text preview.
  "frame-src 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply only to Payload admin routes — not to the public website.
        source: "/admin/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: adminCsp,
          },
        ],
      },
    ];
  },
  // Payload's admin SSR imports sharp. Keep the native binary out of the
  // Turbopack graph and inside the Vercel serverless trace.
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/admin/**": sharpTrace,
    "/api/**": sharpTrace,
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/api/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/api/media/**",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
      {
        protocol: "https",
        hostname: "designasylum.studio",
      },
      {
        protocol: "https",
        hostname: "*.designasylum.studio",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default withPayload(nextConfig);

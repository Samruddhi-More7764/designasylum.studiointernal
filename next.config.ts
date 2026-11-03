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

// ---------------------------------------------------------------------------
// Security headers applied to every response.
// Prevents clickjacking, MIME sniffing, referrer leakage, and forces HTTPS.
// CSP is scoped to marketing pages only (/admin and /api have their own needs).
// ---------------------------------------------------------------------------

/** Build the Content-Security-Policy value for marketing pages. */
function buildCSP(): string {
  const directives = [
    // By default only load resources from our own origin
    "default-src 'self'",
    // Google Tag Manager + analytics scripts
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    // Fontshare (custom fonts) + inline styles from Next.js
    "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
    // Font files
    "font-src 'self' https://api.fontshare.com https://fonts.gstatic.com",
    // Images: same-origin, data URIs, Vercel Blob
    "img-src 'self' data: https://*.vercel-storage.com https://blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
    // Fetch/XHR: self + analytics
    "connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net",
    // No iframes or object embeds
    "frame-src 'none'",
    "object-src 'none'",
  ];
  return directives.join("; ");
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply base security headers to every route
        source: "/(.*)",
        headers: [
          // Prevent this site from being embedded in an iframe on another domain
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Stop browsers from guessing content types (prevents MIME-sniffing attacks)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send full URL within site, only origin to external sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable browser features this site doesn't use
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Instruct browsers to always use HTTPS for 1 year
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
      {
        // CSP for all marketing pages.
        // Next.js route sources don't support negative lookaheads, so we apply
        // CSP broadly. Payload admin handles its own security separately.
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: buildCSP() },
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

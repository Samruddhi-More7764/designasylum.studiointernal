import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { postgresConnectionString } from "./cms/postgres";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Services } from "./collections/Services";
import { FeaturedProjects } from "./collections/FeaturedProjects";
import { PortfolioItems } from "./collections/PortfolioItems";
import { PainPoints } from "./collections/PainPoints";
import { ClientLogos } from "./collections/ClientLogos";
import { HomepageCaseStudies } from "./collections/HomepageCaseStudies";
import { Testimonials } from "./collections/Testimonials";
import { FaqItems } from "./collections/FaqItems";
import { Clients } from "./collections/Clients";
import { CaseStudies } from "./collections/CaseStudies";
import { SiteFooter } from "./globals/SiteFooter";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — Design Asylum CMS",
    },
  },
  collections: [
    Users,
    Media,
    Services,
    FeaturedProjects,
    PortfolioItems,
    PainPoints,
    ClientLogos,
    HomepageCaseStudies,
    Testimonials,
    FaqItems,
    Clients,
    CaseStudies,
  ],
  globals: [SiteFooter],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-only-change-me-32-chars-min!!",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: postgresConnectionString(),
    },
    // First Neon / local boot can push schema. Set PAYLOAD_PUSH=false once
    // you switch to `npm run migrate`.
    push: process.env.PAYLOAD_PUSH !== "false",
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: {
        media: true,
      },
      token: blobToken,
      // Server-side put() — avoids browser CORS to vercel.com/api/blob.
      // Vercel limits this path to 4.5MB; typical CMS images are fine.
      clientUploads: false,
    }),
  ],
});

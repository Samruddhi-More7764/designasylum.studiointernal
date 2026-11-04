import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { ensureSchema } from "./cms/ensureSchema";
import { prefillPageEntries } from "./cms/prefillPages";
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
import { TeamMembers } from "./collections/TeamMembers";
import { BlogPosts } from "./collections/BlogPosts";
import { IndustryPages } from "./collections/IndustryPages";
import { ServicePages } from "./collections/ServicePages";
import { SolutionPages } from "./collections/SolutionPages";
import { WorkServicePages } from "./collections/WorkServicePages";
import { FaqDetails } from "./collections/FaqDetails";
import { LocationPages } from "./collections/LocationPages";
import { SiteFooter } from "./globals/SiteFooter";
import { BlogIndex } from "./globals/BlogIndex";
import { BlogArticleGlobal } from "./globals/BlogArticle";
import { ContactPage } from "./globals/ContactPage";
import { FaqPage } from "./globals/FaqPage";
import { CareersPage } from "./globals/CareersPage";
import { OpenRolesPage } from "./globals/OpenRolesPage";
import { WorkPage } from "./globals/WorkPage";
import { ClientsIndex } from "./globals/ClientsIndex";
import { StudioPage } from "./globals/StudioPage";
import { TeamPage } from "./globals/TeamPage";
import { ClientsGridGlobal } from "./globals/ClientsGrid";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

import type { CollectionConfig, GlobalConfig } from "payload";
import { revalidateForCollection, revalidateForGlobal } from "./cms/revalidate";

function withRevalidation(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [
        ...(collection.hooks?.afterChange || []),
        ({ doc, context }) => {
          if (context?.skipRevalidation || context?.skipSync) return doc;
          const slug =
            doc && typeof doc === "object" && "slug" in doc && typeof doc.slug === "string"
              ? doc.slug
              : undefined;
          revalidateForCollection(collection.slug, slug);
          return doc;
        },
      ],
      afterDelete: [
        ...(collection.hooks?.afterDelete || []),
        ({ doc, context }) => {
          if (context?.skipRevalidation || context?.skipSync) return doc;
          const slug =
            doc && typeof doc === "object" && "slug" in doc && typeof doc.slug === "string"
              ? doc.slug
              : undefined;
          revalidateForCollection(collection.slug, slug);
          return doc;
        },
      ],
    },
  };
}

function withGlobalRevalidation(global: GlobalConfig): GlobalConfig {
  return {
    ...global,
    hooks: {
      ...global.hooks,
      afterChange: [
        ...(global.hooks?.afterChange || []),
        ({ doc, context }) => {
          if (context?.skipRevalidation || context?.skipSync) return doc;
          revalidateForGlobal(global.slug);
          return doc;
        },
      ],
    },
  };
}

export default buildConfig({
  onInit: async (payload) => {
    await ensureSchema(payload);
    await prefillPageEntries(payload);
  },
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
    withRevalidation(Media),
    withRevalidation(Services),
    withRevalidation(FeaturedProjects),
    withRevalidation(PortfolioItems),
    withRevalidation(PainPoints),
    withRevalidation(ClientLogos),
    withRevalidation(HomepageCaseStudies),
    withRevalidation(Testimonials),
    withRevalidation(FaqItems),
    withRevalidation(Clients),
    withRevalidation(CaseStudies),
    withRevalidation(TeamMembers),
    withRevalidation(BlogPosts),
    withRevalidation(IndustryPages),
    withRevalidation(ServicePages),
    withRevalidation(SolutionPages),
    withRevalidation(WorkServicePages),
    withRevalidation(FaqDetails),
    withRevalidation(LocationPages),
  ],
  globals: [
    SiteFooter,
    BlogIndex,
    BlogArticleGlobal,
    ContactPage,
    FaqPage,
    CareersPage,
    OpenRolesPage,
    WorkPage,
    ClientsIndex,
    StudioPage,
    TeamPage,
    ClientsGridGlobal,
  ].map(withGlobalRevalidation),
  editor: lexicalEditor(),
  // PAYLOAD_SECRET must be set as an environment variable.
  // The app will refuse to start if it is missing — this prevents accidentally
  // running in production with a predictable secret that could be used to
  // forge session tokens.
  secret: (() => {
    const s = process.env.PAYLOAD_SECRET;
    if (!s) throw new Error("PAYLOAD_SECRET environment variable is not set.");
    return s;
  })(),
  // Disable the GraphQL API and its playground in production.
  // All CMS collections have read: () => true which would otherwise expose
  // the full content database to unauthenticated GraphQL queries.
  graphQL: {
    disable: process.env.NODE_ENV === "production",
  },
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: postgresConnectionString(),
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
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
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: blobToken,
      addRandomSuffix: true,
      // Browser uploads straight to Blob. The token route stays same-origin,
      // so a file over Vercel's 4.5MB function limit can still be saved.
      clientUploads: true,
    }),
  ],
});

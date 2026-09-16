# Design Asylum — Website

Next.js marketing site with Payload 3 for editable page content, stored in Neon Postgres. Images stay in `public/assets` and are referenced as `/assets/...` path strings.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| CMS | Payload 3 (`/admin`) |
| Database | Neon Postgres (`@payloadcms/db-postgres`) |
| Package manager | npm |

## Pages / routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/clients/sevenloop` | Client Hub (Sevenloop) |
| `/clients/sevenloop/case-study` | Case Study |
| `/admin` | Payload CMS (protected; first user is created here) |

Nav, Hero, forms, About Points copy, and most section headings stay hardcoded in this phase.

## Requirements

- **Node.js** `>= 20.9.0` (required by Next.js 16)
- **npm** (lockfile: `package-lock.json`)

## Getting started (frontend only)

The three marketing pages render from `src/data` when Payload / Neon is not configured. You can run the site without a database:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Payload CMS (Neon)

### 1. Create a Neon database

1. Create a project at [Neon](https://neon.tech).
2. Copy the pooled connection string. `sslmode=require` is rewritten to `sslmode=verify-full` at connect time (avoids a Node `pg` warning).

### 2. Local env

```bash
cp .env.example .env
```

Set:

| Variable | Purpose |
|----------|---------|
| `POSTGRES_URL` | Neon connection string (`DATABASE_URI` is accepted as an alias) |
| `PAYLOAD_SECRET` | Random string, at least 32 characters. Never commit the real value. |
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:3000` locally; production domain in Vercel |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (production uploads). Optional locally — files go to `media/`. |

### 3. Schema, seed, first admin user

On first boot Payload **pushes** the schema to Postgres (`PAYLOAD_PUSH` defaults to on). Changing image fields from text paths to uploads can make `npm run dev` hang on an interactive Drizzle prompt (`image` vs `image_id`). Run this **before** `next dev` after that change:

```bash
npm run prepare:uploads
npm run seed
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) and create the first admin user.

Seed upserts collections and globals from the current `src/data` modules so the admin matches today's copy. Images are created as Payload Media (uploaded to Vercel Blob when the token is set, otherwise stored in `media/`). After changing image fields from path strings to uploads, **run seed again**.

When you are ready to freeze schema changes:

```bash
npx payload migrate:create
npx payload migrate
```

Then set `PAYLOAD_PUSH=false` in env so production no longer auto-pushes.

### 4. Vercel

On the Vercel project (Production **and** Preview):

- `POSTGRES_URL` — Neon connection string
- `PAYLOAD_SECRET` — same secret as local (or a dedicated production secret)
- `NEXT_PUBLIC_SERVER_URL` — `https://<your-domain>` with no trailing slash
- `BLOB_READ_WRITE_TOKEN` — from a [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store (uploads will not persist on Vercel without this)

Build command can stay `npm run build` (`next build`). After the first deploy, run seed once (locally against the Neon URL, or via a one-off job):

```bash
npm run seed
```

Protect `/admin` by only creating admin users you trust. Do not commit `.env`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed` | Upsert CMS content from `src/data` |
| `npm run prepare:uploads` | Drop old text image columns so Payload can add upload FKs without prompting |
| `npm run migrate` | Run Payload Postgres migrations |
| `npm run generate:types` | Regenerate `src/payload-types.ts` |
| `npm run generate:importmap` | Regenerate Payload admin import map |
| `npm run payload` | Payload CLI |

## Project structure

```
src/app/(frontend)/      # Marketing routes and site layout
src/app/(payload)/       # Payload admin + REST/GraphQL
src/collections/         # Payload collections
src/globals/             # Footer, Client Hub, Case Study globals
src/cms/                 # getPayload + content fetchers (with src/data fallback)
src/data/                # Static fallback copy (also used by seed)
src/components/          # UI
src/payload.config.ts    # Payload config
public/assets/           # Production images, logos, and video
```

If Payload is down or a collection/global is empty, fetchers read `src/data` so the live site does not go blank before seed.

## Assets

Production media lives under **`public/assets/`** and is referenced as `/assets/...`.

- Images: `public/assets/images/`
- Logos: `public/assets/images/logos-new/` (and related paths in `src/data/`)
- Video: `public/assets/videos/main.mp4`

Do **not** expect a separate `figmaimages/` folder in this repo. That folder was design-reference only during development and is not required to build or run the site.

New images added in `/admin` are stored in **Vercel Blob** (or a local `media/` folder when the Blob token is unset). Seed still copies the current `public/assets` files into Media so existing copy keeps working.

## Fonts

- **Figtree** and **Playfair Display** — loaded via `next/font/google` in `src/app/(frontend)/layout.tsx`
- **Satoshi** — loaded from Fontshare CDN in `src/app/(frontend)/layout.tsx` (not available on Google Fonts)

## Forms

The contact-style forms on the Homepage are **presentational** (visual only). Submit buttons are not wired to a backend or third-party form service. Wire them up before treating submissions as live leads.

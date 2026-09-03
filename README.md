# Design Asylum — Website


This is a **static frontend only**. There is no custom backend, database, or API server in this repository.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Package manager | npm |

## Pages / routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/clients/sevenloop` | Client Hub (Sevenloop) |
| `/clients/sevenloop/case-study` | Case Study |

## Requirements

- **Node.js** `>= 20.9.0` (required by Next.js 16)
- **npm** (lockfile: `package-lock.json`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
src/app/                 # Routes and root layout
src/components/layout/   # Shared chrome (e.g. NavBar)
src/components/sections/ # Homepage sections (+ shared Services / Footer)
src/components/clients/  # Client Hub + Case Study sections
src/components/ui/       # Buttons, icons, wordmark, headings
src/data/                # Content and config (copy, image paths, FAQ, etc.)
public/assets/           # Production images, logos, and video
```

Content edits usually go in `src/data/`. Visual/layout changes go in the matching section component under `src/components/`.

## Assets

Production media lives under **`public/assets/`** and is referenced as `/assets/...`.

- Images: `public/assets/images/`
- Logos: `public/assets/images/logos-new/` (and related paths in `src/data/`)
- Video: `public/assets/videos/main.mp4`

Do **not** expect a separate `figmaimages/` folder in this repo. That folder was design-reference only during development and is not required to build or run the site.

## Fonts

- **Figtree** and **Playfair Display** — loaded via `next/font/google` in `src/app/layout.tsx`
- **Satoshi** — loaded from Fontshare CDN in `src/app/layout.tsx` (not available on Google Fonts)

No environment variables are required for fonts or for running the current site.

## Environment variables

**None required.** This frontend does not reference `process.env` / `NEXT_PUBLIC_*` variables.

## Forms

The contact-style forms on the Homepage are **presentational** (visual only). Submit buttons are not wired to a backend or third-party form service. Wire them up before treating submissions as live leads.


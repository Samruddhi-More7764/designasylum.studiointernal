# Design Asylum CMS — Editor Guide

A practical guide to updating the Design Asylum website yourself. No technical knowledge needed.

---

## Contents

1. [Logging in](#1-logging-in)
2. [How the CMS is organised](#2-how-the-cms-is-organised)
3. [Media — uploading images and video](#3-media--uploading-images-and-video)
4. [Homepage sections](#4-homepage-sections)
5. [Clients and Case Studies](#5-clients-and-case-studies)
6. [Footer](#6-footer)
7. [Managing users](#7-managing-users)
8. [Rules and gotchas](#8-rules-and-gotchas)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Logging in

Go to:

**https://designasylum.vercel.app/admin**

Enter your email and password, then click **Login**. You'll land on the Dashboard, which lists every content section down the left-hand side.

The public website is at **https://designasylum.vercel.app** — that's what your visitors see. The `/admin` part is only for you.

**Forgot your password?** Click *Forgot password?* on the login screen and follow the email link.

> **Tip:** Bookmark the `/admin` URL. Keep your password in a password manager, not in a notes app or spreadsheet.

---

## 2. How the CMS is organised

Content is grouped into **collections** (lists of things) and one **global** (a single settings page).

| Section | What it controls |
|---|---|
| **Media** | All images and videos. Upload here first. |
| **Services** | The "Services" grid on the homepage |
| **Featured Projects** | The large "Featured Projects" cards |
| **Portfolio Items** | The scrolling portfolio strip |
| **Pain Points** | "Does any of this sound familiar?" cards |
| **Client Logos** | Logo marquee and the clients grid |
| **Homepage Case Studies** | The numbered "Worked with companies…" list |
| **Testimonials** | Client quotes and video testimonials |
| **FAQ Items** | "Common questions" accordion |
| **Work → Clients** | One record per brand |
| **Work → Case Studies** | One record per project |
| **Site Footer** | Footer link columns |
| **Users** | Who can log in |

### How homepage sections link out

Four homepage sections send visitors somewhere. Three of them point at a **Client**, and one points at a **Case Study**:

| Section | Links to | Why |
|---|---|---|
| Featured Projects | Client | The card represents a brand |
| Portfolio Items | Client | The item represents a brand |
| Pain Points | Client | The outcome belongs to a brand |
| Homepage Case Studies | **Case Study** | Each row is one specific project |

When a section points at a Client, the destination depends on that client's **Project type** — a hub client opens its landing page, a direct client opens its single case study. You never type a URL anywhere.

### The universal workflow

Every section works the same way:

1. Click the section in the left sidebar
2. Click an existing row to edit it, or **Create New** to add one
3. Fill in the fields
4. Click **Save**

Changes go live within about a minute. Refresh the public page to see them.

### The `Order` field

Most collections have an **Order** field — a number that controls the sequence on the page. Lower numbers appear first: `0`, then `1`, then `2`.

To move an item up, give it a lower number than the one above it. Leaving gaps (`10`, `20`, `30`) makes it easier to slot things in later without renumbering everything.

---

## 3. Media — uploading images and video

**Always upload to Media first**, then pick the file from other sections. You cannot type in an image URL.

### Uploading

1. Go to **Media → Create New**
2. Drag your file in, or click to browse
3. Fill in the **Alt** field — a short description of what's in the image
4. **Save**

### Accepted file types

- **Images:** JPG, PNG, WebP, GIF, SVG
- **Video:** MP4, WebM, MOV

### File size limit

Keep uploads **under 4.5 MB**. Larger files will fail to upload. If a photo is too big, resize it before uploading — [Squoosh](https://squoosh.app) is a free browser tool for this.

For video, host anything large elsewhere and keep CMS uploads to short clips.

### About the Alt field

Alt text is read aloud by screen readers and shown if an image fails to load. It also helps SEO.

- **Good:** `Sevenloop brand identity on dark background`
- **Bad:** `image1`, `final_v3_USE_THIS.jpg`, or leaving it blank

### Replacing an image

Open the Media item and upload a new file over it. Every page using that image updates automatically — no need to re-link anything.

> **Warning:** Don't delete a Media item that's still in use. The pages using it will break. Check first, or just replace the file instead.

---

## 4. Homepage sections

### Services

The services grid.

| Field | Notes |
|---|---|
| Name | e.g. "Brand strategy" |
| Tags | Small labels under the name — add one per line via **Add Tag** |
| Icon | Choose **Stack** or **Website development** |
| Order | Position in the grid |

### Featured Projects

The large project cards with a statistic.

| Field | Notes |
|---|---|
| Name | Project or client name |
| Description | One or two sentences |
| Metric | The big number, e.g. `41%` |
| Metric Label | Explains the number, e.g. "Rise in inbound briefs" |
| Image | Pick from Media |
| Alt | Image description |
| **Client** | **Which brand this card opens** — see below |
| Order | Card position |

**About the Client field:** you don't type a link. You pick a Client record, and the CMS works out where the card should go. See [section 5](#5-clients-and-case-studies).

### Portfolio Items

The scrolling strip of work.

| Field | Notes |
|---|---|
| Name | Project name |
| Category | e.g. "Branding & Website Design" |
| Image, Alt | From Media |
| **Client** | Which brand the item opens |
| Order | Position |

### Pain Points

"Does any of this sound familiar?"

| Field | Notes |
|---|---|
| Tag | Industry label, e.g. "Cyber Security" |
| Quote | The problem, in the client's voice |
| Resolution | Shown under the button |
| **Client** | Which brand the "See outcome" button opens — required |
| Order | Position |

The **See outcome** button works exactly like the buttons on Featured Projects and Portfolio Items: you pick a Client, and the CMS works out the URL from that client's Project type.

### Client Logos

Feeds both the logo marquee and the clients grid.

| Field | Notes |
|---|---|
| Name | Client name |
| Image | Logo from Media |
| Width / Height | Display size in pixels |
| Order | Position |

Use transparent PNG or SVG logos. Set Width and Height to keep logos visually consistent — a wide logo and a square one need different values to look the same weight.

### Homepage Case Studies

The numbered "Worked with companies…" list.

| Field | Notes |
|---|---|
| Number | e.g. `(01)` |
| Name | Client name |
| Description | Short summary |
| Tags | Services delivered — one per **Add Tag** |
| **Case study** | Which project this row opens — required |
| Order | Position |

**This section is different from the others.** Every other homepage section links to a *Client*; this one links to a specific **Case Study**, because each row represents one project rather than a brand. Pick the project itself and the URL is built from it automatically.

### Testimonials

| Field | Notes |
|---|---|
| Image | Still photo from Media. This is the poster if you also add a video. |
| Video | Optional MP4, WebM, or MOV. Plays in the card. |
| Alt | The person's name, drawn on the photo or video. Put the role after a comma: `Dr. Mallesh B., Co-founder, i3systems` |
| Quote | The testimonial text |
| Width / Height | Display size |
| Order | Position |

### FAQ Items

| Field | Notes |
|---|---|
| Question | The question |
| Answer | The answer |
| Order | Position in the accordion |

---

## 5. Clients and Case Studies

This is the most important part to understand. Everything else is a simple list; this part has a structure.

### The two record types

- **Client** = the brand (Sevenloop, Puma, Northwind)
- **Case Study** = one project for that brand (their branding, their website, their film)

Every Case Study belongs to exactly one Client.

### Project Type — the key decision

When you create a Client you choose a **Project type**. This single setting decides how the whole site links to that brand.

**Client hub** — for brands with 2 or more projects.
The brand gets a landing page listing all their work. Visitors land on the hub and pick a project.
URL: `/clients/sevenloop`

**Direct case study** — for brands with one project.
There's no landing page. Visitors go straight to the single project.
URL: `/clients/puma/brand-film`

Most clients are *Direct*, which is why it's the default. Only switch to *Client hub* when a brand genuinely has multiple projects to show.

### Adding a single-project client (most common)

**Do these in order — the Client must exist before the Case Study.**

**Step 1 — Create the Client**

1. **Work → Clients → Create New**
2. **Name:** `Puma`
3. **Slug:** leave blank — it fills in automatically as `puma`
4. **Project type:** *Direct case study*
5. **Leave Featured study empty.** It fills itself in later.
6. **Save**

**Step 2 — Create the Case Study**

1. **Work → Case Studies → Create New**
2. **Title:** `Puma — Brand film`
3. **Slug:** leave blank — fills in automatically
4. **Client:** select `Puma`
5. Fill in the content (see field list below)
6. **Save**

**Step 3 — Check it worked**

Reopen the Client. **Featured study** should now show your case study — the CMS linked them automatically.

Visit `https://designasylum.vercel.app/clients/puma` and you'll be taken straight to the case study.

### Adding a multi-project client

1. Create the Client with **Project type: Client hub**
2. Fill in the hub content — About, Logo Design, Website Design, Project Brochure, Brand Video, Behind the Scenes, Partnership, Transformation, Project Team
3. Create each Case Study separately, all pointing at this Client
4. Go back to the Client and, in each hub section, use the **Case study** picker to choose which project that section opens

Each hub section can open a different case study. If you leave a section's picker empty, its images simply aren't clickable.

> **Important:** Fill in the **About → Body** field on a hub client. If it's blank, the page falls back to placeholder text.

### Case Study fields

**Hero**
| Field | Notes |
|---|---|
| Heading | Main title |
| Breadcrumb current | Last item in the trail — defaults to the title |
| Image | Hero photo or video from Media. Either is allowed. |

**Details**
| Field | Notes |
|---|---|
| Quote | The large pull-quote |
| Table caption | Heading above the fact table, e.g. "Details". This is a caption on its own — it has no value beside it. |
| Rows | The fact table. Click **Add Row**, then fill **Label** (left column) and **Value** (right column) |

> **Fill in the Rows.** If you leave the table empty, the page shows placeholder rows belonging to a different client. Same for the Gallery — an empty gallery shows placeholder images.

**Gallery**

Click **Add Item** for each frame and pick a photo or a video from Media. Frames stack full-width down the page. A video plays in place; a photo stays a still.

**View All**
| Field | Notes |
|---|---|
| Label | Button text, e.g. "View All Clients" |
| Href | Where it goes, usually `/` |

### Slug rules

A slug is the URL-friendly version of a name — `Puma Brand Film` becomes `puma-brand-film`.

- Leave slugs blank and they generate automatically. Recommended.
- **Client slugs must be unique across the whole site.** Two clients can't both be `puma`.
- **Case study slugs only need to be unique within one client.** Sevenloop and Puma can both have a `case-study`.
- Changing a slug changes the URL, which **breaks any existing link** to that page. Avoid changing slugs once a page is public.

---

## 6. Footer

**Site Footer** is a single settings page rather than a list.

- **Columns** — each has a Title and a list of Links
- **AI Links** — the "Ask AI for a summary" row

Use **Add Column** / **Add Link** to extend, and drag the handle on the left of each row to reorder.

---

## 7. Managing users

Anyone who needs to edit the site gets their own login. **Don't share one account.**

**To add someone:**

1. **Users → Create New**
2. Enter their **Email**, **Name** and a **Password**
3. **Save**
4. Send them the login URL and ask them to change the password on first login

**To remove someone:** open their user record and delete it. Do this the same day someone leaves the project.

There is no free/paid limit on the number of users — add as many as you need. (See the cost notes below.)

---

## 8. Rules and gotchas

**Always upload images to Media first.** You can't paste an image URL into a page.

**Create the Client before the Case Study.** The automatic linking depends on the Client already existing.

**Fill in details Rows and Gallery on every case study.** Leaving them empty makes the page show another client's placeholder content — which would be visible to the public.

**Don't change slugs on live pages.** It breaks existing links, bookmarks and anything shared on social media.

**Keep uploads under 4.5 MB.**

**Always write Alt text.** It matters for accessibility and search.

**Check the live site after saving.** Give it a minute, then refresh.

**Don't delete Media that's still in use.** Replace the file instead.

---

## 9. Troubleshooting

**My change isn't showing on the website**
Wait about a minute and hard-refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows). Also confirm you actually clicked **Save**.

**A field I need isn't visible**
Some fields only appear in certain contexts. *Featured study* only shows when Project type is *Direct*. Hub content fields only show when Project type is *Client hub*.

**"Featured study" is empty after creating a case study**
Reload the Client page. If it's still empty, pick the study manually from the dropdown.

**My upload failed**
The file is probably over 4.5 MB, or it's an unsupported format. Resize or convert it.

**The page shows the wrong client's information**
That case study has empty Details rows or an empty Gallery, so it's falling back to placeholder content. Fill those in.

**A hub page looks like a different client**
The **About → Body** field is empty. Fill it in.

**I can't log in**
Use *Forgot password?* on the login screen. If that doesn't work, contact your developer.

**I deleted something by mistake**
Contact your developer immediately — the sooner you ask, the more likely it can be recovered from a database backup.

---

## Quick reference

| I want to… | Go to |
|---|---|
| Add an image | Media → Create New |
| Add a new client | Work → Clients → Create New |
| Add a project | Work → Case Studies → Create New |
| Change a homepage card's destination | Open the card, change its **Client** (or **Case study** on Homepage Case Studies) |
| Reorder anything | Change the **Order** number |
| Add a team member login | Users → Create New |
| Edit footer links | Site Footer |

**Admin:** https://designasylum.vercel.app/admin
**Live site:** https://designasylum.vercel.app

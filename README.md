# Krishna Reddy Kypu — 3D Portfolio

A modern, 3D animated portfolio for a Senior Mechanical Engineer (New Product Design & Development), built with **Next.js 15 (App Router) + TypeScript**, **Three.js via React Three Fiber**, **Framer Motion**, and **Tailwind CSS**.

The hero features an interactive exploded-view **planetary gearbox** built entirely from primitive geometries — it slowly rotates, the gears counter-rotate, and the whole assembly responds subtly to mouse movement.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Set the admin password (already created for local dev — change it!)
#    .env.local contains: ADMIN_PASSWORD=krishna-admin-2026

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000> — the site should be fully populated with content.

For a production build:

```bash
npm run build
npm start
```

---

## Editing site content (no coding required)

**Every piece of text on the site** — name, bio, projects, skills, timeline, certifications, contact info — lives in one file:

```
content/site-content.json
```

There are two ways to edit it:

### Option 1 — The admin editor (recommended)

1. Go to **`/admin`** (e.g. `http://localhost:3000/admin`).
2. Enter the admin password (the `ADMIN_PASSWORD` value from `.env.local`).
3. Use the tabbed form to edit any section — add / remove / reorder projects, timeline entries, skills and certifications with the arrow and delete buttons.
4. Click **Save** — the JSON file is updated and the site reflects changes on the next page load.

> ⚠️ **Security note:** the admin page is protected by a single password checked
> on the server — basic protection that is fine for a personal portfolio, but
> don't reuse an important password here.

**On static hosts (e.g. Vercel)** the server cannot write files, so **Save**
will fail with a friendly message. Use the **Export JSON** button instead: it
downloads your edited content as `site-content.json` — replace
`content/site-content.json` in the repo with it, commit, and redeploy.

### Option 2 — Edit the JSON by hand

Open `content/site-content.json` in any text editor:

- Only change the **values**, never the key names.
- Keys starting with `_` (like `_comment`) are documentation — the site ignores them.
- Lists (projects, skills, timeline items…) can be freely extended: copy an existing entry, paste it, and edit. Keep each item's `id` unique.
- See **`content/SCHEMA.md`** for a field-by-field guide.

The resume served by the "Download Resume" button is `public/Krishna-Reddy-Kypu-Resume.pdf` — replace that file to update it (or change `personal.resumeUrl` in the JSON).

---

## Project structure

```
app/
  page.tsx              # assembles all sections, loads content JSON
  layout.tsx            # fonts, metadata / SEO (sourced from the JSON)
  globals.css           # theme utilities (.metal-card, .btn-primary, …)
  admin/page.tsx        # hidden admin editor
  api/admin/            # login + content read/write API routes
components/
  3d/                   # R3F gearbox scene, parametric gear, lightweight fallback
  sections/             # Hero, About, Timeline, Projects, Skills, Credentials, Contact…
  admin/                # admin editor UI
  ui/                   # shared primitives (SectionHeading)
content/
  site-content.json     # ← ALL site text lives here
  SCHEMA.md             # field-by-field content guide
lib/                    # content loader, motion variants, admin auth
types/content.ts        # TypeScript types for the content JSON
```

## Design notes

- **Theme:** dark industrial-modern — deep charcoal, steel-blue and brushed-orange metallic accents, Space Grotesk display + Inter body type.
- **Performance:** the 3D scene is lazy-loaded (`next/dynamic`, no SSR); mobile devices get a lightweight animated SVG fallback instead of WebGL.
- **Accessibility:** semantic sections, keyboard-navigable modal and menus, focus rings, `aria` labels, and full `prefers-reduced-motion` support (heavy animation, counters, parallax and gear rotation are disabled).
- **SEO:** metadata + Open Graph tags generated from the content JSON.

---

## Deploying

### Vercel (easiest)

1. Push this folder to a GitHub repo.
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected.
3. Add an environment variable `ADMIN_PASSWORD` in the Vercel project settings.

> **Limitation on Vercel/static hosts:** the deployed filesystem is read-only,
> so the admin **Save** button can't write `site-content.json` in production.
> Workflow: edit on the deployed `/admin` page → **Export JSON** → replace
> `content/site-content.json` in the repo → push (auto-redeploys).
> Alternatively run `/admin` locally, Save, and push.

### Self-hosted Node server (full admin save support)

```bash
npm run build
ADMIN_PASSWORD=your-password npm start
```

On your own server (VPS, Docker, etc.) the filesystem is writable, so the
admin **Save** button updates `content/site-content.json` directly and changes
appear on the next page load — no rebuild needed (the page reads the JSON per
request).

# Content guide — `site-content.json`

Every visible word on the site comes from `content/site-content.json`.
This file explains what each part controls. **Change values, not key names.**
Keys starting with `_` are notes for humans — the site ignores them.

| Section | Controls | Notes |
|---|---|---|
| `meta` | Browser tab title, search description, social-share text | `siteUrl` should be your real deployed URL |
| `nav` | Top navigation bar | `links[].href` must match section anchors (`#about`, `#projects`, …) |
| `personal` | Name, title, contact details, resume link | `resumeUrl` points to a file in `public/` |
| `hero` | Opening full-screen section | `headlineAccent` renders in orange; `badges` are the small chips |
| `about` | Bio, stats counters, highlight chips | `stats[].value` must be a number — it animates counting up |
| `experience` | The vertical timeline | Most recent job first; each item's `highlights` are the bullet points |
| `projects` | Project cards + detail modals | Leave `image` as `""` for the built-in technical placeholder graphic, or set a path like `/projects/foo.jpg` after adding the file to `public/projects/` |
| `skills` | Skill groups + proficiency bars | `level` is 0–100 and controls the bar width |
| `certifications` / `education` / `achievements` | The credentials section | Simple lists — add or remove items freely |
| `contact` | Contact section | Direct-contact cards (email, LinkedIn, phone) with copy buttons for email and phone |
| `footer` | Footer line | — |

## Adding a project (example)

Copy an existing entry inside `projects.items`, then edit:

```json
{
  "id": "my-new-project",          ← unique, lowercase, no spaces
  "title": "Cooling Plate Design",
  "subtitle": "Liquid-cooled thermal solution",
  "company": "Acme Corp",
  "description": "One-paragraph summary shown on the card.",
  "details": ["Bullet shown in the modal", "Another bullet"],
  "tools": ["NX", "ANSYS"],
  "tags": ["Thermal", "CAD"],
  "image": "",
  "imageAlt": "Description of the image for screen readers"
}
```

The same copy-paste pattern works for timeline entries (`experience.items`),
skills (`skills.groups[].skills`), certifications, education and achievements.

**Tip:** after hand-editing, paste the file into a JSON validator (or just load
the site) — a missing comma or quote is the most common mistake.

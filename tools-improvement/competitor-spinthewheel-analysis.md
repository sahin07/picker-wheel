# Competitor Analysis: SpinTheWheel.app

> **Source:** [https://spinthewheel.app/](https://spinthewheel.app/)  
> **Scanned:** July 9, 2026  
> **Purpose:** Reference doc to improve each Picker Wheel page — layout, SEO, content, and UX patterns.

Use this document when improving **any wheel page** (`/`, `/nba-wheel`, `/pokemon-wheel`, etc.). Each tool-specific doc in this folder should follow the patterns below.

---

## Table of contents

1. [Page structure (homepage pattern)](#1-page-structure-homepage-pattern)
2. [Section-by-section breakdown](#2-section-by-section-breakdown)
3. [SEO analysis](#3-seo-analysis)
4. [UX & product patterns](#4-ux--product-patterns)
5. [Category & content strategy](#5-category--content-strategy)
6. [Our app vs competitor](#6-our-app-vs-competitor)
7. [Recommended page template (per wheel)](#7-recommended-page-template-per-wheel)
8. [SEO checklist (every page)](#8-seo-checklist-every-page)
9. [Content keywords to target](#9-content-keywords-to-target)
10. [Priority action list](#10-priority-action-list)
11. [Per-wheel improvement workflow](#11-per-wheel-improvement-workflow)

---

## 1. Page structure (homepage pattern)

Their homepage follows a **tool-first, content-second** layout (~4,600px tall):

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Logo | + NEW WHEEL | F.A.Q. | Wheels | My Wheels  │
├─────────────────────────────────────────────────────────────┤
│ HERO: Live wheel (left) + Editor panel (right)              │
│   - Fullscreen, sound, Share buttons                        │
│   - Editor: undo, settings, style, sounds, shuffle, sort,   │
│     colors, weights, notes                                  │
├─────────────────────────────────────────────────────────────┤
│ CATEGORIES: Related wheels in same category                 │
├─────────────────────────────────────────────────────────────┤
│ SEO BLOCK: H1 + marketing paragraph + App Store badges    │
├─────────────────────────────────────────────────────────────┤
│ RECOMMENDED ARTICLES (blog links)                           │
├─────────────────────────────────────────────────────────────┤
│ FAQ PREVIEW (6 questions + "read more")                     │
├─────────────────────────────────────────────────────────────┤
│ APP PROMO: Features list + Download CTAs                    │
├─────────────────────────────────────────────────────────────┤
│ FOOTER: Legal links + copyright                             │
└─────────────────────────────────────────────────────────────┘
```

**Key principle:** The wheel is usable **above the fold** with zero signup. SEO content lives **below** the interactive tool.

---

## 2. Section-by-section breakdown

| Section | What they do | Why it works |
|---------|--------------|--------------|
| **Header** | Sticky nav, strong `+ NEW WHEEL` CTA, minimal links | User can spin or create immediately |
| **Hero wheel** | Pre-loaded demo wheel (e.g. Magic 8-Ball) | Zero friction — tool works on first visit |
| **Editor panel** | Inline editing beside the wheel | No separate page needed to customize |
| **Categories** | Shows wheels from same category below hero | Internal linking + discovery |
| **SEO text block** | H1 + 2-sentence pitch + Google Play / App Store | Keywords + mobile app funnel |
| **Articles** | 2 blog cards with long descriptions | Long-tail SEO (video games, board games) |
| **FAQ** | 6 questions on homepage, full page at `/help` | Ranks for "how to", "is it free", "is it random" |
| **App promo** | Feature bullets with emojis | Converts web users to app |
| **Footer** | FAQ, Privacy, Terms, About | Trust + legal compliance |

### Header navigation

| Link | URL | Notes |
|------|-----|-------|
| + NEW WHEEL | `/new` | Primary CTA — always visible |
| F.A.Q. | `/help` | Support + SEO |
| Wheels | `/wheels` | Category hub |
| My Wheels | (local storage) | Saved user wheels |

### Hero / wheel area

- **Left:** Large colorful wheel on dark gradient background
- **Right:** Text editor panel with live preview
- Controls: fullscreen, sound toggle, share
- Default wheel loads instantly (Wheel of Fortune / Magic 8-Ball style)
- "Edit wheel online" — copy any public wheel

### Editor toolbar features

| Feature | Description |
|---------|-------------|
| Undo / Redo | Up to 50 steps (Ctrl+Z / Ctrl+Shift+Z) |
| Settings | Title, text size, text direction, slice repeat |
| Style / Color | Presets + style library + random style |
| Sounds | Win sound + tick sound (per-slice override) |
| Shuffle / Sort | A→Z / Z→A alphabetical |
| Per-slice | Text color, background color, weight, sound, notes |
| Modes | Advanced mode vs Text mode |
| Bulk input | Paste names one per line |

### Footer links

- F.A.Q. / Help → `/help`
- Privacy Policy → `/privacy-policy`
- Terms & Conditions → `/terms-and-conditions`
- About us → `/contact-us`
- Copyright: `2018 - 2026 © Spin The Wheel · Random Picker`

---

## 3. SEO analysis

### Title & meta (homepage)

| Tag | Value |
|-----|-------|
| **Title** | `Spin The Wheel · Random Picker \| Best Free Decision Making Tool` |
| **Description** | Use our free Spin The Wheel tool to make decisions instantly. Whether you need a random picker for names, prizes, or games, our wheels are beautiful, fair, and fun! |
| **Canonical** | `https://spinthewheel.app/` |
| **OG type** | `summary_large_image` |
| **OG image** | `https://spinthewheel.app/assets/images/preview/wheel-of-fortune.png` (512×512) |
| **Theme color** | `#2eb163` |
| **Lang** | `en` |

### Structured data (JSON-LD)

They use `@graph` with:

- **Organization** — name, url, logo (256×256), social profiles (TikTok, X, Reddit)
- **WebSite** — name, alternate names, description, publisher

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Spin The Wheel · Random Picker",
      "url": "https://spinthewheel.app",
      "logo": { "@type": "ImageObject", "url": "...", "width": 256, "height": 256 }
    },
    {
      "@type": "WebSite",
      "name": "Spin The Wheel · Random Picker",
      "alternateName": ["STW · Random Picker", "Spin The Wheel"],
      "description": "..."
    }
  ]
}
```

### Heading hierarchy (homepage)

| Level | Examples |
|-------|----------|
| **H1** | `Spin The Wheel · Random Picker` (one only) |
| **H2** | Wheel title, Categories, Recommended articles, FAQ, App section |
| **H3** | Category names, individual FAQ questions |

### Content SEO strategy

1. **Programmatic pages** — 15+ category URLs (`/wheels/video-games`, `/wheels/sports`, etc.)
2. **Massive wheel library** — claims 20,000+ published wheels (each = indexable URL)
3. **Long FAQ page** — `/help` has 50+ detailed Q&As (featured snippet targets)
4. **Blog/articles** — `/articles/video-games/...`, `/articles/board-games/...`
5. **robots.txt** — allows all crawlers, references sitemap

### Technical SEO

- `lang="en"` on `<html>`
- Multiple favicon sizes + `apple-touch-icon` + web manifest
- App deep-link meta (`apple-itunes-app`, `al:ios`, `al:android`)
- Preconnect to Google Analytics / Tag Manager
- Google Analytics (`G-5RSB97TC0M`) + AdSense monetization

### `/wheels` page SEO

- **Title:** `Wheel Categories | Spin The Wheel · Random Picker`
- **H1:** `Categories`
- 16 category landing pages with emoji + description each

### `/help` page SEO

- **Title:** `Help | Spin The Wheel · Random Picker`
- **H1:** `General questions` / `Wheel editor F.A.Q.`
- 50+ H3 FAQ questions with long-form answers
- Targets: "how to make a spin wheel", "is it random", "how to share", "how to embed"

---

## 4. UX & product patterns

### Immediate value (no signup)

- Default wheel loads instantly
- User can spin within 1 second of landing
- No account required

### Split layout

- **Desktop:** Wheel left, editor right
- **Mobile:** Stacked with "Edit" button
- Dark background behind wheel for contrast

### Sharing & persistence

- Share button → unique URL or native share dialog
- "My Wheels" saved in browser `localStorage`
- "Edit wheel online" → copy any public wheel
- iframe embed: `<iframe src="https://spinthewheel.app/wheel-slug" width="512" height="512">`

### Mobile app funnel

- App Store + Google Play badges in 2 places on homepage
- UTM-tagged download links
- App has features web lacks: chat, wheel store, ratings

### Monetization

- Google AdSense
- Google Analytics
- Google Tag Manager
- Funding Choices (GDPR consent)

---

## 5. Category & content strategy

### Wheel categories (`/wheels`)

| Category | Slug | Emoji |
|----------|------|-------|
| All Wheels | `/wheels/all` | 🔆 |
| Animals & Nature | `/wheels/animals-and-nature` | 🐼 |
| Arts & Crafts | `/wheels/arts-and-crafts` | 🎨 |
| Board Games | `/wheels/board-games` | 🎲 |
| Chance & Fortune | `/wheels/chance-and-fortune` | 🔮 |
| Comedy & Fun | `/wheels/comedy-and-fun` | 😂 |
| Entertainment | `/wheels/entertainment` | 🍿 |
| Food & Drink | `/wheels/food-and-drink` | 🍕 |
| Holidays & Occasions | `/wheels/holidays-and-occasions` | 🎁 |
| Party & Games | `/wheels/party-and-games` | 🎉 |
| Music | `/wheels/music` | 🎵 |
| Sports | `/wheels/sports` | ⚽ |
| Tools | `/wheels/tools` | 🛠️ |
| Travel & World | `/wheels/travel-and-world` | 🌍 |
| Video Games | `/wheels/video-games` | 🎮 |
| Other | `/wheels/other` | 🌟 |

### FAQ topics they cover (use as inspiration)

**General:**
- What is this website about?
- How to make a spin wheel online?
- What can the wheel of fortune be used for?
- How do I add names?
- How do I spin the wheel?
- Is this tool free?
- Is this wheel truly random?
- Can the spinning wheel be rigged?
- Is there a limit on wheels/slices?
- How to share my wheel?
- How to find more fortune wheels?
- How to download the app?
- Where is my wheel data stored?
- How do I put a spin wheel on my website?
- How to open/close fullscreen?
- How to record the spin?
- How to share the result?

**Editor:**
- How do I save my wheel?
- How to add a new slice?
- How to change wheel sound effects?
- How to add multiple slices at once?
- Undo / Redo
- Text Color lock
- Delete / shuffle / sort slices
- Per-slice color, weight, sound, notes
- Wheel style and premade styles
- Advanced mode vs Text mode

### App feature bullets (their copy)

**Top features:**
- Unlimited wheels of fortune with unlimited labels
- Big color library and custom colors
- Chat with other people spinning the same wheel
- Wheel Store with thousands of wheels
- Premade presets for beautiful spinner wheels

**Download for free to:**
- 🏆 Create custom raffles and random prize or name draws
- 🎉 Make social party games more entertaining
- 🎰 Make your own roulettes and spinner wheels
- 🎲 Do flip a coin, roulettes, dice rolls on the wheel
- 🌎 Share created wheels with the world

---

## 6. Our app vs competitor

### Where they win

| Area | Competitor | Our app (current) |
|------|------------|-------------------|
| **SEO metadata** | Full title, description, OG, schema | `title: 'v0 App'`, `description: 'Created with v0'` in `layout.tsx` |
| **FAQ content** | 50+ detailed Q&As at `/help` | No dedicated FAQ page |
| **Wheel library** | 20,000+ public wheels | Templates only |
| **Category pages** | 15+ SEO landing pages | None |
| **Blog/articles** | Yes (`/articles/...`) | None |
| **Legal pages** | Privacy, Terms, About | Footer links are `#` placeholders |
| **App promotion** | iOS + Android badges | None |
| **Share/embed** | Unique URLs + iframe embed | Limited |
| **Weighted entries** | Per-slice weight | Not built |
| **My Wheels** | localStorage + share URLs | Partial (wheel manager store) |

### Where we can win (differentiation)

Our app already has features they don't:

| Feature | Our tools |
|---------|-----------|
| Specialized wheels | NBA, MLB, Pokemon, Fortnite, LoL, Country, State |
| Game modes | Bingo, precision, combo, memory match, wheel roulette |
| Achievements & analytics | Picker wheel achievements, spin analytics |
| AI input panel | AI-assisted option generation |
| Theme selector | Multiple wheel themes |
| Social hub | Social profiles, levels |
| Image picker wheel | Image-based spinning |
| Color picker wheel | Color selection tool |
| Rich game instructions | `/game-instructions/...` pages |

**Strategy:** Match their SEO + page structure. Beat them on **product depth** per vertical.

---

## 7. Recommended page template (per wheel)

Apply this template to **every wheel page** (homepage + each tool route).

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HEADER                                                    │
│    Logo + tool name | [+ NEW WHEEL] [Tools ▼] [FAQ] [Share] │
├─────────────────────────────────────────────────────────────┤
│ 2. HERO (above the fold)                                     │
│    Wheel (left) + Input/Editor panel (right)                 │
│    Pre-load sensible defaults for this tool                   │
├─────────────────────────────────────────────────────────────┤
│ 3. TOOL-SPECIFIC CONTROLS (if applicable)                    │
│    Filters, tabs, stats, AI panel — our differentiator       │
├─────────────────────────────────────────────────────────────┤
│ 4. SEO TEXT BLOCK ★ ADD TO EVERY PAGE ★                      │
│    H1: "[Tool Name] · Free [Intent] Picker Wheel"            │
│    2-3 sentences with target keywords                        │
├─────────────────────────────────────────────────────────────┤
│ 5. HOW TO USE (3-5 steps)                                    │
│    Numbered list — great for featured snippets               │
├─────────────────────────────────────────────────────────────┤
│ 6. USE CASES (bullet list)                                   │
│    Classrooms, parties, giveaways, streaming, etc.             │
├─────────────────────────────────────────────────────────────┤
│ 7. FAQ PREVIEW (5-6 questions)                             │
│    Tool-specific questions + link to full FAQ                │
├─────────────────────────────────────────────────────────────┤
│ 8. RELATED TOOLS (internal links)                            │
│    3-6 links to sibling wheels in same category              │
├─────────────────────────────────────────────────────────────┤
│ 9. FOOTER                                                    │
│    Tools, Support, Legal — real URLs, not `#`                │
└─────────────────────────────────────────────────────────────┘
```

### Example: NBA Wheel page

| Section | Content |
|---------|---------|
| H1 | `NBA Picker Wheel · Free Random Team Selector` |
| SEO paragraph | Spin to pick a random NBA team for fantasy drafts, watch parties, or game night challenges. Free, fair, and instant. |
| How to use | 1. Select conference/division filter 2. Click Spin 3. View team details 4. Share result |
| Use cases | Fantasy draft order, pick a team to root for, classroom sports quiz, streamer challenges |
| FAQ | Is it random? Can I filter by conference? How many teams? Is it free? |
| Related tools | MLB Wheel, Team Picker, Sports hub |

---

## 8. SEO checklist (every page)

Copy this checklist into each tool-specific improvement doc.

### Metadata (required)

- [ ] Unique `<title>` — `[Tool Name] · Free [Intent] | Picker Wheel`
- [ ] Unique `<meta name="description">` — 150-160 chars, include primary keyword
- [ ] `<link rel="canonical">` — absolute URL
- [ ] Open Graph: `og:title`, `og:description`, `og:image` (512×512 min)
- [ ] Twitter card: `summary_large_image`
- [ ] `lang="en"` on `<html>`

### On-page content (required)

- [ ] One H1 with primary keyword
- [ ] H2 sections: How to Use, Use Cases, FAQ, Related Tools
- [ ] H3 for each FAQ question
- [ ] 300+ words of indexable text below the wheel
- [ ] Internal links to 3+ related tools

### Structured data (recommended)

- [ ] `WebApplication` or `SoftwareApplication` schema
- [ ] `FAQPage` schema for FAQ section
- [ ] `BreadcrumbList` for hub → tool navigation

### Technical (site-wide)

- [ ] Fix `app/layout.tsx` — replace `v0 App` placeholder metadata
- [ ] `app/robots.ts` — allow all, reference sitemap
- [ ] `app/sitemap.ts` — all tool routes
- [ ] Favicon set (16, 32, 96, svg, apple-touch-icon)
- [ ] `site.webmanifest`
- [ ] OG preview image per major tool

### Distribution (recommended)

- [ ] Share wheel via URL (encoded state in query param)
- [ ] Embed mode (`?embed=1` for iframe)
- [ ] Copy link button wired in header

---

## 9. Content keywords to target

### Generic (homepage + utility tools)

- spin the wheel
- random picker
- wheel of fortune online
- name picker wheel
- decision maker tool
- free spinner wheel
- random name generator wheel
- classroom name picker
- yes or no wheel
- what to eat wheel

### Vertical (per specialized tool)

| Tool | Keywords |
|------|----------|
| NBA Wheel | nba team picker, random nba team, nba wheel spinner |
| MLB Wheel | mlb team picker, random baseball team |
| Pokemon Wheel | pokemon picker, random pokemon generator |
| Fortnite Wheel | fortnite skin picker, random fortnite skin |
| LoL Wheel | lol champion picker, random league champion |
| Country Wheel | random country picker, country generator wheel |
| State Wheel | random us state picker, state wheel |
| Color Wheel | random color picker, color generator wheel |
| Yes/No Wheel | yes or no decision wheel, coin flip alternative |

---

## 10. Priority action list

### Phase 1 — SEO foundation (do first)

1. Fix SEO metadata in `app/layout.tsx`
2. Add per-page `metadata` export to every tool route
3. Add SEO text block below wheel on homepage
4. Create `/help` FAQ page with 15-20 questions
5. Fix footer links — replace `#` with real pages (Privacy, Terms, Contact)
6. Add `app/robots.ts` + `app/sitemap.ts`
7. Add OG image (512×512 wheel preview)

### Phase 2 — Per-wheel pages

8. Apply [page template](#7-recommended-page-template-per-wheel) to each tool
9. Add tool-specific FAQ (5-6 questions) below each wheel
10. Add "Related Tools" internal linking section
11. Add JSON-LD structured data per page

### Phase 3 — Content & distribution

12. Create `/tools` or `/wheels` hub page linking all specialized wheels
13. Share/embed feature with unique URLs per wheel
14. Blog/articles for long-tail SEO (lower priority, high value long-term)
15. Legal pages: `/privacy-policy`, `/terms`, `/about`

### Phase 4 — Competitor parity features

16. Weighted entries (per-option probability)
17. CSV import/export for options
18. Fullscreen presentation mode polish
19. "My Wheels" with share URLs

---

## 11. Per-wheel improvement workflow

When improving a specific wheel page, follow this workflow:

### Step 1 — Read this doc + tool-specific doc

- This file: `tools-improvement/competitor-spinthewheel-analysis.md`
- Tool doc: e.g. `tools-improvement/nba-wheel.md`

### Step 2 — Audit current page

- [ ] Does the wheel work above the fold?
- [ ] Is there unique metadata?
- [ ] Is there SEO content below the wheel?
- [ ] Are there FAQ questions?
- [ ] Are there related tool links?
- [ ] Does Share button work?

### Step 3 — Implement page template

1. Add/fix `metadata` export in `page.tsx` or layout
2. Add SEO text block component below wheel
3. Add How to Use section (numbered steps)
4. Add Use Cases bullets
5. Add FAQ section (5-6 tool-specific Q&As)
6. Add Related Tools links
7. Add JSON-LD structured data

### Step 4 — Verify

- [ ] Title and description unique and keyword-rich
- [ ] One H1, logical H2/H3 hierarchy
- [ ] 300+ words indexable content
- [ ] 3+ internal links
- [ ] Page loads with wheel usable immediately
- [ ] Mobile layout works

### Step 5 — Update tool-specific doc

Mark completed items in the tool's `.md` file under `tools-improvement/`.

---

## Related files in this repo

| File | Purpose |
|------|---------|
| `tools-improvement/README.md` | Master index of all tool improvement docs |
| `tools-improvement/*.md` | Per-tool gap analysis and upgrade plans |
| `app/spinthewheel.md` | Competitor sitemap export (~24k URLs) |
| `app/spinthewheel-tools.html` | Categorized competitor tools HTML export |
| `app/layout.tsx` | Site-wide metadata (needs fix) |

---

## Competitor quick reference

| Page | URL |
|------|-----|
| Homepage | https://spinthewheel.app/ |
| Categories | https://spinthewheel.app/wheels |
| FAQ / Help | https://spinthewheel.app/help |
| New wheel | https://spinthewheel.app/new |
| Privacy | https://spinthewheel.app/privacy-policy |
| Terms | https://spinthewheel.app/terms-and-conditions |
| About | https://spinthewheel.app/contact-us |
| robots.txt | https://spinthewheel.app/robots.txt |

---

*Last updated: July 9, 2026*

# Custom Spin Wheel (Home) — Future Upgrades

**Product names:** Custom Spin Wheel · Random Name Selector Picker · Random Name Picker  
**Route:** `/`  
**Role:** **Flagship hub** — every other wheel on the site should link back to this page  
**Competitor equivalent:** `spin-the-wheel-random-picker`, `wheel-of-names`, SpinTheWheel.app custom wheel

---

## Hub strategy

> **Custom Spin Wheel is the central page of the entire wheel ecosystem.**

- All specialized wheels link **back** to `/`
- `/` links **out** to specialized wheels via a **Related Wheels** section
- Targets the broadest, highest-volume keywords in the spin-wheel niche
- Creates a strong internal linking cluster for SEO

```
Custom Spin Wheel (Hub — /)
├── Spin the Wheel Random Picker     → /spin-the-wheel-random-picker (alias → /)
├── Yes or No                        → /yes-or-no
├── Random Number Picker             → /random-number-picker
├── Wheel of Colors                  → /wheel-of-colors
├── Flip a Coin                      → /flip-a-coin
├── Magic 8 Ball                     → /magic-8-ball
├── The Wheel of Fortune             → /the-wheel-of-fortune
├── Twister Wheel                    → /twister-wheel
├── What To Do                       → /what-to-do
├── Slime Challenge                  → /slime-challenge
├── Make a Word Wheel                → / (home word mode) → /make-a-word-wheel (later)
├── Letter Wheel                     → /letter-picker-wheel (existing)
└── Team Picker                      → /team-picker (existing)
```

---

## Naming & SEO keywords

| Term | Use for |
|------|---------|
| **Custom Spin Wheel** | Hub branding, H1 variant, meta title |
| Random Name Selector Picker | Primary product name in UI |
| random name selector | Primary SEO target |
| random name picker | Legacy + high-volume alias |
| wheel of names | Competitor-intent keyword |
| create a spin wheel / wheel maker | Hub-intent keywords |
| **make a word wheel** / word wheel maker | Word-list intent — ship on `/` first ([make-a-word-wheel.md](./make-a-word-wheel.md)) |

---

## Core features (roadmap)

### Wheel builder

| Feature | Status today | Priority |
|---------|--------------|----------|
| Add / Edit / Delete entries | ✅ Built | — |
| Unlimited entries | ⚠️ Partial (image cap 10; text list larger) | High |
| Drag & drop reorder | ❌ Missing | Medium |
| Duplicate entries | ✅ Built | — |
| Shuffle entries | ✅ Built | — |
| Weighted entries | ⚠️ Partial (`smartWeights` in store, limited UX) | High |
| Remove duplicates | ❌ Missing | Medium |

### Import

| Feature | Status today | Priority |
|---------|--------------|----------|
| Manual input | ✅ Built | — |
| Paste list | ⚠️ Partial (line-by-line, no bulk paste UX) | Medium |
| CSV upload | ❌ Missing | High |
| Excel upload | ❌ Missing | High |
| Image to text (OCR) | ❌ Missing | Medium |
| AI generate list | ✅ Built (AI-Powered tab) | — |

### Customization

| Feature | Status today | Priority |
|---------|--------------|----------|
| Custom colors | ✅ Built (option colors + themes) | — |
| Images on segments | ✅ Built | — |
| Emojis | ❌ Missing | Low |
| Fonts | ⚠️ Partial (customization panel commented out) | Medium |
| Backgrounds | ✅ Built (settings appearance) | — |
| Logo upload | ✅ Built (banner logo in settings) | — |
| Custom pointer | ❌ Missing | Low |
| Sound effects | ✅ Built (`wheel-sound.mp3`, win sound) | — |
| Confetti | ✅ Built | — |
| Spin speed / duration | ✅ Built (settings) | — |
| Dark / Light mode | ❌ Missing | Medium |

### Wheel modes

| Feature | Status today | Priority |
|---------|--------------|----------|
| Remove winner after spin | ❌ Missing | High |
| Keep winner | ✅ Default (current behavior) | — |
| Multi-winner | ❌ Missing | High |
| Elimination mode | ❌ Missing | High |
| Tournament mode | ❌ Missing | Medium |
| Team generator | ⚠️ Partial (`/team-picker` separate) | High |

### Saving & distribution

| Feature | Status today | Priority |
|---------|--------------|----------|
| Save wheel | ✅ Built (DB + local persist) | — |
| Duplicate wheel | ✅ Built (Switch Wheel → create) | — |
| Unlimited saved wheels | ✅ Built (multi-wheel per tool) | — |
| Share link | ❌ Missing (header Share not wired) | High |
| QR code | ❌ Missing | Medium |
| **Wheel embed** (any site) | ❌ Missing (`?embed=1` + iframe code) | **High — Phase A** |
| Export image | ❌ Missing | Medium |
| Export video / GIF | ❌ Missing | Low |

### Results

| Feature | Status today | Priority |
|---------|--------------|----------|
| Winner history | ⚠️ Partial (all-wheel results modal) | Medium |
| Statistics | ⚠️ Partial (analytics panel) | Medium |
| Re-spin | ✅ Built | — |
| Lock winners | ❌ Missing | Low |
| Download results | ❌ Missing | Medium |

---

## ⭐ Best features (differentiators)

Prioritize these for marketing, landing page copy, and Phase 1–2 build order:

1. **AI-generated wheel** — ✅ partial; expand prompts & categories
2. **CSV & Excel import** — ❌ high competitor table-stakes
3. **Image-to-wheel (OCR)** — ❌ unique classroom/raffle use case
4. **Weighted entries** — ⚠️ finish UX + odds display
5. **Team generator** — ⚠️ integrate with `/team-picker` or inline mode
6. **Remove winner automatically** — ❌ classroom essential
7. **Shareable wheel links** — ❌ viral + SEO (`?w=` encoded state)
8. **Embed wheel on any website** — ❌ Phase A: `?embed=1` + copy iframe code
9. **Export wheel as image / video** — ❌ social sharing
10. **Unlimited saved wheels** — ✅ built via Switch Wheel

---

## Most related wheels

Show in a **Related Wheels** section on `/` — competitor-aligned names and SEO routes (replaces older duplicate labels like “Number Wheel”, “Color Wheel”, “Yes or No Wheel”).

### Competitor parity tools *(target SEO routes)*

| Tool name | Target SEO route | Current route / status | Maps to |
|-----------|------------------|------------------------|---------|
| **Spin the Wheel Random Picker** | `/spin-the-wheel-random-picker` | `/` (home hub) | Custom Spin Wheel — redirect or same page |
| **Yes or No** | `/yes-or-no` | `/yes-no-picker-wheel` | ✅ built — add SEO alias |
| **Random Number Picker** | `/random-number-picker` | `/number-picker-wheel` | ✅ built — add SEO alias |
| **Wheel of Colors** | `/wheel-of-colors` | `/color-picker-wheel` | ✅ built — add SEO alias |
| **Flip a Coin** | `/flip-a-coin` | — | ❌ planned — [coin-flip.md](./coin-flip.md) |
| **Magic 8 Ball** | `/magic-8-ball` | — | ❌ not built |
| **The Wheel of Fortune** | `/the-wheel-of-fortune` | — | ❌ not built |
| **Twister Wheel** | `/twister-wheel` | — | ❌ not built |
| **What To Do** | `/what-to-do` | — | ❌ not built |
| **Slime Challenge** | `/slime-challenge` | — | ❌ not built |

### Also link from hub (existing depth tools)

| Tool name | Route | Notes |
|-----------|-------|-------|
| Letter Picker Wheel | `/letter-picker-wheel` | Classroom / games |
| Team Picker Wheel | `/team-picker` | Groups from custom lists |
| Image Picker Wheel | `/image-picker-wheel` | Image segments |
| **Make a Word Wheel** | `/` (word mode) · `/make-a-word-wheel` (later) | Vocabulary, spelling — [make-a-word-wheel.md](./make-a-word-wheel.md) |
| Date Picker Wheel | `/date-picker-wheel` | Date lists |

**Removed from hub related list** *(duplicates — replaced by table above)*:  
~~Yes or No Wheel~~ → **Yes or No** · ~~Number Wheel~~ → **Random Number Picker** · ~~Color Wheel~~ → **Wheel of Colors** · ~~Wheel of Fortune Spinner~~ → **The Wheel of Fortune** · ~~Prize Wheel / Giveaway Wheel / Decision Wheel~~ → cover via hub + **What To Do** / custom wheel CTA

**Rule:** Every specialized wheel page gets a footer/section: *“Need a fully custom list? → [Custom Spin Wheel](/)”*

---

## SEO opportunity

**Goal:** Make `/` the **hub page** for all custom-wheel searches — not just “random name picker.”

### Primary keywords (hub page)

- Custom Spin Wheel
- Custom Wheel
- Create a Spin Wheel
- Online Spin Wheel
- Free Spin Wheel
- Editable Spin Wheel
- Wheel Maker / Online Wheel Maker
- Spin Wheel Creator
- Wheel Generator
- Random Wheel Generator
- Make Your Own Wheel

### Long-tail pages (future Layer 3 routes)

Each can be a thin landing + CTA back to hub, or hub sections with anchors:

| Long-tail intent | Suggested route |
|------------------|-----------------|
| Custom Prize Wheel | `/wheels/prize` or `/custom-prize-wheel` |
| Custom Decision Wheel | `/wheels/decision` |
| Custom Giveaway Wheel | `/wheels/giveaway` |
| Custom Classroom Wheel | `/wheels/classroom` |
| Custom Team Picker | `/wheels/team` |
| Custom Random Name Wheel | `/random-name-picker` (alias) |
| Custom Raffle Wheel | `/wheels/raffle` |
| Custom Lucky Wheel | `/wheels/lucky` |
| Custom Spinner Wheel | `/custom-spinner-wheel` |
| **Make a Word Wheel** | `/make-a-word-wheel` (alias → `/` word mode) |

### Recommended metadata (home)

```
Title: Custom Spin Wheel — Free Online Wheel Maker | Picker Wheel
Description: Create your own spin wheel with unlimited entries, AI lists, images, weighted odds, and shareable links. Free custom wheel maker for classrooms, raffles, and decisions.
```

### On-page SEO blocks (missing today)

- [ ] H1: **Custom Spin Wheel** (subtitle: Random Name Selector Picker)
- [ ] How to create a custom wheel (3–5 steps)
- [ ] Use cases: classroom, raffle, party, meeting, giveaway
- [ ] FAQ (10+ questions) + JSON-LD `FAQPage`
- [ ] Related Wheels internal link grid
- [ ] Server-rendered content below the wheel (not client-only)
- [ ] `app/sitemap.ts` — `/` priority 1.0

---

## What exists today (codebase)

- Main picker wheel with Manual Input + AI-Powered tabs
- Image upload on entries (max 10 images)
- Templates section (quick-start option sets)
- Game modes: bingo, memory, collection, sequence + advanced modes
- Achievements, themes, analytics, social hub
- Multiple wheel instances (Switch Wheel: create / switch / rename / delete)
- Settings: spin speed, duration, mystery spin, confetti, sound
- Save / load to database via API
- Results modal — all wheels, top-left of card
- Spin sound (`/wheel-sound.mp3`) + win sound (`/sound-win.mp3`)

---

## Gaps vs competitors

| Feature | Status | Priority |
|---------|--------|----------|
| Hub positioning as Custom Spin Wheel | Missing (copy still “Picker Wheel”) | High |
| Related Wheels section | Missing | High |
| Weighted entries (full UX) | Partial | High |
| CSV / Excel import | Missing | High |
| OCR image import | Missing | Medium |
| Remove winner automatically | Missing | High |
| Share wheel URL | Button only, not wired | High |
| Embed / iframe mode | Missing — **Phase A: embed on any site** | High |
| Multi-winner pick | Missing | Medium |
| Drag & drop reorder | Missing | Medium |
| Per-page SEO metadata | Missing (`v0 App` in root layout) | High |
| FAQ / how-to content block | Missing | High |
| Post-spin result detail panel | Partial (winner card only) | High |

---

## Post-spin result value

Today: **Spin → name**. Expand to a **result panel**:

- Winner name + spin # / timestamp
- Wheel name (which saved wheel)
- Odds (if weighted)
- **Actions:** Remove from wheel · Spin again · Share result · Copy
- **Related:** Team Picker · Yes/No · Letter · Number

### Share result (viral loop)

```
Custom entries on wheel → SPIN → Alex wins!
→ [ Share Result ] [ Copy ] [ Download card ]
```

Example share text: `Alex was picked! 🎯 — Custom Spin Wheel decided.`

---

## Recommended future routes

```
/                              (Custom Spin Wheel hub — current home)
/spin-the-wheel-random-picker  (competitor SEO alias → /)
/custom-spin-wheel             (SEO alias → /)
/random-name-picker            (legacy SEO alias)
/random-name-selector          (SEO alias)

# Competitor parity (SpinTheWheel.app official tools)
/flip-a-coin
/magic-8-ball
/random-number-picker          (alias → /number-picker-wheel)
/yes-or-no                     (alias → /yes-no-picker-wheel)
/wheel-of-colors               (alias → /color-picker-wheel)
/the-wheel-of-fortune
/twister-wheel
/what-to-do
/slime-challenge
/make-a-word-wheel              (alias → / word mode)
```

---

## Upgrade checklist

### Phase A — Core hub *(suggested order — do first)*
- [ ] **Remove winner automatically** toggle
- [ ] **Weighted entries** — full UX + odds display
- [ ] Multi-winner mode (pick 2–10)
- [ ] **Wheel embed** — users embed our wheel on **any site** (`?embed=1` + copy iframe code)
- [ ] **Make a Word Wheel** mode on home — paste words, templates, word AI — [make-a-word-wheel.md](./make-a-word-wheel.md)

#### Wheel embed (Phase A)
- [ ] Clean embed UI: hide header, footer, nav when `?embed=1`
- [ ] Share / Embed dialog with **copy iframe** snippet
- [ ] Wheel state in URL (`?w=`) so embeds stay shareable
- [ ] Responsive height for blogs, LMS, Notion, school sites
- [ ] Optional fullscreen inside iframe

```html
<iframe
  src="https://yoursite.com/?embed=1&w=ENCODED_WHEEL"
  width="100%"
  height="560"
  frameborder="0"
  title="Spin Wheel"
  allow="fullscreen"
></iframe>
```

### Phase B — Import, share & hub polish
- [ ] Rebrand home H1/meta: **Custom Spin Wheel** (+ subtitle)
- [ ] **CSV / Excel import** (+ export)
- [ ] Paste bulk list UX
- [ ] **Share wheel URL** — encode options in `?w=`
- [ ] Wire header **Share** button
- [ ] Drag & drop reorder
- [ ] **Related Wheels** section — 10 competitor parity tools (table above)
- [ ] Footer on every tool: “Create custom wheel → `/`”
- [ ] Per-page `metadata` + Open Graph

### Phase 2 — Import, modes & SEO cluster
- [ ] Build **Flip a Coin** (`/flip-a-coin`)
- [ ] Build **Magic 8 Ball** (`/magic-8-ball`)
- [ ] Build **The Wheel of Fortune** (`/the-wheel-of-fortune`)
- [ ] Build **Twister Wheel** (`/twister-wheel`)
- [ ] Build **What To Do** (`/what-to-do`)
- [ ] Build **Slime Challenge** (`/slime-challenge`)
- [ ] SEO aliases: `/yes-or-no`, `/random-number-picker`, `/wheel-of-colors`, `/spin-the-wheel-random-picker`
- [ ] **QR code** for shared wheels
- [ ] **Team generator** — inline or pre-fill `/team-picker`
- [ ] **Elimination mode**
- [ ] Expand **AI-generated** prompts + categories
- [ ] Static SEO sections: How to use, Use cases, FAQ
- [ ] JSON-LD: `WebApplication` + `FAQPage`
- [ ] Launch 2–3 long-tail pages linking to hub

### Phase 3 — Depth & distribution
- [ ] **OCR image import**
- [ ] Export wheel as PNG / video / GIF
- [ ] **Tournament mode**
- [ ] Dark / light mode
- [ ] Custom pointer + emojis on segments
- [ ] Shareable **result page** (`/r/abc123`)
- [ ] Download results CSV
- [ ] Public saved wheels (Layer 5 UGC)
- [ ] Classroom presenter mode (fullscreen, minimal chrome)

---

## Success metrics

- Rank for **custom spin wheel**, **wheel maker**, **create a spin wheel**
- Maintain rankings for **random name picker**, **wheel of names**
- Internal link CTR: specialized wheels → hub and hub → specialized wheels
- Share link / embed adoption
- Time on page > competitor thin wheel pages
- Saved wheels per user (Switch Wheel usage)

---

## Cross-links

- Platform shared gaps: [README.md](./README.md)
- Team flow: [team-picker.md](./team-picker.md)
- Make a Word Wheel: [make-a-word-wheel.md](./make-a-word-wheel.md)
- Yes/No decisions: [yes-no-picker-wheel.md](./yes-no-picker-wheel.md)
- Competitor sitemap analysis: `app/spinthewheel.md`

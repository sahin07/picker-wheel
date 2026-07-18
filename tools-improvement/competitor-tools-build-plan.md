# Competitor Tools — Build Plan (product first, SEO later)

**Focus:** Which tools to **create** vs **improve**, and **MVP features** per tool.  
**Defer:** SEO routes, metadata, FAQ pages, redirects — add after tools work.

---

## At a glance

| Tool | Page exists? | Action | Build effort |
|------|--------------|--------|--------------|
| Custom Spin Wheel | ✅ `/` | **Improve features** | Ongoing |
| **Make a Word Wheel** | ✅ `/` (mode) | **CREATE mode on home** | Low — [make-a-word-wheel.md](./make-a-word-wheel.md) |
| Yes or No | ✅ `/yes-no-picker-wheel` | **Improve features** | Low |
| Random Number Picker | ✅ `/number-picker-wheel` | **Improve features** | Low |
| Wheel of Colors | ✅ `/color-picker-wheel` | **Polish** (already deep) | Low |
| **Flip a Coin** | ❌ | **CREATE** | ⭐ Easy |
| **Dice Roll** | ❌ | **CREATE** (header dead link) | ⭐ Easy |
| **Magic 8 Ball** | ❌ | **CREATE** | ⭐⭐ Medium |
| **What To Do** | ❌ | **CREATE** | ⭐⭐ Medium |
| **Twister Wheel** | ❌ | **CREATE** | ⭐⭐ Medium |
| **The Wheel of Fortune** | ❌ | **CREATE** | ⭐⭐ Medium |
| **Slime Challenge** | ❌ | **CREATE** | ⭐⭐⭐ Harder |

**Recommended build order:** **Make a Word Wheel (home)** → Flip a Coin → Dice Roll → Magic 8 Ball → What To Do → Twister → Wheel of Fortune → Slime Challenge

---

## ✅ Already built — feature gaps only

### 1. Custom Spin Wheel (home `/`)

**Status:** Main product — do not rebuild page.

| Priority | Feature | Notes |
|----------|---------|-------|
| High | Weighted entries (full UX) | `smartWeights` in store; needs UI + odds |
| High | Remove winner after spin | Classroom / raffle essential |
| High | CSV / Excel import | Bulk add entries |
| High | Share wheel link | Encode state in URL |
| High | Multi-winner (pick 2–10) | Table stakes |
| High | **Wheel embed** | Users embed our wheel on any site — `?embed=1` iframe |
| Medium | Drag & drop reorder | Entry list UX |
| Medium | Paste bulk list | One textarea → many options — **Make a Word Wheel** |
| Medium | **Make a Word Wheel mode** | Paste words, templates, word AI — see [make-a-word-wheel.md](./make-a-word-wheel.md) |
| Medium | OCR image → entries | Photo of list → wheel |
| Low | Export wheel PNG / GIF | Social sharing |

**Do not build:** New page yet — ship word mode on `/`; optional `/make-a-word-wheel` alias later.

---

### 1b. Make a Word Wheel (home `/` — word mode)

**Status:** Not a separate page — **CREATE as home feature bundle** before standalone route.

| Priority | Feature | Notes |
|----------|---------|-------|
| High | **Paste word list** (one per line) | Core “make a word wheel” workflow |
| High | Remove word after spin | Classroom / vocabulary |
| High | Word-focused **AI prompts** | “20 Halloween words”, sight words |
| Medium | Word **templates** | Vocabulary, writing prompts, sight words |
| Medium | Home copy: “Make a Word Wheel” label | Subtitle or input tab |
| Low | Route `/make-a-word-wheel` | SEO alias after mode ships |

**Full spec:** [make-a-word-wheel.md](./make-a-word-wheel.md)

---

### 2. Yes or No (`/yes-no-picker-wheel`)

**Status:** Richest simple tool already — challenges, AI, themes, history.

| Priority | Feature | Notes |
|----------|---------|-------|
| High | **Maybe** third option | Yes / No / Maybe mode |
| High | Weighted probability | Bias slider (e.g. 70% Yes) |
| Medium | Share link with question text | `?q=Should+I+go` |
| Medium | Simpler “quick spin” mode | Hide gamification for casual users |
| Low | Decision journal export | CSV of past answers |

**Do not build:** New page — extend `YesNoPickerWheel` component.

---

### 3. Random Number Picker (`/number-picker-wheel`)

**Status:** Working wheel; thinner than Yes/No.

| Priority | Feature | Notes |
|----------|---------|-------|
| High | Pick **N unique** numbers from range | e.g. 5 numbers from 1–50 |
| High | Range presets | 1–10, 1–100, 1–1000 one-click |
| Medium | Exclude numbers | “Not 7, 13” |
| Medium | No-repeat mode | Until pool empty |
| Medium | Share URL with min/max/count | |
| Low | Lottery / raffle mode label | Same engine, preset copy |

**Do not build:** New page — extend `NumberPickerWheel` component.

---

### 4. Wheel of Colors (`/color-picker-wheel`)

**Status:** **Ahead of competitor** — AI, palette, color-blind simulator.

| Priority | Feature | Notes |
|----------|---------|-------|
| Medium | Export palette (CSS / JSON) | Designer workflow |
| Medium | Share palette URL | |
| Low | Named preset palettes | Material, CSS colors |
| Low | Platform achievements on page | Optional parity |

**Do not build:** New page unless simplifying a “quick color spin” mode for casual users.

---

## ❌ Missing tools — CREATE these pages

> **Home-first exception:** **Make a Word Wheel** ships as a **mode on `/`**, not a new page. See [make-a-word-wheel.md](./make-a-word-wheel.md) and §1b above. Optional route `/make-a-word-wheel` later.

### 4b. Make a Word Wheel (home mode — ship before Flip a Coin)

**Effort:** ⭐ Low (extends home) · **Doc:** [make-a-word-wheel.md](./make-a-word-wheel.md)

**Purpose:** Paste/type words → spin random word. Vocabulary, spelling, writing prompts.

#### MVP (v1 on `/`)

| Feature | Required |
|---------|----------|
| Paste word list (one per line) | ✅ |
| Remove word after spin toggle | ✅ |
| Word-focused AI generate | ✅ |
| “Make a Word Wheel” home label / help text | ✅ |
| Spin → show winning word | ✅ (existing) |
| Word templates (vocabulary, prompts) | ✅ |

**Do not build:** Separate page until home mode works. Reuse `EnhancedWheelSection` + input panels.

---

### 5. Flip a Coin `/flip-a-coin`

**Effort:** ⭐ Very easy · **Doc:** [coin-flip.md](./coin-flip.md)

**Purpose:** Binary decision utility; links to Yes/No and Custom Spin Wheel.

#### MVP (v1)

| Feature | Required |
|---------|----------|
| Animated coin flip | ✅ |
| Heads / Tails result | ✅ |
| Click or tap to flip | ✅ |
| Flip sound + mute toggle | ✅ |
| Flip history (last 20) | ✅ |
| Copy result text | ✅ |
| Reset history | ✅ |
| Best of 3 / Best of 5 | ✅ |
| Fullscreen button | ✅ |

#### v2 (after MVP)

- Custom labels (Coffee / Tea)
- Custom images on each face
- Multiple coins (1–100)
- Heads/Tails statistics chart
- Auto-flip mode
- Streak counter
- Fun presets: Yes/No, Truth/Dare, Win/Lose

**Tech:** New isolated page — no wheel manager required for v1. Reuse settings sound/confetti patterns.

---

### 6. Dice Roll `/dice-roll`

**Effort:** ⭐ Very easy · **Doc:** [dice-roll.md](./dice-roll.md)  
**Note:** Not in competitor’s official 10, but header menu already lists it (dead link).

#### MVP (v1)

| Feature | Required |
|---------|----------|
| Roll 1–6 dice | ✅ |
| Dice types: D4, D6, D8, D10, D12, D20 | ✅ |
| Sum + individual face values | ✅ |
| Roll animation | ✅ |
| Roll sound | ✅ |
| Session history (last 20 rolls) | ✅ |
| Copy / share result text | ✅ |

#### v2

- D&D: 4d6 drop lowest
- Advantage / disadvantage (2d20, take high/low)
- Yahtzee helper
- Custom labeled faces
- Link to Number Picker + board-game hub

**Tech:** New page; can share dice animation component with future board-game tools.

---

### 7. Magic 8 Ball `/magic-8-ball`

**Effort:** ⭐⭐ Medium · **Competitor:** Official tool + many UGC variants

**Purpose:** Ask a question → shake → classic 8-ball answer. Fortune / fun category.

#### MVP (v1)

| Feature | Required |
|---------|----------|
| Question input (optional) | ✅ |
| Shake / click to reveal | ✅ |
| 20 classic Magic 8-Ball responses | ✅ |
| Answer categories: positive / negative / neutral | ✅ |
| 8-ball visual + shake animation | ✅ |
| Answer history (session) | ✅ |
| Sound on reveal | ✅ |
| Copy answer | ✅ |

#### v2

- Custom answer list (user edits 8+ answers)
- “Mystic” / fun themes
- Share result: “Outlook good — Magic 8 Ball”
- Link to Yes/No wheel + Wheel of Fortune

**Classic 20 answers:** Include standard set (It is certain, Reply hazy try again, etc.)

**Tech:** New page; could use wheel UI for “spin answers” variant later, but MVP = 8-ball UX not pie wheel.

---

### 8. What To Do `/what-to-do`

**Effort:** ⭐⭐ Medium · **Competitor:** Official tool; huge UGC long-tail

**Purpose:** “I’m bored” → spin → get an activity suggestion.

#### MVP (v1)

| Feature | Required |
|---------|----------|
| Pre-loaded activity list (50+ items) | ✅ |
| Categories: indoor, outdoor, creative, social, quick (5 min) | ✅ |
| Custom add/edit/delete activities | ✅ |
| Spin wheel (reuse enhanced wheel pattern) | ✅ |
| Remove activity after pick (optional toggle) | ✅ |
| Shuffle list | ✅ |
| AI generate activities from prompt | ✅ (reuse `/api/ai`) |

#### v2

- Filters: kids / teens / adults, no phone, free only
- Time filter: 5 / 15 / 30 / 60 min
- Saved wheels (“Summer bored list”, “Rainy day”)
- Link to Food Wheel (future) + Custom Spin Wheel

**Default list examples:** Read a book, Go for a walk, Call a friend, Draw something, Clean one room, Learn 10 words…

**Tech:** New page; closest to home picker — reuse `enhanced-wheel-section` + input panel patterns.

---

### 9. Twister Wheel `/twister-wheel`

**Effort:** ⭐⭐ Medium · **Competitor:** Official tool + “twister-wheel-extreme” UGC

**Purpose:** Game helper — spin for **body part** + **color** (two wheels or combined).

#### MVP (v1)

| Feature | Required |
|---------|----------|
| **Wheel 1:** Body parts (Left hand, Right foot, …) | ✅ |
| **Wheel 2:** Colors (Red, Blue, Green, Yellow) | ✅ |
| Spin both (or one combined result) | ✅ |
| Classic Twister defaults | ✅ |
| Custom body parts list | ✅ |
| Custom colors list | ✅ |
| Big readable result card | ✅ |
| Sound + confetti (optional) | ✅ |

#### v2

- “Extreme” mode — more body parts / silly options
- Elimination mode — remove combo after use
- Player count / team mode
- Fullscreen presenter mode

**Tech:** New page; dual wheel layout or sequential spin (part then color).

---

### 10. The Wheel of Fortune `/the-wheel-of-fortune`

**Effort:** ⭐⭐ Medium · **Competitor:** Official tool; used as site demo wheel

**Purpose:** Game-show style prize wheel — custom labels, dramatic spin.

#### MVP (v1)

| Feature | Required |
|---------|----------|
| Custom text segments (add/edit/delete) | ✅ |
| Default demo prizes (Trip, $500, Bankrupt, …) | ✅ |
| Large colorful wheel (game-show feel) | ✅ |
| Dramatic spin (longer duration option) | ✅ |
| Remove segment after win (optional) | ✅ |
| Winner history | ✅ |
| Sound + confetti on win | ✅ |

#### v2

- “Bankrupt” / “Lose turn” special segments
- Multiple players turn tracker
- Import prize list from CSV
- Link to Custom Spin Wheel for fully custom lists

**Note:** Overlaps with home Custom Spin Wheel — differentiate with **game-show presets**, **special segments**, and **presenter UI**. Not a duplicate of `/`.

**Tech:** New page; can fork `enhanced-wheel-section` with fortune styling + preset templates.

---

### 11. Slime Challenge `/slime-challenge`

**Effort:** ⭐⭐⭐ Harder · **Competitor:** Official tool; YouTube/kids trend

**Purpose:** Mystery wheel for slime videos — ingredient, texture, color, challenge.

#### MVP (v1)

| Feature | Required |
|---------|----------|
| Mode switcher: **Ingredient** / **Color** / **Challenge** | ✅ |
| Ingredient list (glue, activator, glitter, beads, …) | ✅ |
| Color list | ✅ |
| Challenge list (no hands, blindfold, 30 sec, …) | ✅ |
| Custom add/edit entries per mode | ✅ |
| Spin wheel per mode | ✅ |
| Remove picked item (optional) | ✅ |
| Fun kid-friendly UI | ✅ |

#### v2

- Multi-wheel: ingredient + color + challenge in one session
- “Mystery box” reveal animation
- Save slime recipe session (export list)
- Link to What To Do + Custom Spin Wheel

**Tech:** New page; multi-tab like slime YouTuber wheels. Reuse wheel + tab pattern from other tools.

---

## Shared features (all new tools)

Apply to every **CREATE** tool above:

| Feature | Include in MVP? |
|---------|-----------------|
| Header + Settings panel | ✅ |
| Mute / sound toggle | ✅ |
| Mobile-friendly layout | ✅ |
| Link back to Custom Spin Wheel `/` | ✅ |
| Link to 2–3 related tools | ✅ |
| Wheel manager persistence | Optional v1; Yes for What To Do / Fortune / Slime |

---

## What NOT to build now

| Item | Why wait |
|------|----------|
| SEO route aliases (`/yes-or-no`, etc.) | After tools work |
| FAQ / JSON-LD / sitemap | After tools work |
| UGC public wheels | Layer 5 — later |
| Food Wheel | Separate rich resource — not competitor official 10 |

---

## Suggested order — home Phase A first

Complete **Custom Spin Wheel (`/`)** before new tool pages.

### Phase A — Core hub (do first)

| # | Feature | Why |
|---|---------|-----|
| 1 | Remove winner after spin | Classroom / raffle essential |
| 2 | Weighted entries (full UX) | Odds control |
| 3 | Multi-winner (pick 2–10) | Table stakes |
| 4 | **Wheel embed** | Users embed our wheel on **any website** via iframe (`?embed=1`) |
| 5 | Make a Word Wheel mode | Paste words + word AI — [make-a-word-wheel.md](./make-a-word-wheel.md) |

#### Wheel embed (Phase A detail)

**Goal:** Anyone can put our spin wheel on their blog, classroom site, Discord docs, Notion, Shopify, etc.

| Feature | Required |
|---------|----------|
| `?embed=1` (or `/embed`) clean UI — hide header/footer/ads | ✅ |
| Copy **iframe embed code** from Share / Embed dialog | ✅ |
| Wheel options encoded in URL (or short share id) so embed stays in sync | ✅ |
| Responsive iframe (works on mobile + desktop) | ✅ |
| Optional: `?embed=1&spin=1` auto-height / minimal chrome | ✅ |

Example snippet users copy:

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

### Phase B — Import & share
6. Paste bulk list / CSV import  
7. Share wheel URL  
8. Wire header Share button  
9. Drag & drop reorder  

### Phase C — Related & polish
10. Post-spin result panel  
11. Related Wheels section  
12. Home branding copy  

---

## Suggested sprints (after Phase A)

### Sprint 1 — Quick utilities (1–2 weeks)
1. Flip a Coin (v1)
2. Dice Roll (v1)
3. Wire header menu links

### Sprint 2 — Wheel-based missing tools (2–3 weeks)
4. What To Do (v1)
5. Wheel of Fortune (v1)

### Sprint 3 — Specialty wheels (2–3 weeks)
6. Magic 8 Ball (v1)
7. Twister Wheel (v1)

### Sprint 4 — Niche / kids
8. Slime Challenge (v1)

### Sprint 5 — Improve existing
9. Yes/No: Maybe + weighted
10. Number: pick N unique + presets

---

## Cross-links

- Hub strategy: [random-name-picker.md](./random-name-picker.md)
- Coin Flip detail: [coin-flip.md](./coin-flip.md)
- Dice detail: [dice-roll.md](./dice-roll.md)
- Platform index: [README.md](./README.md)

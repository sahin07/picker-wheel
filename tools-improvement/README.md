# Tools Improvement — Future Upgrade Docs

This folder documents **gaps, missing features, and future upgrades** for each Picker Wheel tool.

## Purpose

Competitors like SpinTheWheel.app win on **search traffic + page volume**. Our advantage is **product depth**. These docs bridge the gap: turn each tool into a **decision resource page**, not just a spinner.

## Strategy layers (reference)

| Layer | Description | Status |
|-------|-------------|--------|
| Layer 1 | Generic tools (name, yes/no, number, etc.) | Mostly built |
| Layer 2 | Vertical hubs (`/wheels/pokemon`, `/wheels/sports`) | Not built |
| Layer 3 | Intent-specific sub-pages (e.g. Pokémon Type Wheel) | Not built |
| Layer 4 | Rich landing pages (FAQ, charts, filters, related tools) | Mostly missing |
| Layer 5 | Public UGC wheels + share URLs | Not built |

## Shared gaps (all tools)

These apply to **every** tool unless noted otherwise in the tool-specific doc.

### SEO & discoverability
- [ ] Per-tool `metadata` (title, description, Open Graph)
- [ ] `app/sitemap.ts` and `app/robots.ts`
- [ ] Server-rendered SEO content below the wheel (FAQ, how-to, related links)
- [ ] Hub pages and internal linking structure
- [ ] Structured data (JSON-LD: WebApplication, FAQPage)

### Distribution
- [ ] Share wheel via URL (encoded state in query param)
- [ ] **Wheel embed** — users embed our wheel on any site (`?embed=1` + iframe code) — **Phase A**
- [ ] Copy link / QR code
- [ ] Export results (CSV / PNG screenshot)

### Core wheel features (competitor table stakes)
- [ ] Weighted entries (per-option probability)
- [ ] Multi-winner selection
- [ ] CSV import / export for options
- [ ] Remove winner after spin (elimination — partial on game wheels)
- [ ] Fullscreen presentation mode polish

### Platform polish
- [ ] Replace generic `layout.tsx` metadata (`v0 App`)
- [ ] Wire header **Share** button to real share flow
- [ ] Coin Flip & Dice Roll pages (menu items exist, no routes)

## Tool index

| Tool | Route | Doc |
|------|-------|-----|
| Random Name Selector Picker / **Custom Spin Wheel** (hub) | `/` | [random-name-picker.md](./random-name-picker.md) |
| **Make a Word Wheel** *(home mode)* | `/` · `/make-a-word-wheel` (later) | [make-a-word-wheel.md](./make-a-word-wheel.md) |
| Country Picker Wheel | `/country-wheel` | [country-wheel.md](./country-wheel.md) |
| State Picker Wheel | `/state-wheel` | [state-wheel.md](./state-wheel.md) |
| MLB Picker Wheel | `/mlb-wheel` | [mlb-wheel.md](./mlb-wheel.md) |
| NBA Picker Wheel | `/nba-wheel` | [nba-wheel.md](./nba-wheel.md) |
| Fortnite Skins Picker | `/fortnite-wheel` | [fortnite-wheel.md](./fortnite-wheel.md) |
| Pokémon Picker Wheel | `/pokemon-wheel` | [pokemon-wheel.md](./pokemon-wheel.md) |
| LoL Champions Picker | `/lol-wheel` | [lol-wheel.md](./lol-wheel.md) |
| Number Picker Wheel | `/number-picker-wheel` | [number-picker-wheel.md](./number-picker-wheel.md) |
| Letter Picker Wheel | `/letter-picker-wheel` | [letter-picker-wheel.md](./letter-picker-wheel.md) |
| Date Picker Wheel | `/date-picker-wheel` | [date-picker-wheel.md](./date-picker-wheel.md) |
| Yes/No Picker Wheel | `/yes-no-picker-wheel` | [yes-no-picker-wheel.md](./yes-no-picker-wheel.md) |
| Color Picker Wheel | `/color-picker-wheel` | [color-picker-wheel.md](./color-picker-wheel.md) |
| Image Picker Wheel | `/image-picker-wheel` | [image-picker-wheel.md](./image-picker-wheel.md) |
| Team Picker Wheel | `/team-picker` | [team-picker.md](./team-picker.md) |
| Coin Flip *(planned)* | `/flip-a-coin` | [coin-flip.md](./coin-flip.md) |
| Dice Roll *(planned)* | — | [dice-roll.md](./dice-roll.md) |

## Competitor parity tools *(SpinTheWheel.app official — SEO routes)*

**Build plan (features first, SEO later):** [competitor-tools-build-plan.md](./competitor-tools-build-plan.md)

Hub page `/` should link to these. Duplicates in naming are **replaced** with competitor-aligned labels below.

| Tool name | Target route | Built? | Notes |
|-----------|--------------|--------|-------|
| Spin the Wheel Random Picker | `/spin-the-wheel-random-picker` | ✅ (as `/`) | Hub alias |
| Yes or No | `/yes-or-no` | ✅ | Alias → `/yes-no-picker-wheel` |
| Random Number Picker | `/random-number-picker` | ✅ | Alias → `/number-picker-wheel` |
| Wheel of Colors | `/wheel-of-colors` | ✅ | Alias → `/color-picker-wheel` |
| Flip a Coin | `/flip-a-coin` | ❌ | See [coin-flip.md](./coin-flip.md) |
| Magic 8 Ball | `/magic-8-ball` | ❌ | New build |
| The Wheel of Fortune | `/the-wheel-of-fortune` | ❌ | New build |
| Twister Wheel | `/twister-wheel` | ❌ | New build |
| What To Do | `/what-to-do` | ❌ | New build |
| Slime Challenge | `/slime-challenge` | ❌ | New build |
| **Make a Word Wheel** | `/make-a-word-wheel` | ⚠️ (as `/` mode) | Ship on home first — [make-a-word-wheel.md](./make-a-word-wheel.md) |

## Future rich resource tools *(Layer 3–4 — not built)*

High-depth landing pages designed to outrank competitor thin wheels. Each page = **interactive tool + knowledge hub + decision assistant**.

| Tool | Suggested route | Doc |
|------|-----------------|-----|
| Pokémon Type Wheel | `/pokemon/type-wheel` | [pokemon-type-wheel.md](./pokemon-type-wheel.md) |
| Roblox Game Wheel | `/roblox/game-wheel` | [roblox-game-wheel.md](./roblox-game-wheel.md) |
| Food Wheel | `/food-wheel` | [food-wheel.md](./food-wheel.md) |

### What makes these different

| Tool | Competitor has | We will build |
|------|----------------|---------------|
| **Pokémon Type Wheel** | Wheel + description | Wheel, type chart, strengths/weaknesses, best Pokémon, worst matchups, gen filters, team builder, trivia, FAQ, related tools |
| **Roblox Game Wheel** | Wheel + game names | Wheel, genre/difficulty/player filters, screenshots, official links, pros/cons, similar games, trending, FAQ |
| **Food Wheel** | Pizza, Burger, Sushi slices | Wheel, cuisine, price, cook time, calories, vegetarian, recipes, restaurant ideas, FAQ |

## Priority order (recommended)

1. **Custom Spin Wheel hub Phase A** — remove winner, weighted, multi-winner, **wheel embed (any site)**, Make a Word Wheel mode
2. **SEO foundation** — metadata + sitemap + route aliases (`/yes-or-no`, `/random-number-picker`, etc.)
3. **Share / Related Wheels** — share URL, Related Wheels section, hub polish
4. **Vertical hubs** — Pokémon, Fortnite, LoL, Sports, Travel
5. **Intent sub-pages** — type wheels, starter wheels, conference wheels
6. **Rich resource tools** — Pokémon Type Wheel, Roblox Game Wheel, Food Wheel
7. **Competitor parity builds** — Magic 8 Ball, Wheel of Fortune, Twister, What To Do, Slime Challenge, Flip a Coin
8. **Distribution polish** — CSV import, QR codes, export PNG/GIF
9. **Utility completeness** — Dice Roll (low effort hub link)
10. **UGC public wheels** — long-tail SEO at scale

## Competitor reference

- **Full competitor analysis (follow this for every wheel page):** [competitor-spinthewheel-analysis.md](./competitor-spinthewheel-analysis.md)
- Sitemap analysis: `app/spinthewheel.md` (~24k URLs)
- Categorized HTML export: `app/spinthewheel-tools.html`
- Official competitor tools (use these **exact names + routes** on hub Related Wheels):
  - Spin the Wheel Random Picker → `/spin-the-wheel-random-picker`
  - Yes or No → `/yes-or-no`
  - Random Number Picker → `/random-number-picker`
  - Wheel of Colors → `/wheel-of-colors`
  - Flip a Coin → `/flip-a-coin`
  - Magic 8 Ball → `/magic-8-ball`
  - The Wheel of Fortune → `/the-wheel-of-fortune`
  - Twister Wheel → `/twister-wheel`
  - What To Do → `/what-to-do`
  - Slime Challenge → `/slime-challenge`

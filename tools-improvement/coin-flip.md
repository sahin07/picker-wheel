# Coin Flip — Future Tool *(not built)*

**Route:** None (header menu item only)  
**Competitor official tool:** `https://spinthewheel.app/flip-a-coin`  
**Doc status:** Reviewed against traffic-growth strategy — **build eventually, not first**

---

## Current status (codebase check)

| Item | Status |
|------|--------|
| Header menu link | ❌ Listed in `components/header.tsx` Tools dropdown — **no `href`, dead item** |
| Route / page | ❌ Not built |
| Component | ❌ Not built |
| Wheel manager integration | ❌ Not built |
| Related Yes/No tool | ✅ `/yes-no-picker-wheel` exists — natural cross-link target |

---

## Strategic assessment

| Category | Rating | Notes |
|----------|--------|-------|
| Development effort | ⭐⭐⭐⭐⭐ Very easy | Small isolated page, no dataset |
| SEO potential | ⭐⭐⭐☆☆ Good | Decent demand, but crowded + SERP features answer directly |
| Revenue potential | ⭐⭐☆☆☆ Low | Utility page, short sessions |
| Competitive advantage | ⭐☆☆☆☆ Very low | Hundreds of identical tools exist |
| User retention | ⭐⭐☆☆☆ Low | One-off use unless differentiated |
| **Worth building eventually** | ✅ **Yes** | Platform completeness + internal linking |

### Priority label (corrected)

| Wrong framing | Right framing |
|---------------|---------------|
| ~~High priority because SEO~~ | **Medium priority — high-value, low-effort completeness feature** |
| ~~Quick traffic win~~ | Fills expected gap in randomization toolkit |
| ~~Differentiator~~ | Strengthens **decision hub** + internal link graph |

> **For fastest traffic growth**, prioritize: shareable wheels, embed, UGC public wheels, rich landing pages (Pokémon Type, Roblox, Food) — not Coin Flip alone.

---

## Why competitors have it

SpinTheWheel.app includes Coin Flip because they're building a **complete random-decision platform**, not because it drives most traffic.

Their utility stack roughly:

```
Random Name Picker → Spin Wheel → Dice → Coin Flip → Number → Letter → Color → ...
```

Users expect these basics. Missing Coin Flip makes the site feel **incomplete** even if nobody cites it as the reason they came.

**Coin Flip = completeness + decision-hub credibility**, not moat.

---

## SEO reality check

### Target keywords

**Primary hub**
- `flip a coin`
- `coin flip`
- `heads or tails`
- `coin toss`
- `online coin flip`
- `random coin flip`

**SEO variant pages (same engine)**
- `heads or tails` → `/heads-or-tails`
- `yes or no coin` → `/yes-or-no-coin`
- `decision coin` → `/decision-coin`
- `toss a coin` → `/toss-a-coin`
- `flip a penny` → `/flip-a-penny`
- `two choice picker` → `/two-choice-picker`
- `random yes no generator` → `/random-yes-no-generator`

### Why SEO alone doesn't justify "High" priority

- Decent search demand, but **highly competitive**
- Google often shows **instant answers** / featured snippets
- Browsers and OS widgets provide coin flips natively
- Many one-page tools already rank

**Verdict:** Useful page to have. Unlikely to become a **top traffic driver**. Pair with strong internal linking and informational FAQ content — don't expect it to carry growth.

---

## Recommended routes

```
/flip-a-coin          (match competitor URL pattern)
/coin-flip            (alias)
/wheels/tools/coin-flip
```

### SEO pages *(same engine, different landing copy)*

One coin-flip engine powers multiple intent-specific routes — shared component, unique metadata + FAQ per page:

| Route / slug | Primary keyword intent | Notes |
|--------------|------------------------|-------|
| `/flip-a-coin` | Coin Flip | Main hub |
| `/coin-flip` | Coin Flip | Alias |
| `/heads-or-tails` | Heads or Tails | Simple mode default copy |
| `/yes-or-no-coin` | Yes or No Coin | Fun mode preset |
| `/decision-coin` | Decision Coin | Decision / custom labels mode |
| `/toss-a-coin` | Toss a Coin | Sports/casual intent |
| `/flip-a-penny` | Flip a Penny | Penny skin preset |
| `/two-choice-picker` | Two Choice Picker | Custom two-option mode |
| `/random-yes-no-generator` | Random Yes/No Generator | Cross-link `/yes-no-picker-wheel` |

Each page: same flip engine + mode preset + unique H1, FAQ, JSON-LD. Internal links between variants = topical cluster.

---

## Target feature list

Full roadmap organized by category. **Not built** unless noted in MVP sections below.

### Core

| Feature | Description | Status | Ship |
|---------|-------------|--------|------|
| **Flip coin** | One-click animated flip → result | Missing | v1 |
| **Heads / Tails result** | Clear binary outcome display | Missing | v1 |
| **Flip history** | Session log (last 10–20 flips) | Missing | v1 |
| **Fullscreen mode** | Presenter / classroom-friendly view | Missing | v1 |
| **Sound on/off** | Flip landing sound toggle | Missing | v1 |
| **Animation speed** | Slow / normal / fast flip animation | Missing | v1 |

### Customization

| Feature | Description | Status | Ship |
|---------|-------------|--------|------|
| **Choose coin design** | Preset skins: classic, penny, gold, minimal | Missing | v2 |
| **Custom text instead of Heads/Tails** | Label faces: Coffee/Tea, Go/Stay | Missing | v2 (Decision mode) |
| **Upload custom images for each side** | User images on coin faces | Missing | v2 |
| **Dark / Light theme** | Reuse platform theme system | Partial — app has themes | v1 |

### Advanced

| Feature | Description | Status | Ship |
|---------|-------------|--------|------|
| **Flip multiple coins at once** | 1–100 coins in one action | Missing | v2 |
| **Best of 3** | Tournament series — first to 2 wins | Missing | v1 |
| **Best of 5** | Tournament series — first to 3 wins | Missing | v1 |
| **Best of 7** | Tournament series — first to 4 wins | Missing | v2 |
| **Auto-flip mode** | Continuous flips at interval (e.g. every 2s) | Missing | v2 |
| **Flip until Heads** | Auto-flip until Heads lands | Missing | v2 |
| **Flip until Tails** | Auto-flip until Tails lands | Missing | v2 |
| **Streak counter** | Current + longest H/T streak | Missing | v2 |
| **Heads vs Tails statistics** | Totals, %, distribution chart | Missing | v2 |

### Fun modes *(presets on two-option engine)*

| Mode | Face A | Face B | Ship |
|------|--------|--------|------|
| **Yes / No mode** | Yes | No | v2 |
| **Truth / Dare mode** | Truth | Dare | v2 |
| **Win / Lose mode** | Win | Lose | v2 |
| **Red / Blue mode** | Red | Blue | v2 |
| **Custom two-option mode** | User-defined labels (+ images) | User-defined | v2 (Decision mode) |

Fun modes = quick presets in mode switcher; same engine as Decision mode with pre-filled labels.

### Results

| Feature | Description | Status | Ship |
|---------|-------------|--------|------|
| **Copy result** | One-click copy: `Heads wins!` or custom label | Missing | v1 |
| **Share result** | Share text + link to result page | Missing | v1 |
| **Download result image** | PNG result card | Missing | v1 |
| **Reset history** | Clear session flip log + stats | Missing | v1 |

### ⭐ Features to prioritize *(build order)*

| Priority | Feature | Why |
|----------|---------|-----|
| 1 | **Multiple coin flip (1–100)** | Differentiator vs thin competitors |
| 2 | **Best of X mode** | Bo3/Bo5 v1, Bo7 v2 — game-like retention |
| 3 | **Custom coin sides** | Text + images — powers Share Result virality |
| 4 | **Flip history** | Table stakes, classroom trust |
| 5 | **Statistics (Heads %, Tails %)** | Fairness transparency + engagement |
| 6 | **Auto-flip** | Demos, streak hunting, lazy fun |
| 7 | **Streak tracker** | Pairs with stats dashboard |
| 8 | **Shareable result link** | Viral loop — `/flip-a-coin/r/abc123` |

---

## Play modes architecture *(core design)*

**Simple Mode** is the default — flip → **Heads** or **Tails**. One click. No setup.  
Other modes are optional via a mode switcher (like `use-picker-wheel-games` on the main picker).

```
┌─────────────────────────────────────────┐
│  MODE SELECTOR (tabs or dropdown)      │
├─────────────────────────────────────────┤
│  Simple │ Tournament │ Decision │ Classroom │ Simulation │
└──────────────────────────────────────────────────────────┘
     ↓           ↓            ↓          ↓            ↓
 Heads/Tails  best-of     Coffee/Tea   batch+export  weighted demo
```

### Mode definitions

| Mode ID | Name | What it does | Ship in |
|---------|------|--------------|---------|
| `simple` | **Simple Mode** *(default)* | Flip → Heads or Tails. Session history. No setup. | **v1** |
| `tournament` | **Tournament Mode** | Best-of series — auto-track wins, declare series winner | **v1** (Bo3, Bo5) → v2 (Bo7) |
| `decision` | **Decision Mode** | User labels faces: `Coffee` vs `Tea`, `Go out` vs `Stay home` | v2 |
| `classroom` | **Classroom Mode** | Batch flips (10/50/100), live chart, export CSV | v2 *(after Share Result)* |
| `simulation` | **Weighted / Simulation Mode** | Biased coin for probability demos — **never default**, always disclosed | v2 |

### Global features *(work across all modes)*

| Feature | v1 | v2 | Notes |
|---------|----|----|-------|
| Animated coin flip | ✅ | | Core |
| Animation speed (slow/normal/fast) | ✅ | | Core |
| Sound toggle | ✅ | | Reuse settings store pattern |
| Confetti toggle | ✅ | | Fun polish — not essential for usefulness, but **in v1 per spec** |
| Fullscreen / presenter | ✅ | | Especially for classroom later |
| Flip history (session) | ✅ | | Last 10–20 flips |
| Reset history | ✅ | | Clear session log |
| Custom coin faces (text/emoji) | | ✅ | Batman/Superman, Coffee/Tea — works in any mode |
| Custom coin images (upload per side) | | ✅ | Pairs with coin design presets |
| Coin design presets | | ✅ | Classic, penny, gold, minimal |
| Probability dashboard | | ✅ | Total flips, H/T %, longest streak, current streak |
| Multiple coins (1–100) | | ✅ | Advanced batch flip |
| Auto-flip / flip until H or T | | ✅ | Advanced automation |
| Fun mode presets (Yes/No, Truth/Dare…) | | ✅ | Decision mode shortcuts |
| **Share Result** | ✅ | | Copy + PNG + result link — **v1, before Classroom** |
| Share full session URL | | ✅ | Labels + history encoded |
| FAQ + metadata | ✅ | | Server-rendered |
| Related tools block | ✅ | | Internal linking |
| SEO variant pages (same engine) | | ✅ | Heads or Tails, Yes or No Coin, etc. |

### Simple Mode detail *(v1 default)*

```
[ FLIP ]  →  animation  →  "Heads" or "Tails"
```

- Default view on page load
- Optional sound, confetti, history
- **Share Result** after every flip
- Switch to other modes only when needed

---

## Share Result & session sharing *(high priority — was missing)*

> **Ship in v1. Before Classroom Mode.** Organic growth loop.

```
Coffee  vs  Tea
    ↓ FLIP ↓
Coffee wins! ☕
[ Share Result ] [ Copy text ] [ Download card ]
```

Share examples: `Coffee wins! ☕`, `ChatGPT told me to let fate decide 😂 → Tea wins!`

| Share type | When |
|------------|------|
| Copy text | v1 — WhatsApp, Discord, X |
| Result image card (PNG) | v1 |
| Result link `/flip-a-coin/r/abc123` | v1 — landing page + "Flip your own" CTA |
| Full session URL | v2 |

**Viral loop:** friend opens link → flips own decision → shares again.

---

### Tournament Mode detail *(v1 — not just a toggle)*

Tournament is a **full game mode** — user leaves Simple Mode to enter it:

```
User picks: Best of 3 │ Best of 5 │ Best of 7 (v2)
        ↓
Flip 1 → Heads (Player A +1)
Flip 2 → Tails (Player B +1)
Flip 3 → Heads (Player A wins series 2–1)
        ↓
Series reset │ Play again │ Switch to Simple Mode
```

**Tournament UI must show:**
- Series score (e.g. `Heads 2 – 1 Tails`)
- Flips remaining to win
- Series history log
- Winner announcement + optional confetti

| Tournament option | v1 | v2 |
|-------------------|----|----|
| Best of 3 | ✅ | |
| Best of 5 | ✅ | |
| Best of 7 | | ✅ |
| Custom series (BoN) | | ✅ |
| Auto-track wins | ✅ | |
| Series history | ✅ | |

### Decision Mode detail *(v2 — main differentiator)*

Competitors stop at `Click → Heads`. This mode ties into the **decision hub** brand:

```
Face A label: [ Go out        ]
Face B label: [ Stay home     ]
        ↓ FLIP
Result: "Stay home" (not just "Tails")
```

Examples: Coffee/Tea, Option A/Option B, Batman/Superman.  
Works with **Custom coin faces** — labels appear on the coin and in results.

### Classroom Mode detail *(v2 — after Share Result ships)*

For teachers demonstrating probability — **lower priority than sharing**:

- Run 10 / 50 / 100 flips in one action
- Live updating bar chart
- Export results CSV
- Fullscreen, distraction-free chrome
- Feeds **Probability dashboard** data

### Weighted / Simulation Mode detail *(v2 — careful)*

Useful for teaching, **must not look like a fair coin**:

- [ ] Separate mode — never the default
- [ ] Show odds on screen: `60% Heads / 40% Tails`
- [ ] Banner: "Simulation mode — not a fair coin"
- [ ] Explain: demonstrations and probability lessons only

---

## MVP v1 — ship this first

**Modes in v1:** `simple` + `tournament` (Bo3, Bo5)  
**Must-have v1 feature:** **Share Result** (before Classroom Mode)

| Feature | v1? | Mode / scope |
|---------|-----|--------------|
| **Simple Mode** (Heads/Tails) | ✅ | Default — flip → result |
| Tournament mode (Bo3, Bo5) | ✅ | Full series tracking UI |
| **Share Result** (copy + card + link) | ✅ | **All modes — viral loop** |
| Copy result / Download result image | ✅ | Results actions |
| Reset history | ✅ | Global |
| Animated coin flip + animation speed | ✅ | Core |
| Sound toggle | ✅ | Global |
| Confetti toggle | ✅ | Global |
| Flip history | ✅ | Global |
| Fullscreen | ✅ | Global |
| Dark/Light theme | ✅ | Reuse platform themes |
| FAQ + metadata | ✅ | Page |
| Related tools links | ✅ | Page |
| Best of 7 | ⏸️ v2 | Tournament extension |
| Multiple coins (1–100) | ⏸️ v2 | Advanced |
| Auto-flip / flip until H or T | ⏸️ v2 | Advanced |
| Streak + H/T statistics | ⏸️ v2 | Probability dashboard |
| Decision mode + fun presets | ⏸️ v2 | Yes/No, Truth/Dare, custom labels |
| Custom coin design + image upload | ⏸️ v2 | Customization |
| SEO variant landing pages | ⏸️ v2 | Same engine, intent routes |
| Classroom mode | ⏸️ v2 | **After sharing ships** |
| Weighted simulation | ⏸️ v2 | |
| Share full session URL | ⏸️ v2 | |

### Assessment notes on v1 scope

| Feature | External assessment | Our v1 call |
|---------|---------------------|-------------|
| Confetti | Fun, doesn't increase usefulness | **Include** — matches platform polish |
| Best of 3 / 5 | Nice, probably not essential for launch | **Include as Tournament Mode** — low effort, completes game mode UX |

---

## MVP v2 — differentiation modes

**Build order within v2** (sharing first, classroom last):

| Order | Mode / feature | Purpose |
|-------|----------------|---------|
| 1 | **Multiple coin flip (1–100)** | Stand out vs one-coin-only competitors |
| 2 | **Decision Mode + fun presets** | Yes/No, Truth/Dare, Win/Lose, Red/Blue, custom |
| 3 | **Custom coin sides** | Text + image upload + design presets |
| 4 | **Statistics + streak tracker** | Heads %, Tails %, longest/current streak |
| 5 | **Auto-flip modes** | Auto-flip, flip until Heads/Tails |
| 6 | **Tournament Bo7** | Extend tournament mode |
| 7 | **SEO variant pages** | Heads or Tails, Yes or No Coin, Decision Coin, etc. |
| 8 | **Share full session URL** | Encode labels + history |
| 9 | **Weighted simulation** | Teaching only, disclosure UI |
| 10 | **Classroom Mode** | Batch flips + CSV — **last** (niche vs viral) |

### Probability dashboard *(cross-mode, v2)*

Visible in Simple and Classroom modes; powers education use case:

```
100 flips
Heads: 49 (49%)
Tails: 51 (51%)
Longest streak: 7 Tails
Current streak: Heads ×4
```

---

## Alignment with existing platform patterns

Reuse concepts already in the codebase:

| Coin Flip concept | Existing pattern in app |
|-------------------|-------------------------|
| Mode switcher | `use-picker-wheel-games` (`normal`, `bingo`, `memory`…) |
| Tournament series | `useGameSession` — session score tracking |
| Decision labels | Yes/No wheel + Food wheel decision theme |
| Confetti + sound | `settings-store` confettiSound, all wheel pages |
| Achievements (optional v2) | `picker-wheel-achievements` — "won 10 tournaments" |
| Classroom export | CSV pattern from roadmap (main picker) |

Consider: `hooks/use-coin-flip-modes.ts` mirroring `use-picker-wheel-games.ts`.

---

## MVP v2 section (reference) — superseded by Play Modes above

*The sections below are kept for detail; see Play Modes architecture for canonical structure.*

### Decision Mode *(v2)*

Let users **label outcomes** instead of generic Heads/Tails:

```
Heads = Go out          Tails = Stay home
Heads = Coffee          Tails = Tea
Heads = Option A        Tails = Option B
```

Ties directly into **decision-making** theme — aligns with Yes/No wheel and Food wheel.

### Probability dashboard *(v2)*

After multiple flips, show streak and distribution stats (see Play Modes section).

### Classroom mode *(v2)*

- Run batch flips (10 / 50 / 100)
- Live chart updating
- Export results CSV
- Fullscreen, minimal chrome

### Custom coins *(v2)*

Label both faces with text (and optionally emoji/image): Batman vs Superman, Coffee vs Tea.

### Weighted coin *(v2)*

See simulation mode rules in Play Modes architecture.

---

## Internal linking *(where Coin Flip earns its keep)*

Coin Flip is most valuable as a **node in the decision hub**, not as a standalone traffic magnet.

### Link out from Coin Flip →

- [Yes/No Picker](/yes-no-picker-wheel)
- [Random Name Picker](/)
- [Number Picker](/number-picker-wheel)
- [Dice Roll](./dice-roll.md) *(when built)*
- [Team Picker](/team-picker)
- [Food Wheel](./food-wheel.md) *(when built)*

### Link back to Coin Flip from →

- Yes/No wheel FAQ ("binary decisions")
- Number picker ("pick 1 or 2")
- Main picker hub / tools index
- Game wheels (who goes first?)

**Bidirectional links** matter more than perfect coin physics.

---

## SEO content (not generic AI fluff)

Cover **informational intent** with real FAQ sections:

1. What is a coin flip and when do people use it?
2. Are online coin flips truly random? (explain `crypto.getRandomValues` if used)
3. Heads or tails — origins and common uses
4. Coin toss rules in sports (cricket, football kickoff, etc.)
5. Common games using coin flips
6. Coin flip vs dice vs yes/no wheel — when to use each
7. Is this tool fair? (transparency section)

Use `FAQPage` JSON-LD schema.

---

## Platform priority ranking (traffic growth focus)

Where Coin Flip sits vs everything else:

| Priority | Feature | Stars |
|----------|---------|-------|
| 1 | Public user-generated wheels | ⭐⭐⭐⭐⭐ |
| 1 | Shareable wheel pages | ⭐⭐⭐⭐⭐ |
| 1 | Embed wheels | ⭐⭐⭐⭐⭐ |
| 1 | AI Wheel Builder | ⭐⭐⭐⭐⭐ |
| 1 | Public templates | ⭐⭐⭐⭐⭐ |
| 2 | CSV import/export | ⭐⭐⭐⭐☆ |
| 2 | Weighted entries (main picker) | ⭐⭐⭐⭐☆ |
| 2 | Multi-winner picker | ⭐⭐⭐⭐☆ |
| 2 | **Coin Flip — Share Result** | ⭐⭐⭐⭐☆ *(v1 viral loop)* |
| 3 | Coin Flip tool (full) | ⭐⭐⭐⭐☆ |
| 3 | Dice Roller | ⭐⭐⭐⭐☆ |
| 1 | Rich resource pages (Pokémon Type, Roblox, Food) | ⭐⭐⭐⭐⭐ |

**Coin Flip = tier 3 for traffic.** Build after distribution infrastructure (share/embed/UGC) or in parallel as a **1–2 day side task** once decision hub linking exists.

---

## Build phases

### Phase 0 — Prerequisite (do first)
- [ ] Wire header menu item to real route
- [ ] Related tools component (reusable across utility pages)

### Phase 1 — MVP v1 (~2–3 days)
- [ ] `/flip-a-coin` page + mode switcher UI
- [ ] **Core:** flip coin, Heads/Tails result, animation speed, sound, confetti
- [ ] **Flip history** + **Reset history**
- [ ] **Simple Mode** — default flip flow
- [ ] **Tournament mode** — Best of 3, Best of 5, series score UI, winner state, series log
- [ ] **Results:** Copy result, Share result, Download result image, shareable result link
- [ ] Fullscreen + Dark/Light theme (platform themes)
- [ ] FAQ + metadata
- [ ] Related tools links
- [ ] Consider `hooks/use-coin-flip-modes.ts`

### Phase 2 — Differentiation (~2–3 days)
- [ ] **Multiple coin flip** — 1–100 coins at once
- [ ] **Best of 7** + custom BoN series
- [ ] **Decision mode + fun presets** — Yes/No, Truth/Dare, Win/Lose, Red/Blue, custom two-option
- [ ] **Customization:** coin design presets, custom text, upload images per side
- [ ] **Statistics:** Heads %, Tails %, streak counter (current + longest)
- [ ] **Auto-flip** — continuous, flip until Heads, flip until Tails
- [ ] Share full session URL (labels + history)
- [ ] **SEO variant pages** — `/heads-or-tails`, `/yes-or-no-coin`, `/decision-coin`, `/toss-a-coin`, `/flip-a-penny`, `/two-choice-picker`, `/random-yes-no-generator`

### Phase 3 — Niche & polish (~1–2 days)
- [ ] **Weighted simulation mode** (disclosure UI)
- [ ] **Classroom mode** — batch flips, live chart, CSV export *(after sharing proven)*
- [ ] Optional achievements hook ("Tournament champion")

---

## Overall assessment

| Question | Answer |
|----------|--------|
| Is the spec good? | ✅ Yes — well thought out |
| Should we build it? | ✅ Yes — eventually |
| Is it high priority for traffic? | ❌ No — not if speed is the goal |
| Why build it at all? | Platform completeness, decision hub, internal links |
| Where do big SEO gains come from? | Scalable rich landing pages + UGC wheels |
| Best Coin Flip angle? | **Simple default + Share Result virality** — Decision mode makes shares funny/useful |
| Share Result in v1? | ✅ Yes — before Classroom Mode |

---

## Success metrics (realistic)

| Metric | Target |
|--------|--------|
| Indexed for `flip a coin` | Yes — long tail |
| Top 3 for `flip a coin` | Unlikely without domain authority |
| Share Result clicks / copies | Track — primary growth lever for this tool |
| Shared result link visits | Track viral loop (recipient → flip own) |
| Internal link CTR to Yes/No / Name picker | Track — hub value |
| Avg. session duration | >45s if probability dashboard ships |
| Return visits | Low unless classroom/decision mode used |

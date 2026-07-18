# Roblox Game Wheel — Future Tool *(planned)*

**Status:** Not built — new vertical tool  
**Suggested routes:** `/roblox/game-wheel`, `/roblox/random-game`, `/wheels/video-games/roblox`  
**Competitor UGC:** ~348 Roblox-related wheels in sitemap (thin pages)  
**Competitor model:** Wheel + short description  
**Our model:** Game discovery assistant — help users **choose**, not just spin

---

## Vision

When someone searches `roblox game wheel` or `what roblox game should i play`, they want a recommendation with context — not a random title on a colored slice.

> **Page goal:** Spin → understand → decide → play (with link out to Roblox).

---

## Competitor has (baseline)

| Block | They have |
|-------|-----------|
| Wheel | ✅ |
| Game names as slices | ✅ |
| Description | ✅ 1–2 paragraphs |

Missing: anything that helps a real decision.

---

## We will build (target experience)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | **Wheel** | Spin from filtered game pool | P0 |
| 2 | **Genre filters** | Horror, Obby, Simulator, RP, Tycoon, FPS, Puzzle, etc. | P0 |
| 3 | **Player count** | Live or cached active players (ranges: 1k–10k, 10k–100k, 100k+) | P1 |
| 4 | **Difficulty** | Easy / Medium / Hard / Extreme tags | P1 |
| 5 | **Average playtime** | Short session (5–15m) vs long grind (1h+) | P2 |
| 6 | **Screenshots** | 2–4 images per game card | P1 |
| 7 | **Official game links** | Deep link to Roblox experience page | P0 |
| 8 | **Pros** | Bullet list (e.g. “Great with friends”, “Frequent updates”) | P1 |
| 9 | **Cons** | Honest downsides (pay-to-win, grind, toxicity) | P1 |
| 10 | **Similar games** | 3–5 alternatives same genre | P1 |
| 11 | **Recently updated** | Last update badge / date | P2 |
| 12 | **Trending score** | Relative popularity rank or trend arrow | P2 |
| 13 | **FAQ** | Server-rendered SEO block | P0 |
| 14 | **Related tools** | Fortnite, Pokémon, Minecraft wheels | P0 |

---

## Page layout (wireframe)

```
┌─────────────────────────────────────────────────┐
│ H1: Roblox Game Wheel — What Should I Play?     │
├──────────────────────┬──────────────────────────┤
│  FILTERS             │  GAME WHEEL              │
│  Genre ▼             │  (spin)                  │
│  Difficulty ▼        │                          │
│  Player count ▼      │                          │
├──────────────────────┴──────────────────────────┤
│  POST-SPIN GAME CARD                            │
│  [Screenshot] Name | Genre | Players | Diff     │
│  Playtime | Trending ↑ | Updated 3 days ago     │
│  Pros • Cons                                    │
│  [Play on Roblox →]  [Similar games carousel]   │
├─────────────────────────────────────────────────┤
│  TRENDING GAMES THIS WEEK (list)                │
├─────────────────────────────────────────────────┤
│  FAQ                                            │
├─────────────────────────────────────────────────┤
│  RELATED TOOLS                                  │
└─────────────────────────────────────────────────┘
```

---

## Data requirements (new)

Create `data/roblox-games.ts`:

```ts
interface RobloxGame {
  id: string
  name: string
  slug: string
  genre: RobloxGenre[]
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  playerCountRange: '1k-10k' | '10k-100k' | '100k-1m' | '1m+'
  avgPlaytime: 'short' | 'medium' | 'long'
  robloxUrl: string          // official experience link
  placeId?: string
  screenshots: string[]
  pros: string[]
  cons: string[]
  similarGameIds: string[]
  lastUpdated: string        // ISO date
  trendingScore: number      // 0–100 internal rank
  description: string
  emoji?: string             // wheel segment fallback
}
```

### Data sources (research)

- Roblox discovery / charts (manual curation initially)
- Popular games from competitor sitemap keywords:
  - `adopt-me`, `blox-fruit`, `royale-high`, `tower-defense`, `steal-a-brainrot`, etc.
- Phase 2: optional API for live player counts (if ToS allows)

---

## Genre taxonomy (starter list)

| Genre | Example games |
|-------|---------------|
| Obby / Parkour | Tower of Hell, Easy Obby |
| Simulator | Pet sim, mining sim |
| Horror | Doors, Rainbow Friends |
| Roleplay | Brookhaven, Royale High |
| Tycoon | Restaurant tycoon |
| FPS / Combat | Arsenal, Rivals |
| Puzzle | Brainrot-style, escape rooms |
| Social | Adopt Me, hangout maps |

---

## Reuse from existing codebase

| Pattern | Source tool |
|---------|-------------|
| Rarity/filter UI | Fortnite wheel |
| Preview + comparison cards | Pokémon / Fortnite modals |
| AI “recommend a game” tab | NBA AI tab pattern |
| Favorites | Fortnite favorites |
| Achievements / themes | Platform layer |

---

## SEO targets

| Keyword cluster | Example queries |
|-----------------|-----------------|
| Random game | `roblox game wheel`, `random roblox game` |
| What to play | `what roblox game should i play` |
| Genre | `roblox horror game wheel`, `roblox obby wheel` |
| Trending | `best roblox games 2026` |

### Metadata template

- **Title:** `Roblox Game Wheel — Random Game Picker with Genre, Difficulty & Player Count`
- **Description:** Can't decide what to play? Spin the Roblox game wheel, filter by genre and difficulty, see pros, cons, screenshots, and play instantly.

---

## Sub-pages to spawn

```
/roblox/game-wheel
/roblox/horror-games-wheel
/roblox/obby-wheel
/roblox/simulator-wheel
/roblox/roleplay-wheel
/roblox/trending-games
/wheels/video-games/roblox
```

---

## Build phases

### Phase 1 — Curated MVP (50 games)
- [ ] `data/roblox-games.ts` with top 50 experiences
- [ ] Wheel + genre filter
- [ ] Post-spin card: description, pros, cons, Roblox link
- [ ] FAQ + metadata + related tools

### Phase 2 — Discovery depth
- [ ] Screenshots per game
- [ ] Similar games carousel
- [ ] Difficulty + player count filters
- [ ] Trending section (manual weekly update)

### Phase 3 — Scale & freshness
- [ ] 200+ games database
- [ ] Genre sub-pages (SEO)
- [ ] “Recently updated” badges
- [ ] AI: “I like X, what should I play?”
- [ ] Share filtered wheel URL

---

## Legal / UX notes

- Use **official Roblox links** (outbound to roblox.com)
- Do not imply endorsement by Roblox Corp.
- Screenshots: fair use / official press assets / user-generated with permission
- Label player counts as “approximate” if not live API

---

## Success metrics

- Rank for `roblox game wheel` and genre long-tails
- Click-through rate to Roblox links
- Lower bounce than competitor thin wheels (target < 55%)

---

## Competitive advantage vs SpinTheWheel.app

They have **volume** (~348 Roblox wheels). We win with **one excellent hub** that actually helps users choose a game.

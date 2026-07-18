# Pokémon Type Wheel — Future Tool *(planned)*

**Status:** Not built — new dedicated tool  
**Suggested routes:** `/pokemon/type-wheel`, `/pokemon/fire-type-wheel`, `/wheels/video-games/pokemon-type`  
**Parent / related:** [pokemon-wheel.md](./pokemon-wheel.md) (general picker — exists today)  
**Competitor model:** Thin page = Wheel + Description  
**Our model:** Full decision resource page

---

## Vision

Google should see a **genuine Pokémon resource**, not just another spinner. The wheel is the hook; the page answers everything someone searching `pokemon type wheel` actually wants to know.

> **Page goal:** Help users understand types, pick randomly, build teams, and learn — in one place.

---

## Competitor has (baseline)

| Block | They have |
|-------|-----------|
| Wheel | ✅ |
| Description | ✅ Short text |

That's enough to index. **Not enough to rank #1.**

---

## We will build (target experience)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | **Wheel** | Spin by type, generation, or curated list | P0 |
| 2 | **Type chart** | Interactive 18-type effectiveness matrix (super effective / not very effective / immune) | P0 |
| 3 | **Strengths** | Per-type offensive strengths (what this type hits hard) | P0 |
| 4 | **Weaknesses** | Per-type defensive weaknesses and resistances | P0 |
| 5 | **Best Pokémon** | Curated top picks per type (competitive + fan favorites) | P1 |
| 6 | **Worst matchups** | Type pairs / Pokémon that counter the spun result | P1 |
| 7 | **Generation filters** | Gen 1–9 subsets on wheel + chart | P0 |
| 8 | **Challenge ideas** | Nuzlocke, mono-type run, random team run, type-only gym order | P1 |
| 9 | **Random team builder** | Pick random team of 6 with type coverage analysis | P0 |
| 10 | **Trivia** | Type fact cards, quiz mode (“Which type beats Water?”) | P2 |
| 11 | **FAQ** | 15–25 SEO questions (server-rendered) | P0 |
| 12 | **Related tools** | Link to Pokémon picker, LoL, Fortnite, Yes/No | P0 |

---

## Page layout (wireframe)

```
┌─────────────────────────────────────────────────┐
│ H1: Pokémon Type Wheel — Random Type Picker     │
│ Short intro (SEO paragraph)                     │
├──────────────────────┬──────────────────────────┤
│  TYPE WHEEL (spin)   │  TYPE CHART (interactive)  │
│  Gen filter          │  Click type → strengths    │
│  Type filter         │  Weaknesses panel          │
├──────────────────────┴──────────────────────────┤
│  POST-SPIN RESULT CARD                          │
│  → Best Pokémon of this type                    │
│  → Worst matchups                               │
│  → AI explanation (optional)                    │
├─────────────────────────────────────────────────┤
│  RANDOM TEAM BUILDER (6 slots + coverage score)   │
├─────────────────────────────────────────────────┤
│  CHALLENGE IDEAS (cards)                        │
├─────────────────────────────────────────────────┤
│  TRIVIA / QUIZ                                  │
├─────────────────────────────────────────────────┤
│  FAQ (accordion, JSON-LD)                         │
├─────────────────────────────────────────────────┤
│  RELATED TOOLS                                    │
└─────────────────────────────────────────────────┘
```

---

## Data requirements (new)

Extend or fork from `data/pokemon-data.ts`:

```ts
// New: data/pokemon-type-effectiveness.ts
type TypeName = 'Fire' | 'Water' | ... // 18 types

interface TypeEffectiveness {
  superEffectiveAgainst: TypeName[]
  notVeryEffectiveAgainst: TypeName[]
  noEffectAgainst: TypeName[]
  weakTo: TypeName[]
  resists: TypeName[]
  immuneTo: TypeName[]
}

interface PokemonEnriched extends Pokemon {
  baseStats?: { hp, atk, def, spa, spd, spe }
  tier?: 'S' | 'A' | 'B' | 'C' | 'fun'
  bestMoves?: string[]
  evolutionChain?: string[]
}
```

---

## Reuse from existing codebase

| Existing asset | Reuse |
|----------------|-------|
| `/pokemon-wheel` | Wheel component, generation filter, preview modal |
| `constants/type-config.ts` | Type colors |
| AI tab patterns | Post-spin explanation, team suggestions |
| Comparison modal | Side-by-side type matchup view |
| Achievements / themes | Platform layer |

---

## SEO targets

| Keyword cluster | Example queries |
|-----------------|-----------------|
| Type wheel | `pokemon type wheel`, `random pokemon type` |
| Matchups | `pokemon type chart`, `pokemon weaknesses` |
| Team | `random pokemon team generator`, `pokemon type coverage` |
| Challenges | `mono type pokemon run`, `nuzlocke wheel` |

### Metadata template

- **Title:** `Pokémon Type Wheel — Chart, Matchups, Team Builder & Random Picker`
- **Description:** Spin the Pokémon type wheel, view the full type chart, strengths & weaknesses, build a random team of 6, and try challenge modes. Free interactive guide.

---

## Sub-pages to spawn (Layer 3)

One template → many indexable URLs:

```
/pokemon/type-wheel              (main)
/pokemon/fire-type-wheel
/pokemon/water-type-wheel
/pokemon/grass-type-wheel
... (one per type)
/pokemon/starter-type-wheel
/pokemon/dual-type-wheel
```

Each sub-page: wheel pre-filtered + type-specific FAQ + best Pokémon list.

---

## Build phases

### Phase 1 — MVP resource page
- [ ] Route + metadata + FAQ (static server component)
- [ ] Type effectiveness data file
- [ ] Interactive type chart component
- [ ] Wheel filtered by selected type
- [ ] Post-spin: strengths, weaknesses, best picks

### Phase 2 — Team & challenges
- [ ] Random team of 6 builder
- [ ] Type coverage score (offensive + defensive)
- [ ] Challenge ideas section
- [ ] Related tools block

### Phase 3 — Engagement & scale
- [ ] Trivia / quiz mode
- [ ] Per-type sub-pages (18 routes)
- [ ] Share team / share spin URL
- [ ] AI “explain this matchup” after spin

---

## Success metrics

- Indexed for `pokemon type wheel` within 4–8 weeks of launch
- Avg. time on page > 2 min (vs competitor ~30 sec)
- Internal links from `/pokemon-wheel` hub

---

## Relationship to existing Pokémon Picker

| Tool | Purpose |
|------|---------|
| `/pokemon-wheel` | Pick any Pokémon (general) |
| `/pokemon/type-wheel` | **Type-focused resource** — chart, matchups, team builder |

Do **not** merge into one page. Separate URLs = separate search intents.

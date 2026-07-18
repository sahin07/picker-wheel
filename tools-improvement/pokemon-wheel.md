# Pokémon Picker Wheel — Future Upgrades

**Route:** `/pokemon-wheel`  
**Competitor UGC:** ~321 Pokémon-related wheels in sitemap

## What exists today

- Full Pokémon dataset (gen 1–8) with types, region, legendary/starter flags
- Generation filter (all + gen1–gen8)
- Wheel spin, elimination mode, manual pick
- Preview modal, comparison (up to 8), favorites
- Custom Pokémon support
- AI tab: chat, analysis, generator
- Stats tab: type/gen/region distribution
- Platform features: achievements, themes, analytics, game modes

## Gaps vs “Pokémon Type Wheel” strategy

| Feature | Status | Priority |
|---------|--------|----------|
| Type effectiveness chart | Missing | High |
| Strengths / weaknesses per type | Missing | High |
| Type filter on wheel | Missing | High |
| Best Pokémon lists | Partial (popularity flags only) | Medium |
| Worst matchups | Missing | Medium |
| Random team builder (6 Pokémon) | Partial (random add + AI) | High |
| Trivia section | Missing | Medium |
| FAQ | Missing | High |
| Related tools on page | Missing | Medium |
| Intent-specific sub-pages | Missing | High |
| SEO metadata | Missing | High |
| Official artwork / sprites | Placeholder images only | Low |

## Data model gaps

Current `Pokemon` type lacks:

- Base stats (HP, Atk, Def, SpA, SpD, Spe)
- Type weaknesses / resistances / immunities
- Evolution chain
- Recommended moves / roles (sweeper, tank, etc.)
- Pokedex number

## Biggest missing feature: post-spin “result pages” (spin → content → tools flywheel)

Right now everything revolves around **Spin → “You got Pikachu”**. But each Pokémon result has valuable data that can become an indexable content page and a navigation hub.

### What to show after spinning (example)

Instead of only:

- You got Pikachu

Show a **result detail panel/page**:

- **Pikachu**
- **Type**: Electric
- **Generation**: 1
- **Height / Weight**
- **Weaknesses / resistances / immunities**
- **Evolution chain**
- **Compare** (Pikachu vs Eevee)
- **Next actions**: Open Pokémon Wheel, Random Pokémon Generator, Pokémon Quiz, Pokémon Team Generator

### SEO opportunity (one dataset → many tools/pages)

This creates a crawlable flow like:

```
Pokémon (hub)
  ↓
Pokémon Wheel
  ↓
Pikachu (result detail page)
  ↓
Compare Pikachu vs Eevee
  ↓
Pokémon Generator
  ↓
Pokémon Quiz
  ↓
Pokémon Team Generator
```

**One dataset. Six tools.** Google loves this structure because it creates depth, internal linking, and intent-specific pages beyond “wheel + description”.

### Recommended new routes for this cluster

```
/pokemon                                  (hub landing page)
/pokemon/wheel                            (alias/structured route for /pokemon-wheel)
/pokemon/pikachu                          (Pokémon result detail pages)
/pokemon/compare/pikachu-vs-eevee         (compare pages)
/pokemon/random                           (generator)
/pokemon/quiz                             (quiz)
/pokemon/team-generator                   (team builder)
```

### Build notes

- **Data needed**: height/weight, evolutions, type effectiveness, and optional base stats.
- **Rendering**: ensure result pages are server-rendered with `metadata` (title/description/OG) so they index well.
- **UX**: treat “result page” as a continuation of the spin (button: “Open details” or auto-open detail drawer with “Share result”).

## Related future tool

> **Dedicated spec:** [pokemon-type-wheel.md](./pokemon-type-wheel.md) — full resource page (type chart, matchups, team builder, trivia, FAQ). Build as a **separate tool**, not a tab on this page.

## Recommended future routes

```
/pokemon-wheel                    (current — general picker)
/pokemon/type-wheel               → see pokemon-type-wheel.md
/pokemon/fire-type-wheel
/pokemon/water-type-wheel
/pokemon/starter-wheel
/pokemon/legendary-wheel
/pokemon/random-team-builder
/pokemon/generation-1-wheel
/wheels/video-games/pokemon       (hub)
```

## Upgrade checklist

### Phase 1 — Type depth
- [ ] Add `type-effectiveness.ts` data (18 types chart)
- [ ] Type filter UI (show only Fire, Water, etc.)
- [ ] Post-spin card: strengths, weaknesses, super-effective against
- [ ] Visible type chart on page (not hidden in modal)

### Phase 2 — Team builder
- [ ] Dedicated “Random Team of 6” mode
- [ ] Type coverage analysis (AI or rule-based)
- [ ] Balance score (offense/defense coverage)

### Phase 3 — SEO resource page
- [ ] Server-rendered FAQ (20+ questions)
- [ ] Trivia block
- [ ] Challenge ideas (nuzlocke, mono-type run, etc.)
- [ ] Related tools: LoL, Fortnite, NBA wheels
- [ ] Per-route metadata

### Phase 4 — Sub-pages at scale
- [ ] Template for type-specific wheels
- [ ] Generation-specific landing pages
- [ ] Starter / legendary curated wheels

## Competitor pages to outrank

From sitemap examples:
- `all-starter-pokemon`
- `kanto-pokmon`
- `pokmon-unite-spin-and-play`
- `every-genshin-character` (adjacent intent)

## Success metrics

- Rank for `pokemon wheel`, `pokemon type wheel`, `random pokemon generator`
- Lower bounce rate than competitor thin pages via type chart + FAQ

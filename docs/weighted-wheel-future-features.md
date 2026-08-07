# Weighted Wheel — Future Features Plan

> Roadmap of probability / weighting UX improvements for the weighted wheel tool family.
>
> **Scope:** Build once in the shared weighted-wheel app → ships on **all** weighted spoke pages (not just one).

## Applies to which pages?

Yes — these features can (and should) apply across the whole weighted-wheel family, not a single URL.

They all share the same app component (`components/weighted-wheel/weighted-wheel-app.tsx`), so implementing a feature there automatically covers:

| Spoke | Path |
| --- | --- |
| Weighted Wheel Spinner | `/weighted-wheel-spinner` |
| Rigged Wheel Spinner | `/rigged-wheel-spinner` |
| Probability Wheel | `/probability-wheel` |
| Weighted Random Picker | `/weighted-random-picker` |
| Odds Wheel | `/odds-wheel` (or equivalent spoke) |
| Chance Wheel | `/chance-wheel` |
| Percentage Wheel | `/percentage-wheel` |
| Prize Odds / Loot / Event | other spokes in `lib/weighted-wheel-spokes.ts` |

**Not automatic for every tool on the site** (e.g. Yes/No, Pokémon, Fortnite, letter wheels). Those use equal-odds pickers. Weight features only belong where probability control is the product.

**Recommended approach:** implement in the shared weighted components + libs; optionally emphasize certain features per spoke via SEO copy (e.g. Simulation Mode on Probability Wheel, Hidden Rig Mode on Rigged Wheel).

---

## Core Features

### 1. Weight Slider ⭐⭐⭐⭐⭐

Each item has a weight control (slider + numeric value).

```
Pizza      50
Burger     25
Pasta      10
Salad      5
```

### 2. Percentage Display

Instead of showing raw weight only, show the normalized probability:

```
Pizza
55.3%

Burger
27.6%

Pasta
11.0%

Salad
6.1%
```

Huge UX improvement.

### 3. Odds Preview

Display before spinning:

```
Highest chance
🥇 Pizza
55%

Lowest chance
🥗 Salad
6%
```

### 4. Probability Chart

Simple horizontal bars:

```
Pizza  █████████████
Burger ███████
Pasta  ███
Salad  █
```

### 5. Lock Probability

Example:

```
Pizza always 40%
Everything else shares remaining 60%
```

### 6. Hidden Rig Mode

- Creator sees weights.
- Audience only sees the wheel.

Perfect for parties and streams.

### 7. Fair Mode Toggle

One click → equal probability.

Turns every weight into `1`.

### 8. Import CSV

```csv
Name,Weight
Alex,5
John,2
Emma,15
```

### 9. Random Weight Generator

Automatically assign random probabilities.

Great for games.

### 10. Exact Probability Input

Instead of only:

```
Weight
5
3
2
```

Allow:

```
50%
30%
20%
```

Automatically convert internally to weights.

### 11. Live Probability Update

As the user edits, percentages recalculate instantly:

```
Pizza
52.4%
↓
47.2%
↓
61.8%
```

### 12. Spin Statistics

After many spins:

```
100 Spins

Pizza
53 wins

Burger
28 wins

Pasta
13 wins

Salad
6 wins
```

### 13. Simulation Mode ⭐⭐⭐⭐⭐

Run virtual spins instantly:

- 100
- 500
- 1000
- 10000

Compare **Expected** vs **Actual**.

Excellent for demonstrating that weighting behaves as intended.

### 14. Probability Explanation

Explain that weight isn’t the same as percentage.

Example:

```
Apple   10
Orange  20
Banana  70
↓
10%
20%
70%
```

Very useful for beginners.

### 15. Wheel Difficulty Presets

- Fair
- Slightly Rigged
- Moderately Rigged
- Highly Rigged
- Almost Guaranteed

---

## Suggested build order

| Priority | Feature | Why first |
| --- | --- | --- |
| P0 | Percentage display + live updates (#2, #11) | Core clarity; some of this may already exist |
| P0 | Fair mode toggle (#7) | Equalize already partially exists — polish/expose |
| P1 | Weight slider (#1) | Better input UX than numbers alone |
| P1 | Odds preview + chart (#3, #4) | Visual confidence before spin |
| P1 | Exact % input (#10) | Matches Percentage Wheel intent |
| P2 | Lock probability (#5) | Power-user control |
| P2 | Simulation mode + spin stats (#13, #12) | Education / trust demos |
| P2 | Probability explanation (#14) | Onboarding |
| P3 | CSV import (#8) | Bulk setup |
| P3 | Random weight generator (#9) | Games / novelty |
| P3 | Difficulty presets (#15) | Quick “rigged feel” setups |
| P3 | Hidden Rig Mode (#6) | Streams/parties; needs careful UX + ethics copy |

---

## Implementation notes

1. **One codebase:** prefer shared logic in `lib/` + UI in `components/weighted-wheel/`.
2. **Spoke-specific emphasis:** keep SEO/marketing different per path; keep the engine shared.
3. **Hidden Rig Mode:** document clearly that creator controls are intentional for entertainment/demos, not for deceptive public raffles.
4. **Lock + exact %:** need consistent normalization rules when locked items + unlocked items coexist.
5. **Simulation Mode:** run off-main-thread or in batches if 10k+ spins to keep UI responsive.

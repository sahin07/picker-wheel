# Food Wheel — Future Tool *(planned)*

**Status:** Not built — new vertical tool  
**Suggested routes:** `/food-wheel`, `/food/what-to-eat`, `/food/random-meal`, `/wheels/food-and-drink`  
**Competitor UGC:** ~1,132 food/drink wheels (mostly thin: Pizza, Burger, Sushi slices)  
**Competitor model:** Wheel with food names only  
**Our model:** Meal decision assistant — wheel is **one part** of a richer experience

---

## Vision

“What should I eat?” is a huge search intent. Competitors answer with a spinning pizza slice. We answer with cuisine context, dietary fit, effort, cost, and what to do next (cook or order).

> **Page goal:** Spin → learn about the meal → act (recipe or restaurant).

---

## Competitor has (baseline)

| Block | They have |
|-------|-----------|
| Wheel | ✅ Pizza, Burger, Sushi, etc. |
| Description | ✅ Minimal |

No nutrition, no dietary filters, no recipes, no local ideas.

---

## We will build (target experience)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | **Wheel** | Spin meals / cuisines / dishes | P0 |
| 2 | **Cuisine** | Italian, Mexican, Japanese, Indian, American, etc. | P0 |
| 3 | **Price** | $ / $$ / $$$ budget tiers | P1 |
| 4 | **Cooking time** | Under 15m, 30m, 1h, slow cook | P1 |
| 5 | **Calories** | Approx range per serving (light / medium / hearty) | P2 |
| 6 | **Vegetarian** | Veg / vegan / gluten-free filters | P0 |
| 7 | **Nearby restaurant ideas** | “Find [cuisine] near you” → Maps search link or API | P2 |
| 8 | **Recipe suggestions** | 1–3 recipe links or embedded steps for spun item | P1 |
| 9 | **Meal type filter** | Breakfast, lunch, dinner, snack, dessert | P0 |
| 10 | **FAQ** | Server-rendered SEO | P0 |
| 11 | **Related tools** | Yes/No (“should I order out?”), Color, Date night | P0 |
| 12 | **Challenge ideas** | “Try a new cuisine week”, “no repeat for 7 days” | P2 |

---

## Page layout (wireframe)

```
┌─────────────────────────────────────────────────┐
│ H1: Food Wheel — What Should I Eat Tonight?     │
├──────────────────────┬──────────────────────────┤
│  FILTERS             │  FOOD WHEEL              │
│  Meal: Lunch ▼       │  (spin)                  │
│  Cuisine: Any ▼      │                          │
│  Diet: Vegetarian □  │                          │
│  Budget: $$ ▼        │                          │
│  Cook time: <30m ▼   │                          │
├──────────────────────┴──────────────────────────┤
│  POST-SPIN MEAL CARD                            │
│  🍕 Margherita Pizza                            │
│  Cuisine: Italian | ~650 cal | 25 min | $$      │
│  ✅ Vegetarian option                           │
│  [View recipes] [Find restaurants near me]        │
├─────────────────────────────────────────────────┤
│  RECIPE SUGGESTIONS (3 cards)                   │
├─────────────────────────────────────────────────┤
│  “CAN'T DECIDE?” → Yes/No: Order out?           │
├─────────────────────────────────────────────────┤
│  CHALLENGE IDEAS                                │
├─────────────────────────────────────────────────┤
│  FAQ                                            │
├─────────────────────────────────────────────────┤
│  RELATED TOOLS                                  │
└─────────────────────────────────────────────────┘
```

---

## Data requirements (new)

Create `data/food-items.ts`:

```ts
interface FoodItem {
  id: string
  name: string
  slug: string
  cuisine: CuisineType
  mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert')[]
  priceTier: '$' | '$$' | '$$$'
  cookTimeMinutes: number | null   // null = restaurant-only
  caloriesEstimate: number | null  // per serving
  dietary: {
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
  }
  emoji: string
  description: string
  recipeUrls?: string[]
  recipeSummary?: string           // 2–3 step home version
  restaurantSearchQuery: string    // for Maps: "italian restaurant near me"
  tags: string[]                   // spicy, healthy, comfort, quick
}
```

### Starter dataset (50–100 items)

Cover high-search meals from competitor sitemap patterns:

- Pizza, Burger, Sushi, Tacos, Pasta, Ramen, Curry, Salad, Steak, etc.
- Fast food brands as optional slice (McDonald's, KFC — separate wheel?)
- “What fastfood to order” was a competitor URL — own that intent

---

## Filter combinations (SEO pages)

Each filter combo = indexable sub-page:

```
/food-wheel
/food/what-to-eat-tonight
/food/vegetarian-wheel
/food/healthy-lunch-wheel
/food/budget-meals-under-10
/food/quick-dinners-30-minutes
/food/dessert-wheel
/wheels/food-and-drink
```

---

## Reuse from existing codebase

| Pattern | Source |
|---------|--------|
| Filter UI | Fortnite rarity / NBA conference filters |
| AI meal suggestions | AI tab on main picker / country wheel |
| Yes/No integration | Link to `/yes-no-picker-wheel` for “order out?” |
| Achievements | “Tried 10 cuisines” challenge |
| Spin history | Avoid repeat meals this week |

---

## SEO targets

| Keyword cluster | Example queries |
|-----------------|-----------------|
| What to eat | `what should i eat`, `food wheel`, `random food generator` |
| Meal type | `what to eat for dinner`, `lunch wheel` |
| Diet | `vegetarian food wheel`, `healthy meal picker` |
| Fast food | `what fast food should i get` |

### Metadata template

- **Title:** `Food Wheel — Random Meal Picker with Cuisine, Calories & Recipes`
- **Description:** Spin the food wheel to decide what to eat. Filter by cuisine, budget, cook time, and diet. Get recipes and restaurant ideas instantly.

---

## Integrations (Phase 2+)

| Integration | Purpose |
|-------------|---------|
| Google Maps search link | “Nearby restaurant ideas” without API key |
| Recipe API / curated links | AllRecipes, BBC Good Food (outbound) |
| AI | “I have chicken and rice — what can I make?” |
| Location (optional) | Better restaurant suggestions |

---

## Build phases

### Phase 1 — MVP
- [ ] `data/food-items.ts` (~75 items)
- [ ] Wheel + cuisine + meal type + vegetarian filter
- [ ] Post-spin card with cuisine, cook time, price, calories
- [ ] FAQ + metadata
- [ ] Related tools (Yes/No, Color, Date)

### Phase 2 — Action layer
- [ ] Recipe suggestions (curated URLs + short summary)
- [ ] “Find restaurants near me” Maps link
- [ ] Budget + cook time filters
- [ ] Spin history / no-repeat-this-week

### Phase 3 — Hub & scale
- [ ] Cuisine sub-pages (Italian wheel, Mexican wheel, etc.)
- [ ] AI: pantry-ingredient mode
- [ ] Challenge ideas (7-day cuisine tour)
- [ ] Share wheel URL with filters

---

## Cross-link with competitor gap

SpinTheWheel.app official tool: **`what-to-do`** — overlaps with “what should I eat / do”. Our **Food Wheel** + future **What To Do Wheel** should cross-link.

---

## Success metrics

- Rank for `food wheel`, `what should i eat wheel`, `random food picker`
- Recipe / Maps click-through rate
- Return users (meal planning use case)

---

## Competitive advantage

Competitor wheels stop at **Pizza / Burger / Sushi**. We add the **decision layer** competitors skip: diet, time, money, and what to do after the spin.

# Word Picker Wheel — Pillar Spec *(massive tool cluster)*

**Status:** Phase 6 URL expansion — **226 spokes** (core + generated catalog); hub `/spin-word-picker-wheel`  
**Product name:** Word Picker Wheel  
**Canonical hub route:** `/spin-word-picker-wheel`  
**`toolType` (stable):** `word-picker-wheel` — never rename after ship  
**Intent:** Random **word** picker / word spinner for writing, games, classrooms, vocabulary, brainstorming, drawing, and creative challenges  

**Supersedes / relates to:** Older sketch [make-a-word-wheel.md](./make-a-word-wheel.md) (home-mode idea). **This doc is the source of truth.** Ship a **standalone pillar** with spokes; link to/from home `/`, not bury as home-only mode.

**Sibling tools:** Letter Picker (letters) · Home Custom Spin Wheel (any list / names) · Number · Color · future What Should I Draw? / What To Do?

---

## Vision

Google and users should see a **word decision platform**, not a thin spinner.

> **Pillar goal:** One shared word engine + database → many genuine use-case pages (writing, drawing, Pictionary, Charades, kids, ESL, question-intent) with **different word sets and UX**, not keyword-copy clones.

**Layers**

| Layer | What |
|-------|------|
| Hub | `/spin-word-picker-wheel` — full chrome, paste lists, templates, modes |
| Intent spokes | Writing / drawing / classroom / games / kids / speaking |
| Filter spokes | Part of speech, difficulty, length, letter, theme packs |
| Question-intent | What should I write/draw/act out? |
| Aliases | `/random-word-generator`, `/word-spinner`, etc. → hub or focused spoke |

---

## Layout structure (parity with Letter / Raffle / Fortnite)

```
Header (Games / Settings / FAQ / My Wheels)
────────────────────────────────────────────
H1 + short subtitle (+ favorite star)
Popular word setups (cards → spokes by category)
Mode / challenge chips (One word · 3 words · Story · Drawing · Elimination…)
────────────────────────────────────────────
┌────────────────────────────┬──────────────────┐
│ Left (~2/3)                │ Right sidebar    │
│ Results (top-left)         │ INPUTS           │
│ Wheel + Spin               │ Preview Shuffle  │
│ Mute / Fullscreen          │ Hide / Manage    │
│ Themes Analytics Social    │ Tabs:            │
│ Games Achievements         │  List | Text     │
│                            │  Style | Other   │
│ Manual | AI-Powered        │ Action Mode      │
│                            │ Word filters*    │
│ Post-spin: word card       │ (scroll = left   │
│ (definition optional)      │  height)         │
└────────────────────────────┴──────────────────┘
SEO: how-to, FAQ, related wheels by category
Footer
```

\*`Word filters` = category / difficulty / length / letter (Phase 2+)

### Common options (same as other tools)

| Area | Include |
|------|---------|
| Results button + modal / history | ✅ |
| Manage menu | Sort Z–A, Shuffle, Equalize, Search, Remove winner, Mystery wheel/result, Delete blanks, Remove duplicates, Clear all |
| Header Settings | Shared `spinBehavior` — synced with Action Mode / Manage Remove winner |
| List / Text / Style / Other tabs | ✅ |
| Manual / AI toggle | Word-focused prompts |
| Mute, Fullscreen, Themes, Analytics, Social, Games, Achievements | Left chrome |
| Elimination / no-repeat | Default on for classroom spokes; configurable on hub |
| Hide inputs / Show controls | ✅ |
| My Wheels persistence | Via wheel-manager |
| Confetti + sound | Via settings |
| Sidebar height = left column; tab body scrollable | ✅ |

---

## 1. Core tool (hub MVP)

| Feature | Notes | Phase |
|---------|-------|-------|
| Enter custom words | List tab | 1 |
| Paste list (one word per line) | Text tab | 1 |
| Random select + spin animation | Options-wheel engine | 1 |
| Re-spin | ✅ | 1 |
| Remove selected word (elimination) | Synced with Manage / Settings | 1 |
| Keep selected word (normal mode) | ✅ | 1 |
| No-repeat mode | Alias of elimination / lock winners | 1 |
| Spin history / Results | Modal + recent | 1 |
| Reset wheel | Clear history / restore list | 1 |
| Fullscreen | ✅ | 1 |
| Sound effects | ✅ | 1 |
| Confetti | ✅ | 1 |
| Copy result | Result card / winner UI | 1 |
| Share result | Link / text; encode list later | 1–2 |

---

## 2. Word input methods

| Feature | Phase |
|---------|-------|
| Type manually | 1 |
| Paste word lists | 1 |
| Import TXT | 2 |
| Import CSV | 2 |
| Upload word list file | 2 |
| Generate words automatically (rules / packs) | 2 |
| AI word generation | 1 (prompts) → 2 (polish) |
| Duplicate detection / remove duplicates | 1 (Manage) |
| Shuffle / Sort A–Z | 1 (Manage) |
| Search / filter words | 1 (Manage search) → 2 (filters) |
| Edit / add / remove words | 1 |

---

## Category-based topic map *(every URL has a category)*

**Yes — each related tool / spoke is category-based.**  
**Rule:** Every spoke belongs to **exactly one primary category**. Same engine; different word pack + UX defaults.

| Category ID | Topic cluster | Section |
|-------------|---------------|---------|
| `pillar` | Core Word Picker | Hub |
| `aliases` | SEO aliases → pillar | Supporting tools |
| `categories` | General word packs | § Word Categories |
| `writing` | Creative writing | § Creative Writing |
| `classroom` | Teachers / ESL | § Classroom |
| `games` | Word games | § Word Games |
| `drawing` | Drawing / art | § Drawing |
| `speaking` | Speaking / acting | § Speaking |
| `word-type` | Grammar / type wheels | § Word Types |
| `difficulty` | Difficulty packs | § Difficulty |
| `letter` | Letter-based words | § Letters |
| `length` | Word length | § Length |
| `kids` | Kids / preschool | § Kids |
| `party` | Party / social | § Party |
| `special` | Seasonal / fandom / theme | § Special |
| `modes` | Challenge modes (hub UX) | § Modes |
| `questions` | What-* intent pages | § Questions |
| `related` | External related wheels | § Related Wheels |

---

### A. Pillar + aliases — `pillar` / `aliases`

| Topic | Suggested URL |
|-------|---------------|
| Word Picker Wheel | `/spin-word-picker-wheel` **(canonical)** |
| Random Word Generator | `/random-word-generator` |
| Random Word Picker | `/random-word-picker` |
| Random Word Wheel | `/random-word-wheel` |
| Random Word Spinner | `/random-word-spinner` |
| Word Spinner | `/word-spinner` |
| Word Generator Wheel | `/word-generator-wheel` |
| Random Word Selector | `/random-word-selector` |
| Random Word Generator Online | `/random-word-generator-online` |

---

### B. Word Categories — `categories`

| Topic | Suggested URL |
|-------|---------------|
| Common Words | `/common-words-wheel` |
| Easy Words | `/easy-words-wheel` |
| Random Words | `/random-words-wheel` |
| Funny Words | `/funny-words-wheel` |
| Weird Words | `/weird-words-wheel` |
| Difficult Words | `/difficult-words-wheel` |
| Long Words | `/long-words-wheel` |
| Short Words | `/short-words-wheel` |
| Positive Words | `/positive-words-wheel` |
| Negative Words | `/negative-words-wheel` |
| Action Words | `/action-words-wheel` |
| Descriptive Words | `/descriptive-words-wheel` |
| Opposite Words | `/opposite-words-wheel` |
| Rhyming Words | `/rhyming-words-wheel` |
| Compound Words | `/compound-words-wheel` |
| Sight Words | `/sight-words-wheel` |
| Vocabulary Words | `/vocabulary-words-wheel` |

Nouns / Verbs / Adjectives / Adverbs → primary category **`word-type`** (below).

---

### C. Creative Writing — `writing`

| Topic | Suggested URL |
|-------|---------------|
| Writing Prompt Word Wheel | `/writing-prompt-word-wheel` |
| Story Word Generator | `/story-word-generator` |
| Random Story Words | `/random-story-words-wheel` |
| Character Word Picker | `/character-word-picker` |
| Setting Word Picker | `/setting-word-picker` |
| Plot Word Generator | `/plot-word-generator` |
| Story Starter Wheel | `/story-starter-word-wheel` |
| Creative Writing Wheel | `/creative-writing-word-wheel` |
| Fiction Writing Word Wheel | `/fiction-writing-word-wheel` |
| Random Writing Challenge | `/random-writing-challenge-wheel` |
| Poetry Word Picker | `/poetry-word-picker` |
| Poetry Challenge Wheel | `/poetry-challenge-word-wheel` |
| Songwriting Word Generator | `/songwriting-word-generator` |
| Random Theme Generator | `/random-theme-word-wheel` |
| Random Topic Generator | `/random-topic-word-wheel` |
| Brainstorming Word Wheel | `/brainstorming-word-wheel` |
| Random Word Generator for Writing | `/random-word-generator-for-writing` |
| Random Word Generator for Stories | `/random-word-generator-for-stories` |
| Random Writing Prompt Generator | `/random-writing-prompt-generator` |
| Random Story Word Generator | `/random-story-word-generator` |

**Fun mode (hub UX):** 3–5 words → write a story using all of them.

Also in this category: Random Writing Prompt · Story Prompt/Idea · Poetry Prompt · Creative Writing Generator (SEO cluster pages).

---

### D. Classroom / Teacher — `classroom`

| Topic | Suggested URL |
|-------|---------------|
| Classroom Word Picker | `/classroom-word-picker` |
| Random Vocabulary Word | `/random-vocabulary-word-wheel` |
| Vocabulary Wheel | `/vocabulary-word-wheel` |
| Spelling Word Wheel | `/spelling-word-wheel` |
| Sight Word Picker | `/sight-word-picker` |
| Reading Word Picker | `/reading-word-picker` |
| Writing Word Picker | `/classroom-writing-word-picker` |
| Random Student Vocabulary | `/student-vocabulary-word-wheel` |
| Word-of-the-Day Wheel | `/word-of-the-day-wheel` |
| English Practice Wheel | `/english-practice-word-wheel` |
| ESL Word Wheel | `/esl-word-wheel` |
| Language Learning Wheel | `/language-learning-word-wheel` |
| Classroom Discussion Word | `/classroom-discussion-word-wheel` |
| Random Topic Word | `/classroom-topic-word-wheel` |
| Homework Word Picker | `/homework-word-picker` |
| Random Word Generator for Teachers | `/random-word-generator-for-teachers` |
| Random Word Generator for Students | `/random-word-generator-for-students` |
| Random Word Generator for ESL | `/random-word-generator-for-esl` |
| Random Vocabulary Word Generator | `/random-vocabulary-word-generator` |

**Defaults:** Elimination on · large result · copy word · vocab card (Phase 2).

---

### E. Word Games — `games`

| Topic | Suggested URL |
|-------|---------------|
| Word Challenge | `/word-challenge-wheel` |
| Guess the Word | `/guess-the-word-wheel` |
| Describe the Word | `/describe-the-word-wheel` |
| Act Out the Word | `/act-out-the-word-wheel` |
| Draw the Word | `/draw-the-word-wheel` |
| Pictionary Word Wheel | `/pictionary-word-wheel` |
| Charades Word Wheel | `/charades-word-wheel` |
| Taboo Word Generator | `/taboo-word-generator` |
| Word Association Game | `/word-association-wheel` |
| Word Chain Game | `/word-chain-wheel` |
| Forbidden Word Challenge | `/forbidden-word-challenge-wheel` |
| Random Word Challenge | `/random-word-challenge-wheel` |
| Speed Word Challenge | `/speed-word-challenge-wheel` |
| Last Letter Challenge | `/last-letter-word-challenge` |
| First Letter Challenge | `/first-letter-word-challenge` |
| Word Battle | `/word-battle-wheel` |
| Random Word Generator for Games | `/random-word-generator-for-games` |
| Random Word Generator for Pictionary | `/random-word-generator-for-pictionary` |
| Random Word Generator for Charades | `/random-word-generator-for-charades` |

---

### F. Drawing / Art — `drawing`

| Topic | Suggested URL |
|-------|---------------|
| Random Drawing Word | `/random-drawing-word-wheel` |
| What Should I Draw? | `/what-should-i-draw` |
| Drawing Prompt Wheel | `/drawing-prompt-word-wheel` |
| Art Prompt Generator | `/art-prompt-word-generator` |
| Sketch Challenge | `/sketch-challenge-word-wheel` |
| Doodle Word Generator | `/doodle-word-generator` |
| Character Drawing Prompt | `/character-drawing-word-wheel` |
| Animal Drawing Wheel | `/animal-drawing-word-wheel` |
| Object Drawing Wheel | `/object-drawing-word-wheel` |
| Fantasy Drawing Prompt | `/fantasy-drawing-word-wheel` |
| Random Art Challenge | `/random-art-challenge-word-wheel` |
| Inktober Word Wheel | `/inktober-word-wheel` |
| Random Word Generator for Drawing | `/random-word-generator-for-drawing` |
| Random Drawing Word Generator | `/random-drawing-word-generator` |

---

### G. Speaking / Acting — `speaking`

| Topic | Suggested URL |
|-------|---------------|
| Random Speaking Topic | `/random-speaking-topic-wheel` |
| Speaking Challenge | `/speaking-challenge-word-wheel` |
| Conversation Word Wheel | `/conversation-word-wheel` |
| Debate Topic Generator | `/debate-topic-word-wheel` |
| Public Speaking Word Picker | `/public-speaking-word-picker` |
| Impromptu Speaking Wheel | `/impromptu-speaking-word-wheel` |
| Acting Prompt Wheel | `/acting-prompt-word-wheel` |
| Charades Word Generator | `/charades-word-generator` |
| Acting Challenge | `/acting-challenge-word-wheel` |
| Describe This Word | `/describe-this-word-wheel` |
| Explain the Random Word | `/explain-the-random-word-wheel` |
| 60-Second Speaking Challenge | `/60-second-speaking-challenge-wheel` |
| Random Speaking Topic Generator | `/random-speaking-topic-generator` |
| Random Acting Prompt Generator | `/random-acting-prompt-generator` |

---

### H. Vocabulary enrichment *(result-card feature, not a URL category)*

After spin: Definition · Pronunciation · Part of speech · Example · Synonyms · Antonyms · Difficulty · Length · Letters · Syllables · Related words.

> **Word: Adventure** — Noun · 9 letters — Definition · Example · Synonyms  

Phase 2 curated; Phase 4 richer lexicon.

---

### I. Word-Type Wheels — `word-type`

| Topic | Suggested URL |
|-------|---------------|
| Noun Wheel | `/noun-word-wheel` |
| Verb Wheel | `/verb-word-wheel` |
| Adjective Wheel | `/adjective-word-wheel` |
| Adverb Wheel | `/adverb-word-wheel` |
| Action Word Wheel | `/action-word-wheel` |
| Describing Word Wheel | `/describing-word-wheel` |
| Feeling Word Wheel | `/feeling-word-wheel` |
| Emotion Word Wheel | `/emotion-word-wheel` |
| Animal Word Wheel | `/animal-word-wheel` |
| Food Word Wheel | `/food-word-wheel` |
| Object Word Wheel | `/object-word-wheel` |
| Place Word Wheel | `/place-word-wheel` |
| Person Word Wheel | `/person-word-wheel` |
| Nature Word Wheel | `/nature-word-wheel` |
| Fantasy Word Wheel | `/fantasy-word-wheel` |

---

### J. Difficulty — `difficulty`

| Topic | Suggested URL |
|-------|---------------|
| Beginner Words | `/beginner-words-wheel` |
| Intermediate Words | `/intermediate-words-wheel` |
| Advanced Words | `/advanced-words-wheel` |
| Challenging Words | `/challenging-words-wheel` |
| Rare Words | `/rare-words-wheel` |
| Unusual Words | `/unusual-words-wheel` |
| Obscure Words | `/obscure-words-wheel` |
| Easy / Difficult / Long / Short | Prefer `categories` URLs; difficulty filter can reuse packs |

---

### K. Letter-based — `letter` *(bridge to Letter Picker)*

| Topic | Suggested URL |
|-------|---------------|
| Words Starting With A…Z | `/words-starting-with-a` … `/words-starting-with-z` |
| Random A–Z Word | `/random-a-z-word-wheel` |
| Random Word by Letter | `/random-word-by-letter` |
| Word Ending Letter Picker | `/word-ending-letter-picker` |

Letter Picker = **one letter**. These = **full words** by letter.

---

### L. Word length — `length`

| Topic | Suggested URL |
|-------|---------------|
| 2–10 Letter Words | `/2-letter-words-wheel` … `/10-letter-words-wheel` |
| Longest Words | `/longest-words-wheel` |
| Random Long Word | `/random-long-word-wheel` |
| Long Word Generator | `/long-word-generator` |

---

### M. Kids — `kids`

| Topic | Suggested URL |
|-------|---------------|
| Kids Word Wheel | `/kids-word-wheel` |
| Kids Easy Word Wheel | `/kids-easy-word-wheel` |
| Kids Vocabulary Wheel | `/kids-vocabulary-word-wheel` |
| Kids Animal / Food / Color / School / Funny | `/kids-animal-word-wheel` · … |
| Kids Drawing Word Wheel | `/kids-drawing-word-wheel` |
| Kids Story Word Generator | `/kids-story-word-generator` |
| Kids Charades / Pictionary | `/kids-charades-word-wheel` · `/kids-pictionary-word-wheel` |
| Preschool Word Wheel | `/preschool-word-wheel` |
| Random Word Generator for Kids | `/random-word-generator-for-kids` |

Family-friendly only.

---

### N. Party / Social — `party`

| Topic | Suggested URL |
|-------|---------------|
| Party Word Generator | `/party-word-generator` |
| Icebreaker Word Wheel | `/icebreaker-word-wheel` |
| Party Challenge Word | `/party-challenge-word-wheel` |
| Funny / Charades / Pictionary / Conversation | Prefer `categories` / `games` / `speaking` URLs; party hub deep-links |
| Drinking-game prompts | **Separate** routes only if ever; never mix into kids/classroom |

---

### O. Special / seasonal / fandom — `special`

| Topic | Suggested URL |
|-------|---------------|
| Animal / Food / Movie / Sports / Travel / Nature / School Words | `/animal-words-wheel` · `/food-words-wheel` · … |
| Christmas / Halloween / Thanksgiving / Valentine’s | `/christmas-words-wheel` · `/halloween-words-wheel` · … |
| Summer / Winter | `/summer-words-wheel` · `/winter-words-wheel` |
| Fantasy / Science / Space / Ocean / Dinosaur | `/fantasy-words-wheel` · … |
| Pokémon / Minecraft / Fortnite Words | `/pokemon-words-wheel` · `/minecraft-words-wheel` · `/fortnite-words-wheel` |

Also Related-link deep hubs: `/pokemon-picker-wheel`, `/fortnite-picker-wheel`.

---

### P. Challenge modes — `modes` *(mostly hub UX)*

| Mode | Behavior | Optional URL |
|------|----------|--------------|
| One Word | Spin → 1 | Hub default |
| Three Words | 3 together | `/give-me-3-random-words` |
| Five Words | 5 together | `/give-me-5-random-words` |
| Story / Drawing / Acting / Definition / Spelling / Speed / Elimination | See writing/drawing/classroom/games | Hub mode chips |

---

### Q. Question-intent — `questions`

| Topic | Suggested URL |
|-------|---------------|
| What Word Should I Pick? | `/what-word-should-i-pick` |
| Pick a Random Word | `/pick-a-random-word` |
| Give Me a Random Word | `/give-me-a-random-word` |
| What Random Word Should I Use? | `/what-random-word-should-i-use` |
| What Word Should I Draw? / What Should I Draw? | `/what-word-should-i-draw` · `/what-should-i-draw` |
| What Should I Write About? | `/what-should-i-write-about` |
| What Word Should I Write About? | `/what-word-should-i-write-about` |
| What Word Should I Use in My Story? | `/what-word-should-i-use-in-my-story` |
| What Word Should I Act Out? | `/what-word-should-i-act-out` |
| What Word Should I Describe? | `/what-word-should-i-describe` |
| Poem / Pictionary / Charades variants | `/what-word-should-i-use-for-a-poem` · … |
| Give Me a Random Writing Prompt | `/give-me-a-random-writing-prompt` |

---

## Related Wheels — `related` *(external tools, not Word spokes)*

Each related tool is its **own product category** on the site. Use live URLs where built.

| # | Related tool | Category (site) | Live URL | Status |
|---|--------------|-----------------|----------|--------|
| 1 | Letter Wheel | Letters | `/spin-random-letter-picker-wheel` | ✅ |
| 2 | Random Name Picker | Names / home | `/` | ✅ |
| 3 | Number Picker Wheel | Numbers | `/spin-random-number-picker-wheel` | ✅ |
| 4 | Color Picker Wheel | Colors | `/spin-random-color-picker-wheel` | ✅ |
| 5 | What Should I Draw? | Drawing | `/what-should-i-draw` | Planned (Word `drawing` too) |
| 6 | What Should I Do? | Activities | TBD | Planned |
| 7 | Yes/No Picker Wheel | Decisions | `/spin-random-yes-no-picker-wheel` | ✅ |
| 8 | Custom Spin Wheel | General lists | `/` | ✅ |
| 9 | Team Picker | Teams | `/spin-random-team-picker-wheel` | ✅ |
| 10 | Random Country Wheel | Travel | `/spin-random-country-wheel` | ✅ |
| 11 | Pokémon Wheel | Games / fandom | `/pokemon-picker-wheel` | ✅ |
| 12 | Fortnite Wheel | Games / fandom | `/fortnite-picker-wheel` | ✅ |
| 13 | Truth or Dare Wheel | Party | TBD | Planned |
| 14 | Wheel of Fortune | Prizes / party | `/wheel-of-fortune` | ✅ |
| — | Raffle Spin Wheel | Classroom / giveaways | `/raffle-spin-wheel` | ✅ Education cross-link |

---

## Primary SEO keywords

Word Picker Wheel · Random Word Picker · Random Word Generator · Random Word Wheel · Random Word Spinner · Random Word Selector · Word Spinner · Word Selector · Word Generator Wheel · Random Word Wheel Generator · Random Word Generator Online  

---

## Implementation phases

### Phase 1 — Pillar MVP

- [x] `/word-picker-wheel` + `toolType` + wheel-manager  
- [x] Full chrome (Results, Manage, Settings sync, Manual/AI, left tools, sidebar height)  
- [x] List + Text paste  
- [x] Elimination / no-repeat + history + copy result  
- [x] Starter packs from **`categories` + `classroom` + `writing` + `kids`** (5–8)  
- [x] SEO + FAQ + Related Wheels (live URLs above)  
- [x] Sitemap / `CORE_INDEXABLE_PATHS` for pillar  
- [x] Home Related Tools link  

### Phase 2 — Modes + enrichment + import

- [x] Mode chips: One / Three / Story / Drawing / Acting / Elimination  
- [x] Post-spin vocab card  
- [x] TXT/CSV · AI presets · filters  
- [x] Share / deep-link  

### Phase 3 — Spokes **by category batch**

1. [x] `writing`  
2. [x] `classroom`  
3. [x] `games`  
4. [x] `drawing`  
5. [x] `speaking`  
6. [x] `kids`  
7. [x] `word-type` / `difficulty` / `length` / `letter`  
8. [x] `special` + `questions` + `aliases`  

**Canonical URL change:** `/word-picker-wheel` → `/spin-word-picker-wheel` (redirects + aliases). 

### Phase 4 — Platform depth

- [x] Weighted words (List/Text weights + equalize)  
- [x] Multi-winner N (1/2/3/5/10)  
- [x] Saved packs / favorites (localStorage)  
- [x] Embed (`?embed=1` + copy iframe)  
- [x] Richer lexicon (syllables, related, expanded curated)  
- [x] Optional isolated party route (`/party-word-generator`)  

### Phase 5 — SEO / layout parity + .md gaps (done this pass)

- [x] Reciprocal related links (Letter, Raffle, Prize) + Home Popular Wheels  
- [x] Hub SEO depth (use cases, why, vs Letter/Name, expanded FAQ/related)  
- [x] Spoke SEO depth (TOC, popular, category siblings)  
- [x] `googleBot` metadata on hub  
- [x] Modes: Five / Definition / Spelling / Speed  
- [x] Question spokes: give-me-3, give-me-5, what-to-act-out, kids generator, icebreaker  
- [x] Consolidate import/filter/share into one advanced controls band  

### Phase 6 — Full topic-map URL expansion (done)

- [x] Bulk catalog: `scripts/expand-word-picker-spokes.js` → `lib/word-picker-spoke-expansion.generated.ts`
- [x] New packs + spokes for categories, writing, classroom, games, drawing, speaking, word-type, difficulty, length 2–10, letters B–Z, kids, party, special/seasonal/fandom, question-intent SEO
- [x] Page generation: `scripts/generate-word-picker-spokes.js` (226 `app/*/page.tsx`)
- [x] `hrefToToolType` uses `WORD_PICKER_ALL_SPOKE_PATHS` + alias redirects (no hand list)
- [x] Still noindex spokes; hub alone in `CORE_INDEXABLE_PATHS`
- [x] Skipped reclaiming `/what-should-i-draw` (Fortune) — word version is `/what-word-should-i-draw`

### Remaining backlog

- Definition/Spelling/Speed as dedicated SEO URLs later (modes already on hub)
- Sidebar-native word filters (category/difficulty chips inside List tab)
- Index selected high-traffic spokes only when content depth justifies
- Optional adult party prompts (separate from family-friendly core)

## Architecture notes (when coding starts)

| Piece | Role |
|-------|------|
| `app/spin-word-picker-wheel/page.tsx` | Hub |
| `components/word-picker-wheel/*` | App shell, templates, result/vocab card, modes, spokes |
| `lib/word-picker-wheel-seo.ts` | Titles, FAQ, related |
| `lib/word-picker-wheel-use-cases.ts` | Packs tagged by **category ID** |
| `lib/word-picker-wheel-spokes.ts` | Spoke registry: core + expansion merge |
| `lib/word-picker-spoke-expansion.generated.ts` | Bulk packs/spokes from expand script |
| `scripts/expand-word-picker-spokes.js` | Regenerates expansion catalog |
| `scripts/generate-word-picker-spokes.js` | Writes `app/<spoke>/page.tsx` for all spokes |
| `types/word-picker-wheel-types.ts` | Optional POS, difficulty, length metadata |
| Options-wheel engine | Reuse EnhancedWheelSection + input panel patterns |

**Do not** merge into Letter Picker or rename home toolType.  
**Do** store `category` on every spoke/use-case.

---

## Success metrics

- Paste / bulk-add adoption  
- Usage by **category** (writing vs classroom vs games…)  
- Spins per session; elimination in classroom  
- Internal clicks: Word ↔ Letter ↔ Home  
- Organic landings on pillar + top category spokes  

---

## Cross-links

- Platform index: [README.md](./README.md)  
- Build order: [competitor-tools-build-plan.md](./competitor-tools-build-plan.md)  
- Older sketch: [make-a-word-wheel.md](./make-a-word-wheel.md)  
- Letter tool: [letter-picker-wheel.md](./letter-picker-wheel.md)  
- Competitor pattern: [competitor-spinthewheel-analysis.md](./competitor-spinthewheel-analysis.md)  

---

## Decision log

| Decision | Choice |
|----------|--------|
| Home-only mode first? | **No** — standalone pillar |
| Canonical slug | `/spin-word-picker-wheel` |
| toolType | `word-picker-wheel` |
| Every spoke has a category? | **Yes** — required field |
| Family-friendly default | Yes; adult party separate if ever |
| Thin keyword clones | No — distinct packs / modes per category spoke |
| Indexing | Pillar indexed; most category spokes noindex until depth justifies |

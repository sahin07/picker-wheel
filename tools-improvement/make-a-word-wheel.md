# Make a Word Wheel — Future Upgrades

**Product name:** Make a Word Wheel  
**Primary route (ship first):** `/` (Custom Spin Wheel home — **word-focused mode**)  
**Future SEO route:** `/make-a-word-wheel` (alias → home or dedicated landing)  
**Competitor UGC examples:** `the-random-word-wheel`, `halloween-word-wheel`, vocabulary wheels

---

## Strategy (home page first)

> **Do not build a separate page yet.** Complete this as a **mode + copy + features** on the home Custom Spin Wheel.

| Approach | When |
|----------|------|
| **Word mode on `/`** | Now — part of home completion |
| **Route `/make-a-word-wheel`** | Later — SEO alias after features work |

**Difference from other tools:**

| Tool | Picks |
|------|--------|
| **Make a Word Wheel** (home) | **Full words** — vocabulary, topics, phrases |
| Letter Picker Wheel | Single **letters** A–Z |
| Random Name Picker | **People / names** |
| Custom Spin Wheel (general) | Anything — names, items, ideas |

---

## Target users & use cases

- Teachers — vocabulary, spelling, sight words, random student word
- Writers — writing prompts, random word challenge
- Party games — taboo-style word lists, charades words
- Language learning — word of the day, practice lists
- Kids — sight words, Dolch lists, themed word wheels (Halloween, etc.)

---

## MVP features (ship on home `/`)

### Word input

| Feature | Status today | Priority |
|---------|--------------|----------|
| Manual add word (text entry) | ✅ Built | — |
| **Paste word list** (one word per line) | ❌ Missing | **High** |
| Bulk paste textarea → replace or append wheel | ❌ Missing | **High** |
| AI generate word list from topic | ✅ Partial (AI tab) | **High** — word-specific prompts |
| CSV / Excel word import | ❌ Missing | High |
| Duplicate word warning / remove duplicates | ❌ Missing | Medium |
| Max word length / truncate long words on wheel | ⚠️ Partial (12 char on canvas) | Medium |

### Word wheel behavior

| Feature | Status today | Priority |
|---------|--------------|----------|
| Spin → random **word** result | ✅ Built | — |
| Remove word after spin (elimination) | ❌ Missing | **High** |
| Weighted words (`apple:3`) | ⚠️ Partial | High |
| Multi-word pick (2–10 per spin) | ❌ Missing | High |
| Shuffle word order | ✅ Built | — |
| Mystery spin (hide words as `?`) | ✅ Built (settings) | — |

### Word templates (quick start)

| Template | Example entries | Priority |
|----------|-----------------|----------|
| Random vocabulary | 20 common English words | High |
| Writing prompts | Adventure, Mystery, Dialogue… | Medium |
| Sight words (Grade 1) | the, and, you, said… | Medium |
| Halloween words | Ghost, Pumpkin, Candy… | Low |
| Custom — user saves as wheel | Switch Wheel | ✅ Built |

### Results & sharing

| Feature | Status today | Priority |
|---------|--------------|----------|
| Winner shows **word** clearly | ✅ Built | — |
| Results history (all wheels) | ✅ Built | — |
| Copy winning word | ❌ Missing | Medium |
| Share word wheel URL | ❌ Missing | High |

### UX / labeling (home page)

| Feature | Status today | Priority |
|---------|--------------|----------|
| **“Make a Word Wheel”** tab or subtitle on home | ❌ Missing | **High** |
| Placeholder: “Type or paste words, one per line…” | ❌ Missing | High |
| Help text: “Perfect for vocabulary, spelling, and word games” | ❌ Missing | Medium |
| Link to Letter Picker (letters) vs Word Wheel (words) | ❌ Missing | Low |

---

## ⭐ Best features (differentiators)

1. **Paste a word list** — fastest path from classroom worksheet → wheel  
2. **Remove word after spin** — fair classroom picks without repeats  
3. **AI word list** — “20 science vocabulary words for grade 5”  
4. **Word templates** — one-click Dolch, Halloween, writing prompts  
5. **Weighted words** — harder words appear more often (study mode)  
6. **Shareable word wheel link** — teacher sends link to students  

---

## Related wheels (link from word mode)

| Tool | Route | Why |
|------|-------|-----|
| Letter Picker Wheel | `/letter-picker-wheel` | Letters, not full words |
| Random Name Picker | `/` | Names / people, not vocabulary |
| Custom Spin Wheel | `/` | General lists |
| Number Picker | `/number-picker-wheel` | Numbers instead of words |

---

## Future route (SEO — later)

```
/make-a-word-wheel          (alias → / with ?mode=words or same page)
/make-a-word-wheel/random   (preset: random vocabulary)
/wheels/education/word-wheel
```

### SEO keywords (defer until page structure phase)

- make a word wheel
- word wheel maker
- random word wheel
- vocabulary wheel
- spelling word wheel
- word spinner
- create word wheel online

---

## Home page upgrade checklist (Make a Word Wheel)

### Phase A — Core word workflow
- [ ] Bulk **paste words** panel (textarea, one per line)
- [ ] **Remove word after spin** toggle
- [ ] Home copy: “Make a Word Wheel” subtitle or input mode label
- [ ] Word-focused **AI prompts** (vocabulary, spelling, themed lists)

### Phase B — Classroom & games
- [ ] Built-in **word templates** (vocabulary, sight words, prompts)
- [ ] Remove duplicate words button
- [ ] Copy winning word button on result panel

### Phase C — Share & SEO
- [ ] Share URL encodes word list
- [ ] Route `/make-a-word-wheel` redirect or landing
- [ ] FAQ block: word wheel vs letter wheel vs name picker

---

## Success metrics

- Users paste 5+ words in one action (bulk paste adoption)
- Word template usage vs blank wheel
- Spins per session on word-heavy wheels
- Internal clicks: home ↔ letter picker

---

## Cross-links

- Home hub: [random-name-picker.md](./random-name-picker.md)
- Build order: [competitor-tools-build-plan.md](./competitor-tools-build-plan.md)
- Letter tool: [letter-picker-wheel.md](./letter-picker-wheel.md)

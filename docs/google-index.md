# Google Indexing Playbook — SpinifyWheel

> What we follow going forward when pages show as not indexed (or slow to appear in Google).
>
> **Key rule:** An existing slug is *not* why a page isn’t indexed. Browser history also has nothing to do with Google’s index.

---

## Why a page usually isn’t indexed yet

The most likely reason on a new site: **Google hasn’t chosen to index it yet**. Google is still evaluating the domain.

### Most common reasons

| Reason | What it means for us |
| --- | --- |
| **New website** | Site is ~1 week old. Google does not immediately index every page on new domains. |
| **Limited crawl budget** | New sites often get only a few pages crawled per visit. Crawling expands if Google sees quality. |
| **Similar page templates** | Many wheel pages share a similar layout. Google may delay indexing until each page clearly offers unique value. |
| **Internal linking** | Pages not linked prominently from the homepage or category pages may be discovered but deprioritized. |
| **Quality evaluation** | Google may have crawled the page but is still deciding whether it’s worth adding to the index. Common for programmatic SEO sites. |

### What does *not* cause this

- Slug already existing / URL looking “taken” in the browser
- Browser autocomplete or history showing those URLs (that only means *your* browser knows them)

---

## Timeline — when to worry

| Window | Expectation |
| --- | --- |
| **1–2 weeks** | Normal for many pages not to be indexed. |
| **2–6 weeks** | Many pages should start appearing if they’re high quality. |
| **2+ months** | If important pages are still “Crawled – currently not indexed” or “Discovered – currently not indexed,” investigate. |

**Do not panic early.** Age alone explains most “not indexed” cases on a brand-new domain.

---

## What we follow from next (action plan)

### Ongoing (do this now)

1. **Keep publishing high-quality pages** — don’t pause content while waiting for indexation.
2. **Unique content per wheel** — not just different titles; each page needs real, distinct value.
3. **Internal linking** — link new wheels from category pages and the homepage.
4. **Let Google recrawl naturally** — don’t obsess over forced indexing in the first weeks.

### Escalation checkpoint (3–4 weeks)

If pages like `/date-picker-wheel` and `/color-picker-wheel` still aren’t indexed **after Google has already crawled them**, then analyze:

- Page quality (thin / duplicate / template-only copy)
- Internal linking (homepage, category hubs, related wheels)
- Duplication across similar spokes

At that point there is usually a **specific** reason — not just site age.

---

## Investigation checklist (use after 3–4 weeks / 2+ months)

Use this only when the timeline says it’s time to dig in:

- [ ] Confirm status in Google Search Console (Discovered vs Crawled vs Indexed)
- [ ] Confirm the page was crawled (coverage / URL inspection)
- [ ] Compare unique SEO body content vs other spoke pages
- [ ] Check homepage + category + related-wheel links to the URL
- [ ] Check for near-duplicate titles, H1s, and meta descriptions across spokes
- [ ] Review sitemap inclusion and canonical tags
- [ ] Fix quality / linking issues, then request indexing if needed

---

## Watchlist pages (examples)

Revisit after ~3–4 weeks if crawled but still not indexed:

- `/date-picker-wheel`
- `/color-picker-wheel`
- Other high-priority spokes linked from home / category hubs

---

## Summary

| Do | Don’t |
| --- | --- |
| Improve uniqueness, linking, and quality | Panic in week 1–2 |
| Wait for natural crawl expansion | Blame the slug or browser history |
| Investigate after crawl + 3–4 weeks still not indexed | Assume every similar template page will index immediately |

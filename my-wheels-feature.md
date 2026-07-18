# My Wheels — Feature Spec (SpinifyWheel)

Reference inspiration: [spinthewheel.app](https://spinthewheel.app/) My Wheels panel.  
Brand/domain for Spinify: **spinifywheel.com** (never copy competitor branding or domains).

---

## Goal

Let users manage wheels they create or share, without requiring an account for the MVP:

- Keep a personal library in the browser (**Local wheels**)
- Keep wheels tied to shareable links (**Shared wheels**)
- Open, rename, delete, and switch between them from a header panel

---

## UX Overview

### Entry point

- Header nav item: **My Wheels**
- When the user has saved wheels, show a count: `My Wheels (N)`
- `N` = total of Shared + Local
- Click opens a **dropdown/popover** under the header (not a separate page)
- Close via **X** or click outside

### Panel layout

```
┌─────────────────────────────┐
│ Shared wheels (N)         X │
│  · empty state OR list      │
│                             │
│ Local wheels (N)            │
│  · empty state OR list      │
└─────────────────────────────┘
```

#### Empty states

- Shared: `You have no shared wheels yet`
- Local: `You have no local wheels yet`

#### List item (each wheel)

| Element | Description |
|--------|-------------|
| Thumbnail | Small color preview from the wheel palette |
| Title | Wheel name (default: `Untitled wheel`) |
| Timestamp | Last modified date/time |
| Delete | Trash control — removes that entry |
| Click row | Loads that wheel into the editor |

- Long lists should scroll independently per section

---

## Wheel types

### Local wheels

- Created via **+ New Wheel** / editor
- Auto-saved in the **browser** (localStorage or equivalent)
- Device- and browser-specific
- No account required

### Shared wheels

- Appear after the user **shares** a wheel (shareable URL)
- May also appear when opening/editing a shared/template copy online
- Backed by a shareable link / server copy (when share backend exists)
- Still listed in the My Wheels panel for quick reopen

---

## Related flows (around My Wheels)

| Flow | Behavior |
|------|----------|
| **+ New Wheel** | Creates a new editable wheel; auto-adds under Local; updates nav count |
| **Auto-save** | Editor changes update local meta (title, modified date, preview) |
| **Share + COPY** | Generates shareable URL under the wheel; COPY to clipboard; entry moves/links into Shared |
| **Open from panel** | Loads selected wheel into the current editor |
| **Rename** | Title editable (default Untitled); updates list + storage |
| **Delete** | Removes from list + storage; confirm if destructive |
| **Edit / template copy** | Public or category templates can spawn an editable copy into My Wheels |

---

## Data model (proposed)

### Identifiers

- `id`: UUID string per wheel
- Storage keys (example pattern):
  - `@meta-{id}` — list/card metadata
  - `@wheel-{id}` — full wheel payload
- Optional index key: `my-wheels-index` listing ids + type (`local` | `shared`)

### Meta (`@meta-{id}`)

```json
{
  "id": "uuid",
  "title": "Untitled wheel",
  "type": "local",
  "dateModified": 1784267759130,
  "preview": [["#2bab5e", "#f8fff5"], ["#f2c054", "#fffcf5"]],
  "shareUrl": null
}
```

For shared wheels, `type` is `"shared"` and `shareUrl` is set.

### Wheel payload (`@wheel-{id}`)

Store whatever the editor already uses for a wheel, at minimum:

- Labels / options
- Colors / style
- Weights (if enabled)
- Sounds (if enabled)
- Title / description display flags
- Any Spinify-specific settings already on the picker

---

## Implementation checklist

1. [ ] Define data model + localStorage (or IndexedDB) helpers
2. [ ] Header **My Wheels** link + live count badge
3. [ ] Dropdown panel UI (Shared / Local, empty states, close)
4. [ ] List items: thumbnail, title, timestamp, open, delete
5. [ ] Auto-save local wheels on new wheel + editor changes
6. [ ] Share flow: shareable URL + COPY under wheel
7. [ ] Shared list: shared wheels appear under Shared
8. [ ] Load from panel; Untitled + rename support
9. [ ] Wire template / “edit online” copy into My Wheels where needed
10. [ ] Help/FAQ: local vs shared (Spinify copy only)

### Suggested MVP vs later

**MVP (ship first)**

- Local wheels only (create, auto-save, list, open, delete, rename)
- Header count + panel UI

**Next**

- Share URL + COPY
- Shared section populated from share/open link
- Template “edit copy” → My Wheels

**Later (optional)**

- Account sync across devices
- Export / import
- Shared link permissions (active / disabled)

---

## Help / FAQ (draft angles)

- What is My Wheels?
- Difference between Local and Shared wheels
- Where are Local wheels stored? (this browser only)
- How do I share a wheel?
- How do I delete a wheel?
- Will clearing browser data remove Local wheels?

Use original Spinify wording; do not paste competitor FAQ text.

---

## Out of scope (for now)

- Full auth / cloud sync dashboard
- Competitor export/import access-code systems
- Cloning competitor UI chrome 1:1 (match behavior, keep Spinify design)

---

## Acceptance criteria

- [ ] User can open My Wheels from the header
- [ ] Creating a new wheel appears under Local and increments the count
- [ ] Clicking a list item loads that wheel
- [ ] Delete removes the wheel from the panel and storage
- [ ] Empty states show when a section has zero wheels
- [ ] Shared section works once share flow is implemented
- [ ] No competitor domain or brand strings in UI or SEO

export type SavedWordPack = {
  id: string
  name: string
  words: string[]
  favorite: boolean
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "spinify-word-picker-saved-packs-v1"

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage
}

export function listSavedWordPacks(): SavedWordPack[] {
  if (!canUseStorage()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedWordPack[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && Array.isArray(item.words) && item.name)
      .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.updatedAt.localeCompare(a.updatedAt))
  } catch {
    return []
  }
}

function writePacks(packs: SavedWordPack[]) {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(packs.slice(0, 40)))
}

export function saveWordPack(input: {
  name: string
  words: string[]
  favorite?: boolean
  id?: string
}): SavedWordPack | null {
  const words = input.words.map((w) => w.trim()).filter(Boolean)
  const name = input.name.trim() || "My word pack"
  if (words.length === 0) return null

  const now = new Date().toISOString()
  const packs = listSavedWordPacks()
  const existingIndex = input.id ? packs.findIndex((p) => p.id === input.id) : -1

  if (existingIndex >= 0) {
    const next: SavedWordPack = {
      ...packs[existingIndex],
      name,
      words,
      favorite: input.favorite ?? packs[existingIndex].favorite,
      updatedAt: now,
    }
    packs[existingIndex] = next
    writePacks(packs)
    return next
  }

  const created: SavedWordPack = {
    id: `pack-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    words,
    favorite: !!input.favorite,
    createdAt: now,
    updatedAt: now,
  }
  writePacks([created, ...packs])
  return created
}

export function toggleFavoriteWordPack(id: string): SavedWordPack[] {
  const packs = listSavedWordPacks().map((pack) =>
    pack.id === id ? { ...pack, favorite: !pack.favorite, updatedAt: new Date().toISOString() } : pack,
  )
  writePacks(packs)
  return listSavedWordPacks()
}

export function deleteSavedWordPack(id: string): SavedWordPack[] {
  writePacks(listSavedWordPacks().filter((pack) => pack.id !== id))
  return listSavedWordPacks()
}

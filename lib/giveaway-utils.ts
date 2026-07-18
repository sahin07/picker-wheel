export interface GiveawayEntry {
  id: string
  name: string
  weight: number
  enabled?: boolean
}

export function getActiveEntries(entries: GiveawayEntry[]) {
  return entries.filter((e) => e.enabled !== false && e.name.trim().length > 0)
}

export function pickWeightedWinners(entries: GiveawayEntry[], count: number): string[] {
  const pool = getActiveEntries(entries).map((e) => ({
    ...e,
    weight: Math.max(1, e.weight || 1),
  }))
  const winners: string[] = []

  for (let i = 0; i < count && pool.length > 0; i++) {
    const total = pool.reduce((sum, entry) => sum + entry.weight, 0)
    let roll = Math.random() * total
    let index = 0

    for (let j = 0; j < pool.length; j++) {
      roll -= pool[j].weight
      if (roll <= 0) {
        index = j
        break
      }
    }

    winners.push(pool[index].name)
    pool.splice(index, 1)
  }

  return winners
}

export function buildProbabilityStats(entries: GiveawayEntry[]) {
  const active = getActiveEntries(entries)
  const totalWeight = active.reduce((sum, e) => sum + Math.max(1, e.weight || 1), 0)

  return active.map((entry) => {
    const weight = Math.max(1, entry.weight || 1)
    return {
      name: entry.name,
      weight,
      probability: totalWeight > 0 ? (weight / totalWeight) * 100 : 0,
    }
  })
}

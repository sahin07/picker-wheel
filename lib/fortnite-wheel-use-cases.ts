import {
  getAllFortniteSkins,
  getFortniteCollabSkins,
  getFortniteSkinsByRarity,
  type FortniteRarityKey,
} from "@/data/fortnite-skins"
import {
  FORTNITE_DUO_CHALLENGE_ENTRIES,
  FORTNITE_DECISION_WHEEL_ENTRIES,
  FORTNITE_EMOTE_ENTRIES,
  FORTNITE_ITEM_PICKER_ENTRIES,
  FORTNITE_LANDING_SPOT_ENTRIES,
  FORTNITE_LOADOUT_ENTRIES,
  FORTNITE_LOOT_CHALLENGE_ENTRIES,
  FORTNITE_MYTHIC_WEAPON_ENTRIES,
  FORTNITE_SQUAD_CHALLENGE_ENTRIES,
  FORTNITE_VEHICLE_ENTRIES,
  FORTNITE_WEAPON_WHEEL_ENTRIES,
} from "@/data/fortnite-challenge-wheels"
import type { DisplayMode, RarityFilter, Skin } from "@/types/fortnite-types"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { FORTNITE_WHEEL_PATH } from "@/lib/fortnite-wheel-seo"

export type FortniteWheelUseCaseId =
  | "all-skins"
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "collabs"
  | "weapon-wheel"
  | "landing-spot-wheel"
  | "loadout-wheel"
  | "mythic-weapon-wheel"
  | "vehicle-wheel"
  | "duo-challenge"
  | "squad-challenge"
  | "emote-wheel"
  | "loot-challenge"
  | "item-picker"
  | "decision-wheel"

export type FortniteWheelUseCaseAccent =
  | "sky"
  | "slate"
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "orange"
  | "red"
  | "cyan"
  | "indigo"
  | "pink"
  | "yellow"
  | "lime"
  | "teal"
  | "fuchsia"

export type FortniteWheelUseCaseConfig = {
  selectedRarity: RarityFilter
  skins: Skin[]
  displayMode: DisplayMode
  templateParam: string
  /** Challenge wheels store entries as custom slices (not catalog skins). */
  customOnly?: boolean
}

export type FortniteWheelUseCase = {
  id: FortniteWheelUseCaseId
  label: string
  description: string
  accent: FortniteWheelUseCaseAccent
  config: FortniteWheelUseCaseConfig
}

function rarityCase(
  id: Exclude<
    FortniteWheelUseCaseId,
    | "all-skins"
    | "collabs"
    | "weapon-wheel"
    | "landing-spot-wheel"
    | "loadout-wheel"
    | "mythic-weapon-wheel"
    | "vehicle-wheel"
    | "duo-challenge"
    | "squad-challenge"
    | "emote-wheel"
    | "loot-challenge"
    | "item-picker"
    | "decision-wheel"
  >,
  label: string,
  description: string,
  accent: FortniteWheelUseCaseAccent,
): FortniteWheelUseCase {
  const rarity = id as FortniteRarityKey
  return {
    id,
    label,
    description,
    accent,
    config: {
      selectedRarity: rarity,
      skins: getFortniteSkinsByRarity(rarity),
      displayMode: "emoji-name",
      templateParam: rarity,
    },
  }
}

function challengeCase(
  id: Exclude<
    FortniteWheelUseCaseId,
    | "all-skins"
    | "common"
    | "uncommon"
    | "rare"
    | "epic"
    | "legendary"
    | "mythic"
    | "collabs"
  >,
  label: string,
  description: string,
  accent: FortniteWheelUseCaseAccent,
  entries: Skin[],
  templateParam: string,
): FortniteWheelUseCase {
  return {
    id,
    label,
    description,
    accent,
    config: {
      selectedRarity: "all",
      skins: entries,
      displayMode: "emoji-name",
      templateParam,
      customOnly: true,
    },
  }
}

export const FORTNITE_WHEEL_USE_CASES: FortniteWheelUseCase[] = [
  {
    id: "all-skins",
    label: "Random Fortnite Skin",
    description: "Full catalog on one fair spinner.",
    accent: "sky",
    config: {
      selectedRarity: "all",
      skins: getAllFortniteSkins(),
      displayMode: "emoji-name",
      templateParam: "all",
    },
  },
  rarityCase("common", "Common Skins", "Common rarity outfits only.", "slate"),
  rarityCase(
    "uncommon",
    "Uncommon Skins",
    "Uncommon rarity spinner.",
    "emerald",
  ),
  rarityCase("rare", "Rare Skins", "Rare rarity outfits only.", "blue"),
  rarityCase("epic", "Epic Skins", "Epic rarity spinner.", "violet"),
  rarityCase(
    "legendary",
    "Legendary Skins",
    "Legendary outfits for high-rarity challenges.",
    "amber",
  ),
  rarityCase(
    "mythic",
    "Mythic Skins",
    "Mythic rarity spinner for elite picks.",
    "rose",
  ),
  {
    id: "collabs",
    label: "Collab Skins",
    description: "Marvel, DC, Star Wars, Dragon Ball, and event collabs.",
    accent: "orange",
    config: {
      selectedRarity: "all",
      skins: getFortniteCollabSkins(),
      displayMode: "emoji-name",
      templateParam: "collabs",
    },
  },
  challengeCase(
    "weapon-wheel",
    "Weapon Wheel",
    "Random weapon challenge for your next match.",
    "red",
    FORTNITE_WEAPON_WHEEL_ENTRIES,
    "weapon",
  ),
  challengeCase(
    "landing-spot-wheel",
    "Landing Spot Wheel",
    "Spin a random drop location each game.",
    "cyan",
    FORTNITE_LANDING_SPOT_ENTRIES,
    "landing",
  ),
  challengeCase(
    "loadout-wheel",
    "Loadout Wheel",
    "Random weapon combos and loadout rules.",
    "indigo",
    FORTNITE_LOADOUT_ENTRIES,
    "loadout",
  ),
  challengeCase(
    "mythic-weapon-wheel",
    "Mythic Weapon Wheel",
    "Spin mythic weapon challenges for special modes.",
    "yellow",
    FORTNITE_MYTHIC_WEAPON_ENTRIES,
    "mythic-weapon",
  ),
  challengeCase(
    "vehicle-wheel",
    "Vehicle Wheel",
    "Random vehicle or movement challenge.",
    "lime",
    FORTNITE_VEHICLE_ENTRIES,
    "vehicle",
  ),
  challengeCase(
    "duo-challenge",
    "Duo Challenge Wheel",
    "Fun duo house rules and challenges.",
    "pink",
    FORTNITE_DUO_CHALLENGE_ENTRIES,
    "duo",
  ),
  challengeCase(
    "squad-challenge",
    "Squad Challenge Wheel",
    "Squad night rules and team challenges.",
    "teal",
    FORTNITE_SQUAD_CHALLENGE_ENTRIES,
    "squad",
  ),
  challengeCase(
    "emote-wheel",
    "Emote Wheel",
    "Random emote challenges for streams and parties.",
    "fuchsia",
    FORTNITE_EMOTE_ENTRIES,
    "emote",
  ),
  challengeCase(
    "loot-challenge",
    "Loot Challenge Wheel",
    "Loot rules and chest challenges.",
    "amber",
    FORTNITE_LOOT_CHALLENGE_ENTRIES,
    "loot",
  ),
  challengeCase(
    "item-picker",
    "Item Picker",
    "Random Fortnite items—guns, heals, and loot.",
    "sky",
    FORTNITE_ITEM_PICKER_ENTRIES,
    "item",
  ),
  challengeCase(
    "decision-wheel",
    "Decision Wheel",
    "Spin tactical calls for your next move.",
    "violet",
    FORTNITE_DECISION_WHEEL_ENTRIES,
    "decision",
  ),
]

export function getFortniteWheelUseCase(
  id: FortniteWheelUseCaseId,
): FortniteWheelUseCase | undefined {
  return FORTNITE_WHEEL_USE_CASES.find((u) => u.id === id)
}

const TEMPLATE_MAP: Record<string, FortniteWheelUseCaseId> = {
  all: "all-skins",
  "all-skins": "all-skins",
  random: "all-skins",
  common: "common",
  uncommon: "uncommon",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
  mythic: "mythic",
  collabs: "collabs",
  collab: "collabs",
  crossovers: "collabs",
  weapon: "weapon-wheel",
  "weapon-wheel": "weapon-wheel",
  landing: "landing-spot-wheel",
  "landing-spot": "landing-spot-wheel",
  loadout: "loadout-wheel",
  "mythic-weapon": "mythic-weapon-wheel",
  vehicle: "vehicle-wheel",
  duo: "duo-challenge",
  squad: "squad-challenge",
  emote: "emote-wheel",
  loot: "loot-challenge",
  item: "item-picker",
  "item-picker": "item-picker",
  decision: "decision-wheel",
  "decision-wheel": "decision-wheel",
}

export function fortniteWheelUseCaseFromTemplate(
  template: string | null,
  rarity: string | null,
): FortniteWheelUseCaseId | null {
  const t = (template || "").toLowerCase()
  if (t && TEMPLATE_MAP[t]) return TEMPLATE_MAP[t]

  const r = (rarity || "").toLowerCase()
  if (r && TEMPLATE_MAP[r]) return TEMPLATE_MAP[r]
  return null
}

/** Apply a popular Fortnite template to the live wheel store. */
export function applyFortniteWheelUseCase(id: FortniteWheelUseCaseId): boolean {
  const useCase = getFortniteWheelUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useWheelManagerStore.getState()

  if (store.currentTool !== "fortnite-wheel") {
    store.setCurrentTool("fortnite-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("fortnite-wheel", "Fortnite Picker Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  const skinIds = config.skins.map((s) => s.id)
  store.updateWheelData("fortnite-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedRarity: config.selectedRarity,
    selectedSkins: skinIds,
    skinOrder: skinIds,
    displayMode: config.displayMode,
    ...(config.customOnly ? { customSkins: config.skins } : {}),
  })

  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === FORTNITE_WHEEL_PATH) {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}

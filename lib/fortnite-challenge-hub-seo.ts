import { HOME_SITE_URL } from "@/lib/home-seo"
import { FORTNITE_WHEEL_PATH } from "@/lib/fortnite-wheel-seo"
import { FORTNITE_WHEEL_USE_CASES } from "@/lib/fortnite-wheel-use-cases"
import { FORTNITE_WHEEL_SPOKES } from "@/lib/fortnite-wheel-spokes"

export const FORTNITE_CHALLENGE_HUB_PATH = "/fortnite-challenge-picker-wheel"

export const FORTNITE_CHALLENGE_HUB_URL = `${HOME_SITE_URL}${FORTNITE_CHALLENGE_HUB_PATH}`

export const FORTNITE_CHALLENGE_HUB_PAGE_TITLE =
  "Fortnite Challenge Picker Wheel | All Challenge Templates Hub"

export const FORTNITE_CHALLENGE_HUB_DESCRIPTION =
  "Browse every Fortnite Challenge Picker Wheel—weapon, landing spot, loadout, duo, squad, emote, loot, and more. Pick a template and spin fair random challenges."

export const FORTNITE_CHALLENGE_HUB_H1 = "Fortnite Challenge Picker Wheel"

export const FORTNITE_CHALLENGE_HUB_HERO =
  "One hub for every Fortnite challenge template. Open weapon, landing, loadout, duo, squad, emote, or loot wheels—or spin duo rules here and jump to a dedicated page anytime."

export const FORTNITE_CHALLENGE_HUB_KEYWORDS = [
  "Fortnite Challenge Picker Wheel",
  "fortnite challenge generator",
  "fortnite challenge templates",
  "fortnite duo challenge",
  "fortnite squad challenge",
  "fortnite weapon challenge",
] as const

const CHALLENGE_USE_CASE_IDS = [
  "weapon-wheel",
  "landing-spot-wheel",
  "loadout-wheel",
  "mythic-weapon-wheel",
  "vehicle-wheel",
  "duo-challenge",
  "squad-challenge",
  "emote-wheel",
  "loot-challenge",
] as const

export const FORTNITE_CHALLENGE_HUB_LINKS = CHALLENGE_USE_CASE_IDS.map((id) => {
  const useCase = FORTNITE_WHEEL_USE_CASES.find((u) => u.id === id)!
  const spoke = FORTNITE_WHEEL_SPOKES[id]
  return {
    id,
    label: useCase.label,
    href: spoke.path,
    description: useCase.description,
    accent: useCase.accent,
  }
})

export const FORTNITE_CHALLENGE_HUB_FAQ = [
  {
    question: "What is a Fortnite Challenge Picker Wheel?",
    answer:
      "A Fortnite Challenge Picker Wheel is a collection of ready-made templates for weapons, landing spots, loadouts, duo and squad rules, emotes, and loot constraints. Spin one template or open a dedicated page for each challenge type.",
  },
  {
    question: "Which challenge wheel should I use?",
    answer:
      "Pick Weapon for gun limits, Landing Spot for drop locations, Loadout for combo rules, Duo or Squad for team house rules, Emote for dance challenges, and Loot for chest-only or floor-loot games.",
  },
  {
    question: "Can I customize challenge entries?",
    answer:
      "Yes. Every template opens in the full Fortnite Picker Wheel. Edit entries in the Inputs panel or Text tab and save in My Wheels on this device.",
  },
  {
    question: "Where is the main Fortnite Picker Wheel?",
    answer: `The main pillar at ${FORTNITE_WHEEL_PATH} includes skin wheels plus all challenge templates in one place.`,
  },
] as const

export const FORTNITE_CHALLENGE_HUB_ON_THIS_PAGE = [
  { id: "fortnite-challenge-hub-templates", label: "Challenge templates" },
  { id: "fortnite-challenge-hub-guide", label: "How challenge wheels work" },
  { id: "fortnite-challenge-hub-faq", label: "FAQ" },
] as const

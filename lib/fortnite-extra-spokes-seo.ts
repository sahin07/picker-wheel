import type { FortniteWheelSpokeFaq, FortniteWheelSpokeSeo } from "@/lib/fortnite-wheel-spoke-types"
import { FORTNITE_WHEEL_PATH } from "@/lib/fortnite-wheel-seo"
import {
  getFortniteWheelUseCase,
  type FortniteWheelUseCaseId,
} from "@/lib/fortnite-wheel-use-cases"

function extraBaseFaq(label: string): readonly FortniteWheelSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made Fortnite Picker Wheel template with preset entries so you can spin a fair random pick right away.`,
    },
    {
      question: "Can I edit the entries?",
      answer:
        "Yes. Add or remove options in the Inputs panel or Text tab. Your edits stay on this device in My Wheels if you keep the wheel.",
    },
    {
      question: "Is every spin fair?",
      answer:
        "Yes. When each entry appears once with equal weight, every option on the wheel has an equal chance.",
    },
    {
      question: "Where is the main Fortnite Picker Wheel?",
      answer: `Open the Fortnite Picker Wheel pillar at ${FORTNITE_WHEEL_PATH} for all templates, guides, and related tools.`,
    },
  ]
}

type ExtraSpokeDef = {
  id: FortniteWheelUseCaseId
  path: string
  pageTitle: string
  description: string
  h1: string
  shortTitle: string
  heroIntro: string
  keywords: string[]
  articleTitle: string
  articleIntro: readonly [string, string]
  uniqueTitle: string
  uniqueIntro: string
  points: readonly { title: string; description: string }[]
}

function buildExtraSpoke(
  def: ExtraSpokeDef,
  siblingIds: FortniteWheelUseCaseId[],
): FortniteWheelSpokeSeo {
  const useCase = getFortniteWheelUseCase(def.id)!
  return {
    id: def.id,
    path: def.path,
    pageTitle: def.pageTitle,
    description: def.description,
    h1: def.h1,
    shortTitle: def.shortTitle,
    heroIntro: def.heroIntro,
    keywords: def.keywords,
    articleTitle: def.articleTitle,
    articleIntro: def.articleIntro,
    uniqueSection: {
      title: def.uniqueTitle,
      intro: def.uniqueIntro,
      points: def.points,
    },
    faq: extraBaseFaq(def.h1),
    siblingIds,
    deepLink: { useCaseId: def.id, config: useCase.config },
  }
}

const EXTRA_DEFS: ExtraSpokeDef[] = [
  {
    id: "item-picker",
    path: "/fortnite-item-picker-wheel",
    pageTitle: "Fortnite Item Picker | Random Item & Loot Spinner",
    description:
      "Spin a Fortnite item picker for random guns, heals, shields, and loot. Fair item picks for challenges, streams, and custom games.",
    h1: "Fortnite Item Picker",
    shortTitle: "Item Picker",
    heroIntro:
      "Need a random Fortnite item? This template loads weapons, heals, utilities, and loot types so you can spin a fair item pick each round.",
    keywords: [
      "fortnite item picker",
      "random fortnite item",
      "fortnite loot picker",
      "fortnite item wheel",
    ],
    articleTitle: "How to Use a Fortnite Item Picker",
    articleIntro: [
      "A Fortnite item picker turns loot decisions into a visible spin—great when squads argue over what to grab or which heal rule to follow.",
      "This page is the same Fortnite Picker Wheel with item entries preloaded. Edit the list anytime in the sidebar.",
    ],
    uniqueTitle: "Item picker ideas",
    uniqueIntro: "Random items without host bias.",
    points: [
      { title: "Loot challenges", description: "Spin which heal or weapon type you must use." },
      { title: "Streamer rules", description: "Let chat watch a fair item lock-in live." },
      { title: "Custom lists", description: "Paste your own items one per line in the Text tab." },
    ],
  },
  {
    id: "decision-wheel",
    path: "/fortnite-decision-picker-wheel",
    pageTitle: "Fortnite Decision Picker Wheel | Random Tactical Calls",
    description:
      "Spin a Fortnite decision wheel for push, rotate, third-party, and squad calls. Fair tactical picks for ranked, creative, and stream games.",
    h1: "Fortnite Decision Picker Wheel",
    shortTitle: "Decision Picker Wheel",
    heroIntro:
      "Stuck on what to do next? Spin tactical decisions—push, rotate, box up, or regroup—so your squad commits to one fair call.",
    keywords: [
      "fortnite decision wheel",
      "fortnite game wheel",
      "fortnite choice wheel",
      "random fortnite decision",
    ],
    articleTitle: "Spin Tactical Fortnite Decisions",
    articleIntro: [
      "A Fortnite decision wheel ends analysis paralysis. Spin once and play the call—ideal for ranked duos, creative practice, and viewer games.",
      "This spoke opens the Fortnite Picker Wheel with tactical entries ready to spin. Customize decisions in the Text tab anytime.",
    ],
    uniqueTitle: "When to spin decisions",
    uniqueIntro: "Make calls everyone trusts.",
    points: [
      { title: "Ranked duos", description: "Rotate or fight? Let the wheel decide." },
      { title: "Viewer games", description: "Chat sees a fair tactical commitment." },
      { title: "Warm-up lobbies", description: "Random playstyles before arena." },
    ],
  },
]

export function getFortniteExtraSpokes(
  siblingIdsFor: (id: FortniteWheelUseCaseId) => FortniteWheelUseCaseId[],
): Record<"item-picker" | "decision-wheel", FortniteWheelSpokeSeo> {
  const out = {} as Record<"item-picker" | "decision-wheel", FortniteWheelSpokeSeo>
  for (const def of EXTRA_DEFS) {
    out[def.id] = buildExtraSpoke(def, siblingIdsFor(def.id))
  }
  return out
}

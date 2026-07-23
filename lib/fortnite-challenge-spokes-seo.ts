import type { FortniteWheelSpokeFaq, FortniteWheelSpokeSeo } from "@/lib/fortnite-wheel-spoke-types"
import { FORTNITE_WHEEL_PATH } from "@/lib/fortnite-wheel-seo"
import {
  getFortniteWheelUseCase,
  type FortniteWheelUseCaseId,
} from "@/lib/fortnite-wheel-use-cases"

function challengeBaseFaq(label: string): readonly FortniteWheelSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made Fortnite Picker Wheel template. It opens with preset entries so you can spin a fair random challenge right away.`,
    },
    {
      question: "Can I edit the wheel entries?",
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

type ChallengeSpokeDef = {
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

function buildChallengeSpoke(
  def: ChallengeSpokeDef,
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
    faq: challengeBaseFaq(def.h1),
    siblingIds,
    deepLink: { useCaseId: def.id, config: useCase.config },
  }
}

const CHALLENGE_DEFS: ChallengeSpokeDef[] = [
  {
    id: "weapon-wheel",
    path: "/fortnite-weapon-picker-wheel",
    pageTitle: "Fortnite Weapon Picker Wheel | Random Weapon Challenge Spinner",
    description:
      "Spin a Fortnite weapon wheel to pick a random gun challenge. AR, SMG, shotgun, sniper, and more—for solo matches, duos, and streams.",
    h1: "Fortnite Weapon Picker Wheel",
    shortTitle: "Weapon Picker Wheel",
    heroIntro:
      "Limit yourself to a random weapon each match. This template loads popular Fortnite gun types so you can spin a fair weapon challenge.",
    keywords: [
      "fortnite weapon wheel",
      "random fortnite weapon",
      "fortnite gun spinner",
      "fortnite weapon challenge",
    ],
    articleTitle: "How to Use a Fortnite Weapon Picker Wheel",
    articleIntro: [
      "A Fortnite weapon wheel adds variety when you are tired of the same loadout. Spin once and commit to whatever gun lands—great for practice and stream content.",
      "This page is the same Fortnite Picker Wheel with weapon entries preloaded. Edit the list anytime in the sidebar.",
    ],
    uniqueTitle: "Weapon challenge ideas",
    uniqueIntro: "Make every fight feel different.",
    points: [
      { title: "One-gun games", description: "Spin and use only that weapon class for the match." },
      { title: "Streamer rules", description: "Let chat watch a fair weapon lock-in live." },
      { title: "Squad sync", description: "Everyone spins the same weapon wheel before drop." },
    ],
  },
  {
    id: "landing-spot-wheel",
    path: "/fortnite-landing-spot-picker-wheel",
    pageTitle: "Fortnite Landing Spot Picker Wheel | Random Drop Location",
    description:
      "Spin a Fortnite landing spot wheel to pick a random drop location. POI names for Battle Royale, streams, and squad nights.",
    h1: "Fortnite Landing Spot Picker Wheel",
    shortTitle: "Landing Spot Picker Wheel",
    heroIntro:
      "Can't decide where to drop? Spin named POIs and land wherever the wheel lands—fair for squads and solo queues.",
    keywords: [
      "fortnite landing spot wheel",
      "random fortnite drop",
      "fortnite poi picker",
      "where to land fortnite",
    ],
    articleTitle: "Pick a Random Fortnite Landing Spot",
    articleIntro: [
      "Landing spot wheels end the ‘where we dropping?’ debate. One spin, one POI, no arguments.",
      "Use elimination mode to remove spots you already played until one location remains.",
    ],
    uniqueTitle: "Landing spot uses",
    uniqueIntro: "Drop variety without host bias.",
    points: [
      { title: "Squad drops", description: "Everyone agrees on one fair POI before the bus." },
      { title: "Streamer maps", description: "Spin live so viewers see the drop pick." },
      { title: "Map mastery", description: "Force visits to POIs you usually skip." },
    ],
  },
  {
    id: "loadout-wheel",
    path: "/fortnite-loadout-picker-wheel",
    pageTitle: "Fortnite Loadout Picker Wheel | Random Weapon Combo Picker",
    description:
      "Spin a Fortnite loadout wheel for random weapon combos and loadout rules. Great for challenges and custom games.",
    h1: "Fortnite Loadout Picker Wheel",
    shortTitle: "Loadout Picker Wheel",
    heroIntro:
      "Spin full loadout rules—not just one gun. AR plus shotgun, sniper stacks, heals-only runs, and more.",
    keywords: [
      "fortnite loadout wheel",
      "fortnite loadout generator",
      "random fortnite loadout",
      "fortnite loadout picker",
    ],
    articleTitle: "Random Fortnite Loadout Challenges",
    articleIntro: [
      "Loadout wheels pair weapons and constraints so challenges feel complete, not just ‘pick an AR.’",
      "Customize entries in the Text tab to match your season or house rules.",
    ],
    uniqueTitle: "Loadout spinner tips",
    uniqueIntro: "Combine guns and rules on one wheel.",
    points: [
      { title: "Competitive practice", description: "Train awkward weapon pairs on purpose." },
      { title: "Party nights", description: "Spin a silly combo everyone must run." },
      { title: "Custom lobbies", description: "Share the wheel link after saving in My Wheels." },
    ],
  },
  {
    id: "mythic-weapon-wheel",
    path: "/fortnite-mythic-weapon-picker-wheel",
    pageTitle: "Fortnite Mythic Weapon Picker Wheel | Random Mythic Gun Challenge",
    description:
      "Spin a Fortnite mythic weapon wheel for boss-loot style challenges. Mythic guns and gear for special modes and streams.",
    h1: "Fortnite Mythic Weapon Picker Wheel",
    shortTitle: "Mythic Weapon Picker Wheel",
    heroIntro:
      "Chase mythic-energy challenges even outside boss fights. Spin mythic weapon types for custom games and content.",
    keywords: [
      "fortnite mythic weapon wheel",
      "mythic gun fortnite",
      "fortnite mythic challenge",
      "random mythic weapon",
    ],
    articleTitle: "Spin Mythic Weapon Challenges",
    articleIntro: [
      "Mythic weapon wheels are for high-stakes custom rules—streamers love the flex factor.",
      "Not the same as Mythic skins: this template is about weapon challenges, not locker rarity.",
    ],
    uniqueTitle: "Mythic weapon moments",
    uniqueIntro: "High power, fair spin.",
    points: [
      { title: "Boss-fight roleplay", description: "Pretend the spun mythic is your only drop." },
      { title: "Zone wars", description: "Lock mythic rules for box fights." },
      { title: "Finale rounds", description: "Save mythic spins for the last game of the night." },
    ],
  },
  {
    id: "vehicle-wheel",
    path: "/fortnite-vehicle-picker-wheel",
    pageTitle: "Fortnite Vehicle Picker Wheel | Random Vehicle Challenge",
    description:
      "Spin a Fortnite vehicle wheel for cars, boats, choppers, tanks, and movement challenges. Fun for custom games.",
    h1: "Fortnite Vehicle Picker Wheel",
    shortTitle: "Vehicle Picker Wheel",
    heroIntro:
      "Randomize how you rotate—car only, boat drop, choppa rules, or walk-only challenges.",
    keywords: [
      "fortnite vehicle wheel",
      "random fortnite vehicle",
      "fortnite car challenge",
      "fortnite movement wheel",
    ],
    articleTitle: "Random Fortnite Vehicle Challenges",
    articleIntro: [
      "Vehicle wheels shake up rotation rules when everyone defaults to driving the same car.",
      "Add your own vehicles or limits in the Inputs panel.",
    ],
    uniqueTitle: "Vehicle challenge ideas",
    uniqueIntro: "Movement rules made fair.",
    points: [
      { title: "Rotation only", description: "Spin a vehicle type for how you travel zone to zone." },
      { title: "No vehicles", description: "Include walk-only as a slice for hardcore runs." },
      { title: "Custom lobbies", description: "Great for creative and party modes." },
    ],
  },
  {
    id: "duo-challenge",
    path: "/fortnite-duo-challenge-picker-wheel",
    pageTitle: "Fortnite Duo Challenge Picker Wheel | Random Duo House Rules",
    description:
      "Spin a Fortnite duo challenge wheel for partner house rules—shared loadouts, pistol only, emote challenges, and more.",
    h1: "Fortnite Duo Challenge Picker Wheel",
    shortTitle: "Duo Challenge Picker Wheel",
    heroIntro:
      "Running duos with a friend? Spin fair house rules so neither of you picks the easy challenge.",
    keywords: [
      "fortnite duo challenge",
      "fortnite duo wheel",
      "duo challenge generator",
      "fortnite 2 player challenge",
    ],
    articleTitle: "Duo Challenge Wheel Ideas",
    articleIntro: [
      "Duo wheels work best when both players see the spin live—no ‘I picked the easy one’ drama.",
      "Stack with weapon or landing wheels for layered challenges.",
    ],
    uniqueTitle: "Duo night formats",
    uniqueIntro: "Two players, one fair rule.",
    points: [
      { title: "Date-night gaming", description: "Light rules for casual duos." },
      { title: "Arena warmup", description: "Harsh rules before ranked." },
      { title: "Content bangers", description: "Clip-worthy constraints every spin." },
    ],
  },
  {
    id: "squad-challenge",
    path: "/fortnite-squad-challenge-picker-wheel",
    pageTitle: "Fortnite Squad Challenge Picker Wheel | Team House Rules",
    description:
      "Spin a Fortnite squad challenge wheel for team rules—one POI, grey loot, no reboot, random roles, and more.",
    h1: "Fortnite Squad Challenge Picker Wheel",
    shortTitle: "Squad Challenge Picker Wheel",
    heroIntro:
      "Four-stack nights need fair rules. Spin squad challenges everyone follows before the first drop.",
    keywords: [
      "fortnite squad challenge",
      "fortnite squad wheel",
      "squad challenge generator",
      "fortnite team challenge",
    ],
    articleTitle: "Squad Challenge Wheel Guide",
    articleIntro: [
      "Squad wheels settle ‘what are we doing tonight?’ in one spin.",
      "Use elimination to remove rules you already played this session.",
    ],
    uniqueTitle: "Squad formats",
    uniqueIntro: "Team rules without arguments.",
    points: [
      { title: "Fill squad nights", description: "Random roles for IGL, fragger, support." },
      { title: "Tournament prep", description: "Practice under weird constraints together." },
      { title: "Viewer games", description: "Stream the spin so chat trusts the rule." },
    ],
  },
  {
    id: "emote-wheel",
    path: "/fortnite-emote-picker-wheel",
    pageTitle: "Fortnite Emote Picker Wheel | Random Emote Challenge",
    description:
      "Spin a Fortnite emote wheel for random dance challenges, kill celebrations, and stream party games.",
    h1: "Fortnite Emote Picker Wheel",
    shortTitle: "Emote Picker Wheel",
    heroIntro:
      "Emote wheels are pure fun—spin a dance for every elim, win celebration, or lobby warm-up.",
    keywords: [
      "fortnite emote wheel",
      "random fortnite emote",
      "fortnite dance spinner",
      "emote challenge fortnite",
    ],
    articleTitle: "Fortnite Emote Challenge Picker Wheel",
    articleIntro: [
      "Emote challenges are low stakes and high entertainment—perfect for streams and kids’ parties.",
      "Add your favorite emotes in the Text tab.",
    ],
    uniqueTitle: "Emote spin ideas",
    uniqueIntro: "Dance picks without bias.",
    points: [
      { title: "Kill celebrations", description: "Spin after every elimination." },
      { title: "Lobby filler", description: "Warm up while matchmaking." },
      { title: "Party squads", description: "Everyone runs the same emote on win." },
    ],
  },
  {
    id: "loot-challenge",
    path: "/fortnite-loot-challenge-picker-wheel",
    pageTitle: "Fortnite Loot Challenge Picker Wheel | Random Loot Rules",
    description:
      "Spin a Fortnite loot challenge wheel—first chest only, floor loot, legendary hunts, one ammo type, and more.",
    h1: "Fortnite Loot Challenge Picker Wheel",
    shortTitle: "Loot Challenge Picker Wheel",
    heroIntro:
      "Loot rules make Battle Royale fresh. Spin constraints like chest-only, fish loot, or gold weapon goals.",
    keywords: [
      "fortnite loot challenge",
      "fortnite loot wheel",
      "loot challenge generator",
      "fortnite chest challenge",
    ],
    articleTitle: "Loot Challenge Wheel Guide",
    articleIntro: [
      "Loot wheels are classic Fortnite content—viewers love watching strict chest rules.",
      "Pair with landing spot wheels for a full drop-to-loot challenge.",
    ],
    uniqueTitle: "Loot rule favorites",
    uniqueIntro: "Chest rules made fair.",
    points: [
      { title: "Speedruns", description: "First chest only keeps games fast." },
      { title: "Hardcore", description: "Floor loot or grey-start rules." },
      { title: "Seasonal", description: "Edit entries when new loot types drop." },
    ],
  },
]

export function getFortniteChallengeSpokes(
  siblingIdsFor: (id: FortniteWheelUseCaseId) => FortniteWheelUseCaseId[],
): Record<
  | "weapon-wheel"
  | "landing-spot-wheel"
  | "loadout-wheel"
  | "mythic-weapon-wheel"
  | "vehicle-wheel"
  | "duo-challenge"
  | "squad-challenge"
  | "emote-wheel"
  | "loot-challenge",
  FortniteWheelSpokeSeo
> {
  const out = {} as Record<FortniteWheelUseCaseId, FortniteWheelSpokeSeo>
  for (const def of CHALLENGE_DEFS) {
    out[def.id] = buildChallengeSpoke(def, siblingIdsFor(def.id))
  }
  return out as ReturnType<typeof getFortniteChallengeSpokes>
}

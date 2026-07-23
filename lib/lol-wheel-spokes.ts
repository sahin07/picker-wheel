import { LOL_WHEEL_PATH, LOL_WHEEL_SITE_URL } from "@/lib/lol-wheel-seo"
import {
  LOL_WHEEL_USE_CASES,
  type LolWheelUseCaseConfig,
  type LolWheelUseCaseId,
} from "@/lib/lol-wheel-use-cases"

export type LolWheelSpokeId = LolWheelUseCaseId

export type LolWheelDeepLink = {
  useCaseId: LolWheelUseCaseId
  config: LolWheelUseCaseConfig
}

export type LolWheelSpokeFaq = {
  question: string
  answer: string
}

export type LolWheelSpokeSeo = {
  id: LolWheelSpokeId
  path: string
  pageTitle: string
  description: string
  h1: string
  shortTitle: string
  heroIntro: string
  keywords: readonly string[]
  articleTitle: string
  articleIntro: readonly string[]
  uniqueSection: {
    title: string
    intro: string
    points: readonly { title: string; description: string }[]
  }
  faq: readonly LolWheelSpokeFaq[]
  siblingIds: readonly LolWheelSpokeId[]
  deepLink: LolWheelDeepLink
}

export function lolSpokeUrl(path: string): string {
  return `${LOL_WHEEL_SITE_URL}${path}`
}

const ALL_IDS: LolWheelSpokeId[] = LOL_WHEEL_USE_CASES.map((u) => u.id)

function siblingsExcept(id: LolWheelSpokeId): LolWheelSpokeId[] {
  return ALL_IDS.filter((s) => s !== id)
}

function configFor(id: LolWheelUseCaseId): LolWheelUseCaseConfig {
  const found = LOL_WHEEL_USE_CASES.find((u) => u.id === id)
  if (!found) throw new Error(`Missing LoL use case: ${id}`)
  return found.config
}

function baseFaq(label: string): readonly LolWheelSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made LoL Picker Wheel template. It opens with a matching champion set so you can spin a fair random pick right away.`,
    },
    {
      question: "Can I change the champions after opening this page?",
      answer:
        "Yes. Add or remove entries in the Champions panel. Your edits stay on this device in My Wheels if you keep the wheel.",
    },
    {
      question: "Is the pick random?",
      answer:
        "Yes. When each champion appears once with equal weight, every entry on the wheel has an equal chance.",
    },
    {
      question: "Where is the main LoL Picker Wheel?",
      answer: `Open the LoL Picker Wheel pillar at ${LOL_WHEEL_PATH} for all templates, guides, and related tools.`,
    },
  ]
}

type SpokeDraft = Omit<LolWheelSpokeSeo, "siblingIds" | "deepLink" | "faq"> & {
  faqLabel?: string
  faq?: readonly LolWheelSpokeFaq[]
}

function finalize(draft: SpokeDraft): LolWheelSpokeSeo {
  const { faqLabel, faq, ...rest } = draft
  return {
    ...rest,
    faq: faq ?? baseFaq(faqLabel || draft.h1),
    siblingIds: siblingsExcept(draft.id),
    deepLink: { useCaseId: draft.id, config: configFor(draft.id) },
  }
}

const ROLE_COPY: Record<
  "top" | "jungle" | "mid" | "adc" | "support",
  {
    path: string
    label: string
    pageTitle: string
    description: string
    heroIntro: string
    articleTitle: string
    articleIntro: readonly string[]
    uniqueSection: LolWheelSpokeSeo["uniqueSection"]
    keywords: readonly string[]
    faq?: readonly LolWheelSpokeFaq[]
  }
> = {
  top: {
    path: "/lol-top-lane-picker-wheel",
    label: "Top Lane",
    pageTitle: "Top Lane Picker Wheel | Random LoL Top Lane Champion Spinner",
    description:
      "Spin a random top lane champion for solo-lane challenges, island 1v1 drafts, and streamer top-only nights.",
    heroIntro:
      "Load top lane champions only and spin a fair pick for solo-lane challenges, teleport timings, and top-side drafts.",
    keywords: [
      "lol top lane wheel",
      "random top champion",
      "top lane champion spinner",
      "solo lane randomizer",
    ],
    articleTitle: "Why Spin Top Lane Only?",
    articleIntro: [
      "Top Lane templates keep jungle, mid, and bot champions off the wheel when your queue or challenge is island-locked. You get a curated solo-lane pool with equal odds on every spin.",
      "Use Elimination Mode for multi-round top drafts, or deselect champions you refuse before locking in. The same LoL Picker Wheel tools—Results, mute, fullscreen—work exactly like the main pillar.",
    ],
    uniqueSection: {
      title: "Built for Top Lane",
      intro: "Use this template when only top lane champions count.",
      points: [
        {
          title: "Island challenges",
          description:
            "Commit to a random top laner before first wave—no mid-pool escapes.",
        },
        {
          title: "Teleport & split drafts",
          description:
            "Spin fair picks for teleport-focused or split-push challenge nights.",
        },
        {
          title: "Streamer segments",
          description: "Let chat watch a lane-locked top spin land live.",
        },
      ],
    },
    faq: [
      {
        question: "What is a Top Lane Wheel?",
        answer:
          "A Top Lane Wheel is a LoL Picker Wheel template preloaded with curated top laners so you can spin a fair solo-lane pick without other roles on the wheel.",
      },
      {
        question: "Can I remove specific top laners?",
        answer:
          "Yes. Deselect champions in Inputs or use Elimination after each spin for multi-round top drafts.",
      },
      {
        question: "Is the pick random?",
        answer:
          "Yes. Each enabled top champion has an equal chance when it appears once on the wheel.",
      },
      {
        question: "Where is the main LoL Picker Wheel?",
        answer: `Open ${LOL_WHEEL_PATH} for every role, playstyle, and specialty template.`,
      },
    ],
  },
  jungle: {
    path: "/lol-jungle-picker-wheel",
    label: "Jungle",
    pageTitle: "Jungle Picker Wheel | Random LoL Jungle Champion Spinner",
    description:
      "Spin a random jungle champion for pathing challenges, gank-focused nights, and jungle-only drafts.",
    heroIntro:
      "Load jungle champions only and spin a fair pick for pathing drills, objective races, and jungle challenge queues.",
    keywords: [
      "lol jungle wheel",
      "random jungle champion",
      "jungle champion spinner",
      "jg randomizer",
    ],
    articleTitle: "Why Spin Jungle Only?",
    articleIntro: [
      "Jungle templates keep laners off the wheel when your challenge is pathing- or objective-locked. The curated jungler set keeps spins readable for drafts and streams.",
      "Pair Elimination with multi-round “random jungle” nights so each pick stays unique. Same spinner UX as the main LoL Picker Wheel—just this role’s pool.",
    ],
    uniqueSection: {
      title: "Built for Jungle",
      intro: "Use this template when only jungle champions count.",
      points: [
        {
          title: "Pathing challenges",
          description: "Spin a random jungler before your first clear.",
        },
        {
          title: "Objective nights",
          description:
            "Fair picks for dragon- or Baron-focused challenge queues.",
        },
        {
          title: "Fill without bias",
          description: "When you autofill jungle, spin so the lobby sees a fair lock.",
        },
      ],
    },
  },
  mid: {
    path: "/lol-mid-picker-wheel",
    label: "Mid Lane",
    pageTitle: "Mid Lane Picker Wheel | Random LoL Mid Champion Spinner",
    description:
      "Spin a random mid lane champion for roam nights, skirmish challenges, and mid-only drafts.",
    heroIntro:
      "Load mid lane champions only and spin a fair pick for roam timers, river fights, and mid-lane challenge nights.",
    keywords: [
      "lol mid wheel",
      "random mid champion",
      "mid lane champion spinner",
      "midlaner randomizer",
    ],
    articleTitle: "Why Spin Mid Lane Only?",
    articleIntro: [
      "Mid Lane templates keep top, jungle, and bot off the wheel when your queue or challenge is mid-locked. Spin for roam-heavy nights or skirmish practice without diluting the pool.",
      "Use display modes for stream readability and Results history to recap multi-round mid drafts.",
    ],
    uniqueSection: {
      title: "Built for Mid Lane",
      intro: "Use this template when only mid lane champions count.",
      points: [
        {
          title: "Roam challenges",
          description: "Commit to a mid pick before first roam window.",
        },
        {
          title: "Skirmish nights",
          description: "Fair mid spins for river-fight practice lobbies.",
        },
        {
          title: "Streamer mid-only",
          description: "Clean mid-locked segments for chat.",
        },
      ],
    },
  },
  adc: {
    path: "/lol-adc-picker-wheel",
    label: "ADC",
    pageTitle: "ADC Picker Wheel | Random LoL ADC / Bot Lane Champion Spinner",
    description:
      "Spin a random ADC champion for duo queue, bot-lane drafts, and marksman challenge nights.",
    heroIntro:
      "Load bot-lane marksmen only and spin a fair ADC pick for duo queue, lane swaps, and bot-lane challenge nights.",
    keywords: [
      "lol adc wheel",
      "random adc champion",
      "bot lane spinner",
      "marksman champion picker",
    ],
    articleTitle: "Why Spin ADC Only?",
    articleIntro: [
      "ADC templates keep supports and other lanes off the wheel so duo queue and bot-lane challenges stay marksman-focused. Equal odds keep duo drafts transparent.",
      "Pair with the Support Wheel for back-to-back bot lane spins, or use Elimination when each duo needs a unique ADC.",
    ],
    uniqueSection: {
      title: "Built for ADC / Bot Lane",
      intro: "Use this template when only ADC champions count.",
      points: [
        {
          title: "Duo queue drafts",
          description: "Spin a fair marksman before support locks.",
        },
        {
          title: "Bot-lane challenges",
          description: "Commit to a random ADC for the whole session.",
        },
        {
          title: "Streamer duo bits",
          description: "Let chat watch the ADC spin before Support.",
        },
      ],
    },
    faq: [
      {
        question: "What is an ADC Wheel?",
        answer:
          "An ADC Wheel is a LoL Picker Wheel template with curated bot-lane marksmen so you can spin a fair ADC without supports or other roles on the wheel.",
      },
      {
        question: "Can I pair this with Support?",
        answer:
          "Yes. Open the Support Wheel after your ADC spin, or use Elimination on each page for multi-round duo drafts.",
      },
      {
        question: "Is the pick random?",
        answer:
          "Yes. Each enabled ADC has an equal chance when it appears once.",
      },
      {
        question: "Where is the main LoL Picker Wheel?",
        answer: `Open ${LOL_WHEEL_PATH} for all roles and playstyle templates.`,
      },
    ],
  },
  support: {
    path: "/lol-support-picker-wheel",
    label: "Support",
    pageTitle: "Support Picker Wheel | Random LoL Support Champion Spinner",
    description:
      "Spin a random support champion for vision challenges, peel drafts, and duo-queue support nights.",
    heroIntro:
      "Load supports only and spin a fair pick for vision contests, peel challenges, and duo-queue support locks.",
    keywords: [
      "lol support wheel",
      "random support champion",
      "support champion spinner",
      "sup randomizer",
    ],
    articleTitle: "Why Spin Support Only?",
    articleIntro: [
      "Support templates keep damage carries off the wheel when your challenge is vision-, engage-, or peel-locked. Curated supports keep duo drafts focused.",
      "Use Elimination for multi-round support picks, or deselect engage vs enchanter styles before you spin.",
    ],
    uniqueSection: {
      title: "Built for Support",
      intro: "Use this template when only support champions count.",
      points: [
        {
          title: "Vision challenges",
          description: "Spin a support before a ward-contest night.",
        },
        {
          title: "Duo fairness",
          description: "Transparent support locks after the ADC spin.",
        },
        {
          title: "Peel & engage nights",
          description: "Keep the pool support-only for themed queues.",
        },
      ],
    },
  },
}

const PLAYSTYLE_COPY: Record<
  "assassin" | "mage" | "marksman" | "tank" | "fighter",
  {
    path: string
    label: string
    articleIntro: readonly string[]
    uniqueSection: LolWheelSpokeSeo["uniqueSection"]
    keywords: readonly string[]
  }
> = {
  assassin: {
    path: "/lol-assassin-picker-wheel",
    label: "Assassin",
    keywords: [
      "lol assassin wheel",
      "random assassin champion",
      "assassin champion spinner",
    ],
    articleIntro: [
      "Assassin templates keep tanks, mages, and other classes off the wheel when your challenge is burst- and pick-oriented. Spins stay readable for themed weeks and streams.",
      "Use Elimination across rounds so each assassin pick is unique. Same LoL Picker Wheel controls as the pillar—just this playstyle’s curated set.",
    ],
    uniqueSection: {
      title: "Built for Assassin challenges",
      intro: "Use this template when only assassin playstyle champions count.",
      points: [
        {
          title: "Assassin-only weeks",
          description: "Commit to burst picks without tanks diluting the pool.",
        },
        {
          title: "Pick-comp practice",
          description: "Spin fair assassins for roam and solo-kill drills.",
        },
        {
          title: "Content hooks",
          description: "A focused assassin set spins cleanly on stream.",
        },
      ],
    },
  },
  mage: {
    path: "/lol-mage-picker-wheel",
    label: "Mage",
    keywords: [
      "lol mage wheel",
      "random mage champion",
      "mage champion spinner",
    ],
    articleIntro: [
      "Mage templates lock the wheel to mage playstyle champions for poke, control, and artillery-themed nights—without assassins or tanks crowding the slices.",
      "Great for learning wave clear and teamfight patterns with a fair random mage each game.",
    ],
    uniqueSection: {
      title: "Built for Mage challenges",
      intro: "Use this template when only mage playstyle champions count.",
      points: [
        {
          title: "Mage-only queues",
          description: "Spin a control or burst mage before you lock.",
        },
        {
          title: "Learning pools",
          description: "Practice one class fantasy without mixed roles.",
        },
        {
          title: "Draft seeds",
          description: "Fair mage picks for party mage nights.",
        },
      ],
    },
  },
  marksman: {
    path: "/lol-marksman-picker-wheel",
    label: "Marksman",
    keywords: [
      "lol marksman wheel",
      "random marksman champion",
      "marksman champion spinner",
    ],
    articleIntro: [
      "Marksman playstyle templates focus ranged carries across the curated set—useful when your challenge is DPS-locked but not strictly bot-lane ADC only.",
      "Pair with Elimination for multi-round marksman drafts, or open the ADC Wheel when you need lane-locked bot only.",
    ],
    uniqueSection: {
      title: "Built for Marksman challenges",
      intro: "Use this template when only marksman playstyle champions count.",
      points: [
        {
          title: "DPS challenge nights",
          description: "Spin marksmen without tanks diluting the wheel.",
        },
        {
          title: "Cross-lane marksmen",
          description: "Playstyle pool beyond a single bot-lane filter.",
        },
        {
          title: "Stream titles",
          description: "Clean marksman-only segments for chat.",
        },
      ],
    },
  },
  tank: {
    path: "/lol-tank-picker-wheel",
    label: "Tank",
    keywords: [
      "lol tank wheel",
      "random tank champion",
      "tank champion spinner",
    ],
    articleIntro: [
      "Tank templates keep assassins and glass cannons off the wheel when your challenge is engage-, peel-, or frontline-locked.",
      "Spin for tank-only weeks, teaching sessions on peeling, or party drafts that need a fair frontliner.",
    ],
    uniqueSection: {
      title: "Built for Tank challenges",
      intro: "Use this template when only tank playstyle champions count.",
      points: [
        {
          title: "Frontline weeks",
          description: "Commit to a tank without damage carries on the wheel.",
        },
        {
          title: "Peel practice",
          description: "Fair tanks for peel and engage drills.",
        },
        {
          title: "Party frontliners",
          description: "Transparent tank picks for group drafts.",
        },
      ],
    },
  },
  fighter: {
    path: "/lol-fighter-picker-wheel",
    label: "Fighter",
    keywords: [
      "lol fighter wheel",
      "random fighter champion",
      "bruiser champion spinner",
    ],
    articleIntro: [
      "Fighter (bruiser) templates lock the wheel to fighter playstyle champions for skirmish- and duel-heavy challenge nights.",
      "Use when you want bruiser fantasy without pure tanks or assassins filling every slice.",
    ],
    uniqueSection: {
      title: "Built for Fighter challenges",
      intro: "Use this template when only fighter playstyle champions count.",
      points: [
        {
          title: "Bruiser nights",
          description: "Spin fighters for duel-focused queues.",
        },
        {
          title: "Skirmish practice",
          description: "Fair fighter picks for side-lane drills.",
        },
        {
          title: "Themed drafts",
          description: "Keep the pool fighter-only for party fun.",
        },
      ],
    },
  },
}

function roleSpoke(
  id: Extract<LolWheelSpokeId, "top" | "jungle" | "mid" | "adc" | "support">,
): LolWheelSpokeSeo {
  const c = ROLE_COPY[id]
  return finalize({
    id,
    path: c.path,
    pageTitle: c.pageTitle,
    description: c.description,
    h1: `${c.label} Picker Wheel`,
    shortTitle: c.label,
    heroIntro: c.heroIntro,
    keywords: c.keywords,
    articleTitle: c.articleTitle,
    articleIntro: c.articleIntro,
    uniqueSection: c.uniqueSection,
    faq: c.faq,
  })
}

function playStyleSpoke(
  id: Extract<LolWheelSpokeId, "assassin" | "mage" | "marksman" | "tank" | "fighter">,
): LolWheelSpokeSeo {
  const c = PLAYSTYLE_COPY[id]
  return finalize({
    id,
    path: c.path,
    pageTitle: `${c.label} Picker Wheel | Random LoL ${c.label} Champions`,
    description: `Spin a random ${c.label.toLowerCase()} playstyle champion on a fair LoL Picker Wheel for challenges, drafts, and streams.`,
    h1: `${c.label} Picker Wheel`,
    shortTitle: c.label,
    heroIntro: `Load ${c.label.toLowerCase()} playstyle champions only and spin a fair pick for themed challenges and party nights.`,
    keywords: c.keywords,
    articleTitle: `Why Spin ${c.label} Champions?`,
    articleIntro: c.articleIntro,
    uniqueSection: c.uniqueSection,
  })
}

function regionSpoke(
  id: Extract<
    LolWheelSpokeId,
    "demacia" | "noxus" | "ionia" | "shadow-isles" | "piltover"
  >,
  path: string,
  region: string,
  blurb: string,
  points: readonly { title: string; description: string }[],
): LolWheelSpokeSeo {
  return finalize({
    id,
    path,
    pageTitle: `${region} Picker Wheel | Random LoL ${region} Champions`,
    description: `Spin a random ${region} champion. ${blurb}`,
    h1: `${region} Picker Wheel`,
    shortTitle: region,
    heroIntro: `Load ${region} champions only and spin a fair lore-region pick for ${blurb.toLowerCase()}`,
    keywords: [
      `lol ${region.toLowerCase()} wheel`,
      `random ${region.toLowerCase()} champion`,
      `${region.toLowerCase()} champion spinner`,
      `league ${region.toLowerCase()} randomizer`,
    ],
    articleTitle: `Why Spin ${region} Champions?`,
    articleIntro: [
      `${region} templates keep other Runeterra regions off the wheel when your challenge or stream is lore-locked. The curated set keeps spins readable for themed nights.`,
      "Same LoL Picker Wheel tools—elimination, Results, mute, and fullscreen—just this region’s champions ready to spin.",
    ],
    uniqueSection: {
      title: `Built for ${region}`,
      intro: `Use this template when only ${region} champions count.`,
      points,
    },
  })
}

export const LOL_WHEEL_SPOKES: Record<LolWheelSpokeId, LolWheelSpokeSeo> = {
  all: finalize({
    id: "all",
    path: "/random-lol-champion-picker-wheel",
    pageTitle: "Random LoL Champion | League Champion Generator Free",
    description:
      "Free random LoL champion generator. Spin a curated League of Legends champion wheel for ranked, challenges, streams, and fun.",
    h1: "Random LoL Champion",
    shortTitle: "Random LoL Champion",
    heroIntro:
      "Need any champion at random? This page loads the curated roster so you can spin a fair pick for ranked, challenges, and streams.",
    keywords: [
      "random lol champion",
      "lol champion generator",
      "league champion spinner",
      "random league champion",
    ],
    articleTitle: "How to Pick a Random LoL Champion",
    articleIntro: [
      "A random LoL champion generator is the fastest way to choose without lobby bias. Spin once for a full-roster pick, or use Elimination for multi-round drafts where each champion can only win once.",
      "This page is a focused LoL Picker Wheel template—same spinner and Results history, preloaded with the curated catalog across all five roles.",
    ],
    uniqueSection: {
      title: "Best for full-roster spins",
      intro: "Use the curated set whenever any listed champion is fair game.",
      points: [
        {
          title: "Fill challenges",
          description: "Spin when you truly don’t care who you play.",
        },
        {
          title: "Streamer bits",
          description: "Let viewers watch any-champion spins land live.",
        },
        {
          title: "Party fairness",
          description: "Everyone sees the spin—no host favorites.",
        },
      ],
    },
    faq: [
      {
        question: "What is a Random LoL Champion spinner?",
        answer:
          "It is the full curated LoL Picker Wheel catalog on one page—spin any listed champion with equal odds for ranked fills, challenges, and streams.",
      },
      {
        question: "Can I still filter by role?",
        answer:
          "Yes. Use Inputs role filters after load, or open a role-specific template like Top Lane or ADC Wheel.",
      },
      {
        question: "Is the pick random?",
        answer:
          "Yes. Each enabled champion has an equal chance when it appears once.",
      },
      {
        question: "Where is the main LoL Picker Wheel guide?",
        answer: `Open ${LOL_WHEEL_PATH} for guides, FAQs, and every related template.`,
      },
    ],
  }),
  top: roleSpoke("top"),
  jungle: roleSpoke("jungle"),
  mid: roleSpoke("mid"),
  adc: roleSpoke("adc"),
  support: roleSpoke("support"),
  assassin: playStyleSpoke("assassin"),
  mage: playStyleSpoke("mage"),
  marksman: playStyleSpoke("marksman"),
  tank: playStyleSpoke("tank"),
  fighter: playStyleSpoke("fighter"),
  beginner: finalize({
    id: "beginner",
    path: "/lol-beginner-champion-picker-wheel",
    pageTitle: "Beginner LoL Champions Picker Wheel | Easy Champion Spinner",
    description:
      "Spin easy-difficulty League champions. A beginner-friendly LoL Picker Wheel for new players, teaching sessions, and warmups.",
    h1: "Beginner Champions Picker Wheel",
    shortTitle: "Beginner Champions",
    heroIntro:
      "Load easy-difficulty champions only and spin a fair beginner pick for learning, warmups, and teaching nights.",
    keywords: [
      "beginner lol champions",
      "easy league champions wheel",
      "lol beginner spinner",
      "simple champions randomizer",
    ],
    articleTitle: "Spin Among Beginner Champions",
    articleIntro: [
      "The beginner template filters the curated catalog to easy-difficulty champions so new players and coaches can spin without hard or expert picks on the wheel.",
      "Use it for warmups before ranked, classroom esports icebreakers, or low-pressure party queues. Result cards still show role and playstyle for teaching context.",
    ],
    uniqueSection: {
      title: "Built for new players",
      intro: "Only easy-difficulty champions appear on this wheel.",
      points: [
        {
          title: "Teaching sessions",
          description: "Assign a simple champ fairly before a lesson game.",
        },
        {
          title: "Warmups",
          description: "Spin an easy pick before climbing into ranked.",
        },
        {
          title: "Stress-free fun",
          description: "Keep the pool approachable for friends new to League.",
        },
      ],
    },
    faq: [
      {
        question: "What is a Beginner Champions Wheel?",
        answer:
          "It is a LoL Picker Wheel template limited to easy-difficulty champions from the curated set—ideal for learners and warmups.",
      },
      {
        question: "Are these official beginner recommendations?",
        answer:
          "No. Difficulty tags are reference trivia for this fan tool, not live Riot guidance.",
      },
      {
        question: "Can I add harder champions later?",
        answer:
          "Yes. Switch to the main LoL Picker Wheel or another template, or add custom names in Manual mode.",
      },
      {
        question: "Where is the main LoL Picker Wheel?",
        answer: `Open ${LOL_WHEEL_PATH} for all templates and guides.`,
      },
    ],
  }),
  "s-tier": finalize({
    id: "s-tier",
    path: "/lol-s-tier-champion-picker-wheel",
    pageTitle: "S-Tier LoL Champions Picker Wheel | Meta Champion Spinner",
    description:
      "Spin S-tier curated League champions. A meta-flavored LoL Picker Wheel for challenge vibes, streams, and party drafts.",
    h1: "S-Tier Champions Picker Wheel",
    shortTitle: "S-Tier Champions",
    heroIntro:
      "Load S-tier curated champions and spin a fair meta-flavored pick for challenges, streams, and drafts.",
    keywords: [
      "s tier lol champions",
      "meta champion wheel",
      "lol s tier spinner",
      "popular champions randomizer",
    ],
    articleTitle: "Spin Among S-Tier Champions",
    articleIntro: [
      "The S-tier template focuses high-popularity curated champions for meta-flavored challenge energy—not a live patch tier list API.",
      "Use it for stream titles, party drafts, and “spin a strong pick” nights. Always treat tiers as entertainment context, not competitive advice.",
    ],
    uniqueSection: {
      title: "Built for meta vibes",
      intro: "Only S-tier curated champions appear on this wheel.",
      points: [
        {
          title: "Challenge energy",
          description: "Spin a high-profile pick for the next game.",
        },
        {
          title: "Stream titles",
          description: "S-tier names make clean segment hooks.",
        },
        {
          title: "Party drafts",
          description: "Keep the shortlist exciting for groups.",
        },
      ],
    },
  }),
  favorites: finalize({
    id: "favorites",
    path: "/lol-favorite-champions-picker-wheel",
    pageTitle: "Favorite LoL Champions Picker Wheel | Community Picks Spinner",
    description:
      "Spin community-favorite League champions. A LoL Picker Wheel for polls, streams, and party votes.",
    h1: "Favorite Champions Picker Wheel",
    shortTitle: "Favorite Champions",
    heroIntro:
      "Load community-favorite champions and spin a fair poll-style pick for streams, Discord nights, and parties.",
    keywords: [
      "favorite lol champions",
      "lol community favorites wheel",
      "popular league champion spinner",
      "fan favorite champion picker",
    ],
    articleTitle: "Spin Among Fan Favorites",
    articleIntro: [
      "This template focuses communityFavorite champions from the curated catalog—recognizable names for polls and party votes.",
      "Perfect for “who should I one-trick next?” segments, Discord nights, and streamer audience bits where familiarity matters as much as fairness.",
    ],
    uniqueSection: {
      title: "Built for community polls",
      intro: "Only community-favorite champions appear on this wheel.",
      points: [
        {
          title: "Stream polls",
          description: "Let chat watch a favorite champ land live.",
        },
        {
          title: "Discord nights",
          description: "Settle favorite-champ debates fairly.",
        },
        {
          title: "Party games",
          description: "Keep recognizable names on every slice.",
        },
      ],
    },
  }),
  demacia: regionSpoke(
    "demacia",
    "/lol-demacia-picker-wheel",
    "Demacia",
    "Lore nights, honor-themed challenges, and Demacia-only drafts.",
    [
      {
        title: "Lore challenges",
        description: "Commit to a Demacian champion for the whole session.",
      },
      {
        title: "Honor themes",
        description: "Fair Demacia picks for story-driven streams.",
      },
      {
        title: "Region drafts",
        description: "Keep other nations off the wheel entirely.",
      },
    ],
  ),
  noxus: regionSpoke(
    "noxus",
    "/lol-noxus-picker-wheel",
    "Noxus",
    "Conquest-themed challenges, Noxus-only nights, and lore drafts.",
    [
      {
        title: "Conquest nights",
        description: "Spin a Noxian pick before you queue.",
      },
      {
        title: "Lore streams",
        description: "Region-locked spins for story segments.",
      },
      {
        title: "Party drafts",
        description: "Transparent Noxus-only picks for groups.",
      },
    ],
  ),
  ionia: regionSpoke(
    "ionia",
    "/lol-ionia-picker-wheel",
    "Ionia",
    "Spirit-realm themes, Ionia-only challenges, and lore drafts.",
    [
      {
        title: "Spirit themes",
        description: "Spin Ionian champions for lore-locked queues.",
      },
      {
        title: "Balance fantasy",
        description: "Keep the pool Ionia-only for themed nights.",
      },
      {
        title: "Streamer bits",
        description: "Clean region spins for chat.",
      },
    ],
  ),
  "shadow-isles": regionSpoke(
    "shadow-isles",
    "/lol-shadow-isles-picker-wheel",
    "Shadow Isles",
    "Dark lore challenges, Shadow Isles-only nights, and spooky drafts.",
    [
      {
        title: "Dark themes",
        description: "Spin Isles champions for horror-flavored nights.",
      },
      {
        title: "Lore locks",
        description: "Keep other regions off the wheel.",
      },
      {
        title: "Content hooks",
        description: "A focused Isles set spins cleanly on stream.",
      },
    ],
  ),
  piltover: regionSpoke(
    "piltover",
    "/lol-piltover-picker-wheel",
    "Piltover",
    "Progress-themed challenges, Piltover-only drafts, and lore nights.",
    [
      {
        title: "Progress themes",
        description: "Spin Piltover champions for city-of-progress nights.",
      },
      {
        title: "Lore drafts",
        description: "Region-locked fairness for party spins.",
      },
      {
        title: "Streamer segments",
        description: "Let chat watch a Piltover pick land live.",
      },
    ],
  ),
  "a-tier": finalize({
    id: "a-tier",
    path: "/lol-a-tier-champion-picker-wheel",
    pageTitle: "A-Tier LoL Champions Picker Wheel | Strong Champion Spinner",
    description:
      "Spin A-tier curated League champions. A LoL Picker Wheel for strong-but-not-S shortlists, challenges, and drafts.",
    h1: "A-Tier Champions Picker Wheel",
    shortTitle: "A-Tier Champions",
    heroIntro:
      "Load A-tier curated champions and spin a fair strong-pick shortlist for challenges, streams, and drafts.",
    keywords: [
      "a tier lol champions",
      "a tier champion wheel",
      "lol a tier spinner",
      "strong champions randomizer",
    ],
    articleTitle: "Spin Among A-Tier Champions",
    articleIntro: [
      "The A-tier template focuses mid-high popularity curated champions—useful when S-tier feels too stacked but you still want a strong shortlist.",
      "Treat tiers as entertainment context for this fan tool, not a live patch tier list. Pair with Elimination for multi-round strong picks.",
    ],
    uniqueSection: {
      title: "Built for strong shortlists",
      intro: "Only A-tier curated champions appear on this wheel.",
      points: [
        {
          title: "Challenge energy",
          description: "Spin a strong pick without limiting to S-tier only.",
        },
        {
          title: "Draft variety",
          description: "A wider strong pool than S-tier alone.",
        },
        {
          title: "Stream titles",
          description: "Clean “A-tier only” segment hooks.",
        },
      ],
    },
  }),
  hard: finalize({
    id: "hard",
    path: "/lol-hard-champion-picker-wheel",
    pageTitle: "Hard LoL Champions Picker Wheel | Expert Difficulty Spinner",
    description:
      "Spin hard and expert difficulty League champions. A skill-challenge LoL Picker Wheel for advanced practice nights.",
    h1: "Hard Champions Picker Wheel",
    shortTitle: "Hard Champions",
    heroIntro:
      "Load hard and expert difficulty champions and spin a fair skill-challenge pick for advanced practice and streams.",
    keywords: [
      "hard lol champions",
      "expert league champions wheel",
      "difficult champion spinner",
      "hard champion randomizer",
    ],
    articleTitle: "Spin Among Hard Champions",
    articleIntro: [
      "The hard template filters the curated catalog to hard and expert difficulty champions—pair with Beginner Wheel when you want the opposite skill gate.",
      "Difficulty tags are reference trivia for this fan tool, not live Riot guidance. Use Elimination for multi-round skill-challenge drafts.",
    ],
    uniqueSection: {
      title: "Built for skill challenges",
      intro: "Only hard and expert difficulty champions appear on this wheel.",
      points: [
        {
          title: "Advanced practice",
          description: "Commit to a demanding champ before you queue.",
        },
        {
          title: "Streamer challenges",
          description: "Hard-only segments for chat.",
        },
        {
          title: "Contrast beginner",
          description: "Flip to Beginner Wheel for easy warmups.",
        },
      ],
    },
  }),
}

export function getLolWheelSpoke(id: LolWheelSpokeId): LolWheelSpokeSeo {
  return LOL_WHEEL_SPOKES[id]
}

export function getAllLolWheelSpokes(): LolWheelSpokeSeo[] {
  return ALL_IDS.map((id) => LOL_WHEEL_SPOKES[id])
}

export function getLolSpokeSiblings(
  spoke: LolWheelSpokeSeo,
): LolWheelSpokeSeo[] {
  return spoke.siblingIds.map((id) => LOL_WHEEL_SPOKES[id])
}

export const LOL_WHEEL_POPULAR_SPOKE_LINKS = ALL_IDS.map((id) => {
  const spoke = LOL_WHEEL_SPOKES[id]
  const useCase = LOL_WHEEL_USE_CASES.find((u) => u.id === id)!
  return {
    id,
    label: useCase.label,
    href: spoke.path,
    description: useCase.description,
    accent: useCase.accent,
  }
})

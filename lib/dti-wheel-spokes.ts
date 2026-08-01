import {
  DTI_WHEEL_DISCLAIMER,
  DTI_WHEEL_H1,
  DTI_WHEEL_HERO_INTRO,
  DTI_WHEEL_KEYWORDS,
  DTI_WHEEL_PAGE_DESCRIPTION,
  DTI_WHEEL_PAGE_TITLE,
  DTI_WHEEL_PATH,
  DTI_WHEEL_SHORT_TITLE,
  DTI_WHEEL_SITE_URL,
  DTI_WHEEL_UPDATED_AT,
} from "@/lib/dti-wheel-seo"
import {
  getDtiWheelUseCase,
  type DtiWheelUseCaseAccent,
  type DtiWheelUseCaseConfig,
  type DtiWheelUseCaseId,
} from "@/lib/dti-wheel-use-cases"

export type DtiWheelSpokeId =
  | "pillar"
  | "theme"
  | "color"
  | "aesthetic"
  | "style"
  | "challenge"
  | "hair"
  | "accessory"
  | "season"
  | "dress-to-impress"
  | "dress-to-impress-outfit"
  | "random-generator"

export type DtiWheelDeepLink = {
  useCaseId: DtiWheelUseCaseId
  config: DtiWheelUseCaseConfig
}

export type DtiWheelSpokeFaq = {
  question: string
  answer: string
}

export type DtiWheelSpokeSeo = {
  id: DtiWheelSpokeId
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
  faq: readonly DtiWheelSpokeFaq[]
  siblingIds: readonly DtiWheelSpokeId[]
  deepLink: DtiWheelDeepLink
  accent: DtiWheelUseCaseAccent
  updatedAt?: string
  tips?: readonly string[]
}

export function dtiSpokeUrl(path: string): string {
  return `${DTI_WHEEL_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

const ALL_SPOKE_IDS: DtiWheelSpokeId[] = [
  "pillar",
  "theme",
  "color",
  "aesthetic",
  "style",
  "challenge",
  "hair",
  "accessory",
  "season",
  "dress-to-impress",
  "dress-to-impress-outfit",
  "random-generator",
]

const USE_CASE_BY_SPOKE: Record<DtiWheelSpokeId, DtiWheelUseCaseId> = {
  pillar: "outfit-themes",
  theme: "theme",
  color: "color",
  aesthetic: "aesthetic",
  style: "style",
  challenge: "challenge",
  hair: "hair",
  accessory: "accessory",
  season: "season",
  "dress-to-impress": "dress-to-impress",
  "dress-to-impress-outfit": "dress-to-impress-outfit",
  "random-generator": "random-generator",
}

const SPOKE_PATHS: Record<DtiWheelSpokeId, string> = {
  pillar: DTI_WHEEL_PATH,
  theme: "/dti-theme-wheel",
  color: "/dti-color-wheel",
  aesthetic: "/dti-aesthetic-wheel",
  style: "/dti-style-wheel",
  challenge: "/dti-challenge-wheel",
  hair: "/dti-hair-wheel",
  accessory: "/dti-accessory-wheel",
  season: "/dti-season-wheel",
  "dress-to-impress": "/dress-to-impress-wheel",
  "dress-to-impress-outfit": "/dress-to-impress-outfit-picker",
  "random-generator": "/random-dti-outfit-generator",
}

function defaultFaq(topic: string): DtiWheelSpokeFaq[] {
  return [
    {
      question: `What is this ${topic}?`,
      answer: `This ${topic} is a free Spinifywheel spinner for Roblox Dress to Impress players who want fair random outfit inspiration, challenges, and theme ideas.`,
    },
    {
      question: "Can I edit the list?",
      answer:
        "Yes. Add, remove, rename, or disable entries in the Inputs panel so the wheel matches your private server, stream, or Discord night.",
    },
    {
      question: "Are spins fair?",
      answer:
        "Every enabled entry gets an equal slice unless you intentionally duplicate labels or turn options off.",
    },
    {
      question: "Can I share this with friends?",
      answer:
        "Yes. Save on this device in My Wheels, or share a Create Custom Wheel link so friends open the same exact list.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Yes. Spin from a phone or tablet while Roblox is open on another screen.",
    },
  ]
}

function siblingsFor(id: DtiWheelSpokeId): DtiWheelSpokeId[] {
  return ALL_SPOKE_IDS.filter((spokeId) => spokeId !== id).slice(0, 8)
}

function buildDeepLink(id: DtiWheelSpokeId): DtiWheelDeepLink {
  const useCaseId = USE_CASE_BY_SPOKE[id]
  const useCase = getDtiWheelUseCase(useCaseId)
  if (!useCase) {
    throw new Error(`Missing DTI use case for spoke ${id}`)
  }
  return { useCaseId, config: useCase.config }
}

function baseSpoke(
  id: DtiWheelSpokeId,
  overrides: Partial<DtiWheelSpokeSeo> &
    Pick<DtiWheelSpokeSeo, "pageTitle" | "description" | "h1" | "shortTitle" | "heroIntro">,
): DtiWheelSpokeSeo {
  const useCase = getDtiWheelUseCase(USE_CASE_BY_SPOKE[id])!
  return {
    id,
    path: SPOKE_PATHS[id],
    keywords: DTI_WHEEL_KEYWORDS,
    articleTitle: `How to use the ${overrides.shortTitle}`,
    articleIntro: [
      overrides.heroIntro,
      "Customize the wedges, spin as many times as you need, and keep every Dress to Impress round feeling new for friends, private servers, and content creation.",
    ],
    uniqueSection: {
      title: "Why players love this spinner",
      intro: "A fair spin beats arguing in chat when nobody can pick a theme.",
      points: [
        {
          title: "Arrive ready",
          description: "Useful presets load instantly so you are not staring at an empty editor.",
        },
        {
          title: "Customize fast",
          description: "Add aesthetics, colors, hair rules, or challenge prompts in seconds.",
        },
        {
          title: "Share the vibe",
          description: "Save locally or share a custom link so everyone spins the same board.",
        },
      ],
    },
    faq: defaultFaq(overrides.shortTitle.toLowerCase()),
    siblingIds: siblingsFor(id),
    deepLink: buildDeepLink(id),
    accent: useCase.accent,
    updatedAt: DTI_WHEEL_UPDATED_AT,
    tips: [
      "Spin once before you enter the Dress to Impress lobby so your theme is locked early.",
      "Disable themes you already used tonight to force fresh combinations.",
      "Duplicate a template, then rename it for your Discord event or TikTok series.",
      "Pair a color challenge with an aesthetic spoke for harder creative rounds.",
    ],
    ...overrides,
  }
}

export const DTI_WHEEL_SPOKES: Record<DtiWheelSpokeId, DtiWheelSpokeSeo> = {
  pillar: baseSpoke("pillar", {
    pageTitle: DTI_WHEEL_PAGE_TITLE,
    description: DTI_WHEEL_PAGE_DESCRIPTION,
    h1: DTI_WHEEL_H1,
    shortTitle: DTI_WHEEL_SHORT_TITLE,
    heroIntro: DTI_WHEEL_HERO_INTRO,
    articleTitle: "Spin the DTI Wheel for fresh Dress to Impress looks",
    articleIntro: [
      DTI_WHEEL_HERO_INTRO,
      "Players repeat the same three outfits because chat debates drag on. The dti wheel outfit picker settles the theme instantly, then lets you customize aesthetics, colors, and challenges for the next round.",
      "Creators use the same spinner for TikTok outfit challenges, YouTube remakes, Discord fashion nights, and private-server competitions where fairness matters as much as style.",
      DTI_WHEEL_DISCLAIMER,
    ],
    uniqueSection: {
      title: "Fresh outfit inspiration that still feels fair",
      intro:
        "Random themes help you break repeat combinations without removing creative control.",
      points: [
        {
          title: "Break repeat looks",
          description:
            "Introduce random themes, colors, and aesthetics so every DTI round feels new.",
        },
        {
          title: "Custom challenges",
          description:
            "Build themed wheels for private servers, fashion competitions, and friend groups.",
        },
        {
          title: "Content-ready spins",
          description:
            "Film TikTok, YouTube, and livestream segments where the wheel picks the challenge live.",
        },
      ],
    },
    faq: [
      {
        question: "What is the dti wheel outfit picker?",
        answer:
          "It is a free online spinner that randomly selects Dress to Impress outfit themes, aesthetics, colors, and fashion challenges for Roblox DTI rounds.",
      },
      {
        question: "Can I add my own outfit themes?",
        answer:
          "Yes. Add outfit ideas, aesthetics, colors, and challenge prompts in the Inputs panel, including optional images on wedges.",
      },
      {
        question: "Can I save my custom DTI wheel?",
        answer:
          "Yes. Saved wheels stay in My Wheels on this device. Share the exact list with Create Custom Wheel.",
      },
      {
        question: "Does every outfit have an equal chance?",
        answer:
          "Yes unless you customize odds by duplicating entries or disabling options.",
      },
      {
        question: "Can I share my wheel with friends?",
        answer:
          "Yes. Send a custom wheel link or point friends to a cluster template like the aesthetic or color wheels.",
      },
      {
        question: "Does it work on mobile?",
        answer: "Yes. It works in modern mobile and desktop browsers.",
      },
      {
        question: "Is it free?",
        answer: "Yes. Spinning and editing templates is free with no account required.",
      },
    ],
    tips: [
      "Start with the twenty ready-made themes, then disable ones your group already mastered.",
      "Use elimination mode when each player needs a unique theme for a competition.",
      "Share a Create Custom Wheel link before the lobby fills so everyone sees the same list.",
      "Jump to a color or hair spoke when you want a harder secondary challenge.",
    ],
  }),
  theme: baseSpoke("theme", {
    pageTitle: "DTI Theme Wheel | Random Dress to Impress Themes",
    description:
      "Spin the DTI theme wheel for random Dress to Impress outfit themes. Perfect for Roblox lobbies, private servers, and fashion challenges.",
    h1: "DTI Theme Wheel",
    shortTitle: "DTI Theme Wheel",
    heroIntro:
      "Need a Dress to Impress theme fast? The DTI theme wheel spins random outfit themes so your next Roblox round starts with a clear creative direction.",
  }),
  color: baseSpoke("color", {
    pageTitle: "DTI Color Wheel | Dress to Impress Color Challenge Spinner",
    description:
      "Spin the DTI color wheel for random Dress to Impress color challenges—pink only, black and white, neon, pastels, and more.",
    h1: "DTI Color Wheel",
    shortTitle: "DTI Color Wheel",
    heroIntro:
      "Lock a palette before you style. The DTI color wheel picks random color challenges that push creative Dress to Impress outfits beyond your usual favorites.",
  }),
  aesthetic: baseSpoke("aesthetic", {
    pageTitle: "DTI Aesthetic Wheel | Random Dress to Impress Aesthetics",
    description:
      "Spin the DTI aesthetic wheel for Y2K, coquette, goth, cottagecore, and more Roblox Dress to Impress vibes.",
    h1: "DTI Aesthetic Wheel",
    shortTitle: "DTI Aesthetic Wheel",
    heroIntro:
      "Pick an aesthetic, then build the fit. The DTI aesthetic wheel randomizes fashion vibes so every Dress to Impress round has a clear mood.",
  }),
  style: baseSpoke("style", {
    pageTitle: "DTI Style Wheel | Random Dress to Impress Styles",
    description:
      "Spin the DTI style wheel for casual, formal, streetwear, glam, and other Dress to Impress style directions.",
    h1: "DTI Style Wheel",
    shortTitle: "DTI Style Wheel",
    heroIntro:
      "From streetwear to black-tie energy, the DTI style wheel chooses a random clothing style for your next Roblox Dress to Impress look.",
  }),
  challenge: baseSpoke("challenge", {
    pageTitle: "DTI Challenge Wheel | Dress to Impress Fashion Challenges",
    description:
      "Spin the DTI challenge wheel for random Dress to Impress fashion challenges perfect for streams, TikTok, and friend groups.",
    h1: "DTI Challenge Wheel",
    shortTitle: "DTI Challenge Wheel",
    heroIntro:
      "Make the round harder on purpose. The DTI challenge wheel spins fashion rules and creative constraints for competitive Dress to Impress play.",
  }),
  hair: baseSpoke("hair", {
    pageTitle: "DTI Hair Wheel | Dress to Impress Hair Challenge Spinner",
    description:
      "Spin the DTI hair wheel for random hair styles and color rules to complete your Dress to Impress outfit.",
    h1: "DTI Hair Wheel",
    shortTitle: "DTI Hair Wheel",
    heroIntro:
      "Hair can make or break a DTI look. Spin the DTI hair wheel for random styles and color challenges that finish your outfit story.",
  }),
  accessory: baseSpoke("accessory", {
    pageTitle: "DTI Accessory Wheel | Random Dress to Impress Accessories",
    description:
      "Spin the DTI accessory wheel for bags, jewelry, hats, and statement pieces to polish your Dress to Impress outfit.",
    h1: "DTI Accessory Wheel",
    shortTitle: "DTI Accessory Wheel",
    heroIntro:
      "Advanced DTI players know accessories decide the podium. Spin this wheel for random bags, jewelry, hats, and finishing touches.",
  }),
  season: baseSpoke("season", {
    pageTitle: "DTI Season Wheel | Seasonal Dress to Impress Outfit Spinner",
    description:
      "Spin the DTI season wheel for summer, winter, holiday, and seasonal Dress to Impress outfit inspiration.",
    h1: "DTI Season Wheel",
    shortTitle: "DTI Season Wheel",
    heroIntro:
      "Match the calendar or invent a holiday vibe. The DTI season wheel picks seasonal Dress to Impress themes for festive and weather-inspired rounds.",
  }),
  "dress-to-impress": baseSpoke("dress-to-impress", {
    pageTitle: "Dress to Impress Wheel | Random Roblox DTI Theme Spinner",
    description:
      "Spin the Dress to Impress wheel for random Roblox DTI themes, aesthetics, and outfit inspiration. Free online fashion spinner.",
    h1: "Dress to Impress Wheel",
    shortTitle: "Dress to Impress Wheel",
    heroIntro:
      "The Dress to Impress wheel is a free Roblox DTI spinner for random themes and outfit inspiration when your lobby needs a quick creative prompt.",
    keywords: [
      "dress to impress wheel",
      "dress to impress spinner",
      "roblox dress to impress",
      "dti wheel",
      "dti spinner",
      ...DTI_WHEEL_KEYWORDS,
    ],
  }),
  "dress-to-impress-outfit": baseSpoke("dress-to-impress-outfit", {
    pageTitle: "Dress to Impress Outfit Picker | Random DTI Outfit Ideas",
    description:
      "Use the Dress to Impress outfit picker to spin random DTI outfit ideas for Roblox fashion rounds, challenges, and content.",
    h1: "Dress to Impress Outfit Picker",
    shortTitle: "DTI Outfit Picker",
    heroIntro:
      "The Dress to Impress outfit picker spins scenario-based outfit ideas—from coffee date soft to Met Gala glam—so every Roblox DTI round has a story.",
    keywords: [
      "dress to impress outfit picker",
      "dti outfit picker",
      "random outfit picker",
      ...DTI_WHEEL_KEYWORDS,
    ],
  }),
  "random-generator": baseSpoke("random-generator", {
    pageTitle: "Random DTI Outfit Generator | Spin Dress to Impress Looks",
    description:
      "Generate a random DTI outfit with this free Dress to Impress outfit generator. Spin themes and styles for your next Roblox round.",
    h1: "Random DTI Outfit Generator",
    shortTitle: "Random DTI Generator",
    heroIntro:
      "Need a random DTI outfit now? This generator spins Dress to Impress directions so you can build a fresh look without overthinking the theme.",
    keywords: [
      "random dti outfit generator",
      "dti randomizer",
      "random DTI outfit",
      ...DTI_WHEEL_KEYWORDS,
    ],
  }),
}

export function getDtiWheelSpoke(id: DtiWheelSpokeId): DtiWheelSpokeSeo {
  return DTI_WHEEL_SPOKES[id]
}

export function getDtiSpokeSiblings(spoke: DtiWheelSpokeSeo): DtiWheelSpokeSeo[] {
  return spoke.siblingIds.map((id) => DTI_WHEEL_SPOKES[id]).filter(Boolean)
}

export const DTI_WHEEL_POPULAR_SPOKE_LINKS = [
  {
    id: "pillar",
    href: DTI_WHEEL_PATH,
    label: "Outfit Themes",
    description: "Twenty ready-made DTI themes.",
    accent: "pink",
  },
  {
    id: "aesthetic",
    href: "/dti-aesthetic-wheel",
    label: "Aesthetics",
    description: "Y2K, coquette, goth, and more.",
    accent: "rose",
  },
  {
    id: "color",
    href: "/dti-color-wheel",
    label: "Color Challenge",
    description: "Palette locks for creative fits.",
    accent: "violet",
  },
  {
    id: "challenge",
    href: "/dti-challenge-wheel",
    label: "Challenges",
    description: "Hard mode fashion rules.",
    accent: "orange",
  },
  {
    id: "hair",
    href: "/dti-hair-wheel",
    label: "Hair",
    description: "Styles and color rules.",
    accent: "amber",
  },
  {
    id: "accessory",
    href: "/dti-accessory-wheel",
    label: "Accessories",
    description: "Bags, jewelry, finishing pieces.",
    accent: "cyan",
  },
  {
    id: "season",
    href: "/dti-season-wheel",
    label: "Seasons",
    description: "Holiday and weather vibes.",
    accent: "emerald",
  },
  {
    id: "dress-to-impress",
    href: "/dress-to-impress-wheel",
    label: "Dress to Impress",
    description: "Broad DTI theme spinner.",
    accent: "blue",
  },
] as const

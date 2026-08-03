import {
  THEME_PICKER_H1,
  THEME_PICKER_HERO_INTRO,
  THEME_PICKER_KEYWORDS,
  THEME_PICKER_PAGE_DESCRIPTION,
  THEME_PICKER_PAGE_TITLE,
  THEME_PICKER_PATH,
  THEME_PICKER_SHORT_TITLE,
  THEME_PICKER_SITE_URL,
  THEME_PICKER_UPDATED_AT,
} from "@/lib/theme-picker-seo"
import {
  getThemePickerUseCase,
  type ThemePickerUseCaseAccent,
  type ThemePickerUseCaseConfig,
  type ThemePickerUseCaseId,
} from "@/lib/theme-picker-use-cases"

export type ThemePickerSpokeId =
  | "pillar"
  | "party"
  | "drawing"
  | "writing"
  | "classroom"
  | "halloween"
  | "christmas"
  | "costume"
  | "youtube"
  | "tiktok"
  | "photography"
  | "what-choose"
  | "what-draw"
  | "what-write"
  | "what-party"
  | "what-video"

export type ThemePickerDeepLink = {
  useCaseId: ThemePickerUseCaseId
  config: ThemePickerUseCaseConfig
}

export type ThemePickerSpokeFaq = {
  question: string
  answer: string
}

export type ThemePickerSpokeSeo = {
  id: ThemePickerSpokeId
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
  faq: readonly ThemePickerSpokeFaq[]
  siblingIds: readonly ThemePickerSpokeId[]
  deepLink: ThemePickerDeepLink
  accent: ThemePickerUseCaseAccent
  updatedAt?: string
  tips?: readonly string[]
}

export function themeSpokeUrl(path: string): string {
  return `${THEME_PICKER_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

const ALL_SPOKE_IDS: ThemePickerSpokeId[] = [
  "pillar",
  "party",
  "drawing",
  "writing",
  "classroom",
  "halloween",
  "christmas",
  "costume",
  "youtube",
  "tiktok",
  "photography",
  "what-choose",
  "what-draw",
  "what-write",
  "what-party",
  "what-video",
]

const QUESTION_SPOKE_IDS = new Set<ThemePickerSpokeId>([
  "what-choose",
  "what-draw",
  "what-write",
  "what-party",
  "what-video",
])

const USE_CASE_BY_SPOKE: Record<ThemePickerSpokeId, ThemePickerUseCaseId> = {
  pillar: "general",
  party: "party",
  drawing: "drawing",
  writing: "writing",
  classroom: "classroom",
  halloween: "halloween",
  christmas: "christmas",
  costume: "costume",
  youtube: "youtube",
  tiktok: "tiktok",
  photography: "photography",
  "what-choose": "general",
  "what-draw": "drawing",
  "what-write": "writing",
  "what-party": "party",
  "what-video": "youtube",
}

const SPOKE_PATHS: Record<ThemePickerSpokeId, string> = {
  pillar: THEME_PICKER_PATH,
  party: "/party-theme-wheel",
  drawing: "/drawing-theme-wheel",
  writing: "/writing-theme-wheel",
  classroom: "/classroom-theme-wheel",
  halloween: "/halloween-theme-wheel",
  christmas: "/christmas-theme-wheel",
  costume: "/costume-theme-wheel",
  youtube: "/youtube-theme-wheel",
  tiktok: "/tiktok-theme-wheel",
  photography: "/photography-theme-wheel",
  "what-choose": "/what-theme-should-i-choose",
  "what-draw": "/what-theme-should-i-draw",
  "what-write": "/what-theme-should-i-write-about",
  "what-party": "/what-party-theme-should-i-have",
  "what-video": "/what-theme-should-my-video-be",
}

function defaultFaq(topic: string): ThemePickerSpokeFaq[] {
  return [
    {
      question: `What is the ${topic}?`,
      answer: `The ${topic} is a free Spinifywheel spinner that randomly selects a theme from a ready-made list you can customize for groups, classrooms, and creative projects.`,
    },
    {
      question: "Can I edit the list?",
      answer:
        "Yes. Add, remove, rename, or disable themes in the Inputs panel so the wheel matches your party, class, or challenge.",
    },
    {
      question: "Are spins fair?",
      answer:
        "Every enabled theme gets an equal slice unless you intentionally duplicate labels or turn options off.",
    },
    {
      question: "Can I save or share this wheel?",
      answer:
        "Yes. Save on this device in My Wheels, or share a Create Custom Wheel link so others open the same exact list.",
    },
    {
      question: "Does it work on mobile?",
      answer: "Yes. Spin from a phone, tablet, or desktop browser.",
    },
  ]
}

const TEMPLATE_SPOKE_IDS: ThemePickerSpokeId[] = [
  "party",
  "drawing",
  "writing",
  "classroom",
  "halloween",
  "christmas",
  "costume",
  "youtube",
  "tiktok",
  "photography",
]

/** Prefer related intents first so Wave 1 spokes still link Wave 2 + what-* pages */
const PREFERRED_SIBLINGS: Record<ThemePickerSpokeId, ThemePickerSpokeId[]> = {
  pillar: [
    "party",
    "drawing",
    "writing",
    "youtube",
    "what-choose",
    "halloween",
    "photography",
    "tiktok",
  ],
  party: [
    "what-party",
    "costume",
    "halloween",
    "christmas",
    "what-choose",
    "drawing",
    "youtube",
    "classroom",
  ],
  drawing: [
    "what-draw",
    "photography",
    "writing",
    "what-choose",
    "party",
    "classroom",
    "tiktok",
    "youtube",
  ],
  writing: [
    "what-write",
    "drawing",
    "classroom",
    "what-choose",
    "party",
    "photography",
    "youtube",
    "tiktok",
  ],
  classroom: [
    "writing",
    "what-write",
    "party",
    "drawing",
    "what-choose",
    "halloween",
    "youtube",
    "photography",
  ],
  halloween: [
    "christmas",
    "costume",
    "party",
    "what-party",
    "drawing",
    "what-choose",
    "writing",
    "youtube",
  ],
  christmas: [
    "halloween",
    "party",
    "costume",
    "what-party",
    "what-choose",
    "drawing",
    "youtube",
    "classroom",
  ],
  costume: [
    "party",
    "what-party",
    "halloween",
    "christmas",
    "what-choose",
    "drawing",
    "youtube",
    "tiktok",
  ],
  youtube: [
    "what-video",
    "tiktok",
    "what-choose",
    "party",
    "drawing",
    "writing",
    "photography",
    "classroom",
  ],
  tiktok: [
    "youtube",
    "what-video",
    "what-choose",
    "party",
    "drawing",
    "costume",
    "photography",
    "writing",
  ],
  photography: [
    "drawing",
    "what-draw",
    "what-choose",
    "youtube",
    "tiktok",
    "writing",
    "party",
    "classroom",
  ],
  "what-choose": [
    "party",
    "drawing",
    "writing",
    "youtube",
    "what-party",
    "what-draw",
    "what-write",
    "what-video",
  ],
  "what-draw": [
    "drawing",
    "photography",
    "what-choose",
    "writing",
    "what-write",
    "party",
    "youtube",
    "classroom",
  ],
  "what-write": [
    "writing",
    "classroom",
    "what-choose",
    "drawing",
    "what-draw",
    "party",
    "youtube",
    "photography",
  ],
  "what-party": [
    "party",
    "costume",
    "halloween",
    "christmas",
    "what-choose",
    "drawing",
    "youtube",
    "classroom",
  ],
  "what-video": [
    "youtube",
    "tiktok",
    "what-choose",
    "party",
    "drawing",
    "writing",
    "photography",
    "what-draw",
  ],
}

function siblingsFor(id: ThemePickerSpokeId): ThemePickerSpokeId[] {
  const selected: ThemePickerSpokeId[] = []
  const seen = new Set<ThemePickerSpokeId>()

  const push = (spokeId: ThemePickerSpokeId) => {
    if (spokeId === id || spokeId === "pillar" || seen.has(spokeId)) return
    seen.add(spokeId)
    selected.push(spokeId)
  }

  for (const spokeId of PREFERRED_SIBLINGS[id] ?? []) push(spokeId)
  for (const spokeId of TEMPLATE_SPOKE_IDS) push(spokeId)
  for (const spokeId of QUESTION_SPOKE_IDS) push(spokeId)

  return selected.slice(0, 8)
}

function buildDeepLink(id: ThemePickerSpokeId): ThemePickerDeepLink {
  const useCaseId = USE_CASE_BY_SPOKE[id]
  const useCase = getThemePickerUseCase(useCaseId)
  if (!useCase) {
    throw new Error(`Missing Theme Picker use case for spoke ${id}`)
  }
  return { useCaseId, config: useCase.config }
}

function baseSpoke(
  id: ThemePickerSpokeId,
  overrides: Partial<ThemePickerSpokeSeo> &
    Pick<
      ThemePickerSpokeSeo,
      "pageTitle" | "description" | "h1" | "shortTitle" | "heroIntro"
    >,
): ThemePickerSpokeSeo {
  const useCase = getThemePickerUseCase(USE_CASE_BY_SPOKE[id])!
  return {
    id,
    path: SPOKE_PATHS[id],
    keywords: THEME_PICKER_KEYWORDS,
    articleTitle: `How to use the ${overrides.shortTitle}`,
    articleIntro: [
      overrides.heroIntro,
      "Customize the wedges, spin as many times as you need, and keep theme decisions fair for parties, classrooms, writers, artists, and creators.",
    ],
    uniqueSection: {
      title: "Why a theme wheel beats arguing",
      intro: "A fair spin ends indecision and keeps creative sessions moving.",
      points: [
        {
          title: "Arrive ready",
          description: "Useful presets load instantly so you are not staring at an empty editor.",
        },
        {
          title: "Customize fast",
          description: "Add or remove themes in seconds for your exact activity.",
        },
        {
          title: "Share the vibe",
          description: "Save locally or share a custom link so everyone spins the same board.",
        },
      ],
    },
    faq: defaultFaq(overrides.shortTitle),
    siblingIds: siblingsFor(id),
    deepLink: buildDeepLink(id),
    accent: useCase.accent,
    updatedAt: THEME_PICKER_UPDATED_AT,
    tips: [
      "Spin once before the activity starts so the theme is locked early.",
      "Disable themes you already used tonight to force fresh combinations.",
      "Keep separate saved wheels for parties, writing, drawing, and class—not one giant list.",
    ],
    ...overrides,
  }
}

export const THEME_PICKER_SPOKES: Record<ThemePickerSpokeId, ThemePickerSpokeSeo> = {
  pillar: baseSpoke("pillar", {
    pageTitle: THEME_PICKER_PAGE_TITLE,
    description: THEME_PICKER_PAGE_DESCRIPTION,
    h1: THEME_PICKER_H1,
    shortTitle: THEME_PICKER_SHORT_TITLE,
    heroIntro: THEME_PICKER_HERO_INTRO,
    articleTitle: "Spin the Theme Picker Wheel",
    articleIntro: [
      THEME_PICKER_HERO_INTRO,
      "Start with the mixed starter list or jump to a focused template for parties, drawing, writing, classrooms, or Halloween. Every enabled theme gets an equal slice unless you edit the board.",
    ],
  }),
  party: baseSpoke("party", {
    pageTitle: "Party Theme Wheel | Random Party Theme Generator",
    description:
      "Spin the Party Theme Wheel to choose costume, birthday, holiday, and game-night themes. Customize the list and pick a fair party vibe in seconds.",
    h1: "Party Theme Wheel",
    shortTitle: "Party Theme Wheel",
    heroIntro:
      "Planning a celebration and stuck between ideas? Spin the Party Theme Wheel for retro, beach, superhero, masquerade, and more—then customize the list for your guests.",
    keywords: [
      "party theme wheel",
      "party theme picker",
      "random party theme",
      "costume party theme",
      "birthday party theme generator",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Perfect for hosts who need a fair pick",
      intro: "Let the room watch one spin instead of debating for twenty minutes.",
      points: [
        {
          title: "Costume nights",
          description: "Lock a dress-code vibe before anyone shops or crafts an outfit.",
        },
        {
          title: "Birthday parties",
          description: "Pick decorations, activities, and playlist vibes with one spin.",
        },
        {
          title: "Game nights",
          description: "Choose a party mood that fits snacks, games, and group photos.",
        },
      ],
    },
  }),
  drawing: baseSpoke("drawing", {
    pageTitle: "Drawing Theme Wheel | Random Art Prompt Spinner",
    description:
      "Spin the Drawing Theme Wheel for random art prompts—fantasy, nature, architecture, animals, and more. Great for sketch practice and creative challenges.",
    h1: "Drawing Theme Wheel",
    shortTitle: "Drawing Theme Wheel",
    heroIntro:
      "Need something to draw? Spin the Drawing Theme Wheel for fair art prompts across fantasy, nature, sci-fi, food, architecture, and everyday subjects—then trim the list to your skill level.",
    keywords: [
      "drawing theme wheel",
      "drawing prompt wheel",
      "what theme should i draw",
      "random art prompt",
      "art challenge spinner",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Built for sketchbooks and art challenges",
      intro: "Random prompts beat blank-page paralysis without locking you into one style forever.",
      points: [
        {
          title: "Daily practice",
          description: "Spin once, draw for a timed session, then disable used prompts.",
        },
        {
          title: "Group challenges",
          description: "Everyone draws the same theme and compares results.",
        },
        {
          title: "Warm-ups",
          description: "Use simple subjects for warm-ups and harder themes for longer studies.",
        },
      ],
    },
  }),
  writing: baseSpoke("writing", {
    pageTitle: "Writing Theme Wheel | Random Story Prompt Spinner",
    description:
      "Spin the Writing Theme Wheel for story genres, settings, and prompt starters. Beat writer's block with a fair random theme you can customize.",
    h1: "Writing Theme Wheel",
    shortTitle: "Writing Theme Wheel",
    heroIntro:
      "Stuck on what to write? Spin the Writing Theme Wheel for mystery, adventure, romance, sci-fi, and more—or edit the wedges into character, setting, and conflict prompts.",
    keywords: [
      "writing theme wheel",
      "writing prompt wheel",
      "what theme should i write about",
      "story prompt spinner",
      "random writing theme",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "A fair way out of writer's block",
      intro: "Commit to the spin, then write for a short timed sprint before second-guessing.",
      points: [
        {
          title: "Genre nights",
          description: "Pick a genre for critique groups and writing clubs.",
        },
        {
          title: "Prompt packs",
          description: "Replace labels with your own story starters and keep spinning.",
        },
        {
          title: "Classroom writing",
          description: "Teachers can preload safe prompts for timed exercises.",
        },
      ],
    },
  }),
  classroom: baseSpoke("classroom", {
    pageTitle: "Classroom Theme Wheel | Random Activity Theme Spinner",
    description:
      "Spin the Classroom Theme Wheel for discussion topics, writing exercises, icebreakers, and project ideas. Customize themes for your students.",
    h1: "Classroom Theme Wheel",
    shortTitle: "Classroom Theme Wheel",
    heroIntro:
      "Need a fair classroom activity theme? Spin for discussion topics, story starters, icebreakers, and project ideas—then edit the list to match your grade level and subject.",
    keywords: [
      "classroom theme wheel",
      "classroom spinner",
      "random classroom activity",
      "discussion topic wheel",
      "teacher theme picker",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Designed for teachers and facilitators",
      intro: "Visible equal odds keep students engaged and reduce “why did you pick that?” debates.",
      points: [
        {
          title: "Icebreakers",
          description: "Warm up a new group with a random conversation theme.",
        },
        {
          title: "Writing exercises",
          description: "Assign a prompt the whole class can watch land on the wheel.",
        },
        {
          title: "Project kicks",
          description: "Spin research or presentation themes for group work.",
        },
      ],
    },
  }),
  halloween: baseSpoke("halloween", {
    pageTitle: "Halloween Theme Wheel | Random Spooky Theme Spinner",
    description:
      "Spin the Halloween Theme Wheel for haunted house, costume, party, and creative challenge ideas. Customize spooky themes for October events.",
    h1: "Halloween Theme Wheel",
    shortTitle: "Halloween Theme Wheel",
    heroIntro:
      "Planning something spooky? Spin the Halloween Theme Wheel for haunted house, vampire ball, costume contest, and candy chaos vibes—then customize for kids, teens, or adult parties.",
    keywords: [
      "halloween theme wheel",
      "halloween party theme",
      "spooky theme picker",
      "costume theme spinner",
      "halloween challenge wheel",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Seasonal fun without the planning spiral",
      intro: "One spin can set decorations, costumes, playlist mood, and activity tone.",
      points: [
        {
          title: "Costume cues",
          description: "Give guests a clear vibe before they assemble outfits.",
        },
        {
          title: "Party hosts",
          description: "Pick a spooky celebration style for snacks and games.",
        },
        {
          title: "Creative challenges",
          description: "Use themes for drawing, writing, or content series in October.",
        },
      ],
    },
  }),
  christmas: baseSpoke("christmas", {
    pageTitle: "Christmas Theme Wheel | Random Holiday Theme Spinner",
    description:
      "Spin the Christmas Theme Wheel for cozy cabin, ugly sweater, secret santa, and holiday party themes. Customize festive ideas for families and events.",
    h1: "Christmas Theme Wheel",
    shortTitle: "Christmas Theme Wheel",
    heroIntro:
      "Need a festive vibe? Spin the Christmas Theme Wheel for cozy cabin, ugly sweater party, winter wonderland, secret santa, and more—then tailor the list for family nights or office parties.",
    keywords: [
      "christmas theme wheel",
      "christmas party theme",
      "holiday theme picker",
      "christmas party spinner",
      "festive theme generator",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Holiday plans without the group chat spiral",
      intro: "Lock decorations, activities, and dress code with one fair spin.",
      points: [
        {
          title: "Family nights",
          description: "Pick movies, baking, or game-night moods everyone can see.",
        },
        {
          title: "Office parties",
          description: "Choose a celebration style before you buy snacks and décor.",
        },
        {
          title: "Seasonal content",
          description: "Creators can spin December video or photo series themes.",
        },
      ],
    },
  }),
  costume: baseSpoke("costume", {
    pageTitle: "Costume Theme Wheel | Random Costume Idea Spinner",
    description:
      "Spin the Costume Theme Wheel for superhero, movie character, fantasy, and DIY costume ideas. Great for parties, Halloween, and dress-up events.",
    h1: "Costume Theme Wheel",
    shortTitle: "Costume Theme Wheel",
    heroIntro:
      "Stuck on what to wear? Spin the Costume Theme Wheel for superhero, movie character, historical figure, fantasy creature, and DIY mystery ideas—then customize for kids or adult parties.",
    keywords: [
      "costume theme wheel",
      "costume picker",
      "random costume idea",
      "costume theme spinner",
      "what costume should i wear",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Costume ideas—not full party plans",
      intro:
        "This spoke focuses on what to dress as. Use the Party Theme Wheel when you need the whole event vibe.",
      points: [
        {
          title: "Solo looks",
          description: "Pick a character direction before shopping or crafting.",
        },
        {
          title: "Group costumes",
          description: "Spin once per person or disable used ideas for matching themes.",
        },
        {
          title: "Last-minute saves",
          description: "Keep DIY Mystery and Decade Throwback for easy closet builds.",
        },
      ],
    },
  }),
  youtube: baseSpoke("youtube", {
    pageTitle: "YouTube Theme Wheel | Random Video Idea Spinner",
    description:
      "Spin the YouTube Theme Wheel for day-in-my-life, tutorials, challenges, reviews, and collab ideas. Customize video themes for your next upload.",
    h1: "YouTube Theme Wheel",
    shortTitle: "YouTube Theme Wheel",
    heroIntro:
      "Not sure what to film? Spin the YouTube Theme Wheel for day-in-my-life, how-to tutorials, challenge videos, storytime, reviews, and more—then edit the list for your niche.",
    keywords: [
      "youtube theme wheel",
      "youtube video ideas",
      "what theme should my video be",
      "youtube challenge spinner",
      "content idea wheel",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Built for upload schedules",
      intro: "A fair format pick beats staring at a blank content calendar.",
      points: [
        {
          title: "Series planning",
          description: "Spin weekly formats, then disable repeats for variety.",
        },
        {
          title: "Collab nights",
          description: "Let guests watch the wheel choose the video concept.",
        },
        {
          title: "Niche edits",
          description: "Replace labels with gaming, beauty, tech, or education angles.",
        },
      ],
    },
  }),
  tiktok: baseSpoke("tiktok", {
    pageTitle: "TikTok Theme Wheel | Random TikTok Challenge Spinner",
    description:
      "Spin the TikTok Theme Wheel for trend remixes, transitions, duets, POV prompts, and short-form challenges. Customize ideas for your next clip.",
    h1: "TikTok Theme Wheel",
    shortTitle: "TikTok Theme Wheel",
    heroIntro:
      "Need a short-form idea fast? Spin the TikTok Theme Wheel for trend remixes, transitions, duets, GRWM, comedy skits, and POV scenarios—then customize for your niche or sound.",
    keywords: [
      "tiktok theme wheel",
      "tiktok challenge wheel",
      "tiktok content ideas",
      "short form theme spinner",
      "tiktok prompt generator",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Short-form prompts that stay editable",
      intro: "Start with formats, then swap in sounds, niches, or brand-safe prompts.",
      points: [
        {
          title: "Daily posting",
          description: "Spin once, film a draft, then disable used formats.",
        },
        {
          title: "Creator groups",
          description: "Friends film the same theme and stitch results later.",
        },
        {
          title: "Trend nights",
          description: "Keep Trend Remix and Sound Challenge for viral experiments.",
        },
      ],
    },
  }),
  photography: baseSpoke("photography", {
    pageTitle: "Photography Theme Wheel | Random Photo Prompt Spinner",
    description:
      "Spin the Photography Theme Wheel for golden hour portraits, street photos, macros, product shots, and more. Customize shoot prompts for practice and challenges.",
    h1: "Photography Theme Wheel",
    shortTitle: "Photography Theme Wheel",
    heroIntro:
      "Need a shoot prompt? Spin the Photography Theme Wheel for golden hour portraits, street photography, food flat lays, architecture, night lights, and more—then tailor the list to your gear and location.",
    keywords: [
      "photography theme wheel",
      "photo prompt wheel",
      "random photography theme",
      "photo challenge spinner",
      "photography idea generator",
      ...THEME_PICKER_KEYWORDS,
    ],
    uniqueSection: {
      title: "Practice prompts for any camera",
      intro: "Equal-chance themes keep photo walks and portfolio challenges moving.",
      points: [
        {
          title: "Photo walks",
          description: "Spin a subject before you leave so the outing has focus.",
        },
        {
          title: "Portfolio gaps",
          description: "Disable styles you already shoot well to force growth.",
        },
        {
          title: "Group challenges",
          description: "Everyone shoots the same theme and compares edits later.",
        },
      ],
    },
  }),
  "what-choose": baseSpoke("what-choose", {
    pageTitle: "What Theme Should I Choose? | Free Theme Decision Wheel",
    description:
      "Stuck between theme ideas? Spin this free Theme Picker Wheel to choose a random theme for parties, writing, drawing, classrooms, and creative challenges.",
    h1: "What Theme Should I Choose?",
    shortTitle: "What Theme Should I Choose?",
    heroIntro:
      "If you're stuck between several ideas, spin once for a fair theme pick. Remove anything that does not fit, add your own options, then commit to the result—or open a focused template when you already know the activity type.",
    keywords: [
      "what theme should i choose",
      "choose a random theme",
      "theme decision wheel",
      "random theme picker",
      "theme chooser",
      ...THEME_PICKER_KEYWORDS,
    ],
    articleTitle: "How to choose a theme with a fair spin",
    articleIntro: [
      "“What theme should I choose?” usually means you already have options—and cannot pick one. This page opens the Theme Picker Wheel with a mixed starter list so one visible spin ends the debate.",
      "Edit the wedges for your real shortlist, use elimination if you want unique picks across a night, then save the setup for the next time indecision hits. Prefer a focused list? Jump to party, drawing, writing, or video templates from Related Theme Wheels below.",
    ],
    uniqueSection: {
      title: "Beat indecision without overthinking",
      intro: "The wheel works best when every slice is something you would actually accept.",
      points: [
        {
          title: "Trim first",
          description: "Disable themes that are impossible for your budget, location, or audience.",
        },
        {
          title: "Spin once",
          description: "Commit to the first fair result instead of re-spinning until you get a favorite.",
        },
        {
          title: "Save shortlists",
          description: "Keep separate wheels for parties, creative nights, and content days.",
        },
      ],
    },
    tips: [
      "Write your real shortlist onto the wheel before spinning.",
      "If the group argues, make everyone watch the same spin.",
      "Return to the Theme Picker Wheel hub when you need more templates.",
    ],
    faq: [
      {
        question: "What is the What Theme Should I Choose wheel?",
        answer:
          "It is a free Theme Picker Wheel page for people stuck between theme ideas. Spin for a fair pick, then customize the list for your activity.",
      },
      {
        question: "Can I use my own themes?",
        answer:
          "Yes. Add, rename, or disable entries so every wedge matches your real shortlist.",
      },
      {
        question: "Is this the same as a random idea generator?",
        answer:
          "No. This tool chooses from themes you enable on the wheel, with a visual spin your group can watch.",
      },
      {
        question: "Where do I find party or drawing themes?",
        answer:
          "Open the Party Theme Wheel, Drawing Theme Wheel, or other templates linked below—or start from the Theme Picker Wheel hub.",
      },
      {
        question: "Is it free?",
        answer: "Yes. You can spin and customize for free with no account required.",
      },
    ],
  }),
  "what-draw": baseSpoke("what-draw", {
    pageTitle: "What Theme Should I Draw? | Free Drawing Theme Wheel",
    description:
      "What theme should I draw? Spin this free drawing theme wheel for fantasy, nature, architecture, animals, and more art prompts you can customize.",
    h1: "What Theme Should I Draw?",
    shortTitle: "What Theme Should I Draw?",
    heroIntro:
      "Artists often freeze at a blank page. Spin this Drawing Theme Wheel for fantasy, nature, animals, sci-fi, food, or architecture prompts—then trim the list to your skill level and time.",
    keywords: [
      "what theme should i draw",
      "what should i draw theme",
      "drawing theme ideas",
      "random drawing theme",
      "art prompt theme wheel",
      ...THEME_PICKER_KEYWORDS,
    ],
    articleTitle: "How to pick a drawing theme with a spin",
    articleIntro: [
      "“What theme should I draw?” is a creative-block question. This page loads drawing-focused prompts so you can start a timed sketch without scrolling for inspiration.",
      "Unlike a general “what should I draw” activity list, this spoke is theme-first: subjects and moods for art practice, challenges, and group sketch nights. Customize freely, then save favorites for daily warm-ups.",
    ],
    uniqueSection: {
      title: "Theme prompts for artists",
      intro: "Keep every wedge drawable in one sitting unless you are planning a long study.",
      points: [
        {
          title: "Warm-ups",
          description: "Use simpler themes for 10-minute warm-ups before bigger pieces.",
        },
        {
          title: "Challenge nights",
          description: "Friends draw the same theme and compare results afterward.",
        },
        {
          title: "Disable repeats",
          description: "Turn off themes you already practiced this week.",
        },
      ],
    },
    tips: [
      "Set a timer before you spin so the theme becomes a commitment.",
      "Swap labels for mediums (ink, watercolor) if you want technique practice.",
      "Open the Drawing Theme Wheel template anytime you want the same preset again.",
    ],
    faq: [
      {
        question: "What is the What Theme Should I Draw wheel?",
        answer:
          "It is a free drawing-theme spinner with art prompts loaded and ready. Spin once, customize the list, and start sketching.",
      },
      {
        question: "How is this different from What Should I Draw?",
        answer:
          "This page focuses on theme subjects for art practice. Other Spinifywheel pages may cover broader activity prompts.",
      },
      {
        question: "Can beginners use it?",
        answer:
          "Yes. Disable harder themes and keep everyday objects, animals, or simple landscapes for practice.",
      },
      {
        question: "Can I add my own prompts?",
        answer: "Yes. Edit any wedge or paste a bulk list of subjects you want to practice.",
      },
      {
        question: "Is it free?",
        answer: "Yes. Spinning and editing are free with no signup.",
      },
    ],
  }),
  "what-write": baseSpoke("what-write", {
    pageTitle: "What Theme Should I Write About? | Free Writing Theme Wheel",
    description:
      "What theme should I write about? Spin this free writing theme wheel for mystery, adventure, romance, sci-fi, and story prompts that beat writer's block.",
    h1: "What Theme Should I Write About?",
    shortTitle: "What Theme Should I Write About?",
    heroIntro:
      "Writer's block loves endless options. Spin this Writing Theme Wheel for mystery, adventure, romance, sci-fi, and more—or turn wedges into character, setting, and conflict prompts.",
    keywords: [
      "what theme should i write about",
      "writing theme ideas",
      "story theme spinner",
      "what should i write about",
      "random writing theme",
      ...THEME_PICKER_KEYWORDS,
    ],
    articleTitle: "How to pick a writing theme with a spin",
    articleIntro: [
      "“What theme should I write about?” is often genre hesitation. This page opens writing-ready themes so you can start a timed draft instead of reorganizing your notes again.",
      "After the spin, write for fifteen minutes before judging the idea. Customize genres for your project, classroom assignment, or critique group night.",
    ],
    uniqueSection: {
      title: "A fair exit from writer's block",
      intro: "Treat the spin as a starting constraint, not a forever commitment.",
      points: [
        {
          title: "Timed sprints",
          description: "Spin, then write without editing for a short sprint.",
        },
        {
          title: "Genre nights",
          description: "Writing clubs can share one theme and compare openings.",
        },
        {
          title: "Prompt packs",
          description: "Replace labels with your own story starters anytime.",
        },
      ],
    },
    tips: [
      "Remove genres you refuse before spinning so the result feels fair.",
      "Save a separate wheel for flash fiction vs longer projects.",
      "Visit the Writing Theme Wheel for the same preset from the template strip.",
    ],
    faq: [
      {
        question: "What is the What Theme Should I Write About wheel?",
        answer:
          "It is a free writing-theme spinner that randomly selects a story theme or genre prompt you can customize.",
      },
      {
        question: "Can I change themes into prompts?",
        answer:
          "Yes. Rename wedges into character, setting, conflict, or opening-line prompts.",
      },
      {
        question: "Does it work for classrooms?",
        answer:
          "Yes. Teachers can preload age-appropriate themes for timed writing exercises.",
      },
      {
        question: "Can I save my list?",
        answer: "Yes. Save custom wheels on this device in My Wheels.",
      },
      {
        question: "Is it free?",
        answer: "Yes. No account is required to spin.",
      },
    ],
  }),
  "what-party": baseSpoke("what-party", {
    pageTitle: "What Party Theme Should I Have? | Free Party Theme Wheel",
    description:
      "What party theme should I have? Spin this free party theme wheel for retro, beach, superhero, masquerade, and more celebration ideas you can customize.",
    h1: "What Party Theme Should I Have?",
    shortTitle: "What Party Theme Should I Have?",
    heroIntro:
      "Planning a celebration and stuck between vibes? Spin this Party Theme Wheel for retro disco, beach luau, superhero night, masquerade, and more—then customize for birthdays, holidays, or game nights.",
    keywords: [
      "what party theme should i have",
      "party theme ideas",
      "random party theme",
      "party theme picker",
      "birthday party theme wheel",
      ...THEME_PICKER_KEYWORDS,
    ],
    articleTitle: "How to pick a party theme with a spin",
    articleIntro: [
      "“What party theme should I have?” turns into a group-chat forever thread. This page loads party vibes so one fair spin sets decorations, playlist mood, and dress code direction.",
      "Trim options that do not fit the venue or budget first. Then let guests watch the wheel—acceptance goes up when everyone sees equal odds.",
    ],
    uniqueSection: {
      title: "For hosts who need a decision tonight",
      intro: "A visible spin beats another poll that splits the vote.",
      points: [
        {
          title: "Budget filter",
          description: "Disable expensive themes before you spin.",
        },
        {
          title: "Guest buy-in",
          description: "Spin live so the group owns the result together.",
        },
        {
          title: "Costume nights",
          description: "Pair with the Costume Theme Wheel when outfits matter most.",
        },
      ],
    },
    tips: [
      "Decide kids vs adult vibes before loading the wheel.",
      "Save separate lists for birthdays, holidays, and game nights.",
      "Open the Party Theme Wheel template for the same preset anytime.",
    ],
    faq: [
      {
        question: "What is the What Party Theme Should I Have wheel?",
        answer:
          "It is a free party-theme spinner with celebration vibes preloaded so hosts can pick a fair theme fast.",
      },
      {
        question: "Can I plan costumes with this page?",
        answer:
          "Yes for vibe direction. For character costume ideas, use the Costume Theme Wheel.",
      },
      {
        question: "Does it work for small gatherings?",
        answer:
          "Yes. Keep a short list of low-prep themes and spin once.",
      },
      {
        question: "Can I share the wheel with co-hosts?",
        answer:
          "Yes. Share a Create Custom Wheel link so everyone opens the same list.",
      },
      {
        question: "Is it free?",
        answer: "Yes. Spinning and editing are free.",
      },
    ],
  }),
  "what-video": baseSpoke("what-video", {
    pageTitle: "What Theme Should My Video Be? | Free Video Theme Wheel",
    description:
      "What theme should my video be? Spin this free video theme wheel for YouTube formats, challenges, tutorials, and content ideas you can customize.",
    h1: "What Theme Should My Video Be?",
    shortTitle: "What Theme Should My Video Be?",
    heroIntro:
      "Staring at a blank upload schedule? Spin this YouTube-focused Theme Picker for day-in-my-life, tutorials, challenges, storytime, reviews, and more—then edit the list for your niche.",
    keywords: [
      "what theme should my video be",
      "youtube video theme",
      "video idea wheel",
      "what should my next video be",
      "content theme spinner",
      ...THEME_PICKER_KEYWORDS,
    ],
    articleTitle: "How to pick a video theme with a spin",
    articleIntro: [
      "“What theme should my video be?” is a content-calendar problem. This page loads creator-friendly formats so you can choose a fair next upload concept and start scripting.",
      "For short-form clips, try the TikTok Theme Wheel. For longer uploads, keep this YouTube-style list, disable formats that do not fit your channel, and spin once.",
    ],
    uniqueSection: {
      title: "Creator-friendly decision making",
      intro: "Treat the spin as your next episode format, then customize titles later.",
      points: [
        {
          title: "Series variety",
          description: "Disable formats you posted recently to force fresh ideas.",
        },
        {
          title: "Collabs",
          description: "Let guests spin the concept live on stream.",
        },
        {
          title: "Niche swaps",
          description: "Rename wedges for gaming, beauty, tech, education, or vlogs.",
        },
      ],
    },
    tips: [
      "Match the format to your filming time before you spin.",
      "Save separate wheels for long-form vs Shorts/TikTok.",
      "Open the YouTube Theme Wheel or TikTok Theme Wheel for focused templates.",
    ],
    faq: [
      {
        question: "What is the What Theme Should My Video Be wheel?",
        answer:
          "It is a free video-theme spinner preloaded with creator formats so you can pick a fair next video idea.",
      },
      {
        question: "Does this work for TikTok too?",
        answer:
          "You can customize this list for short-form, or open the TikTok Theme Wheel for challenge-focused prompts.",
      },
      {
        question: "Can I add my own video ideas?",
        answer: "Yes. Edit any wedge or paste a bulk list of concepts.",
      },
      {
        question: "How do I avoid repeating formats?",
        answer:
          "Enable elimination mode or disable formats you already used this month.",
      },
      {
        question: "Is it free?",
        answer: "Yes. No account is required to spin.",
      },
    ],
  }),
}

export function getThemePickerSpoke(id: ThemePickerSpokeId): ThemePickerSpokeSeo {
  return THEME_PICKER_SPOKES[id]
}

export function getAllThemePickerSpokes(): ThemePickerSpokeSeo[] {
  return ALL_SPOKE_IDS.map((id) => THEME_PICKER_SPOKES[id])
}

export function getThemeSpokeSiblings(
  spoke: ThemePickerSpokeSeo,
): ThemePickerSpokeSeo[] {
  return spoke.siblingIds.map((id) => THEME_PICKER_SPOKES[id])
}

export const THEME_PICKER_POPULAR_SPOKE_LINKS = ALL_SPOKE_IDS.filter(
  (id) => id !== "pillar" && !QUESTION_SPOKE_IDS.has(id),
).map((id) => {
  const spoke = THEME_PICKER_SPOKES[id]
  return {
    id: spoke.id,
    href: spoke.path,
    label: spoke.shortTitle,
    description: spoke.heroIntro.slice(0, 90),
    accent: spoke.accent,
  }
})

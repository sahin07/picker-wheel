import { JJK_WHEEL_PATH, JJK_WHEEL_SITE_URL } from "@/lib/jjk-wheel-seo"
import { getJjkWheelUseCase, type JjkWheelUseCaseId } from "@/lib/jjk-wheel-use-cases"

export type JjkWheelSpokeId =
  | "jjk" | "jujutsu-kaisen" | "character" | "villain" | "cursed-spirit"
  | "domain" | "technique" | "grade-1" | "special-grade" | "student"
  | "teacher" | "favorite" | "team" | "mahoraga"

export type JjkWheelDeepLink = {
  useCaseId: JjkWheelUseCaseId
  config: NonNullable<ReturnType<typeof getJjkWheelUseCase>>["config"]
}

export type JjkWheelSpokeSeo = {
  id: JjkWheelSpokeId
  path: string
  pageTitle: string
  description: string
  h1: string
  shortTitle: string
  heroIntro: string
  keywords: readonly string[]
  articleTitle: string
  articleIntro: readonly string[]
  faq: readonly { question: string; answer: string }[]
  deepLink: JjkWheelDeepLink
  /** Optional lore / deep-dive blocks for the complete guide */
  guideSections?: readonly {
    id: string
    title: string
    intro?: string
    paragraphs?: readonly string[]
    points?: readonly { title: string; description: string }[]
  }[]
}

type Draft = Omit<JjkWheelSpokeSeo, "keywords" | "articleTitle" | "articleIntro" | "faq" | "deepLink"> & {
  useCaseId: JjkWheelUseCaseId
  keywords?: readonly string[]
  articleTitle?: string
  articleIntro?: readonly string[]
  faq?: readonly { question: string; answer: string }[]
  guideSections?: JjkWheelSpokeSeo["guideSections"]
}

const finalize = (draft: Draft): JjkWheelSpokeSeo => {
  const useCase = getJjkWheelUseCase(draft.useCaseId)
  if (!useCase) throw new Error(`Missing JJK use case: ${draft.useCaseId}`)
  return {
    id: draft.id,
    path: draft.path,
    pageTitle: draft.pageTitle,
    description: draft.description,
    h1: draft.h1,
    shortTitle: draft.shortTitle,
    heroIntro: draft.heroIntro,
    keywords: draft.keywords || [`${draft.shortTitle.toLowerCase()} wheel`, "jjk wheel", "Jujutsu Kaisen spinner"],
    articleTitle: draft.articleTitle || `How to Use the ${draft.h1}`,
    articleIntro: draft.articleIntro || [
      `${draft.h1} opens the same equal-odds JJK spinner with a focused preset already selected. Every enabled entry has one matching slice and the same chance to win.`,
      "You can change the list, add custom names and images, or use Elimination mode for no-repeat rounds. Results are for fan entertainment and creative challenges.",
    ],
    faq: draft.faq || [
      { question: `What is the ${draft.h1}?`, answer: `${draft.h1} is a ready-made JJK Spin Wheel picker template with a matching catalog filter and equal odds.` },
      { question: "Can I change the entries?", answer: "Yes. Toggle catalog entries, add custom names and images, or switch to another template at any time." },
      { question: "Can I prevent repeat winners?", answer: "Yes. Elimination mode disables each winner after the spin." },
      { question: "Is this official?", answer: "No. This independent fan tool is not affiliated with Gege Akutami, Shueisha, MAPPA, or Toho." },
    ],
    deepLink: { useCaseId: draft.useCaseId, config: useCase.config },
    guideSections: draft.guideSections,
  }
}

const spoke = (
  id: JjkWheelSpokeId, path: string, h1: string, shortTitle: string,
  useCaseId: JjkWheelUseCaseId, description: string,
): JjkWheelSpokeSeo => finalize({
  id, path, h1, shortTitle, useCaseId, description,
  pageTitle: `${h1} | Free Random Jujutsu Kaisen Spinner`,
  heroIntro: `${description} Spin with equal odds, customize the entries, or use elimination for no-repeat rounds.`,
})

export const JJK_WHEEL_SPOKES: Record<JjkWheelSpokeId, JjkWheelSpokeSeo> = {
  jjk: spoke("jjk", JJK_WHEEL_PATH, "JJK Spin Wheel picker", "JJK Wheel", "all", "Spin the full curated JJK character catalog."),
  "jujutsu-kaisen": finalize({
    id: "jujutsu-kaisen",
    path: "/jujutsu-kaisen-wheel",
    useCaseId: "all",
    pageTitle: "Jujutsu Kaisen Wheel | Random JJK Character Spinner",
    description: "Use a free Jujutsu Kaisen Wheel to pick a random character with equal odds, custom entries, and elimination mode.",
    h1: "Jujutsu Kaisen Wheel",
    shortTitle: "Jujutsu Kaisen",
    heroIntro: "Spin a random Jujutsu Kaisen character for fan challenges, team drafts, cosplay prompts, edits, and discussions.",
    keywords: ["jujutsu kaisen wheel", "jujutsu kaisen spinner", "random Jujutsu Kaisen character", "JJK character picker"],
    articleTitle: "Use the Jujutsu Kaisen Character Wheel",
    articleIntro: [
      "This brand-name twin of the JJK Spin Wheel picker hub opens the same complete character picker while providing a dedicated guide for Jujutsu Kaisen Wheel searches.",
      "Every enabled character has equal odds. You can narrow the list, upload custom images, and use Elimination mode for team drafts without repeats.",
    ],
  }),
  character: spoke("character", "/jjk-character-wheel", "JJK Character Wheel", "Characters", "all", "Pick a random JJK character from the full catalog."),
  villain: spoke("villain", "/jjk-villain-wheel", "JJK Villain Wheel", "Villains", "villains", "Randomize JJK villains and antagonists."),
  "cursed-spirit": spoke("cursed-spirit", "/jjk-cursed-spirit-wheel", "JJK Cursed Spirit Wheel", "Cursed Spirits", "cursed-spirits", "Spin among cursed spirits from the JJK catalog."),
  domain: finalize({
    id: "domain",
    path: "/jjk-domain-expansion-wheel",
    useCaseId: "domain",
    pageTitle: "JJK Domain Expansion Wheel | Free Random Jujutsu Kaisen Spinner",
    h1: "JJK Domain Expansion Wheel",
    shortTitle: "Domain Expansions",
    description:
      "Spin a free JJK Domain Expansion wheel for Unlimited Void, Malevolent Shrine, Chimera Shadow Garden, and more. Equal odds for fan challenges and prompts.",
    heroIntro:
      "Pick a named Domain Expansion at random. Spin with equal odds, customize the entries, or use elimination for no-repeat rounds.",
  }),
  technique: finalize({
    id: "technique",
    path: "/jjk-cursed-technique-wheel",
    useCaseId: "technique",
    pageTitle: "JJK Cursed Technique Wheel | Free Random Jujutsu Kaisen Spinner",
    h1: "JJK Cursed Technique Wheel",
    shortTitle: "Cursed Techniques",
    description:
      "Spin a free JJK Cursed Technique wheel for Limitless, Ten Shadows, Shrine, Boogie Woogie, and more. Equal-odds spins for fan games, edits, and creative prompts.",
    heroIntro:
      "Choose a cursed technique for a challenge or prompt. Spin with equal odds, customize the entries, or use elimination for no-repeat rounds.",
  }),
  "grade-1": spoke("grade-1", "/jjk-grade-1-sorcerer-wheel", "JJK Grade 1 Sorcerer Wheel", "Grade 1", "grade-1", "Spin a focused list of Grade 1 sorcerers."),
  "special-grade": spoke("special-grade", "/jjk-special-grade-wheel", "JJK Special Grade Wheel", "Special Grade", "special-grade", "Randomize special-grade sorcerers and curses."),
  student: spoke("student", "/jjk-student-wheel", "JJK Student Wheel", "Students", "students", "Pick a Tokyo or Kyoto Jujutsu High student."),
  teacher: spoke("teacher", "/jjk-teacher-wheel", "JJK Teacher Wheel", "Teachers", "teachers", "Pick a teacher or school staff character."),
  favorite: spoke("favorite", "/favorite-jjk-character-picker", "Favorite JJK Character Picker", "Fan Favorites", "favorites", "Spin a compact list of recognizable fan favorites."),
  team: spoke("team", "/jjk-team-generator", "JJK Team Generator", "Team Draft", "team", "Draft JJK students and sorcerers with elimination-friendly spins."),
  mahoraga: finalize({
    id: "mahoraga",
    path: "/jjk-mahoraga-wheel",
    useCaseId: "mahoraga",
    pageTitle: "JJK Mahoraga Wheel | Free Ten Shadows Shikigami Spinner",
    description:
      "Spin a free JJK Mahoraga wheel to pick Mahoraga or another Ten Shadows shikigami at random. Includes Megumi, related technique entries, and equal-odds spins for fan challenges.",
    h1: "JJK Mahoraga Wheel — Eight-Handled Sword Divergent Sila Divine General Mahoraga",
    shortTitle: "JJK Mahoraga Wheel",
    heroIntro:
      "Spin Mahoraga and the Ten Shadows shikigami with equal odds. Perfect for Megumi challenges, adaptation debates, fan edits, and no-repeat drafting with Elimination mode.",
    keywords: [
      "jjk mahoraga wheel",
      "mahoraga wheel",
      "mahoraga spinner",
      "mahoraga dharma chakra",
      "ten shadows wheel",
      "jjk shikigami wheel",
      "divine general mahoraga",
      "megumi shikigami spinner",
      "jjk wheel",
    ],
    articleTitle: "How to Use the JJK Mahoraga Wheel",
    articleIntro: [
      "If you’ve spent any time with Jujutsu Kaisen, you already know Mahoraga is not just another shikigami name on a list. The JJK Mahoraga Wheel loads a Ten Shadows–focused spinner so you can pick Mahoraga, Divine Dogs, Nue, Max Elephant, and the rest of the set at random—handy for challenges, edit prompts, or settling a “which shikigami next?” debate without scrolling a wiki page.",
      "Every enabled entry gets one equal slice. Toggle what you want on the wheel, add custom names if your group uses house rules, and switch to Elimination when you need no-repeat rounds. This page is a fan spinner first; the guide below is here if you want a quick refresher on why Mahoraga’s own wheel matters in the story.",
    ],
    guideSections: [
      {
        id: "mahoraga-dharma-chakra",
        title: "Mahoraga’s Wheel (the Dharma Chakra)",
        intro:
          "In the series, Mahoraga’s wheel—often talked about as the Dharma Chakra—is the visual cue for the shikigami’s infamous adaptation. Fans watch that wheel the same way you’d watch a countdown: when it moves, something on the battlefield is about to stop working the way it used to.",
        paragraphs: [
          "Think of it less like a prize spinner and more like a progress meter. Each click signals that Mahoraga is learning the phenomenon it just faced. Once the adaptation finishes, that attack or cursed technique no longer lands cleanly—and in some cases, Mahoraga can answer with a countermeasure of its own.",
          "The design isn’t random fluff either. The eight handles echo Buddhist symbolism tied to the Eightfold Path, which is why the “Dharma Chakra” nickname sticks so hard in fan discussions. You don’t need the full mythology lesson to enjoy a fight scene, but knowing the wheel is intentional symbolism makes those clicks feel heavier.",
        ],
        points: [
          {
            title: "What a click means",
            description:
              "When Mahoraga takes an attack or cursed technique, the wheel turns to show the adaptation has started. After a full click-through, that phenomenon loses its bite against the shikigami.",
          },
          {
            title: "The eight handles",
            description:
              "Those eight spokes aren’t just cool silhouette design. They’re rooted in Buddhist imagery—the Eightfold Path—so the wheel reads as both a weapon system and a mythic emblem.",
          },
          {
            title: "Sukuna’s clever use",
            description:
              "Ryomen Sukuna doesn’t always wait for Mahoraga to tank every hit in person. He can lean on the wheel’s adaptation logic himself, shifting the burden so Mahoraga is already primed against techniques like Gojo’s Limitless before the shikigami has to stand in the open.",
          },
        ],
      },
      {
        id: "mahoraga-adaptation",
        title: "How the adaptation process works (fan-friendly rundown)",
        paragraphs: [
          "Here’s the short version most viewers need: get hit → wheel turns → adaptation completes → the same trick won’t save you twice. That’s why fights against Mahoraga feel like a race. You either finish the fight before the wheel settles, or you invent a new angle that hasn’t been “learned” yet.",
          "That’s also why this spinner page pairs well with challenge games. Spin a shikigami, then invent a scenario: who adapts first, which technique fails after one click, or how Megumi might open without summoning Mahoraga immediately. The story’s rules give you plenty of prompts without needing spoilers for every arc.",
        ],
      },
      {
        id: "mahoraga-spin-vs-story",
        title: "This spinner vs Mahoraga’s story wheel",
        paragraphs: [
          "Quick clarification so nobody mixes the two up: the interactive wheel above is an equal-odds random picker for fan use. Mahoraga’s Dharma Chakra in Jujutsu Kaisen is a story device for adaptation—not a lottery that chooses winners for your group chat.",
          "Use this page to pick Ten Shadows entries fairly. Use the lore notes when you want context for edits, debates, or classroom anime clubs talking through why that floating wheel is such a big deal on screen.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the JJK Mahoraga Wheel?",
        answer:
          "It’s a ready-made Jujutsu Kaisen spinner focused on Mahoraga and Ten Shadows shikigami (plus related entries like Megumi and the Ten Shadows technique). Every enabled option has equal odds.",
      },
      {
        question: "What is Mahoraga’s Dharma Chakra wheel in the story?",
        answer:
          "It’s the wheel on Mahoraga that marks adaptation. When it turns and clicks through, Mahoraga gains resistance or a countermeasure to the attack or cursed technique it just faced.",
      },
      {
        question: "Why does Mahoraga’s wheel have eight handles?",
        answer:
          "The eight handles tie into Buddhist symbolism associated with the Eightfold Path. In fan discussion, that symbolism is why people call it the Dharma Chakra.",
      },
      {
        question: "How did Sukuna use Mahoraga’s wheel against Gojo?",
        answer:
          "In short: Sukuna used the adaptation system cleverly—bearing hits in a way that let Mahoraga’s process advance—so the fight wasn’t only “summon Mahoraga and hope.” The wheel’s progress is part of how Infinity stopped being a free win condition. Exact fight beats are best watched in the series itself.",
      },
      {
        question: "Can I change the shikigami list on this page?",
        answer:
          "Yes. Toggle catalog entries, add custom names or images, or switch to another JJK template anytime.",
      },
      {
        question: "Can I prevent repeat winners?",
        answer:
          "Yes. Elimination mode disables each winner after the spin so drafts and multi-round challenges stay fresh.",
      },
      {
        question: "Is this an official Jujutsu Kaisen tool?",
        answer:
          "No. This independent fan tool is not affiliated with Gege Akutami, Shueisha, MAPPA, or Toho.",
      },
    ],
  }),
}

const EVERGREEN: JjkWheelSpokeId[] = [
  "jjk", "jujutsu-kaisen", "character", "villain", "cursed-spirit", "domain",
  "technique", "student", "teacher", "grade-1", "special-grade", "mahoraga", "favorite", "team",
]

export const JJK_WHEEL_POPULAR_SPOKE_LINKS = EVERGREEN.map((id) => {
  const item = JJK_WHEEL_SPOKES[id]
  const useCase = getJjkWheelUseCase(item.deepLink.useCaseId)!
  return { id, label: item.shortTitle, href: item.path, description: item.description, accent: useCase.accent }
})

export function getJjkWheelSpoke(id: JjkWheelSpokeId) {
  return JJK_WHEEL_SPOKES[id]
}

export function getAllJjkWheelSpokes() {
  return EVERGREEN.map((id) => JJK_WHEEL_SPOKES[id])
}

export function getJjkSpokeSiblings(spoke: JjkWheelSpokeSeo) {
  return getAllJjkWheelSpokes().filter((item) => item.id !== spoke.id)
}

export function jjkSpokeUrl(path: string) {
  return `${JJK_WHEEL_SITE_URL}${path}`
}

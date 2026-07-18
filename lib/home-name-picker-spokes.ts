import { HOME_PATH, HOME_SITE_URL } from "@/lib/home-seo"
import {
  getHomeNameTemplate,
  type HomeNameTemplateId,
} from "@/lib/home-name-templates-data"

export type HomeNameSpokeId =
  | "classroom"
  | "giveaway"
  | "secret-santa"
  | "presentation"

export type HomeNameDeepLink = {
  templateId: HomeNameTemplateId
  toolTitle?: string
  toolDescription?: string
}

export type HomeNameSpokeFaq = {
  question: string
  answer: string
}

export type HomeNameSpokeSeo = {
  id: HomeNameSpokeId
  path: string
  pageTitle: string
  description: string
  keywords: readonly string[]
  h1: string
  shortTitle: string
  heroIntro: string
  audience: string
  articleTitle: string
  articleIntro: readonly string[]
  uniqueSection: { title: string; body: string }
  faq: readonly HomeNameSpokeFaq[]
  siblingIds: readonly HomeNameSpokeId[]
  deepLink: HomeNameDeepLink
}

const SPOKE_COPY: Record<
  HomeNameSpokeId,
  {
    path: string
    h1: string
    audience: string
    keywords: readonly string[]
    heroIntro: string
    articleIntro: readonly string[]
    uniqueSection: { title: string; body: string }
  }
> = {
  classroom: {
    path: "/classroom-name-picker",
    h1: "Classroom Name Picker",
    audience: "Teachers",
    keywords: [
      "classroom name picker",
      "student name picker",
      "random student picker",
      "classroom wheel",
      "random name picker",
    ],
    heroIntro:
      "Pick a student fairly for questions, helpers, reading turns, or group activities. This page opens the Random Name Picker with a classroom template already loaded—replace the sample names with your roster and spin.",
    articleIntro: [
      "The Classroom Name Picker is a focused Random Name Picker preset for teachers. It loads sample student names so you can see how the wheel works, then swap in your real class list.",
      "Use it for cold-calling, reading turns, quiz volunteers, and presentation helpers. Enable remove-winner when each student should only be picked once per round, and use fullscreen when projecting for the class.",
    ],
    uniqueSection: {
      title: "Classroom tips for fair student picks",
      body: "Check the roster for duplicate first names before spinning if every student should have one equal chance. Disable absent students instead of deleting them so you can re-enable tomorrow. For presentation order, spin once per slot with remove-winner on so the sequence stays unique.",
    },
  },
  giveaway: {
    path: "/giveaway-name-picker",
    h1: "Giveaway Name Picker",
    audience: "Creators & businesses",
    keywords: [
      "giveaway name picker",
      "raffle name picker",
      "random winner picker",
      "contest winner spinner",
      "random name picker",
    ],
    heroIntro:
      "Draw contest and raffle winners in a way your audience can see. This page loads a giveaway template on the Random Name Picker—paste entrants, spin once, and announce a transparent winner.",
    articleIntro: [
      "The Giveaway Name Picker is built for creators and businesses who need a clear, visible random winner. Sample entrants load first so you can test the spin, then replace them with your real list from a form, spreadsheet, or comments.",
      "Turn on remove-winner for multi-prize draws so the same person is not selected twice. Keep weights equal unless a contest rule intentionally changes odds—and always follow platform rules and local laws for official promotions.",
    ],
    uniqueSection: {
      title: "Running a transparent prize draw",
      body: "Paste one entrant per line, remove blanks and duplicates if each person should have one chance, then spin while recording or projecting the wheel. For second and third prizes, leave remove-winner on so earlier winners leave the list. This tool helps with fairness and visibility—it is not legal advice for regulated contests.",
    },
  },
  "secret-santa": {
    path: "/secret-santa-name-picker",
    h1: "Secret Santa Name Picker",
    audience: "Holiday events",
    keywords: [
      "secret santa name picker",
      "secret santa spinner",
      "gift exchange picker",
      "holiday name wheel",
      "random name picker",
    ],
    heroIntro:
      "Draw who buys for whom at gift exchanges without awkward debates. This page opens the Random Name Picker with a Secret Santa template—swap in your group names and spin fair pairings.",
    articleIntro: [
      "The Secret Santa Name Picker helps families, friends, and offices assign gift-exchange partners at random. Sample names load so the wheel is ready; replace them with everyone in the exchange.",
      "For classic Secret Santa, spin one name at a time with remove-winner so each person is drawn once as a recipient. If someone draws themselves, spin again for that person or reshuffle the remaining list.",
    ],
    uniqueSection: {
      title: "Gift-exchange drawing tips",
      body: "Add every participant before the first spin. Use remove-winner so recipients are unique. If couples or teams should not draw each other, remove restricted pairs manually after a conflict, then continue. Keep the spin visible so the group trusts the draw.",
    },
  },
  presentation: {
    path: "/presentation-order-picker",
    h1: "Presentation Order Picker",
    audience: "Schools & meetings",
    keywords: [
      "presentation order picker",
      "who goes first spinner",
      "presentation order wheel",
      "meeting speaker picker",
      "random name picker",
    ],
    heroIntro:
      "Decide who presents first without debate. This page loads a presentation-order template on the Random Name Picker—replace the sample groups or names, then spin a fair speaking sequence.",
    articleIntro: [
      "The Presentation Order Picker is for classrooms, meetings, and workshops that need a transparent speaking order. Sample groups load first; swap them for student names, team labels, or agenda speakers.",
      "Spin with remove-winner on to build a full order: first spin is who goes first, next spin is second, and so on. Fullscreen mode helps when the whole room needs to see the result.",
    ],
    uniqueSection: {
      title: "Building a fair speaking order",
      body: "List every speaker or group before you start. Enable remove-winner so each name appears once in the sequence. If someone is absent, disable their slice and continue—re-enable them later without rebuilding the list.",
    },
  },
}

const ALL_SPOKE_IDS = Object.keys(SPOKE_COPY) as HomeNameSpokeId[]

function getTemplate(id: HomeNameTemplateId) {
  return getHomeNameTemplate(id)!
}

function buildFaq(h1: string, topic: string): readonly HomeNameSpokeFaq[] {
  return [
    {
      question: `What is the ${h1}?`,
      answer: `The ${h1} is a Random Name Picker page preloaded with a ${topic} template so you can spin fair picks without building the list from scratch.`,
    },
    {
      question: "Can I replace the sample names?",
      answer:
        "Yes. Edit the list, paste your own names in the Text tab, or clear and rebuild. Sample names are only a starting point.",
    },
    {
      question: "Is every name equally likely?",
      answer:
        "Yes, when weights are equal. Duplicate names or higher weights increase that entry’s chance. Use remove-winner for unique picks across rounds.",
    },
    {
      question: "Is it free?",
      answer: `Yes. You can use the ${h1} online for free with no signup.`,
    },
  ]
}

function buildSpoke(id: HomeNameSpokeId): HomeNameSpokeSeo {
  const copy = SPOKE_COPY[id]
  const template = getTemplate(id)
  const topic = copy.h1.replace(/ Picker$/i, "").toLowerCase()

  return {
    id,
    path: copy.path,
    pageTitle: `${copy.h1} | Free Random Name Picker`,
    description: `Use the free ${copy.h1} to spin fair random names. A Random Name Picker template for ${copy.audience.toLowerCase()}—replace sample names, customize, and spin.`,
    keywords: copy.keywords,
    h1: copy.h1,
    shortTitle: copy.h1,
    heroIntro: copy.heroIntro,
    audience: copy.audience,
    articleTitle: `How to use the ${copy.h1}`,
    articleIntro: copy.articleIntro,
    uniqueSection: copy.uniqueSection,
    faq: buildFaq(copy.h1, topic),
    siblingIds: ALL_SPOKE_IDS.filter((sibling) => sibling !== id),
    deepLink: {
      templateId: id,
      toolTitle: copy.h1,
      toolDescription: template.description,
    },
  }
}

export const HOME_NAME_SPOKES: Record<HomeNameSpokeId, HomeNameSpokeSeo> = {
  classroom: buildSpoke("classroom"),
  giveaway: buildSpoke("giveaway"),
  "secret-santa": buildSpoke("secret-santa"),
  presentation: buildSpoke("presentation"),
}

export function getHomeNameSpoke(id: HomeNameSpokeId): HomeNameSpokeSeo {
  return HOME_NAME_SPOKES[id]
}

export function homeSpokeUrl(path: string): string {
  return `${HOME_SITE_URL}${path}`
}

export function getHomeSpokeSiblings(spoke: HomeNameSpokeSeo): HomeNameSpokeSeo[] {
  return spoke.siblingIds.map((id) => HOME_NAME_SPOKES[id])
}

/** Hub template strip → dedicated page when one exists */
export function getHomeNameTemplateHref(id: HomeNameTemplateId): string | null {
  if (id === "classroom" || id === "giveaway" || id === "secret-santa" || id === "presentation") {
    return HOME_NAME_SPOKES[id].path
  }
  if (id === "team") return "/team-picker"
  return null
}

export { HOME_PATH }

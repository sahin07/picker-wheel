import { DATE_PICKER_PATH, DATE_PICKER_SITE_URL } from "@/lib/date-picker-seo"
import {
  getDatePickerUseCase,
  type DatePickerUseCaseId,
} from "@/lib/date-picker-use-cases"

export type DatePickerSpokeId = "next-30" | "challenge-30" | "workdays" | "weekends"

export type DatePickerDeepLink = {
  preset: DatePickerUseCaseId
  toolTitle?: string
  toolDescription?: string
}

export type DatePickerSpokeFaq = {
  question: string
  answer: string
}

export type DatePickerSpokeSeo = {
  id: DatePickerSpokeId
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
  faq: readonly DatePickerSpokeFaq[]
  siblingIds: readonly DatePickerSpokeId[]
  deepLink: DatePickerDeepLink
}

const SPOKE_META: Record<
  DatePickerSpokeId,
  { path: string; audience: string; h1: string }
> = {
  "next-30": {
    path: "/random-date-wheel",
    audience: "Planners & organizers",
    h1: "Random Date Wheel",
  },
  "challenge-30": {
    path: "/30-day-challenge-wheel",
    audience: "Habits & challenges",
    h1: "30-Day Challenge Wheel",
  },
  workdays: {
    path: "/workday-date-wheel",
    audience: "Teams & meetings",
    h1: "Workday Date Wheel",
  },
  weekends: {
    path: "/weekend-date-wheel",
    audience: "Families & leisure",
    h1: "Weekend Date Wheel",
  },
}

const ALL_SPOKE_IDS = Object.keys(SPOKE_META) as DatePickerSpokeId[]

function buildFaq(h1: string, topic: string): readonly DatePickerSpokeFaq[] {
  return [
    {
      question: `What is the ${h1}?`,
      answer: `The ${h1} is a Date Picker Wheel template preloaded with ${topic} so you can spin a fair calendar day without building the list from scratch.`,
    },
    {
      question: "Can I change the dates after loading?",
      answer:
        "Yes. Add or remove dates, adjust weekday filters, change formats, and save the setup in My Wheels.",
    },
    {
      question: "Is every date equally likely?",
      answer:
        "Yes. Each enabled date on the wheel has an equal chance. Use elimination mode to remove winners after each spin.",
    },
    {
      question: "Is it free?",
      answer: `Yes. You can spin the ${h1} online for free.`,
    },
  ]
}

function buildSpoke(id: DatePickerSpokeId): DatePickerSpokeSeo {
  const useCase = getDatePickerUseCase(id)!
  const meta = SPOKE_META[id]
  const topic = meta.h1.replace(/ Wheel$/i, "").toLowerCase()

  return {
    id,
    path: meta.path,
    pageTitle: `${meta.h1} | Spin a Random Date Online`,
    description: `Spin the ${meta.h1} to pick a random date. A free Date Picker Wheel template for ${meta.audience.toLowerCase()}—filter weekdays, customize formats, and spin fair calendar picks.`,
    keywords: [
      meta.h1.toLowerCase(),
      "date picker wheel",
      "random date picker",
      "date wheel",
      topic,
    ],
    h1: meta.h1,
    shortTitle: meta.h1,
    heroIntro: `${useCase.description} This page loads the Date Picker Wheel with ${topic} ready to spin, then lets you customize filters and formats.`,
    audience: meta.audience,
    articleTitle: `How to use the ${meta.h1}`,
    articleIntro: [
      `The ${meta.h1} is a focused Date Picker Wheel preset. It opens with ${topic} already on the spinner so you can start spinning right away.`,
      "Unlike a booking calendar, this tool randomly chooses among the dates you enable. Filter weekdays, change formats, and save setups in My Wheels.",
    ],
    uniqueSection: {
      title: `Why use a ${meta.h1}?`,
      body: `Built for ${meta.audience.toLowerCase()}, this template gives you a ready date list, equal-chance spins, and the same customize tools as the main Date Picker Wheel.`,
    },
    faq: buildFaq(meta.h1, topic),
    siblingIds: ALL_SPOKE_IDS.filter((sibling) => sibling !== id),
    deepLink: {
      preset: id,
      toolTitle: useCase.config.toolTitle,
      toolDescription: useCase.config.toolDescription,
    },
  }
}

export const DATE_PICKER_SPOKES: Record<DatePickerSpokeId, DatePickerSpokeSeo> = {
  "next-30": buildSpoke("next-30"),
  "challenge-30": buildSpoke("challenge-30"),
  workdays: buildSpoke("workdays"),
  weekends: buildSpoke("weekends"),
}

export function getDatePickerSpoke(id: DatePickerSpokeId): DatePickerSpokeSeo {
  return DATE_PICKER_SPOKES[id]
}

export function dateSpokeUrl(path: string): string {
  return `${DATE_PICKER_SITE_URL}${path}`
}

export function getDateSpokeSiblings(spoke: DatePickerSpokeSeo): DatePickerSpokeSeo[] {
  return spoke.siblingIds.map((id) => DATE_PICKER_SPOKES[id])
}

export { DATE_PICKER_PATH }

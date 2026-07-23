import type {
  FortniteWheelUseCaseConfig,
  FortniteWheelUseCaseId,
} from "@/lib/fortnite-wheel-use-cases"

export type FortniteWheelSpokeFaq = {
  question: string
  answer: string
}

export type FortniteWheelSpokeSeo = {
  id: FortniteWheelUseCaseId
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
  faq: readonly FortniteWheelSpokeFaq[]
  siblingIds: readonly FortniteWheelUseCaseId[]
  deepLink: {
    useCaseId: FortniteWheelUseCaseId
    config: FortniteWheelUseCaseConfig
  }
}

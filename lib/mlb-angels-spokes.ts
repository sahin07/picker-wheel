import {
  MLB_ANGELS_NICKNAME_ARTICLE_INTRO,
  MLB_ANGELS_NICKNAME_ARTICLE_TITLE,
  MLB_ANGELS_NICKNAME_FAQ,
  MLB_ANGELS_NICKNAME_H1,
  MLB_ANGELS_NICKNAME_HERO_INTRO,
  MLB_ANGELS_NICKNAME_KEYWORDS,
  MLB_ANGELS_NICKNAME_PAGE_DESCRIPTION,
  MLB_ANGELS_NICKNAME_PAGE_TITLE,
  MLB_ANGELS_NICKNAME_SHORT_TITLE,
  MLB_ANGELS_NICKNAME_WHEEL_PATH,
  MLB_ANGELS_WHEEL_SITE_URL,
} from "@/lib/mlb-angels-seo"
import {
  getMlbAngelsUseCase,
  type MlbAngelsUseCaseConfig,
  type MlbAngelsUseCaseId,
} from "@/lib/mlb-angels-use-cases"
import { MLB_WHEEL_PATH } from "@/lib/mlb-wheel-seo"

export type MlbAngelsSpokeId = "angels-nickname"

export type MlbAngelsDeepLink = {
  useCaseId: MlbAngelsUseCaseId
  config: MlbAngelsUseCaseConfig
}

export type MlbAngelsSpokeSeo = {
  id: MlbAngelsSpokeId
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
  deepLink: MlbAngelsDeepLink
  uniqueSection: {
    title: string
    intro: string
    points: readonly { title: string; description: string }[]
  }
}

export function mlbAngelsSpokeUrl(path: string): string {
  return `${MLB_ANGELS_WHEEL_SITE_URL}${path}`
}

function configFor(id: MlbAngelsUseCaseId): MlbAngelsUseCaseConfig {
  const useCase = getMlbAngelsUseCase(id)
  if (!useCase) throw new Error(`Missing Angels use case: ${id}`)
  return useCase.config
}

export const MLB_ANGELS_SPOKES: Record<MlbAngelsSpokeId, MlbAngelsSpokeSeo> = {
  "angels-nickname": {
    id: "angels-nickname",
    path: MLB_ANGELS_NICKNAME_WHEEL_PATH,
    pageTitle: MLB_ANGELS_NICKNAME_PAGE_TITLE,
    description: MLB_ANGELS_NICKNAME_PAGE_DESCRIPTION,
    h1: MLB_ANGELS_NICKNAME_H1,
    shortTitle: MLB_ANGELS_NICKNAME_SHORT_TITLE,
    heroIntro: MLB_ANGELS_NICKNAME_HERO_INTRO,
    keywords: MLB_ANGELS_NICKNAME_KEYWORDS,
    articleTitle: MLB_ANGELS_NICKNAME_ARTICLE_TITLE,
    articleIntro: MLB_ANGELS_NICKNAME_ARTICLE_INTRO,
    faq: MLB_ANGELS_NICKNAME_FAQ,
    uniqueSection: {
      title: "Why an Angels nickname wheel?",
      intro:
        "Team wheels pick franchises. This spoke picks the stories fans actually remember—Halos nicknames with player context.",
      points: [
        {
          title: "Trivia-ready results",
          description: "Each spin shows nickname, player, position, years, meaning, and a famous moment.",
        },
        {
          title: "Legends & current filters",
          description: "Switch between full catalog, legends mode, and current-era players in the sidebar.",
        },
        {
          title: "Part of the MLB hub",
          description: `Return to ${MLB_WHEEL_PATH} for team wheels, divisions, and the full MLB cluster.`,
        },
      ],
    },
    deepLink: { useCaseId: "all-nicknames", config: configFor("all-nicknames") },
  },
}

export function getMlbAngelsSpoke(id: MlbAngelsSpokeId): MlbAngelsSpokeSeo {
  const spoke = MLB_ANGELS_SPOKES[id]
  if (!spoke) throw new Error(`Missing Angels spoke: ${id}`)
  return spoke
}

export function getMlbAngelsSpokeSiblings(_spoke: MlbAngelsSpokeSeo): MlbAngelsSpokeSeo[] {
  return Object.values(MLB_ANGELS_SPOKES).filter((item) => item.id !== _spoke.id)
}

import { HOME_SITE_URL } from "@/lib/home-seo"
import { MLB_WHEEL_PATH } from "@/lib/mlb-wheel-seo"

export const MLB_ANGELS_WHEEL_SITE_URL = HOME_SITE_URL
export const MLB_ANGELS_NICKNAME_WHEEL_PATH = "/mlb-angels-nickname-wheel"
export const MLB_ANGELS_NICKNAME_WHEEL_URL = `${MLB_ANGELS_WHEEL_SITE_URL}${MLB_ANGELS_NICKNAME_WHEEL_PATH}`
export const MLB_ANGELS_WHEEL_OG_IMAGE_URL = `${MLB_ANGELS_WHEEL_SITE_URL}/og/mlb-picker-wheel.svg`

export const MLB_ANGELS_NICKNAME_PAGE_TITLE =
  "MLB Angels Nickname Wheel | Random Los Angeles Angels Player Nicknames"

export const MLB_ANGELS_NICKNAME_PAGE_DESCRIPTION =
  "Spin the free MLB Angels Nickname Wheel to pick a random Los Angeles Angels player nickname. See the player, position, years with the Angels, meaning, and famous moment—perfect for trivia and fan games."

export const MLB_ANGELS_NICKNAME_H1 = "MLB Angels Nickname Wheel"

export const MLB_ANGELS_NICKNAME_SHORT_TITLE = "Angels Nicknames"

export const MLB_ANGELS_NICKNAME_HERO_INTRO =
  "Spin a random Los Angeles Angels nickname—from Mike Trout’s Millville Meteor to Shohei Ohtani’s Showtime. Each result shows the player, position, years with the Angels, why the nickname exists, and a famous moment."

export const MLB_ANGELS_NICKNAME_KEYWORDS = [
  "mlb angels nickname",
  "los angeles angels nicknames",
  "angels player nicknames",
  "angels nickname wheel",
  "random angels nickname",
  "angels nickname picker",
  "mike trout nickname",
  "shohei ohtani nickname",
  "angels legends nicknames",
  "mlb nickname wheel",
] as const

export const MLB_ANGELS_NICKNAME_DISCLAIMER =
  "Independent fan tool for trivia and entertainment. Not affiliated with Major League Baseball, the Los Angeles Angels, or any player. Nicknames and facts are curated reference notes—not official biographies."

export const MLB_ANGELS_NICKNAME_ARTICLE_TITLE = "Spin the Angels Nickname Wheel"

export const MLB_ANGELS_NICKNAME_ARTICLE_INTRO = [
  "The MLB Angels Nickname Wheel turns famous Halo nicknames into a fair, visual spinner. Load the full catalog—or filter to legends or current-era players—then spin to land on a nickname with player context and story.",
  "Use it for trivia warm-ups, stream segments, group chats, and classroom-style baseball quizzes. Every enabled nickname has equal odds unless you remove entries or switch to Elimination mode.",
  MLB_ANGELS_NICKNAME_DISCLAIMER,
] as const

export const MLB_ANGELS_NICKNAME_FAQ = [
  {
    question: "What is the MLB Angels Nickname Wheel?",
    answer:
      "It is a free spoke page under the MLB Picker Wheel hub that randomly selects a Los Angeles Angels player nickname and shows player details, meaning, and a famous moment.",
  },
  {
    question: "Does it include Mike Trout and Shohei Ohtani nicknames?",
    answer:
      "Yes. The catalog includes The Millville Meteor (Trout), Showtime (Ohtani), and other well-known Angels nicknames from franchise history.",
  },
  {
    question: "Can I filter legends vs current players?",
    answer:
      "Yes. Use All Nicknames, Legends Mode, or Current Players Mode in the sidebar to change which nicknames appear on the wheel.",
  },
  {
    question: "Is every nickname equally likely?",
    answer:
      "Yes. Each enabled nickname on the wheel has equal odds. Disable entries in the list or use Elimination to change the pool after each spin.",
  },
  {
    question: "Where is the main MLB Picker Wheel?",
    answer: `Open the MLB team hub at ${MLB_WHEEL_PATH} for all 30 franchises, division templates, and the full MLB guide.`,
  },
  {
    question: "Is this an official MLB or Angels tool?",
    answer:
      "No. This is an independent fan spinner for entertainment and trivia—not an official MLB, Angels, or player-endorsed product.",
  },
] as const

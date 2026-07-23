import {
  PRIZE_WHEEL_PAGE_DESCRIPTION,
  PRIZE_WHEEL_PAGE_TITLE,
  PRIZE_WHEEL_PATH,
  PRIZE_WHEEL_SITE_URL,
} from "@/lib/prize-wheel-seo"
import {
  getPrizeWheelUseCase,
  type PrizeWheelUseCaseAccent,
  type PrizeWheelUseCaseConfig,
  type PrizeWheelUseCaseId,
} from "@/lib/prize-wheel-use-cases"

export type PrizeWheelSpokeId =
  | "prize"
  | "spin-to-win"
  | "giveaway"
  | "discount"
  | "reward"
  | "lucky"
  | "coupon"
  | "classroom"
  | "trade-show"
  | "fundraising"
  | "holiday"
  | "birthday"
  | "customer"

export type PrizeWheelDeepLink = {
  useCaseId: PrizeWheelUseCaseId
  config: PrizeWheelUseCaseConfig
}

export type PrizeWheelSpokeFaq = {
  question: string
  answer: string
}

export type PrizeWheelSpokeSeo = {
  id: PrizeWheelSpokeId
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
  faq: readonly PrizeWheelSpokeFaq[]
  siblingIds: readonly PrizeWheelSpokeId[]
  deepLink: PrizeWheelDeepLink
  accent: PrizeWheelUseCaseAccent
}

export function prizeSpokeUrl(path: string): string {
  return `${PRIZE_WHEEL_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

const ALL_SPOKE_IDS: PrizeWheelSpokeId[] = [
  "prize",
  "spin-to-win",
  "giveaway",
  "discount",
  "reward",
  "lucky",
  "coupon",
  "classroom",
  "trade-show",
  "fundraising",
  "holiday",
  "birthday",
  "customer",
]

const USE_CASE_BY_SPOKE: Record<PrizeWheelSpokeId, PrizeWheelUseCaseId> = {
  prize: "custom",
  "spin-to-win": "discount",
  giveaway: "giveaway",
  discount: "discount",
  reward: "loyalty",
  lucky: "giveaway",
  coupon: "discount",
  classroom: "classroom",
  "trade-show": "trade-show",
  fundraising: "fundraising",
  holiday: "holiday",
  birthday: "birthday",
  customer: "loyalty",
}

function configFor(id: PrizeWheelUseCaseId): PrizeWheelUseCaseConfig {
  return getPrizeWheelUseCase(id)?.config ?? getPrizeWheelUseCase("custom")!.config
}

function baseFaq(label: string): PrizeWheelSpokeFaq[] {
  return [
    {
      question: `What is the ${label}?`,
      answer: `The ${label} is a free online spinner for selecting prizes, rewards, and promotional offers with an engaging visual spin.`,
    },
    {
      question: "Can I add custom prizes?",
      answer:
        "Yes. Add your own prize names, colors, optional images, and prize-specific winning messages.",
    },
    {
      question: "Does every prize have the same chance?",
      answer:
        "Yes. Every enabled prize has an equal chance of being selected. Disable an unavailable prize before spinning.",
    },
    {
      question: "Can I remove a prize after it is won?",
      answer:
        "Yes. Remove a selected prize when it is available once, or leave it enabled when it can be awarded again.",
    },
  ]
}

type PrizeWheelSpokeDraft = Omit<
  PrizeWheelSpokeSeo,
  "faq" | "siblingIds" | "deepLink"
> & {
  faq?: readonly PrizeWheelSpokeFaq[]
}

function finalize(draft: PrizeWheelSpokeDraft): PrizeWheelSpokeSeo {
  const useCaseId = USE_CASE_BY_SPOKE[draft.id]
  return {
    ...draft,
    faq: draft.faq ?? baseFaq(draft.h1),
    siblingIds: ALL_SPOKE_IDS.filter((id) => id !== draft.id).slice(0, 8),
    deepLink: { useCaseId, config: configFor(useCaseId) },
  }
}

export const PRIZE_WHEEL_SPOKES: Record<PrizeWheelSpokeId, PrizeWheelSpokeSeo> = {
  prize: finalize({
    id: "prize",
    path: PRIZE_WHEEL_PATH,
    pageTitle: PRIZE_WHEEL_PAGE_TITLE,
    description: PRIZE_WHEEL_PAGE_DESCRIPTION,
    h1: "Prize Wheel Spinner",
    shortTitle: "Prize Wheel Spinner",
    heroIntro:
      "Create a custom prize wheel for giveaways, promotions, classrooms, and events. Add prizes, images, colors, and winning messages, then spin for an equal-chance result.",
    keywords: ["prize wheel spinner", "free prize wheel", "online prize spinner", "wheel of prizes"],
    articleTitle: "Create a custom Prize Wheel Spinner",
    articleIntro: [
      "Turn any prize list into an interactive wheel that is easy for participants to follow.",
      "Start with four equal prizes, personalize every segment, and save the setup for your next activity.",
    ],
    uniqueSection: {
      title: "Everything your prize activity needs",
      intro: "Build a clear, colorful prize experience without extra software.",
      points: [
        { title: "Prize details", description: "Add names, images, colors, and winning messages." },
        { title: "Equal chance", description: "Every enabled prize uses the same selection chance." },
        { title: "Reusable setup", description: "Save locally and return to your wheel later." },
      ],
    },
    accent: "amber",
  }),
  "spin-to-win": finalize({
    id: "spin-to-win",
    path: "/spin-to-win-wheel",
    pageTitle: "Spin to Win Wheel | Create a Free Promotional Spinner",
    description:
      "Create a free spin to win wheel for customer promotions, pop-ups, classrooms, and events. Add custom offers, colors, images, and winning messages.",
    h1: "Spin to Win Wheel",
    shortTitle: "Spin to Win Wheel",
    heroIntro:
      "Build an interactive spin to win promotion with discounts, free shipping, samples, and surprise offers. Customize the wheel to match your campaign.",
    keywords: ["spin to win wheel", "spin to win spinner", "promotional wheel", "event spin wheel"],
    articleTitle: "Launch an engaging spin to win promotion",
    articleIntro: [
      "A spin to win wheel turns a simple offer into an interactive moment for customers or event guests.",
      "Use the discount preset, then replace each segment with the offers available in your campaign.",
    ],
    uniqueSection: {
      title: "Designed for audience participation",
      intro: "Make the rules easy to understand and the result easy to celebrate.",
      points: [
        { title: "Campaign offers", description: "Mix discounts, gifts, and service perks." },
        { title: "On-brand design", description: "Match segment colors to your promotion." },
        { title: "Clear next steps", description: "Show redemption instructions in the winning message." },
      ],
    },
    accent: "emerald",
  }),
  giveaway: finalize({
    id: "giveaway",
    path: "/giveaway-prize-wheel",
    pageTitle: "Giveaway Prize Wheel | Free Spinner for Prizes & Merch",
    description:
      "Create a free giveaway prize wheel with custom merchandise, stickers, shoutouts, and gifts. Spin with equal chance and celebrate every result.",
    h1: "Giveaway Prize Wheel",
    shortTitle: "Giveaway Prize Wheel",
    heroIntro:
      "Add merchandise, stickers, shoutouts, and special gifts to a visual giveaway wheel. Every enabled prize has equal chance, with custom messages for recipients.",
    keywords: ["giveaway prize wheel", "giveaway wheel spinner", "merch giveaway wheel", "prize giveaway spinner"],
    articleTitle: "Make your giveaway reveal memorable",
    articleIntro: [
      "A visual spin builds anticipation while keeping the available prizes clear.",
      "Use the giveaway preset as-is or replace every segment with your campaign rewards.",
    ],
    uniqueSection: {
      title: "A transparent giveaway experience",
      intro: "Show all available prizes and use equal selection chance for each enabled segment.",
      points: [
        { title: "Visible prize list", description: "Participants can see every enabled reward." },
        { title: "Recipient messages", description: "Add fulfillment details to each result." },
        { title: "Inventory control", description: "Remove one-time prizes after they are won." },
      ],
    },
    accent: "amber",
  }),
  discount: finalize({
    id: "discount",
    path: "/discount-wheel",
    pageTitle: "Discount Wheel | Create a Free Spin for Customer Offers",
    description:
      "Create a discount wheel with percentage offers, free shipping, and mystery deals. Customize colors and messages for stores, pop-ups, and online promotions.",
    h1: "Discount Wheel",
    shortTitle: "Discount Wheel",
    heroIntro:
      "Invite customers to spin for a discount, shipping perk, or mystery deal. Customize every offer and include simple redemption instructions in the result.",
    keywords: ["discount wheel", "discount spinner", "spin for a discount", "promotion discount wheel"],
    articleTitle: "Turn customer discounts into an interactive moment",
    articleIntro: [
      "A discount wheel gives customers a simple, visual way to discover an offer.",
      "Start with common promotion ideas and edit the values to match your current campaign.",
    ],
    uniqueSection: {
      title: "Offers ready for redemption",
      intro: "Connect every wheel result to a clear customer action.",
      points: [
        { title: "Flexible offers", description: "Add percentages, shipping perks, or free items." },
        { title: "Redemption copy", description: "Show terms or a short code after the spin." },
        { title: "Campaign styling", description: "Use colors that match signs and social posts." },
      ],
    },
    accent: "emerald",
  }),
  reward: finalize({
    id: "reward",
    path: "/reward-wheel",
    pageTitle: "Reward Wheel | Free Spinner for Customers, Teams & Classes",
    description:
      "Build a free reward wheel for customer loyalty, employee recognition, or classroom motivation. Add custom perks, prizes, colors, and messages.",
    h1: "Reward Wheel",
    shortTitle: "Reward Wheel",
    heroIntro:
      "Celebrate participation, progress, and loyalty with a customizable reward wheel. Add practical perks, recognition, and surprise rewards for your group.",
    keywords: ["reward wheel", "reward spinner", "incentive wheel", "recognition prize wheel"],
    articleTitle: "Recognize effort with a Reward Wheel",
    articleIntro: [
      "A reward wheel makes recognition immediate and visible without making the setup complicated.",
      "Use it for customer loyalty, team milestones, classroom effort, or community participation.",
    ],
    uniqueSection: {
      title: "Rewards that fit your audience",
      intro: "Combine useful perks with memorable recognition.",
      points: [
        { title: "Flexible reward mix", description: "Include items, experiences, badges, and privileges." },
        { title: "Positive messages", description: "Personalize the celebration shown after a win." },
        { title: "Repeatable programs", description: "Save the wheel for recurring recognition." },
      ],
    },
    accent: "teal",
  }),
  lucky: finalize({
    id: "lucky",
    path: "/lucky-wheel",
    pageTitle: "Lucky Wheel | Free Prize Spinner for Events & Giveaways",
    description:
      "Create a colorful lucky wheel for giveaways, celebrations, and event activities. Add custom prizes and spin for a random equal-chance result.",
    h1: "Lucky Wheel",
    shortTitle: "Lucky Wheel",
    heroIntro:
      "Bring a fun surprise to your event with a colorful lucky wheel. Add your own gifts and rewards, then spin to reveal one equal-chance prize.",
    keywords: ["lucky wheel", "lucky wheel spinner", "lucky prize wheel", "event prize spinner"],
    articleTitle: "Add a surprise prize moment with a Lucky Wheel",
    articleIntro: [
      "The Lucky Wheel is a friendly prize spinner for community events, parties, and promotional activities.",
      "Customize the preset with gifts that fit your audience and remove items as inventory runs out.",
    ],
    uniqueSection: {
      title: "Simple setup, lively reveal",
      intro: "Create a polished activity in minutes and keep the focus on the celebration.",
      points: [
        { title: "Bright segments", description: "Give each prize an easy-to-see color." },
        { title: "Custom celebration", description: "Show a unique message for every prize." },
        { title: "Equal selection", description: "All enabled segments have the same chance." },
      ],
    },
    accent: "orange",
  }),
  coupon: finalize({
    id: "coupon",
    path: "/coupon-wheel",
    pageTitle: "Coupon Wheel | Create a Free Promotional Offer Spinner",
    description:
      "Create a coupon wheel for percentage discounts, shipping perks, and customer offers. Add custom coupon messages and spin at stores or events.",
    h1: "Coupon Wheel",
    shortTitle: "Coupon Wheel",
    heroIntro:
      "Put your current coupons and customer perks on an interactive wheel. Each result can display the offer details or a short redemption instruction.",
    keywords: ["coupon wheel", "coupon spinner", "promotional coupon wheel", "customer offer spinner"],
    articleTitle: "Present customer coupons with an interactive spin",
    articleIntro: [
      "A coupon wheel helps a promotion stand out at a counter, booth, or customer event.",
      "Replace the discount preset with your valid offers and add any important redemption details.",
    ],
    uniqueSection: {
      title: "Coupons made clear and engaging",
      intro: "Keep offer names short on the wheel and details in the result message.",
      points: [
        { title: "Custom offer labels", description: "Use concise names that remain readable while spinning." },
        { title: "Terms in context", description: "Add expiration or redemption notes to messages." },
        { title: "Easy updates", description: "Disable an offer as soon as it is unavailable." },
      ],
    },
    accent: "emerald",
  }),
  classroom: finalize({
    id: "classroom",
    path: "/classroom-reward-wheel",
    pageTitle: "Classroom Reward Wheel | Free Spinner for Student Prizes",
    description:
      "Create a classroom reward wheel with homework passes, extra recess, stickers, and mystery prizes. Customize it for student motivation and celebrations.",
    h1: "Classroom Reward Wheel",
    shortTitle: "Classroom Reward Wheel",
    heroIntro:
      "Celebrate student effort with a classroom reward spinner. Add age-appropriate privileges and small prizes, then spin for an equal-chance result.",
    keywords: ["classroom reward wheel", "student reward spinner", "teacher prize wheel", "classroom incentive wheel"],
    articleTitle: "Make classroom recognition interactive",
    articleIntro: [
      "A reward wheel gives students a clear and exciting way to celebrate effort, teamwork, or a class milestone.",
      "Start with familiar classroom rewards and adjust them to fit your routines and policies.",
    ],
    uniqueSection: {
      title: "Positive rewards for your classroom",
      intro: "Mix tangible prizes with privileges that reinforce participation.",
      points: [
        { title: "Teacher controlled", description: "Enable only rewards available that day." },
        { title: "Student friendly", description: "Use colors and labels that are easy to understand." },
        { title: "Reusable routine", description: "Save the setup for weekly recognition." },
      ],
    },
    accent: "blue",
  }),
  "trade-show": finalize({
    id: "trade-show",
    path: "/trade-show-prize-wheel",
    pageTitle: "Trade Show Prize Wheel | Free Spinner for Booth Giveaways",
    description:
      "Create a trade show prize wheel with samples, swag bags, discount codes, and branded giveaways. Customize it for your booth and event visitors.",
    h1: "Trade Show Prize Wheel",
    shortTitle: "Trade Show Prize Wheel",
    heroIntro:
      "Draw visitors to your booth with an interactive wheel featuring samples, branded merchandise, and useful offers. Customize colors and messages for your event.",
    keywords: ["trade show prize wheel", "booth prize spinner", "expo giveaway wheel", "event promotion wheel"],
    articleTitle: "Create an interactive trade show booth activity",
    articleIntro: [
      "A prize wheel provides an easy participation moment that can introduce visitors to your products and team.",
      "Match wheel colors to your booth and prepare each winning message with the next step.",
    ],
    uniqueSection: {
      title: "Built for busy event booths",
      intro: "Keep spins quick, prizes visible, and fulfillment instructions clear.",
      points: [
        { title: "Branded display", description: "Coordinate segment colors with your event materials." },
        { title: "Useful prize mix", description: "Combine samples, swag, and follow-up offers." },
        { title: "Stock awareness", description: "Remove limited items when supplies are gone." },
      ],
    },
    accent: "indigo",
  }),
  fundraising: finalize({
    id: "fundraising",
    path: "/fundraising-wheel",
    pageTitle: "Fundraising Wheel | Free Prize Spinner for Supporter Events",
    description:
      "Create a fundraising prize wheel with donor swag, thank-you rewards, and event gifts. Customize it for community campaigns and supporter events.",
    h1: "Fundraising Wheel",
    shortTitle: "Fundraising Wheel",
    heroIntro:
      "Thank supporters with an interactive fundraising event wheel. Add donor gifts, recognition, and campaign merchandise with clear equal-chance selection.",
    keywords: ["fundraising wheel", "fundraiser prize spinner", "donor reward wheel", "charity event wheel"],
    articleTitle: "Thank supporters with a fundraising prize activity",
    articleIntro: [
      "A fundraising wheel can add a friendly participation moment to an in-person or online supporter event.",
      "Choose rewards that fit your campaign budget and explain participation and fulfillment rules in advance.",
    ],
    uniqueSection: {
      title: "Supporter appreciation made visible",
      intro: "Use thoughtful rewards to recognize participation and reinforce your mission.",
      points: [
        { title: "Campaign rewards", description: "Add merchandise, recognition, and donated gifts." },
        { title: "Clear participation", description: "Publish eligibility and prize details before spinning." },
        { title: "Thank-you messages", description: "Personalize each result with supporter appreciation." },
      ],
    },
    accent: "purple",
  }),
  holiday: finalize({
    id: "holiday",
    path: "/holiday-prize-wheel",
    pageTitle: "Holiday Prize Wheel | Free Festive Gift Spinner",
    description:
      "Create a festive holiday prize wheel with seasonal gifts, treats, and surprises. Customize colors and messages for parties, classrooms, and promotions.",
    h1: "Holiday Prize Wheel",
    shortTitle: "Holiday Prize Wheel",
    heroIntro:
      "Add festive gifts, treats, and seasonal surprises to a colorful holiday wheel. Use it for parties, classrooms, customer events, or team celebrations.",
    keywords: ["holiday prize wheel", "festive gift spinner", "seasonal reward wheel", "holiday party wheel"],
    articleTitle: "Create a festive Holiday Prize Wheel",
    articleIntro: [
      "A holiday wheel turns gift distribution into a shared celebration for groups of any size.",
      "Use the seasonal preset, then adapt prizes and colors to your event and traditions.",
    ],
    uniqueSection: {
      title: "Seasonal fun for any celebration",
      intro: "Create a festive theme while keeping prize details clear.",
      points: [
        { title: "Seasonal prizes", description: "Add treats, decorations, gift cards, and surprises." },
        { title: "Festive colors", description: "Choose a palette that matches your event." },
        { title: "Warm messages", description: "Customize a greeting for each result." },
      ],
    },
    accent: "rose",
  }),
  birthday: finalize({
    id: "birthday",
    path: "/birthday-prize-wheel",
    pageTitle: "Birthday Prize Wheel | Free Party Favor Spinner",
    description:
      "Create a birthday prize wheel with candy, gifts, party favors, and surprises. Customize the colors and messages for an interactive party activity.",
    h1: "Birthday Prize Wheel",
    shortTitle: "Birthday Prize Wheel",
    heroIntro:
      "Make party favors and small gifts part of the celebration with a birthday prize wheel. Add age-appropriate prizes and spin for a fun equal-chance result.",
    keywords: ["birthday prize wheel", "party favor spinner", "birthday party wheel", "kids prize wheel"],
    articleTitle: "Add a Birthday Prize Wheel to the party",
    articleIntro: [
      "A birthday wheel creates an easy group activity around treats, favors, and small surprises.",
      "Customize every segment for the guest list and remove limited gifts after they are selected.",
    ],
    uniqueSection: {
      title: "A party activity ready in minutes",
      intro: "Keep prizes colorful, suitable for guests, and simple to distribute.",
      points: [
        { title: "Party favorites", description: "Mix candy, small gifts, and party favors." },
        { title: "One-time gifts", description: "Remove limited prizes after a result." },
        { title: "Big celebration", description: "Add a fun message for every winner." },
      ],
    },
    accent: "pink",
  }),
  customer: finalize({
    id: "customer",
    path: "/customer-reward-wheel",
    pageTitle: "Customer Reward Wheel | Free Loyalty Prize Spinner",
    description:
      "Create a customer reward wheel with points boosts, free items, badges, and VIP perks. Customize it for loyalty campaigns and appreciation events.",
    h1: "Customer Reward Wheel",
    shortTitle: "Customer Reward Wheel",
    heroIntro:
      "Thank returning customers with an interactive reward wheel featuring points, free items, badges, and VIP perks. Add clear instructions to every result.",
    keywords: ["customer reward wheel", "loyalty reward spinner", "customer appreciation wheel", "VIP reward wheel"],
    articleTitle: "Strengthen loyalty with a Customer Reward Wheel",
    articleIntro: [
      "A customer reward wheel makes appreciation visible and gives a loyalty campaign an interactive touchpoint.",
      "Choose perks your team can fulfill consistently and state any redemption conditions clearly.",
    ],
    uniqueSection: {
      title: "Rewards for lasting customer relationships",
      intro: "Offer useful benefits that fit naturally into your loyalty program.",
      points: [
        { title: "Loyalty perks", description: "Add points, products, status, or service benefits." },
        { title: "Clear fulfillment", description: "Show how and when each reward can be used." },
        { title: "Campaign reuse", description: "Save and update the wheel for future promotions." },
      ],
    },
    accent: "teal",
  }),
}

export function getPrizeWheelSpoke(id: PrizeWheelSpokeId): PrizeWheelSpokeSeo {
  return PRIZE_WHEEL_SPOKES[id]
}

export function getAllPrizeWheelSpokes(): PrizeWheelSpokeSeo[] {
  return ALL_SPOKE_IDS.map((id) => PRIZE_WHEEL_SPOKES[id])
}

export function getPrizeSpokeSiblings(spoke: PrizeWheelSpokeSeo): PrizeWheelSpokeSeo[] {
  return spoke.siblingIds.map((id) => PRIZE_WHEEL_SPOKES[id])
}

export const PRIZE_WHEEL_POPULAR_SPOKE_LINKS: {
  id: PrizeWheelSpokeId
  href: string
  label: string
  description: string
  accent: PrizeWheelUseCaseAccent
}[] = ALL_SPOKE_IDS.map((id) => {
  const spoke = PRIZE_WHEEL_SPOKES[id]
  return {
    id,
    href: spoke.path,
    label: spoke.shortTitle,
    description: spoke.heroIntro.slice(0, 90),
    accent: spoke.accent,
  }
})

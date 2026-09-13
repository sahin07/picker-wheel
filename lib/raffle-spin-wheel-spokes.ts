import {

  RAFFLE_SPIN_WHEEL_PAGE_DESCRIPTION,

  RAFFLE_SPIN_WHEEL_PAGE_TITLE,

  RAFFLE_SPIN_WHEEL_PATH,

  RAFFLE_SPIN_WHEEL_SITE_URL,

} from "@/lib/raffle-spin-wheel-seo"

import {

  getRaffleSpinWheelUseCase,

  type RaffleSpinWheelUseCaseAccent,

  type RaffleSpinWheelUseCaseConfig,

  type RaffleSpinWheelUseCaseId,

} from "@/lib/raffle-spin-wheel-use-cases"



export type RaffleSpinWheelSpokeId =

  | "raffle"

  | "random-winner"

  | "contest"

  | "giveaway-winner"

  | "classroom"

  | "charity"



export type RaffleSpinWheelDeepLink = {

  useCaseId: RaffleSpinWheelUseCaseId

  config: RaffleSpinWheelUseCaseConfig

}



export type RaffleSpinWheelSpokeFaq = {

  question: string

  answer: string

}



export type RaffleSpinWheelSpokeSeo = {

  id: RaffleSpinWheelSpokeId

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

  faq: readonly RaffleSpinWheelSpokeFaq[]

  siblingIds: readonly RaffleSpinWheelSpokeId[]

  deepLink: RaffleSpinWheelDeepLink

  accent: RaffleSpinWheelUseCaseAccent

}



export function raffleSpokeUrl(path: string): string {

  return `${RAFFLE_SPIN_WHEEL_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`

}



function finalize(

  partial: Omit<RaffleSpinWheelSpokeSeo, "deepLink"> & {

    useCaseId: RaffleSpinWheelUseCaseId

  },

): RaffleSpinWheelSpokeSeo {

  const useCase = getRaffleSpinWheelUseCase(partial.useCaseId)

  if (!useCase) {

    throw new Error(`Missing raffle use case: ${partial.useCaseId}`)

  }

  const { useCaseId, ...rest } = partial

  return {

    ...rest,

    deepLink: { useCaseId, config: useCase.config },

  }

}



const ALL_SIBLINGS = [

  "raffle",

  "random-winner",

  "contest",

  "giveaway-winner",

  "classroom",

  "charity",

] as const satisfies readonly RaffleSpinWheelSpokeId[]



function siblingsOf(id: RaffleSpinWheelSpokeId): readonly RaffleSpinWheelSpokeId[] {

  return ALL_SIBLINGS.filter((item) => item !== id)

}



export const RAFFLE_SPIN_WHEEL_SPOKES: Record<RaffleSpinWheelSpokeId, RaffleSpinWheelSpokeSeo> = {

  raffle: finalize({

    id: "raffle",

    path: RAFFLE_SPIN_WHEEL_PATH,

    pageTitle: RAFFLE_SPIN_WHEEL_PAGE_TITLE,

    description: RAFFLE_SPIN_WHEEL_PAGE_DESCRIPTION,

    h1: "Raffle Spin Wheel",

    shortTitle: "Raffle Spin Wheel",

    heroIntro:

      "Enter participants, spin a transparent raffle draw, and optionally remove winners as you continue.",

    keywords: ["raffle spin wheel", "raffle wheel", "raffle winner picker"],

    articleTitle: "Run a clear raffle draw",

    articleIntro: [

      "Paste entrants, spin once, and keep a visible record of who won.",

      "Use elimination when awarding multiple places from the same pool.",

    ],

    uniqueSection: {

      title: "Serious random drawing",

      intro: "This pillar is for who won—not which prize label landed.",

      points: [

        {

          title: "People on the wheel",

          description: "Participants and ticket holders stay on the slices.",

        },

        {

          title: "Elimination ready",

          description: "Remove winners after each draw for multi-place raffles.",

        },

      ],

    },

    faq: [

      {

        question: "Is the Raffle Spin Wheel free?",

        answer: "Yes. You can run participant draws in the browser without an account.",

      },

    ],

    siblingIds: siblingsOf("raffle"),

    useCaseId: "standard",

    accent: "amber",

  }),

  "random-winner": finalize({

    id: "random-winner",

    path: "/random-winner-picker",

    pageTitle: "Random Winner Picker | Fair Online Winner Draw",

    description:

      "Pick a random winner from your participant list with a visible spin. Free random winner picker for raffles, contests, and giveaways.",

    h1: "Random Winner Picker",

    shortTitle: "Random Winner Picker",

    heroIntro: "Load entrants and spin once for a clear, watchable random winner.",

    keywords: ["random winner picker", "random winner generator", "pick a random winner"],

    articleTitle: "How to pick a random winner",

    articleIntro: [

      "Add every eligible name, confirm the list, then spin in view of your audience.",

      "Turn on elimination if you will draw additional winners next.",

    ],

    uniqueSection: {

      title: "One fair spin",

      intro: "Best when you need a single transparent winner announcement.",

      points: [

        {

          title: "Visible selection",

          description: "The wheel motion helps audiences trust the process.",

        },

        {

          title: "Import lists",

          description: "Paste large entrant lists from the Text tab.",

        },

      ],

    },

    faq: [

      {

        question: "Can I pick more than one winner?",

        answer:

          "Yes. Enable Elimination Mode, then spin again after each winner leaves the pool.",

      },

    ],

    siblingIds: siblingsOf("random-winner"),

    useCaseId: "standard",

    accent: "amber",

  }),

  contest: finalize({

    id: "contest",

    path: "/contest-winner-picker",

    pageTitle: "Contest Winner Picker | Elimination Contest Draw",

    description:

      "Draw contest winners fairly with elimination. Remove each winner and continue until every place is filled.",

    h1: "Contest Winner Picker",

    shortTitle: "Contest Winner Picker",

    heroIntro: "Fill contest places with sequential elimination draws from one entrant pool.",

    keywords: ["contest winner picker", "contest draw", "elimination raffle"],

    articleTitle: "Draw contest winners in order",

    articleIntro: [

      "Start with the full entrant list, then remove each winner as you award places.",

      "Keep results history open so judges and viewers can review the order.",

    ],

    uniqueSection: {

      title: "Elimination contest flow",

      intro: "Ideal for 1st / 2nd / 3rd place sequences from one list.",

      points: [

        {

          title: "Shrinking pool",

          description: "Each winner is removed before the next spin.",

        },

        {

          title: "Clear history",

          description: "Results stay listed for audit-friendly announcements.",

        },

      ],

    },

    faq: [

      {

        question: "Does elimination stay on for contest draws?",

        answer: "Yes. Contest presets start with Remove winner after spin enabled.",

      },

    ],

    siblingIds: siblingsOf("contest"),

    useCaseId: "contest",

    accent: "rose",

  }),

  "giveaway-winner": finalize({

    id: "giveaway-winner",

    path: "/giveaway-winner-picker",

    pageTitle: "Giveaway Winner Picker | Live Entrant Draw",

    description:

      "Pick giveaway winners from your entrant list with a live spin wheel. Built for stream and social giveaways.",

    h1: "Giveaway Winner Picker",

    shortTitle: "Giveaway Winner Picker",

    heroIntro: "Paste chat or form entrants and spin live for your next giveaway winner.",

    keywords: ["giveaway winner picker", "giveaway wheel", "live giveaway draw"],

    articleTitle: "Run a live giveaway draw",

    articleIntro: [

      "Hide the input panel for a cleaner stream layout when you are ready to spin.",

      "Use elimination when awarding multiple gift slots from the same entrants.",

    ],

    uniqueSection: {

      title: "Creator-friendly giveaway draws",

      intro: "People on the wheel—link Prize Wheel separately when rewards themselves spin.",

      points: [

        {

          title: "Public mode",

          description: "Hide inputs so viewers focus on the wheel and result.",

        },

        {

          title: "Entrant paste",

          description: "Drop usernames or emails into the Text tab quickly.",

        },

      ],

    },

    faq: [

      {

        question: "Should prizes go on this wheel?",

        answer:

          "No. Keep people here. Use the Prize Wheel when the slices should be rewards.",

      },

    ],

    siblingIds: siblingsOf("giveaway-winner"),

    useCaseId: "giveaway",

    accent: "violet",

  }),

  classroom: finalize({

    id: "classroom",

    path: "/classroom-raffle-wheel",

    pageTitle: "Classroom Raffle Wheel | Ticket Draw for Students",

    description:

      "Run a classroom ticket raffle with numbered tickets on the wheel. Generate Ticket 01–N, spin fairly, and remove winners as you award classroom prizes.",

    h1: "Classroom Raffle Wheel",

    shortTitle: "Classroom Raffle",

    heroIntro:

      "Generate numbered classroom tickets, spin in front of the class, and award prizes with a clear draw order.",

    keywords: [

      "classroom raffle wheel",

      "classroom ticket draw",

      "student raffle spinner",

      "ticket raffle generator",

    ],

    articleTitle: "How to run a classroom ticket raffle",

    articleIntro: [

      "Use Ticket tools to generate Ticket 01 through Ticket N, or paste student names if you prefer names over numbers.",

      "Elimination keeps each winner off the wheel so later prizes go to remaining students.",

    ],

    uniqueSection: {

      title: "Built for classroom ticket jars",

      intro: "Matches the paper-ticket ritual with a visible digital spin.",

      points: [

        {

          title: "Numbered tickets",

          description: "Generate equal tickets quickly when every slip has the same chance.",

        },

        {

          title: "Export winners",

          description: "Download CSV after the draw for grade-book or newsletter notes.",

        },

      ],

    },

    faq: [

      {

        question: "Can I use student names instead of ticket numbers?",

        answer:

          "Yes. Paste names in the Text tab, or keep Ticket 01–N if you already sold or assigned paper tickets.",

      },

    ],

    siblingIds: siblingsOf("classroom"),

    useCaseId: "classroom",

    accent: "sky",

  }),

  charity: finalize({

    id: "charity",

    path: "/charity-raffle-wheel",

    pageTitle: "Charity Raffle Wheel | Transparent Fundraiser Draw",

    description:

      "Draw charity and fundraiser raffle winners transparently. Load donor or ticket-holder names, spin live, share results, and export the winner list.",

    h1: "Charity Raffle Wheel",

    shortTitle: "Charity Raffle",

    heroIntro:

      "Keep fundraiser draws transparent: load entrants, spin live, then share or export the recorded winners.",

    keywords: [

      "charity raffle wheel",

      "fundraiser raffle spinner",

      "charity winner draw",

      "nonprofit raffle picker",

    ],

    articleTitle: "Run a transparent charity raffle",

    articleIntro: [

      "Load donor names or ticket holders so the audience can see every eligible entry before the spin.",

      "Share the outcome link or export CSV after the draw for board records and thank-you posts.",

    ],

    uniqueSection: {

      title: "Trust-first fundraiser draws",

      intro: "Designed for events where the process must feel open and auditable.",

      points: [

        {

          title: "Visible pool",

          description: "Entrants stay on the wheel until elimination removes a winner.",

        },

        {

          title: "Share + QR",

          description: "Hand out a results link or QR so donors can review the draw order.",

        },

      ],

    },

    faq: [

      {

        question: "Can donors verify the results later?",

        answer:

          "Yes. Use Share results to create a snapshot link (with QR) that shows the recorded winners without exposing remaining entrants.",

      },

    ],

    siblingIds: siblingsOf("charity"),

    useCaseId: "charity",

    accent: "emerald",

  }),

}



export function getRaffleSpinWheelSpoke(

  id: RaffleSpinWheelSpokeId | string,

): RaffleSpinWheelSpokeSeo {

  const spoke = RAFFLE_SPIN_WHEEL_SPOKES[id as RaffleSpinWheelSpokeId]

  if (!spoke) throw new Error(`Unknown raffle spoke: ${id}`)

  return spoke

}



/** Popular templates → dedicated spoke routes (not ?template= on the hub). */

export const RAFFLE_USE_CASE_SPOKE_ID: Record<RaffleSpinWheelUseCaseId, RaffleSpinWheelSpokeId> = {

  standard: "random-winner",

  contest: "contest",

  giveaway: "giveaway-winner",

  classroom: "classroom",

  charity: "charity",

}



export function getRaffleSpokePathForUseCase(id: RaffleSpinWheelUseCaseId): string {

  return RAFFLE_SPIN_WHEEL_SPOKES[RAFFLE_USE_CASE_SPOKE_ID[id]].path

}



export const RAFFLE_SPIN_WHEEL_POPULAR_SPOKE_LINKS: {

  id: RaffleSpinWheelSpokeId

  href: string

  label: string

  description: string

  accent: RaffleSpinWheelUseCaseAccent

  useCaseId: RaffleSpinWheelUseCaseId

}[] = (["random-winner", "contest", "giveaway-winner", "classroom", "charity"] as const).map(

  (id) => {

    const spoke = RAFFLE_SPIN_WHEEL_SPOKES[id]

    const useCase = getRaffleSpinWheelUseCase(spoke.deepLink.useCaseId)!

    return {

      id,

      href: spoke.path,

      label: useCase.label,

      description: useCase.description,

      accent: spoke.accent,

      useCaseId: spoke.deepLink.useCaseId,

    }

  },

)



import {
  YES_NO_PICKER_PATH,
  YES_NO_PICKER_SITE_URL,
} from "@/lib/yes-no-picker-seo"
import type {
  YesNoOptionLabels,
  YesNoPickerUseCaseId,
} from "@/lib/yes-no-picker-use-cases"

export type YesNoPickerSpokeId =
  | "yes-no"
  | "decision"
  | "maybe"
  | "should-i"
  | "either-or"
  | "this-or-that"
  | "true-false"
  | "pros-cons"

export type YesNoPickerDeepLink = {
  mode: YesNoPickerUseCaseId
  optionLabels?: Partial<YesNoOptionLabels>
  toolTitle?: string
  toolDescription?: string
  resultTitle?: string
}

export type YesNoPickerSpokeFaq = {
  question: string
  answer: string
}

export type YesNoPickerSpokeEeat = {
  experience: string
  expertise: string
  trust: string
}

export type YesNoPickerSpokeSeo = {
  id: YesNoPickerSpokeId
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
  eeat: YesNoPickerSpokeEeat
  faq: readonly YesNoPickerSpokeFaq[]
  siblingIds: readonly YesNoPickerSpokeId[]
  deepLink: YesNoPickerDeepLink
}

export function yesNoSpokeUrl(path: string): string {
  return `${YES_NO_PICKER_SITE_URL}${path}`
}

const ALL_SIBLINGS: YesNoPickerSpokeId[] = [
  "yes-no",
  "decision",
  "maybe",
  "should-i",
  "either-or",
  "this-or-that",
  "true-false",
  "pros-cons",
]

function siblingsExcept(id: YesNoPickerSpokeId): YesNoPickerSpokeId[] {
  return ALL_SIBLINGS.filter((s) => s !== id)
}

export const YES_NO_PICKER_SPOKES: Record<YesNoPickerSpokeId, YesNoPickerSpokeSeo> = {
  "yes-no": {
    id: "yes-no",
    path: "/yes-no-wheel",
    pageTitle: "Yes No Wheel | Free Online Yes or No Spinner",
    description:
      "Spin a free Yes No Wheel for a random yes or no answer. Fast online decision spinner for everyday choices, games, and fair 50/50 calls.",
    h1: "Yes No Wheel",
    shortTitle: "Yes No Wheel",
    heroIntro:
      "Looking for a simple yes no wheel? Spin here for an instant YES or NO. This free online spinner is built for quick decisions, friendly debates, and fair random choices—no signup required.",
    keywords: [
      "yes no wheel",
      "yes no spinner",
      "yes no picker",
      "spin yes or no",
      "yes or no wheel",
      "online yes no wheel",
    ],
    articleTitle: "Spin a Yes No Wheel Online",
    articleIntro: [
      "A yes no wheel is the shortest path to a random binary answer. Instead of overthinking a small choice, you spin once and let chance pick YES or NO in front of everyone watching.",
      "This page loads a classic two-option wheel ready to spin. Customize labels, colors, and spin feel anytime—or open the main Yes or No Wheel pillar for more modes like Maybe, Truth or Dare, and coin-flip labels.",
      "Use it when you need a fast yes no picker for everyday decisions, classroom ties, or party prompts without building a custom list first.",
    ],
    uniqueSection: {
      title: "When a Yes No Wheel Works Best",
      intro: "Keep the classic YES/NO layout when the answer really is binary and speed matters.",
      points: [
        {
          title: "Everyday 50/50 calls",
          description: "Order in or cook? Stay in or go out? Spin once and move on.",
        },
        {
          title: "Friendly debates",
          description: "Let the spinner settle a tie without arguing—everyone sees the same result.",
        },
        {
          title: "Games and dares",
          description: "Accept/decline challenges with a visual spin that feels fairer than a silent coin.",
        },
        {
          title: "Quick classroom ties",
          description: "Choose between two activities or volunteers when you need an unbiased pick.",
        },
      ],
    },
    eeat: {
      experience:
        "Designed for the moments people already use coins and “eeny meeny”—but with a shared spin the group can watch.",
      expertise:
        "Loads equal YES and NO slices by default so each spin is a balanced random choice unless you change the setup.",
      trust:
        "Best for low-stakes fun and everyday decisions. For health, money, or legal choices, use judgment—not randomness.",
    },
    faq: [
      {
        question: "What is a Yes No Wheel?",
        answer:
          "It is an online spinner that randomly lands on yes or no. This page opens a ready-to-spin binary decision wheel.",
      },
      {
        question: "Is YES as likely as NO?",
        answer:
          "Yes—when both options have equal weight and slice count, each outcome has an equal chance.",
      },
      {
        question: "Can I add Maybe?",
        answer:
          "Yes. Switch modes on the tool, or open the dedicated Maybe Wheel in this cluster.",
      },
      {
        question: "Is the Yes No Wheel free?",
        answer: "Yes. Spin without creating an account.",
      },
    ],
    siblingIds: siblingsExcept("yes-no"),
    deepLink: {
      mode: "quick-decision",
      toolTitle: "Yes No Wheel",
      toolDescription: "Spin for a clear YES or NO.",
      resultTitle: "Your answer",
    },
  },

  decision: {
    id: "decision",
    path: "/decision-wheel",
    pageTitle: "Decision Wheel | Free Random Decision Maker Online",
    description:
      "Use our free Decision Wheel to make a random choice online. Spin a customizable decision spinner for fair yes/no answers and everyday calls.",
    h1: "Decision Wheel",
    shortTitle: "Decision Wheel",
    heroIntro:
      "Need a random decision maker? Spin the Decision Wheel and let chance choose. Customize options, save your setup, and get a fair answer whenever you are stuck between choices.",
    keywords: [
      "decision wheel",
      "random decision maker",
      "decision spinner",
      "make a decision",
      "random choice",
      "quick decision tool",
    ],
    articleTitle: "Make a Decision with a Spinning Wheel",
    articleIntro: [
      "A decision wheel turns hesitation into a clear, shared moment. You set the options, spin once, and get a random choice you can accept, discuss, or spin again.",
      "This page opens as a decision-focused yes/no spinner. Rename slices for Option A vs Option B, add Maybe when needed, or jump to sibling tools like Either-Or and This or That for different framings.",
      "It is ideal when you want a visual random decision maker—not a private coin flip—for teams, families, classrooms, and everyday plans.",
    ],
    uniqueSection: {
      title: "Why People Prefer a Decision Wheel",
      intro: "A spinning decision tool adds clarity and theater that a silent pick often lacks.",
      points: [
        {
          title: "Shared fairness",
          description: "Everyone watches the same spin, so the result feels transparent.",
        },
        {
          title: "Custom wording",
          description: "Change labels to match the real choice you are making.",
        },
        {
          title: "Group decisions",
          description: "Useful in meetings, family nights, and classroom votes.",
        },
        {
          title: "Repeatable tool",
          description: "Save and reuse wheels for recurring decision moments.",
        },
      ],
    },
    eeat: {
      experience:
        "Built for real “we can’t decide” moments—plans, votes, and light team calls—not complex analysis.",
      expertise:
        "Starts from a balanced decision spinner you can customize into almost any two-way (or three-way) choice.",
      trust:
        "Great for breaking ties and low-stakes picks. Important life decisions still deserve careful thinking.",
    },
    faq: [
      {
        question: "What is a Decision Wheel?",
        answer:
          "A Decision Wheel is an online spinner that randomly selects among the options you set—commonly yes/no or custom labels.",
      },
      {
        question: "Can I customize the options?",
        answer:
          "Yes. Edit labels, colors, and modes, or open related wheels like Either-Or and Pros and Cons.",
      },
      {
        question: "Is it truly random?",
        answer:
          "Each spin picks from the active slices. Equal slices mean equal odds for practical decision-making.",
      },
      {
        question: "Is the Decision Wheel free?",
        answer: "Yes. No account is required to spin.",
      },
    ],
    siblingIds: siblingsExcept("decision"),
    deepLink: {
      mode: "quick-decision",
      toolTitle: "Decision Wheel",
      toolDescription: "Spin to make a fair random decision.",
      resultTitle: "Decision",
    },
  },

  maybe: {
    id: "maybe",
    path: "/maybe-wheel",
    pageTitle: "Maybe Wheel | Yes No Maybe Spinner Online",
    description:
      "Spin a free Maybe Wheel for YES, NO, or MAYBE. A three-option decision spinner when a simple yes or no is not enough.",
    h1: "Maybe Wheel",
    shortTitle: "Maybe Wheel",
    heroIntro:
      "Not every answer is binary. Spin the Maybe Wheel for YES, NO, or MAYBE when you need a third path—perfect for soft decisions, plans, and group consensus.",
    keywords: [
      "maybe wheel",
      "yes no maybe wheel",
      "yes no maybe spinner",
      "three option decision wheel",
      "maybe spinner",
    ],
    articleTitle: "Spin Yes, No, or Maybe",
    articleIntro: [
      "A Maybe Wheel adds a middle option when “yes or no” feels too harsh. Each spin can land on YES, NO, or MAYBE with equal slices by default.",
      "Use it for tentative plans, soft commitments, and group checks where “not yet” is a valid answer. You can still rename labels or switch back to a binary wheel anytime.",
      "If you only need two outcomes, try the Yes No Wheel. For open-ended choices, open the main Yes or No Wheel pillar and customize freely.",
    ],
    uniqueSection: {
      title: "When Maybe Belongs on the Wheel",
      intro: "Three outcomes help when the situation is genuinely undecided—not forced into yes/no.",
      points: [
        {
          title: "Soft plans",
          description: "Tonight’s outing, weekend plans, or “are we free?” checks.",
        },
        {
          title: "Group consensus",
          description: "Capture lean-yes, lean-no, and not-sure without overcomplicating.",
        },
        {
          title: "Creative prompts",
          description: "Games and icebreakers that need a third random result.",
        },
        {
          title: "Gentle decisions",
          description: "When forcing a hard yes/no would create unnecessary pressure.",
        },
      ],
    },
    eeat: {
      experience:
        "Made for the common case where people say “maybe” out loud—and want the spinner to allow it too.",
      expertise:
        "Loads YES / NO / MAYBE as equal slices so the third option is a real outcome, not an afterthought.",
      trust:
        "Still a fun random tool. Treat MAYBE as a prompt to revisit the choice—not professional advice.",
    },
    faq: [
      {
        question: "What is a Maybe Wheel?",
        answer:
          "It is a yes/no/maybe spinner—an online wheel with three default outcomes instead of two.",
      },
      {
        question: "Are all three options equally likely?",
        answer:
          "Yes, when each has the same weight and slice count. You can add more sets if you want denser slices.",
      },
      {
        question: "Can I remove Maybe later?",
        answer:
          "Yes. Switch to a binary mode or open the Yes No Wheel for a classic two-option spin.",
      },
      {
        question: "Is it free?",
        answer: "Yes. Spin without signing up.",
      },
    ],
    siblingIds: siblingsExcept("maybe"),
    deepLink: {
      mode: "yes-no-maybe",
      toolTitle: "Maybe Wheel",
      toolDescription: "Spin for YES, NO, or MAYBE.",
      resultTitle: "Your answer",
    },
  },

  "should-i": {
    id: "should-i",
    path: "/should-i-wheel",
    pageTitle: "Should I Wheel | Spin “Should I…?” Decisions Online",
    description:
      "Stuck on “Should I…?” Spin our free Should I Wheel for a random yes or no answer—with optional AI context for light guidance.",
    h1: "Should I Wheel",
    shortTitle: "Should I Wheel",
    heroIntro:
      "Should I order takeout? Should I start that project? Spin the Should I Wheel for a quick yes or no. Add a short question for light AI context, then let the spinner decide.",
    keywords: [
      "should i wheel",
      "should i spinner",
      "should i decide",
      "should i or shouldnt i",
      "random should i",
    ],
    articleTitle: "Answer “Should I…?” with a Spin",
    articleIntro: [
      "“Should I…?” questions pile up all day. A Should I Wheel turns that loop into one clear spin—YES or NO—so you can stop circling the same dilemma.",
      "This page opens in AI-friendly decision mode: type a short should-I question for light context, then spin. Guidance here is for fun and momentum, not professional advice.",
      "For binary spins without AI, use the Yes No Wheel. For three outcomes, try the Maybe Wheel.",
    ],
    uniqueSection: {
      title: "Classic Should-I Moments",
      intro: "These are the low-stakes questions people spin most often.",
      points: [
        {
          title: "Food & plans",
          description: "Should I order takeout? Should I go out tonight?",
        },
        {
          title: "Habits & focus",
          description: "Should I start that project today? Should I go for a walk?",
        },
        {
          title: "Entertainment",
          description: "Should I watch a movie? Should I play one more round?",
        },
        {
          title: "Social prompts",
          description: "Should I text them? Should I join the challenge?",
        },
      ],
    },
    eeat: {
      experience:
        "Framed around the exact phrase people search—“should I”—with a spinner that matches that intent.",
      expertise:
        "Combines a clear yes/no spin with optional light AI context for entertainment-style guidance.",
      trust:
        "Never use this for medical, legal, or major financial decisions. It is a quick decision tool for everyday choices.",
    },
    faq: [
      {
        question: "What is a Should I Wheel?",
        answer:
          "It is a decision spinner optimized for “Should I…?” questions, giving a random yes or no (with optional AI notes).",
      },
      {
        question: "Is the AI advice professional advice?",
        answer:
          "No. It is light, entertainment-style context only. You still make the real decision.",
      },
      {
        question: "Can I spin without AI?",
        answer: "Yes. Switch to manual mode or use the Yes No Wheel for a plain binary spin.",
      },
      {
        question: "Is it free?",
        answer: "Yes.",
      },
    ],
    siblingIds: siblingsExcept("should-i"),
    deepLink: {
      mode: "ai-advice",
      toolTitle: "Should I Wheel",
      toolDescription: "Ask “Should I…?” then spin for YES or NO.",
      resultTitle: "Should you?",
    },
  },

  "either-or": {
    id: "either-or",
    path: "/either-or-wheel",
    pageTitle: "Either Or Wheel | Spin Either vs Or Online",
    description:
      "Spin a free Either Or Wheel to choose between two options. A fair either/or decision spinner for everyday choices and group picks.",
    h1: "Either Or Wheel",
    shortTitle: "Either Or Wheel",
    heroIntro:
      "Torn between two options? Spin the Either Or Wheel and let chance pick. This page opens with EITHER and OR labels so your binary choice feels clear and fair.",
    keywords: [
      "either or wheel",
      "either or spinner",
      "either or decision",
      "choose either or",
      "binary decision wheel",
    ],
    articleTitle: "Choose Either or Or with One Spin",
    articleIntro: [
      "An Either Or Wheel is a binary decision tool labeled for two real alternatives—not abstract yes/no. Rename the slices to match your actual options anytime.",
      "Use it when the choice is “this versus that” but you still want either/or wording, or keep EITHER / OR as a playful framing for games and icebreakers.",
      "Prefer THIS / THAT labels? Open the This or That Wheel. Need PRO vs CON? Try Pros and Cons.",
    ],
    uniqueSection: {
      title: "Best Uses for Either/Or Spins",
      intro: "Keep the framing simple: two options, one spin, one winner.",
      points: [
        {
          title: "Two clear alternatives",
          description: "Restaurant A vs B, activity 1 vs 2, plan tonight vs tomorrow.",
        },
        {
          title: "Classroom choices",
          description: "Pick between two lessons, games, or volunteer paths.",
        },
        {
          title: "Stream & party games",
          description: "Let chat or friends watch the either/or result land live.",
        },
        {
          title: "Quick tie-breakers",
          description: "End a stalemate without a long debate.",
        },
      ],
    },
    eeat: {
      experience:
        "Matches how people talk about stuck choices—“either this or that”—with labels that fit the language.",
      expertise:
        "Starts as a balanced two-slice wheel with EITHER / OR; customize to your real options in Text.",
      trust:
        "A fair random picker for fun and everyday calls—not a substitute for careful high-stakes judgment.",
    },
    faq: [
      {
        question: "What is an Either Or Wheel?",
        answer:
          "It is a two-option decision spinner labeled EITHER and OR (or your custom names) for binary choices.",
      },
      {
        question: "Can I rename EITHER and OR?",
        answer: "Yes. Edit labels in the Text tab to match your real options.",
      },
      {
        question: "How is this different from Yes/No?",
        answer:
          "Same binary idea—different wording. Either/Or fits alternative choices; Yes/No fits accept/decline.",
      },
      {
        question: "Is it free?",
        answer: "Yes.",
      },
    ],
    siblingIds: siblingsExcept("either-or"),
    deepLink: {
      mode: "quick-decision",
      optionLabels: { yes: "EITHER", no: "OR", maybe: "MAYBE" },
      toolTitle: "Either Or Wheel",
      toolDescription: "Spin to choose either or.",
      resultTitle: "Either or?",
    },
  },

  "this-or-that": {
    id: "this-or-that",
    path: "/this-or-that-wheel",
    pageTitle: "This or That Wheel | Free This vs That Spinner",
    description:
      "Spin a free This or That Wheel to pick between two options. A fun this-or-that decision spinner for games, icebreakers, and everyday choices.",
    h1: "This or That Wheel",
    shortTitle: "This or That Wheel",
    heroIntro:
      "Play this or that the easy way—spin the wheel. THIS and THAT are ready to go for icebreakers, party games, and quick preference picks.",
    keywords: [
      "this or that wheel",
      "this or that spinner",
      "this vs that",
      "this or that game",
      "preference wheel",
    ],
    articleTitle: "Spin This or That Online",
    articleIntro: [
      "This or That is a classic preference game. This wheel loads THIS and THAT so you can run rounds instantly—or rename the slices to the two things you are comparing.",
      "Great for icebreakers, family game night, classroom warm-ups, and social challenges. Everyone watches the same spin land on this or that.",
      "For more formal either/or wording, use the Either Or Wheel. For yes/no decisions, open the Yes No Wheel.",
    ],
    uniqueSection: {
      title: "This or That Game Ideas",
      intro: "Turn a simple spinner into a full round of preference play.",
      points: [
        {
          title: "Icebreaker rounds",
          description: "Coffee or tea? Beach or mountains? Spin and share why.",
        },
        {
          title: "Party prompts",
          description: "Let the wheel choose the next this-or-that question topic.",
        },
        {
          title: "Classroom warm-ups",
          description: "Quick opinion spins that get every student talking.",
        },
        {
          title: "Content & streams",
          description: "Visual this-vs-that picks that audiences can follow live.",
        },
      ],
    },
    eeat: {
      experience:
        "Built around a format people already play at parties and in classrooms—just faster and fairer.",
      expertise:
        "Defaults to THIS / THAT labels with equal odds; customize Text for any two competing options.",
      trust:
        "Entertainment and preference play only. Not for serious advisory decisions.",
    },
    faq: [
      {
        question: "What is a This or That Wheel?",
        answer:
          "It is a spinner for this-vs-that choices, starting with THIS and THAT labels you can customize.",
      },
      {
        question: "Can I use my own options?",
        answer: "Yes. Rename the slices to the two things you want to compare.",
      },
      {
        question: "Is it good for icebreakers?",
        answer: "Yes—visual spins work well for groups and classrooms.",
      },
      {
        question: "Is it free?",
        answer: "Yes.",
      },
    ],
    siblingIds: siblingsExcept("this-or-that"),
    deepLink: {
      mode: "quick-decision",
      optionLabels: { yes: "THIS", no: "THAT", maybe: "MAYBE" },
      toolTitle: "This or That Wheel",
      toolDescription: "Spin THIS or THAT for preference picks and games.",
      resultTitle: "This or that?",
    },
  },

  "true-false": {
    id: "true-false",
    path: "/true-false-wheel",
    pageTitle: "True False Wheel | Spin True or False Online",
    description:
      "Spin a free True False Wheel for a random TRUE or FALSE. Fair online spinner for quizzes, classroom games, and party challenges.",
    h1: "True False Wheel",
    shortTitle: "True False Wheel",
    heroIntro:
      "Need a random true or false? Spin the True False Wheel for an instant TRUE or FALSE—great for quiz warm-ups, classroom games, and party prompts.",
    keywords: [
      "true false wheel",
      "true or false spinner",
      "true false generator",
      "random true or false",
      "true false game",
    ],
    articleTitle: "Spin True or False",
    articleIntro: [
      "A True False Wheel is a binary spinner labeled TRUE and FALSE. Use it to assign random answers for practice quizzes, icebreakers, or playful “fact or fiction” rounds.",
      "Teachers can spin for warm-up games; hosts can use it for party challenges. Customize colors and spin timing to match your activity.",
      "For yes/no wording, use the Yes No Wheel. For debate-style framing, try Pros and Cons.",
    ],
    uniqueSection: {
      title: "Classroom & Game Uses",
      intro: "True/false spins keep participation fast and fair.",
      points: [
        {
          title: "Quiz warm-ups",
          description: "Assign random true/false practice before a real quiz.",
        },
        {
          title: "Fact or fiction",
          description: "Spin, then have students defend or invent a matching statement.",
        },
        {
          title: "Party challenges",
          description: "True = dare, False = truth—or invent your own house rules.",
        },
        {
          title: "Team relays",
          description: "Use elimination so each result feels fresh across rounds.",
        },
      ],
    },
    eeat: {
      experience:
        "Aimed at classroom and game hosts who already run true/false activities and want a shared visual pick.",
      expertise:
        "Loads equal TRUE and FALSE slices so the assignment is balanced unless you change weights.",
      trust:
        "For games and practice only—not grading authenticity or factual verification.",
    },
    faq: [
      {
        question: "What is a True False Wheel?",
        answer:
          "An online spinner that randomly selects TRUE or FALSE for games, warm-ups, and challenges.",
      },
      {
        question: "Can I map True/False to Truth or Dare?",
        answer:
          "Yes—set your own house rules, or open Truth or Dare mode from the main Yes or No Wheel.",
      },
      {
        question: "Are outcomes equally likely?",
        answer: "Yes with equal slices and weights.",
      },
      {
        question: "Is it free?",
        answer: "Yes.",
      },
    ],
    siblingIds: siblingsExcept("true-false"),
    deepLink: {
      mode: "quick-decision",
      optionLabels: { yes: "TRUE", no: "FALSE", maybe: "MAYBE" },
      toolTitle: "True False Wheel",
      toolDescription: "Spin for TRUE or FALSE.",
      resultTitle: "True or false?",
    },
  },

  "pros-cons": {
    id: "pros-cons",
    path: "/pros-and-cons-wheel",
    pageTitle: "Pros and Cons Wheel | Spin Pro vs Con Online",
    description:
      "Spin a free Pros and Cons Wheel to land on PRO or CON. A playful decision spinner for debates, brainstorms, and light decision play.",
    h1: "Pros and Cons Wheel",
    shortTitle: "Pros and Cons Wheel",
    heroIntro:
      "Exploring both sides? Spin the Pros and Cons Wheel for a random PRO or CON prompt—useful for debates, brainstorms, and light decision games.",
    keywords: [
      "pros and cons wheel",
      "pro con spinner",
      "pros vs cons",
      "pros and cons decision",
      "debate wheel",
    ],
    articleTitle: "Spin Pros vs Cons",
    articleIntro: [
      "A Pros and Cons Wheel does not replace a real pros/cons list—it randomly picks a side to argue, explore, or act on next. Default labels are PRO and CON.",
      "Use it in classrooms for debate practice, in teams for playful prioritization, or at home when you want a structured “argue this side” prompt.",
      "For a final yes/no call after discussion, jump to the Decision Wheel or Yes No Wheel.",
    ],
    uniqueSection: {
      title: "How to Use Pros vs Cons Spins",
      intro: "Treat the result as a prompt—not the whole decision process.",
      points: [
        {
          title: "Debate practice",
          description: "Spin a side, then argue it for two minutes.",
        },
        {
          title: "Brainstorm focus",
          description: "Force the group to list only pros—or only cons—next.",
        },
        {
          title: "Writing prompts",
          description: "Write a paragraph defending the spun side of an issue.",
        },
        {
          title: "Light decisions",
          description: "After listing real pros/cons, spin if you still need a tie-break.",
        },
      ],
    },
    eeat: {
      experience:
        "Inspired by how teachers and facilitators use random side-assignment to spark balanced discussion.",
      expertise:
        "Starts with PRO / CON labels and equal odds; customize for your topic in Text.",
      trust:
        "A discussion prompt tool. Do not use random chance alone for health, legal, or financial decisions.",
    },
    faq: [
      {
        question: "What is a Pros and Cons Wheel?",
        answer:
          "It is a spinner that randomly lands on PRO or CON to prompt debate, brainstorming, or a playful tie-break.",
      },
      {
        question: "Does this replace a pros/cons list?",
        answer:
          "No. Use a real list for important decisions; use this wheel for prompts and light tie-breaks.",
      },
      {
        question: "Can I customize the labels?",
        answer: "Yes. Rename slices to fit your topic or activity.",
      },
      {
        question: "Is it free?",
        answer: "Yes.",
      },
    ],
    siblingIds: siblingsExcept("pros-cons"),
    deepLink: {
      mode: "quick-decision",
      optionLabels: { yes: "PRO", no: "CON", maybe: "MAYBE" },
      toolTitle: "Pros and Cons Wheel",
      toolDescription: "Spin PRO or CON for debates and decision prompts.",
      resultTitle: "Pros or cons?",
    },
  },
}

export function getYesNoPickerSpoke(id: YesNoPickerSpokeId): YesNoPickerSpokeSeo {
  return YES_NO_PICKER_SPOKES[id]
}

export function getYesNoSpokeSiblings(spoke: YesNoPickerSpokeSeo): YesNoPickerSpokeSeo[] {
  return spoke.siblingIds.map((id) => YES_NO_PICKER_SPOKES[id])
}

export const YES_NO_PICKER_CLUSTER_LINKS = [
  {
    label: "Yes or No Wheel",
    href: YES_NO_PICKER_PATH,
    description: "Main pillar — full decision spinner, modes, and customization.",
  },
  ...Object.values(YES_NO_PICKER_SPOKES).map((spoke) => ({
    label: spoke.shortTitle,
    href: spoke.path,
    description:
      spoke.description.slice(0, 110) + (spoke.description.length > 110 ? "…" : ""),
  })),
] as const

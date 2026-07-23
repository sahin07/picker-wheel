import {
  FORTUNE_WHEEL_H1,
  FORTUNE_WHEEL_HERO_INTRO,
  FORTUNE_WHEEL_KEYWORDS,
  FORTUNE_WHEEL_PAGE_DESCRIPTION,
  FORTUNE_WHEEL_PAGE_TITLE,
  FORTUNE_WHEEL_PATH,
  FORTUNE_WHEEL_SHORT_TITLE,
  FORTUNE_WHEEL_SITE_URL,
} from "@/lib/fortune-wheel-seo"
import {
  getFortuneWheelUseCase,
  type FortuneWheelUseCaseAccent,
  type FortuneWheelUseCaseConfig,
  type FortuneWheelUseCaseId,
} from "@/lib/fortune-wheel-use-cases"

export type FortuneWheelSpokeId =
  | "fortune"
  | "custom"
  | "classroom"
  | "prize"
  | "truth-or-dare"
  | "holiday"
  | "game-night"
  | "icebreaker"
  | "jess-coleman"
  | "rainey-dorbor"

export type FortuneWheelDeepLink = {
  useCaseId: FortuneWheelUseCaseId
  config: FortuneWheelUseCaseConfig
}

export type FortuneWheelSpokeFaq = {
  question: string
  answer: string
}

export type FortuneWheelSpokeSeo = {
  id: FortuneWheelSpokeId
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
  faq: readonly FortuneWheelSpokeFaq[]
  siblingIds: readonly FortuneWheelSpokeId[]
  deepLink: FortuneWheelDeepLink
  accent: FortuneWheelUseCaseAccent
}

export function fortuneSpokeUrl(path: string): string {
  return `${FORTUNE_WHEEL_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

const ALL_SPOKE_IDS: FortuneWheelSpokeId[] = [
  "fortune",
  "custom",
  "classroom",
  "prize",
  "truth-or-dare",
  "holiday",
  "game-night",
  "icebreaker",
  "jess-coleman",
  "rainey-dorbor",
]

const USE_CASE_BY_SPOKE: Record<FortuneWheelSpokeId, FortuneWheelUseCaseId> = {
  fortune: "decision",
  custom: "custom",
  classroom: "classroom",
  prize: "prize",
  "truth-or-dare": "truth-or-dare",
  holiday: "holiday",
  "game-night": "game-night",
  icebreaker: "icebreaker",
  "jess-coleman": "jess-coleman",
  "rainey-dorbor": "rainey-dorbor",
}

function configFor(id: FortuneWheelUseCaseId): FortuneWheelUseCaseConfig {
  const useCase = getFortuneWheelUseCase(id)
  if (!useCase) throw new Error(`Missing Fortune Wheel use case: ${id}`)
  return useCase.config
}

type FortuneWheelSpokeDraft = Omit<
  FortuneWheelSpokeSeo,
  "siblingIds" | "deepLink"
>

function finalize(draft: FortuneWheelSpokeDraft): FortuneWheelSpokeSeo {
  const useCaseId = USE_CASE_BY_SPOKE[draft.id]
  return {
    ...draft,
    siblingIds: ALL_SPOKE_IDS.filter((id) => id !== draft.id),
    deepLink: { useCaseId, config: configFor(useCaseId) },
  }
}

export const FORTUNE_WHEEL_SPOKES: Record<
  FortuneWheelSpokeId,
  FortuneWheelSpokeSeo
> = {
  fortune: finalize({
    id: "fortune",
    path: FORTUNE_WHEEL_PATH,
    pageTitle: FORTUNE_WHEEL_PAGE_TITLE,
    description: FORTUNE_WHEEL_PAGE_DESCRIPTION,
    h1: FORTUNE_WHEEL_H1,
    shortTitle: FORTUNE_WHEEL_SHORT_TITLE,
    heroIntro: FORTUNE_WHEEL_HERO_INTRO,
    keywords: FORTUNE_WHEEL_KEYWORDS,
    articleTitle: "Create and spin your own Wheel of Fortune",
    articleIntro: [
      "Build an independent online fortune wheel for decisions, activities, prizes, lessons, and games. The default decision template gives you useful starting labels without locking the wheel to one type of activity.",
      "Replace every entry with your own text, colors, images, and result messages. Adjust the spin timing, remove winners between rounds, save reusable wheels, and share a setup with your group.",
    ],
    uniqueSection: {
      title: "A flexible fortune wheel for any occasion",
      intro:
        "Start with a balanced decision wheel, then shape the spinner around the people and purpose in front of you.",
      points: [
        {
          title: "Make it yours",
          description:
            "Use unlimited custom entries instead of a fixed set of choices.",
        },
        {
          title: "Choose fairly",
          description:
            "Each enabled option receives an equal wedge and an equal chance per spin.",
        },
        {
          title: "Reuse and share",
          description:
            "Save recurring wheels and share configured choices with a class, team, or party.",
        },
      ],
    },
    faq: [
      {
        question: "What is this Wheel of Fortune tool?",
        answer:
          "It is a free independent online spinner for custom choices, decisions, games, lessons, prizes, and group activities.",
      },
      {
        question: "Can I replace all of the default choices?",
        answer:
          "Yes. Rename, add, reorder, disable, or remove entries and personalize their colors, images, and messages.",
      },
      {
        question: "Is this connected to the television show?",
        answer:
          "No. It is an independent wheel tool and is not affiliated with or endorsed by the Wheel of Fortune television show, Sony, or CBS.",
      },
      {
        question: "Can I save my fortune wheel?",
        answer:
          "Yes. Save it in your browser and return to the same setup for another lesson, meeting, party, or game.",
      },
    ],
    accent: "violet",
  }),
  custom: finalize({
    id: "custom",
    path: "/custom-wheel-of-fortune",
    pageTitle: "Custom Wheel of Fortune | Make Your Own Spinner Online",
    description:
      "Make a custom Wheel of Fortune online with your own entries, colors, images, result messages, and spin settings. Start free with a simple editable template.",
    h1: "Custom Wheel of Fortune",
    shortTitle: "Custom Wheel",
    heroIntro:
      "Start with six equal options and turn them into a wheel made entirely for you. Add any labels, colors, images, and winner messages, then spin, save, and share.",
    keywords: [
      "custom wheel of fortune",
      "make your own wheel of fortune",
      "fortune wheel maker",
      "custom spinner online",
      "editable fortune wheel template",
    ],
    articleTitle: "Make a Wheel of Fortune with your own entries",
    articleIntro: [
      "The custom template starts with Option A through Option F so there is no theme to undo. Replace those placeholders with names, tasks, destinations, products, prompts, or any other choices.",
      "Add more entries whenever you need them and personalize the visual treatment. Every enabled entry remains an equal random option unless you choose the separate weighted wheel tool.",
    ],
    uniqueSection: {
      title: "Build from a clean, editable template",
      intro:
        "Use the simple starting wheel when your idea does not fit a preset.",
      points: [
        {
          title: "Blank starting point",
          description:
            "Six neutral options make it quick to paste or type your own list.",
        },
        {
          title: "Visual control",
          description:
            "Set colors and optional images that make each wedge easy to recognize.",
        },
        {
          title: "Flexible results",
          description:
            "Write a custom winner message and choose whether selected entries stay or leave.",
        },
      ],
    },
    faq: [
      {
        question: "How do I make a custom fortune wheel?",
        answer:
          "Open the template, replace the option labels, add or remove entries, personalize the design, and press spin.",
      },
      {
        question: "How many options can I add?",
        answer:
          "You can add as many entries as your activity needs, though shorter labels are easier to read on crowded wheels.",
      },
      {
        question: "Can custom entries include images?",
        answer:
          "Yes. Add an optional image URL to make choices and prizes more visual.",
      },
      {
        question: "Can I reuse the finished wheel?",
        answer:
          "Yes. Save the wheel in your browser and share the configured setup when needed.",
      },
    ],
    accent: "violet",
  }),
  classroom: finalize({
    id: "classroom",
    path: "/classroom-wheel-of-fortune",
    pageTitle: "Classroom Wheel of Fortune | Free Teacher Spinner",
    description:
      "Use a free Classroom Wheel of Fortune for rewards, student roles, reading turns, review topics, and brain breaks. Customize and spin online.",
    h1: "Classroom Wheel of Fortune",
    shortTitle: "Classroom Wheel",
    heroIntro:
      "Turn classroom choices into a clear, engaging spin. Start with student-friendly rewards and roles, or replace every wedge with names, review topics, jobs, and activities.",
    keywords: [
      "classroom wheel of fortune",
      "teacher spinner wheel",
      "classroom reward wheel",
      "student name picker",
      "school fortune wheel",
    ],
    articleTitle: "Use a fortune wheel in the classroom",
    articleIntro: [
      "The classroom preset includes a homework pass, extra recess, reading choice, mystery reward, line leader, and quiet prize. Teachers can edit the language and rewards to fit their policies and learners.",
      "The same wheel can pick review categories, student turns, classroom jobs, brain breaks, or discussion prompts. Explain the rules before spinning so the activity stays predictable and inclusive.",
    ],
    uniqueSection: {
      title: "Teacher-friendly ways to customize",
      intro:
        "Adapt one reusable wheel to instruction, routines, and positive reinforcement.",
      points: [
        {
          title: "Review rounds",
          description:
            "Replace wedges with subjects, question levels, vocabulary, or team challenges.",
        },
        {
          title: "Classroom roles",
          description:
            "Choose readers, line leaders, helpers, presenters, or cleanup tasks.",
        },
        {
          title: "Suitable rewards",
          description:
            "Use privileges and low-cost rewards approved for your class and school.",
        },
      ],
    },
    faq: [
      {
        question: "What can teachers add to the classroom wheel?",
        answer:
          "Add student names, subjects, questions, classroom jobs, reading turns, brain breaks, or suitable rewards.",
      },
      {
        question: "Can I remove a student after a spin?",
        answer:
          "Yes. Winner removal helps give each student one turn before names repeat.",
      },
      {
        question: "Can I save different wheels for different classes?",
        answer:
          "Yes. Save reusable setups in the browser and name them for each class or activity.",
      },
      {
        question: "Is the classroom wheel free?",
        answer:
          "Yes. Teachers can customize and spin the wheel for free without creating an account.",
      },
    ],
    accent: "violet",
  }),
  prize: finalize({
    id: "prize",
    path: "/prize-wheel-of-fortune",
    pageTitle: "Prize Wheel of Fortune | Free Online Prize Spinner",
    description:
      "Create a free Prize Wheel of Fortune for rewards, giveaways, events, and promotions. Customize prizes, colors, images, messages, and winner removal.",
    h1: "Prize Wheel of Fortune",
    shortTitle: "Prize Wheel",
    heroIntro:
      "Add rewards, giveaway items, perks, or a grand prize to a colorful online wheel. Customize the rules, spin for a winner, and remove selected prizes when needed.",
    keywords: [
      "prize wheel of fortune",
      "online prize wheel",
      "giveaway wheel spinner",
      "reward wheel generator",
      "custom prize spinner",
    ],
    articleTitle: "Create an online fortune prize wheel",
    articleIntro: [
      "The prize template starts with stickers, merchandise, a shoutout, a grand prize, an extra spin, and a consolation result. Replace these examples with rewards that suit your event, class, business, or community.",
      "Use images to preview prizes and winner messages to explain what happens next. State eligibility and fulfillment rules before the first spin, especially for public promotions.",
    ],
    uniqueSection: {
      title: "Run a clear and engaging prize spin",
      intro:
        "Plan the prize list and repeat-winner rules before participants take a turn.",
      points: [
        {
          title: "Show each reward",
          description:
            "Use concise labels, distinct colors, and optional images for recognizable prizes.",
        },
        {
          title: "Control repeats",
          description:
            "Remove won prizes or participant names when each result must be unique.",
        },
        {
          title: "Explain next steps",
          description:
            "Add result messages with redemption, contact, or collection instructions.",
        },
      ],
    },
    faq: [
      {
        question: "Can I add my own prizes?",
        answer:
          "Yes. Replace every sample reward and add your own labels, colors, images, and result instructions.",
      },
      {
        question: "Can the wheel remove a prize after it is won?",
        answer:
          "Yes. Enable winner removal when a prize should only be awarded once.",
      },
      {
        question: "Can I use it for a giveaway?",
        answer:
          "Yes. Define eligibility, odds, deadlines, and fulfillment separately, then use the wheel for the random selection.",
      },
      {
        question: "Does the tool provide the prizes?",
        answer:
          "No. The organizer is responsible for all prizes, rules, eligibility, and fulfillment.",
      },
    ],
    accent: "amber",
  }),
  "truth-or-dare": finalize({
    id: "truth-or-dare",
    path: "/truth-or-dare-wheel-of-fortune",
    pageTitle: "Truth or Dare Wheel of Fortune | Free Party Spinner",
    description:
      "Spin a free Truth or Dare Wheel of Fortune with truth, dare, double dare, group challenge, skip, and mystery options. Customize it for your party.",
    h1: "Truth or Dare Wheel of Fortune",
    shortTitle: "Truth or Dare",
    heroIntro:
      "Let the wheel choose truth, dare, double dare, skip, a group challenge, or a mystery prompt. Edit every option to keep the game fun and comfortable for your group.",
    keywords: [
      "truth or dare wheel of fortune",
      "truth or dare spinner",
      "party challenge wheel",
      "online dare wheel",
      "custom truth wheel",
    ],
    articleTitle: "Spin for a truth, dare, or group challenge",
    articleIntro: [
      "This party template chooses the type of prompt while your group supplies an age-appropriate truth or challenge. You can also replace the category wedges with complete prompts.",
      "Set boundaries before playing and make Skip available without pressure. Remove or rewrite anything unsafe, humiliating, discriminatory, illegal, or unsuitable for the participants.",
    ],
    uniqueSection: {
      title: "Keep party challenges fun and respectful",
      intro:
        "A good wheel creates variety while participants keep control of their boundaries.",
      points: [
        {
          title: "Agree on limits",
          description:
            "Decide acceptable topics and challenges before the first spin.",
        },
        {
          title: "Keep a skip option",
          description:
            "Let anyone pass without explanation or penalty.",
        },
        {
          title: "Customize for the group",
          description:
            "Match prompts to the participants' ages, setting, access needs, and comfort.",
        },
      ],
    },
    faq: [
      {
        question: "Does the wheel include complete truth and dare prompts?",
        answer:
          "The preset chooses prompt categories. You can replace them with complete prompts or use a separate list.",
      },
      {
        question: "Can players skip a result?",
        answer:
          "Yes. The preset includes Skip, and groups should allow anyone to pass without pressure.",
      },
      {
        question: "Can I customize the challenges?",
        answer:
          "Yes. Edit every entry so prompts are safe, respectful, and suitable for your group.",
      },
    ],
    accent: "rose",
  }),
  holiday: finalize({
    id: "holiday",
    path: "/holiday-wheel-of-fortune",
    pageTitle: "Holiday Wheel of Fortune | Free Festive Activity Spinner",
    description:
      "Create a free Holiday Wheel of Fortune for gift exchanges, festive treats, movie nights, games, songs, and seasonal activities. Customize online.",
    h1: "Holiday Wheel of Fortune",
    shortTitle: "Holiday Wheel",
    heroIntro:
      "Spin for a festive activity, treat, song, movie, ornament, or mystery gift. Customize the wheel for your holiday, traditions, guests, and budget.",
    keywords: [
      "holiday wheel of fortune",
      "holiday spinner wheel",
      "gift exchange wheel",
      "Christmas activity spinner",
      "festive fortune wheel",
    ],
    articleTitle: "Plan festive choices with a holiday wheel",
    articleIntro: [
      "The holiday preset mixes a gift exchange, hot cocoa, movie night, ornament pick, mystery gift, and carol choice. Swap in traditions and activities that matter to your family, class, team, or event.",
      "Use the spinner to choose an activity order, assign gift-exchange turns, select a movie, or reveal a small surprise. Keep options inclusive of the holidays and preferences represented in your group.",
    ],
    uniqueSection: {
      title: "Customize a wheel for your celebration",
      intro:
        "Turn a seasonal list into one shared, visual activity.",
      points: [
        {
          title: "Gift exchanges",
          description:
            "Choose turn order, gift categories, recipients, or mystery packages.",
        },
        {
          title: "Festive activities",
          description:
            "Spin for crafts, movies, songs, games, snacks, or outdoor plans.",
        },
        {
          title: "Inclusive traditions",
          description:
            "Rename and recolor every wedge to match the celebration and guests.",
        },
      ],
    },
    faq: [
      {
        question: "Which holidays can I use this wheel for?",
        answer:
          "Any celebration. Replace the starter entries with traditions, activities, and language that fit your group.",
      },
      {
        question: "Can it choose gift-exchange order?",
        answer:
          "Yes. Add participant names and remove each selected name to create a random order without repeats.",
      },
      {
        question: "Can I add holiday activity images?",
        answer:
          "Yes. Optional images can make crafts, treats, films, and gifts easier to recognize.",
      },
    ],
    accent: "rose",
  }),
  "game-night": finalize({
    id: "game-night",
    path: "/game-night-wheel-of-fortune",
    pageTitle: "Game Night Wheel of Fortune | Free Game Picker Spinner",
    description:
      "Use a free Game Night Wheel of Fortune to choose charades, trivia, drawing, dance-offs, wild cards, and more. Add your own games and spin online.",
    h1: "Game Night Wheel of Fortune",
    shortTitle: "Game Night Wheel",
    heroIntro:
      "Skip the debate over what to play next. Spin for charades, trivia, drawing, a dance-off, a wild card, or a free pass, then add your group's favorite games.",
    keywords: [
      "game night wheel of fortune",
      "game picker wheel",
      "family game night spinner",
      "party game generator",
      "random game wheel",
    ],
    articleTitle: "Let the wheel choose your next game",
    articleIntro: [
      "The game-night preset combines familiar group activities with wild-card and free-pass outcomes. Replace them with board games, video games, mini challenges, teams, or round modifiers.",
      "Use winner removal to play each activity once, or leave every choice active when repeats are welcome. Result messages can hold time limits, scoring rules, or setup instructions.",
    ],
    uniqueSection: {
      title: "Keep game night moving",
      intro:
        "Use one wheel to settle choices and introduce variety between rounds.",
      points: [
        {
          title: "Pick the activity",
          description:
            "Add every game your group is ready and equipped to play.",
        },
        {
          title: "Add round modifiers",
          description:
            "Use wild cards for teams, time limits, bonus points, or house rules.",
        },
        {
          title: "Avoid repeats",
          description:
            "Remove completed activities until the whole game list has had a turn.",
        },
      ],
    },
    faq: [
      {
        question: "Can I add board games and video games?",
        answer:
          "Yes. Replace the starter activities with any games available to your group.",
      },
      {
        question: "Can the wheel choose teams or turn order?",
        answer:
          "You can add team names or players, though the dedicated team picker is better for building multiple balanced groups.",
      },
      {
        question: "How do I prevent the same game from repeating?",
        answer:
          "Enable winner removal so a selected game leaves the wheel for later spins.",
      },
    ],
    accent: "violet",
  }),
  icebreaker: finalize({
    id: "icebreaker",
    path: "/icebreaker-wheel-of-fortune",
    pageTitle: "Icebreaker Wheel of Fortune | Free Question Spinner",
    description:
      "Spin a free Icebreaker Wheel of Fortune for fun facts, favorite movies, would-you-rather questions, compliments, and conversation prompts.",
    h1: "Icebreaker Wheel of Fortune",
    shortTitle: "Icebreaker Wheel",
    heroIntro:
      "Start a friendly conversation with a random prompt category. Customize the wheel for classrooms, meetings, workshops, clubs, parties, and new teams.",
    keywords: [
      "icebreaker wheel of fortune",
      "icebreaker question spinner",
      "conversation prompt wheel",
      "team building spinner",
      "classroom icebreaker wheel",
    ],
    articleTitle: "Start conversations with an icebreaker wheel",
    articleIntro: [
      "The icebreaker preset includes Two Truths, Favorite Movie, Fun Fact, Would You Rather, Compliment, and Mystery Prompt. Use the categories as cues or replace them with complete questions.",
      "Choose prompts that do not require sensitive personal disclosure. A pass option and low-pressure questions help participants join at their own comfort level.",
    ],
    uniqueSection: {
      title: "Create welcoming group prompts",
      intro:
        "Good icebreakers are easy to answer, relevant to the setting, and optional.",
      points: [
        {
          title: "Match the setting",
          description:
            "Use professional prompts at work and age-appropriate prompts in classrooms.",
        },
        {
          title: "Mix prompt styles",
          description:
            "Combine favorites, hypotheticals, quick facts, and positive group activities.",
        },
        {
          title: "Keep participation comfortable",
          description:
            "Avoid sensitive topics and let participants skip or choose another prompt.",
        },
      ],
    },
    faq: [
      {
        question: "Can I add my own icebreaker questions?",
        answer:
          "Yes. Replace category labels with complete questions or add as many prompt types as you need.",
      },
      {
        question: "Is the wheel suitable for work meetings?",
        answer:
          "Yes. Use concise, professional, low-pressure prompts relevant to your team and meeting.",
      },
      {
        question: "Can participants skip a question?",
        answer:
          "Yes. Set that expectation before spinning or add a visible Skip entry to the wheel.",
      },
      {
        question: "Can teachers use this for students?",
        answer:
          "Yes. Choose age-appropriate prompts that support inclusion and do not require private disclosures.",
      },
    ],
    accent: "amber",
  }),
  "jess-coleman": finalize({
    id: "jess-coleman",
    path: "/jess-coleman-wheel-of-fortune",
    pageTitle: "Jess Coleman Wheel of Fortune | Custom Spin Template",
    description:
      "Open a ready-made Jess Coleman Wheel of Fortune spin template inspired by trending search interest, then customize the entries, colors, and messages.",
    h1: "Jess Coleman Wheel of Fortune",
    shortTitle: "Trending: Jess Coleman",
    heroIntro:
      "This ready-made spin template responds to trending search interest around Jess Coleman. It is a customizable independent wheel with light starter entries.",
    keywords: [
      "jess coleman wheel of fortune",
      "jess coleman wheel",
      "jess coleman spinner template",
      "custom fortune wheel",
    ],
    articleTitle: "Customize the Jess Coleman spin template",
    articleIntro: [
      "This secondary template provides light, generic labels inspired by trending search interest and keeps the focus on the customizable spinner.",
      "Change any label, color, image, or result message to make the wheel your own, or return to the main Wheel of Fortune hub for the general decision template and evergreen activity wheels.",
    ],
    uniqueSection: {
      title: "Turn the trending template into your own wheel",
      intro:
        "The preset is only a starting point; every visible choice can be replaced.",
      points: [
        {
          title: "Edit the labels",
          description:
            "Swap the light starter options for names, activities, prizes, or prompts.",
        },
        {
          title: "Choose your style",
          description:
            "Set wedge colors, optional images, and messages for your activity.",
        },
        {
          title: "Use the main hub",
          description:
            "Return to the Wheel of Fortune hub for broader templates and decision tools.",
        },
      ],
    },
    faq: [
      {
        question: "What is the Jess Coleman Wheel of Fortune page?",
        answer:
          "It is a ready-made independent spin template inspired by trending search interest.",
      },
      {
        question: "What is this page designed for?",
        answer:
          "It is designed for creating and spinning a customizable online wheel.",
      },
      {
        question: "Can I replace the Jess Coleman template entries?",
        answer:
          "Yes. Customize every entry, color, image, and result message freely.",
      },
      {
        question: "Is this template official?",
        answer:
          "No. It is not affiliated with Jess Coleman, the television show, Sony, or CBS.",
      },
    ],
    accent: "rose",
  }),
  "rainey-dorbor": finalize({
    id: "rainey-dorbor",
    path: "/rainey-dorbor-wheel-of-fortune",
    pageTitle: "Rainey Dorbor Wheel of Fortune | Custom Spin Template",
    description:
      "Open a ready-made Rainey Dorbor Wheel of Fortune spin template inspired by trending search interest, then customize every wheel entry and setting.",
    h1: "Rainey Dorbor Wheel of Fortune",
    shortTitle: "Trending: Rainey Dorbor",
    heroIntro:
      "This ready-made spin template responds to trending search interest around Rainey Dorbor. It is a customizable independent wheel with light starter entries.",
    keywords: [
      "rainey dorbor wheel of fortune",
      "rainey dorbor wheel",
      "rainey dorbor spinner template",
      "custom fortune wheel",
    ],
    articleTitle: "Customize the Rainey Dorbor spin template",
    articleIntro: [
      "This secondary template provides light, generic labels inspired by trending search interest and keeps the focus on the customizable spinner.",
      "Replace the entries with your own choices and adjust the design and spin behavior, or return to the main Wheel of Fortune hub for the default decision wheel and evergreen templates.",
    ],
    uniqueSection: {
      title: "Make the trending template fit your activity",
      intro:
        "Use the starter labels for a quick spin or replace the complete list.",
      points: [
        {
          title: "Add your choices",
          description:
            "Use personal names, party prompts, lesson topics, prizes, or decisions.",
        },
        {
          title: "Customize the result",
          description:
            "Change colors, attach images, and write a message for each selected entry.",
        },
        {
          title: "Explore evergreen wheels",
          description:
            "Return to the hub for classroom, prize, icebreaker, holiday, and game-night templates.",
        },
      ],
    },
    faq: [
      {
        question: "What is the Rainey Dorbor Wheel of Fortune page?",
        answer:
          "It is a ready-made independent spin template inspired by trending search interest.",
      },
      {
        question: "What is this page designed for?",
        answer:
          "It is designed for creating and spinning a customizable online wheel.",
      },
      {
        question: "Can I add my own entries?",
        answer:
          "Yes. Rename, add, remove, recolor, and personalize all wheel entries.",
      },
      {
        question: "Is this an official template?",
        answer:
          "No. It is not affiliated with Rainey Dorbor, the television show, Sony, or CBS.",
      },
    ],
    accent: "rose",
  }),
}

export function getFortuneWheelSpoke(
  id: FortuneWheelSpokeId,
): FortuneWheelSpokeSeo {
  return FORTUNE_WHEEL_SPOKES[id]
}

export function getAllFortuneWheelSpokes(): FortuneWheelSpokeSeo[] {
  return ALL_SPOKE_IDS.map((id) => FORTUNE_WHEEL_SPOKES[id])
}

export function getFortuneSpokeSiblings(
  spoke: FortuneWheelSpokeSeo,
): FortuneWheelSpokeSeo[] {
  return spoke.siblingIds
    .map((id) => FORTUNE_WHEEL_SPOKES[id])
    .filter((item): item is FortuneWheelSpokeSeo => Boolean(item?.path))
}

const POPULAR_SPOKE_IDS: FortuneWheelSpokeId[] = [
  "prize",
  "classroom",
  "icebreaker",
  "truth-or-dare",
  "custom",
  "holiday",
  "game-night",
  "jess-coleman",
  "rainey-dorbor",
]

export const FORTUNE_WHEEL_POPULAR_SPOKE_LINKS: {
  id: FortuneWheelSpokeId
  href: string
  label: string
  description: string
  accent: FortuneWheelUseCaseAccent
}[] = POPULAR_SPOKE_IDS.map((id) => {
  const spoke = FORTUNE_WHEEL_SPOKES[id]
  return {
    id,
    href: spoke.path,
    label: spoke.shortTitle,
    description: spoke.description,
    accent: spoke.accent,
  }
})

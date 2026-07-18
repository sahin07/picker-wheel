import { NUMBER_PICKER_PATH, NUMBER_PICKER_SITE_URL } from "@/lib/number-picker-seo"
import type { NumberPickerUseCaseId } from "@/lib/number-picker-use-cases"

export type NumberPickerSpokeId = "1-to-10" | "1-to-100" | "bingo" | "lottery"

export type NumberPickerDeepLink =
  | {
      kind: "preset"
      preset: NumberPickerUseCaseId
    }
  | {
      kind: "range"
      min: number
      max: number
      interval?: number
      toolTitle?: string
      resultTitle?: string
    }

export type NumberPickerSpokeFaq = {
  question: string
  answer: string
}

export type NumberPickerSpokeSeo = {
  id: NumberPickerSpokeId
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
  faq: readonly NumberPickerSpokeFaq[]
  siblingIds: readonly NumberPickerSpokeId[]
  deepLink: NumberPickerDeepLink
}

export function spokeUrl(path: string): string {
  return `${NUMBER_PICKER_SITE_URL}${path}`
}

export const NUMBER_PICKER_SPOKES: Record<NumberPickerSpokeId, NumberPickerSpokeSeo> = {
  "1-to-10": {
    id: "1-to-10",
    path: "/number-wheel-1-to-10",
    pageTitle: "1 to 10 Number Wheel | Spin a Random Number 1–10",
    description:
      "Spin a free 1 to 10 number wheel for classrooms, board games, and quick decisions. Pick a random number from 1–10 with a fair, visual spinner—no signup required.",
    h1: "1 to 10 Number Wheel",
    shortTitle: "1–10 Number Wheel",
    heroIntro:
      "Need a random number between 1 and 10? This 1 to 10 number wheel is preloaded with ten equal slices so you can spin for classroom helpers, board-game moves, team picks, or everyday decisions. Everyone sees the same fair spin—faster than digging for a die and clearer than a silent random number generator.",
    keywords: [
      "1 to 10 number wheel",
      "number wheel 1 to 10",
      "random number 1 to 10",
      "spin 1 to 10",
      "1-10 spinner",
      "pick a number 1 to 10",
      "number picker 1-10",
    ],
    articleTitle: "Spin a Random Number from 1 to 10 Online",
    articleIntro: [
      "A 1–10 number wheel is one of the most useful small ranges for groups. Teachers use it to pick student numbers, presentation order, or warm-up prompts. Families use it when a die goes missing. Streamers and party hosts use it for quick challenges that stay easy to follow on screen.",
      "Unlike typing min and max into a form each time, this page opens already set to 1 through 10. You can still change the range, turn on elimination so winners leave the wheel, or jump to other number tools from the links below.",
      "If you need a larger pool later, open the 1–100 number wheel or return to the main Random Number Picker Wheel for any custom range.",
    ],
    uniqueSection: {
      title: "Best Uses for a 1–10 Spinner",
      intro:
        "Keep this wheel for short lists and fast turns. Here are the situations where a ten-slice spinner beats a bigger range:",
      points: [
        {
          title: "Classroom helpers",
          description:
            "Assign helper roles, question order, or table numbers without repeating until you reset—add elimination when you want every number used once.",
        },
        {
          title: "Board games & parties",
          description:
            "Replace a lost d10 or settle “who goes first” with a spin everyone can watch.",
        },
        {
          title: "Quick workouts",
          description:
            "Spin 1–10 for reps, rounds, or station order when you want a tiny random challenge.",
        },
        {
          title: "Icebreakers",
          description:
            "Ask everyone to share a story tied to the spun number (favorite age, jersey number digit, etc.).",
        },
      ],
    },
    faq: [
      {
        question: "Is every number from 1 to 10 equally likely?",
        answer:
          "Yes. With equal weights, each of the ten slices has the same chance. You can adjust weights in the Text tab if you intentionally want uneven odds.",
      },
      {
        question: "Can I remove a number after it wins?",
        answer:
          "Yes. Switch to Elimination mode so each selected number leaves the wheel—useful for turns, helpers, and “everyone goes once” games.",
      },
      {
        question: "Can I change the range later?",
        answer:
          "Absolutely. Edit min and max in the sidebar, or open the main Number Picker Wheel / 1–100 page for other presets.",
      },
      {
        question: "Is this the same as a random number generator?",
        answer:
          "It generates a fair random number, but the spinning wheel is built for groups who want to see the pick happen live—not just read a digit from a form.",
      },
    ],
    siblingIds: ["1-to-100", "bingo", "lottery"],
    deepLink: {
      kind: "range",
      min: 1,
      max: 10,
      interval: 1,
      toolTitle: "1–10 Number Wheel",
      resultTitle: "Number (1–10)",
    },
  },
  "1-to-100": {
    id: "1-to-100",
    path: "/number-wheel-1-to-100",
    pageTitle: "1 to 100 Number Wheel | Random Number Spinner 1–100",
    description:
      "Spin a free 1 to 100 number wheel for lucky picks, classroom draws, and games. Choose a random number from 1–100 with a fair visual spinner online.",
    h1: "1 to 100 Number Wheel",
    shortTitle: "1–100 Number Wheel",
    heroIntro:
      "Looking for a classic hundred-number spinner? This 1 to 100 number wheel loads numbers 1–100 so you can pick lucky numbers, run ticket-style draws, or play classroom games with a shared visual spin. It is a free random number picker tuned for the range people search for most.",
    keywords: [
      "1 to 100 number wheel",
      "number wheel 1 to 100",
      "random number 1 to 100",
      "spin 1 to 100",
      "1-100 spinner",
      "pick a number 1 to 100",
      "hundred number wheel",
    ],
    articleTitle: "Pick a Random Number from 1 to 100",
    articleIntro: [
      "A 1–100 wheel is the default mental model for many “pick a number” games: lucky numbers, raffle stand-ins, percentage-style challenges, and classroom activities that need a bigger pool than 1–10 without becoming unreadable.",
      "This page starts with the full 1–100 range already applied. Spin once for a single lucky pick, or use elimination when you need unique draws across a group. For tiny lists, switch to the 1–10 wheel; for bingo calls or lottery-style practice, use those dedicated pages instead.",
      "Need steps of 5 or 10, or a different max? Adjust the range controls on the tool, or open the main Random Number Picker Wheel for full customization.",
    ],
    uniqueSection: {
      title: "Why People Search for a 1–100 Wheel",
      intro:
        "This range sits in a sweet spot: large enough for “lucky number” vibes, small enough to stay usable on a spinning wheel.",
      points: [
        {
          title: "Lucky number games",
          description:
            "Ask each person to claim a favorite number, then spin to see whose number lands—or spin first and invent a challenge for that number.",
        },
        {
          title: "Classroom & club draws",
          description:
            "Map students or members to numbers 1–100 and spin for helpers, prizes, or presentation slots.",
        },
        {
          title: "Percent-style prompts",
          description:
            "Treat the result as a playful “percent” for how hard a challenge should be, how long a break lasts, or how many points a round is worth.",
        },
        {
          title: "Stream & party energy",
          description:
            "A full hundred-slice wheel looks dramatic on screen while staying familiar to viewers who already know 1–100 games.",
        },
      ],
    },
    faq: [
      {
        question: "Does the wheel include every number from 1 to 100?",
        answer:
          "Yes. It loads the full range 1–100 with equal weights by default. You can exclude values or change the interval in the sidebar if you need a subset.",
      },
      {
        question: "Will 100 slices make the wheel slow?",
        answer:
          "The spinner is built to handle this classic range. If you ever need a huge max (like 1–1000), use a larger interval on the main Number Picker Wheel so labels stay readable.",
      },
      {
        question: "Can I use it for giveaways?",
        answer:
          "Yes for casual classroom or party draws. Turn on elimination so winning numbers leave the wheel. For real contests, follow your local rules and platform policies.",
      },
      {
        question: "How is this different from the 1–10 wheel?",
        answer:
          "Same tool engine, different default range and copy. Use 1–10 for tiny groups and quick turns; use 1–100 when you want a larger lucky-number style pool.",
      },
    ],
    siblingIds: ["1-to-10", "bingo", "lottery"],
    deepLink: {
      kind: "range",
      min: 1,
      max: 100,
      interval: 1,
      toolTitle: "1–100 Number Wheel",
      resultTitle: "Number (1–100)",
    },
  },
  bingo: {
    id: "bingo",
    path: "/bingo-number-wheel",
    pageTitle: "Bingo Number Wheel | Free Bingo Caller 1–75 Online",
    description:
      "Call bingo numbers online with a free bingo number wheel. Spin 1–75 with classic B-I-N-G-O letters, elimination mode, and a clear call history for parties and classrooms.",
    h1: "Bingo Number Wheel",
    shortTitle: "Bingo Number Wheel",
    heroIntro:
      "Host bingo without digging for a ball cage. This bingo number wheel is set to 1–75 with elimination so each call is unique, and results show classic B-I-N-G-O style labels (like B12 or G54). Perfect for classroom parties, family game night, and virtual bingo on a shared screen.",
    keywords: [
      "bingo number wheel",
      "bingo caller online",
      "bingo number spinner",
      "random bingo number",
      "bingo wheel 1 to 75",
      "online bingo caller",
      "spin bingo numbers",
    ],
    articleTitle: "Call Bingo Numbers with a Spinning Wheel",
    articleIntro: [
      "A bingo number wheel replaces paper slips or a physical cage with a fair on-screen caller. This page preloads numbers 1 through 75 and uses elimination so the same ball cannot be called twice in a round.",
      "After each spin you get a lettered call based on standard U.S. bingo columns: B (1–15), I (16–30), N (31–45), G (46–60), and O (61–75). Players mark cards while the host watches the shared wheel—no arguing about who drew the slip.",
      "When the round ends, reset the wheel or reload the page setup to start a fresh 1–75 set. For non-bingo ranges, use the main Number Picker Wheel or the 1–10 / 1–100 pages.",
    ],
    uniqueSection: {
      title: "How This Bingo Caller Works",
      intro:
        "Built for hosts who need clarity more than flashy extras. Here is what makes this page different from a generic number spinner:",
      points: [
        {
          title: "1–75 with elimination",
          description:
            "Every number starts on the wheel. After a call, that number leaves so repeats cannot sneak into the same game.",
        },
        {
          title: "B-I-N-G-O letter mapping",
          description:
            "Results show the classic letter plus number so players can find the column on their card quickly.",
        },
        {
          title: "Call history",
          description:
            "Recent calls stay visible so late joiners and disputed marks are easier to resolve.",
        },
        {
          title: "Classroom & party ready",
          description:
            "Project the page, spin, and announce—no printer required for the caller side.",
        },
      ],
    },
    faq: [
      {
        question: "What bingo range does this wheel use?",
        answer:
          "It uses the common 1–75 U.S. bingo set with B-I-N-G-O column letters. You can change the range in the sidebar if your house rules differ.",
      },
      {
        question: "Can the same number be called twice?",
        answer:
          "Not while elimination mode stays on (the default for this page). Reset or rebuild the 1–75 set when you start a new round.",
      },
      {
        question: "Do players get bingo cards here?",
        answer:
          "This page is a number caller, not a full bingo card printer. Players use their own cards, apps, or printed sheets while you spin the calls.",
      },
      {
        question: "Is this only for parties?",
        answer:
          "No. Teachers use it for classroom bingo, vocabulary bingo, and review games. Families and online groups use the same caller on a shared screen.",
      },
    ],
    siblingIds: ["lottery", "1-to-100", "1-to-10"],
    deepLink: { kind: "preset", preset: "bingo" },
  },
  lottery: {
    id: "lottery",
    path: "/lottery-number-picker",
    pageTitle: "Lottery Number Picker | Spin Lottery-Style Numbers Online",
    description:
      "Use a free lottery number picker wheel to spin lottery-style balls from 1–59 with elimination. Build practice tickets for party games—entertainment only, not a real lottery.",
    h1: "Lottery Number Picker",
    shortTitle: "Lottery Number Picker",
    heroIntro:
      "Want lottery-style number draws without claiming real jackpots? This lottery number picker loads balls 1–59 with elimination so you can spin a practice ticket for parties, classroom fundraiser games, or stream challenges. It is a visual random number tool dressed for lottery vibes—clearly for entertainment, not official drawings.",
    keywords: [
      "lottery number picker",
      "lottery number generator",
      "lottery ball spinner",
      "random lottery numbers",
      "pick lottery numbers online",
      "lottery number wheel",
      "practice lottery draw",
    ],
    articleTitle: "Spin Lottery-Style Numbers for Fun Draws",
    articleIntro: [
      "People search for a lottery number picker when they want several unique numbers from a fixed pool—more structured than a single lucky spin, less formal than a real draw. This page starts at 1–59 with elimination so each ball can appear only once per round, similar to drawing without replacement.",
      "Spin repeatedly to fill a practice ticket, announce party raffle stand-ins, or run a stream game where chat guesses the next ball. Results label each pick as a lottery ball and remind players the tool is not affiliated with any official lottery.",
      "Need bingo calls instead? Use the Bingo Number Wheel. Need a simple 1–10 or 1–100 spin? Those dedicated wheels stay lighter for quick decisions.",
    ],
    uniqueSection: {
      title: "Lottery Picker vs Prize Draw vs Bingo",
      intro:
        "Same spinning engine, different rules and copy. Pick the page that matches the game you are hosting:",
      points: [
        {
          title: "Lottery number picker (this page)",
          description:
            "1–59 pool, elimination, “ball” framing for multi-number practice tickets and party games. Entertainment only.",
        },
        {
          title: "Prize drawing mode",
          description:
            "On the main Number Picker Wheel, prize mode focuses on ticket winners claiming a gift—not building a multi-ball ticket.",
        },
        {
          title: "Bingo number wheel",
          description:
            "1–75 with B-I-N-G-O letters and call history for classic bingo cards.",
        },
        {
          title: "Fairness tip",
          description:
            "Keep elimination on while filling a ticket. Reset the set when the round ends so the next group starts fresh.",
        },
      ],
    },
    faq: [
      {
        question: "Is this a real lottery?",
        answer:
          "No. This is an entertainment number spinner for practice tickets and party games. It does not sell tickets, pay jackpots, or connect to any official lottery.",
      },
      {
        question: "Why 1–59?",
        answer:
          "Many popular lottery-style games use a pool near this size. You can change min/max in the sidebar if your house rules use a different range.",
      },
      {
        question: "How do I build a full ticket?",
        answer:
          "Spin multiple times with elimination on. Each result removes that ball so your set of numbers stays unique until you reset.",
      },
      {
        question: "Can I use it for fundraisers?",
        answer:
          "You can use it as a fun on-screen draw mechanic for classroom or party games. Follow your local fundraising and gaming rules; this tool does not replace licensed raffle systems.",
      },
    ],
    siblingIds: ["bingo", "1-to-100", "1-to-10"],
    deepLink: { kind: "preset", preset: "lottery" },
  },
}

export function getNumberPickerSpoke(id: NumberPickerSpokeId): NumberPickerSpokeSeo {
  return NUMBER_PICKER_SPOKES[id]
}

export function getSpokeSiblings(spoke: NumberPickerSpokeSeo): NumberPickerSpokeSeo[] {
  return spoke.siblingIds.map((id) => NUMBER_PICKER_SPOKES[id])
}

export const NUMBER_PICKER_CLUSTER_LINKS = [
  {
    label: "Number Picker Wheel",
    href: NUMBER_PICKER_PATH,
    description: "Main random number spinner—any range, modes, and custom lists.",
  },
  ...Object.values(NUMBER_PICKER_SPOKES).map((spoke) => ({
    label: spoke.shortTitle,
    href: spoke.path,
    description: spoke.description.slice(0, 110) + (spoke.description.length > 110 ? "…" : ""),
  })),
] as const

import {
  TEAM_PICKER_PATH,
  TEAM_PICKER_SITE_URL,
} from "@/lib/team-picker-seo"
import {
  TEAM_PICKER_USE_CASES,
  type TeamPickerUseCaseConfig,
  type TeamPickerUseCaseId,
} from "@/lib/team-picker-use-cases"

export type TeamPickerSpokeId = TeamPickerUseCaseId

export type TeamPickerDeepLink = {
  useCaseId: TeamPickerUseCaseId
  config: TeamPickerUseCaseConfig
}

export type TeamPickerSpokeFaq = {
  question: string
  answer: string
}

export type TeamPickerSpokeSeo = {
  id: TeamPickerSpokeId
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
  faq: readonly TeamPickerSpokeFaq[]
  siblingIds: readonly TeamPickerSpokeId[]
  deepLink: TeamPickerDeepLink
}

export function teamSpokeUrl(path: string): string {
  return `${TEAM_PICKER_SITE_URL}${path}`
}

const ALL_IDS: TeamPickerSpokeId[] = TEAM_PICKER_USE_CASES.map((u) => u.id)

function siblingsExcept(id: TeamPickerSpokeId): TeamPickerSpokeId[] {
  return ALL_IDS.filter((s) => s !== id)
}

function configFor(id: TeamPickerUseCaseId): TeamPickerUseCaseConfig {
  const found = TEAM_PICKER_USE_CASES.find((u) => u.id === id)
  if (!found) throw new Error(`Missing team use case: ${id}`)
  return found.config
}

function baseFaq(label: string): readonly TeamPickerSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made Team Picker Wheel template. It opens with matching group settings, team names, and optional sample names so you can generate fair teams and spin right away.`,
    },
    {
      question: "Can I edit names after opening this page?",
      answer:
        "Yes. Add, remove, or paste your own roster in Team Controls. Your edits stay on this device in My Wheels if you keep the wheel.",
    },
    {
      question: "Is the team assignment random?",
      answer:
        "Yes. When each name appears once, every participant has an equal chance. Generate teams to assign everyone, then spin for a live pick or elimination round.",
    },
    {
      question: "Where is the main Team Picker Wheel?",
      answer: `Open the Team Picker Wheel pillar at ${TEAM_PICKER_PATH} for all templates, guides, and related tools.`,
    },
  ]
}

export const TEAM_PICKER_SPOKES: Record<TeamPickerSpokeId, TeamPickerSpokeSeo> = {
  "two-teams": {
    id: "two-teams",
    path: "/random-team-generator",
    pageTitle: "Random Team Generator | Split Into 2 Teams Online",
    description:
      "Free random team generator to split names into two fair teams. Add players, generate balanced groups, and spin the Team Picker Wheel—no signup required.",
    h1: "Random Team Generator",
    shortTitle: "2 Team Generator",
    heroIntro:
      "Need two fair sides fast? This random team generator opens with a 2-team setup so you can add names, generate balanced groups, and spin. Perfect for scrimmages, debates, and pick-up games.",
    keywords: [
      "random team generator",
      "2 team generator",
      "split into two teams",
      "team generator",
      "random team picker",
    ],
    articleTitle: "How to Generate Two Random Teams",
    articleIntro: [
      "A 2-team generator is the fastest way to create Home vs Away or Team A vs Team B from a name list. Load your roster, generate teams, then spin if you want a live reveal.",
      "This page is a focused Team Picker Wheel template—same fair randomizer, preloaded for two groups.",
    ],
    uniqueSection: {
      title: "Best for 2-team splits",
      intro: "Use this template whenever you need exactly two sides.",
      points: [
        {
          title: "Scrimmages & debates",
          description: "Flip a roster into two balanced sides without arguing over captains.",
        },
        {
          title: "Even group sizes",
          description: "Generate Teams fills both sides as evenly as possible from your list.",
        },
        {
          title: "Spin for kickoff",
          description: "After groups are built, spin the wheel to highlight a team or representative.",
        },
      ],
    },
    faq: baseFaq("Random Team Generator"),
    siblingIds: siblingsExcept("two-teams"),
    deepLink: { useCaseId: "two-teams", config: configFor("two-teams") },
  },
  "three-teams": {
    id: "three-teams",
    path: "/3-team-generator",
    pageTitle: "3 Team Generator | Split Into Three Groups Online",
    description:
      "Create three random teams online. Add names, generate balanced groups, and spin—ideal for classrooms, workshops, and multi-station games.",
    h1: "3 Team Generator",
    shortTitle: "3 Team Generator",
    heroIntro:
      "Split people into three fair groups with this 3 team generator. Add your list, generate teams, and spin when you want a shared reveal for workshops or class stations.",
    keywords: ["3 team generator", "three team generator", "split into three teams", "random group generator"],
    articleTitle: "Create Three Balanced Teams",
    articleIntro: [
      "Three-team splits work well for rotating stations, small workshops, and games that need more than two sides.",
      "This template preloads three named teams so you can generate and spin without rebuilding settings.",
    ],
    uniqueSection: {
      title: "When to use three teams",
      intro: "Choose three groups when two feels too large and four feels too thin.",
      points: [
        { title: "Workshop pods", description: "Break a room into three discussion groups quickly." },
        { title: "Class rotations", description: "Send students through three activity stations." },
        { title: "Fair fills", description: "Generate Teams keeps sizes as even as your roster allows." },
      ],
    },
    faq: baseFaq("3 Team Generator"),
    siblingIds: siblingsExcept("three-teams"),
    deepLink: { useCaseId: "three-teams", config: configFor("three-teams") },
  },
  "four-teams": {
    id: "four-teams",
    path: "/4-team-generator",
    pageTitle: "4 Team Generator | Split Into Four Groups Online",
    description:
      "Free 4 team generator for schools and sports drills. Split names into four balanced groups and spin the Team Picker Wheel.",
    h1: "4 Team Generator",
    shortTitle: "4 Team Generator",
    heroIntro:
      "Need four stations or color teams? This 4 team generator preloads Red, Blue, Green, and Yellow so you can assign people fairly and spin.",
    keywords: ["4 team generator", "four team generator", "split into four teams", "team randomizer"],
    articleTitle: "Split Rosters Into Four Teams",
    articleIntro: [
      "Four-team generators are popular for PE drills, quiz bowls, and color-coded activities.",
      "Open this page to start with four groups already configured on the Team Picker Wheel.",
    ],
    uniqueSection: {
      title: "Four-team use cases",
      intro: "Great when you want more rotation without tiny groups.",
      points: [
        { title: "Color teams", description: "Red, Blue, Green, Yellow are easy for kids to track." },
        { title: "Drill stations", description: "Send players to four practice corners." },
        { title: "Quiz bowls", description: "Seed four squads for classroom competitions." },
      ],
    },
    faq: baseFaq("4 Team Generator"),
    siblingIds: siblingsExcept("four-teams"),
    deepLink: { useCaseId: "four-teams", config: configFor("four-teams") },
  },
  classroom: {
    id: "classroom",
    path: "/classroom-team-generator",
    pageTitle: "Classroom Team Generator | Random Student Groups",
    description:
      "Classroom team generator for teachers. Split students into fair groups for projects, labs, and quiz teams with a free Team Picker Wheel.",
    h1: "Classroom Team Generator",
    shortTitle: "Classroom Teams",
    heroIntro:
      "Teachers: create random student groups in seconds. This classroom team generator opens with table-style teams so you can paste a roster, generate groups, and spin in front of the class.",
    keywords: [
      "classroom team generator",
      "student team generator",
      "classroom team picker",
      "random student groups",
    ],
    articleTitle: "Random Student Groups for Class",
    articleIntro: [
      "A classroom team generator removes favoritism from group work. Paste names, generate tables, and keep the spin visible so students trust the draw.",
      "This page is a Team Picker Wheel template tuned for school projects, labs, and quiz teams.",
    ],
    uniqueSection: {
      title: "Built for teachers",
      intro: "Keep grouping fair and fast during the period.",
      points: [
        { title: "Paste a roster", description: "Use the Text tab to load your class list in one paste." },
        { title: "Table teams", description: "Preloaded Table 1–4 labels match common seating plans." },
        { title: "Live spin", description: "Project the wheel so the whole class sees the assignment." },
      ],
    },
    faq: baseFaq("Classroom Team Generator"),
    siblingIds: siblingsExcept("classroom"),
    deepLink: { useCaseId: "classroom", config: configFor("classroom") },
  },
  football: {
    id: "football",
    path: "/football-team-picker",
    pageTitle: "Football Team Picker | Random Flag Football Teams",
    description:
      "Football team picker for flag football and backyard games. Split players into Home and Away teams with a free spinning team wheel.",
    h1: "Football Team Picker",
    shortTitle: "Football Teams",
    heroIntro:
      "Pick fair football sides without arguing. This football team picker preloads Home vs Away so you can add players, generate teams, and spin for kickoff.",
    keywords: ["football team picker", "flag football teams", "random football teams", "fantasy football team picker"],
    articleTitle: "Random Football Teams",
    articleIntro: [
      "Use this picker for flag football, backyard games, or draft-night icebreakers—examples only; not affiliated with any league.",
      "Generate two sides, then spin if you want a theatrical reveal.",
    ],
    uniqueSection: {
      title: "Football-ready defaults",
      intro: "Home and Away labels keep the field clear.",
      points: [
        { title: "Two sides", description: "Preloaded for a classic Home vs Away split." },
        { title: "Pickup games", description: "Add whoever showed up and generate fair teams." },
        { title: "Representatives", description: "Spin for a captain or kickoff team after groups are built." },
      ],
    },
    faq: baseFaq("Football Team Picker"),
    siblingIds: siblingsExcept("football"),
    deepLink: { useCaseId: "football", config: configFor("football") },
  },
  basketball: {
    id: "basketball",
    path: "/basketball-team-picker",
    pageTitle: "Basketball Team Picker | Random Pickup Squads",
    description:
      "Basketball team picker for pickup games and practice. Split players into Shirts vs Skins and spin for a fair start.",
    h1: "Basketball Team Picker",
    shortTitle: "Basketball Teams",
    heroIntro:
      "Randomize pickup basketball squads the fair way. This basketball team picker loads Shirts vs Skins so you can generate teams and spin.",
    keywords: ["basketball team picker", "pickup basketball teams", "random basketball teams"],
    articleTitle: "Random Basketball Squads",
    articleIntro: [
      "Pickup basketball runs smoother when teams are random. Load names, generate Shirts and Skins, then tip off.",
      "This template uses the same Team Picker Wheel engine with basketball-friendly defaults.",
    ],
    uniqueSection: {
      title: "Court-ready splits",
      intro: "Built for gyms and playgrounds.",
      points: [
        { title: "Shirts vs Skins", description: "Classic labels everyone recognizes." },
        { title: "Even fills", description: "Keep squad sizes balanced from your check-in list." },
        { title: "Practice drills", description: "Rebuild teams between drills in seconds." },
      ],
    },
    faq: baseFaq("Basketball Team Picker"),
    siblingIds: siblingsExcept("basketball"),
    deepLink: { useCaseId: "basketball", config: configFor("basketball") },
  },
  volleyball: {
    id: "volleyball",
    path: "/volleyball-team-picker",
    pageTitle: "Volleyball Team Picker | Random Court Teams",
    description:
      "Volleyball team picker for PE and leagues. Split players into Court A and Court B with a free Team Picker Wheel.",
    h1: "Volleyball Team Picker",
    shortTitle: "Volleyball Teams",
    heroIntro:
      "Create fair volleyball rotations fast. This volleyball team picker opens with Court A and Court B so PE classes and leagues can generate and spin.",
    keywords: ["volleyball team picker", "random volleyball teams", "PE team generator"],
    articleTitle: "Random Volleyball Teams",
    articleIntro: [
      "Volleyball needs balanced sides for rallies and PE rotations. Generate Court A and Court B, then spin for serve or captain.",
    ],
    uniqueSection: {
      title: "Net-ready defaults",
      intro: "Two courts, fair fills.",
      points: [
        { title: "Court labels", description: "Court A and Court B stay clear on a projector." },
        { title: "PE classes", description: "Paste the class list and generate before the whistle." },
        { title: "League warmups", description: "Reshuffle practice teams between sets." },
      ],
    },
    faq: baseFaq("Volleyball Team Picker"),
    siblingIds: siblingsExcept("volleyball"),
    deepLink: { useCaseId: "volleyball", config: configFor("volleyball") },
  },
  gaming: {
    id: "gaming",
    path: "/esports-team-picker",
    pageTitle: "Esports Team Picker | Random Gaming Squads",
    description:
      "Esports team picker for multiplayer squads and party games. Assign gamers to Squad Alpha and Squad Bravo randomly.",
    h1: "Esports Team Picker",
    shortTitle: "Gaming Squads",
    heroIntro:
      "Assign multiplayer squads without lobby drama. This esports team picker preloads Squad Alpha and Squad Bravo for fair random teams.",
    keywords: ["esports team picker", "gaming squad generator", "random gaming teams", "clan team picker"],
    articleTitle: "Random Gaming Squads",
    articleIntro: [
      "Party games and ranked customs need fair squads. Paste gamer tags, generate teams, and spin for first pick or attacker side.",
    ],
    uniqueSection: {
      title: "Lobby-friendly setup",
      intro: "Built for Discord nights and tournament check-ins.",
      points: [
        { title: "Squad labels", description: "Alpha and Bravo are easy to call out on voice." },
        { title: "Gamer tags", description: "Paste handles from Discord or a signup sheet." },
        { title: "Quick reshuffle", description: "Regenerate between matches in seconds." },
      ],
    },
    faq: baseFaq("Esports Team Picker"),
    siblingIds: siblingsExcept("gaming"),
    deepLink: { useCaseId: "gaming", config: configFor("gaming") },
  },
  office: {
    id: "office",
    path: "/office-team-builder",
    pageTitle: "Office Team Builder | Random Workshop Groups",
    description:
      "Office team builder for workshops and meetings. Split coworkers into fair brainstorming pods with a free Team Picker Wheel.",
    h1: "Office Team Builder",
    shortTitle: "Office Groups",
    heroIntro:
      "Break a room into fair workshop pods. This office team builder opens with Pod A–D so facilitators can generate groups and keep sessions moving.",
    keywords: ["office team builder", "workshop group generator", "meeting team picker", "brainstorming teams"],
    articleTitle: "Random Workshop Groups",
    articleIntro: [
      "Facilitators use random groups to mix departments and avoid the same cliques. Generate pods, then spin if you want a playful reveal.",
    ],
    uniqueSection: {
      title: "Meeting-ready pods",
      intro: "Four pods suit most breakout rooms.",
      points: [
        { title: "Pod labels", description: "Pod A–D map cleanly to rooms or Zoom breakouts." },
        { title: "Paste attendees", description: "Load the invite list from the Text tab." },
        { title: "No favorites", description: "Random assignment keeps workshops fair." },
      ],
    },
    faq: baseFaq("Office Team Builder"),
    siblingIds: siblingsExcept("office"),
    deepLink: { useCaseId: "office", config: configFor("office") },
  },
  tournament: {
    id: "tournament",
    path: "/tournament-team-generator",
    pageTitle: "Tournament Team Generator | Fair Random Seeding",
    description:
      "Tournament team generator for event organizers. Seed fair random teams and brackets with a free Team Picker Wheel.",
    h1: "Tournament Team Generator",
    shortTitle: "Tournament Brackets",
    heroIntro:
      "Seed fair tournament teams fast. This tournament team generator preloads Bracket 1–4 so organizers can assign players and spin for draws.",
    keywords: ["tournament team generator", "tournament team picker", "random tournament teams", "bracket team generator"],
    articleTitle: "Fair Tournament Team Draws",
    articleIntro: [
      "Event organizers need transparent random draws. Generate bracket teams from your signup list, then spin for seeding theater.",
    ],
    uniqueSection: {
      title: "Event organizer defaults",
      intro: "Four brackets cover many small tournaments.",
      points: [
        { title: "Bracket labels", description: "Bracket 1–4 keep pairings readable." },
        { title: "Signup lists", description: "Paste entrants and generate in one click." },
        { title: "Public spin", description: "Show the wheel so players trust the draw." },
      ],
    },
    faq: baseFaq("Tournament Team Generator"),
    siblingIds: siblingsExcept("tournament"),
    deepLink: { useCaseId: "tournament", config: configFor("tournament") },
  },
}

export function getTeamPickerSpoke(id: TeamPickerSpokeId): TeamPickerSpokeSeo {
  return TEAM_PICKER_SPOKES[id]
}

export function getTeamSpokeSiblings(spoke: TeamPickerSpokeSeo): TeamPickerSpokeSeo[] {
  return spoke.siblingIds.map((id) => TEAM_PICKER_SPOKES[id])
}

/** Popular strip + SEO cards — dedicated spoke URLs. */
export const TEAM_PICKER_POPULAR_SPOKE_LINKS = ALL_IDS.map((id) => {
  const spoke = TEAM_PICKER_SPOKES[id]
  const useCase = TEAM_PICKER_USE_CASES.find((u) => u.id === id)!
  return {
    id,
    label: useCase.label,
    href: spoke.path,
    description: useCase.description,
    accent: useCase.accent,
  }
})

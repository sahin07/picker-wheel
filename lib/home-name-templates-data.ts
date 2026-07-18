export type HomeNameTemplateId =
  | "classroom"
  | "giveaway"
  | "secret-santa"
  | "team"
  | "chores"
  | "office"
  | "presentation"
  | "tournament"
  | "volunteer"
  | "birthday"

export type HomeNameTemplateAccent =
  | "sky"
  | "amber"
  | "rose"
  | "lime"
  | "orange"
  | "teal"
  | "indigo"
  | "violet"
  | "cyan"
  | "yellow"

export type HomeNameTemplate = {
  id: HomeNameTemplateId
  label: string
  audience: string
  description: string
  options: string[]
  accent: HomeNameTemplateAccent
}

export const HOME_NAME_PICKER_TEMPLATES: HomeNameTemplate[] = [
  {
    id: "classroom",
    label: "Classroom Student Picker",
    audience: "Teachers",
    description: "Fair student picks for questions, helpers, and turns.",
    options: [
      "Alex",
      "Jordan",
      "Sam",
      "Taylor",
      "Casey",
      "Riley",
      "Morgan",
      "Avery",
      "Quinn",
      "Jamie",
    ],
    accent: "sky",
  },
  {
    id: "giveaway",
    label: "Giveaway Winner Picker",
    audience: "Creators & businesses",
    description: "Spin entrants for contests, raffles, and prize draws.",
    options: [
      "Entrant 1",
      "Entrant 2",
      "Entrant 3",
      "Entrant 4",
      "Entrant 5",
      "Entrant 6",
      "Entrant 7",
      "Entrant 8",
    ],
    accent: "amber",
  },
  {
    id: "secret-santa",
    label: "Secret Santa Picker",
    audience: "Holiday events",
    description: "Draw who buys for whom at gift exchanges.",
    options: ["Alex", "Blake", "Chris", "Dana", "Ellis", "Fran", "Gray", "Harper"],
    accent: "rose",
  },
  {
    id: "team",
    label: "Team Assignment Wheel",
    audience: "Schools & sports",
    description: "Pick captains, partners, or presentation order.",
    options: [
      "Player 1",
      "Player 2",
      "Player 3",
      "Player 4",
      "Player 5",
      "Player 6",
      "Player 7",
      "Player 8",
    ],
    accent: "lime",
  },
  {
    id: "chores",
    label: "Family Chore Wheel",
    audience: "Households",
    description: "Assign dishes, laundry, and tidy-up turns fairly.",
    options: ["Dishes", "Trash", "Vacuum", "Laundry", "Wipe counters", "Pet care"],
    accent: "orange",
  },
  {
    id: "office",
    label: "Office Prize Draw",
    audience: "Workplaces",
    description: "Spin for meeting speakers, icebreakers, or prizes.",
    options: ["Amina", "Ben", "Carla", "Diego", "Elena", "Farah", "Gabe", "Hana"],
    accent: "teal",
  },
  {
    id: "presentation",
    label: "Presentation Order Picker",
    audience: "Schools & meetings",
    description: "Decide who presents first without debate.",
    options: ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F"],
    accent: "indigo",
  },
  {
    id: "tournament",
    label: "Tournament Player Picker",
    audience: "Gaming & sports",
    description: "Draft opponents, brackets, or who goes next.",
    options: [
      "Player One",
      "Player Two",
      "Player Three",
      "Player Four",
      "Player Five",
      "Player Six",
    ],
    accent: "violet",
  },
  {
    id: "volunteer",
    label: "Volunteer Picker",
    audience: "Nonprofits & events",
    description: "Choose helpers for tasks and event roles.",
    options: [
      "Volunteer 1",
      "Volunteer 2",
      "Volunteer 3",
      "Volunteer 4",
      "Volunteer 5",
      "Volunteer 6",
    ],
    accent: "cyan",
  },
  {
    id: "birthday",
    label: "Birthday Party Picker",
    audience: "Families",
    description: "Pick games, who goes next, or party helpers.",
    options: ["Maya", "Noah", "Olivia", "Liam", "Sofia", "Ethan", "Zoe", "Lucas"],
    accent: "yellow",
  },
]

export function getHomeNameTemplate(id: HomeNameTemplateId): HomeNameTemplate | undefined {
  return HOME_NAME_PICKER_TEMPLATES.find((t) => t.id === id)
}

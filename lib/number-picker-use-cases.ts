export type NumberPickerResultMode = "random-number" | "random-digits"

export type NumberPickerUseCaseId =
  | "classroom"
  | "prize-drawings"
  | "bingo"
  | "fitness"
  | "board-games"
  | "team-assignments"
  | "random-seating"
  | "math-activities"
  | "lucky-number"
  | "fortune-number"

export interface NumberPickerUseCaseConfig {
  resultMode: NumberPickerResultMode
  inputMethod: "range" | "formula"
  actionMode: "normal" | "elimination"
  minValue: number
  maxValue: number
  interval: number
  excludeNumbers: string
  formula: string
  numDigits?: number
  toolTitle: string
  toolDescription: string
  resultTitle: string
}

export interface NumberPickerUseCase {
  id: NumberPickerUseCaseId
  label: string
  description: string
  /** Tailwind color token used for icon chip + active border */
  accent: "sky" | "amber" | "rose" | "lime" | "orange" | "teal" | "indigo" | "cyan" | "yellow" | "violet"
  config: NumberPickerUseCaseConfig
}

export const NUMBER_PICKER_USE_CASES: NumberPickerUseCase[] = [
  {
    id: "classroom",
    label: "Classroom number selection",
    description: "Call on student numbers with no repeats for questions, helpers, or turns.",
    accent: "sky",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "elimination",
      minValue: 1,
      maxValue: 30,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Classroom Number Picker",
      toolDescription: "Spin to pick a student number for the next question or helper.",
      resultTitle: "Student Number",
    },
  },
  {
    id: "prize-drawings",
    label: "Prize drawings",
    description: "Draw ticket numbers for classroom or party prize giveaways.",
    accent: "amber",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "elimination",
      minValue: 1,
      maxValue: 50,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Prize Drawing Wheel",
      toolDescription: "Spin ticket numbers for a fair classroom or party prize draw.",
      resultTitle: "Winning Ticket",
    },
  },
  {
    id: "bingo",
    label: "Bingo games",
    description: "Call classic bingo numbers from 1 to 75 for party or classroom games.",
    accent: "rose",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "elimination",
      minValue: 1,
      maxValue: 75,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Bingo Number Caller",
      toolDescription: "Spin to call the next bingo number without repeats.",
      resultTitle: "Bingo Call",
    },
  },
  {
    id: "fitness",
    label: "Fitness challenges",
    description: "Pick random reps, rounds, or challenge levels for workouts.",
    accent: "lime",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "normal",
      minValue: 1,
      maxValue: 20,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Fitness Challenge Wheel",
      toolDescription: "Spin for random reps, rounds, or challenge intensity.",
      resultTitle: "Your Challenge Number",
    },
  },
  {
    id: "board-games",
    label: "Board games",
    description: "Replace a die with a fair 1–6 spin for moves and turns.",
    accent: "orange",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "normal",
      minValue: 1,
      maxValue: 6,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Board Game Number Wheel",
      toolDescription: "Spin 1–6 for board-game moves when a die is missing.",
      resultTitle: "Your Move",
    },
  },
  {
    id: "team-assignments",
    label: "Team assignments",
    description: "Assign people to teams by spinning team ID numbers.",
    accent: "teal",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "normal",
      minValue: 1,
      maxValue: 8,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Team Assignment Wheel",
      toolDescription: "Spin a team number to assign the next person fairly.",
      resultTitle: "Team Number",
    },
  },
  {
    id: "random-seating",
    label: "Random seating",
    description: "Pick seat numbers for classrooms, events, or meeting rooms.",
    accent: "indigo",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "elimination",
      minValue: 1,
      maxValue: 40,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Random Seating Wheel",
      toolDescription: "Spin seat numbers so everyone gets a fair place.",
      resultTitle: "Seat Number",
    },
  },
  {
    id: "math-activities",
    label: "Math activities",
    description: "Generate practice problems from a spun number for warm-up drills.",
    accent: "cyan",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "normal",
      minValue: 2,
      maxValue: 20,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Math Practice Number Wheel",
      toolDescription: "Spin a number, then solve the practice problem it unlocks.",
      resultTitle: "Practice Number",
    },
  },
  {
    id: "lucky-number",
    label: "Lucky number games",
    description: "Pick a playful lucky number for parties, icebreakers, and games.",
    accent: "yellow",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "normal",
      minValue: 1,
      maxValue: 99,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Lucky Number Wheel",
      toolDescription: "Spin for a fun lucky number to share with the group.",
      resultTitle: "Your Lucky Number",
    },
  },
  {
    id: "fortune-number",
    label: "Fortune number",
    description: "Spin a fun fortune number for entertainment—no real predictions.",
    accent: "violet",
    config: {
      resultMode: "random-number",
      inputMethod: "range",
      actionMode: "normal",
      minValue: 1,
      maxValue: 99,
      interval: 1,
      excludeNumbers: "",
      formula: "",
      toolTitle: "Fortune Number Wheel",
      toolDescription: "Spin a fortune number for fun. Entertainment only—not a real reading.",
      resultTitle: "Your Fortune Number",
    },
  },
]

const FORTUNE_BLURBS = [
  "A small win shows up when you stay curious.",
  "Share a kind word—someone notices today.",
  "Try the idea you almost skipped.",
  "Patience turns a slow start into a strong finish.",
  "A fresh routine unlocks leftover energy.",
  "Celebrate a tiny habit you already keep.",
  "Ask one clearer question and watch doors open.",
  "Luck favors the plan you write down first.",
  "Trade worry for one brave next step.",
  "Your focus is the real lucky charm today.",
  "A playful break resets your best thinking.",
  "Help someone else and bounce back brighter.",
] as const

/** Entertainment-only fortune line keyed off the spun number. */
export function getFortuneBlurb(n: number): string {
  const value = Math.abs(Math.trunc(Number(n))) || 0
  return FORTUNE_BLURBS[value % FORTUNE_BLURBS.length]
}

export function getNumberPickerUseCase(id: NumberPickerUseCaseId): NumberPickerUseCase | undefined {
  return NUMBER_PICKER_USE_CASES.find((useCase) => useCase.id === id)
}

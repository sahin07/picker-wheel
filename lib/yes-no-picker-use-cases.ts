export type YesNoWheelMode = "yes-no" | "yes-no-maybe"
export type YesNoControlMode = "manual" | "ai"

export type YesNoPickerUseCaseId =
  | "quick-decision"
  | "yes-no-maybe"
  | "elimination"
  | "ai-advice"
  | "team-vote"
  | "date-night"
  | "work-choice"
  | "fair-coin"
  | "group-consensus"
  | "truth-check"

export type YesNoOptionLabels = {
  yes: string
  no: string
  maybe: string
}

export interface YesNoPickerUseCaseConfig {
  mode: YesNoWheelMode
  controlMode: YesNoControlMode
  inputSets: number
  elimination: boolean
  optionLabels: YesNoOptionLabels
  toolTitle: string
  toolDescription: string
  resultTitle: string
  /** Prefill / hint for AI question box when controlMode is ai */
  questionPlaceholder?: string
}

export interface YesNoPickerUseCase {
  id: YesNoPickerUseCaseId
  label: string
  description: string
  accent: "sky" | "amber" | "rose" | "lime" | "orange" | "teal" | "indigo" | "cyan" | "yellow" | "violet"
  config: YesNoPickerUseCaseConfig
}

const DEFAULT_LABELS: YesNoOptionLabels = { yes: "YES", no: "NO", maybe: "MAYBE" }

export const YES_NO_PICKER_USE_CASES: YesNoPickerUseCase[] = [
  {
    id: "quick-decision",
    label: "Quick decision",
    description: "Simple YES or NO when you need a fast call.",
    accent: "sky",
    config: {
      mode: "yes-no",
      controlMode: "manual",
      inputSets: 1,
      elimination: false,
      optionLabels: { ...DEFAULT_LABELS },
      toolTitle: "Quick Yes or No",
      toolDescription: "Spin once for a clear yes-or-no decision.",
      resultTitle: "Your decision",
    },
  },
  {
    id: "yes-no-maybe",
    label: "Yes / No / Maybe",
    description: "Add a MAYBE slice when the answer is not binary.",
    accent: "violet",
    config: {
      mode: "yes-no-maybe",
      controlMode: "manual",
      inputSets: 1,
      elimination: false,
      optionLabels: { ...DEFAULT_LABELS },
      toolTitle: "Yes No Maybe Wheel",
      toolDescription: "Spin for YES, NO, or MAYBE when you need a third option.",
      resultTitle: "Your answer",
    },
  },
  {
    id: "elimination",
    label: "Elimination rounds",
    description: "Remove each winner until one option remains.",
    accent: "amber",
    config: {
      mode: "yes-no-maybe",
      controlMode: "manual",
      inputSets: 1,
      elimination: true,
      optionLabels: { ...DEFAULT_LABELS },
      toolTitle: "Elimination Decision Wheel",
      toolDescription: "Spin and eliminate options until one choice is left.",
      resultTitle: "Eliminated",
    },
  },
  {
    id: "ai-advice",
    label: "AI advice mode",
    description: "Describe your dilemma and spin with AI context.",
    accent: "rose",
    config: {
      mode: "yes-no",
      controlMode: "ai",
      inputSets: 1,
      elimination: false,
      optionLabels: { ...DEFAULT_LABELS },
      toolTitle: "AI Decision Helper",
      toolDescription: "Ask a question, get light guidance, then spin for a decision.",
      resultTitle: "AI-backed decision",
      questionPlaceholder: "e.g., Should I take this new job offer?",
    },
  },
  {
    id: "team-vote",
    label: "Team vote",
    description: "More slices for group votes and meeting calls.",
    accent: "teal",
    config: {
      mode: "yes-no",
      controlMode: "manual",
      inputSets: 3,
      elimination: false,
      optionLabels: { yes: "YES", no: "NO", maybe: "MAYBE" },
      toolTitle: "Team Vote Wheel",
      toolDescription: "Extra YES/NO slices for fairer team voting spins.",
      resultTitle: "Team vote",
    },
  },
  {
    id: "date-night",
    label: "Date night plans",
    description: "Decide go / stay / maybe for plans and activities.",
    accent: "orange",
    config: {
      mode: "yes-no-maybe",
      controlMode: "manual",
      inputSets: 2,
      elimination: false,
      optionLabels: { yes: "GO", no: "STAY", maybe: "MAYBE" },
      toolTitle: "Date Night Decider",
      toolDescription: "Spin GO, STAY, or MAYBE for tonight’s plans.",
      resultTitle: "Tonight’s plan",
    },
  },
  {
    id: "work-choice",
    label: "Work choices",
    description: "Career or project calls with optional AI notes.",
    accent: "indigo",
    config: {
      mode: "yes-no",
      controlMode: "ai",
      inputSets: 2,
      elimination: false,
      optionLabels: { yes: "DO IT", no: "WAIT", maybe: "MAYBE" },
      toolTitle: "Work Decision Wheel",
      toolDescription: "Use AI context, then spin for a work-related choice.",
      resultTitle: "Work decision",
      questionPlaceholder: "e.g., Should we ship this feature this week?",
    },
  },
  {
    id: "fair-coin",
    label: "Fair coin flip",
    description: "Classic 50/50 YES vs NO — one set, no repeats.",
    accent: "lime",
    config: {
      mode: "yes-no",
      controlMode: "manual",
      inputSets: 1,
      elimination: false,
      optionLabels: { yes: "HEADS", no: "TAILS", maybe: "MAYBE" },
      toolTitle: "Fair Coin Flip Wheel",
      toolDescription: "A balanced HEADS/TAILS wheel for fair coin-flip decisions.",
      resultTitle: "Coin flip",
    },
  },
  {
    id: "group-consensus",
    label: "Group consensus",
    description: "YES / NO / MAYBE with more slices for larger groups.",
    accent: "cyan",
    config: {
      mode: "yes-no-maybe",
      controlMode: "manual",
      inputSets: 3,
      elimination: false,
      optionLabels: { ...DEFAULT_LABELS },
      toolTitle: "Group Consensus Wheel",
      toolDescription: "Extra slices so group spins feel fairer.",
      resultTitle: "Group answer",
    },
  },
  {
    id: "truth-check",
    label: "Truth check",
    description: "Elimination YES/NO for dare-or-decide games.",
    accent: "yellow",
    config: {
      mode: "yes-no",
      controlMode: "manual",
      inputSets: 2,
      elimination: true,
      optionLabels: { yes: "TRUTH", no: "DARE", maybe: "MAYBE" },
      toolTitle: "Truth Check Wheel",
      toolDescription: "Eliminate between TRUTH and DARE for party games.",
      resultTitle: "Truth check",
    },
  },
]

export function getYesNoPickerUseCase(id: YesNoPickerUseCaseId | string | null | undefined) {
  if (!id) return undefined
  return YES_NO_PICKER_USE_CASES.find((u) => u.id === id)
}

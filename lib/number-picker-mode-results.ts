import { getFortuneBlurb, type NumberPickerUseCaseId } from "@/lib/number-picker-use-cases"

export type ModeResultVariant =
  | "classroom"
  | "prize"
  | "bingo"
  | "fitness"
  | "dice"
  | "team"
  | "seating"
  | "math"
  | "lucky"
  | "fortune"

export interface ModeMathPayload {
  prompt: string
  answer: number
  expression: string
}

export interface ModeResult {
  variant: ModeResultVariant
  headline: string
  detail: string
  number: number
  chips?: string[]
  hint?: string
  /** Dialog / share-friendly one-liner */
  shareText: string
  bingoCall?: string
  bingoLetter?: string
  exercise?: string
  teamIndex?: number
  teamColor?: string
  math?: ModeMathPayload
  remainingLabel?: string
}

const FITNESS_EXERCISES = [
  "push-ups",
  "squats",
  "jumping jacks",
  "sit-ups",
  "lunges (each side)",
  "burpees",
  "mountain climbers",
  "high knees",
  "plank seconds",
  "arm circles",
] as const

const LUCKY_LINES = [
  "Keep this number close for the next round.",
  "A playful pick — share it with the group.",
  "Your lucky spin landed clean.",
  "Write it down before the next challenge.",
] as const

const TEAM_COLORS = [
  "#0d9488",
  "#2563eb",
  "#dc2626",
  "#ca8a04",
  "#7c3aed",
  "#ea580c",
  "#059669",
  "#db2777",
] as const

/** Classic US bingo columns: B1–15, I16–30, N31–45, G46–60, O61–75 */
export function bingoLetter(n: number): string {
  if (n <= 15) return "B"
  if (n <= 30) return "I"
  if (n <= 45) return "N"
  if (n <= 60) return "G"
  return "O"
}

export function bingoCall(n: number): string {
  return `${bingoLetter(n)}${n}`
}

export function fitnessChallenge(n: number): { exercise: string; detail: string } {
  const exercise = FITNESS_EXERCISES[Math.abs(n) % FITNESS_EXERCISES.length]
  const unit = exercise === "plank seconds" ? "" : " "
  const detail =
    exercise === "plank seconds"
      ? `Hold a plank for ${n} seconds`
      : `Do ${n}${unit}${exercise}`
  return { exercise, detail }
}

/** Deterministic practice problem seeded by n */
export function mathProblem(n: number): ModeMathPayload {
  const value = Math.max(1, Math.abs(Math.trunc(n)) || 1)
  const opIndex = value % 3
  if (opIndex === 0) {
    const a = value
    const b = (value % 9) + 1
    return {
      expression: `${a} + ${b}`,
      prompt: `What is ${a} + ${b}?`,
      answer: a + b,
    }
  }
  if (opIndex === 1) {
    const a = value + ((value % 5) + 2)
    const b = value
    return {
      expression: `${a} − ${b}`,
      prompt: `What is ${a} − ${b}?`,
      answer: a - b,
    }
  }
  const a = Math.min(12, value)
  const b = (value % 9) + 2
  return {
    expression: `${a} × ${b}`,
    prompt: `What is ${a} × ${b}?`,
    answer: a * b,
  }
}

export function teamColor(n: number): string {
  const idx = ((Math.abs(Math.trunc(n)) - 1) % TEAM_COLORS.length + TEAM_COLORS.length) % TEAM_COLORS.length
  return TEAM_COLORS[idx]
}

/** Dice pip positions for faces 1–6 (3x3 grid cells, 0-indexed) */
export const DICE_PIPS: Record<number, Array<[number, number]>> = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
}

export function buildModeResult(
  modeId: NumberPickerUseCaseId | null | undefined,
  value: number | string,
  remainingCount?: number,
): ModeResult | null {
  if (!modeId) return null
  const n = Number(value)
  if (!Number.isFinite(n)) return null

  const remaining =
    typeof remainingCount === "number" && remainingCount >= 0
      ? remainingCount
      : undefined

  switch (modeId) {
    case "classroom": {
      const rem =
        remaining != null ? `${remaining} student number${remaining === 1 ? "" : "s"} left` : undefined
      return {
        variant: "classroom",
        number: n,
        headline: `Student #${n}`,
        detail: "Your turn — stand up or answer the question.",
        chips: rem ? [rem] : undefined,
        remainingLabel: rem,
        shareText: `Student #${n} — your turn`,
      }
    }
    case "prize-drawings": {
      const rem =
        remaining != null ? `${remaining} ticket${remaining === 1 ? "" : "s"} remaining` : undefined
      return {
        variant: "prize",
        number: n,
        headline: `Winning ticket #${n}`,
        detail: "Come claim your prize!",
        chips: rem ? [rem] : undefined,
        remainingLabel: rem,
        shareText: `Winning ticket #${n}`,
      }
    }
    case "bingo": {
      const letter = bingoLetter(n)
      const call = bingoCall(n)
      const rem =
        remaining != null ? `${remaining} number${remaining === 1 ? "" : "s"} left` : undefined
      return {
        variant: "bingo",
        number: n,
        bingoLetter: letter,
        bingoCall: call,
        headline: call,
        detail: `Bingo call — mark ${call} on your card.`,
        chips: rem ? [rem] : undefined,
        remainingLabel: rem,
        shareText: `Bingo: ${call}`,
      }
    }
    case "fitness": {
      const { exercise, detail } = fitnessChallenge(n)
      return {
        variant: "fitness",
        number: n,
        exercise,
        headline: detail,
        detail: "Complete the challenge, then spin again.",
        shareText: detail,
      }
    }
    case "board-games": {
      const face = Math.min(6, Math.max(1, Math.round(n)))
      return {
        variant: "dice",
        number: face,
        headline: `You rolled a ${face}`,
        detail: "Move that many spaces (or follow your game’s rules).",
        shareText: `Dice roll: ${face}`,
      }
    }
    case "team-assignments": {
      const color = teamColor(n)
      return {
        variant: "team",
        number: n,
        teamIndex: n,
        teamColor: color,
        headline: `Team ${n}`,
        detail: "Assign the next person to this team.",
        shareText: `Assigned to Team ${n}`,
      }
    }
    case "random-seating": {
      const rem =
        remaining != null ? `${remaining} seat${remaining === 1 ? "" : "s"} remaining` : undefined
      return {
        variant: "seating",
        number: n,
        headline: `Seat ${n} taken`,
        detail: "That seat is now assigned.",
        chips: rem ? [rem] : undefined,
        remainingLabel: rem,
        shareText: `Seat ${n} taken`,
      }
    }
    case "math-activities": {
      const math = mathProblem(n)
      return {
        variant: "math",
        number: n,
        math,
        headline: math.prompt,
        detail: `Spun number: ${n}. Solve the practice problem.`,
        hint: "Tap Reveal answer when ready.",
        shareText: `${math.prompt} (answer: ${math.answer})`,
      }
    }
    case "lucky-number": {
      const line = LUCKY_LINES[Math.abs(n) % LUCKY_LINES.length]
      return {
        variant: "lucky",
        number: n,
        headline: `Lucky number ${n}`,
        detail: line,
        shareText: `Lucky number ${n}`,
      }
    }
    case "fortune-number": {
      const blurb = getFortuneBlurb(n)
      return {
        variant: "fortune",
        number: n,
        headline: `Fortune number ${n}`,
        detail: blurb,
        hint: "For fun only — not a real fortune.",
        shareText: `Fortune ${n}: ${blurb}`,
      }
    }
    default:
      return null
  }
}

export function formatBingoHistory(values: Array<number | string>, limit = 8): string[] {
  return values
    .slice(-limit)
    .map((v) => bingoCall(Number(v)))
    .filter((c) => c && !c.includes("NaN"))
}

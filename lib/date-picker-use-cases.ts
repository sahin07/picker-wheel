import { addDays, endOfMonth, startOfDay } from "date-fns"

export type DatePickerUseCaseId =
  | "next-7"
  | "next-30"
  | "workdays"
  | "weekends"
  | "this-month"
  | "challenge-30"

export type DatePickerAccent =
  | "sky"
  | "amber"
  | "rose"
  | "lime"
  | "orange"
  | "teal"
  | "indigo"
  | "violet"

export type DatePickerDayFlags = {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export type DatePickerPresetEntry = {
  id: string
  date: Date
  formatted: string
}

export interface DatePickerUseCaseConfig {
  dayCount?: number
  selectedDays: DatePickerDayFlags
  toolTitle: string
  toolDescription: string
  /** When true, fill remaining days of the current calendar month. */
  remainingMonth?: boolean
}

export interface DatePickerUseCase {
  id: DatePickerUseCaseId
  label: string
  description: string
  accent: DatePickerAccent
  config: DatePickerUseCaseConfig
}

export const ALL_DAYS_ON: DatePickerDayFlags = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: true,
}

export const WORKDAYS_ONLY: DatePickerDayFlags = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
}

export const WEEKENDS_ONLY: DatePickerDayFlags = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: true,
  sunday: true,
}

export const DATE_PICKER_USE_CASES: DatePickerUseCase[] = [
  {
    id: "next-7",
    label: "Next 7 Days",
    description: "Spin among the upcoming week for quick plans and decisions.",
    accent: "sky",
    config: {
      dayCount: 7,
      selectedDays: { ...ALL_DAYS_ON },
      toolTitle: "Next 7 Days Wheel",
      toolDescription: "Spin a random date in the next 7 days",
    },
  },
  {
    id: "next-30",
    label: "Next 30 Days",
    description: "A month of upcoming dates for challenges and scheduling.",
    accent: "teal",
    config: {
      dayCount: 30,
      selectedDays: { ...ALL_DAYS_ON },
      toolTitle: "Next 30 Days Wheel",
      toolDescription: "Spin a random date in the next 30 days",
    },
  },
  {
    id: "workdays",
    label: "Workdays Only",
    description: "Monday–Friday dates for meetings and office plans.",
    accent: "indigo",
    config: {
      dayCount: 30,
      selectedDays: { ...WORKDAYS_ONLY },
      toolTitle: "Workday Date Wheel",
      toolDescription: "Spin a random workday in the next month",
    },
  },
  {
    id: "weekends",
    label: "Weekends Only",
    description: "Saturday and Sunday picks for fun and family plans.",
    accent: "rose",
    config: {
      dayCount: 60,
      selectedDays: { ...WEEKENDS_ONLY },
      toolTitle: "Weekend Date Wheel",
      toolDescription: "Spin a random weekend date",
    },
  },
  {
    id: "this-month",
    label: "This Month",
    description: "Remaining days in the current month.",
    accent: "amber",
    config: {
      remainingMonth: true,
      selectedDays: { ...ALL_DAYS_ON },
      toolTitle: "This Month Date Wheel",
      toolDescription: "Spin a random remaining day this month",
    },
  },
  {
    id: "challenge-30",
    label: "30-Day Challenge",
    description: "Spin a date inside your 30-day challenge window.",
    accent: "orange",
    config: {
      dayCount: 30,
      selectedDays: { ...ALL_DAYS_ON },
      toolTitle: "30-Day Challenge Wheel",
      toolDescription: "Spin which challenge day gets the spotlight",
    },
  },
]

function dayAllowed(date: Date, selectedDays: DatePickerDayFlags): boolean {
  const map = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const
  const key = map[date.getDay()]
  return selectedDays[key]
}

/** Build DateEntry-compatible slices for a preset (formatted later by the app). */
export function buildDatePresetEntries(
  config: DatePickerUseCaseConfig,
): { date: Date }[] {
  const today = startOfDay(new Date())
  const out: { date: Date }[] = []

  if (config.remainingMonth) {
    const end = endOfMonth(today)
    let cursor = today
    while (cursor <= end) {
      if (dayAllowed(cursor, config.selectedDays)) {
        out.push({ date: new Date(cursor) })
      }
      cursor = addDays(cursor, 1)
    }
    return out
  }

  const count = config.dayCount ?? 30
  for (let i = 0; i < count; i++) {
    const date = addDays(today, i)
    if (dayAllowed(date, config.selectedDays)) {
      out.push({ date })
    }
  }
  return out
}

export function getDatePickerUseCase(
  id: DatePickerUseCaseId | string | null | undefined,
): DatePickerUseCase | undefined {
  if (!id) return undefined
  return DATE_PICKER_USE_CASES.find((useCase) => useCase.id === id)
}

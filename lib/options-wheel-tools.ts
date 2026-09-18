/** Tools that store slices as `data.options` (name picker shape). */
export const OPTIONS_WHEEL_TOOL_TYPES = [
  "picker-wheel",
  "raffle-spin-wheel",
  "word-picker-wheel",
] as const

export type OptionsWheelToolType = (typeof OPTIONS_WHEEL_TOOL_TYPES)[number]

export function isOptionsWheelTool(toolType: string | null | undefined): boolean {
  return !!toolType && (OPTIONS_WHEEL_TOOL_TYPES as readonly string[]).includes(toolType)
}

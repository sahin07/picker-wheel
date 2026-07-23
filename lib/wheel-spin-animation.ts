/** Shared spin timing / easing — matches main picker wheel (enhanced-wheel-section) */

export const SPIN_FIXED_TURNS = 10

export function getSpinDurationMs(spinningDuration?: number | null): number {
  if (typeof spinningDuration === "number" && spinningDuration > 0) {
    return spinningDuration * 1000
  }
  return 3000
}

export function getSpinEaseExponent(spinningSpeedLevel?: number | null): number {
  const level =
    typeof spinningSpeedLevel === "number" && spinningSpeedLevel > 0
      ? spinningSpeedLevel
      : 10
  return 2 + level / 5
}

export type SpinEndRotationOptions = {
  randomInitialAngle?: boolean
}

/** Same formula as main picker wheel handleSpin */
export function computeSpinEndRotation(
  startRotation: number,
  options?: SpinEndRotationOptions,
): number {
  const baseRotation = options?.randomInitialAngle ? Math.random() * 360 : 0
  return (
    startRotation + baseRotation + SPIN_FIXED_TURNS * 360 + Math.random() * 360
  )
}

export function computeSpinFrame(
  startRotation: number,
  endRotation: number,
  elapsedMs: number,
  durationMs: number,
  spinningSpeedLevel?: number | null,
): { progress: number; rotation: number; done: boolean } {
  const progress = Math.min(elapsedMs / durationMs, 1)
  const easeOut = 1 - Math.pow(1 - progress, getSpinEaseExponent(spinningSpeedLevel))
  const rotation = startRotation + (endRotation - startRotation) * easeOut
  return { progress, rotation, done: progress >= 1 }
}

/** Pointer at 3 o'clock — same formula as NBA/MLB canvas wheels */
export function pickSegmentIndex(rotation: number, segmentCount: number): number {
  if (segmentCount <= 0) return 0
  const finalAngle = ((rotation % 360) + 360) % 360
  const segmentAngle = 360 / segmentCount
  const normalizedAngle = (360 - finalAngle) % 360
  return Math.floor(normalizedAngle / segmentAngle) % segmentCount
}

export function applyWheelRotation(el: HTMLElement | null, rotation: number) {
  if (!el) return
  el.style.transform = `rotate(${rotation}deg)`
  el.style.transformOrigin = "center center"
  el.style.transition = "none"
}

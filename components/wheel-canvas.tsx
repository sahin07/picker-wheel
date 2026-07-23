"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

const WHEEL_SIZE = 680

interface WheelCanvasProps {
  numbers: any[]
  isSpinning: boolean
  settings: any
  /** Absolute wheel rotation in degrees (home-style). */
  rotation?: number
  size?: number
  highlightIndex?: number | null
  onRotationFrame?: (rotationDegrees: number, segmentCount: number) => void
  /** Fired once when the ease-out animation reaches the target rotation. */
  onSpinComplete?: () => void
}

export type WheelCanvasHandle = {
  getCurrentRotation: () => number
  /** Abort the in-flight spin animation and return the rotation at abort time. */
  abortSpin: () => number
}

function getSegmentWeights(numbers: any[]): number[] {
  if (!numbers.length) return []
  if (typeof numbers[0] === "object" && numbers[0] !== null && "weight" in numbers[0]) {
    return numbers.map((n) => Math.max(1, n.weight || 1))
  }
  return numbers.map(() => 1)
}

function getSegmentAngles(numbers: any[]): number[] {
  const weights = getSegmentWeights(numbers)
  const total = weights.reduce((s, w) => s + w, 0) || 1
  return weights.map((w) => (w / total) * 2 * Math.PI)
}

export const WheelCanvas = forwardRef<WheelCanvasHandle, WheelCanvasProps>(function WheelCanvas(
  {
    numbers,
    isSpinning,
    settings,
    rotation = 0,
    size = WHEEL_SIZE,
    highlightIndex = null,
    onRotationFrame,
    onSpinComplete,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const currentRotationRef = useRef(0)
  const spinTokenRef = useRef(0)
  const numbersRef = useRef(numbers)
  const settingsRef = useRef(settings)
  const onFrameRef = useRef(onRotationFrame)
  const onCompleteRef = useRef(onSpinComplete)
  numbersRef.current = numbers
  settingsRef.current = settings
  onFrameRef.current = onRotationFrame
  onCompleteRef.current = onSpinComplete

  useImperativeHandle(ref, () => ({
    getCurrentRotation: () => currentRotationRef.current,
    abortSpin: () => {
      spinTokenRef.current += 1
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return currentRotationRef.current
    },
  }))

  const drawWheel = (rotationDegrees: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const liveNumbers = numbersRef.current
    const liveSettings = settingsRef.current
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 24

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((rotationDegrees * Math.PI) / 180)

    if (liveNumbers.length === 0) {
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, 2 * Math.PI)
      ctx.fillStyle = "#f1f5f9"
      ctx.fill()
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      ctx.fillStyle = "#64748b"
      ctx.font = "18px Arial"
      ctx.textAlign = "center"
      ctx.fillText("No numbers to display", centerX, centerY)
      return
    }

    const segmentAngles = getSegmentAngles(liveNumbers)
    const colors =
      liveSettings?.appearance?.toolColors?.length > 0
        ? liveSettings.appearance.toolColors
        : ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"]
    const fontSize = liveNumbers.length > 40 ? 12 : liveNumbers.length > 24 ? 14 : 18
    const mystery = !!liveSettings?.spinBehavior?.mysterySpin

    let currentAngle = -Math.PI / 2
    liveNumbers.forEach((number, index) => {
      const startAngle = currentAngle
      const endAngle = startAngle + segmentAngles[index]
      const fill =
        typeof number === "object" && number?.color
          ? number.color
          : colors[index % colors.length]

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = fill
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      if (highlightIndex === index && !isSpinning) {
        ctx.fillStyle = "rgba(255,255,255,0.35)"
        ctx.fill()
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 4
        ctx.stroke()
      }

      const mid = startAngle + segmentAngles[index] / 2
      ctx.save()
      ctx.rotate(mid)
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${fontSize}px Arial`
      ctx.strokeStyle = "rgba(0,0,0,0.25)"
      ctx.lineWidth = 3

      let displayValue: string | number = number
      let probabilityText = ""
      if (typeof number === "object" && number !== null && "value" in number) {
        displayValue = number.value
        const totalWeight = getSegmentWeights(liveNumbers).reduce((s, w) => s + w, 0)
        if (totalWeight > 0 && "weight" in number) {
          probabilityText = `${(((number.weight || 1) / totalWeight) * 100).toFixed(1)}%`
        }
      }

      const label = mystery ? "?" : String(displayValue)
      ctx.strokeText(label, radius * 0.7, 0)
      ctx.fillText(label, radius * 0.7, 0)
      if (probabilityText && !mystery) {
        ctx.font = "bold 11px Arial"
        ctx.fillText(probabilityText, radius * 0.7, 16)
      }
      ctx.restore()

      currentAngle = endAngle
    })

    ctx.beginPath()
    ctx.arc(0, 0, 28, 0, 2 * Math.PI)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 11px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("SPIN", 0, 1)

    ctx.restore()

    // Fixed pointer at 3 o'clock (matches home wheel + resolveNumberFromRotation)
    ctx.beginPath()
    ctx.moveTo(centerX + radius - 30, centerY)
    ctx.lineTo(centerX + radius - 5, centerY - 15)
    ctx.lineTo(centerX + radius - 5, centerY + 15)
    ctx.closePath()
    ctx.fillStyle = "#dc2626"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()
  }

  // Idle redraws (numbers / highlight / settings) — keep the last angle; do not snap to 0
  useEffect(() => {
    if (isSpinning) return
    drawWheel(currentRotationRef.current)
  }, [numbers, settings, size, highlightIndex, isSpinning])

  // Adopt an explicit locked rotation from the parent (after spin / manual stop)
  useEffect(() => {
    if (isSpinning) return
    currentRotationRef.current = rotation
    drawWheel(rotation)
  }, [rotation, isSpinning])

  // Home-style ease-out spin toward target `rotation`
  useEffect(() => {
    if (!isSpinning) return

    const token = ++spinTokenRef.current
    const startTime = Date.now()
    const duration = Math.max(0.5, settingsRef.current?.spinBehavior?.spinningDuration ?? 10) * 1000
    const startRotation = currentRotationRef.current
    const targetRotation = rotation
    const speedMultiplier = (settingsRef.current?.spinBehavior?.spinningSpeedLevel ?? 10) / 5
    let completed = false

    const animate = () => {
      if (token !== spinTokenRef.current) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 2 + speedMultiplier)
      const next = startRotation + (targetRotation - startRotation) * easeOut

      currentRotationRef.current = next
      drawWheel(next)
      onFrameRef.current?.(next, numbersRef.current.length)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      currentRotationRef.current = targetRotation
      drawWheel(targetRotation)
      onFrameRef.current?.(targetRotation, numbersRef.current.length)
      if (!completed) {
        completed = true
        onCompleteRef.current?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isSpinning, rotation])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="mx-auto h-auto w-full max-w-full drop-shadow-lg"
      style={{ aspectRatio: "1 / 1" }}
    />
  )
})

/** Resolve which number is under the 3 o'clock pointer for a given degree rotation (home-compatible). */
export function resolveNumberFromRotation(
  rotationDegrees: number,
  numbers: any[],
): { index: number; value: any } | null {
  if (!numbers.length) return null

  const weights = getSegmentWeights(numbers)
  const totalWeight = weights.reduce((s, w) => s + w, 0) || 1
  const segmentAngles = weights.map((w) => (w / totalWeight) * 360)

  const normalizedRotation = ((rotationDegrees % 360) + 360) % 360
  const angleUnderPointer = (360 - normalizedRotation) % 360
  const adjustedAngleForSegments = (angleUnderPointer + 90) % 360

  let selectedIndex = 0
  let currentAngle = 0
  for (let i = 0; i < segmentAngles.length; i++) {
    const endAngle = currentAngle + segmentAngles[i]
    if (adjustedAngleForSegments >= currentAngle && adjustedAngleForSegments < endAngle) {
      selectedIndex = i
      break
    }
    currentAngle = endAngle
    if (i === segmentAngles.length - 1) selectedIndex = i
  }

  const item = numbers[selectedIndex] ?? numbers[0]
  const value = typeof item === "object" && item !== null && "value" in item ? item.value : item
  return { index: selectedIndex, value }
}

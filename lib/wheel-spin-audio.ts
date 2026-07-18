/**
 * Hybrid spin audio: soft whoosh (looped MP3 with playbackRate) +
 * mechanical ticks on each segment/peg crossing.
 */

const MIN_TICK_INTERVAL_MS = 18
/** deg/ms treated as "full speed" for mapping rate/volume */
const FULL_SPEED_OMEGA = 1.5

export type SpinAudioFrame = {
  rotation: number
  time: number
}

export function createSpinAudioController() {
  let whoosh: HTMLAudioElement | null = null
  let audioCtx: AudioContext | null = null
  let lastFrame: SpinAudioFrame | null = null
  let lastPegIndex: number | null = null
  let lastTickTime = 0

  const getAudioContext = () => {
    if (typeof window === "undefined") return null
    if (!audioCtx) {
      const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return null
      audioCtx = new Ctx()
    }
    return audioCtx
  }

  const playTick = (volume: number) => {
    const ctx = getAudioContext()
    if (!ctx) return

    if (ctx.state === "suspended") {
      void ctx.resume()
    }

    const duration = 0.028
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / length
      // Short noise burst with fast decay — reads as a peg click
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 22) * (1 - t * 0.85)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.value = 1800
    filter.Q.value = 0.9

    const gain = ctx.createGain()
    const now = ctx.currentTime
    const peak = Math.min(1, Math.max(0, volume))
    gain.gain.setValueAtTime(peak, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(now)
    source.stop(now + duration + 0.01)
  }

  const pegIndexForRotation = (
    rotation: number,
    optionsCount: number,
    smartWeights: Array<{ weight: number }> | null | undefined
  ) => {
    if (optionsCount <= 0) return 0

    if (smartWeights && smartWeights.length === optionsCount) {
      const normalizedRotation = ((rotation % 360) + 360) % 360
      const angleUnderPointer = (360 - normalizedRotation) % 360
      const adjusted = (angleUnderPointer + 90) % 360
      const totalWeight = smartWeights.reduce((sum, w) => sum + w.weight, 0) || 1

      let currentAngle = 0
      for (let i = 0; i < smartWeights.length; i++) {
        const endAngle = currentAngle + (smartWeights[i].weight / totalWeight) * 360
        if (adjusted >= currentAngle && adjusted < endAngle) return i
        currentAngle = endAngle
      }
      return smartWeights.length - 1
    }

    // Equal segments: one peg every segmentAngle degrees of wheel travel
    const segmentAngle = 360 / optionsCount
    return Math.floor(rotation / segmentAngle)
  }

  return {
    startWhoosh(src: string, userVolume: number) {
      if (!whoosh) {
        whoosh = new Audio(src)
        whoosh.loop = true
      }
      whoosh.playbackRate = 1.55
      whoosh.volume = Math.min(1, userVolume * 0.35)
      whoosh.currentTime = 0
      void whoosh.play().catch(() => {})

      lastFrame = null
      lastPegIndex = null
      lastTickTime = 0

      const ctx = getAudioContext()
      if (ctx?.state === "suspended") {
        void ctx.resume()
      }
    },

    stop() {
      if (whoosh) {
        whoosh.pause()
        whoosh.currentTime = 0
        whoosh.playbackRate = 1
      }
      lastFrame = null
      lastPegIndex = null
      lastTickTime = 0
    },

    /**
     * Call every animation frame while spinning.
     * Updates whoosh rate/volume from angular speed and fires ticks on peg crossings.
     */
    syncFrame(
      rotation: number,
      optionsCount: number,
      userVolume: number,
      smartWeights?: Array<{ weight: number }> | null
    ) {
      const now = performance.now()
      let omega = 0

      if (lastFrame) {
        omega = Math.abs(rotation - lastFrame.rotation) / Math.max(now - lastFrame.time, 1)
      }
      lastFrame = { rotation, time: now }

      const speedNorm = Math.min(1, omega / FULL_SPEED_OMEGA)

      if (whoosh && !whoosh.paused) {
        // Fast spin → higher pitch/rate; crawl to stop → slow whoosh
        whoosh.playbackRate = Math.min(1.75, Math.max(0.35, 0.38 + speedNorm * 1.35))
        whoosh.volume = Math.min(1, userVolume * (0.08 + speedNorm * 0.3))
      }

      if (optionsCount <= 0) return

      const pegIndex = pegIndexForRotation(rotation, optionsCount, smartWeights)
      if (lastPegIndex !== null && pegIndex !== lastPegIndex) {
        if (now - lastTickTime >= MIN_TICK_INTERVAL_MS) {
          // Ticks stay audible as the wheel slows (slightly louder when slow)
          const tickVolume = userVolume * (0.55 + (1 - speedNorm) * 0.35)
          playTick(tickVolume)
          lastTickTime = now
        }
      }
      lastPegIndex = pegIndex
    },
  }
}

export type SpinAudioController = ReturnType<typeof createSpinAudioController>

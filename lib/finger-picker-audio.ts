export function playFingerTone(kind: "tick" | "go" | "win" | "out") {
  if (typeof window === "undefined") return
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return
  const ctx = new Ctor()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  const now = ctx.currentTime
  const table: Record<typeof kind, { freq: number; dur: number }> = {
    tick: { freq: 520, dur: 0.08 },
    go: { freq: 740, dur: 0.18 },
    win: { freq: 880, dur: 0.28 },
    out: { freq: 220, dur: 0.22 },
  }
  const { freq, dur } = table[kind]
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.12, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur)
  osc.start(now)
  osc.stop(now + dur)
  osc.onended = () => void ctx.close()
}

export function vibrateFinger(pattern: number | number[] = 40) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return
  try {
    navigator.vibrate(pattern)
  } catch {
    /* ignore */
  }
}

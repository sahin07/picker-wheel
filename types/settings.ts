export interface WheelSettings {
  spinBehavior: {
    spinningSpeedLevel: number
    spinningDuration: number
    manuallyStop: boolean
    mysterySpin: boolean
    removeWinnerAfterSpin: boolean
    mysteryResult: boolean
  }
  display: {
    showSpinCount: boolean
    randomInitialAngle: boolean
    initialSpinning: boolean
    spinButtonAnimation: boolean
  }
  appearance: {
    toolColors: string[]
    backgroundColor: string
    backgroundImage?: string
    spinButtonStyle: string
    bannerLogo?: string
  }
  confettiSound: {
    enableConfetti: boolean
    enableSound: boolean
    soundVolume: number
  }
}

export const defaultSettings: WheelSettings = {
  spinBehavior: {
    spinningSpeedLevel: 8,
    spinningDuration: 25,
    manuallyStop: false,
    mysterySpin: false,
    removeWinnerAfterSpin: false,
    mysteryResult: false,
  },
  display: {
    showSpinCount: true,
    randomInitialAngle: true,
    initialSpinning: true,
    spinButtonAnimation: true,
  },
  appearance: {
    toolColors: ["#4ade80", "#fbbf24", "#f97316", "#84cc16", "#eab308", "#22c55e"],
    backgroundColor: "#a8b5a0",
    spinButtonStyle: "default",
  },
  confettiSound: {
    enableConfetti: true,
    enableSound: true,
    soundVolume: 0.5,
  },
}

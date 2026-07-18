"use client"

interface BackgroundEffectsProps {
  showConfetti: boolean
}

export function BackgroundEffects({ showConfetti }: BackgroundEffectsProps) {
  return (
    <>
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-green-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-yellow-300 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  )
} 
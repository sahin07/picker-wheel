"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, RotateCcw } from "lucide-react"
import type { WheelOption } from "@/app/page"

interface WheelSectionProps {
  options: WheelOption[]
  isSpinning: boolean
  onSpin: () => void
  selectedResult: WheelOption | null
  spinRotation: number
  totalSpins: number
}

export default function WheelSection({
  options,
  isSpinning,
  onSpin,
  selectedResult,
  spinRotation,
  totalSpins,
}: WheelSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map())
  const animationRef = useRef<number>()

  useEffect(() => {
    // Preload images
    const imageMap = new Map<string, HTMLImageElement>()
    const imagePromises = options
      .filter((option) => option.image)
      .map((option) => {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            imageMap.set(option.id, img)
            resolve()
          }
          img.onerror = () => resolve() // Continue even if image fails to load
          img.src = option.image!
        })
      })

    Promise.all(imagePromises).then(() => {
      setLoadedImages(imageMap)
      drawWheel()
    })
  }, [options])

  useEffect(() => {
    if (isSpinning) {
      const startRotation = currentRotation
      const startTime = Date.now()
      const duration = 4000 // 4 seconds

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for realistic spin (fast start, slow end)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const rotation = startRotation + (spinRotation - startRotation) * easeOut

        setCurrentRotation(rotation)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)

      // Play spin sound if enabled
      if (soundEnabled) {
        playSpinSound()
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSpinning, spinRotation, soundEnabled])

  useEffect(() => {
    drawWheel()
  }, [options, currentRotation, loadedImages])

  const playSpinSound = () => {
    // Create a simple spinning sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((currentRotation * Math.PI) / 180)

    if (options.length === 0) {
      // Draw empty wheel
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, 2 * Math.PI)
      ctx.fillStyle = "#e5e7eb"
      ctx.fill()
      ctx.strokeStyle = "#9ca3af"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
      return
    }

    const anglePerSegment = (2 * Math.PI) / options.length

    options.forEach((option, index) => {
      // Segments start from top (-90 degrees) and go clockwise
      const startAngle = index * anglePerSegment - Math.PI / 2
      const endAngle = startAngle + anglePerSegment

      // Draw segment background
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = option.color || "#4ade80"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 4
      ctx.stroke()

      // Draw content (image and/or text)
      ctx.save()
      ctx.rotate(startAngle + anglePerSegment / 2) // Rotate to center of segment

      const image = loadedImages.get(option.id)
      if (image && option.image) {
        // Draw image
        const imageRadius = radius * 0.6
        const imageSize = Math.min(imageRadius * 1.0, 80)
        const imageX = imageRadius - imageSize / 2
        const imageY = -imageSize / 2 - 10

        ctx.save()
        ctx.beginPath()
        ctx.roundRect(imageX, imageY, imageSize, imageSize, 8)
        ctx.clip()
        ctx.drawImage(image, imageX, imageY, imageSize, imageSize)
        ctx.restore()

        // Draw text below image
        if (option.name) {
          ctx.fillStyle = "#000000"
          ctx.font = "bold 11px Arial"
          ctx.textAlign = "center"
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 3

          const displayText = option.name.length > 12 ? option.name.substring(0, 12) + "..." : option.name
          ctx.strokeText(displayText, imageX + imageSize / 2, imageY + imageSize + 20)
          ctx.fillText(displayText, imageX + imageSize / 2, imageY + imageSize + 20)
        }
      } else {
        // If no image, just show text in center
        ctx.textAlign = "center"
        ctx.fillStyle = "#000000"
        ctx.font = "bold 16px Arial"
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 3
        ctx.strokeText(option.name, radius * 0.7, 5)
        ctx.fillText(option.name, radius * 0.7, 5)
      }

      // Temporary debug: Draw segment index
      // ctx.fillStyle = "red";
      // ctx.font = "bold 10px Arial";
      // ctx.fillText(`Idx: ${index}`, radius * 0.9, -radius * 0.9);

      ctx.restore()
    })

    ctx.restore()

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 4
    ctx.stroke()

    // Draw "SPIN" text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("SPIN", centerX, centerY + 6)

    // CORRECTED: Draw pointer pointing to the right
    ctx.beginPath()
    ctx.moveTo(centerX + radius - 30, centerY) // Tip of the pointer
    ctx.lineTo(centerX + radius - 5, centerY - 15) // Top corner
    ctx.lineTo(centerX + radius - 5, centerY + 15) // Bottom corner
    ctx.closePath()
    ctx.fillStyle = "#dc2626"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()
  }

  const handleSpin = () => {
    onSpin()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          width={450}
          height={450}
          className="cursor-pointer drop-shadow-lg"
          onClick={!isSpinning ? handleSpin : undefined}
        />

        {/* Sound Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-md"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>

        {/* Spinning indicator */}
        {isSpinning && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            Spinning...
          </div>
        )}
      </div>

      {/* Result Display */}
      {selectedResult && !isSpinning && (
        <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300 shadow-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Winner!</h3>
          <div className="flex items-center justify-center space-x-3">
            {selectedResult.image && (
              <img
                src={selectedResult.image || "/placeholder.svg"}
                alt={selectedResult.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
              />
            )}
            <p className="text-2xl font-bold text-green-900">{selectedResult.name}</p>
          </div>
        </div>
      )}

      {/* Spin Button */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning || options.length === 0}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-12 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isSpinning ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Spinning...</span>
          </div>
        ) : (
          "🎯 SPIN THE WHEEL"
        )}
      </Button>

      {options.length === 0 && <p className="mt-4 text-gray-500 text-center">Add some options to start spinning!</p>}

      {/* Total Spins Counter */}
      <div className="mt-4 text-sm text-gray-500 flex items-center space-x-2">
        <span>Total spin = {totalSpins}</span>
        <RotateCcw className="w-4 h-4" />
      </div>
    </div>
  )
}

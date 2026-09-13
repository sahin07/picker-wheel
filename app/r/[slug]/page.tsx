"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import SettingsPanel from "@/components/settings-panel"
import { ToastProvider } from "@/contexts/toast-context"
import { Button } from "@/components/ui/button"
import {
  readPackedFromHash,
  unpackRaffleResult,
  type RaffleSharedResult,
} from "@/lib/raffle-share"
import { RAFFLE_SPIN_WHEEL_PATH } from "@/lib/raffle-spin-wheel-seo"
import { RaffleResultView } from "@/components/raffle-spin-wheel/raffle-result-view"

export default function RaffleResultBySlugPage() {
  const params = useParams()
  const slug = String(params?.slug || "")
  const [result, setResult] = useState<RaffleSharedResult | null | undefined>(undefined)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (!slug) {
      setResult(null)
      return
    }

    const resolve = () => {
      const packed = readPackedFromHash(window.location.hash)
      if (!packed) {
        setResult(null)
        return
      }
      const shared = unpackRaffleResult(packed)
      if (!shared) {
        setResult(null)
        return
      }
      setResult({ ...shared, slug })
    }

    resolve()
    const onHash = () => resolve()
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [slug])

  return (
    <ToastProvider>
      {result === undefined ? (
        <div className="flex min-h-screen items-center justify-center bg-amber-50 text-slate-500">
          Loading raffle results…
        </div>
      ) : result ? (
        <RaffleResultView result={result} onOpenSettings={() => setShowSettings(true)} />
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-4">
          <div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h1 className="font-spin-display text-2xl font-bold text-slate-900">Results not found</h1>
            <p className="mt-2 text-sm text-slate-500">
              This share link is missing draw data. Ask the host to create a new results link from the
              raffle history panel.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button className="bg-amber-700 hover:bg-amber-800" asChild>
                <Link href={RAFFLE_SPIN_WHEEL_PATH}>Raffle Spin Wheel</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </ToastProvider>
  )
}

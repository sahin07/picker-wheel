"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import SettingsPanel from "@/components/settings-panel"
import CustomWheelPlayer from "@/components/custom-wheel/player"
import { SettingsProvider } from "@/contexts/settings-context"
import { ToastProvider } from "@/contexts/toast-context"
import { useCustomWheelStore } from "@/stores/custom-wheel-store"
import {
  type CustomWheel,
  readPackedFromHash,
  takePendingCustomWheel,
  unpackCustomWheel,
} from "@/lib/custom-wheel"
import { Button } from "@/components/ui/button"

export default function CustomWheelBySlugPage() {
  const params = useParams()
  const slug = String(params?.slug || "")
  const upsertWheel = useCustomWheelStore((state) => state.upsertWheel)
  const storeWheel = useCustomWheelStore((state) =>
    slug
      ? state.wheels.find((w) => w.slug.toLowerCase() === slug.toLowerCase())
      : undefined,
  )
  const [wheel, setWheel] = useState<CustomWheel | null | undefined>(undefined)
  const [showSettings, setShowSettings] = useState(false)

  // Prefer live store data once available (fixes create → navigate race)
  useEffect(() => {
    if (storeWheel) setWheel(storeWheel)
  }, [storeWheel])

  useEffect(() => {
    if (!slug) {
      setWheel(null)
      return
    }

    const resolve = () => {
      const pending = takePendingCustomWheel(slug)
      if (pending) {
        upsertWheel(pending)
        setWheel(pending)
        return
      }

      const packed = readPackedFromHash(window.location.hash)
      if (packed) {
        const shared = unpackCustomWheel(packed)
        if (shared) {
          const resolved = { ...shared, slug }
          upsertWheel(resolved)
          setWheel(resolved)
          return
        }
      }

      const local = useCustomWheelStore.getState().getBySlug(slug)
      if (local) {
        setWheel(local)
        return
      }

      // Keep loading briefly while persist hydrates; then show not found
      setWheel((prev) => (prev === undefined ? null : prev))
    }

    const persistApi = useCustomWheelStore.persist
    if (persistApi?.hasHydrated?.()) {
      resolve()
    }

    const unsub = persistApi?.onFinishHydration?.(() => resolve())
    const timer = window.setTimeout(resolve, 0)
    const fallback = window.setTimeout(() => {
      const local = useCustomWheelStore.getState().getBySlug(slug)
      if (local) {
        setWheel(local)
        return
      }
      setWheel((prev) => (prev === undefined ? null : prev))
    }, 400)

    return () => {
      unsub?.()
      window.clearTimeout(timer)
      window.clearTimeout(fallback)
    }
  }, [slug, upsertWheel])

  return (
    <SettingsProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
          <Header onOpenSettings={() => setShowSettings(true)} />
          <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
            {wheel === undefined ? (
              <p className="text-center text-slate-500">Loading wheel…</p>
            ) : wheel ? (
              <CustomWheelPlayer wheel={wheel} onWheelChange={setWheel} />
            ) : (
              <div className="mx-auto max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
                <h1 className="font-spin-display text-2xl font-bold text-slate-800">Wheel not found</h1>
                <p className="mt-2 text-sm text-slate-500">
                  No custom wheel for <span className="font-mono">/w/{slug}</span> on this device.
                  Open a share link, or create a new wheel.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button className="font-spin-display bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/create-custom-wheel-spinner">Create Custom Wheel</Link>
                  </Button>
                  <Button variant="outline" className="font-spin-display" asChild>
                    <Link href="/">Home</Link>
                  </Button>
                </div>
              </div>
            )}
          </main>
          <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
      </ToastProvider>
    </SettingsProvider>
  )
}

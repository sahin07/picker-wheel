"use client"

import { useState } from "react"
import Header from "@/components/header"
import SettingsPanel from "@/components/settings-panel"
import CreateCustomWheelForm from "@/components/custom-wheel/create-form"
import { PlusCircle } from "lucide-react"
import { SettingsProvider } from "@/contexts/settings-context"

export default function CreateCustomWheelSpinnerPage() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        <Header onOpenSettings={() => setShowSettings(true)} />
        <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <PlusCircle className="h-6 w-6" />
              </span>
              <div>
                <h1 className="font-spin-display text-2xl font-bold text-slate-800">
                  Create Custom Wheel
                </h1>
                <p className="text-sm text-slate-500">
                  Name becomes the URL. Saved on this device — share links work without a database.
                </p>
              </div>
            </div>

            <CreateCustomWheelForm />
          </div>
        </main>
        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    </SettingsProvider>
  )
}

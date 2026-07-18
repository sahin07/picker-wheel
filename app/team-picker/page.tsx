"use client";

import Header from "@/components/header";
import SettingsPanel from "@/components/settings-panel";
import { useState } from "react";
import { ToastProvider } from "@/contexts/toast-context";
import TeamInputPanel from "@/components/team-input-panel";
import TeamPickerSection from "@/components/team-picker-section";
import SwitchWheelDropdown from "@/components/switch-wheel-dropdown";
import GeminiAIChat from "@/components/gemini-ai-chat";
import { useWheelManagerStore } from "@/stores/wheel-manager-store";
import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import Confetti from "react-confetti";
import { ToolPageTitle } from "@/components/tool-favorite-star";

export default function TeamPickerPage() {
  useEffect(() => {
    useWheelManagerStore.getState().setCurrentTool("team-picker");
  }, []);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { settings } = useSettingsStore();

  return (
    <ToastProvider>
      {showConfetti && <Confetti width={typeof window !== 'undefined' ? window.innerWidth : 1920} height={typeof window !== 'undefined' ? window.innerHeight : 1080} numberOfPieces={400} recycle={false} gravity={0.3} wind={0.05} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }} />}
      <div
        className="min-h-screen transition-colors duration-300 overflow-x-hidden"
        style={{
          backgroundColor: settings.appearance.backgroundColor,
          backgroundImage: settings.appearance.backgroundImage
            ? `url(${settings.appearance.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Header onOpenSettings={() => setShowSettings(true)} />
        <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <ToolPageTitle title="Team Picker Wheel" toolType="team-picker" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Randomize a list of names into groups. Set group size, balance by gender or label, pick representatives, and customize team names. Download or share your results instantly!
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            <div className="flex-1 min-w-0">
              <TeamInputPanel />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <TeamPickerSection onConfettiChange={setShowConfetti} />
            </div>
          </div>

        </main>
        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        <GeminiAIChat />
      </div>
    </ToastProvider>
  );
} 
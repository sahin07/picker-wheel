"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, Settings, Palette, Sparkles, ImageIcon, Square } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, saveToDatabase } = useSettingsStore()
  const [activeSection, setActiveSection] = useState("spinBehavior")
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!isOpen) return null

  const handleSave = async () => {
    await saveToDatabase()
    onClose()
  }

  const sections = [
    { id: "spinBehavior", label: "Spin Behavior", icon: <Settings className="w-4 h-4" /> },
    { id: "confettiSound", label: "Confetti & Sound", icon: <Sparkles className="w-4 h-4" /> },
    { id: "toolColors", label: "Tool Colors", icon: <Palette className="w-4 h-4" /> },
    { id: "backgroundColor", label: "Background Color", icon: <Square className="w-4 h-4" /> },
    { id: "backgroundImage", label: "Background Image", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "spinButton", label: "Spin Button", icon: <Square className="w-4 h-4" /> },
    { id: "bannerLogo", label: "Banner | Logo", icon: <ImageIcon className="w-4 h-4" /> },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <CardTitle>Tool Settings</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-500">
              (Click to {isCollapsed ? "Expand" : "Collapse"})
              {isCollapsed ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronUp className="w-4 h-4 ml-1" />}
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar */}
              <div className="space-y-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon}
                    <span className="ml-2">{section.label}</span>
                  </Button>
                ))}
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {activeSection === "spinBehavior" && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold">
                        Spinning Speed Level: {settings.spinBehavior.spinningSpeedLevel}
                      </Label>
                      <Slider
                        value={[settings.spinBehavior.spinningSpeedLevel]}
                        onValueChange={([value]) =>
                          updateSettings({
                            spinBehavior: { ...settings.spinBehavior, spinningSpeedLevel: value },
                          })
                        }
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-base font-semibold">
                        Spinning Duration: {settings.spinBehavior.spinningDuration}s
                      </Label>
                      <Slider
                        value={[settings.spinBehavior.spinningDuration]}
                        onValueChange={([value]) =>
                          updateSettings({
                            spinBehavior: { ...settings.spinBehavior, spinningDuration: value },
                          })
                        }
                        max={25}
                        min={3}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="manuallyStop"
                          checked={settings.spinBehavior.manuallyStop}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              spinBehavior: { ...settings.spinBehavior, manuallyStop: !!checked },
                            })
                          }
                        />
                        <Label htmlFor="manuallyStop">
                          Manually Stop <span className="text-sm text-gray-500">(Max 1 min, No custom speed)</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mysterySpin"
                          checked={settings.spinBehavior.mysterySpin}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              spinBehavior: { ...settings.spinBehavior, mysterySpin: !!checked },
                            })
                          }
                        />
                        <Label htmlFor="mysterySpin">
                          Mystery Spin <span className="text-sm text-gray-500">(Hide inputs on wheel)</span>
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "confettiSound" && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enableConfetti"
                        checked={settings.confettiSound.enableConfetti}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            confettiSound: { ...settings.confettiSound, enableConfetti: !!checked },
                          })
                        }
                      />
                      <Label htmlFor="enableConfetti">Enable Confetti Animation</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enableSound"
                        checked={settings.confettiSound.enableSound}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            confettiSound: { ...settings.confettiSound, enableSound: !!checked },
                          })
                        }
                      />
                      <Label htmlFor="enableSound">Enable Sound Effects</Label>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">
                        Sound Volume: {Math.round(settings.confettiSound.soundVolume * 100)}%
                      </Label>
                      <Slider
                        value={[settings.confettiSound.soundVolume]}
                        onValueChange={([value]) =>
                          updateSettings({
                            confettiSound: { ...settings.confettiSound, soundVolume: value },
                          })
                        }
                        max={1}
                        min={0}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {activeSection === "toolColors" && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Wheel Segment Colors</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {settings.appearance.toolColors.map((color, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...settings.appearance.toolColors]
                              newColors[index] = e.target.value
                              updateSettings({
                                appearance: { ...settings.appearance, toolColors: newColors },
                              })
                            }}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <span className="text-sm">Color {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "backgroundColor" && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Background Color</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="color"
                        value={settings.appearance.backgroundColor}
                        onChange={(e) =>
                          updateSettings({
                            appearance: { ...settings.appearance, backgroundColor: e.target.value },
                          })
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={settings.appearance.backgroundColor}
                        onChange={(e) =>
                          updateSettings({
                            appearance: { ...settings.appearance, backgroundColor: e.target.value },
                          })
                        }
                        className="flex-1"
                        placeholder="#a8b5a0"
                      />
                    </div>
                  </div>
                )}

                {activeSection === "backgroundImage" && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Background Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            updateSettings({
                              appearance: {
                                ...settings.appearance,
                                backgroundImage: event.target?.result as string,
                              },
                            })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    {settings.appearance.backgroundImage && (
                      <div className="mt-2">
                        <img
                          src={settings.appearance.backgroundImage || "/placeholder.svg"}
                          alt="Background preview"
                          className="w-32 h-20 object-cover rounded border"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateSettings({
                              appearance: { ...settings.appearance, backgroundImage: undefined },
                            })
                          }
                          className="mt-2"
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === "spinButton" && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Spin Button Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["default", "modern", "classic", "neon"].map((style) => (
                        <Button
                          key={style}
                          variant={settings.appearance.spinButtonStyle === style ? "default" : "outline"}
                          onClick={() =>
                            updateSettings({
                              appearance: { ...settings.appearance, spinButtonStyle: style },
                            })
                          }
                          className="capitalize"
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "bannerLogo" && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Banner Logo</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            updateSettings({
                              appearance: {
                                ...settings.appearance,
                                bannerLogo: event.target?.result as string,
                              },
                            })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    {settings.appearance.bannerLogo && (
                      <div className="mt-2">
                        <img
                          src={settings.appearance.bannerLogo || "/placeholder.svg"}
                          alt="Logo preview"
                          className="w-32 h-16 object-contain rounded border"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateSettings({
                              appearance: { ...settings.appearance, bannerLogo: undefined },
                            })
                          }
                          className="mt-2"
                        >
                          Remove Logo
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Sidebar - Display Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Display Options</h3>
                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showSpinCount"
                      checked={settings.display.showSpinCount}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          display: { ...settings.display, showSpinCount: !!checked },
                        })
                      }
                    />
                    <Label htmlFor="showSpinCount" className="text-sm">
                      Spin Count <span className="text-gray-500">(Show total spin number)</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="randomInitialAngle"
                      checked={settings.display.randomInitialAngle}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          display: { ...settings.display, randomInitialAngle: !!checked },
                        })
                      }
                    />
                    <Label htmlFor="randomInitialAngle" className="text-sm">
                      Random Initial Angle <span className="text-gray-500">(When new input inserted)</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="initialSpinning"
                      checked={settings.display.initialSpinning}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          display: { ...settings.display, initialSpinning: !!checked },
                        })
                      }
                    />
                    <Label htmlFor="initialSpinning" className="text-sm">
                      Initial Spinning <span className="text-gray-500">(Wheel rotates slowly after page load)</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="spinButtonAnimation"
                      checked={settings.display.spinButtonAnimation}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          display: { ...settings.display, spinButtonAnimation: !!checked },
                        })
                      }
                    />
                    <Label htmlFor="spinButtonAnimation" className="text-sm">
                      SPIN Button Animation and Color-Changing
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Save
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

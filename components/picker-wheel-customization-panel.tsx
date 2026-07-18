'use client'

import React, { useState, useEffect } from 'react'
import { 
  Palette, 
  Type, 
  Zap, 
  Volume2, 
  Layout, 
  Image, 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  X,
  Check,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  WheelCustomization,
  DEFAULT_CUSTOMIZATION,
  CUSTOMIZATION_PRESETS,
  COLOR_PALETTES,
  FONT_FAMILIES,
  EASING_FUNCTIONS,
  applyCustomization,
  saveCustomization,
  loadCustomization,
  resetCustomization,
  exportCustomization,
  importCustomization
} from '@/lib/picker-wheel-customization'

interface PickerWheelCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  onApply: (customization: WheelCustomization) => void
}

export function PickerWheelCustomizationPanel({ 
  isOpen, 
  onClose, 
  onApply 
}: PickerWheelCustomizationPanelProps) {
  const [customization, setCustomization] = useState<WheelCustomization>(DEFAULT_CUSTOMIZATION)
  const [activeTab, setActiveTab] = useState('visual')
  const [previewMode, setPreviewMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const saved = loadCustomization()
      setCustomization(saved)
      setHasChanges(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (previewMode) {
      applyCustomization(customization)
    }
  }, [customization, previewMode])

  const handleChange = (path: string, value: any) => {
    setCustomization(prev => {
      const newCustomization = { ...prev }
      const keys = path.split('.')
      let current: any = newCustomization
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      setHasChanges(true)
      return newCustomization
    })
  }

  const handlePresetApply = (preset: typeof CUSTOMIZATION_PRESETS[0]) => {
    setCustomization(prev => ({
      ...prev,
      ...preset.customization
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    saveCustomization(customization)
    onApply(customization)
    setHasChanges(false)
  }

  const handleReset = () => {
    setCustomization(DEFAULT_CUSTOMIZATION)
    setHasChanges(true)
  }

  const handleExport = () => {
    const data = exportCustomization(customization)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'picker-wheel-customization.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string
          const imported = importCustomization(data)
          setCustomization(imported)
          setHasChanges(true)
        } catch (error) {
          alert('Failed to import customization file')
        }
      }
      reader.readAsText(file)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold">Wheel Customization</h2>
              <p className="text-sm text-gray-600">Personalize your picker wheel experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? 'Hide Preview' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-64 border-r bg-gray-50 p-4">
                <TabsList className="grid w-full grid-cols-1 gap-2">
                  <TabsTrigger value="visual" className="flex items-center gap-2 justify-start">
                    <Palette className="h-4 w-4" />
                    Visual
                  </TabsTrigger>
                  <TabsTrigger value="fonts" className="flex items-center gap-2 justify-start">
                    <Type className="h-4 w-4" />
                    Fonts
                  </TabsTrigger>
                  <TabsTrigger value="animations" className="flex items-center gap-2 justify-start">
                    <Zap className="h-4 w-4" />
                    Animations
                  </TabsTrigger>
                  <TabsTrigger value="sounds" className="flex items-center gap-2 justify-start">
                    <Volume2 className="h-4 w-4" />
                    Sounds
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex items-center gap-2 justify-start">
                    <Layout className="h-4 w-4" />
                    Layout
                  </TabsTrigger>
                  <TabsTrigger value="branding" className="flex items-center gap-2 justify-start">
                    <Image className="h-4 w-4" />
                    Branding
                  </TabsTrigger>
                </TabsList>

                {/* Presets */}
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Quick Presets</h3>
                  <div className="space-y-2">
                    {CUSTOMIZATION_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetApply(preset)}
                        className="w-full text-left p-2 rounded border hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{preset.icon}</span>
                          <div>
                            <div className="font-medium text-sm">{preset.name}</div>
                            <div className="text-xs text-gray-600">{preset.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="visual" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Colors
                      </CardTitle>
                      <CardDescription>Customize the color scheme of your wheel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Primary Color</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="color"
                              value={customization.colors.primary}
                              onChange={(e) => handleChange('colors.primary', e.target.value)}
                              className="w-16 h-10"
                            />
                            <Input
                              value={customization.colors.primary}
                              onChange={(e) => handleChange('colors.primary', e.target.value)}
                              placeholder="#4ade80"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Secondary Color</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="color"
                              value={customization.colors.secondary}
                              onChange={(e) => handleChange('colors.secondary', e.target.value)}
                              className="w-16 h-10"
                            />
                            <Input
                              value={customization.colors.secondary}
                              onChange={(e) => handleChange('colors.secondary', e.target.value)}
                              placeholder="#fbbf24"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fonts" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5" />
                        Typography
                      </CardTitle>
                      <CardDescription>Customize fonts and text appearance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Font Family</Label>
                        <Select
                          value={customization.fonts.family}
                          onValueChange={(value) => handleChange('fonts.family', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_FAMILIES.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="animations" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Animation Settings
                      </CardTitle>
                      <CardDescription>Customize spin animations and effects</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Spin Speed (1-10)</Label>
                          <Slider
                            value={[customization.animations.spinSpeed]}
                            onValueChange={([value]) => handleChange('animations.spinSpeed', value)}
                            min={1}
                            max={10}
                            step={1}
                            className="mt-2"
                          />
                          <div className="text-sm text-gray-600 mt-1">{customization.animations.spinSpeed}/10</div>
                        </div>
                        <div>
                          <Label>Spin Duration (seconds)</Label>
                          <Slider
                            value={[customization.animations.spinDuration]}
                            onValueChange={([value]) => handleChange('animations.spinDuration', value)}
                            min={1}
                            max={10}
                            step={0.5}
                            className="mt-2"
                          />
                          <div className="text-sm text-gray-600 mt-1">{customization.animations.spinDuration}s</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sounds" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5" />
                        Sound Settings
                      </CardTitle>
                      <CardDescription>Customize audio feedback and effects</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Sounds</Label>
                          <p className="text-sm text-gray-600">Play sounds for interactions</p>
                        </div>
                        <Switch
                          checked={customization.sounds.enabled}
                          onCheckedChange={(checked) => handleChange('sounds.enabled', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layout className="h-5 w-5" />
                        Layout Settings
                      </CardTitle>
                      <CardDescription>Customize the layout and positioning</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Wheel Size</Label>
                          <Select
                            value={customization.layout.wheelSize}
                            onValueChange={(value) => handleChange('layout.wheelSize', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Button Position</Label>
                          <Select
                            value={customization.layout.buttonPosition}
                            onValueChange={(value) => handleChange('layout.buttonPosition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bottom">Bottom</SelectItem>
                              <SelectItem value="side">Side</SelectItem>
                              <SelectItem value="overlay">Overlay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="branding" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="h-5 w-5" />
                        Branding & Personalization
                      </CardTitle>
                      <CardDescription>Add your personal touch and branding</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Custom Logo URL</Label>
                        <Input
                          value={customization.branding.logo}
                          onChange={(e) => handleChange('branding.logo', e.target.value)}
                          placeholder="https://example.com/logo.png"
                        />
                        <p className="text-sm text-gray-600 mt-1">Enter a URL to your logo image</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Unsaved Changes
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
            </label>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 
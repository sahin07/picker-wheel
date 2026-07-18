import { create } from "zustand"
import { useWheelManagerStore } from "./wheel-manager-store"
import { useSettingsStore } from "./settings-store"

export interface WheelOption {
  id: string
  name: string
  image?: string
  color?: string
  weight?: number
  enabled?: boolean
}

interface EnhancedWheelStore {
  // Spin State
  isSpinning: boolean
  spinRotation: number
  selectedResult: WheelOption | null

  // Actions
  addOption: (name: string, image?: string) => void
  removeOption: (id: string) => void
  updateOption: (id: string, name: string, image?: string) => void
  patchOption: (id: string, patch: Partial<WheelOption>) => void
  duplicateOption: (id: string) => void
  clearAllOptions: () => void
  setTemplateOptions: (templateOptions: string[]) => void
  removeOptionsByIds: (ids: string[]) => void
  duplicateOptionsByIds: (ids: string[]) => void
  setEnabledForIds: (ids: string[], enabled: boolean) => void
  adjustWeightForIds: (ids: string[], delta: number) => void
  setColorForIds: (ids: string[], color: string) => void
  applyColorPalette: (colors: readonly string[]) => void
  setOptionsFromText: (text: string) => void
  replaceOptions: (options: WheelOption[]) => void

  // Spin Actions
  setIsSpinning: (spinning: boolean) => void
  setSpinRotation: (rotation: number) => void
  setSelectedResult: (result: WheelOption | null) => void
  incrementSpinCount: () => void

  // Getters
  getOptions: () => WheelOption[]
  getActiveOptions: () => WheelOption[]
  getTotalSpins: () => number
  getLastResult: () => WheelOption | null

  // Add new actions for shuffle, sort, and random operations:
  shuffleOptions: () => void
  sortOptionsAZ: () => void
  sortOptionsZA: () => void
  equalizeWeights: () => void
  removeBlanks: () => void
  removeDuplicates: () => void
  addRandomOptions: () => void
  previewWheel: () => WheelOption[]

  // Sync with wheel manager
  syncWithCurrentWheel: () => void
  resetState: () => void
  forceUpdate: () => void
  subscribeToWheelManager: () => void

  // Helper functions
  getCurrentWheelData: () => any
  updateCurrentWheelData: (updater: (data: any) => any) => void
}

const defaultColors = ["#4ade80", "#fbbf24", "#f97316", "#84cc16", "#eab308", "#22c55e"]

function normalizeOption(option: WheelOption, index = 0): WheelOption {
  return {
    ...option,
    weight: Math.max(1, option.weight ?? 1),
    enabled: option.enabled !== false,
    // Keep explicit colors only — don't force defaults (blocks Style toolColors / themes)
    color: option.color,
  }
}

export const useEnhancedWheelStore = create<EnhancedWheelStore>()((set, get) => ({
  // Spin State
  isSpinning: false,
  spinRotation: 0,
  selectedResult: null,

  // Helper function to get current wheel data
  getCurrentWheelData: () => {
    const currentWheel = useWheelManagerStore.getState().getCurrentWheel()
    return currentWheel?.data || { options: [], totalSpins: 0, lastResult: null }
  },

  // Helper function to update current wheel data
  updateCurrentWheelData: (updater: (data: any) => any) => {
    const wheelManager = useWheelManagerStore.getState()
    const currentWheel = wheelManager.getCurrentWheel()
    if (currentWheel) {
      const newData = updater(currentWheel.data)
      wheelManager.updateWheelData(wheelManager.currentTool, currentWheel.id, newData)
      // Wheel-manager store update notifies subscribers — no forceUpdate needed
    }
  },

  // Sync with current wheel - reset local state to match current wheel data
  syncWithCurrentWheel: () => {
    const currentData = get().getCurrentWheelData()
    set({
      isSpinning: false,
      spinRotation: 0,
      selectedResult: currentData.lastResult || null,
    })
  },

  // Reset state when switching wheels
  resetState: () => {
    set({
      isSpinning: false,
      spinRotation: 0,
      selectedResult: null,
    })
  },

  // Force update to trigger re-renders
  forceUpdate: () => {
    set((state) => ({ ...state }))
  },

  // Subscribe to wheel manager changes
  subscribeToWheelManager: () => {
    const wheelManager = useWheelManagerStore.getState();
    const currentWheel = wheelManager.getCurrentWheel();
    if (currentWheel) {
      const currentData = currentWheel.data as any;
      set({
        isSpinning: false,
        spinRotation: 0,
        selectedResult: currentData.lastResult || null,
      });
    }
  },

  // Option Management
  addOption: (name, image) => {
    const currentData = get().getCurrentWheelData()
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substr(2, 9)
    const newOption: WheelOption = {
      id: `${timestamp}-${randomSuffix}`,
      name: name || (image ? `Image ${currentData.options.length + 1}` : `Option ${currentData.options.length + 1}`),
      image,
      color: defaultColors[currentData.options.length % defaultColors.length],
      weight: 1,
      enabled: true,
    }

    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: [...data.options, newOption],
    }))
  },

  removeOption: (id) => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.filter((option: WheelOption) => option.id !== id),
    }))
  },

  updateOption: (id, name, image) => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.map((option: WheelOption) =>
        option.id === id ? { ...option, name, image: image || option.image } : option,
      ),
    }))
  },

  patchOption: (id, patch) => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.map((option: WheelOption) =>
        option.id === id
          ? normalizeOption({ ...option, ...patch }, data.options.indexOf(option))
          : option,
      ),
    }))
  },

  duplicateOption: (id) => {
    const currentData = get().getCurrentWheelData()
    const option = currentData.options.find((opt: WheelOption) => opt.id === id)
    if (option) {
      const timestamp = Date.now()
      const randomSuffix = Math.random().toString(36).substr(2, 9)
      const newOption = {
        ...option,
        id: `${timestamp}-${randomSuffix}`,
        name: `${option.name} (copy)`,
        weight: option.weight ?? 1,
        enabled: option.enabled !== false,
      }
      get().updateCurrentWheelData((data: any) => ({
        ...data,
        options: [...data.options, newOption],
      }))
    }
  },

  removeOptionsByIds: (ids) => {
    const idSet = new Set(ids)
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.filter((option: WheelOption) => !idSet.has(option.id)),
    }))
  },

  duplicateOptionsByIds: (ids) => {
    const idSet = new Set(ids)
    const timestamp = Date.now()
    get().updateCurrentWheelData((data: any) => {
      const clones = data.options
        .filter((option: WheelOption) => idSet.has(option.id))
        .map((option: WheelOption, index: number) => ({
          ...option,
          id: `${timestamp}-dup-${index}-${Math.random().toString(36).substr(2, 6)}`,
          name: `${option.name} (copy)`,
        }))
      return { ...data, options: [...data.options, ...clones] }
    })
  },

  setEnabledForIds: (ids, enabled) => {
    const idSet = new Set(ids)
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.map((option: WheelOption) =>
        idSet.has(option.id) ? { ...option, enabled } : option,
      ),
    }))
  },

  adjustWeightForIds: (ids, delta) => {
    const idSet = new Set(ids)
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.map((option: WheelOption) =>
        idSet.has(option.id)
          ? { ...option, weight: Math.max(1, (option.weight ?? 1) + delta) }
          : option,
      ),
    }))
  },

  setColorForIds: (ids, color) => {
    const idSet = new Set(ids)
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.map((option: WheelOption) =>
        idSet.has(option.id) ? { ...option, color } : option,
      ),
    }))
  },

  applyColorPalette: (colors) => {
    const palette = [...colors]
    if (palette.length === 0) return

    const { settings, updateSettings } = useSettingsStore.getState()
    updateSettings({
      appearance: {
        ...settings.appearance,
        toolColors: palette,
      },
    })

    const wheelManager = useWheelManagerStore.getState()
    if (wheelManager.currentTool !== "picker-wheel") {
      wheelManager.setCurrentTool("picker-wheel")
    }

    get().updateCurrentWheelData((data: any) => {
      const options = Array.isArray(data.options) ? data.options : []
      return {
        ...data,
        options: options.map((option: WheelOption, index: number) => ({
          ...option,
          color: palette[index % palette.length],
        })),
        // Clear theme lock so Style palette is what you see
        currentTheme: "custom",
      }
    })

    get().forceUpdate()
  },

  setOptionsFromText: (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    const timestamp = Date.now()
    get().updateCurrentWheelData((data: any) => {
      const prev = data.options || []
      const next = lines.map((line, i) => {
        let weight = 1
        let name = line
        const csvMatch = line.match(/^(\d+)\s*[,|]\s*(.+)$/) || line.match(/^(.+?)\s*[,|]\s*(\d+)$/)
        if (csvMatch) {
          if (/^\d+$/.test(csvMatch[1])) {
            weight = Math.max(1, parseInt(csvMatch[1], 10) || 1)
            name = csvMatch[2].trim()
          } else {
            name = csvMatch[1].trim()
            weight = Math.max(1, parseInt(csvMatch[2], 10) || 1)
          }
        }
        const existing = prev[i]
        return normalizeOption(
          {
            id: existing?.id || `${timestamp}-text-${i}-${Math.random().toString(36).substr(2, 5)}`,
            name,
            weight,
            enabled: existing?.enabled !== false,
            color: existing?.color,
            image: existing?.image,
          },
          i,
        )
      })
      return { ...data, options: next }
    })
  },

  replaceOptions: (options) => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: options.map((option, index) => normalizeOption(option, index)),
    }))
  },

  clearAllOptions: () => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: [],
    }))
    set({ selectedResult: null })
  },

  setTemplateOptions: (templateOptions) => {
    const timestamp = Date.now()
    const newOptions: WheelOption[] = templateOptions.map((text, index) =>
      normalizeOption(
        {
          id: `template-${timestamp}-${index}-${Math.random().toString(36).substr(2, 5)}`,
          name: text,
        },
        index,
      ),
    )

    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: newOptions,
    }))
    set({ selectedResult: null })
  },

  // Spin State Management
  setIsSpinning: (spinning) => set({ isSpinning: spinning }),
  setSpinRotation: (rotation) => set({ spinRotation: rotation }),
  setSelectedResult: (result) => {
    set({ selectedResult: result })
    if (result) {
      get().updateCurrentWheelData((data: any) => ({
        ...data,
        lastResult: result,
      }))
    }
  },
  incrementSpinCount: () => {
    const currentData = get().getCurrentWheelData();
    get().updateCurrentWheelData((data: any) => {
      const newData = {
        ...data,
        totalSpins: (data.totalSpins || 0) + 1,
      };
      return newData;
    });
  },

  // Getters
  getOptions: () => {
    const options = get().getCurrentWheelData().options || []
    return options.map((option: WheelOption, index: number) => normalizeOption(option, index))
  },
  getActiveOptions: () => get().getOptions().filter((option) => option.enabled !== false && option.name.trim()),
  getTotalSpins: () => {
    const data = get().getCurrentWheelData()
    return data.totalSpins || 0
  },
  getLastResult: () => get().getCurrentWheelData().lastResult,

  // Add these implementations in the store:
  shuffleOptions: () => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: [...data.options].sort(() => Math.random() - 0.5),
    }))
  },

  sortOptionsAZ: () => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: [...data.options].sort((a: WheelOption, b: WheelOption) => a.name.localeCompare(b.name)),
    }))
  },

  sortOptionsZA: () => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: [...data.options].sort((a: WheelOption, b: WheelOption) => b.name.localeCompare(a.name)),
    }))
  },

  equalizeWeights: () => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.map((option: WheelOption) => ({ ...option, weight: 1 })),
    }))
  },

  removeBlanks: () => {
    get().updateCurrentWheelData((data: any) => ({
      ...data,
      options: data.options.filter((option: WheelOption) => option.name.trim().length > 0),
    }))
  },

  removeDuplicates: () => {
    get().updateCurrentWheelData((data: any) => {
      const seen = new Set<string>()
      const options = data.options.filter((option: WheelOption) => {
        const key = option.name.trim().toLowerCase()
        if (!key || seen.has(key)) return false
        seen.add(key)
        return true
      })
      return { ...data, options }
    })
  },

  addRandomOptions: () => {
    const randomOptions = ["Option A", "Option B", "Option C", "Option D", "Option E"]
    const currentData = get().getCurrentWheelData()
    const timestamp = Date.now()

    randomOptions.forEach((name, index) => {
      const randomSuffix = Math.random().toString(36).substr(2, 9)
      const newOption: WheelOption = {
        id: `random-${timestamp}-${index}-${randomSuffix}`,
        name,
        color: defaultColors[(currentData.options.length + index) % defaultColors.length],
        weight: 1,
        enabled: true,
      }

      get().updateCurrentWheelData((data: any) => ({
        ...data,
        options: [...data.options, newOption],
      }))
    })
  },

  previewWheel: () => {
    return get().getCurrentWheelData().options
  },
}))

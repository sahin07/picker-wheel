export interface WheelCustomization {
  // Visual Customization
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    border: string
  }
  fonts: {
    family: string
    size: {
      wheel: number
      buttons: number
      labels: number
    }
    weight: string
  }
  wheel: {
    size: number
    borderWidth: number
    borderStyle: 'solid' | 'dashed' | 'dotted'
    shadow: boolean
    shadowColor: string
    shadowBlur: number
  }
  
  // Animation Customization
  animations: {
    spinSpeed: number // 1-10
    spinDuration: number // seconds
    bounce: boolean
    bounceIntensity: number // 1-10
    pulse: boolean
    pulseSpeed: number // 1-10
    shake: boolean
    shakeIntensity: number // 1-10
    easing: string
  }
  
  // Sound Customization
  sounds: {
    enabled: boolean
    spinSound: string
    winSound: string
    clickSound: string
    volume: number // 0-100
  }
  
  // Layout Customization
  layout: {
    wheelSize: 'small' | 'medium' | 'large'
    buttonPosition: 'bottom' | 'side' | 'overlay'
    showLabels: boolean
    showProgress: boolean
    compactMode: boolean
  }
  
  // Personal Branding
  branding: {
    logo: string
    logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    customText: string
    showCustomText: boolean
    watermark: string
  }
  
  // Advanced Settings
  advanced: {
    smoothSpinning: boolean
    particleEffects: boolean
    confettiType: 'default' | 'custom' | 'none'
    performanceMode: boolean
    accessibility: {
      highContrast: boolean
      largeText: boolean
      reducedMotion: boolean
    }
  }
}

export interface CustomizationPreset {
  id: string
  name: string
  description: string
  icon: string
  customization: Partial<WheelCustomization>
  category: 'theme' | 'animation' | 'sound' | 'layout' | 'branding'
}

// Default customization
export const DEFAULT_CUSTOMIZATION: WheelCustomization = {
  colors: {
    primary: '#4ade80',
    secondary: '#fbbf24',
    accent: '#f97316',
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb'
  },
  fonts: {
    family: 'Arial, sans-serif',
    size: {
      wheel: 16,
      buttons: 14,
      labels: 12
    },
    weight: 'normal'
  },
  wheel: {
    size: 500,
    borderWidth: 2,
    borderStyle: 'solid',
    shadow: true,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowBlur: 10
  },
  animations: {
    spinSpeed: 5,
    spinDuration: 3,
    bounce: false,
    bounceIntensity: 5,
    pulse: false,
    pulseSpeed: 5,
    shake: false,
    shakeIntensity: 5,
    easing: 'ease-out'
  },
  sounds: {
    enabled: true,
    spinSound: 'default',
    winSound: 'default',
    clickSound: 'default',
    volume: 50
  },
  layout: {
    wheelSize: 'medium',
    buttonPosition: 'bottom',
    showLabels: true,
    showProgress: true,
    compactMode: false
  },
  branding: {
    logo: '',
    logoPosition: 'top-left',
    customText: '',
    showCustomText: false,
    watermark: ''
  },
  advanced: {
    smoothSpinning: true,
    particleEffects: true,
    confettiType: 'default',
    performanceMode: false,
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false
    }
  }
}

// Color palettes
export const COLOR_PALETTES = [
  {
    name: 'Classic',
    colors: ['#4ade80', '#fbbf24', '#f97316', '#84cc16', '#eab308', '#22c55e']
  },
  {
    name: 'Ocean',
    colors: ['#0ea5e9', '#06b6d4', '#0891b2', '#0c4a6e', '#1e40af', '#3b82f6']
  },
  {
    name: 'Sunset',
    colors: ['#f97316', '#ea580c', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d']
  },
  {
    name: 'Forest',
    colors: ['#16a34a', '#15803d', '#166534', '#14532d', '#052e16', '#064e3b']
  },
  {
    name: 'Neon',
    colors: ['#f0abfc', '#a855f7', '#8b5cf6', '#6366f1', '#06b6d4', '#10b981']
  },
  {
    name: 'Pastel',
    colors: ['#fecaca', '#fde68a', '#fed7aa', '#bbf7d0', '#bfdbfe', '#ddd6fe']
  }
]

// Font families
export const FONT_FAMILIES = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  { name: 'Impact', value: 'Impact, sans-serif' }
]

// Easing functions
export const EASING_FUNCTIONS = [
  { name: 'Linear', value: 'linear' },
  { name: 'Ease In', value: 'ease-in' },
  { name: 'Ease Out', value: 'ease-out' },
  { name: 'Ease In Out', value: 'ease-in-out' },
  { name: 'Bounce', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  { name: 'Elastic', value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
]

// Customization presets
export const CUSTOMIZATION_PRESETS: CustomizationPreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean and simple design',
    icon: '🎯',
    category: 'theme',
    customization: {
      colors: {
        primary: '#4ade80',
        secondary: '#fbbf24',
        accent: '#f97316',
        background: '#ffffff',
        text: '#1f2937',
        border: '#e5e7eb'
      },
      animations: {
        spinSpeed: 5,
        spinDuration: 3,
        bounce: false,
        pulse: false,
        shake: false,
        easing: 'ease-out'
      }
    }
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Bright neon colors with glow effects',
    icon: '✨',
    category: 'theme',
    customization: {
      colors: {
        primary: '#f0abfc',
        secondary: '#a855f7',
        accent: '#8b5cf6',
        background: '#0f0f23',
        text: '#ffffff',
        border: '#6366f1'
      },
      wheel: {
        shadow: true,
        shadowColor: 'rgba(168, 85, 247, 0.5)',
        shadowBlur: 20
      },
      animations: {
        spinSpeed: 7,
        spinDuration: 4,
        bounce: true,
        bounceIntensity: 7,
        pulse: true,
        pulseSpeed: 3,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean design',
    icon: '⚪',
    category: 'theme',
    customization: {
      colors: {
        primary: '#6b7280',
        secondary: '#9ca3af',
        accent: '#d1d5db',
        background: '#ffffff',
        text: '#374151',
        border: '#e5e7eb'
      },
      wheel: {
        borderWidth: 1,
        shadow: false
      },
      animations: {
        spinSpeed: 3,
        spinDuration: 2,
        bounce: false,
        pulse: false,
        shake: false,
        easing: 'linear'
      },
      layout: {
        compactMode: true
      }
    }
  },
  {
    id: 'party',
    name: 'Party Mode',
    description: 'Fun and energetic animations',
    icon: '🎉',
    category: 'animation',
    customization: {
      animations: {
        spinSpeed: 8,
        spinDuration: 5,
        bounce: true,
        bounceIntensity: 9,
        pulse: true,
        pulseSpeed: 2,
        shake: true,
        shakeIntensity: 7,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      },
      sounds: {
        enabled: true,
        volume: 80
      },
      advanced: {
        particleEffects: true,
        confettiType: 'custom'
      }
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and business-like',
    icon: '💼',
    category: 'theme',
    customization: {
      colors: {
        primary: '#1f2937',
        secondary: '#374151',
        accent: '#6b7280',
        background: '#ffffff',
        text: '#111827',
        border: '#d1d5db'
      },
      fonts: {
        family: 'Helvetica, sans-serif',
        weight: '500'
      },
      animations: {
        spinSpeed: 4,
        spinDuration: 2.5,
        bounce: false,
        pulse: false,
        shake: false,
        easing: 'ease-in-out'
      },
      sounds: {
        enabled: false
      }
    }
  }
]

// Helper functions
export function applyCustomization(customization: WheelCustomization): void {
  // Apply CSS custom properties
  const root = document.documentElement
  
  // Colors
  root.style.setProperty('--wheel-primary', customization.colors.primary)
  root.style.setProperty('--wheel-secondary', customization.colors.secondary)
  root.style.setProperty('--wheel-accent', customization.colors.accent)
  root.style.setProperty('--wheel-background', customization.colors.background)
  root.style.setProperty('--wheel-text', customization.colors.text)
  root.style.setProperty('--wheel-border', customization.colors.border)
  
  // Fonts
  root.style.setProperty('--wheel-font-family', customization.fonts.family)
  root.style.setProperty('--wheel-font-size-wheel', `${customization.fonts.size.wheel}px`)
  root.style.setProperty('--wheel-font-size-buttons', `${customization.fonts.size.buttons}px`)
  root.style.setProperty('--wheel-font-size-labels', `${customization.fonts.size.labels}px`)
  root.style.setProperty('--wheel-font-weight', customization.fonts.weight)
  
  // Wheel
  root.style.setProperty('--wheel-size', `${customization.wheel.size}px`)
  root.style.setProperty('--wheel-border-width', `${customization.wheel.borderWidth}px`)
  root.style.setProperty('--wheel-border-style', customization.wheel.borderStyle)
  root.style.setProperty('--wheel-shadow', customization.wheel.shadow ? 'true' : 'false')
  root.style.setProperty('--wheel-shadow-color', customization.wheel.shadowColor)
  root.style.setProperty('--wheel-shadow-blur', `${customization.wheel.shadowBlur}px`)
  
  // Animations
  root.style.setProperty('--wheel-spin-speed', customization.animations.spinSpeed.toString())
  root.style.setProperty('--wheel-spin-duration', `${customization.animations.spinDuration}s`)
  root.style.setProperty('--wheel-bounce', customization.animations.bounce ? 'true' : 'false')
  root.style.setProperty('--wheel-bounce-intensity', customization.animations.bounceIntensity.toString())
  root.style.setProperty('--wheel-pulse', customization.animations.pulse ? 'true' : 'false')
  root.style.setProperty('--wheel-pulse-speed', customization.animations.pulseSpeed.toString())
  root.style.setProperty('--wheel-shake', customization.animations.shake ? 'true' : 'false')
  root.style.setProperty('--wheel-shake-intensity', customization.animations.shakeIntensity.toString())
  root.style.setProperty('--wheel-easing', customization.animations.easing)
  
  // Layout
  root.style.setProperty('--wheel-compact-mode', customization.layout.compactMode ? 'true' : 'false')
}

export function saveCustomization(customization: WheelCustomization): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('picker-wheel-customization', JSON.stringify(customization))
  } catch {
    // ignore in non-browser or restricted environments
  }
}

export function loadCustomization(): WheelCustomization {
  if (typeof window === 'undefined') return DEFAULT_CUSTOMIZATION
  try {
    const saved = localStorage.getItem('picker-wheel-customization')
    if (saved) {
      return { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(saved) }
    }
  } catch (error) {
    console.error('Failed to load customization:', error)
  }
  return DEFAULT_CUSTOMIZATION
}

export function resetCustomization(): WheelCustomization {
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem('picker-wheel-customization') } catch {}
  }
  return DEFAULT_CUSTOMIZATION
}

export function exportCustomization(customization: WheelCustomization): string {
  return JSON.stringify(customization, null, 2)
}

export function importCustomization(data: string): WheelCustomization {
  try {
    const parsed = JSON.parse(data)
    return { ...DEFAULT_CUSTOMIZATION, ...parsed }
  } catch (error) {
    console.error('Failed to import customization:', error)
    throw new Error('Invalid customization data')
  }
} 
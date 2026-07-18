// AI Color Analysis and Suggestions Utilities

export interface ColorAnalysis {
  harmony: number; // 0-100 score
  accessibility: {
    contrast: number; // 0-100 score
    wcagAA: boolean;
    wcagAAA: boolean;
  };
  personality: {
    mood: string;
    energy: number; // 0-100
    creativity: number; // 0-100
  };
  suggestions: {
    complementary: string[];
    analogous: string[];
    triadic: string[];
    monochromatic: string[];
  };
}

export interface ColorPersonality {
  type: 'Creative' | 'Professional' | 'Bold' | 'Calm' | 'Energetic' | 'Minimalist';
  description: string;
  traits: string[];
  recommendedColors: string[];
}

export interface ColorBlindnessSimulation {
  protanopia: string; // Color as seen by someone with protanopia
  deuteranopia: string; // Color as seen by someone with deuteranopia
  tritanopia: string; // Color as seen by someone with tritanopia
  accessibility: {
    isAccessible: boolean;
    suggestions: string[];
  };
}

export interface AIPaletteRequest {
  mood: string;
  style: string;
  purpose: string;
  colorCount: number;
}

export interface AIPaletteResponse {
  colors: string[];
  names: string[];
  description: string;
  mood: string;
  inspiration: string;
}

// Convert HEX to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convert HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Calculate color contrast ratio
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = hex.match(/[A-Za-z0-9]{2}/g)?.map(v => parseInt(v, 16) / 255) || [];
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Generate complementary colors
export function getComplementaryColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  const complementaryHue = (hsl.h + 180) % 360;
  return [
    hslToHex(complementaryHue, hsl.s, hsl.l),
    hslToHex((complementaryHue + 30) % 360, hsl.s, hsl.l),
    hslToHex((complementaryHue - 30 + 360) % 360, hsl.s, hsl.l)
  ];
}

// Generate analogous colors
export function getAnalogousColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h - 60 + 360) % 360, hsl.s, hsl.l)
  ];
}

// Generate triadic colors
export function getTriadicColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
  ];
}

// Generate monochromatic colors
export function getMonochromaticColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20)),
    hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20)),
    hslToHex(hsl.h, Math.max(0, hsl.s - 20), hsl.l),
    hslToHex(hsl.h, Math.min(100, hsl.s + 20), hsl.l)
  ];
}

// Calculate color harmony score
export function calculateHarmonyScore(colors: string[]): number {
  if (colors.length < 2) return 100;

  let totalScore = 0;
  let comparisons = 0;

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const hsl1 = hexToHsl(colors[i]);
      const hsl2 = hexToHsl(colors[j]);
      
      // Hue difference score
      const hueDiff = Math.abs(hsl1.h - hsl2.h);
      const hueScore = hueDiff <= 30 || hueDiff >= 330 ? 100 : 
                      hueDiff <= 60 ? 80 :
                      hueDiff <= 90 ? 60 :
                      hueDiff <= 120 ? 40 :
                      hueDiff <= 180 ? 20 : 0;
      
      // Saturation harmony
      const satDiff = Math.abs(hsl1.s - hsl2.s);
      const satScore = satDiff <= 20 ? 100 : 
                      satDiff <= 40 ? 80 :
                      satDiff <= 60 ? 60 : 40;
      
      // Lightness harmony
      const lightDiff = Math.abs(hsl1.l - hsl2.l);
      const lightScore = lightDiff <= 20 ? 100 :
                        lightDiff <= 40 ? 80 :
                        lightDiff <= 60 ? 60 : 40;
      
      totalScore += (hueScore + satScore + lightScore) / 3;
      comparisons++;
    }
  }

  return Math.round(totalScore / comparisons);
}

// Analyze color personality
export function analyzeColorPersonality(colors: string[]): ColorPersonality {
  if (colors.length === 0) {
    return {
      type: 'Minimalist',
      description: 'You prefer clean, simple color choices.',
      traits: ['Clean', 'Simple', 'Focused'],
      recommendedColors: ['#FFFFFF', '#000000', '#808080']
    };
  }

  const hslColors = colors.map(hexToHsl);
  const avgSaturation = hslColors.reduce((sum, c) => sum + c.s, 0) / hslColors.length;
  const avgLightness = hslColors.reduce((sum, c) => sum + c.l, 0) / hslColors.length;
  const hueVariety = new Set(hslColors.map(c => Math.floor(c.h / 30))).size;

  if (avgSaturation > 70 && avgLightness > 50) {
    return {
      type: 'Bold',
      description: 'You love vibrant, energetic colors that make a statement.',
      traits: ['Confident', 'Energetic', 'Expressive'],
      recommendedColors: ['#FF0000', '#FFD700', '#00FF00', '#FF69B4']
    };
  } else if (avgSaturation < 30 && avgLightness > 60) {
    return {
      type: 'Calm',
      description: 'You prefer soft, soothing colors that create a peaceful atmosphere.',
      traits: ['Peaceful', 'Balanced', 'Serene'],
      recommendedColors: ['#E6E6FA', '#F0F8FF', '#F5F5DC', '#E0F6FF']
    };
  } else if (hueVariety > 4) {
    return {
      type: 'Creative',
      description: 'You enjoy experimenting with diverse color combinations.',
      traits: ['Innovative', 'Artistic', 'Adventurous'],
      recommendedColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    };
  } else if (avgLightness < 40) {
    return {
      type: 'Professional',
      description: 'You prefer sophisticated, professional color schemes.',
      traits: ['Sophisticated', 'Professional', 'Reliable'],
      recommendedColors: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6']
    };
  } else {
    return {
      type: 'Energetic',
      description: 'You gravitate toward bright, lively colors that inspire action.',
      traits: ['Dynamic', 'Motivated', 'Optimistic'],
      recommendedColors: ['#FFA500', '#FF6347', '#32CD32', '#1E90FF']
    };
  }
}

// Generate creative color names
export function generateColorName(hex: string): string {
  const hsl = hexToHsl(hex);
  const names = [
    // Red tones
    { range: [0, 30], names: ['Sunset Red', 'Crimson', 'Ruby', 'Cherry', 'Fire Engine'] },
    // Orange tones
    { range: [30, 60], names: ['Tangerine', 'Amber', 'Golden', 'Pumpkin', 'Marigold'] },
    // Yellow tones
    { range: [60, 90], names: ['Sunshine', 'Lemon', 'Goldenrod', 'Honey', 'Butter'] },
    // Green tones
    { range: [90, 150], names: ['Emerald', 'Forest', 'Sage', 'Mint', 'Jade'] },
    // Blue tones
    { range: [150, 240], names: ['Ocean', 'Sapphire', 'Sky', 'Navy', 'Azure'] },
    // Purple tones
    { range: [240, 300], names: ['Amethyst', 'Lavender', 'Violet', 'Plum', 'Royal'] },
    // Pink/Magenta tones
    { range: [300, 360], names: ['Rose', 'Fuchsia', 'Magenta', 'Pink', 'Coral'] }
  ];

  const category = names.find(n => 
    hsl.h >= n.range[0] && hsl.h < n.range[1]
  ) || names[0];

  const baseName = category.names[Math.floor(Math.random() * category.names.length)];
  
  // Add modifiers based on saturation and lightness
  let modifier = '';
  if (hsl.s < 20) modifier = 'Pale ';
  else if (hsl.s > 80) modifier = 'Vibrant ';
  
  if (hsl.l < 30) modifier += 'Dark ';
  else if (hsl.l > 70) modifier += 'Light ';

  return modifier + baseName;
}

// Generate color story
export function generateColorStory(colors: string[]): string {
  if (colors.length === 0) return "A blank canvas awaits your creative touch.";

  const personality = analyzeColorPersonality(colors);
  const harmonyScore = calculateHarmonyScore(colors);
  
  const stories = {
    'Bold': [
      "These vibrant colors tell a story of confidence and energy. Like a fireworks display, each color demands attention and creates an unforgettable impression.",
      "Bold and unapologetic, this palette speaks of someone who isn't afraid to stand out and make a statement."
    ],
    'Calm': [
      "Soft and soothing, these colors create a peaceful sanctuary. Like a gentle breeze on a spring morning, they bring tranquility and balance.",
      "This palette whispers of serenity and mindfulness, perfect for creating spaces that nurture the soul."
    ],
    'Creative': [
      "A symphony of diverse colors that celebrates creativity and innovation. Each hue brings its own unique voice to create something truly original.",
      "This palette dances between different worlds, showing a mind that sees possibilities everywhere."
    ],
    'Professional': [
      "Sophisticated and refined, these colors speak of professionalism and reliability. They convey trust and competence in every shade.",
      "This palette represents the perfect balance of authority and approachability."
    ],
    'Energetic': [
      "Full of life and optimism, these colors radiate positive energy. They inspire action and enthusiasm in everything they touch.",
      "This palette is like a burst of motivation, ready to energize any project or space."
    ],
    'Minimalist': [
      "Clean and focused, these colors embrace the beauty of simplicity. Less is more, and every choice is intentional.",
      "This palette celebrates clarity and purpose, finding beauty in restraint."
    ]
  };

  const baseStory = stories[personality.type][Math.floor(Math.random() * stories[personality.type].length)];
  
  if (harmonyScore > 80) {
    return baseStory + " The colors work together in perfect harmony, creating a cohesive and balanced composition.";
  } else if (harmonyScore > 60) {
    return baseStory + " While the colors have their own character, they find a way to complement each other beautifully.";
  } else {
    return baseStory + " The contrasting nature of these colors creates an interesting dynamic that challenges conventional expectations.";
  }
}

// Main AI analysis function
export function analyzeColors(colors: string[]): ColorAnalysis {
  const harmony = calculateHarmonyScore(colors);
  const personality = analyzeColorPersonality(colors);
  
  // Calculate accessibility (using first two colors if available)
  let contrast = 100;
  let wcagAA = true;
  let wcagAAA = true;
  
  if (colors.length >= 2) {
    contrast = getContrastRatio(colors[0], colors[1]);
    wcagAA = contrast >= 4.5;
    wcagAAA = contrast >= 7;
  }

  // Generate suggestions based on the first color
  const primaryColor = colors[0] || '#FF0000';
  const suggestions = {
    complementary: getComplementaryColors(primaryColor),
    analogous: getAnalogousColors(primaryColor),
    triadic: getTriadicColors(primaryColor),
    monochromatic: getMonochromaticColors(primaryColor)
  };

  return {
    harmony,
    accessibility: {
      contrast: Math.round(contrast * 10),
      wcagAA,
      wcagAAA
    },
    personality: {
      mood: personality.type.toLowerCase(),
      energy: personality.type === 'Bold' || personality.type === 'Energetic' ? 85 : 
              personality.type === 'Calm' || personality.type === 'Minimalist' ? 25 : 60,
      creativity: personality.type === 'Creative' ? 90 : 
                 personality.type === 'Bold' ? 75 : 
                 personality.type === 'Minimalist' ? 30 : 60
    },
    suggestions
  };
}

// NEW AI FEATURES

// 1. AI-Powered Color Palette Generation
export function generateAIPalette(request: AIPaletteRequest): AIPaletteResponse {
  const { mood, style, purpose, colorCount } = request;
  
  // Mood-based color generation
  const moodColors = {
    'calm': ['#E8F4F8', '#B8D4E3', '#7FB3D3', '#4A90A4', '#2C5F73'],
    'energetic': ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#96CEB4'],
    'professional': ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#ECF0F1'],
    'creative': ['#FF9FF3', '#FECA57', '#48DB71', '#0ABDE3', '#FF6B6B'],
    'earthy': ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F5DEB3'],
    'futuristic': ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF0080'],
    'vintage': ['#8B7355', '#CD853F', '#DEB887', '#F5DEB3', '#FFE4B5'],
    'minimalist': ['#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA']
  };

  // Style-based modifications
  const styleModifiers = {
    'warm': (colors: string[]) => colors.map(c => adjustColorTemperature(c, 'warm')),
    'cool': (colors: string[]) => colors.map(c => adjustColorTemperature(c, 'cool')),
    'bright': (colors: string[]) => colors.map(c => adjustBrightness(c, 1.2)),
    'muted': (colors: string[]) => colors.map(c => adjustSaturation(c, 0.7)),
    'bold': (colors: string[]) => colors.map(c => adjustSaturation(c, 1.3))
  };

  // Get base colors from mood
  let baseColors = moodColors[mood.toLowerCase() as keyof typeof moodColors] || moodColors.creative;
  
  // Apply style modifications
  if (styleModifiers[style.toLowerCase() as keyof typeof styleModifiers]) {
    baseColors = styleModifiers[style.toLowerCase() as keyof typeof styleModifiers](baseColors);
  }

  // Limit to requested color count
  const colors = baseColors.slice(0, colorCount);
  
  // Generate creative names for each color
  const names = colors.map(color => generateColorName(color));
  
  // Generate description based on mood and purpose
  const descriptions = {
    'calm': 'A soothing palette perfect for creating peaceful and relaxing environments.',
    'energetic': 'A vibrant collection that brings energy and excitement to any project.',
    'professional': 'A sophisticated selection that conveys trust and competence.',
    'creative': 'An imaginative mix that sparks creativity and innovation.',
    'earthy': 'A natural palette that connects with the organic world around us.',
    'futuristic': 'A cutting-edge combination that looks toward tomorrow.',
    'vintage': 'A timeless selection that honors classic design principles.',
    'minimalist': 'A clean and focused palette that celebrates simplicity.'
  };

  return {
    colors,
    names,
    description: descriptions[mood.toLowerCase() as keyof typeof descriptions] || 'A carefully crafted color palette.',
    mood: mood,
    inspiration: `Inspired by ${mood} aesthetics for ${purpose} applications.`
  };
}

// 2. Enhanced Color Naming with AI-like Intelligence
export function generateIntelligentColorName(hex: string, context?: string): string {
  const hsl = hexToHsl(hex);
  
  // Context-aware naming
  if (context) {
    const contextNames = {
      'nature': generateNatureName(hsl),
      'emotions': generateEmotionName(hsl),
      'seasons': generateSeasonName(hsl),
      'food': generateFoodName(hsl),
      'places': generatePlaceName(hsl)
    };
    return contextNames[context as keyof typeof contextNames] || generateColorName(hex);
  }

  // Enhanced base naming with more variety
  const enhancedNames = [
    generateNatureName(hsl),
    generateEmotionName(hsl),
    generateSeasonName(hsl),
    generateFoodName(hsl),
    generatePlaceName(hsl)
  ];

  return enhancedNames[Math.floor(Math.random() * enhancedNames.length)];
}

// 3. Color Blindness Simulation
export function simulateColorBlindness(hex: string): ColorBlindnessSimulation {
  const hsl = hexToHsl(hex);
  
  // Simulate different types of color blindness
  const protanopia = simulateProtanopia(hsl);
  const deuteranopia = simulateDeuteranopia(hsl);
  const tritanopia = simulateTritanopia(hsl);
  
  // Check accessibility
  const isAccessible = checkAccessibility(hex);
  const suggestions = generateAccessibilitySuggestions(hex);
  
  return {
    protanopia,
    deuteranopia,
    tritanopia,
    accessibility: {
      isAccessible,
      suggestions
    }
  };
}

// Helper functions for new features
function adjustColorTemperature(hex: string, temperature: 'warm' | 'cool'): string {
  const hsl = hexToHsl(hex);
  if (temperature === 'warm') {
    hsl.h = (hsl.h + 30) % 360; // Shift toward warmer colors
  } else {
    hsl.h = (hsl.h - 30 + 360) % 360; // Shift toward cooler colors
  }
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

function adjustBrightness(hex: string, factor: number): string {
  const hsl = hexToHsl(hex);
  hsl.l = Math.min(100, hsl.l * factor);
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

function adjustSaturation(hex: string, factor: number): string {
  const hsl = hexToHsl(hex);
  hsl.s = Math.min(100, hsl.s * factor);
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

function generateNatureName(hsl: { h: number; s: number; l: number }): string {
  const natureNames = {
    red: ['Sunset Glow', 'Autumn Leaf', 'Cherry Blossom', 'Rose Petal', 'Maple Red'],
    orange: ['Golden Hour', 'Desert Sand', 'Amber Light', 'Tiger Lily', 'Sunset Orange'],
    yellow: ['Morning Sun', 'Golden Wheat', 'Honey Glow', 'Buttercup', 'Lemon Zest'],
    green: ['Forest Whisper', 'Emerald Glade', 'Sage Leaf', 'Moss Green', 'Spring Bud'],
    blue: ['Ocean Deep', 'Sky Blue', 'Sapphire Glow', 'Azure Mist', 'Crystal Clear'],
    purple: ['Lavender Field', 'Royal Purple', 'Violet Dream', 'Amethyst Glow', 'Twilight Purple']
  };
  
  const hue = hsl.h;
  let colorCategory = 'red';
  if (hue >= 30 && hue < 60) colorCategory = 'orange';
  else if (hue >= 60 && hue < 90) colorCategory = 'yellow';
  else if (hue >= 90 && hue < 150) colorCategory = 'green';
  else if (hue >= 150 && hue < 240) colorCategory = 'blue';
  else if (hue >= 240 && hue < 300) colorCategory = 'purple';
  
  const names = natureNames[colorCategory as keyof typeof natureNames];
  return names[Math.floor(Math.random() * names.length)];
}

function generateEmotionName(hsl: { h: number; s: number; l: number }): string {
  const emotionNames = {
    red: ['Passion', 'Energy', 'Courage', 'Love', 'Power'],
    orange: ['Joy', 'Creativity', 'Adventure', 'Warmth', 'Enthusiasm'],
    yellow: ['Happiness', 'Optimism', 'Intellect', 'Confidence', 'Hope'],
    green: ['Peace', 'Growth', 'Harmony', 'Balance', 'Renewal'],
    blue: ['Trust', 'Stability', 'Depth', 'Calm', 'Wisdom'],
    purple: ['Mystery', 'Luxury', 'Spirituality', 'Imagination', 'Royalty']
  };
  
  const hue = hsl.h;
  let colorCategory = 'red';
  if (hue >= 30 && hue < 60) colorCategory = 'orange';
  else if (hue >= 60 && hue < 90) colorCategory = 'yellow';
  else if (hue >= 90 && hue < 150) colorCategory = 'green';
  else if (hue >= 150 && hue < 240) colorCategory = 'blue';
  else if (hue >= 240 && hue < 300) colorCategory = 'purple';
  
  const names = emotionNames[colorCategory as keyof typeof emotionNames];
  return names[Math.floor(Math.random() * names.length)];
}

function generateSeasonName(hsl: { h: number; s: number; l: number }): string {
  const seasonNames = {
    spring: ['Spring Blossom', 'Fresh Growth', 'Morning Dew', 'New Life', 'Renewal'],
    summer: ['Summer Sky', 'Golden Sun', 'Ocean Breeze', 'Tropical Heat', 'Beach Sand'],
    autumn: ['Autumn Gold', 'Falling Leaves', 'Harvest Time', 'Cozy Warmth', 'Amber Glow'],
    winter: ['Winter Frost', 'Ice Blue', 'Snow White', 'Frozen Lake', 'Crystal Clear']
  };
  
  // Determine season based on color characteristics
  let season = 'spring';
  if (hsl.h >= 20 && hsl.h < 60 && hsl.s > 50) season = 'autumn';
  else if (hsl.h >= 180 && hsl.h < 240 && hsl.l > 60) season = 'winter';
  else if (hsl.h >= 60 && hsl.h < 120 && hsl.s > 40) season = 'summer';
  
  const names = seasonNames[season as keyof typeof seasonNames];
  return names[Math.floor(Math.random() * names.length)];
}

function generateFoodName(hsl: { h: number; s: number; l: number }): string {
  const foodNames = {
    red: ['Cherry Red', 'Strawberry', 'Tomato', 'Raspberry', 'Cranberry'],
    orange: ['Carrot Orange', 'Pumpkin', 'Mango', 'Peach', 'Apricot'],
    yellow: ['Lemon Yellow', 'Banana', 'Corn', 'Honey', 'Butter'],
    green: ['Lime Green', 'Mint', 'Sage', 'Olive', 'Avocado'],
    blue: ['Blueberry', 'Ocean Blue', 'Sapphire', 'Azure', 'Indigo'],
    purple: ['Grape Purple', 'Plum', 'Eggplant', 'Lavender', 'Violet']
  };
  
  const hue = hsl.h;
  let colorCategory = 'red';
  if (hue >= 30 && hue < 60) colorCategory = 'orange';
  else if (hue >= 60 && hue < 90) colorCategory = 'yellow';
  else if (hue >= 90 && hue < 150) colorCategory = 'green';
  else if (hue >= 150 && hue < 240) colorCategory = 'blue';
  else if (hue >= 240 && hue < 300) colorCategory = 'purple';
  
  const names = foodNames[colorCategory as keyof typeof foodNames];
  return names[Math.floor(Math.random() * names.length)];
}

function generatePlaceName(hsl: { h: number; s: number; l: number }): string {
  const placeNames = {
    red: ['Sunset Beach', 'Desert Dunes', 'Volcanic Rock', 'Canyon Red', 'Tuscan Clay'],
    orange: ['Golden Gate', 'Sahara Sand', 'Amber Coast', 'Tropical Island', 'Desert Oasis'],
    yellow: ['Golden Coast', 'Wheat Fields', 'Sunny Beach', 'Honey Valley', 'Golden City'],
    green: ['Emerald Forest', 'Irish Hills', 'Sage Desert', 'Moss Valley', 'Jade Mountain'],
    blue: ['Ocean Deep', 'Sapphire Bay', 'Azure Coast', 'Crystal Lake', 'Sky Peak'],
    purple: ['Lavender Fields', 'Amethyst Cave', 'Violet Valley', 'Royal Palace', 'Twilight City']
  };
  
  const hue = hsl.h;
  let colorCategory = 'red';
  if (hue >= 30 && hue < 60) colorCategory = 'orange';
  else if (hue >= 60 && hue < 90) colorCategory = 'yellow';
  else if (hue >= 90 && hue < 150) colorCategory = 'green';
  else if (hue >= 150 && hue < 240) colorCategory = 'blue';
  else if (hue >= 240 && hue < 300) colorCategory = 'purple';
  
  const names = placeNames[colorCategory as keyof typeof placeNames];
  return names[Math.floor(Math.random() * names.length)];
}

function simulateProtanopia(hsl: { h: number; s: number; l: number }): string {
  // Simulate red-green color blindness (protanopia)
  const newH = hsl.h < 60 ? hsl.h + 60 : hsl.h;
  return hslToHex(newH, hsl.s, hsl.l);
}

function simulateDeuteranopia(hsl: { h: number; s: number; l: number }): string {
  // Simulate red-green color blindness (deuteranopia)
  const newH = hsl.h < 60 ? hsl.h + 60 : hsl.h;
  return hslToHex(newH, hsl.s * 0.8, hsl.l);
}

function simulateTritanopia(hsl: { h: number; s: number; l: number }): string {
  // Simulate blue-yellow color blindness (tritanopia)
  const newH = hsl.h > 180 ? hsl.h - 180 : hsl.h;
  return hslToHex(newH, hsl.s, hsl.l);
}

function checkAccessibility(hex: string): boolean {
  // Check if color meets basic accessibility standards
  const hsl = hexToHsl(hex);
  return hsl.l > 20 && hsl.l < 80; // Not too dark or too light
}

function generateAccessibilitySuggestions(hex: string): string[] {
  const hsl = hexToHsl(hex);
  const suggestions = [];
  
  if (hsl.l < 30) {
    suggestions.push('Consider using a lighter version for better visibility');
  } else if (hsl.l > 80) {
    suggestions.push('Consider using a darker version for better contrast');
  }
  
  if (hsl.s < 20) {
    suggestions.push('This color might be too muted for some users');
  }
  
  return suggestions;
} 
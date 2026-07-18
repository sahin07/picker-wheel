export const roleColors = {
  top: "#FF6B6B",
  jungle: "#4ECDC4",
  mid: "#45B7D1",
  adc: "#96CEB4",
  support: "#FFEAA7",
} as const;

export const roleNames = {
  top: "Top Lane",
  jungle: "Jungle",
  mid: "Mid Lane",
  adc: "ADC",
  support: "Support",
} as const;

export const roleDescriptions = {
  top: "Solo lane champions who excel in 1v1 dueling",
  jungle: "Map control and objective-focused champions",
  mid: "Roaming and teamfight impact champions",
  adc: "Primary damage dealers for team fights",
  support: "Team enabling and vision control champions",
} as const;

export const popularityColors = {
  "S-tier": "#FFD700",
  "A-tier": "#C0C0C0",
  "B-tier": "#CD7F32",
  "C-tier": "#8B4513",
  "D-tier": "#696969",
} as const;

export const difficultyColors = {
  easy: "#4CAF50",
  medium: "#FF9800",
  hard: "#F44336",
  expert: "#9C27B0",
} as const;

export const damageTypeColors = {
  physical: "#FF5722",
  magical: "#3F51B5",
  mixed: "#9C27B0",
  true: "#607D8B",
} as const;

export const playStyleColors = {
  assassin: "#E91E63",
  tank: "#795548",
  mage: "#673AB7",
  marksman: "#FF9800",
  support: "#4CAF50",
  fighter: "#FF5722",
  balanced: "#607D8B",
} as const;

export const regionColors = {
  Demacia: "#4169E1",
  Noxus: "#DC143C",
  Ionia: "#32CD32",
  Freljord: "#87CEEB",
  Piltover: "#DAA520",
  Zaun: "#228B22",
  Shadow_Isles: "#2F4F4F",
  Bilgewater: "#CD853F",
  Shurima: "#F4A460",
  Targon: "#DDA0DD",
  Bandle_City: "#98FB98",
  Void: "#4B0082",
} as const;

// Enhanced Fortnite Skins Data with comprehensive information from various sources
export interface EnhancedSkinInfo {
  // Basic info
  id: string
  name: string
  rarity: string
  emoji: string
  season: string
  
  // Enhanced details
  description: string
  detailedDescription: string
  releaseDate: string
  lastSeenInShop: string
  shopPrice: number
  vbucksCost: number
  
  // Battle Pass info
  battlePassTier?: number
  battlePassSeason?: string
  isBattlePass: boolean
  
  // Statistics
  popularity: number // 1-100
  usageRate: number // percentage
  rarityPercentage: number
  shopAppearances: number
  
  // Set and series
  set: string
  series: string
  collection: string
  
  // Cosmetic items
  backbling?: string
  pickaxe?: string
  glider?: string
  contrail?: string
  emote?: string
  wrap?: string
  
  // Media
  imageUrl: string
  previewUrl: string
  showcaseVideo?: string
  
  // Community data
  communityRating: number // 1-5 stars
  reviewCount: number
  tags: string[]
  
  // Additional info
  collaboration?: string
  isExclusive: boolean
  isLimited: boolean
  isOG: boolean
  isSweaty: boolean // popular among competitive players
  
  // Lore and background
  lore: string
  background: string
  trivia: string[]
  
  // Technical details
  modelComplexity: string
  animationQuality: string
  hitboxSize: string
}

export const enhancedFortniteSkins: Record<string, EnhancedSkinInfo> = {
  "default-jonesy": {
    id: "default-jonesy",
    name: "Default Jonesy",
    rarity: "Common",
    emoji: "👤",
    season: "Default",
    description: "The classic Fortnite default skin",
    detailedDescription: "Jonesy is the iconic default skin that represents the essence of Fortnite. This simple yet recognizable character has become a symbol of the game's accessibility and has been used by millions of players worldwide.",
    releaseDate: "2017-07-25",
    lastSeenInShop: "Always Available",
    shopPrice: 0,
    vbucksCost: 0,
    isBattlePass: false,
    popularity: 85,
    usageRate: 15.2,
    rarityPercentage: 100,
    shopAppearances: 0,
    set: "Default Set",
    series: "Default Series",
    collection: "Default Collection",
    imageUrl: "/placeholder.svg?height=100&width=100&text=Jonesy",
    previewUrl: "/placeholder.svg?height=100&width=100&text=Jonesy",
    communityRating: 4.2,
    reviewCount: 15420,
    tags: ["default", "classic", "beginner", "free"],
    isExclusive: false,
    isLimited: false,
    isOG: true,
    isSweaty: false,
    lore: "Jonesy represents the everyman hero of Fortnite, a character that anyone can relate to and embody in their battle royale journey.",
    background: "Originally designed as a simple, approachable character for new players, Jonesy has grown to become one of the most recognizable faces in gaming.",
    trivia: [
      "Jonesy was one of the first characters created for Fortnite",
      "The name 'Jonesy' comes from the character's original concept as a 'Jones' type character",
      "This skin has been used in countless promotional materials and trailers"
    ],
    modelComplexity: "Low",
    animationQuality: "Standard",
    hitboxSize: "Standard"
  },

  "ghoul-trooper": {
    id: "ghoul-trooper",
    name: "Ghoul Trooper",
    rarity: "Uncommon",
    emoji: "🧟‍♀️",
    season: "Halloween",
    description: "Spooky zombie trooper for Halloween",
    detailedDescription: "Ghoul Trooper is a Halloween-themed skin featuring a zombie version of the classic trooper. With green skin, glowing eyes, and military gear, this skin perfectly captures the spooky Halloween atmosphere while maintaining the tactical aesthetic.",
    releaseDate: "2018-10-26",
    lastSeenInShop: "2023-10-31",
    shopPrice: 800,
    vbucksCost: 800,
    isBattlePass: false,
    popularity: 92,
    usageRate: 8.7,
    rarityPercentage: 15,
    shopAppearances: 12,
    set: "Halloween Set",
    series: "Spooky Series",
    collection: "Halloween Collection",
    backbling: "Ghoul Trooper Backpack",
    pickaxe: "Ghoul Trooper Pickaxe",
    imageUrl: "/placeholder.svg?height=100&width=100&text=Ghoul",
    previewUrl: "/placeholder.svg?height=100&width=100&text=Ghoul",
    communityRating: 4.8,
    reviewCount: 8920,
    tags: ["halloween", "zombie", "spooky", "seasonal", "popular"],
    isExclusive: false,
    isLimited: true,
    isOG: true,
    isSweaty: true,
    lore: "A fallen soldier reanimated by dark Halloween magic, the Ghoul Trooper continues to fight in the battle royale, bringing terror to the battlefield.",
    background: "Released during Fortnite's first major Halloween event, Ghoul Trooper quickly became one of the most sought-after skins due to its unique zombie aesthetic and limited availability.",
    trivia: [
      "Ghoul Trooper was one of the first Halloween skins released",
      "The skin has been re-released multiple times but remains highly valued",
      "Many players consider this an 'OG' skin due to its early release date"
    ],
    modelComplexity: "Medium",
    animationQuality: "High",
    hitboxSize: "Standard"
  },

  "raven": {
    id: "raven",
    name: "Raven",
    rarity: "Rare",
    emoji: "🐦‍⬛",
    season: "S3",
    description: "Dark and mysterious raven-themed skin",
    detailedDescription: "Raven is a mysterious, dark-themed skin featuring a raven mask and dark clothing. This skin has become iconic in the Fortnite community and is often associated with skilled players due to its intimidating appearance.",
    releaseDate: "2018-02-22",
    lastSeenInShop: "2023-11-15",
    shopPrice: 1200,
    vbucksCost: 1200,
    isBattlePass: false,
    popularity: 95,
    usageRate: 12.3,
    rarityPercentage: 8,
    shopAppearances: 18,
    set: "Dark Set",
    series: "Mystery Series",
    collection: "Season 3 Collection",
    backbling: "Raven Backpack",
    pickaxe: "Raven Pickaxe",
    glider: "Raven Glider",
    imageUrl: "/placeholder.svg?height=100&width=100&text=Raven",
    previewUrl: "/placeholder.svg?height=100&width=100&text=Raven",
    communityRating: 4.9,
    reviewCount: 12340,
    tags: ["dark", "mysterious", "popular", "iconic", "sweaty"],
    isExclusive: false,
    isLimited: true,
    isOG: true,
    isSweaty: true,
    lore: "A mysterious figure shrouded in darkness, Raven represents the unknown forces that lurk in the shadows of the Fortnite world.",
    background: "Raven was released during Season 3 and quickly became one of the most popular skins due to its unique dark aesthetic and intimidating appearance.",
    trivia: [
      "Raven is one of the most recognizable skins in Fortnite",
      "The skin has been featured in multiple promotional materials",
      "Many professional players use this skin in tournaments"
    ],
    modelComplexity: "High",
    animationQuality: "High",
    hitboxSize: "Standard"
  },

  "iron-man": {
    id: "iron-man",
    name: "Iron Man",
    rarity: "Legendary",
    emoji: "🤖",
    season: "Marvel",
    description: "Marvel's iconic Iron Man suit",
    detailedDescription: "Iron Man brings the power of Marvel's most iconic hero to Fortnite. This legendary skin features Tony Stark's signature red and gold armor with glowing arc reactor, making it one of the most visually impressive collaboration skins.",
    releaseDate: "2020-08-27",
    lastSeenInShop: "2023-12-10",
    shopPrice: 2000,
    vbucksCost: 2000,
    isBattlePass: false,
    popularity: 98,
    usageRate: 18.5,
    rarityPercentage: 3,
    shopAppearances: 25,
    set: "Marvel Set",
    series: "Avengers Series",
    collection: "Marvel Collection",
    backbling: "Arc Reactor",
    pickaxe: "Iron Man Gauntlets",
    glider: "Iron Man Jetpack",
    emote: "Iron Man Dance",
    imageUrl: "/placeholder.svg?height=100&width=100&text=IronMan",
    previewUrl: "/placeholder.svg?height=100&width=100&text=IronMan",
    communityRating: 4.7,
    reviewCount: 18750,
    tags: ["marvel", "collaboration", "legendary", "popular", "iconic"],
    collaboration: "Marvel",
    isExclusive: false,
    isLimited: true,
    isOG: false,
    isSweaty: true,
    lore: "Tony Stark's Iron Man suit brings advanced technology and superhero power to the Fortnite battlefield, representing the pinnacle of human innovation and heroism.",
    background: "Part of the massive Marvel collaboration event, Iron Man represents one of the most successful crossovers in gaming history.",
    trivia: [
      "Iron Man was part of the massive Marvel collaboration",
      "The skin features authentic Marvel design elements",
      "This collaboration brought millions of new players to Fortnite"
    ],
    modelComplexity: "Very High",
    animationQuality: "Exceptional",
    hitboxSize: "Standard"
  },

  "peely": {
    id: "peely",
    name: "Peely",
    rarity: "Epic",
    emoji: "🍌",
    season: "S8",
    description: "Adorable banana character",
    detailedDescription: "Peely is the lovable banana character that has become one of Fortnite's most iconic and meme-worthy skins. With its goofy appearance and charming personality, Peely has captured the hearts of players worldwide.",
    releaseDate: "2019-02-28",
    lastSeenInShop: "2023-11-20",
    shopPrice: 1500,
    vbucksCost: 1500,
    isBattlePass: false,
    popularity: 94,
    usageRate: 14.2,
    rarityPercentage: 12,
    shopAppearances: 22,
    set: "Food Set",
    series: "Funny Series",
    collection: "Season 8 Collection",
    backbling: "Peely Backpack",
    pickaxe: "Peely Pickaxe",
    glider: "Peely Glider",
    emote: "Peely Dance",
    imageUrl: "/placeholder.svg?height=100&width=100&text=Peely",
    previewUrl: "/placeholder.svg?height=100&width=100&text=Peely",
    communityRating: 4.6,
    reviewCount: 15680,
    tags: ["funny", "meme", "popular", "cute", "iconic"],
    isExclusive: false,
    isLimited: true,
    isOG: false,
    isSweaty: false,
    lore: "A sentient banana that somehow found its way into the Fortnite world, Peely brings joy and laughter to the battlefield with its innocent charm.",
    background: "Peely was introduced during Season 8 and quickly became a fan favorite due to its unique and humorous design.",
    trivia: [
      "Peely has multiple variants including Golden Peely and Agent Peely",
      "The character has appeared in multiple Fortnite events and storylines",
      "Peely has become one of the most recognizable Fortnite characters"
    ],
    modelComplexity: "Medium",
    animationQuality: "High",
    hitboxSize: "Standard"
  },

  "default-ramirez": {
    id: "default-ramirez",
    name: "Default Ramirez",
    rarity: "Common",
    emoji: "👩",
    season: "Default",
    description: "The classic female default skin",
    detailedDescription: "Ramirez is the iconic female default skin that represents the essence of Fortnite. This simple yet recognizable character has become a symbol of the game's accessibility and has been used by millions of players worldwide.",
    releaseDate: "2017-07-25",
    lastSeenInShop: "Always Available",
    shopPrice: 0,
    vbucksCost: 0,
    isBattlePass: false,
    popularity: 82,
    usageRate: 12.8,
    rarityPercentage: 100,
    shopAppearances: 0,
    set: "Default Set",
    series: "Default Series",
    collection: "Default Collection",
    imageUrl: "/placeholder.svg?height=100&width=100&text=Ramirez",
    previewUrl: "/placeholder.svg?height=100&width=100&text=Ramirez",
    communityRating: 4.1,
    reviewCount: 12850,
    tags: ["default", "classic", "beginner", "free", "female"],
    isExclusive: false,
    isLimited: false,
    isOG: true,
    isSweaty: false,
    lore: "Ramirez represents the everywoman hero of Fortnite, a character that anyone can relate to and embody in their battle royale journey.",
    background: "Originally designed as a simple, approachable character for new players, Ramirez has grown to become one of the most recognizable faces in gaming.",
    trivia: [
      "Ramirez was one of the first female characters created for Fortnite",
      "The character has been featured in countless promotional materials",
      "Many players prefer Ramirez over Jonesy for her design"
    ],
    modelComplexity: "Low",
    animationQuality: "Standard",
    hitboxSize: "Standard"
  },

  "assault-trooper": {
    id: "assault-trooper",
    name: "Assault Trooper",
    rarity: "Common",
    emoji: "🪖",
    season: "S1",
    description: "Classic military trooper skin",
    detailedDescription: "Assault Trooper is a classic military-themed skin featuring tactical gear and a helmet. This skin represents the early days of Fortnite and has become a nostalgic favorite among veteran players.",
    releaseDate: "2017-09-26",
    lastSeenInShop: "2023-12-15",
    shopPrice: 800,
    vbucksCost: 800,
    isBattlePass: false,
    popularity: 78,
    usageRate: 6.5,
    rarityPercentage: 85,
    shopAppearances: 35,
    set: "Military Set",
    series: "Tactical Series",
    collection: "Season 1 Collection",
    imageUrl: "/placeholder.svg?height=100&width=100&text=Assault",
    previewUrl: "/placeholder.svg?height=100&width=100&text=Assault",
    communityRating: 4.3,
    reviewCount: 8920,
    tags: ["military", "tactical", "classic", "season1", "helmet"],
    isExclusive: false,
    isLimited: false,
    isOG: true,
    isSweaty: true,
    lore: "A trained military operative, the Assault Trooper brings tactical expertise and combat experience to the Fortnite battlefield.",
    background: "Released during Season 1, Assault Trooper represents the military aesthetic that was popular in early Fortnite.",
    trivia: [
      "Assault Trooper was one of the first military-themed skins",
      "The skin has been re-released multiple times due to popularity",
      "Many competitive players use this skin for its clean design"
    ],
    modelComplexity: "Low",
    animationQuality: "Standard",
    hitboxSize: "Standard"
  },

  "skull-trooper": {
    id: "skull-trooper",
    name: "Skull Trooper",
    rarity: "Uncommon",
    emoji: "💀",
    season: "Halloween",
    description: "Spooky skeleton trooper for Halloween",
    detailedDescription: "Skull Trooper is a Halloween-themed skin featuring a skeleton version of the classic trooper. With its white bones and military gear, this skin perfectly captures the spooky Halloween atmosphere.",
    releaseDate: "2018-10-26",
    lastSeenInShop: "2023-10-31",
    shopPrice: 800,
    vbucksCost: 800,
    isBattlePass: false,
    popularity: 96,
    usageRate: 9.8,
    rarityPercentage: 12,
    shopAppearances: 15,
    set: "Halloween Set",
    series: "Spooky Series",
    collection: "Halloween Collection",
    backbling: "Skull Trooper Backpack",
    pickaxe: "Skull Trooper Pickaxe",
    imageUrl: "/placeholder.svg?height=100&width=100&text=Skull",
    previewUrl: "/placeholder.svg?height=100&width=100&text=Skull",
    communityRating: 4.9,
    reviewCount: 11230,
    tags: ["halloween", "skeleton", "spooky", "seasonal", "popular", "og"],
    isExclusive: false,
    isLimited: true,
    isOG: true,
    isSweaty: true,
    lore: "A fallen soldier whose skeleton continues to fight in the battle royale, the Skull Trooper brings terror and Halloween spirit to the battlefield.",
    background: "Released during Fortnite's first major Halloween event, Skull Trooper quickly became one of the most sought-after skins due to its unique skeleton aesthetic.",
    trivia: [
      "Skull Trooper was one of the first Halloween skins released",
      "The skin has been re-released multiple times but remains highly valued",
      "Many players consider this an 'OG' skin due to its early release date"
    ],
    modelComplexity: "Medium",
    animationQuality: "High",
    hitboxSize: "Standard"
  },

  "red-knight": {
    id: "red-knight",
    name: "Red Knight",
    rarity: "Rare",
    emoji: "🛡️",
    season: "S2",
    description: "Mysterious red knight with dark armor",
    detailedDescription: "Red Knight is a mysterious, dark-themed skin featuring red armor and a knight aesthetic. This skin has become iconic in the Fortnite community and is often associated with skilled players.",
    releaseDate: "2018-01-19",
    lastSeenInShop: "2023-11-25",
    shopPrice: 1200,
    vbucksCost: 1200,
    isBattlePass: false,
    popularity: 93,
    usageRate: 11.2,
    rarityPercentage: 10,
    shopAppearances: 20,
    set: "Knight Set",
    series: "Medieval Series",
    collection: "Season 2 Collection",
    backbling: "Red Knight Shield",
    pickaxe: "Red Knight Sword",
    glider: "Red Knight Banner",
    imageUrl: "/placeholder.svg?height=100&width=100&text=RedKnight",
    previewUrl: "/placeholder.svg?height=100&width=100&text=RedKnight",
    communityRating: 4.7,
    reviewCount: 9870,
    tags: ["knight", "medieval", "dark", "popular", "iconic", "sweaty"],
    isExclusive: false,
    isLimited: true,
    isOG: true,
    isSweaty: true,
    lore: "A mysterious knight from a dark realm, the Red Knight brings medieval power and intimidation to the Fortnite battlefield.",
    background: "Red Knight was released during Season 2 and quickly became one of the most popular skins due to its unique knight aesthetic.",
    trivia: [
      "Red Knight is one of the most recognizable knight skins",
      "The skin has been featured in multiple promotional materials",
      "Many professional players use this skin in tournaments"
    ],
    modelComplexity: "High",
    animationQuality: "High",
    hitboxSize: "Standard"
  },

  "nog-ops": {
    id: "nog-ops",
    name: "Nog Ops",
    rarity: "Uncommon",
    emoji: "🎄",
    season: "Christmas",
    description: "Festive Christmas-themed skin",
    detailedDescription: "Nog Ops is a Christmas-themed skin featuring festive holiday attire. With its red and green colors and Christmas spirit, this skin perfectly captures the holiday atmosphere.",
    releaseDate: "2018-12-20",
    lastSeenInShop: "2023-12-25",
    shopPrice: 800,
    vbucksCost: 800,
    isBattlePass: false,
    popularity: 88,
    usageRate: 7.3,
    rarityPercentage: 18,
    shopAppearances: 12,
    set: "Christmas Set",
    series: "Holiday Series",
    collection: "Christmas Collection",
    backbling: "Nog Ops Backpack",
    pickaxe: "Nog Ops Pickaxe",
    emote: "Christmas Dance",
    imageUrl: "/placeholder.svg?height=100&width=100&text=Nog",
    previewUrl: "/placeholder.svg?height=100&width=100&text=Nog",
    communityRating: 4.4,
    reviewCount: 7650,
    tags: ["christmas", "holiday", "festive", "seasonal", "female"],
    isExclusive: false,
    isLimited: true,
    isOG: false,
    isSweaty: false,
    lore: "A festive holiday character, Nog Ops brings Christmas cheer and holiday spirit to the Fortnite battlefield.",
    background: "Released during the Christmas event, Nog Ops quickly became a fan favorite due to its festive design.",
    trivia: [
      "Nog Ops was one of the first Christmas skins released",
      "The skin has been re-released every Christmas season",
      "Many players use this skin during the holiday season"
    ],
    modelComplexity: "Medium",
    animationQuality: "High",
    hitboxSize: "Standard"
  },

     "brawler": {
     id: "brawler",
     name: "Brawler",
     rarity: "Uncommon",
     emoji: "🥊",
     season: "S2",
     description: "Tough fighter with boxing gloves",
     detailedDescription: "Brawler is a tough, fighter-themed skin featuring boxing gloves and athletic gear. This skin represents strength and combat prowess in the Fortnite world.",
     releaseDate: "2018-01-19",
     lastSeenInShop: "2023-11-10",
     shopPrice: 800,
     vbucksCost: 800,
     isBattlePass: false,
     popularity: 76,
     usageRate: 5.2,
     rarityPercentage: 25,
     shopAppearances: 28,
     set: "Fighter Set",
     series: "Athletic Series",
     collection: "Season 2 Collection",
     backbling: "Brawler Backpack",
     pickaxe: "Brawler Gloves",
     imageUrl: "/placeholder.svg?height=100&width=100&text=Brawler",
     previewUrl: "/placeholder.svg?height=100&width=100&text=Brawler",
     communityRating: 4.2,
     reviewCount: 5430,
     tags: ["fighter", "boxing", "athletic", "tough", "combat"],
     isExclusive: false,
     isLimited: false,
     isOG: false,
     isSweaty: false,
     lore: "A trained fighter with boxing expertise, the Brawler brings combat skills and athletic prowess to the Fortnite battlefield.",
     background: "Brawler was released during Season 2 and represents the athletic/fighter aesthetic in Fortnite.",
     trivia: [
       "Brawler was one of the first fighter-themed skins",
       "The skin features authentic boxing gear",
       "Many players use this skin for its tough appearance"
     ],
     modelComplexity: "Medium",
     animationQuality: "Standard",
     hitboxSize: "Standard"
   },

   "cuddle-team-leader": {
     id: "cuddle-team-leader",
     name: "Cuddle Team Leader",
     rarity: "Rare",
     emoji: "🧸",
     season: "Valentine",
     description: "Adorable teddy bear character",
     detailedDescription: "Cuddle Team Leader is a cute, teddy bear-themed skin that has become one of Fortnite's most beloved characters. With its pink fur and heart details, this skin perfectly captures the Valentine's Day spirit.",
     releaseDate: "2018-02-14",
     lastSeenInShop: "2024-02-14",
     shopPrice: 1200,
     vbucksCost: 1200,
     isBattlePass: false,
     popularity: 91,
     usageRate: 8.9,
     rarityPercentage: 15,
     shopAppearances: 18,
     set: "Valentine Set",
     series: "Cute Series",
     collection: "Valentine Collection",
     backbling: "Cuddle Team Leader Backpack",
     pickaxe: "Cuddle Team Leader Pickaxe",
     glider: "Cuddle Team Leader Glider",
     emote: "Cuddle Team Leader Dance",
     imageUrl: "/placeholder.svg?height=100&width=100&text=Cuddle",
     previewUrl: "/placeholder.svg?height=100&width=100&text=Cuddle",
     communityRating: 4.8,
     reviewCount: 13450,
     tags: ["cute", "teddy", "valentine", "pink", "popular", "female"],
     isExclusive: false,
     isLimited: true,
     isOG: true,
     isSweaty: false,
     lore: "A magical teddy bear that brings love and cuddles to the Fortnite battlefield, spreading joy and Valentine's spirit wherever it goes.",
     background: "Released during the Valentine's Day event, Cuddle Team Leader quickly became a fan favorite due to its adorable design and seasonal appeal.",
     trivia: [
       "Cuddle Team Leader was one of the first Valentine's Day skins",
       "The skin has been re-released every Valentine's Day season",
       "Many players consider this one of the cutest skins in Fortnite"
     ],
     modelComplexity: "Medium",
     animationQuality: "High",
     hitboxSize: "Standard"
   },

   "fishstick": {
     id: "fishstick",
     name: "Fishstick",
     rarity: "Rare",
     emoji: "🐟",
     season: "S7",
     description: "Goofy fish character with human legs",
     detailedDescription: "Fishstick is a hilarious fish character with human legs that has become one of Fortnite's most meme-worthy skins. With its goofy appearance and unique design, Fishstick has captured the hearts of players worldwide.",
     releaseDate: "2018-12-13",
     lastSeenInShop: "2023-12-20",
     shopPrice: 1200,
     vbucksCost: 1200,
     isBattlePass: false,
     popularity: 89,
     usageRate: 11.5,
     rarityPercentage: 18,
     shopAppearances: 32,
     set: "Fish Set",
     series: "Funny Series",
     collection: "Season 7 Collection",
     backbling: "Fishstick Backpack",
     pickaxe: "Fishstick Pickaxe",
     glider: "Fishstick Glider",
     emote: "Fishstick Dance",
     imageUrl: "/placeholder.svg?height=100&width=100&text=Fishstick",
     previewUrl: "/placeholder.svg?height=100&width=100&text=Fishstick",
     communityRating: 4.5,
     reviewCount: 9870,
     tags: ["fish", "funny", "meme", "goofy", "popular", "season7"],
     isExclusive: false,
     isLimited: false,
     isOG: false,
     isSweaty: false,
     lore: "A fish that somehow grew human legs and learned to walk, Fishstick brings aquatic humor and marine charm to the Fortnite battlefield.",
     background: "Fishstick was introduced during Season 7 and quickly became a viral sensation due to its absurd and humorous design.",
     trivia: [
       "Fishstick has multiple variants including Golden Fishstick",
       "The skin became a massive meme in the Fortnite community",
       "Fishstick has appeared in multiple Fortnite events and storylines"
     ],
     modelComplexity: "Medium",
     animationQuality: "High",
     hitboxSize: "Standard"
   },

   "drift": {
     id: "drift",
     name: "Drift",
     rarity: "Rare",
     emoji: "⚡",
     season: "S5",
     description: "Mysterious masked character with lightning powers",
     detailedDescription: "Drift is a mysterious, lightning-themed skin featuring a mask and glowing effects. This skin represents the power of electricity and has become iconic in the Fortnite community.",
     releaseDate: "2018-07-12",
     lastSeenInShop: "2023-11-05",
     shopPrice: 1200,
     vbucksCost: 1200,
     isBattlePass: false,
     popularity: 87,
     usageRate: 9.2,
     rarityPercentage: 20,
     shopAppearances: 25,
     set: "Lightning Set",
     series: "Power Series",
     collection: "Season 5 Collection",
     backbling: "Drift Backpack",
     pickaxe: "Drift Pickaxe",
     glider: "Drift Glider",
     emote: "Drift Dance",
     imageUrl: "/placeholder.svg?height=100&width=100&text=Drift",
     previewUrl: "/placeholder.svg?height=100&width=100&text=Drift",
     communityRating: 4.6,
     reviewCount: 11230,
     tags: ["lightning", "electric", "mysterious", "power", "masked"],
     isExclusive: false,
     isLimited: true,
     isOG: false,
     isSweaty: true,
     lore: "A mysterious figure with the power to control lightning, Drift brings electrical energy and mysterious power to the Fortnite battlefield.",
     background: "Drift was released during Season 5 and quickly became popular due to its unique lightning aesthetic and mysterious appearance.",
     trivia: [
       "Drift has multiple evolution stages with different appearances",
       "The skin features dynamic lightning effects",
       "Many competitive players use this skin for its intimidating look"
     ],
     modelComplexity: "High",
     animationQuality: "High",
     hitboxSize: "Standard"
   },

   "john-wick": {
     id: "john-wick",
     name: "John Wick",
     rarity: "Epic",
     emoji: "🕴️",
     season: "S9",
     description: "Legendary assassin from the movies",
     detailedDescription: "John Wick brings the legendary assassin from the hit movie series to Fortnite. This epic skin features the iconic black suit and tie, making it one of the most recognizable collaboration skins.",
     releaseDate: "2019-05-09",
     lastSeenInShop: "2023-12-15",
     shopPrice: 1500,
     vbucksCost: 1500,
     isBattlePass: false,
     popularity: 94,
     usageRate: 13.8,
     rarityPercentage: 8,
     shopAppearances: 22,
     set: "John Wick Set",
     series: "Movie Series",
     collection: "Season 9 Collection",
     backbling: "John Wick Backpack",
     pickaxe: "John Wick Pickaxe",
     glider: "John Wick Glider",
     emote: "John Wick Dance",
     imageUrl: "/placeholder.svg?height=100&width=100&text=JohnWick",
     previewUrl: "/placeholder.svg?height=100&width=100&text=JohnWick",
     communityRating: 4.9,
     reviewCount: 18750,
     tags: ["john-wick", "assassin", "movie", "collaboration", "popular", "iconic"],
     collaboration: "John Wick",
     isExclusive: false,
     isLimited: true,
     isOG: false,
     isSweaty: true,
     lore: "The legendary assassin John Wick brings his deadly skills and iconic style to the Fortnite battlefield, representing the ultimate in precision and style.",
     background: "Part of the John Wick collaboration event, this skin represents one of the most successful movie crossovers in Fortnite history.",
     trivia: [
       "John Wick was part of a major movie collaboration",
       "The skin features authentic movie design elements",
       "This collaboration brought millions of new players to Fortnite"
     ],
     modelComplexity: "High",
     animationQuality: "High",
     hitboxSize: "Standard"
   },

   "black-knight": {
     id: "black-knight",
     name: "Black Knight",
     rarity: "Epic",
     emoji: "⚔️",
     season: "S2",
     description: "Dark knight with intimidating armor",
     detailedDescription: "Black Knight is a dark, intimidating knight skin featuring black armor and a menacing appearance. This skin has become one of the most iconic and sought-after battle pass skins in Fortnite history.",
     releaseDate: "2018-01-19",
     lastSeenInShop: "Battle Pass Only",
     shopPrice: 0,
     vbucksCost: 0,
     isBattlePass: true,
     battlePassTier: 70,
     battlePassSeason: "S2",
     popularity: 97,
     usageRate: 16.2,
     rarityPercentage: 5,
     shopAppearances: 0,
     set: "Knight Set",
     series: "Medieval Series",
     collection: "Season 2 Collection",
     backbling: "Black Knight Shield",
     pickaxe: "Black Knight Sword",
     glider: "Black Knight Banner",
     emote: "Black Knight Dance",
     imageUrl: "/placeholder.svg?height=100&width=100&text=BlackKnight",
     previewUrl: "/placeholder.svg?height=100&width=100&text=BlackKnight",
     communityRating: 4.9,
     reviewCount: 23450,
     tags: ["knight", "medieval", "dark", "battle-pass", "og", "iconic", "sweaty"],
     isExclusive: true,
     isLimited: true,
     isOG: true,
     isSweaty: true,
     lore: "A dark knight from the depths of medieval legend, the Black Knight brings terror and intimidation to the Fortnite battlefield with its menacing armor.",
     background: "Black Knight was the final reward of Season 2 Battle Pass and has become one of the most iconic skins in Fortnite history.",
     trivia: [
       "Black Knight was the final reward of Season 2 Battle Pass",
       "The skin is considered one of the rarest and most valuable",
       "Many professional players use this skin in tournaments"
     ],
     modelComplexity: "Very High",
     animationQuality: "High",
     hitboxSize: "Standard"
   },

   "omega": {
     id: "omega",
     name: "Omega",
     rarity: "Epic",
     emoji: "🤖",
     season: "S4",
     description: "Futuristic robot warrior",
     detailedDescription: "Omega is a futuristic robot warrior skin featuring advanced armor and glowing effects. This skin represents the pinnacle of technology and has become iconic in the Fortnite community.",
     releaseDate: "2018-05-01",
     lastSeenInShop: "Battle Pass Only",
     shopPrice: 0,
     vbucksCost: 0,
     isBattlePass: true,
     battlePassTier: 100,
     battlePassSeason: "S4",
     popularity: 95,
     usageRate: 14.7,
     rarityPercentage: 6,
     shopAppearances: 0,
     set: "Omega Set",
     series: "Robot Series",
     collection: "Season 4 Collection",
     backbling: "Omega Backpack",
     pickaxe: "Omega Pickaxe",
     glider: "Omega Glider",
     emote: "Omega Dance",
     imageUrl: "/placeholder.svg?height=100&width=100&text=Omega",
     previewUrl: "/placeholder.svg?height=100&width=100&text=Omega",
     communityRating: 4.8,
     reviewCount: 19870,
     tags: ["robot", "futuristic", "battle-pass", "og", "iconic", "sweaty"],
     isExclusive: true,
     isLimited: true,
     isOG: true,
     isSweaty: true,
     lore: "A futuristic robot warrior from the depths of space, Omega brings advanced technology and robotic power to the Fortnite battlefield.",
     background: "Omega was the final reward of Season 4 Battle Pass and has become one of the most iconic robot skins in Fortnite.",
     trivia: [
       "Omega was the final reward of Season 4 Battle Pass",
       "The skin has multiple evolution stages",
       "Many competitive players use this skin for its intimidating appearance"
     ],
     modelComplexity: "Very High",
     animationQuality: "Exceptional",
     hitboxSize: "Standard"
   },

   "batman": {
     id: "batman",
     name: "Batman",
     rarity: "Legendary",
     emoji: "🦇",
     season: "DC",
     description: "The Dark Knight from DC Comics",
     detailedDescription: "Batman brings the iconic Dark Knight from DC Comics to Fortnite. This legendary skin features the classic black suit and cape, making it one of the most recognizable superhero skins.",
     releaseDate: "2019-09-20",
     lastSeenInShop: "2023-11-30",
     shopPrice: 2000,
     vbucksCost: 2000,
     isBattlePass: false,
     popularity: 96,
     usageRate: 17.3,
     rarityPercentage: 4,
     shopAppearances: 28,
     set: "Batman Set",
     series: "DC Series",
     collection: "DC Collection",
     backbling: "Batman Cape",
     pickaxe: "Batman Pickaxe",
     glider: "Batman Glider",
     emote: "Batman Dance",
     imageUrl: "/placeholder.svg?height=100&width=100&text=Batman",
     previewUrl: "/placeholder.svg?height=100&width=100&text=Batman",
     communityRating: 4.8,
     reviewCount: 22340,
     tags: ["batman", "dc", "superhero", "collaboration", "popular", "iconic"],
     collaboration: "DC",
     isExclusive: false,
     isLimited: true,
     isOG: false,
     isSweaty: true,
     lore: "The Dark Knight of Gotham City brings his detective skills and martial arts expertise to the Fortnite battlefield, representing justice and fear.",
     background: "Part of the massive DC collaboration event, Batman represents one of the most successful superhero crossovers in gaming history.",
     trivia: [
       "Batman was part of the massive DC collaboration",
       "The skin features authentic DC design elements",
       "This collaboration brought millions of new players to Fortnite"
     ],
     modelComplexity: "Very High",
     animationQuality: "Exceptional",
     hitboxSize: "Standard"
   },

   "deadpool": {
     id: "deadpool",
     name: "Deadpool",
     rarity: "Legendary",
     emoji: "🔴",
     season: "Marvel",
     description: "The Merc with a Mouth from Marvel",
     detailedDescription: "Deadpool brings the irreverent Merc with a Mouth from Marvel Comics to Fortnite. This legendary skin features the iconic red suit and fourth-wall-breaking humor.",
     releaseDate: "2020-02-20",
     lastSeenInShop: "2023-12-05",
     shopPrice: 2000,
     vbucksCost: 2000,
     isBattlePass: false,
     popularity: 93,
     usageRate: 15.8,
     rarityPercentage: 7,
     shopAppearances: 24,
     set: "Deadpool Set",
     series: "Marvel Series",
     collection: "Marvel Collection",
     backbling: "Deadpool Backpack",
     pickaxe: "Deadpool Pickaxe",
     glider: "Deadpool Glider",
     emote: "Deadpool Dance",
     imageUrl: "/placeholder.svg?height=100&width=100&text=Deadpool",
     previewUrl: "/placeholder.svg?height=100&width=100&text=Deadpool",
     communityRating: 4.7,
     reviewCount: 16780,
     tags: ["deadpool", "marvel", "superhero", "collaboration", "popular", "funny"],
     collaboration: "Marvel",
     isExclusive: false,
     isLimited: true,
     isOG: false,
     isSweaty: false,
     lore: "The Merc with a Mouth brings his irreverent humor and regenerative powers to the Fortnite battlefield, breaking the fourth wall with every move.",
     background: "Part of the Marvel collaboration event, Deadpool represents one of the most unique and humorous superhero crossovers.",
     trivia: [
       "Deadpool was part of the Marvel collaboration",
       "The skin features authentic Marvel design elements",
       "This character is known for breaking the fourth wall"
     ],
     modelComplexity: "High",
     animationQuality: "High",
     hitboxSize: "Standard"
   }
}

// Helper function to get enhanced skin info
export function getEnhancedSkinInfo(skinId: string): EnhancedSkinInfo | null {
  return enhancedFortniteSkins[skinId] || null
}

// Helper function to get all enhanced skins
export function getAllEnhancedSkins(): EnhancedSkinInfo[] {
  return Object.values(enhancedFortniteSkins)
}

// Helper function to search skins by various criteria
export function searchEnhancedSkins(criteria: {
  rarity?: string
  season?: string
  collaboration?: string
  tags?: string[]
  minPopularity?: number
  maxPrice?: number
}): EnhancedSkinInfo[] {
  return getAllEnhancedSkins().filter(skin => {
    if (criteria.rarity && skin.rarity !== criteria.rarity) return false
    if (criteria.season && skin.season !== criteria.season) return false
    if (criteria.collaboration && skin.collaboration !== criteria.collaboration) return false
    if (criteria.tags && !criteria.tags.some(tag => skin.tags.includes(tag))) return false
    if (criteria.minPopularity && skin.popularity < criteria.minPopularity) return false
    if (criteria.maxPrice && skin.shopPrice > criteria.maxPrice) return false
    return true
  })
}

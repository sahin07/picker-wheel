export type LoLChampion = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  popularity: "S-tier" | "A-tier" | "B-tier" | "C-tier" | "D-tier";
  proPlayPresence: "high" | "medium" | "low";
  communityFavorite: boolean;
  releaseYear: number;
  region: string;
  damageType: "physical" | "magical" | "mixed" | "true";
  playStyle:
    | "assassin"
    | "tank"
    | "mage"
    | "marksman"
    | "support"
    | "fighter"
    | "balanced";
  skinCount: number;
  esportsPresence: "high" | "medium" | "low";
  preview: string;
};

export type SpinResult = {
  champion: LoLChampion;
  timestamp: Date;
};

export type DisplayMode = "emoji-name" | "emoji" | "name";
export type ActionMode = "normal" | "elimination" | "manual";
export type RoleFilter = "all" | "top" | "jungle" | "mid" | "adc" | "support";

export type UserPreferences = {
  favoriteRoles: string[];
  preferredDifficulty: string;
  playStyle: string;
  favoriteRegions: string[];
};

export type AIMode = "chat" | "analysis" | "generator";

export type ChatMessage = {
  role: "user" | "ai";
  message: string;
  timestamp: Date;
};

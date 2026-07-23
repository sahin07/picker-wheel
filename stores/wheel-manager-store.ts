import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getStatesByCountry, State } from "@/data/states";
import { Country, getCountriesByRegion } from "@/data/countries";
import { mlbTeams } from "@/data/mlb-teams";
import { nbaTeams } from "@/data/nba-teams";
import {
  getAllFortniteSkins,
  getFortniteSkinCountsByRarity,
} from "@/data/fortnite-skins";
import { pokemonData } from "@/data/pokemon-data";
import { lolChampions } from "@/data/lol-champions";
import { jjkCharacters } from "@/data/jjk-characters";
import { demonSlayerCharacters } from "@/data/demon-slayer-characters";
import type { ActionMode, DisplayMode, JjkEntry, SpinResult } from "@/types/jjk-types";
import type {
  ActionMode as DemonSlayerActionMode,
  DisplayMode as DemonSlayerDisplayMode,
  DemonSlayerEntry,
  SpinResult as DemonSlayerSpinResult,
} from "@/types/demon-slayer-types";
import { ACHIEVEMENTS } from "@/lib/letter-picker-constants";
import { PICKER_WHEEL_ACHIEVEMENTS } from "@/lib/picker-wheel-achievements";
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes";

export interface PickerWheelData {
  options: Array<{
    id: string;
    name: string;
    image?: string;
    color?: string;
  }>;
  totalSpins: number;
  lastResult: any;
  recentResults: any[];
  // Analytics and achievements properties
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export interface WeightedWheelEntry {
  id: string;
  name: string;
  weight: number;
  color?: string;
  enabled?: boolean;
}

export interface WeightedWheelData {
  entries: WeightedWheelEntry[];
  viewMode: "wheel" | "list" | "text";
  actionMode?: "normal" | "elimination" | "manual";
  isSpinning: boolean;
  spinRotation: number;
  selectedResult: WeightedWheelEntry | null;
  totalSpins: number;
  currentRotation?: number;
  recentResults: any[];
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export interface PrizeWheelEntry {
  id: string;
  name: string;
  imageUrl?: string;
  color?: string;
  enabled?: boolean;
  winMessage?: string;
}

export interface PrizeWheelData {
  entries: PrizeWheelEntry[];
  viewMode: "wheel" | "list" | "text";
  actionMode?: "normal" | "elimination" | "manual";
  isSpinning: boolean;
  spinRotation: number;
  selectedResult: PrizeWheelEntry | null;
  totalSpins: number;
  currentRotation?: number;
  recentResults: any[];
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export type FortuneWheelEntryKind = "cash" | "prize" | "bankrupt" | "lose_turn" | "special";

export interface FortuneWheelEntry {
  id: string;
  name: string;
  imageUrl?: string;
  color?: string;
  enabled?: boolean;
  kind?: FortuneWheelEntryKind;
  winMessage?: string;
}

export interface FortuneWheelData {
  entries: FortuneWheelEntry[];
  viewMode: "wheel" | "list" | "text";
  actionMode?: "normal" | "elimination" | "manual";
  isSpinning: boolean;
  spinRotation: number;
  selectedResult: FortuneWheelEntry | null;
  totalSpins: number;
  currentRotation?: number;
  recentResults: any[];
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export interface StateWheelData {
  selectedCountry: string;
  selectedStates: State[];
  actionMode?: "normal" | "elimination" | "manual";
  displayMode: "flag" | "name" | "both";
  viewMode: "wheel" | "list" | "text";
  favoriteStates: State[];
  comparisonStates: State[];
  isSpinning: boolean;
  spinRotation: number;
  selectedResult: State | null;
  totalSpins: number;
  showStatistics: boolean;
  showComparison: boolean;
  showFavorites: boolean;
  currentRotation?: number;
  recentResults: any[];
  // Analytics and achievements properties
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export interface CountryWheelData {
  selectedRegion: string;
  selectedCountries: Country[];
  actionMode?: "normal" | "elimination" | "manual";
  displayMode: "flag" | "name" | "both";
  viewMode: "wheel" | "list" | "text";
  favoriteCountries: Country[];
  comparisonCountries: Country[];
  isSpinning: boolean;
  spinRotation: number;
  selectedResult: Country | null;
  totalSpins: number;
  showStatistics: boolean;
  showComparison: boolean;
  showFavorites: boolean;
  currentRotation?: number;
  recentResults: any[];
  // Analytics and achievements properties
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export interface MLBWheelData {
  selectedLeague: "all" | "American" | "National";
  selectedTeams: any[];
  displayMode: "logo" | "name" | "both";
  viewMode: "wheel" | "list" | "text";
  favoriteTeams: any[];
  comparisonTeams: any[];
  isSpinning: boolean;
  spinRotation: number;
  selectedResult: any | null;
  totalSpins: number;
  showStatistics: boolean;
  showComparison: boolean;
  showFavorites: boolean;
  currentRotation?: number;
  recentResults: any[];
  // Analytics and achievements properties
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export interface NBAWheelData {
  selectedConference: "all" | "Eastern" | "Western";
  selectedTeams: any[];
  actionMode?: "normal" | "elimination" | "manual";
  displayMode: "logo" | "name" | "both";
  viewMode: "wheel" | "list" | "text";
  favoriteTeams: any[];
  comparisonTeams: any[];
  isSpinning: boolean;
  spinRotation: number;
  selectedResult: any | null;
  totalSpins: number;
  showStatistics: boolean;
  showComparison: boolean;
  showFavorites: boolean;
  currentRotation?: number;
  recentResults: any[];
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export interface FortniteWheelData {
  selectedRarity:
    | "all"
    | "common"
    | "uncommon"
    | "rare"
    | "epic"
    | "legendary"
    | "mythic";
  selectedSkins: string[]; // Changed from any[] to string[] to match our usage
  skinOrder?: string[];
  customSkins?: any[];
  displayMode: "emoji-name" | "emoji" | "name";
  actionMode: "normal" | "elimination" | "manual";
  totalSpins: number;
  lastResult: any;
  recentResults: any[];
  isSpinning: boolean;
  rotation: number;
  showInputs: boolean;
  isFullscreen: boolean;
  showTitle: boolean;
  title: string;
  description: string;
  // Favorites and Comparison
  favoriteSkins: any[];
  comparisonSkins: any[];
  showFavorites: boolean;
  showComparison: boolean;
  // Settings
  spinSpeed: number[];
  spinDuration: number[];
  enableSound: boolean;
  enableConfetti: boolean;
  backgroundColor: string;
  // AI Features
  aiRecommendations: any[];
  skinStats: Record<string, number>;
  aiQuery: string;
  aiResponse: string;
  aiLoading: boolean;
  aiChatHistory: any[];
  aiMode: "chat" | "analysis" | "generator";
  userPreferences: {
    favoriteGenres: string[];
    preferredRarity: string;
    playStyle: string;
    favoriteCollabs: string[];
  };
  // Enhanced Analytics and Statistics
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
  // Enhanced Statistics
  statistics?: {
    totalSpins: number;
    uniqueSkinsSpun: number;
    mostSpunSkin?: string;
    mostSpunRarity?: string;
    averageSpinsPerSession: number;
    lastSpinDate?: string;
    firstSpinDate?: string;
    spinStreak: number;
    totalSpinTime: number;
    favoriteRarity?: string;
    skinCountByRarity: Record<string, number>;
    spinResultsByRarity: Record<string, number>;
  };
}

export interface ImageWheelData {
  wheelItems: Array<{
    id: string;
    text: string;
    enabled?: boolean;
    count?: number;
    imageUrl?: string;
    imageFile?: File;
  }>;
  totalSpins: number;
  lastResult: any;
  recentResults: any[];
  wheelRotation?: number;
  isSpinning?: boolean;
  wheelTitle?: string;
  wheelDescription?: string;
  wheelSettings?: any;
  // Analytics and achievements properties
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
}

export interface DateWheelData {
  singleDates: Array<{
    id: string;
    date: Date;
    formatted: string;
  }>;
  dateRanges: Array<{
    id: string;
    from: Date;
    to: Date;
    label: string;
    dates: Array<{
      id: string;
      date: Date;
      formatted: string;
    }>;
  }>;
  allDates: Array<{
    id: string;
    date: Date;
    formatted: string;
  }>;
  selectedDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  dateFormat: string;
  wheelTitle: string;
  wheelDescription: string;
  resultTitle: string;
  totalSpins: number;
  lastResult: any;
  recentResults: any[];
  spinHistory: Array<{
    date: string;
    timestamp: Date;
    eliminated: boolean;
    wheelName: string;
  }>;
  currentResult: string | null;
  // Analytics and achievements properties
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
}

export interface LetterWheelData {
  letterOption: string;
  styleOption: string;
  customLetters: string;
  spinMode: string;
  currentLetters: string[];
  results: Array<{
    letter: string;
    timestamp: Date;
    mode: string;
    challengeCompleted?: boolean;
    wordsFound?: string[];
  }>;
  streak: number;
  score: number;
  spunLetters: string[];
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    maxProgress: number;
    unlocked: boolean;
  }>;
  wheelTitle: string;
  wheelDescription: string;
  totalSpins: number;
  lastResult: any;
  recentResults: any[];
}

export interface PokemonWheelData {
  selectedGeneration:
    | "all"
    | "gen1"
    | "gen2"
    | "gen3"
    | "gen4"
    | "gen5"
    | "gen6"
    | "gen7"
    | "gen8";
  selectedPokemon: string[];
  displayMode: "emoji-name" | "emoji" | "name";
  actionMode: "normal" | "elimination" | "manual";
  totalSpins: number;
  lastResult: any;
  recentResults: any[];
  isSpinning: boolean;
  rotation: number;
  showInputs: boolean;
  isFullscreen: boolean;
  showTitle: boolean;
  title: string;
  description: string;
  // Favorites and Comparison
  favoritePokemon: any[];
  comparisonPokemon: any[];
  showFavorites: boolean;
  showComparison: boolean;
  // Settings
  spinSpeed: number[];
  spinDuration: number[];
  enableSound: boolean;
  enableConfetti: boolean;
  backgroundColor: string;
  // AI Features
  aiRecommendations: any[];
  pokemonStats: Record<string, number>;
  aiQuery: string;
  aiResponse: string;
  aiLoading: boolean;
  aiChatHistory: any[];
  aiMode: "chat" | "analysis" | "generator";
  userPreferences: {
    favoriteTypes: string[];
    preferredGeneration: string;
    playStyle: string;
    favoriteRegions: string[];
  };
  // Enhanced Analytics and Statistics
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
  // Enhanced Statistics
  statistics?: {
    totalSpins: number;
    uniquePokemonSpun: number;
    mostSpunPokemon?: string;
    mostSpunType?: string;
    averageSpinsPerSession: number;
    lastSpinDate?: string;
    firstSpinDate?: string;
    spinStreak: number;
    totalSpinTime: number;
    favoriteType?: string;
    pokemonCountByType: Record<string, number>;
    spinResultsByType: Record<string, number>;
  };
}

export interface LoLWheelData {
  selectedRole: "all" | "top" | "jungle" | "mid" | "adc" | "support";
  selectedChampions: string[];
  championOrder: string[];
  displayMode: "emoji-name" | "emoji" | "name";
  actionMode: "normal" | "elimination" | "manual";
  totalSpins: number;
  lastResult: any;
  recentResults: any[];
  isSpinning: boolean;
  rotation: number;
  showInputs: boolean;
  isFullscreen: boolean;
  showTitle: boolean;
  title: string;
  description: string;
  // Favorites and Comparison
  favoriteChampions: any[];
  comparisonChampions: any[];
  showFavorites: boolean;
  showComparison: boolean;
  // Settings
  spinSpeed: number[];
  spinDuration: number[];
  enableSound: boolean;
  enableConfetti: boolean;
  backgroundColor: string;
  // AI Features
  aiRecommendations: any[];
  championStats: Record<string, number>;
  aiQuery: string;
  aiResponse: string;
  aiLoading: boolean;
  aiChatHistory: any[];
  aiMode: "chat" | "analysis" | "generator";
  userPreferences: {
    favoriteRoles: string[];
    preferredRole: string;
    playStyle: string;
    favoriteRegions: string[];
  };
  // Custom Champions
  customChampions: any[];
  // Enhanced Analytics and Statistics
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
  // Enhanced Statistics
  statistics?: {
    totalSpins: number;
    uniqueChampionsSpun: number;
    mostSpunChampion?: string;
    mostSpunRole?: string;
    averageSpinsPerSession: number;
    lastSpinDate?: string;
    firstSpinDate?: string;
    spinStreak: number;
    totalSpinTime: number;
    favoriteRole?: string;
    championCountByRole: Record<string, number>;
    spinResultsByRole: Record<string, number>;
  };
}

export interface JjkWheelData {
  selectedCharacters: string[];
  characterOrder: string[];
  customCharacters: JjkEntry[];
  displayMode: DisplayMode;
  actionMode: ActionMode;
  isSpinning: boolean;
  selectedResult: SpinResult | null;
  totalSpins: number;
  recentResults: JjkEntry[];
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
  viewMode?: "wheel" | "list";
  rotation?: number;
  paletteColors?: string[];
  showTitle?: boolean;
  favoriteCharacters?: JjkEntry[];
  comparisonCharacters?: JjkEntry[];
}

export interface DemonSlayerWheelData {
  selectedCharacters: string[];
  characterOrder: string[];
  customCharacters: DemonSlayerEntry[];
  displayMode: DemonSlayerDisplayMode;
  actionMode: DemonSlayerActionMode;
  isSpinning: boolean;
  selectedResult: DemonSlayerSpinResult | null;
  totalSpins: number;
  recentResults: DemonSlayerEntry[];
  achievements?: any[];
  themes?: any[];
  currentTheme?: string;
  spinHistory?: any[];
  viewMode?: "wheel" | "list";
  rotation?: number;
  paletteColors?: string[];
  showTitle?: boolean;
  favoriteCharacters?: DemonSlayerEntry[];
  comparisonCharacters?: DemonSlayerEntry[];
}

export interface YesNoWheelData {
  activeTab: string;
  mode: "yes-no" | "yes-no-maybe";
  inputSets: number;
  userQuestion: string;
  aiAdvice: string;
  showStats: boolean;
  confettiEnabled: boolean;
  soundEnabled: boolean;
  wheelTheme: string;
  results: { yes: number; no: number; maybe: number };
  lastResult: string | null;
  totalSpins: number;
  streak: { type: string; count: number };
  achievements: string[];
  aiContext: string;
  isSpinning: boolean;
  rotation: number;
  wheelShake: boolean;
  showParticles: boolean;
  showConfetti: boolean;
  recentResults: any[];
}

export interface ColorWheelData {
  activeTab: string;
  inputMethod: "color-wheel" | "manual" | "image";
  colorCombination: string;
  spinningPointerMode: "manual" | "random";
  selectedColor: string;
  customColors: Array<{
    id: string;
    color: string;
    name: string;
    enabled: boolean;
  }>;
  showStats: boolean;
  confettiEnabled: boolean;
  soundEnabled: boolean;
  wheelTheme: string;
  results: Array<{
    color: string;
    name: string;
    hex: string;
    rgb: string;
    timestamp: Date;
  }>;
  lastResult: {
    color: string;
    name: string;
    hex: string;
    rgb: string;
  } | null;
  totalSpins: number;
  resultShowMode: {
    color: boolean;
    text: boolean;
    hex: boolean;
    rgb: boolean;
  };
  isSpinning: boolean;
  rotation: number;
  wheelShake: boolean;
  showParticles: boolean;
  showConfetti: boolean;
  wheelTitle: string;
  wheelDescription: string;
  recentResults: any[];
}

export interface WheelInstance {
  id: string;
  name: string;
  toolType: string;
  data:
    | PickerWheelData
    | WeightedWheelData
    | PrizeWheelData
    | FortuneWheelData
    | StateWheelData
    | CountryWheelData
    | MLBWheelData
    | NBAWheelData
    | FortniteWheelData
    | PokemonWheelData
    | LoLWheelData
    | JjkWheelData
    | DemonSlayerWheelData
    | ImageWheelData
    | DateWheelData
    | LetterWheelData
    | YesNoWheelData
    | ColorWheelData;
  createdAt: string;
  updatedAt: string;
}

interface WheelManagerStore {
  // Current tool and wheel
  currentTool: string;
  currentWheelId: string | null;
  isFirstVisit: boolean;

  // All wheels organized by tool type
  wheelsByTool: Record<string, WheelInstance[]>;

  /** Last selected wheel id per tool — restores progress when switching tools */
  lastWheelIdByTool: Record<string, string>;

  /** Favorite tool types (e.g. "letter-picker-wheel") for quick access */
  favoriteTools: string[];

  // Global spin history for all wheels
  globalSpinHistory: Array<{
    date: string;
    timestamp: Date;
    eliminated: boolean;
    wheelName: string;
    toolType: string;
  }>;

  // Actions
  setCurrentTool: (toolType: string) => void;
  setCurrentWheel: (wheelId: string) => void;
  toggleFavoriteTool: (toolType: string) => void;
  isFavoriteTool: (toolType: string) => boolean;
  createNewWheel: (
    toolType: string,
    name?: string,
    id?: string,
    createdAt?: string,
    updatedAt?: string
  ) => string;
  deleteWheel: (toolType: string, wheelId: string) => void;
  updateWheelName: (toolType: string, wheelId: string, name: string) => void;
  updateWheelData: (toolType: string, wheelId: string, data: any) => void;
  getCurrentWheel: () => WheelInstance | null;
  getWheelsForCurrentTool: () => WheelInstance[];
  setFirstVisitComplete: () => void;
  addToGlobalSpinHistory: (result: {
    date: string;
    timestamp: Date;
    eliminated: boolean;
    wheelName: string;
    toolType: string;
  }) => void;
  clearGlobalSpinHistory: () => void;

  // Database operations
  saveToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
}

export const useWheelManagerStore = create<WheelManagerStore>()(
  persist(
    (set, get) => ({
      currentTool: "picker-wheel",
      currentWheelId: null,
      isFirstVisit: true,
      wheelsByTool: {},
      lastWheelIdByTool: {},
      favoriteTools: [],
      globalSpinHistory: [],

      setCurrentTool: (toolType) => {
        const state = get();
        const wheels = state.wheelsByTool[toolType] || [];

        // Prefer keeping the current wheel if it already belongs to this tool
        // (e.g. React remount). Otherwise restore the last wheel left on this tool.
        const currentBelongs =
          !!state.currentWheelId &&
          wheels.some((wheel) => wheel.id === state.currentWheelId);
        const rememberedId = state.lastWheelIdByTool[toolType];
        const rememberedBelongs =
          !!rememberedId && wheels.some((wheel) => wheel.id === rememberedId);

        if (wheels.length === 0) {
          const newWheelId = get().createNewWheel(toolType, "Wheel 1");
          set({
            currentTool: toolType,
            currentWheelId: newWheelId,
            lastWheelIdByTool: {
              ...get().lastWheelIdByTool,
              [toolType]: newWheelId,
            },
          });
          return;
        }

        const nextWheelId = currentBelongs
          ? state.currentWheelId!
          : rememberedBelongs
            ? rememberedId!
            : wheels[0].id;

        set({
          currentTool: toolType,
          currentWheelId: nextWheelId,
          lastWheelIdByTool: {
            ...state.lastWheelIdByTool,
            [toolType]: nextWheelId,
          },
        });
      },

      setCurrentWheel: (wheelId) => {
        const toolType = get().currentTool;
        set((state) => ({
          currentWheelId: wheelId,
          lastWheelIdByTool: {
            ...state.lastWheelIdByTool,
            [toolType]: wheelId,
          },
        }));
      },

      toggleFavoriteTool: (toolType) => {
        set((state) => {
          const exists = state.favoriteTools.includes(toolType);
          return {
            favoriteTools: exists
              ? state.favoriteTools.filter((t) => t !== toolType)
              : [...state.favoriteTools, toolType],
          };
        });
      },

      isFavoriteTool: (toolType) => get().favoriteTools.includes(toolType),

      createNewWheel: (toolType, name, id, createdAt, updatedAt) => {
        const state = get();
        const existingWheels = state.wheelsByTool[toolType] || [];
        const wheelNumber = existingWheels.length + 1;
        const wheelName = name || `Wheel ${wheelNumber}`;

        let data:
          | PickerWheelData
          | WeightedWheelData
          | PrizeWheelData
          | FortuneWheelData
          | StateWheelData
          | CountryWheelData
          | ImageWheelData
          | DateWheelData
          | LetterWheelData
          | YesNoWheelData
          | ColorWheelData
          | FortniteWheelData
          | PokemonWheelData
          | LoLWheelData
          | JjkWheelData
          | DemonSlayerWheelData
          | MLBWheelData
          | NBAWheelData;
        if (toolType === "fortune-wheel") {
          data = {
            entries: [
              { id: "fortune-1", name: "Yes", color: "#7c3aed", enabled: true },
              { id: "fortune-2", name: "Try Again", color: "#2563eb", enabled: true },
              { id: "fortune-3", name: "New Idea", color: "#0891b2", enabled: true },
              { id: "fortune-4", name: "Ask a Friend", color: "#16a34a", enabled: true },
              { id: "fortune-5", name: "Surprise", color: "#ca8a04", enabled: true },
              { id: "fortune-6", name: "Skip", color: "#ea580c", enabled: true },
              { id: "fortune-7", name: "Go For It", color: "#e11d48", enabled: true },
              { id: "fortune-8", name: "Mystery Pick", color: "#9333ea", enabled: true },
            ],
            viewMode: "wheel",
            actionMode: "normal",
            isSpinning: false,
            spinRotation: 0,
            selectedResult: null,
            totalSpins: 0,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
          };
        } else if (toolType === "prize-wheel") {
          data = {
            entries: [
              { id: "prize-1", name: "Grand Prize", color: "#eab308", enabled: true, winMessage: "Congratulations!" },
              { id: "prize-2", name: "Free Stickers", color: "#22c55e", enabled: true },
              { id: "prize-3", name: "Extra Spin", color: "#3b82f6", enabled: true },
              { id: "prize-4", name: "Mystery Gift", color: "#a855f7", enabled: true },
            ],
            viewMode: "wheel",
            actionMode: "normal",
            isSpinning: false,
            spinRotation: 0,
            selectedResult: null,
            totalSpins: 0,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
          };
        } else if (toolType === "weighted-wheel") {
          data = {
            entries: [
              { id: "opt-1", name: "Option A", weight: 1, color: "#22c55e", enabled: true },
              { id: "opt-2", name: "Option B", weight: 1, color: "#3b82f6", enabled: true },
              { id: "opt-3", name: "Option C", weight: 1, color: "#eab308", enabled: true },
            ],
            viewMode: "wheel",
            actionMode: "normal",
            isSpinning: false,
            spinRotation: 0,
            selectedResult: null,
            totalSpins: 0,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
          };
        } else if (toolType === "state-wheel") {
          data = {
            selectedCountry: "US",
            selectedStates: getStatesByCountry("US").slice(),
            displayMode: "name",
            viewMode: "wheel",
            favoriteStates: [],
            comparisonStates: [],
            isSpinning: false,
            spinRotation: 0,
            selectedResult: null,
            totalSpins: 0,
            showStatistics: false,
            showComparison: false,
            showFavorites: false,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS, // Initialize with default achievements
            themes: PICKER_WHEEL_THEMES, // Initialize with default themes
            currentTheme: "classic",
            spinHistory: [],
          };
        } else if (toolType === "country-wheel") {
          data = {
            selectedRegion: "all",
            selectedCountries: getCountriesByRegion("all"),
            displayMode: "name",
            viewMode: "wheel",
            favoriteCountries: [],
            comparisonCountries: [],
            isSpinning: false,
            spinRotation: 0,
            selectedResult: null,
            totalSpins: 0,
            showStatistics: false,
            showComparison: false,
            showFavorites: false,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS, // Initialize with default achievements
            themes: PICKER_WHEEL_THEMES, // Initialize with default themes
            currentTheme: "classic",
            spinHistory: [],
          };
        } else if (toolType === "image-picker-wheel") {
          data = {
            wheelItems: [],
            totalSpins: 0,
            lastResult: null,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS, // Initialize with default achievements
            themes: PICKER_WHEEL_THEMES, // Initialize with default themes
            currentTheme: "classic",
            spinHistory: [],
          };
        } else if (toolType === "date-picker-wheel") {
          data = {
            singleDates: [],
            dateRanges: [],
            allDates: [],
            selectedDays: {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            },
            dateFormat: "30/10/2022",
            wheelTitle: "",
            wheelDescription: "",
            resultTitle: "",
            totalSpins: 0,
            lastResult: null,
            recentResults: [],
            spinHistory: [],
            currentResult: null,
            achievements: PICKER_WHEEL_ACHIEVEMENTS, // Initialize with default achievements
            themes: PICKER_WHEEL_THEMES, // Initialize with default themes
            currentTheme: "classic",
          };
        } else if (toolType === "letter-picker-wheel") {
          // Default alphabet letters A-Z with weights/colors
          const defaultLetters = Array.from({ length: 26 }, (_, i) =>
            String.fromCharCode(65 + i)
          );
          const letterColors = [
            "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
            "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6",
            "#a855f7", "#d946ef", "#ec4899", "#f43f5e",
          ];
          const letterSlices = defaultLetters.map((text, i) => ({
            id: `letter-default-${text}`,
            text,
            weight: 1,
            enabled: true,
            color: letterColors[i % letterColors.length],
          }));
          data = {
            letterOption: "alphabet",
            styleOption: "uppercase",
            customLetters: "",
            spinMode: "normal",
            currentLetters: defaultLetters,
            letterSlices,
            spinDurationMs: 5000,
            results: [],
            streak: 0,
            score: 0,
            spunLetters: [],
            achievements: [...ACHIEVEMENTS],
            wheelTitle: "Random Letter Picker",
            wheelDescription:
              "Generate random letters instantly for word games, Scrabble practice, classroom activities, and creative writing.",
            totalSpins: 0,
            lastResult: null,
            recentResults: [],
          };
        } else if (toolType === "yes-no-picker-wheel") {
          data = {
            activeTab: "manual",
            mode: "yes-no" as const,
            inputSets: 1,
            userQuestion: "",
            aiAdvice: "",
            showStats: false,
            confettiEnabled: true,
            soundEnabled: true,
            wheelTheme: "classic",
            results: { yes: 0, no: 0, maybe: 0 },
            lastResult: null,
            totalSpins: 0,
            streak: { type: "", count: 0 },
            achievements: PICKER_WHEEL_ACHIEVEMENTS, // Initialize with default achievements
            themes: PICKER_WHEEL_THEMES, // Initialize with default themes
            currentTheme: "classic",
            aiContext: "",
            isSpinning: false,
            rotation: 0,
            wheelShake: false,
            showParticles: false,
            showConfetti: false,
            recentResults: [],
            wheelTitle: "Yes or No Picker Wheel",
            wheelDescription: "Make decisions with a simple spin of the wheel",
          };
        } else if (toolType === "color-picker-wheel") {
          data = {
            activeTab: "color-wheel",
            inputMethod: "color-wheel" as const,
            colorCombination: "complementary",
            spinningPointerMode: "random" as const,
            selectedColor: "#FF0000",
            customColors: [],
            showStats: false,
            confettiEnabled: true,
            soundEnabled: true,
            wheelTheme: "classic",
            results: [],
            lastResult: null,
            totalSpins: 0,
            resultShowMode: {
              color: true,
              text: true,
              hex: true,
              rgb: true,
            },
            isSpinning: false,
            rotation: 0,
            wheelShake: false,
            showParticles: false,
            showConfetti: false,
            wheelTitle: "Color Picker Wheel",
            wheelDescription: "Pick a random color by wheel",
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS, // Initialize with default achievements
            themes: PICKER_WHEEL_THEMES, // Initialize with default themes
            currentTheme: "classic",
            spinHistory: [],
          };
        } else if (toolType === "mlb-wheel") {
          data = {
            selectedLeague: "all",
            selectedTeams: mlbTeams, // Initialize with all MLB teams
            displayMode: "name",
            viewMode: "wheel",
            favoriteTeams: [],
            comparisonTeams: [],
            isSpinning: false,
            spinRotation: 0,
            selectedResult: null,
            totalSpins: 0,
            showStatistics: false,
            showComparison: false,
            showFavorites: false,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS, // Initialize with default achievements
            themes: PICKER_WHEEL_THEMES, // Initialize with default themes
            currentTheme: "classic",
            spinHistory: [],
          };
        } else if (toolType === "nba-wheel") {
          data = {
            selectedConference: "all",
            selectedTeams: nbaTeams,
            actionMode: "normal",
            displayMode: "name",
            viewMode: "wheel",
            favoriteTeams: [],
            comparisonTeams: [],
            isSpinning: false,
            spinRotation: 0,
            selectedResult: null,
            totalSpins: 0,
            showStatistics: false,
            showComparison: false,
            showFavorites: false,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
          } as NBAWheelData;
        } else if (toolType === "fortnite-wheel") {
          const allSkins = getAllFortniteSkins();
          const allSkinIds = allSkins.map((skin) => skin.id);
          const stats: Record<string, number> = {
            ...getFortniteSkinCountsByRarity(),
          };

          data = {
            selectedRarity: "all",
            selectedSkins: allSkinIds,
            displayMode: "emoji-name",
            actionMode: "normal",
            totalSpins: 0,
            lastResult: null,
            recentResults: [],
            isSpinning: false,
            rotation: 0,
            showInputs: true,
            isFullscreen: false,
            showTitle: false,
            title: "Fortnite Skins Picker Wheel",
            description: "Pick a random Fortnite skin by wheel",
            // Favorites and Comparison
            favoriteSkins: [],
            comparisonSkins: [],
            showFavorites: false,
            showComparison: false,
            // Settings
            spinSpeed: [5],
            spinDuration: [3],
            enableSound: true,
            enableConfetti: true,
            backgroundColor: "#ffffff",
            // AI Features
            aiRecommendations: allSkins
              .filter(
                (skin) =>
                  skin.season.includes("Marvel") ||
                  skin.season.includes("DC") ||
                  skin.season.includes("Star Wars") ||
                  skin.rarity === "Legendary" ||
                  skin.rarity === "Mythic"
              )
              .slice(0, 6)
              .map((skin) => skin.id),
            skinStats: stats,
            aiQuery: "",
            aiResponse: "",
            aiLoading: false,
            aiChatHistory: [],
            aiMode: "chat",
            userPreferences: {
              favoriteGenres: [],
              preferredRarity: "all",
              playStyle: "casual",
              favoriteCollabs: [],
            },
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
            statistics: {
              totalSpins: 0,
              uniqueSkinsSpun: 0,
              mostSpunSkin: undefined,
              mostSpunRarity: undefined,
              averageSpinsPerSession: 0,
              lastSpinDate: undefined,
              firstSpinDate: undefined,
              spinStreak: 0,
              totalSpinTime: 0,
              favoriteRarity: undefined,
              skinCountByRarity: {},
              spinResultsByRarity: {},
            },
          } as FortniteWheelData;
        } else if (toolType === "pokemon-wheel") {
          const allPokemon = Object.values(pokemonData).flat();
          const allPokemonIds = allPokemon.map((pokemon) => pokemon.id);
          const stats: Record<string, number> = {};
          Object.keys(pokemonData).forEach((generation) => {
            stats[generation] =
              pokemonData[generation as keyof typeof pokemonData].length;
          });

          data = {
            selectedGeneration: "all",
            selectedPokemon: allPokemonIds,
            displayMode: "emoji-name",
            actionMode: "normal",
            totalSpins: 0,
            lastResult: null,
            recentResults: [],
            isSpinning: false,
            rotation: 0,
            showInputs: true,
            isFullscreen: false,
            showTitle: false,
            title: "Pokemon Picker Wheel",
            description:
              "Pick a random Pokemon by wheel - Gotta catch 'em all!",
            // Favorites and Comparison
            favoritePokemon: [],
            comparisonPokemon: [],
            showFavorites: false,
            showComparison: false,
            // Settings
            spinSpeed: [5],
            spinDuration: [3],
            enableSound: true,
            enableConfetti: true,
            backgroundColor: "#ffffff",
            // AI Features
            aiRecommendations: allPokemon
              .filter(
                (pokemon) =>
                  pokemon.isLegendary ||
                  pokemon.isStarter ||
                  pokemon.popularity === "high"
              )
              .slice(0, 6)
              .map((pokemon) => pokemon.id),
            pokemonStats: stats,
            aiQuery: "",
            aiResponse: "",
            aiLoading: false,
            aiChatHistory: [],
            aiMode: "chat",
            userPreferences: {
              favoriteTypes: [],
              preferredGeneration: "all",
              playStyle: "casual",
              favoriteRegions: [],
            },
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
            statistics: {
              totalSpins: 0,
              uniquePokemonSpun: 0,
              mostSpunPokemon: undefined,
              mostSpunType: undefined,
              averageSpinsPerSession: 0,
              lastSpinDate: undefined,
              firstSpinDate: undefined,
              spinStreak: 0,
              totalSpinTime: 0,
              favoriteType: undefined,
              pokemonCountByType: {},
              spinResultsByType: {},
            },
          } as PokemonWheelData;
        } else if (toolType === "lol-wheel") {
          const allChampions = Object.values(lolChampions).flat();
          const allChampionIds = allChampions.map((champion) => champion.id);
          const stats: Record<string, number> = {};
          Object.keys(lolChampions).forEach((role) => {
            stats[role] =
              lolChampions[role as keyof typeof lolChampions].length;
          });

          data = {
            selectedRole: "all",
            selectedChampions: allChampionIds,
            championOrder: allChampionIds,
            displayMode: "emoji-name",
            actionMode: "normal",
            totalSpins: 0,
            lastResult: null,
            recentResults: [],
            isSpinning: false,
            rotation: 0,
            showInputs: true,
            isFullscreen: false,
            showTitle: false,
            title: "LoL Wheel",
            description: "Pick a random League of Legends champion by wheel",
            // Favorites and Comparison
            favoriteChampions: [],
            comparisonChampions: [],
            showFavorites: false,
            showComparison: false,
            // Settings
            spinSpeed: [5],
            spinDuration: [3],
            enableSound: true,
            enableConfetti: true,
            backgroundColor: "#ffffff",
            // AI Features
            aiRecommendations: allChampions
              .filter(
                (champion) =>
                  champion.popularity === "high" ||
                  champion.isProPlay ||
                  champion.role === "adc" ||
                  champion.role === "mid"
              )
              .slice(0, 6)
              .map((champion) => champion.id),
            championStats: stats,
            aiQuery: "",
            aiResponse: "",
            aiLoading: false,
            aiChatHistory: [],
            aiMode: "chat",
            userPreferences: {
              favoriteRoles: [],
              preferredRole: "all",
              playStyle: "casual",
              favoriteRegions: [],
            },
            // Custom Champions
            customChampions: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
            statistics: {
              totalSpins: 0,
              uniqueChampionsSpun: 0,
              mostSpunChampion: undefined,
              mostSpunRole: undefined,
              averageSpinsPerSession: 0,
              lastSpinDate: undefined,
              firstSpinDate: undefined,
              spinStreak: 0,
              totalSpinTime: 0,
              favoriteRole: undefined,
              championCountByRole: {},
              spinResultsByRole: {},
            },
          } as LoLWheelData;
        } else if (toolType === "jjk-wheel") {
          const characterIds = jjkCharacters.map((character) => character.id);
          data = {
            selectedCharacters: characterIds,
            characterOrder: characterIds,
            customCharacters: [],
            displayMode: "emoji-name",
            actionMode: "normal",
            isSpinning: false,
            selectedResult: null,
            totalSpins: 0,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
            viewMode: "wheel",
            rotation: 0,
            showTitle: true,
            favoriteCharacters: [],
            comparisonCharacters: [],
          } as JjkWheelData;
        } else if (toolType === "demon-slayer-wheel") {
          const characterIds = demonSlayerCharacters.map((character) => character.id);
          data = {
            selectedCharacters: characterIds,
            characterOrder: characterIds,
            customCharacters: [],
            displayMode: "emoji-name",
            actionMode: "normal",
            isSpinning: false,
            selectedResult: null,
            totalSpins: 0,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
            viewMode: "wheel",
            rotation: 0,
            showTitle: true,
            favoriteCharacters: [],
            comparisonCharacters: [],
          } as DemonSlayerWheelData;
        } else if (toolType === "number-picker-wheel") {
          data = {
            resultMode: "random-number",
            inputMethod: "range",
            actionMode: "normal",
            minValue: 1,
            maxValue: 10,
            interval: 1,
            excludeNumbers: "",
            formula: "",
            numDigits: 4,
            numbers: Array.from({ length: 10 }, (_, i) => ({ value: i + 1, weight: 1 })),
            results: [],
            currentResult: null,
            showTitle: false,
            toolTitle: "Number Picker Wheel",
            toolDescription: "Pick a random number by spinning the wheel",
            resultTitle: "Your Lucky Number",
            activeUseCaseId: null,
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
          } as any;
        } else if (toolType === "team-picker") {
          data = {
            participants: [],
            teams: [],
            distributionMode: "default",
            numberOfGroups: 2,
            maxPeoplePerGroup: 1,
            pickRepresentatives: true,
            customTeamNames: [],
            toolTitle: "Team Picker Wheel",
            toolDescription: "Randomize people into groups",
            resultTitle: "RESULT",
            pickQuantity: undefined,
            showGenderInResult: true,
            showLabelInResult: true,
            presetGroups: [],
            viewMode: "input",
            actionMode: "normal",
            eliminatedTeams: [],
            selectedTeam: null,
            achievements: PICKER_WHEEL_ACHIEVEMENTS,
            themes: PICKER_WHEEL_THEMES,
            currentTheme: "classic",
            spinHistory: [],
          } as any;
        } else {
          // Default for picker-wheel (random name picker)
          data = {
            options: [
              { id: "1", name: "Option 1", color: "#4ade80" },
              { id: "2", name: "Option 2", color: "#fbbf24" },
              { id: "3", name: "Option 3", color: "#f97316" },
              { id: "4", name: "Option 4", color: "#84cc16" },
              { id: "5", name: "Option 5", color: "#eab308" },
              { id: "6", name: "Option 6", color: "#22c55e" },
            ],
            totalSpins: 0,
            lastResult: null,
            recentResults: [],
            achievements: PICKER_WHEEL_ACHIEVEMENTS, // Initialize with default achievements
            themes: PICKER_WHEEL_THEMES, // Initialize with default themes
            currentTheme: "classic",
            spinHistory: [],
          };
        }

        const newWheel: WheelInstance = {
          id:
            id ||
            `${toolType}-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
          name: wheelName,
          toolType,
          data,
          createdAt: createdAt || new Date().toISOString(),
          updatedAt: updatedAt || new Date().toISOString(),
        };

        console.log("Creating new wheel:", newWheel);

        set((state) => {
          const updatedWheels = [
            ...(state.wheelsByTool[toolType] || []),
            newWheel,
          ];
          console.log("Updated wheels for", toolType, ":", updatedWheels);

          const newState: Partial<WheelManagerStore> = {
            wheelsByTool: {
              ...state.wheelsByTool,
              [toolType]: updatedWheels,
            },
          };

          // Set current wheel ID if this is the first wheel for this tool type
          if (updatedWheels.length === 1) {
            newState.currentWheelId = newWheel.id;
            newState.lastWheelIdByTool = {
              ...state.lastWheelIdByTool,
              [toolType]: newWheel.id,
            };
            console.log("Setting current wheel ID to:", newWheel.id);
          }

          return newState;
        });

        return newWheel.id;
      },

      deleteWheel: (toolType, wheelId) => {
        const state = get();
        const wheels = state.wheelsByTool[toolType] || [];
        const updatedWheels = wheels.filter((wheel) => wheel.id !== wheelId);
        const nextId =
          state.currentWheelId === wheelId
            ? updatedWheels.length > 0
              ? updatedWheels[0].id
              : null
            : state.currentWheelId;

        set((state) => {
          const lastWheelIdByTool = { ...state.lastWheelIdByTool };
          if (lastWheelIdByTool[toolType] === wheelId) {
            if (nextId) lastWheelIdByTool[toolType] = nextId;
            else delete lastWheelIdByTool[toolType];
          }
          return {
            wheelsByTool: {
              ...state.wheelsByTool,
              [toolType]: updatedWheels,
            },
            currentWheelId: nextId,
            lastWheelIdByTool,
          };
        });

        // If no wheels left, create a new one
        if (updatedWheels.length === 0) {
          const newWheelId = get().createNewWheel(toolType, "Wheel 1");
          set((state) => ({
            currentWheelId: newWheelId,
            lastWheelIdByTool: {
              ...state.lastWheelIdByTool,
              [toolType]: newWheelId,
            },
          }));
        }
      },

      updateWheelName: (toolType, wheelId, name) => {
        set((state) => ({
          wheelsByTool: {
            ...state.wheelsByTool,
            [toolType]: (state.wheelsByTool[toolType] || []).map((wheel) =>
              wheel.id === wheelId
                ? { ...wheel, name, updatedAt: new Date().toISOString() }
                : wheel
            ),
          },
        }));
      },

      updateWheelData: (toolType, wheelId, data) => {
        set((state) => {
          const currentWheels = state.wheelsByTool[toolType] || [];
          const updatedWheels = currentWheels.map((wheel) => {
            if (wheel.id === wheelId) {
              const prevResults = (wheel.data as any).recentResults || [];
              const newWheel = {
                ...wheel,
                data: {
                  ...wheel.data,
                  ...data,
                  recentResults:
                    data.recentResults !== undefined
                      ? data.recentResults
                      : prevResults,
                },
                updatedAt: new Date().toISOString(),
              };
              return newWheel;
            }
            return wheel;
          });

          return {
            wheelsByTool: {
              ...state.wheelsByTool,
              [toolType]: updatedWheels,
            },
          };
        });
      },

      getCurrentWheel: () => {
        const state = get();
        if (!state.currentWheelId) return null;

        const wheels = state.wheelsByTool[state.currentTool] || [];
        const found =
          wheels.find((wheel) => wheel.id === state.currentWheelId) || null;
        return found;
      },

      getWheelsForCurrentTool: () => {
        const state = get();
        return state.wheelsByTool[state.currentTool] || [];
      },

      setFirstVisitComplete: () => {
        set({ isFirstVisit: false });
      },

      addToGlobalSpinHistory: (result) => {
        set((state) => ({
          globalSpinHistory: [result, ...state.globalSpinHistory].slice(0, 100), // Keep last 100 results
        }));
      },

      clearGlobalSpinHistory: () => {
        set((state) => {
          // Clear global history
          const newState = { globalSpinHistory: [] };

          // Also clear individual wheel spin history data
          const updatedWheelsByTool = { ...state.wheelsByTool };

          // Clear spin history for all wheel types that have it
          Object.keys(updatedWheelsByTool).forEach((toolType) => {
            updatedWheelsByTool[toolType] = updatedWheelsByTool[toolType].map(
              (wheel) => {
                if (toolType === "date-picker-wheel" && wheel.data) {
                  return {
                    ...wheel,
                    data: {
                      ...wheel.data,
                      spinHistory: [],
                      totalSpins: 0,
                      lastResult: null,
                      recentResults: [],
                      currentResult: null,
                    },
                  };
                } else if (toolType === "picker-wheel" && wheel.data) {
                  return {
                    ...wheel,
                    data: {
                      ...wheel.data,
                      totalSpins: 0,
                      lastResult: null,
                      recentResults: [],
                    },
                  };
                } else if (toolType === "image-picker-wheel" && wheel.data) {
                  return {
                    ...wheel,
                    data: {
                      ...wheel.data,
                      totalSpins: 0,
                      lastResult: null,
                      recentResults: [],
                    },
                  };
                } else if (toolType === "letter-picker-wheel" && wheel.data) {
                  return {
                    ...wheel,
                    data: {
                      ...wheel.data,
                      totalSpins: 0,
                      lastResult: null,
                      recentResults: [],
                      results: [],
                      streak: 0,
                      score: 0,
                      spunLetters: [],
                    },
                  };
                } else if (toolType === "yes-no-picker-wheel" && wheel.data) {
                  return {
                    ...wheel,
                    data: {
                      ...wheel.data,
                      totalSpins: 0,
                      lastResult: null,
                      recentResults: [],
                      results: { yes: 0, no: 0, maybe: 0 },
                      streak: { type: "", count: 0 },
                      achievements: [],
                    },
                  };
                } else if (toolType === "color-picker-wheel" && wheel.data) {
                  return {
                    ...wheel,
                    data: {
                      ...wheel.data,
                      totalSpins: 0,
                      lastResult: null,
                      recentResults: [],
                      results: [],
                      customColors: [],
                    },
                  };
                } else if (toolType === "lol-wheel" && wheel.data) {
                  return {
                    ...wheel,
                    data: {
                      ...wheel.data,
                      totalSpins: 0,
                      lastResult: null,
                      recentResults: [],
                      spinHistory: [],
                      statistics: {
                        totalSpins: 0,
                        uniqueChampionsSpun: 0,
                        mostSpunChampion: undefined,
                        mostSpunRole: undefined,
                        averageSpinsPerSession: 0,
                        lastSpinDate: undefined,
                        firstSpinDate: undefined,
                        spinStreak: 0,
                        totalSpinTime: 0,
                        favoriteRole: undefined,
                        championCountByRole: {},
                        spinResultsByRole: {},
                      },
                    },
                  };
                }
                return wheel;
              }
            );
          });

          return {
            ...newState,
            wheelsByTool: updatedWheelsByTool,
          };
        });
      },

      // LocalStorage-only: keep stubs so existing callers do not wipe device state
      saveToDatabase: async () => {},
      loadFromDatabase: async () => {},
    }),
    {
      name: "wheel-manager",
      partialize: (state) => ({
        currentTool: state.currentTool,
        currentWheelId: state.currentWheelId,
        wheelsByTool: state.wheelsByTool,
        lastWheelIdByTool: state.lastWheelIdByTool,
        favoriteTools: state.favoriteTools,
        isFirstVisit: state.isFirstVisit,
        globalSpinHistory: state.globalSpinHistory,
      }),
      storage: createJSONStorage(() => {
        let timer: ReturnType<typeof setTimeout> | null = null
        let pending: { name: string; value: string } | null = null
        const flush = () => {
          if (!pending) return
          try {
            localStorage.setItem(pending.name, pending.value)
          } catch (e) {
            console.warn("wheel-manager persist failed:", e)
          }
          pending = null
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
        }
        if (typeof window !== "undefined") {
          window.addEventListener("pagehide", flush)
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") flush()
          })
        }
        return {
          getItem: (name: string) => localStorage.getItem(name),
          setItem: (name: string, value: string) => {
            pending = { name, value }
            if (timer) clearTimeout(timer)
            timer = setTimeout(flush, 400)
          },
          removeItem: (name: string) => {
            flush()
            localStorage.removeItem(name)
          },
        }
      }),
      // Never restore mid-spin UI state across reloads — it sticks the Spin button
      merge: (persistedState, currentState) => {
        const persisted = (persistedState || {}) as Partial<WheelManagerStore>
        const wheelsByTool = {
          ...(persisted.wheelsByTool || {}),
        } as WheelManagerStore["wheelsByTool"]
        for (const toolType of Object.keys(wheelsByTool)) {
          wheelsByTool[toolType] = (wheelsByTool[toolType] || []).map((wheel) => ({
            ...wheel,
            data: {
              ...wheel.data,
              isSpinning: false,
            },
          }))
        }
        return {
          ...currentState,
          ...persisted,
          wheelsByTool,
        }
      },
    }
  )
);

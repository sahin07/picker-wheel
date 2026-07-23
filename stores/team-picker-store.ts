import { create } from "zustand";
import { nanoid } from "nanoid";
import { useSettingsStore } from "@/stores/settings-store";

export type Gender = "male" | "female" | undefined;
export interface TeamParticipant {
  id: string;
  name: string;
  gender?: Gender;
  label?: string;
}
export interface Team {
  id: string;
  name: string;
  color: string;
  members: TeamParticipant[];
  representative?: TeamParticipant;
  mascot?: string; // Add mascot property
}

export type DistributionMode = "default" | "gender" | "label";
export type ActionMode = "normal" | "elimination" | "manual";

export interface TeamPickerState {
  participants: TeamParticipant[];
  teams: Team[];
  distributionMode: DistributionMode;
  numberOfGroups: number;
  maxPeoplePerGroup: number;
  pickRepresentatives: boolean;
  customTeamNames: string[];
  toolTitle: string;
  toolDescription: string;
  resultTitle: string;
  isGenerating: boolean;
  viewMode: "input" | "result";
  selectedTeam?: Team | null;
  pickQuantity?: number;
  setPickQuantity?: (n: number) => void;
  addParticipant: (p: Partial<TeamParticipant>) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, data: Partial<TeamParticipant>) => void;
  setDistributionMode: (mode: DistributionMode) => void;
  setNumberOfGroups: (n: number) => void;
  setMaxPeoplePerGroup: (n: number) => void;
  setPickRepresentatives: (b: boolean) => void;
  setCustomTeamNames: (names: string[]) => void;
  generateTeams: () => void;
  setToolTitle: (title: string) => void;
  setToolDescription: (desc: string) => void;
  setResultTitle: (title: string) => void;
  importFromCSV: (csv: string) => void;
  exportToCSV: () => void;
  clearTeams: () => void;
  setViewMode: (mode: "input" | "result") => void;
  setSelectedTeam: (team: Team | null) => void;
  showGenderInResult?: boolean;
  setShowGenderInResult?: (b: boolean) => void;
  showLabelInResult?: boolean;
  setShowLabelInResult?: (b: boolean) => void;
  presetGroups?: string[][];
  setPresetGroups?: (groups: string[][]) => void;
  showSpinner?: boolean;
  pendingGenerate?: boolean;
  setShowSpinner?: (b: boolean) => void;
  setPendingGenerate?: (b: boolean) => void;
  actionMode: ActionMode;
  eliminatedTeams: string[];
  setActionMode: (mode: ActionMode) => void;
  getAvailableTeams: () => Team[];
  eliminateTeam: (teamId: string) => void;
  restoreAllTeams: () => void;
}

const TEAM_COLORS = [
  "#166534", // green
  "#eab308", // yellow
  "#2563eb", // blue
  "#dc2626", // red
  "#8b5cf6", // purple
  "#22c55e", // light green
  "#f59e42", // orange
  "#f472b6", // pink
  "#0ea5e9", // sky
  "#f43f5e", // rose
];

// Mascot list (emojis for now, can be replaced with SVGs later)
const TEAM_MASCOTS = [
  "🐉", "🦁", "🐯", "🦄", "🐼", "🦊", "🐸", "🐵", "🐧", "🦅", "🐻", "🐶", "🐱", "🦖", "🦋"
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const useTeamPickerStore = create<TeamPickerState>((set, get) => ({
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
  isGenerating: false,
  viewMode: "input",
  selectedTeam: null,
  pickQuantity: undefined,
  setPickQuantity: (n) => set({ pickQuantity: n }),
  showGenderInResult: true,
  setShowGenderInResult: (b) => set({ showGenderInResult: b }),
  showLabelInResult: true,
  setShowLabelInResult: (b) => set({ showLabelInResult: b }),
  presetGroups: [],
  setPresetGroups: (groups) => set({ presetGroups: groups }),
  showSpinner: false,
  pendingGenerate: false,
  setShowSpinner: (b) => set({ showSpinner: b }),
  setPendingGenerate: (b) => set({ pendingGenerate: b }),
  actionMode: "normal" as ActionMode,
  eliminatedTeams: [],
  setActionMode: (mode) => set({ actionMode: mode }),
  eliminateTeam: (teamId) => set((state) => ({ 
    eliminatedTeams: [...state.eliminatedTeams, teamId] 
  })),
  restoreAllTeams: () => set({ eliminatedTeams: [] }),
  getAvailableTeams: () => {
    const state = get();
    return state.teams.filter(team => !state.eliminatedTeams.includes(team.id));
  },

  addParticipant: (p) =>
    set((state) => ({
      participants: [
        ...state.participants,
        { id: nanoid(), name: p.name || "", gender: p.gender, label: p.label },
      ],
    })),
  removeParticipant: (id) =>
    set((state) => ({ participants: state.participants.filter((p) => p.id !== id) })),
  updateParticipant: (id, data) =>
    set((state) => ({
      participants: state.participants.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  setDistributionMode: (mode) => set({ distributionMode: mode }),
  setNumberOfGroups: (n) => set({ numberOfGroups: n }),
  setMaxPeoplePerGroup: (n) => set({ maxPeoplePerGroup: n }),
  setPickRepresentatives: (b) => set({ pickRepresentatives: b }),
  setCustomTeamNames: (names) => set({ customTeamNames: names }),
  setToolTitle: (title) => set({ toolTitle: title }),
  setToolDescription: (desc) => set({ toolDescription: desc }),
  setResultTitle: (title) => set({ resultTitle: title }),
  setViewMode: (mode) => set({ viewMode: mode }),
  clearTeams: () => set({ teams: [], viewMode: "input" }),

  importFromCSV: (csv) => {
    const lines = csv.split(/\r?\n/).filter((l) => l.trim());
    const participants = lines.map((line) => {
      const [name, gender, label] = line.split(",").map((s) => s.trim());
      return { id: nanoid(), name, gender: gender as Gender, label };
    });
    set({ participants });
  },

  exportToCSV: () => {
    const { teams } = get();
    const rows = ["Team,Name,Gender,Label"];
    teams.forEach((team) => {
      team.members.forEach((member) => {
        rows.push(
          `${team.name},${member.name},${member.gender || ""},${member.label || ""}`
        );
      });
    });
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teams.csv";
    a.click();
    URL.revokeObjectURL(url);
  },

  generateTeams: () => {
    const state = get();
    let participants = shuffle(state.participants);
    let teamsOrder = Array.from({ length: state.numberOfGroups }, (_, i) => i);
    teamsOrder = shuffle(teamsOrder);
    if (state.distributionMode === "default" && state.pickQuantity && state.pickQuantity > 0 && state.pickQuantity < participants.length) {
      participants = participants.slice(0, state.pickQuantity);
    }
    // Reset eliminated teams when generating new teams
    set({ eliminatedTeams: [] });
    let teams: Team[] = [];
    let numGroups = state.numberOfGroups;
    let maxPeople = state.maxPeoplePerGroup;
    // Auto-calculate if only one is set
    if (!numGroups && maxPeople) {
      numGroups = Math.ceil(participants.length / maxPeople);
    } else if (numGroups && !maxPeople) {
      maxPeople = Math.ceil(participants.length / numGroups);
    }
    // Preset group logic: assign each preset group to a team first
    const presetGroups = state.presetGroups || [];
    const assignedIds = new Set<string>();
    // Assign mascots randomly to each team
    const mascots = shuffle(TEAM_MASCOTS).slice(0, numGroups);
    const toolColors = useSettingsStore.getState().settings?.appearance?.toolColors as
      | string[]
      | undefined;
    const palette = toolColors?.length ? toolColors : TEAM_COLORS;
    teams = Array.from({ length: numGroups }, (_, i) => ({
      id: nanoid(),
      name: state.customTeamNames[i] || `Team ${i + 1}`,
      color: palette[i % palette.length],
      members: [],
      mascot: mascots[i % mascots.length], // Assign mascot
    }));
    // Shuffle teams order for assignment
    teams = teamsOrder.map(idx => teams[idx]);
    presetGroups.forEach((group, idx) => {
      const teamIdx = idx % numGroups;
      group.forEach(id => {
        const p = participants.find(x => x.id === id);
        if (p) {
          teams[teamIdx].members.push(p);
          assignedIds.add(id);
        }
      });
    });
    // Remove assigned participants from pool
    const unassigned = participants.filter(p => !assignedIds.has(p.id));
    // Distribution logic for unassigned
    if (state.distributionMode === "gender") {
      const males = shuffle(unassigned.filter((p) => p.gender === "male"));
      const females = shuffle(unassigned.filter((p) => p.gender === "female"));
      const others = shuffle(unassigned.filter((p) => !p.gender));
      let idx = 0;
      for (const group of [males, females, others]) {
        for (const p of group) {
          teams[idx % numGroups].members.push(p);
          idx++;
        }
      }
    } else if (state.distributionMode === "label") {
      const labelMap: Record<string, TeamParticipant[]> = {};
      for (const p of unassigned) {
        if (p.label) {
          if (!labelMap[p.label]) labelMap[p.label] = [];
          labelMap[p.label].push(p);
        }
      }
      let idx = 0;
      Object.values(labelMap).forEach((group) => {
        for (const p of shuffle(group)) {
          teams[idx % numGroups].members.push(p);
          idx++;
        }
      });
      // Add participants without label
      const noLabel = unassigned.filter((p) => !p.label);
      for (const p of shuffle(noLabel)) {
        teams[idx % numGroups].members.push(p);
        idx++;
      }
    } else {
      // Default: just distribute equally
      let shuffledParticipants = shuffle(unassigned);
      let teamIndexes = Array.from({ length: numGroups }, (_, i) => i);
      for (let i = 0; i < shuffledParticipants.length; i++) {
        teamIndexes = shuffle(teamIndexes);
        teams[teamIndexes[0]].members.push(shuffledParticipants[i]);
      }
      teams = shuffle(teams);
    }
    // Pick representatives
    if (state.pickRepresentatives) {
      teams = teams.map((team) => {
        if (team.members.length > 0) {
          const rep = team.members[Math.floor(Math.random() * team.members.length)];
          return { ...team, representative: rep };
        }
        return team;
      });
    }
    set({ teams, viewMode: "result" });
  },
  setSelectedTeam: (team: Team | null) => {
    set({ selectedTeam: team });
  },
})); 
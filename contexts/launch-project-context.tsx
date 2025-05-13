"use client";

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react";
import { debounce } from "lodash";

// Define milestone type
export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  requiresApproval: boolean;
}

// Define royalty split type
export interface RoyaltySplit {
  id: string;
  recipient: string;
  percentage: number;
}

// Define curator type
export interface Curator {
  id: string;
  name: string;
  avatar: string;
  selected: boolean;
}

// Define collaborator type
export interface Collaborator {
  id: string;
  name: string;
  role: string;
  percentage: number;
  email: string;
}

// Update the ProjectData interface to include financing options
export interface ProjectData {
  // Step 1: Project Info
  id: string | null;
  title: string;
  artistName: string;
  description: string;
  artwork: File | null;
  artworkPreview: string | null;
  trackDemo: File | null;
  trackDemoPreview: string | null;
  voiceNote: File | null;
  voiceNotePreview: string | null;
  additionalFiles: File[];
  additionalFilesInfo: {
    id: string;
    name: string;
    size: number;
    type: string;
    preview?: string;
  }[];

  // Step 2: Royalty Splits
  royaltySplits: RoyaltySplit[];
  enableEarlySupporters: boolean;
  earlySupportersPercentage: number;

  // Step 3: Milestones
  milestones: Milestone[];

  // Step 4: Financing
  enableFinancing: boolean;
  targetRaise: number | null;
  minContribution: number | null;
  maxContribution: number | null;
  financingStartDate: Date | null;
  financingEndDate: Date | null;
  selectedCurators: Curator[];

  // Collaborators
  collaborators: Collaborator[];
}

// Define action types
type Action =
  | { type: "UPDATE_FIELD"; payload: { stepKey: keyof ProjectData; value: any } }
  | { type: "UPDATE_MILESTONE"; payload: { id: string; field: keyof Milestone; value: any } }
  | { type: "ADD_MILESTONE"; payload: Milestone }
  | { type: "REMOVE_MILESTONE"; payload: { id: string } }
  | { type: "UPDATE_ROYALTY_SPLIT"; payload: { id: string; field: keyof RoyaltySplit; value: any } }
  | { type: "ADD_ROYALTY_SPLIT"; payload: RoyaltySplit }
  | { type: "REMOVE_ROYALTY_SPLIT"; payload: { id: string } }
  | { type: "TOGGLE_CURATOR"; payload: { id: string } }
  | { type: "RESET_FORM" }
  | { type: "ADD_COLLABORATOR"; payload: Collaborator }
  | { type: "UPDATE_COLLABORATOR"; payload: { index: number; collaborator: Collaborator } }
  | { type: "REMOVE_COLLABORATOR"; payload: { index: number } };

// Sample curators data
const availableCurators: Curator[] = [
  { id: "11802afd-ebce-4fd1-8daf-8089ca2779fb", name: "Original Works", avatar: "/placeholder-avatars/avatar-1.png", selected: false },
  { id: "ab3097b8-5ba2-47af-80cc-aa4ec2604567", name: "Phat Trax", avatar: "/placeholder-avatars/avatar-2.png", selected: false },
  { id: "c7d22684-5996-4b69-9cbb-a36ee6d96fe3", name: "Coop Records", avatar: "/placeholder-avatars/avatar-3.png", selected: false },
  { id: "<uuid-for-future-sounds>", name: "Future Sounds", avatar: "/placeholder-avatars/avatar-4.png", selected: false },
  { id: "<uuid-for-indie-collective>", name: "Indie Collective", avatar: "/placeholder-avatars/avatar-5.png", selected: false },
];

// Initial state
const LOCAL_STORAGE_KEY = "superfan-launch-project";

function generateUniqueId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substr(2, 9);
}

function logError(error: unknown) {
  console.error("Error in getInitialState:", error);
}

const debouncedPersistState = debounce((state: ProjectData) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(getSerializableState(state)));
  }
}, 300);

const getInitialState = (): ProjectData => {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        logError(e);
      }
    }
  }
  return initialState;
};

const initialState: ProjectData = {
  // Step 1: Project Info
  id: null,
  title: "",
  artistName: "",
  description: "",
  artwork: null,
  artworkPreview: null,
  trackDemo: null,
  trackDemoPreview: null,
  voiceNote: null,
  voiceNotePreview: null,
  additionalFiles: [],
  additionalFilesInfo: [],
  // Step 2: Royalty Splits
  royaltySplits: [
    {
      id: "default",
      recipient: "",
      percentage: 100,
    },
  ],
  enableEarlySupporters: false,
  earlySupportersPercentage: 5,

  // Step 3: Milestones
  milestones: [],

  // Step 4: Financing
  enableFinancing: false,
  targetRaise: null,
  minContribution: null,
  maxContribution: null,
  financingStartDate: null,
  financingEndDate: null,
  selectedCurators: availableCurators,

  // Collaborators
  collaborators: [],
};

// Launch context
interface LaunchProjectContextType {
  projectData: ProjectData;
  updateField: (field: keyof ProjectData, value: any) => void;
  addMilestone: () => void;
  updateMilestone: (id: string, field: keyof Milestone, value: any) => void;
  removeMilestone: (id: string) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  updateCollaborator: (index: number, collaborator: Collaborator) => void;
  removeCollaborator: (index: number) => void;
  toggleCurator: (curatorId: string) => void;
  resetForm: () => void;
}

const LaunchProjectContext = createContext<LaunchProjectContextType | undefined>(undefined);

// Reducer function
function projectReducer(state: ProjectData, action: Action): ProjectData {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.payload.stepKey]: action.payload.value,
      };
    case "UPDATE_MILESTONE":
      return {
        ...state,
        milestones: state.milestones.map((milestone) =>
          milestone && milestone.id === action.payload.id
            ? { ...milestone, [action.payload.field]: action.payload.value }
            : milestone
        ),
      };
    case "ADD_MILESTONE":
      return {
        ...state,
        milestones: [...state.milestones, action.payload],
      };
    case "REMOVE_MILESTONE":
      return {
        ...state,
        milestones: state.milestones.filter((milestone) => milestone && milestone.id !== action.payload.id),
      };
    case "UPDATE_ROYALTY_SPLIT":
      return {
        ...state,
        royaltySplits: state.royaltySplits.map((split) =>
          split.id === action.payload.id ? { ...split, [action.payload.field]: action.payload.value } : split
        ),
      };
    case "ADD_ROYALTY_SPLIT":
      return {
        ...state,
        royaltySplits: [...state.royaltySplits, action.payload],
      };
    case "REMOVE_ROYALTY_SPLIT":
      return {
        ...state,
        royaltySplits: state.royaltySplits.filter((split) => split.id !== action.payload.id),
      };
    case "TOGGLE_CURATOR":
      return {
        ...state,
        selectedCurators: state.selectedCurators.map((curator) =>
          curator.id === action.payload.id ? { ...curator, selected: !curator.selected } : curator
        ),
      };
    case "RESET_FORM":
      return initialState;
    case "ADD_COLLABORATOR":
      return {
        ...state,
        collaborators: [...state.collaborators, action.payload],
      };
    case "UPDATE_COLLABORATOR":
      const { index, collaborator } = action.payload;
      return {
        ...state,
        collaborators: state.collaborators.map((c, i) => (i === index ? collaborator : c)),
      };
    case "REMOVE_COLLABORATOR":
      return {
        ...state,
        collaborators: state.collaborators.filter((_, i) => i !== action.payload.index),
      };
    default:
      return state;
  }
}

// Provider component
export function LaunchProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, getInitialState());

  useEffect(() => {
    debouncedPersistState(state);
  }, [state]);

  const updateField = (field: keyof ProjectData, value: string | number | boolean | null) => {
    dispatch({ type: "UPDATE_FIELD", payload: { stepKey: field, value } });
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: generateUniqueId(),
      title: "",
      description: "",
      dueDate: "",
      requiresApproval: false,
    };
    dispatch({ type: "ADD_MILESTONE", payload: newMilestone });
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string | boolean) => {
    dispatch({ type: "UPDATE_MILESTONE", payload: { id, field, value } });
  };

  const removeMilestone = (id: string) => {
    dispatch({ type: "REMOVE_MILESTONE", payload: { id } });
  };

  const toggleCurator = (curatorId: string) => {
    dispatch({ type: "TOGGLE_CURATOR", payload: { id: curatorId } });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const addCollaborator = (collaborator: Collaborator) => {
    dispatch({ type: "ADD_COLLABORATOR", payload: collaborator });
  };

  const updateCollaborator = (index: number, collaborator: Collaborator) => {
    dispatch({ type: "UPDATE_COLLABORATOR", payload: { index, collaborator } });
  };

  const removeCollaborator = (index: number) => {
    dispatch({ type: "REMOVE_COLLABORATOR", payload: { index } });
  };

  return (
    <LaunchProjectContext.Provider
      value={{
        projectData: state,
        updateField,
        addMilestone,
        updateMilestone,
        removeMilestone,
        toggleCurator,
        resetForm,
        addCollaborator,
        updateCollaborator,
        removeCollaborator,
      }}
    >
      {children}
    </LaunchProjectContext.Provider>
  );
}

// Custom hook for using the context
export function useLaunchProject() {
  const context = useContext(LaunchProjectContext);
  if (context === undefined) {
    throw new Error("useLaunchProject must be used within a LaunchProjectProvider");
  }
  return context;
}

function getSerializableState(state: ProjectData): ProjectData {
  // Remove File objects and previews from state before saving
  return {
    ...state,
    artwork: null,
    artworkPreview: null,
    trackDemo: null,
    trackDemoPreview: null,
    voiceNote: null,
    voiceNotePreview: null,
    additionalFiles: [],
    additionalFilesInfo: [],
  };
}

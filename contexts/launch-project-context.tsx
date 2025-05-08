"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"

// Define milestone type
export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  requiresApproval: boolean
}

// Define royalty split type
export interface RoyaltySplit {
  id: string
  recipient: string
  percentage: number
}

// Define curator type
export interface Curator {
  id: string
  name: string
  avatar: string
  selected: boolean
}

// Define collaborator type
export interface Collaborator {
  id: string
  name: string
  role: string
  percentage: number
  email: string
}

interface DemoTrackFile {
  id: string
  file: File
  title: string
  previewUrl: string
  isPlaying: boolean
  currentTime: number
  duration: number
}

// Update the ProjectData interface to include financing options
export interface ProjectData {
  // Step 1: Project Info
  id: string | null
  title: string
  artistName: string
  description: string
  artwork: File | null
  artworkPreview: string | null
  trackDemo: File | null
  trackDemoPreview: string | null
  voiceNote: File | null
  voiceNotePreview: string | null
  additionalFiles: File[]
  additionalFilesInfo: {
    id: string
    name: string
    size: number
    type: string
    preview?: string
  }[]

  // Step 2: Royalty Splits
  royaltySplits: RoyaltySplit[]

  // Step 3: Milestones
  milestones: Milestone[]

  // Step 4: Financing (formerly Project Terms)
  enableFinancing: boolean
  targetRaise: number | null
  minContribution: number | null
  maxContribution: number | null
  startDate: string
  endDate: string
  selectedCurators: Curator[]

  // Step 5: Demo Tracks
  demoTracks: DemoTrackFile[]
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

// Sample curators data
const availableCurators: Curator[] = [
  { id: "curator-1", name: "Indie Music Fund", avatar: "/placeholder-avatars/avatar-1.png", selected: false },
  { id: "curator-2", name: "Beat Collective", avatar: "/placeholder-avatars/avatar-2.png", selected: false },
  { id: "curator-3", name: "Harmony Ventures", avatar: "/placeholder-avatars/avatar-3.png", selected: false },
  { id: "curator-4", name: "Rhythm Capital", avatar: "/placeholder-avatars/avatar-4.png", selected: false },
  { id: "curator-5", name: "Melody Investments", avatar: "/placeholder-avatars/avatar-5.png", selected: false },
]

// Initial state
const LOCAL_STORAGE_KEY = 'superfan-launch-project'

const getInitialState = (): ProjectData => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        // Ignore parse errors and fall back to default
      }
    }
  }
  return initialState
}

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

  // Step 3: Milestones
  milestones: [],

  // Step 4: Financing (formerly Project Terms)
  enableFinancing: true,
  targetRaise: null,
  minContribution: null,
  maxContribution: null,
  startDate: "",
  endDate: "",
  selectedCurators: availableCurators,

  // Step 5: Demo Tracks
  demoTracks: [],
}

// Launch context
interface LaunchProjectContextType {
  projectData: ProjectData
  updateField: (field: keyof ProjectData, value: any) => void
  addMilestone: () => void
  updateMilestone: (id: string, field: keyof Milestone, value: any) => void
  removeMilestone: (id: string) => void
  addCollaborator: (collaborator: Collaborator) => void
  updateCollaborator: (index: number, collaborator: Collaborator) => void
  removeCollaborator: (index: number) => void
  toggleCurator: (curatorId: string) => void
  resetForm: () => void
}

const LaunchProjectContext = createContext<LaunchProjectContextType | undefined>(undefined)

// Reducer function
function projectReducer(state: ProjectData, action: Action): ProjectData {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.payload.stepKey]: action.payload.value,
      }
    case "UPDATE_MILESTONE":
      return {
        ...state,
        milestones: state.milestones.map((milestone) =>
          milestone && milestone.id === action.payload.id
            ? { ...milestone, [action.payload.field]: action.payload.value }
            : milestone
        ),
      }
    case "ADD_MILESTONE":
      return {
        ...state,
        milestones: [...state.milestones, action.payload],
      }
    case "REMOVE_MILESTONE":
      return {
        ...state,
        milestones: state.milestones.filter(
          (milestone) => milestone && milestone.id !== action.payload.id
        ),
      }
    case "UPDATE_ROYALTY_SPLIT":
      return {
        ...state,
        royaltySplits: state.royaltySplits.map((split) =>
          split.id === action.payload.id ? { ...split, [action.payload.field]: action.payload.value } : split,
        ),
      }
    case "ADD_ROYALTY_SPLIT":
      return {
        ...state,
        royaltySplits: [...state.royaltySplits, action.payload],
      }
    case "REMOVE_ROYALTY_SPLIT":
      return {
        ...state,
        royaltySplits: state.royaltySplits.filter((split) => split.id !== action.payload.id),
      }
    case "TOGGLE_CURATOR":
      return {
        ...state,
        selectedCurators: state.selectedCurators.map((curator) =>
          curator.id === action.payload.id
            ? { ...curator, selected: !curator.selected }
            : curator
        ),
      }
    case "RESET_FORM":
      return initialState
    default:
      return state
  }
}

// Provider component
export function LaunchProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, getInitialState())

  // Persist state to localStorage on every change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(getSerializableState(state)))
    }
  }, [state])

  const updateField = (field: keyof ProjectData, value: any) => {
    dispatch({ type: "UPDATE_FIELD", payload: { stepKey: field, value } })
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
      title: "",
      description: "",
      dueDate: "",
      requiresApproval: false,
    };
    dispatch({ type: "ADD_MILESTONE", payload: newMilestone });
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    dispatch({ type: "UPDATE_MILESTONE", payload: { id, field, value } })
  }

  const removeMilestone = (id: string) => {
    dispatch({ type: "REMOVE_MILESTONE", payload: { id } })
  }

  const addCollaborator = (collaborator: Collaborator) => {
    // Implementation needed
  }

  const updateCollaborator = (index: number, collaborator: Collaborator) => {
    // Implementation needed
  }

  const removeCollaborator = (index: number) => {
    // Implementation needed
  }

  const toggleCurator = (curatorId: string) => {
    dispatch({ type: "TOGGLE_CURATOR", payload: { id: curatorId } })
  }

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" })
  }

  return (
    <LaunchProjectContext.Provider
      value={{
        projectData: state,
        updateField,
        addMilestone,
        updateMilestone,
        removeMilestone,
        addCollaborator,
        updateCollaborator,
        removeCollaborator,
        toggleCurator,
        resetForm,
      }}
    >
      {children}
    </LaunchProjectContext.Provider>
  )
}

// Custom hook for using the context
export function useLaunchProject() {
  const context = useContext(LaunchProjectContext)
  if (context === undefined) {
    throw new Error("useLaunchProject must be used within a LaunchProjectProvider")
  }
  return context
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
  }
}

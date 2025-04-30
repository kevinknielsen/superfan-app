"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

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

// Update the ProjectData interface to include financing options
export interface ProjectData {
  // Step 1: Project Info
  title: string
  artistName: string
  description: string
  artwork: File | null
  artworkPreview: string | null
  trackDemo: File | null
  trackDemoPreview: string | null
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
const initialState: ProjectData = {
  // Step 1: Project Info
  title: "",
  artistName: "",
  description: "",
  artwork: null,
  artworkPreview: null,
  trackDemo: null,
  trackDemoPreview: null,
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
}

// Create context
interface CreateProjectContextType {
  projectData: ProjectData
  updateField: (stepKey: keyof ProjectData, value: any) => void
  updateMilestone: (id: string, field: keyof Milestone, value: any) => void
  addMilestone: () => void
  removeMilestone: (id: string) => void
  updateRoyaltySplit: (id: string, field: keyof RoyaltySplit, value: any) => void
  addRoyaltySplit: () => void
  removeRoyaltySplit: (id: string) => void
  toggleCurator: (id: string) => void
  resetForm: () => void
}

const CreateProjectContext = createContext<CreateProjectContextType | undefined>(undefined)

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
          milestone.id === action.payload.id
            ? { ...milestone, [action.payload.field]: action.payload.value }
            : milestone,
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
        milestones: state.milestones.filter((milestone) => milestone.id !== action.payload.id),
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
          curator.id === action.payload.id ? { ...curator, selected: !curator.selected } : curator,
        ),
      }
    case "RESET_FORM":
      return initialState
    default:
      return state
  }
}

// Provider component
export function CreateProjectProvider({ children }: { children: ReactNode }) {
  const [projectData, dispatch] = useReducer(projectReducer, initialState)

  const updateField = (stepKey: keyof ProjectData, value: any) => {
    dispatch({ type: "UPDATE_FIELD", payload: { stepKey, value } })
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    dispatch({ type: "UPDATE_MILESTONE", payload: { id, field, value } })
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: "",
      description: "",
      dueDate: "",
      requiresApproval: false,
    }
    dispatch({ type: "ADD_MILESTONE", payload: newMilestone })
  }

  const removeMilestone = (id: string) => {
    dispatch({ type: "REMOVE_MILESTONE", payload: { id } })
  }

  const updateRoyaltySplit = (id: string, field: keyof RoyaltySplit, value: any) => {
    dispatch({ type: "UPDATE_ROYALTY_SPLIT", payload: { id, field, value } })
  }

  const addRoyaltySplit = () => {
    const newSplit: RoyaltySplit = {
      id: `split-${Date.now()}`,
      recipient: "",
      percentage: 0,
    }
    dispatch({ type: "ADD_ROYALTY_SPLIT", payload: newSplit })
  }

  const removeRoyaltySplit = (id: string) => {
    dispatch({ type: "REMOVE_ROYALTY_SPLIT", payload: { id } })
  }

  const toggleCurator = (id: string) => {
    dispatch({ type: "TOGGLE_CURATOR", payload: { id } })
  }

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" })
  }

  return (
    <CreateProjectContext.Provider
      value={{
        projectData,
        updateField,
        updateMilestone,
        addMilestone,
        removeMilestone,
        updateRoyaltySplit,
        addRoyaltySplit,
        removeRoyaltySplit,
        toggleCurator,
        resetForm,
      }}
    >
      {children}
    </CreateProjectContext.Provider>
  )
}

// Custom hook for using the context
export function useCreateProject() {
  const context = useContext(CreateProjectContext)
  if (context === undefined) {
    throw new Error("useCreateProject must be used within a CreateProjectProvider")
  }
  return context
}

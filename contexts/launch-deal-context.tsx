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

// Define the state structure
export interface DealData {
  // Step 1: Project Info
  title: string
  artistName: string
  description: string
  artwork: File | null
  artworkPreview: string | null

  // Step 2: Deal Terms
  targetRaise: number | null
  minContribution: number | null
  maxContribution: number | null
  startDate: string
  endDate: string

  // Step 3: Milestones
  milestones: Milestone[]

  // Step 4: Royalty Splits
  royaltySplits: RoyaltySplit[]
}

// Define action types
type Action =
  | { type: "UPDATE_FIELD"; payload: { stepKey: keyof DealData; value: any } }
  | { type: "UPDATE_MILESTONE"; payload: { id: string; field: keyof Milestone; value: any } }
  | { type: "ADD_MILESTONE"; payload: Milestone }
  | { type: "REMOVE_MILESTONE"; payload: { id: string } }
  | { type: "UPDATE_ROYALTY_SPLIT"; payload: { id: string; field: keyof RoyaltySplit; value: any } }
  | { type: "ADD_ROYALTY_SPLIT"; payload: RoyaltySplit }
  | { type: "REMOVE_ROYALTY_SPLIT"; payload: { id: string } }
  | { type: "RESET_FORM" }

// Initial state
const initialState: DealData = {
  // Step 1: Project Info
  title: "",
  artistName: "",
  description: "",
  artwork: null,
  artworkPreview: null,

  // Step 2: Deal Terms
  targetRaise: null,
  minContribution: null,
  maxContribution: null,
  startDate: "",
  endDate: "",

  // Step 3: Milestones
  milestones: [],

  // Step 4: Royalty Splits
  royaltySplits: [
    {
      id: "default",
      recipient: "",
      percentage: 100,
    },
  ],
}

// Create context
interface CreateDealContextType {
  dealData: DealData
  updateField: (stepKey: keyof DealData, value: any) => void
  updateMilestone: (id: string, field: keyof Milestone, value: any) => void
  addMilestone: () => void
  removeMilestone: (id: string) => void
  updateRoyaltySplit: (id: string, field: keyof RoyaltySplit, value: any) => void
  addRoyaltySplit: () => void
  removeRoyaltySplit: (id: string) => void
  resetForm: () => void
}

const CreateDealContext = createContext<CreateDealContextType | undefined>(undefined)

// Reducer function
function dealReducer(state: DealData, action: Action): DealData {
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
    case "RESET_FORM":
      return initialState
    default:
      return state
  }
}

// Provider component
export function CreateDealProvider({ children }: { children: ReactNode }) {
  const [dealData, dispatch] = useReducer(dealReducer, initialState)

  const updateField = (stepKey: keyof DealData, value: any) => {
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

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" })
  }

  return (
    <CreateDealContext.Provider
      value={{
        dealData,
        updateField,
        updateMilestone,
        addMilestone,
        removeMilestone,
        updateRoyaltySplit,
        addRoyaltySplit,
        removeRoyaltySplit,
        resetForm,
      }}
    >
      {children}
    </CreateDealContext.Provider>
  )
}

// Custom hook for using the context
export function useCreateDeal() {
  const context = useContext(CreateDealContext)
  if (context === undefined) {
    throw new Error("useCreateDeal must be used within a CreateDealProvider")
  }
  return context
}

import { configureStore } from "@reduxjs/toolkit"
import tasksReducer from "./tasksSlice"

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("taskManagementState")
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error("Error loading state from localStorage:", err)
    return undefined
  }
}

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem("taskManagementState", serializedState)
  } catch (err) {
    console.error("Could not save state", err)
  }
}

// Only load state from localStorage if it exists
const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: preloadedState || undefined, // Use undefined if no state in localStorage
})

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState())
})

export default store

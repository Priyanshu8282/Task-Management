import { createSlice } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  tasks: [
    {
      id: "1",
      title: "Brainstorming",
      description: "Brainstorming brings team members' diverse experience into play",
      status: "todo",
      priority: "low",
      category: "planning",
      dueDate: "2024-01-15",
      comments: 12,
      files: 6,
      projectId: "1",
    },
    {
      id: "2",
      title: "Research",
      description: "User research helps you to create an optimal product for users",
      status: "todo",
      priority: "medium",
      category: "research",
      dueDate: "2024-01-20",
      comments: 10,
      files: 3,
      projectId: "1",
    },
    {
      id: "3",
      title: "Wireframes",
      description: "Low fidelity wireframes include the most basic elements and content",
      status: "todo",
      priority: "high",
      category: "design",
      dueDate: "2024-01-25",
      comments: 12,
      files: 5,
      projectId: "1",
    },
    {
      id: "4",
      title: "Brainstorming",
      description: "Brainstorming brings team members' diverse experience into play",
      status: "inprogress",
      priority: "low",
      category: "planning",
      dueDate: "2024-01-18",
      comments: 12,
      files: 6,
      projectId: "1",
    },
    {
      id: "5",
      title: "Brainstorming",
      description: "Brainstorming brings team members' diverse experience into play",
      status: "inprogress",
      priority: "low",
      category: "planning",
      dueDate: "2024-01-22",
      comments: 12,
      files: 6,
      projectId: "1",
    },
    {
      id: "6",
      title: "Brainstorming",
      description: "Brainstorming brings team members' diverse experience into play",
      status: "done",
      priority: "low",
      category: "planning",
      dueDate: "2024-01-10",
      comments: 12,
      files: 6,
      projectId: "1",
    },
    {
      id: "7",
      title: "Brainstorming",
      description: "Brainstorming brings team members' diverse experience into play",
      status: "done",
      priority: "low",
      category: "planning",
      dueDate: "2024-01-12",
      comments: 12,
      files: 6,
      projectId: "1",
    },
    {
      id: "8",
      title: "Design System",
      description: "It just needs to adapt the UI from what you did",
      status: "done",
      priority: "completed",
      category: "design",
      dueDate: "2024-01-05",
      comments: 32,
      files: 15,
      projectId: "1",
    },
  ],
  filter: {
    priority: "all",
    category: "all",
    dueDate: "all",
  },
  viewMode: "grid", // "grid" or "list"
  searchQuery: "",
  notifications: [
    {
      id: "1",
      message: "New task assigned to you",
      time: "2 min ago",
      read: false,
    },
    {
      id: "2",
      message: "Project deadline approaching",
      time: "1 hour ago",
      read: false,
    },
  ],
  projects: [
    { id: "1", name: "Mobile App", active: true },
    { id: "2", name: "Website Redesign", active: false },
    { id: "3", name: "Design System", active: false },
    { id: "4", name: "Wireframes", active: false },
  ],
  activeProject: "1",
  teamMembers: [
    { id: "1", name: "Palak Jain", email: "palak@example.com", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "2", name: "John Doe", email: "john@example.com", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "3", name: "Jane Smith", email: "jane@example.com", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "4", name: "Alex Johnson", email: "alex@example.com", avatar: "/placeholder.svg?height=32&width=32" },
  ],
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: action.payload.id || uuidv4(),
        title: action.payload.title || "",
        description: action.payload.description || "",
        status: action.payload.status || "todo",
        priority: action.payload.priority || "medium",
        category: action.payload.category || "general",
        dueDate: action.payload.dueDate || new Date().toISOString().split("T")[0],
        comments: action.payload.comments || 0,
        files: action.payload.files || 0,
        projectId: action.payload.projectId || state.activeProject,
      }
      state.tasks.push(newTask)
    },
    moveTask: (state, action) => {
      const { taskId, newStatus } = action.payload
      const task = state.tasks.find((task) => task.id === taskId)
      if (task) {
        task.status = newStatus
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload
      const task = state.tasks.find((task) => task.id === id)
      if (task) {
        Object.assign(task, updates)
      }
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now().toString(),
        message: action.payload.message,
        time: "now",
        read: false,
      })
    },
    setActiveProject: (state, action) => {
      state.activeProject = action.payload
      state.projects.forEach((project) => {
        project.active = project.id === action.payload
      })
    },
    addProject: (state, action) => {
      if (!state.projects) {
        state.projects = []
      }
      const newProject = {
        id: Date.now().toString(),
        name: action.payload.name,
        active: false,
      }
      state.projects.push(newProject)
    },
    updateProject: (state, action) => {
      const { id, name } = action.payload
      const project = state.projects.find((project) => project.id === id)
      if (project) {
        project.name = name
      }
    },
    inviteTeamMember: (state, action) => {
      state.teamMembers.push({
        id: Date.now().toString(),
        name: action.payload.name,
        email: action.payload.email,
        avatar: "/placeholder.svg?height=32&width=32",
      })
    },
  },
})

export const {
  addTask,
  moveTask,
  deleteTask,
  updateTask,
  setFilter,
  setViewMode,
  setSearchQuery,
  markNotificationRead,
  addNotification,
  setActiveProject,
  addProject,
  updateProject,
  inviteTeamMember,
} = tasksSlice.actions
export default tasksSlice.reducer

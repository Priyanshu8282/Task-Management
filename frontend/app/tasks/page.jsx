"use client"
import { Provider } from "react-redux"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import store from "../../store/store"
import TaskBoard from "../../components/TaskBoard"

export default function TasksPage() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <TaskBoard />
      </DndProvider>
    </Provider>
  )
} 
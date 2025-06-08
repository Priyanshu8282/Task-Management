"use client"
import { Provider } from "react-redux"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import store from "../../store/store"
import Home from "../../components/Home"

export default function HomePage() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Home />
      </DndProvider>
    </Provider>
  )
} 
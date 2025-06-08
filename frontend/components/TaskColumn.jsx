"use client"

import { useDrop } from "react-dnd"
import { useDispatch } from "react-redux"
import { moveTask } from "../store/tasksSlice"
import TaskCard from "./TaskCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const TaskColumn = ({ title, status, tasks = [], onEditTask, onAddTask }) => {
  const dispatch = useDispatch()

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => {
      if (item.status !== status) {
        dispatch(moveTask({ taskId: item.id, newStatus: status }))
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const getColumnColor = (status) => {
    switch (status) {
      case "todo":
        return "border-indigo-300 bg-indigo-50"
      case "inprogress":
        return "border-yellow-300 bg-yellow-50"
      case "done":
        return "border-green-300 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getHeaderColor = (status) => {
    switch (status) {
      case "todo":
        return "text-indigo-600 border-indigo-600"
      case "inprogress":
        return "text-yellow-600 border-yellow-600"
      case "done":
        return "text-green-600 border-green-600"
      default:
        return "text-gray-600 border-gray-600"
    }
  }

  const getDotColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-indigo-600"
      case "inprogress":
        return "bg-yellow-600"
      case "done":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div 
      ref={drop} 
      className={`rounded-lg p-3 sm:p-4 min-h-[200px] ${isOver ? "ring-2 ring-blue-400" : ""} ${getColumnColor(status)}`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getDotColor(status)}`}></div>
          <h3 className={`font-medium text-sm ${getHeaderColor(status)}`}>{title}</h3>
          <span className="text-xs bg-white rounded-full px-2 py-0.5 text-gray-600">{tasks.length}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onAddTask(status)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-3 sm:py-4">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskColumn

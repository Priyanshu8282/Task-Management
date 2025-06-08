"use client"

import { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import TaskColumn from "./TaskColumn"
import TaskForm from "./TaskForm"
import TaskFilters from "./TaskFilters"
import TaskListView from "./TaskListView"
import Sidebar from "./Sidebar"
import Header from "./Header"

const TaskBoard = () => {
  const { tasks, filter, viewMode, searchQuery, activeProject } = useSelector((state) => state.tasks)
  const [editingTask, setEditingTask] = useState(null)
  const [addingTaskStatus, setAddingTaskStatus] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Project filter
      if (task.projectId !== activeProject) {
        return false
      }

      // Search filter
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Priority filter
      if (filter.priority !== "all" && task.priority !== filter.priority) {
        return false
      }

      // Category filter
      if (filter.category !== "all" && task.category !== filter.category) {
        return false
      }

      // Due date filter
      if (filter.dueDate !== "all") {
        const today = new Date()
        const taskDate = new Date(task.dueDate)

        switch (filter.dueDate) {
          case "overdue":
            if (taskDate >= today) return false
            break
          case "today":
            if (taskDate.toDateString() !== today.toDateString()) return false
            break
          case "week":
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            if (taskDate < today || taskDate > weekFromNow) return false
            break
        }
      }

      return true
    })
  }, [tasks, filter, searchQuery, activeProject])

  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "inprogress")
  const doneTasks = filteredTasks.filter((task) => task.status === "done")

  const handleEditTask = (task) => {
    setEditingTask(task)
  }

  const handleAddTask = (status) => {
    setAddingTaskStatus(status)
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const handleCloseEdit = () => {
    setEditingTask(null)
    setAddingTaskStatus(null)
    setIsFormOpen(false)
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          <TaskFilters />

          <div>
            <TaskForm 
              editingTask={editingTask} 
              onClose={handleCloseEdit} 
              initialStatus={addingTaskStatus}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              activeProject={activeProject}
            />
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <TaskColumn
                title="To Do"
                status="todo"
                tasks={todoTasks}
                onEditTask={handleEditTask}
                onAddTask={handleAddTask}
              />
              <TaskColumn
                title="On Progress"
                status="inprogress"
                tasks={inProgressTasks}
                onEditTask={handleEditTask}
                onAddTask={handleAddTask}
              />
              <TaskColumn
                title="Done"
                status="done"
                tasks={doneTasks}
                onEditTask={handleEditTask}
                onAddTask={handleAddTask}
              />
            </div>
          ) : (
            <TaskListView tasks={filteredTasks} onEditTask={handleEditTask} />
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskBoard

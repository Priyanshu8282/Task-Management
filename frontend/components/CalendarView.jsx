"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CalendarView = () => {
  const { tasks } = useSelector((state) => state.tasks)
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getTasksForDate = (day) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return tasks.filter((task) => task.dueDate === dateStr)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentDate).map((day, index) => {
          const tasksForDay = getTasksForDate(day)
          const isToday =
            day &&
            new Date().getDate() === day &&
            new Date().getMonth() === currentDate.getMonth() &&
            new Date().getFullYear() === currentDate.getFullYear()

          return (
            <div
              key={index}
              className={`min-h-[40px] p-1 border border-gray-100 rounded ${
                day ? "hover:bg-gray-50" : ""
              } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
            >
              {day && (
                <>
                  <div className={`text-sm ${isToday ? "font-bold text-blue-600" : ""}`}>{day}</div>
                  {tasksForDay.length > 0 && (
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {tasksForDay.length}
                      </Badge>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Today's Tasks */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-medium text-sm mb-2">Today's Tasks</h4>
        {tasks
          .filter((task) => {
            const today = new Date().toISOString().split("T")[0]
            return task.dueDate === today
          })
          .map((task) => (
            <div key={task.id} className="text-sm py-1 px-2 bg-gray-50 rounded mb-1">
              {task.title}
            </div>
          ))}
      </div>
    </div>
  )
}

export default CalendarView

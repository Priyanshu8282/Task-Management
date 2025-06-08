"use client"

import { useDrag } from "react-dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Paperclip, MoreHorizontal } from "lucide-react"
import { useDispatch } from "react-redux"
import { deleteTask } from "../store/tasksSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const TaskCard = ({ task, onEdit }) => {
  const dispatch = useDispatch()

  // Return null if no task is provided
  if (!task) {
    return null
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
  }

  return (
    <Card
      ref={drag}
      className={`mb-2 sm:mb-3 cursor-move transition-opacity ${isDragging ? "opacity-50" : "opacity-100"} border-gray-200 hover:shadow-md`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`text-xs px-2 py-0.5 font-normal ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit && onEdit(task)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-1">{task.title || "Untitled Task"}</h3>
        <p className="text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-2">{task.description || "No description"}</p>

        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            <Avatar className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=24&width=24" />
              <AvatarFallback className="text-[8px] sm:text-[10px] bg-indigo-100 text-indigo-600">PJ</AvatarFallback>
            </Avatar>
            <Avatar className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=24&width=24" />
              <AvatarFallback className="text-[8px] sm:text-[10px] bg-indigo-100 text-indigo-600">JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=24&width=24" />
              <AvatarFallback className="text-[8px] sm:text-[10px] bg-indigo-100 text-indigo-600">JS</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span className="hidden sm:inline">{task.comments || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              <span className="hidden sm:inline">{task.files || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard
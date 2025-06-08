"use client"

import { useDispatch } from "react-redux"
import { moveTask, deleteTask } from "../store/tasksSlice"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Paperclip, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const TaskListView = ({ tasks, onEditTask }) => {
  const dispatch = useDispatch()

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-indigo-100 text-indigo-800"
      case "inprogress":
        return "bg-yellow-100 text-yellow-800"
      case "done":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(moveTask({ taskId, newStatus }))
  }

  const handleDelete = (taskId) => {
    dispatch(deleteTask(taskId))
  }

  return (
    <div className="bg-white rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Priority</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead className="hidden sm:table-cell">Activity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                  <SelectTrigger className="w-24 sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority === "completed" ? "Completed" : task.priority}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline">{task.category}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{task.dueDate}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{task.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    <span>{task.files}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTask(task)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-red-500">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default TaskListView

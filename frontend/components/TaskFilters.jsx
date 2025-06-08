"use client"

import { useSelector, useDispatch } from "react-redux"
import { setFilter } from "../store/tasksSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter } from "lucide-react"

const TaskFilters = () => {
  const dispatch = useDispatch()
  const filter = useSelector((state) => state.tasks.filter)

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ [filterType]: value }))
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <Select value={filter.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={filter.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Due Date</label>
            <Select value={filter.dueDate} onValueChange={(value) => handleFilterChange("dueDate", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="week">Due This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskFilters

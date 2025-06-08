"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { addTask, updateTask } from "../store/tasksSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Upload } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

const TaskForm = ({ editingTask, onClose, initialStatus, open, onOpenChange, activeProject }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: initialStatus || "todo",
    priority: "medium",
    category: "general",
    dueDate: new Date().toISOString().split("T")[0],
    files: 0,
    comments: 0,
  })
  const [fileInputs, setFileInputs] = useState([])

  useEffect(() => {
    if (editingTask) {
      setFormData(editingTask)
    } else {
      setFormData({
        title: "",
        description: "",
        status: initialStatus || "todo",
        priority: "medium",
        category: "general",
        dueDate: new Date().toISOString().split("T")[0],
        files: 0,
        comments: 0,
      })
    }
  }, [editingTask, initialStatus])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newTask = {
      ...formData,
      id: editingTask ? editingTask.id : uuidv4(),
      files: fileInputs.length,
      projectId: activeProject,
      comments: formData.comments || 0,
    }

    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, updates: newTask }))
    } else {
      dispatch(addTask(newTask))
    }

    // Reset form
    setFormData({
      title: "",
      description: "",
      status: initialStatus || "todo",
      priority: "medium",
      category: "general",
      dueDate: new Date().toISOString().split("T")[0],
      files: 0,
      comments: 0,
    })
    setFileInputs([])
    onClose()
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFileInputs([...fileInputs, ...newFiles])
    }
  }

  const removeFile = (index) => {
    const updatedFiles = [...fileInputs]
    updatedFiles.splice(index, 1)
    setFileInputs(updatedFiles)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="files">Attachments</Label>
            <div className="mt-2 border-2 border-dashed rounded-md p-4 text-center">
              <Input id="files" type="file" multiple className="hidden" onChange={handleFileChange} />
              <Label htmlFor="files" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium">Click to upload files</span>
                <span className="text-xs text-gray-500">or drag and drop</span>
              </Label>
            </div>

            {/* File List */}
            {fileInputs.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label>Uploaded Files</Label>
                <div className="max-h-32 overflow-y-auto">
                  {fileInputs.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm">
                      <span className="truncate max-w-[300px]">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500"
                        onClick={() => removeFile(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{editingTask ? "Update" : "Add"} Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TaskForm

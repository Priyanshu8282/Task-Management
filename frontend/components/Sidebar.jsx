"use client"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setActiveProject, addProject } from "../store/tasksSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, MessageSquare, CheckSquare, Users, Settings, Plus, ChevronLeft, MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

const Sidebar = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { projects = [], tasks = [], activeProject } = useSelector((state) => state.tasks)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")

  const menuItems = [
    { icon: Home, label: "Home", active: false, onClick: () => router.push("/home") },
    { icon: MessageSquare, label: "Messages", active: false, onClick: () => router.push("/messages") },
    { icon: CheckSquare, label: "Tasks", active: true, onClick: () => router.push("/tasks") },
    { icon: Users, label: "Members", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  const getTaskCount = (projectId) => {
    return tasks.filter((task) => task.projectId === projectId).length
  }

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      dispatch(addProject({ name: newProjectName }))
      setNewProjectName("")
      setShowAddProject(false)
    }
  }

  return (
    <div className="bg-white border-r border-gray-200 w-[220px] h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">P</span>
        </div>
        <span className="font-semibold text-gray-900">Project M.</span>
        <Button variant="ghost" size="sm" className="p-1 h-6 w-6 ml-auto">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start px-3 h-9 ${item.active ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" : "text-gray-600"}`}
              size="sm"
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4 mr-3" />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* My Projects */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">My Projects</h3>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setShowAddProject(true)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
                  project.active ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
                onClick={() => dispatch(setActiveProject(project.id))}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${project.id === "1" ? "bg-indigo-500" : project.id === "2" ? "bg-orange-500" : project.id === "3" ? "bg-gray-400" : "bg-indigo-300"}`}
                  ></div>
                  <span className={`text-sm ${project.active ? "text-indigo-600 font-medium" : "text-gray-700"}`}>
                    {project.name}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Thoughts Time */}
        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full mb-2 mx-auto">
            <span className="text-amber-500 text-lg">💡</span>
          </div>
          <h4 className="font-medium text-sm text-center mb-2">Thoughts Time</h4>
          <p className="text-xs text-gray-600 mb-3 text-center">
            We don't have any notice for you, till then you can share your thoughts with your peers.
          </p>
          <Button size="sm" variant="outline" className="w-full text-xs">
            Write a message
          </Button>
        </div>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProject(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Sidebar

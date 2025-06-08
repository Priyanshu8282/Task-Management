import { useState } from "react"
import { useSelector } from "react-redux"
import Sidebar from "./Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function Home() {
  const { tasks = [], projects = [] } = useSelector((state) => state.tasks)
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === "completed").length
  const pendingTasks = totalTasks - completedTasks
  const upcomingDeadlines = tasks.filter(task => {
    const deadline = new Date(task.dueDate)
    const today = new Date()
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <h3 className="text-2xl font-bold mt-1">{totalTasks}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <h3 className="text-2xl font-bold mt-1">{completedTasks}</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <h3 className="text-2xl font-bold mt-1">{pendingTasks}</h3>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Deadlines</p>
                <h3 className="text-2xl font-bold mt-1">{upcomingDeadlines}</h3>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">{project.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{tasks.filter(task => task.projectId === project.id).length} tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated 2 days ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">Added to {projects.find(p => p.id === task.projectId)?.name || 'Project'}</p>
                </div>
                <span className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

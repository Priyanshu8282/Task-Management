"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { setSearchQuery, markNotificationRead, setViewMode } from "../store/tasksSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Bell, Calendar, Share2, Grid, List, ChevronDown } from "lucide-react"
import InviteModal from "./InviteModal"
import toast, { Toaster } from 'react-hot-toast'
import axios from "axios"

const BASE_URL = "http://localhost:8000"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const Header = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { searchQuery = "", notifications = [], viewMode = "grid", teamMembers = [], projects = [], activeProject } = useSelector(
    (state) => state.tasks,
  )
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const unreadNotifications = notifications.filter((n) => !n.read)
  const currentProject = projects.find((p) => p.id === activeProject)

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleNotificationClick = (notificationId) => {
    dispatch(markNotificationRead(notificationId))
  }

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 3000,
            theme: {
              primary: '#ff4b4b',
            },
          },
        }}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        {/* Left side - Project title */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentProject?.name || "Project"}</h1>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-xs font-medium">E</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-xs font-medium">+</span>
            </div>
          </div>
        </div>

        {/* Right side - Actions and profile */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full sm:w-64 h-9 bg-gray-50 border-gray-200"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => dispatch(setViewMode("grid"))}
              className="h-7 w-7 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => dispatch(setViewMode("list"))}
              className="h-7 w-7 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden sm:flex">
            <Calendar className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <h3 className="font-medium mb-2">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Invite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInviteModal(true)}
            className="text-indigo-600 font-medium hidden sm:flex"
          >
            Invite
          </Button>

          {/* Share Button */}
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
            <Share2 className="h-4 w-4" />
            Share
          </Button>

          {/* Team Members */}
          <div className="flex -space-x-2 ml-2 hidden sm:flex">
            {teamMembers.slice(0, 4).map((member, index) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            ))}
            {teamMembers.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{teamMembers.length - 4}</span>
              </div>
            )}
          </div>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2 ml-auto sm:ml-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <InviteModal open={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </header>
  )
}

export default Header

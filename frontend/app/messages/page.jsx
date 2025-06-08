"use client"
import { Provider } from "react-redux"
import store from "../../store/store"
import Sidebar from "../../components/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Send } from "lucide-react"

export default function MessagesPage() {
  return (
    <Provider store={store}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Communicate with your team members</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          {/* Messages Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col h-[600px]">
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="space-y-4">
                  {/* Example Messages */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">JD</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">John Doe</span>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-gray-600">Hey team! Just wanted to check in on the project progress.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">AS</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">Alice Smith</span>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                      </div>
                      <p className="text-gray-600">Everything is going well! We're on track with the deadlines.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Provider>
  )
} 
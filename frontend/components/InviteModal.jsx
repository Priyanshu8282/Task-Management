"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { inviteTeamMember, addNotification } from "../store/tasksSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail } from "lucide-react"

const InviteModal = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleInvite = (e) => {
    e.preventDefault()
    if (email && name) {
      dispatch(inviteTeamMember({ name, email }))
      dispatch(
        addNotification({
          message: `Invitation sent to ${name} (${email})`,
        }),
      )
      setEmail("")
      setName("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team member's name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default InviteModal

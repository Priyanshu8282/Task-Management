"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast, { Toaster } from 'react-hot-toast'
import axios from "axios"

const BASE_URL = "http://localhost:8000" // Update this if your backend URL changes

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    setIsLoading(true)
    const resetPasswordPromise = api.post('/user/reset-password', {
      token,
      password: formData.password
    })

    toast.promise(resetPasswordPromise, {
      loading: 'Resetting your password...',
      success: () => {
        router.push('/')
        return 'Password reset successful! Please login with your new password.'
      },
      error: (err) => err.response?.data?.message || 'Failed to reset password'
    })

    try {
      await resetPasswordPromise
    } catch (error) {
      // Error is already handled by toast.promise
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">This password reset link is invalid or has expired.</p>
          <Button onClick={() => router.push('/')}>Return to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-gray-600">
            Enter your new password below
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-sm text-indigo-600"
            onClick={() => router.push('/')}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  )
} 
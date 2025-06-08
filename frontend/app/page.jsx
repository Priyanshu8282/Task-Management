"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import toast, { Toaster } from 'react-hot-toast'
import axios from "axios"

const BASE_URL = "http://localhost:8000" // Update this if your backend URL changes

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    rememberMe: false
  })

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const forgotPasswordPromise = api.post('/user/forgot-password', {
      email: formData.email
    })

    toast.promise(forgotPasswordPromise, {
      loading: 'Sending reset instructions...',
      success: () => {
        setShowForgotPassword(false)
        setFormData(prev => ({ ...prev, email: '' }))
        return 'Password reset instructions sent to your email!'
      },
      error: (err) => err.response?.data?.message || 'Failed to send reset instructions'
    })

    try {
      await forgotPasswordPromise
    } catch (error) {
      // Error is already handled by toast.promise
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const registerPromise = api.post('/user/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password
    })

    toast.promise(registerPromise, {
      loading: 'Creating your account...',
      success: (response) => {
        const { data } = response
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.newUser))
        setIsLogin(true)
        setFormData({
          email: "",
          password: "",
          name: "",
          rememberMe: false
        })
        return 'Registration successful! Please login to continue.'
      },
      error: (err) => err.response?.data?.message || 'Registration failed'
    })

    try {
      await registerPromise
    } catch (error) {
      // Error is already handled by toast.promise
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const loginPromise = api.post('/user/login', {
      email: formData.email,
      password: formData.password
    })

    toast.promise(loginPromise, {
      loading: 'Signing in...',
      success: (response) => {
        const { data } = response
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push("/tasks")
        return 'Welcome back!'
      },
      error: (err) => err.response?.data?.message || 'Login failed'
    })

    try {
      await loginPromise
    } catch (error) {
      // Error is already handled by toast.promise
    } finally {
      setIsLoading(false)
    }
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
        {/* Logo and Title */}
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {showForgotPassword ? "Reset Password" : "Welcome to Project M."}
          </h2>
          <p className="mt-2 text-gray-600">
            {showForgotPassword 
              ? "Enter your email to receive reset instructions" 
              : isLogin 
                ? "Sign in to your account" 
                : "Create your account"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowForgotPassword(false)}
                  disabled={isLoading}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          ) : (
            <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked })}
                        disabled={isLoading}
                      />
                      <Label htmlFor="remember" className="text-sm">Remember me</Label>
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-sm text-indigo-600" 
                      onClick={() => setShowForgotPassword(true)}
                      disabled={isLoading}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        disabled={isLoading}
                    />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      required
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Button variant="link" className="p-0 h-auto text-sm text-indigo-600" disabled={isLoading}>
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-sm text-indigo-600" disabled={isLoading}>
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Footer */}
        {!showForgotPassword && (
          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-indigo-600"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </p>
        )}
      </div>
    </div>
  )
}
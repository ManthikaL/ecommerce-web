"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  age: number
  phone: string
  shippingAddress: {
    firstName: string
    lastName: string
    company?: string
    street: string
    apartment?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    company?: string
    street: string
    apartment?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences: {
    newsletter: boolean
    smsUpdates: boolean
    defaultShippingMethod: string
  }
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists in localStorage (mock database)
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const existingUser = users.find((u: any) => u.email === userData.email)

    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || "",
      email: userData.email,
      age: userData.age || 0,
      phone: userData.phone || "",
      shippingAddress: userData.shippingAddress || {
        firstName: userData.name?.split(" ")[0] || "",
        lastName: userData.name?.split(" ").slice(1).join(" ") || "",
        company: "",
        street: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
      billingAddress: userData.billingAddress || {
        firstName: userData.name?.split(" ")[0] || "",
        lastName: userData.name?.split(" ").slice(1).join(" ") || "",
        company: "",
        street: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
      preferences: userData.preferences || {
        newsletter: false,
        smsUpdates: false,
        defaultShippingMethod: "standard",
      },
      createdAt: new Date().toISOString(),
    }

    // Store user with password for login
    const userWithPassword = { ...newUser, password: userData.password }
    users.push(userWithPassword)
    localStorage.setItem("users", JSON.stringify(users))

    // Set current user (without password)
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Update in users array too
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData }
        localStorage.setItem("users", JSON.stringify(users))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

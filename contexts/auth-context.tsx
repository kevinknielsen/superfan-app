"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
  walletBalance?: number
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  signup: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { login: privyLogin, logout: privyLogout, authenticated, user: privyUser } = usePrivy()
  const { wallets } = useWallets()

  useEffect(() => {
    if (authenticated && privyUser) {
      const userData: User = {
        id: privyUser.id,
        name: privyUser.email?.address || "Anonymous",
        email: privyUser.email?.address || "",
        walletBalance: 0,
        avatar: "/placeholder-avatars/avatar-1.png",
      }
      setUser(userData)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [authenticated, privyUser])

  const login = async () => {
    setIsLoading(true)
    try {
      await privyLogin()
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async () => {
    setIsLoading(true)
    try {
      await privyLogin()
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    privyLogout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, signup, logout }}>
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

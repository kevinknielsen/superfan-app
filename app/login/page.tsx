"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams() || new URLSearchParams()
  const redirectPath = searchParams.get("redirect") || "/browse"
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      router.push(redirectPath)
    }
  }, [isAuthenticated, redirectPath, router])

  const handleLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      await login()
      router.push(redirectPath)
    } catch (err) {
      setError("Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-gray-600">
            Or{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-6">
            <Button
              onClick={handleLogin}
              className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in with Email or Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

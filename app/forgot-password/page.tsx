"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Here you would typically call an API to send a password reset email
    console.log("Password reset requested for:", email)

    // For demo purposes, we'll just show the success state
    setSubmitted(true)
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/login" className="font-bold text-2xl flex items-center justify-center">
            <span className="border-r border-black pr-2 mr-2">SUPERFAN ONE</span>
            <span className="text-xs text-gray-500">BETA</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Reset your password</h2>
          <p className="mt-2 text-gray-600">
            {!submitted
              ? "Enter your email and we'll send you instructions to reset your password"
              : "Check your email for instructions to reset your password"}
          </p>
        </div>

        {!submitted ? (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]">
                Send Reset Instructions
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Reset instructions sent! Check your email.
            </div>

            <p className="text-gray-600 mb-6">
              If you don't see the email in your inbox, please check your spam folder. The email should arrive within a
              few minutes.
            </p>

            <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full">
              Try a different email
            </Button>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

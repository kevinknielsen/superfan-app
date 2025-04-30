"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { PrivyProvider } from "@privy-io/react-auth"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            loginMethods: ["email", "wallet"],
            appearance: {
              theme: "light",
              accentColor: "#0f172a",
              showWalletLoginFirst: true,
            },
          }}
        >
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              {/* Background patterns and decorations */}
              <div className="fixed inset-0 -z-10">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 w-full h-full opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px]" />

                {/* Decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/20 blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-100/20 blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-green-100/20 blur-3xl" />

                {/* Floating circles */}
                <div className="absolute top-20 left-[15%] w-4 h-4 rounded-full bg-blue-200/30 animate-float-slow" />
                <div className="absolute top-[40%] right-[10%] w-6 h-6 rounded-full bg-purple-200/30 animate-float-medium" />
                <div className="absolute bottom-[15%] left-[30%] w-5 h-5 rounded-full bg-green-200/30 animate-float-fast" />

                {/* Music-themed subtle elements */}
                <div className="absolute top-[20%] right-[20%] w-32 h-32 border border-gray-200/30 rounded-full animate-spin-slow" />
                <div className="absolute bottom-[25%] left-[15%] w-24 h-24 border border-gray-200/30 rounded-full animate-spin-slow-reverse" />
              </div>

              {/* Main content */}
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </AuthProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}

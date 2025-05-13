"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { PrivyProvider } from "@privy-io/react-auth";
import { SplitsProvider } from "@0xsplits/splits-sdk-react";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

const NEXT_PUBLIC_SPLITS_API_KEY = process.env.NEXT_PUBLIC_SPLITS_API_KEY || "";
const NEXT_PUBLIC_PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

if (process.env.NODE_ENV === "development") {
  if (!NEXT_PUBLIC_SPLITS_API_KEY) {
    console.warn("Warning: NEXT_PUBLIC_SPLITS_API_KEY is not defined");
  }
  if (!NEXT_PUBLIC_PRIVY_APP_ID) {
    console.warn("Warning: NEXT_PUBLIC_PRIVY_APP_ID is not defined");
  }
}

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const splitsConfig = {
  chainId: 8453,
  publicClient,
  apiConfig: {
    apiKey: NEXT_PUBLIC_SPLITS_API_KEY,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SplitsProvider config={splitsConfig}>
            <PrivyProvider
              appId={NEXT_PUBLIC_PRIVY_APP_ID}
              config={{
                loginMethods: ["email", "sms", "google"],
                appearance: {
                  theme: "light", // This should be synced with the ThemeProvider
                  accentColor: "#0f172a",
                },
                embeddedWallets: {
                  createOnLogin: "all-users",
                },
              }}
            >
              <AuthProvider>
                {/* Background patterns and decorations */}
                <div className="fixed inset-0 -z-10 bg-background">
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 w-full h-full opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px]" />

                  {/* Decorative elements - with will-change optimization */}
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/20 blur-3xl" />
                  <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-100/20 blur-3xl" />
                  <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-green-100/20 blur-3xl" />

                  {/* Floating circles - with will-change optimization */}
                  <div className="absolute top-20 left-[15%] w-4 h-4 rounded-full bg-blue-200/30 animate-float-slow will-change-transform" />
                  <div className="absolute top-[40%] right-[10%] w-6 h-6 rounded-full bg-purple-200/30 animate-float-medium will-change-transform" />
                  <div className="absolute bottom-[15%] left-[30%] w-5 h-5 rounded-full bg-green-200/30 animate-float-fast will-change-transform" />

                  {/* Music-themed subtle elements - with will-change optimization */}
                  <div className="absolute top-[20%] right-[20%] w-32 h-32 border border-gray-200/30 rounded-full animate-spin-slow will-change-transform" />
                  <div className="absolute bottom-[25%] left-[15%] w-24 h-24 border border-gray-200/30 rounded-full animate-spin-slow-reverse will-change-transform" />
                </div>

                {/* Main content - fix nested min-h-screen issue */}
                <div className="relative flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </AuthProvider>
            </PrivyProvider>
          </SplitsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

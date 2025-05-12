"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  walletBalance?: number;
  wallet_address?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { login: privyLogin, logout: privyLogout, authenticated, user: privyUser } = usePrivy();
  const { wallets } = useWallets();

  // Modularized user state setup logic
  const setupUserState = (authenticated: boolean, privyUser: any, wallets: any[]): User | null => {
    if (authenticated && privyUser) {
      const wallet_address = wallets[0]?.address || undefined;
      return {
        id: privyUser.id,
        name: privyUser.email?.address || "Anonymous",
        email: privyUser.email?.address || "",
        walletBalance: 0,
        avatar: "/placeholder-avatars/avatar-1.png",
        wallet_address,
      };
    }
    return null;
  };

  // Updated useEffect to use modularized logic
  useEffect(() => {
    const userData = setupUserState(authenticated, privyUser, wallets);
    setUser(userData);
    setIsAuthenticated(!!userData);
    setIsLoading(false);
  }, [authenticated, privyUser, wallets]);

  const login = async () => {
    setIsLoading(true);
    try {
      await privyLogin();
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await privyLogout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

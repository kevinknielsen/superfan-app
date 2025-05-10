"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { UserAvatar } from "@/components/ui/user-avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWalletBalance } from "@/hooks/use-wallet-balance";

function ProfileDropdown({ user, logout }: { user: any; logout: () => Promise<void> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center"
        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        aria-expanded={isProfileDropdownOpen}
        aria-haspopup="menu"
      >
        <UserAvatar src={user?.avatar} name={user?.name} size={32} />
      </button>
      {isProfileDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Portfolio
          </Link>
          <Link href="/unlocks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Unlocks
          </Link>
          <Link href="/settings/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Wallet
          </Link>
          <Link href="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          <Link href="/settings/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Notifications
          </Link>
          <Link href="/settings/documents" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Documents
          </Link>
          <div className="border-t border-gray-100 my-1"></div>
          <a
            href="https://twitter.com/superfanone"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Follow on X
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  logout,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  logout: () => void;
}) {
  return (
    <div className="md:hidden py-4 px-4 bg-[#0f172a] border-t border-gray-800 animate-in slide-in-from-top duration-300">
      <nav className="flex flex-col space-y-4">
        <Link href="/launch" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
          Launch
        </Link>
        <Link href="/projects" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
          Projects
        </Link>
        <Link href="/groups" className="text-gray-300 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
          Curators
        </Link>
        <Link
          href="/settings/profile"
          className="text-gray-300 hover:text-white py-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          Profile
        </Link>
        <Link
          href="/settings/wallet"
          className="text-gray-300 hover:text-white py-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          Wallet
        </Link>
        <Link
          href="/settings/notifications"
          className="text-gray-300 hover:text-white py-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          Notifications
        </Link>
        <Link
          href="/settings/documents"
          className="text-gray-300 hover:text-white py-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          Documents
        </Link>
        <button
          onClick={() => {
            logout();
            setMobileMenuOpen(false);
          }}
          className="text-left text-gray-300 hover:text-white py-2 flex items-center"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </button>
      </nav>
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { balance, loading } = useWalletBalance();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsProfileDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Don't show header on login and signup pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password") {
    return null;
  }

  // Only show header for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 py-4 bg-[#0f172a] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/browse" className="flex items-center">
            <Image
              src="/superfan-logo-white.png"
              alt="Superfan Logo"
              width={220}
              height={40}
              className="h-10 w-auto object-contain object-left"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6 ml-8">
            <Link href="/launch" className="text-gray-300 hover:text-white">
              Launch
            </Link>
            <Link href="/projects" className="text-gray-300 hover:text-white">
              Projects
            </Link>
            <Link href="/groups" className="text-gray-300 hover:text-white">
              Curators
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center">
            <Link href="/settings/wallet" className="mr-4 text-sm hover:text-gray-300">
              Wallet • ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
            </Link>
            {/* Replace the avatar code with the UserAvatar component */}
            <ProfileDropdown user={user} logout={logout} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/settings/wallet" className="mr-4 text-sm">
            ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
          </Link>
          <button
            type="button"
            className="text-white p-2 rounded-md hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} logout={logout} />
      )}
    </header>
  );
}

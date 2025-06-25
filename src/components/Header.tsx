"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Bot,
  Zap,
  Shield,
  Calendar,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import ThemeSelector, { CompactThemeSelector } from "./ThemeSelector";
import LoginModal from "./LoginModal";
import { useOptimizedNavigation } from "@/utils/navigationOptimizer";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  // This interface is intentionally empty for now but can be extended with props in the future
  // It serves as a placeholder for potential future properties
}

export default function Header({}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { navigateWithPreload } = useOptimizedNavigation();
  const { user, signOut, loading } = useAuth();

  // Search functionality removed

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex flex-col items-center">
              <div className="flex items-center">
                <span className="text-sm text-foreground font-mono">the</span>
                <Image
                  src="/superagents-text-logo.svg"
                  alt="SuperAgents"
                  width={240}
                  height={64}
                  className="h-12 w-auto"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Search removed */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            {/* Search functionality removed */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => navigateWithPreload("/agents")}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Agents
              </button>
              <button
                onClick={() => navigateWithPreload("/rules")}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Rules
              </button>
              <button
                onClick={() => navigateWithPreload("/mcps")}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                MCPs
              </button>
              <button
                onClick={() => navigateWithPreload("/hackathon")}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Hackathon
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {/* Settings Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {isSettingsMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm font-medium text-foreground border-b border-border">
                        Settings
                      </div>
                      <div className="px-4 py-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          Theme
                        </div>
                        <ThemeSelector className="w-full" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {user.user_metadata?.name || user.email}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                          {user.email}
                        </div>
                        <button
                          onClick={() => {
                            navigateWithPreload("/profile");
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="btn-primary text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => {
                navigateWithPreload("/agents");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              agents
            </button>
            <button
              onClick={() => {
                navigateWithPreload("/rules");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              rules
            </button>
            <button
              onClick={() => {
                navigateWithPreload("/mcps");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              mcps
            </button>
            <button
              onClick={() => {
                navigateWithPreload("/hackathon");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              hackathon
            </button>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="mb-3">
                <div className="text-sm font-mono text-muted-foreground mb-2">
                  Settings
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Theme</span>
                  <CompactThemeSelector className="" />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground border border-border rounded">
                    {user.user_metadata?.name || user.email}
                  </div>
                  <button
                    onClick={() => {
                      navigateWithPreload("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                  >
                    profile
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    sign_out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full text-sm"
                >
                  sign_in
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          // Optional: Add any success handling here
        }}
      />
    </header>
  );
}

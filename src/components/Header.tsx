'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X, Bot, Zap, Shield, TrendingUp, Settings } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useOptimizedNavigation } from '@/utils/navigationOptimizer';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { navigateWithPreload } = useOptimizedNavigation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/superagents-text-logo.svg"
                alt="SuperAgents"
                width={240}
                height={64}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="// Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 pr-4 py-2"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => navigateWithPreload('/agents')}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Agents
              </button>
              <button
                onClick={() => navigateWithPreload('/rules')}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Rules
              </button>
              <button
                onClick={() => navigateWithPreload('/mcps')}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                MCPs
              </button>
              <button
                onClick={() => navigateWithPreload('/trending')}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <ThemeSelector className="" />
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="btn-primary text-sm">
                Sign In
              </button>
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

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="// search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 pr-4 py-2"
            />
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => { navigateWithPreload('/agents'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              agents
            </button>
            <button
              onClick={() => { navigateWithPreload('/rules'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              rules
            </button>
            <button
              onClick={() => { navigateWithPreload('/mcps'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              mcps
            </button>
            <button
              onClick={() => { navigateWithPreload('/trending'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              trending
            </button>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Theme</span>
                <ThemeSelector className="" />
              </div>
              <button className="btn-primary w-full text-sm">
                sign_in
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Bot, Settings } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div className="flex-shrink-0 flex items-center">
              <Bot className="w-8 h-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground font-mono">True Agents Hub</span>
            </div>
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
              <Link
                href="/rules"
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors"
              >
                Rules
              </Link>
              <Link
                href="/trending"
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors"
              >
                Trending
              </Link>
              <Link
                href="/mcps"
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium font-mono transition-colors"
              >
                MCPs
              </Link>

            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
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
            <Link
              href="/"
              className="block text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors"
            >
              agents
            </Link>
            <Link
              href="/rules"
              className="block text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors"
            >
              rules
            </Link>
            <Link
              href="/trending"
              className="block text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors"
            >
              trending
            </Link>
            <Link
              href="/mcps"
              className="block text-muted-foreground hover:text-primary px-3 py-2 text-base font-medium font-mono transition-colors"
            >
              mcps
            </Link>

            <div className="pt-4 border-t border-border">
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
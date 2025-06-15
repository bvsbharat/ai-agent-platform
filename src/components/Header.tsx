'use client';

import { useState } from 'react';
import { Search, Menu, X, Bot, User, Settings } from 'lucide-react';

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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Bot className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI Agent Platform</span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-8">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Agents
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Rules
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Trending
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Jobs
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                MCPs
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Generate
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Members
              </a>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Sign In
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            <a
              href="#"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
            >
              Agents
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
            >
              Rules
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
            >
              Trending
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
            >
              Jobs
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
            >
              MCPs
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
            >
              Generate
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
            >
              Members
            </a>
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
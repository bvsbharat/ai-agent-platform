'use client';

import React, { useState } from 'react';
import { Settings, Palette, Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';

interface ThemeSelectorProps {
  className?: string;
}

export default function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemeIcon = (themeId: string) => {
    switch (themeId) {
      case 'dark-plus':
        return <Monitor className="w-4 h-4" />;
      case 'monokai':
        return <Palette className="w-4 h-4" />;
      case 'dracula':
        return <Moon className="w-4 h-4" />;
      case 'github-dark':
        return <Monitor className="w-4 h-4" />;
      case 'one-dark-pro':
        return <Moon className="w-4 h-4" />;
      case 'material-dark':
        return <Palette className="w-4 h-4" />;
      case 'synthwave':
        return <Sun className="w-4 h-4" />;
      case 'nord':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  const getThemePreview = (theme: Theme) => {
    return (
      <div className="flex space-x-1">
        <div 
          className="w-3 h-3 rounded-full border border-white/20"
          style={{ backgroundColor: `hsl(${theme.colors.background})` }}
        />
        <div 
          className="w-3 h-3 rounded-full border border-white/20"
          style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
        />
        <div 
          className="w-3 h-3 rounded-full border border-white/20"
          style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
        />
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors duration-200 font-mono text-sm"
        title="Change Theme"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 p-4">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-border">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-popover-foreground font-mono">Developer Themes</h3>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-md transition-all duration-200 font-mono text-left group ${
                    currentTheme.id === theme.id
                      ? 'bg-primary/10 border border-primary/30 text-primary'
                      : 'bg-card hover:bg-card/80 border border-transparent hover:border-border text-card-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                      {getThemeIcon(theme.id)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {theme.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">
                        Font: {theme.fontFamily.split(',')[0].replace(/var\(--font-geist-[^)]+\),?\s*/, '').replace(/"/g, '').trim()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getThemePreview(theme)}
                    {currentTheme.id === theme.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground font-mono">
                💡 Themes are inspired by popular VSCode themes
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Compact version for mobile or smaller spaces
export function CompactThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors duration-200"
        title={`Current theme: ${currentTheme.name}`}
      >
        <Palette className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-50 p-3">
            <div className="grid grid-cols-2 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-md transition-all duration-200 text-left text-xs font-mono ${
                    currentTheme.id === theme.id
                      ? 'bg-primary/10 border border-primary/30 text-primary'
                      : 'bg-card hover:bg-card/80 border border-transparent hover:border-border text-card-foreground'
                  }`}
                  title={theme.description}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{theme.name}</span>
                    {currentTheme.id === theme.id && (
                      <Check className="w-3 h-3 text-primary ml-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
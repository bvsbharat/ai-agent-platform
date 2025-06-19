'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'dark-plus',
    name: 'Dark+ (default dark)',
    description: 'VSCode\'s default dark theme with enhanced contrast',
    fontFamily: 'var(--font-geist-mono), "JetBrains Mono", "Fira Code", Consolas, monospace',
    colors: {
      background: '0 0% 7%',
      foreground: '0 0% 85%',
      card: '0 0% 9%',
      cardForeground: '0 0% 90%',
      popover: '0 0% 9%',
      popoverForeground: '0 0% 90%',
      primary: '210 100% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 15%',
      secondaryForeground: '0 0% 80%',
      muted: '0 0% 12%',
      mutedForeground: '0 0% 60%',
      accent: '210 100% 60%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 90%',
      border: '0 0% 20%',
      input: '0 0% 15%',
      ring: '210 100% 60%',
    },
  },
  {
    id: 'dark-plus-light',
    name: 'Dark+ Light',
    description: 'Pure white variant of VSCode\'s theme',
    fontFamily: 'var(--font-geist-mono), "JetBrains Mono", "Fira Code", Consolas, monospace',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      card: '0 0% 98%',
      cardForeground: '0 0% 10%',
      popover: '0 0% 98%',
      popoverForeground: '0 0% 10%',
      primary: '210 100% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '0 0% 15%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      accent: '210 100% 50%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 55%',
      destructiveForeground: '0 0% 100%',
      border: '0 0% 90%',
      input: '0 0% 95%',
      ring: '210 100% 50%',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Classic Monokai theme with vibrant colors',
    fontFamily: 'var(--font-geist-mono), "Source Code Pro", "Ubuntu Mono", monospace',
    colors: {
      background: '0 0% 13%',
      foreground: '60 30% 96%',
      card: '0 0% 16%',
      cardForeground: '60 30% 96%',
      popover: '0 0% 16%',
      popoverForeground: '60 30% 96%',
      primary: '81 100% 61%',
      primaryForeground: '0 0% 13%',
      secondary: '0 0% 20%',
      secondaryForeground: '60 30% 96%',
      muted: '0 0% 18%',
      mutedForeground: '0 0% 60%',
      accent: '326 100% 74%',
      accentForeground: '0 0% 13%',
      destructive: '0 100% 67%',
      destructiveForeground: '60 30% 96%',
      border: '0 0% 25%',
      input: '0 0% 20%',
      ring: '81 100% 61%',
    },
  },
  {
    id: 'monokai-light',
    name: 'Monokai Light',
    description: 'Pure white variant of the classic Monokai theme',
    fontFamily: 'var(--font-geist-mono), "Source Code Pro", "Ubuntu Mono", monospace',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      card: '0 0% 98%',
      cardForeground: '0 0% 10%',
      popover: '0 0% 98%',
      popoverForeground: '0 0% 10%',
      primary: '81 80% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '0 0% 10%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      accent: '326 70% 55%',
      accentForeground: '0 0% 100%',
      destructive: '0 80% 55%',
      destructiveForeground: '0 0% 100%',
      border: '0 0% 90%',
      input: '0 0% 95%',
      ring: '81 80% 45%',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark theme with purple accents',
    fontFamily: 'var(--font-geist-mono), "Operator Mono", "Cascadia Code", monospace',
    colors: {
      background: '231 15% 18%',
      foreground: '60 30% 96%',
      card: '232 14% 21%',
      cardForeground: '60 30% 96%',
      popover: '232 14% 21%',
      popoverForeground: '60 30% 96%',
      primary: '265 89% 78%',
      primaryForeground: '231 15% 18%',
      secondary: '233 14% 26%',
      secondaryForeground: '60 30% 96%',
      muted: '233 14% 24%',
      mutedForeground: '0 0% 60%',
      accent: '326 100% 74%',
      accentForeground: '231 15% 18%',
      destructive: '0 100% 67%',
      destructiveForeground: '60 30% 96%',
      border: '233 14% 30%',
      input: '233 14% 26%',
      ring: '265 89% 78%',
    },
  },
  {
    id: 'coffee-delight',
    name: 'Coffee Delight',
    description: 'Warm coffee-inspired theme for your wife',
    fontFamily: 'var(--font-geist-sans), "Inter", "Roboto", sans-serif',
    colors: {
      background: '30 15% 8%',
      foreground: '30 25% 85%',
      card: '30 15% 12%',
      cardForeground: '30 25% 90%',
      popover: '30 15% 12%',
      popoverForeground: '30 25% 90%',
      primary: '25 60% 55%',
      primaryForeground: '30 15% 8%',
      secondary: '30 15% 18%',
      secondaryForeground: '30 25% 85%',
      muted: '30 15% 15%',
      mutedForeground: '30 15% 60%',
      accent: '35 70% 60%',
      accentForeground: '30 15% 8%',
      destructive: '0 70% 60%',
      destructiveForeground: '30 25% 90%',
      border: '30 15% 25%',
      input: '30 15% 18%',
      ring: '25 60% 55%',
    },
  },
  {
    id: 'coffee-light',
    name: 'Coffee Light',
    description: 'Pure white coffee theme with warm accents',
    fontFamily: 'var(--font-geist-sans), "Inter", "Roboto", sans-serif',
    colors: {
      background: '0 0% 100%',
      foreground: '30 30% 10%',
      card: '0 0% 98%',
      cardForeground: '30 30% 10%',
      popover: '0 0% 98%',
      popoverForeground: '30 30% 10%',
      primary: '25 65% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '30 30% 10%',
      muted: '0 0% 96%',
      mutedForeground: '30 20% 45%',
      accent: '35 75% 55%',
      accentForeground: '0 0% 100%',
      destructive: '0 75% 55%',
      destructiveForeground: '0 0% 100%',
      border: '0 0% 90%',
      input: '0 0% 95%',
      ring: '25 65% 45%',
    },
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    description: 'GitHub\'s dark theme for developers',
    fontFamily: 'var(--font-geist-mono), "SF Mono", "Monaco", Consolas, monospace',
    colors: {
      background: '220 13% 9%',
      foreground: '213 27% 84%',
      card: '215 14% 11%',
      cardForeground: '213 27% 84%',
      popover: '215 14% 11%',
      popoverForeground: '213 27% 84%',
      primary: '212 92% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '217 19% 15%',
      secondaryForeground: '213 27% 84%',
      muted: '217 19% 13%',
      mutedForeground: '0 0% 60%',
      accent: '212 92% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 85% 63%',
      destructiveForeground: '0 0% 100%',
      border: '217 19% 20%',
      input: '217 19% 15%',
      ring: '212 92% 45%',
    },
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    description: 'Pure white variant of GitHub\'s developer theme',
    fontFamily: 'var(--font-geist-mono), "SF Mono", "Monaco", Consolas, monospace',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      card: '0 0% 98%',
      cardForeground: '0 0% 10%',
      popover: '0 0% 98%',
      popoverForeground: '0 0% 10%',
      primary: '212 92% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '0 0% 10%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      accent: '212 92% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 85% 55%',
      destructiveForeground: '0 0% 100%',
      border: '0 0% 90%',
      input: '0 0% 95%',
      ring: '212 92% 45%',
    },
  },
  {
    id: 'one-dark-pro',
    name: 'One Dark Pro',
    description: 'Atom\'s iconic One Dark theme',
    fontFamily: 'var(--font-geist-mono), "Menlo", "DejaVu Sans Mono", monospace',
    colors: {
      background: '220 13% 18%',
      foreground: '220 14% 71%',
      card: '220 13% 20%',
      cardForeground: '220 14% 71%',
      popover: '220 13% 20%',
      popoverForeground: '220 14% 71%',
      primary: '207 82% 66%',
      primaryForeground: '220 13% 18%',
      secondary: '220 13% 25%',
      secondaryForeground: '220 14% 71%',
      muted: '220 13% 23%',
      mutedForeground: '0 0% 60%',
      accent: '286 60% 67%',
      accentForeground: '220 13% 18%',
      destructive: '355 65% 65%',
      destructiveForeground: '220 14% 71%',
      border: '220 13% 30%',
      input: '220 13% 25%',
      ring: '207 82% 66%',
    },
  },
  {
    id: 'one-dark-light',
    name: 'One Dark Light',
    description: 'Pure white variant of Atom\'s One Dark theme',
    fontFamily: 'var(--font-geist-mono), "Menlo", "DejaVu Sans Mono", monospace',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      card: '0 0% 98%',
      cardForeground: '0 0% 10%',
      popover: '0 0% 98%',
      popoverForeground: '0 0% 10%',
      primary: '207 82% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '0 0% 10%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      accent: '286 60% 55%',
      accentForeground: '0 0% 100%',
      destructive: '355 65% 55%',
      destructiveForeground: '0 0% 100%',
      border: '0 0% 90%',
      input: '0 0% 95%',
      ring: '207 82% 50%',
    },
  },
  {
    id: 'material-dark',
    name: 'Material Dark',
    description: 'Google\'s Material Design dark theme',
    fontFamily: 'var(--font-geist-sans), "Roboto Mono", "Noto Sans Mono", monospace',
    colors: {
      background: '200 23% 8%',
      foreground: '0 0% 87%',
      card: '200 23% 10%',
      cardForeground: '0 0% 87%',
      popover: '200 23% 10%',
      popoverForeground: '0 0% 87%',
      primary: '199 89% 48%',
      primaryForeground: '0 0% 100%',
      secondary: '200 23% 15%',
      secondaryForeground: '0 0% 87%',
      muted: '200 23% 12%',
      mutedForeground: '0 0% 60%',
      accent: '199 89% 48%',
      accentForeground: '0 0% 100%',
      destructive: '0 91% 71%',
      destructiveForeground: '0 0% 100%',
      border: '200 23% 20%',
      input: '200 23% 15%',
      ring: '199 89% 48%',
    },
  },
  {
    id: 'material-light',
    name: 'Material Light',
    description: 'Pure white variant of Material Design theme',
    fontFamily: 'var(--font-geist-sans), "Roboto Mono", "Noto Sans Mono", monospace',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      card: '0 0% 98%',
      cardForeground: '0 0% 10%',
      popover: '0 0% 98%',
      popoverForeground: '0 0% 10%',
      primary: '199 89% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '0 0% 10%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      accent: '199 89% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 91% 55%',
      destructiveForeground: '0 0% 100%',
      border: '0 0% 90%',
      input: '0 0% 95%',
      ring: '199 89% 45%',
    },
  },
  {
    id: 'synthwave',
    name: 'SynthWave \'84',
    description: 'Retro cyberpunk theme with neon colors',
    fontFamily: 'var(--font-geist-mono), "Courier New", "Lucida Console", monospace',
    colors: {
      background: '260 25% 8%',
      foreground: '300 100% 85%',
      card: '260 25% 10%',
      cardForeground: '300 100% 85%',
      popover: '260 25% 10%',
      popoverForeground: '300 100% 85%',
      primary: '315 100% 70%',
      primaryForeground: '260 25% 8%',
      secondary: '260 25% 15%',
      secondaryForeground: '300 100% 85%',
      muted: '260 25% 12%',
      mutedForeground: '0 0% 60%',
      accent: '180 100% 70%',
      accentForeground: '260 25% 8%',
      destructive: '0 100% 70%',
      destructiveForeground: '300 100% 85%',
      border: '260 25% 20%',
      input: '260 25% 15%',
      ring: '315 100% 70%',
    },
  },
  {
    id: 'synthwave-light',
    name: 'SynthWave Light',
    description: 'Pure white cyberpunk theme with vibrant accents',
    fontFamily: 'var(--font-geist-mono), "Courier New", "Lucida Console", monospace',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      card: '0 0% 98%',
      cardForeground: '0 0% 10%',
      popover: '0 0% 98%',
      popoverForeground: '0 0% 10%',
      primary: '315 80% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '0 0% 10%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      accent: '180 80% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 80% 55%',
      destructiveForeground: '0 0% 100%',
      border: '0 0% 90%',
      input: '0 0% 95%',
      ring: '315 80% 55%',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic, north-bluish clean theme',
    fontFamily: 'var(--font-geist-mono), "IBM Plex Mono", "Anonymous Pro", monospace',
    colors: {
      background: '220 16% 22%',
      foreground: '218 27% 94%',
      card: '220 16% 24%',
      cardForeground: '218 27% 94%',
      popover: '220 16% 24%',
      popoverForeground: '218 27% 94%',
      primary: '193 43% 67%',
      primaryForeground: '220 16% 22%',
      secondary: '220 16% 30%',
      secondaryForeground: '218 27% 94%',
      muted: '220 16% 26%',
      mutedForeground: '0 0% 60%',
      accent: '179 25% 65%',
      accentForeground: '220 16% 22%',
      destructive: '354 42% 56%',
      destructiveForeground: '218 27% 94%',
      border: '220 16% 35%',
      input: '220 16% 30%',
      ring: '193 43% 67%',
    },
  },
  {
    id: 'nord-light',
    name: 'Nord Light',
    description: 'Pure white variant of the Arctic Nord theme',
    fontFamily: 'var(--font-geist-mono), "IBM Plex Mono", "Anonymous Pro", monospace',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      card: '0 0% 98%',
      cardForeground: '0 0% 10%',
      popover: '0 0% 98%',
      popoverForeground: '0 0% 10%',
      primary: '193 43% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '0 0% 10%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      accent: '179 25% 55%',
      accentForeground: '0 0% 100%',
      destructive: '354 42% 55%',
      destructiveForeground: '0 0% 100%',
      border: '0 0% 90%',
      input: '0 0% 95%',
      ring: '193 43% 50%',
    },
  },
  {
    id: 'light-modern',
    name: 'Light Modern',
    description: 'Clean white theme with modern typography',
    fontFamily: 'var(--font-geist-sans), "Inter", "Roboto", sans-serif',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      popover: '0 0% 100%',
      popoverForeground: '0 0% 3.9%',
      primary: '221.2 83.2% 53.3%',
      primaryForeground: '210 40% 98%',
      secondary: '210 40% 96%',
      secondaryForeground: '222.2 84% 4.9%',
      muted: '210 40% 96%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      accentForeground: '222.2 84% 4.9%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '221.2 83.2% 53.3%',
    },
  },
  {
    id: 'light-minimal',
    name: 'Light Minimal',
    description: 'Minimalist white theme with subtle accents',
    fontFamily: 'var(--font-geist-mono), "SF Mono", "Monaco", Consolas, monospace',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 9%',
      card: '0 0% 98%',
      cardForeground: '0 0% 9%',
      popover: '0 0% 98%',
      popoverForeground: '0 0% 9%',
      primary: '0 0% 9%',
      primaryForeground: '0 0% 98%',
      secondary: '0 0% 96%',
      secondaryForeground: '0 0% 9%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      accent: '0 0% 96%',
      accentForeground: '0 0% 9%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 98%',
      border: '0 0% 90%',
      input: '0 0% 90%',
      ring: '0 0% 9%',
    },
  },
  {
    id: 'coffee-cream',
    name: 'Coffee Cream',
    description: 'Warm cream background with coffee accents',
    fontFamily: 'var(--font-geist-sans), "Inter", "Roboto", sans-serif',
    colors: {
      background: '30 40% 98%',
      foreground: '30 40% 15%',
      card: '30 30% 96%',
      cardForeground: '30 40% 15%',
      popover: '30 30% 96%',
      popoverForeground: '30 40% 15%',
      primary: '25 60% 45%',
      primaryForeground: '30 40% 98%',
      secondary: '30 20% 92%',
      secondaryForeground: '30 40% 15%',
      muted: '30 20% 92%',
      mutedForeground: '30 20% 40%',
      accent: '35 50% 85%',
      accentForeground: '30 40% 15%',
      destructive: '0 70% 50%',
      destructiveForeground: '30 40% 98%',
      border: '30 20% 85%',
      input: '30 20% 85%',
      ring: '25 60% 45%',
    },
  },
  {
    id: 'light-blue',
    name: 'Light Blue',
    description: 'Soft blue-tinted white theme',
    fontFamily: 'var(--font-geist-sans), "Inter", "Roboto", sans-serif',
    colors: {
      background: '210 40% 98%',
      foreground: '210 40% 8%',
      card: '210 30% 96%',
      cardForeground: '210 40% 8%',
      popover: '210 30% 96%',
      popoverForeground: '210 40% 8%',
      primary: '212 92% 45%',
      primaryForeground: '210 40% 98%',
      secondary: '210 20% 92%',
      secondaryForeground: '210 40% 8%',
      muted: '210 20% 92%',
      mutedForeground: '210 20% 40%',
      accent: '210 30% 88%',
      accentForeground: '210 40% 8%',
      destructive: '0 84% 60%',
      destructiveForeground: '210 40% 98%',
      border: '210 20% 85%',
      input: '210 20% 85%',
      ring: '212 92% 45%',
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedThemeId = localStorage.getItem('theme');
    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });
    
    // Apply font family
    root.style.setProperty('--theme-font-family', currentTheme.fontFamily);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
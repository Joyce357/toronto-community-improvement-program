'use client'
// ─── Theme Context & Provider ───────────────────────────────────────────────
// Supports 'light', 'dark', and 'system' modes.
// Persists selection to localStorage and listens for system preference changes.

import React, { createContext, useContext, useEffect, useCallback } from 'react'

export type Theme = 'light'
export type ResolvedTheme = 'light'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
})

const THEME_STORAGE_KEY = 'boc_theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Enforce light mode on document element immediately and on mount
  useEffect(() => {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY)
    } catch {
      // ignore
    }
    const root = document.documentElement
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }, [])

  const setTheme = useCallback(() => {
    // Light mode is permanent per client specification
    const root = document.documentElement
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'light', resolvedTheme: 'light', setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  return context || { theme: 'light', resolvedTheme: 'light', setTheme: () => {} }
}

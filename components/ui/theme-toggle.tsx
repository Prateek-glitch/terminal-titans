"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sun, Moon, Monitor } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // For now, we'll keep it as dark theme since the app is designed for it
    // This can be expanded later with full theme switching
    document.documentElement.classList.add('dark')
  }, [])

  const toggleTheme = () => {
    // For now, just show the toggle but keep dark theme
    // Future enhancement: implement full theme switching
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="glassmorphic-light p-2 hover:bg-white/10 border border-white/10"
          >
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-blue-400" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-400" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Theme: {theme === 'dark' ? 'Dark Space' : 'Light Mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
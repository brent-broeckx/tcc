"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    if (!mounted) {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />
    }

    if (theme === "dark") {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />
    } else if (theme === "light") {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />
    } else {
      // system - show appropriate icon based on system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      return systemTheme === "dark" ? 
        <Moon className="h-[1.2rem] w-[1.2rem]" /> : 
        <Sun className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  const getTooltipText = () => {
    if (theme === "light") return "Switch to dark mode"
    if (theme === "dark") return "Switch to system mode" 
    return "Switch to light mode"
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={getTooltipText()}
      className="h-9 w-9"
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

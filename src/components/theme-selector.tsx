
"use client"

import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface ThemeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {themes.map((theme) => (
        <button
          key={theme.name}
          type="button"
          onClick={() => onChange(theme.name)}
          className={cn(
            "relative rounded-lg border-2 p-4 cursor-pointer focus:outline-none",
            value === theme.name ? "border-primary" : "border-muted"
          )}
        >
          <div className="space-y-2">
            <div
              className="h-8 w-full rounded-md"
              style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
            />
            <div className="flex gap-2">
              <div
                className="h-6 w-full rounded-md"
                style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
              />
              <div
                className="h-6 w-full rounded-md"
                style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
              />
            </div>
          </div>
          <div className="mt-2 text-sm font-medium">{theme.label}</div>
          {value === theme.name && (
            <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}


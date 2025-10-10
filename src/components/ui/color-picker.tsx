
"use client"

import * as React from "react"
import { HexColorPicker } from "react-colorful"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ColorPickerProps {
  color?: string
  onChange: (color: string) => void
  className?: string
}

export function ColorPicker({
  color = "#000000",
  onChange,
  className,
}: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !color && "text-muted-foreground",
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            {color ? (
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: color }}
              />
            ) : null}
            <div className="flex-1 truncate">{color ? color.toUpperCase() : "Pick a color"}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={color} onChange={onChange} />
        <div className="p-2 border-t border-muted">
            <Input
                value={color.toUpperCase()}
                onChange={(e) => onChange(e.target.value)}
                className="h-8"
            />
        </div>
      </PopoverContent>
    </Popover>
  )
}

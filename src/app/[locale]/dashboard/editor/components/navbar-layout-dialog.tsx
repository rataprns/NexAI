
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { CombinedFormData } from "../hooks/use-editor-content";

interface NavbarLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CombinedFormData>;
}

const layouts = [
  {
    name: "Static",
    containerStyles: "w-full border-b bg-background",
    navStyles: "container flex h-14 items-center",
    preview: (
      <div className="flex items-center justify-between p-2 border rounded-md">
        <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
        </div>
      </div>
    ),
  },
  {
    name: "Floating",
    containerStyles: "sticky top-0 z-50 w-full p-2",
    navStyles: "container flex h-14 items-center rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md",
    preview: (
      <div className="flex items-center justify-between p-2 border rounded-lg shadow-md">
        <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
        </div>
      </div>
    ),
  },
  {
    name: "Centered",
    containerStyles: "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
    navStyles: "container flex h-14 items-center justify-center relative",
    preview: (
      <div className="flex items-center justify-center p-2 border rounded-md relative">
        <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-4 w-16" />
        </div>
         <div className="absolute right-2 top-2 flex items-center gap-2">
            <Skeleton className="h-6 w-14" />
        </div>
      </div>
    ),
  },
];


export function NavbarLayoutDialog({ isOpen, onOpenChange, form }: NavbarLayoutDialogProps) {
  const [selectedNavStyles, setSelectedNavStyles] = useState(form.getValues("navbarSection.navStyles"));

  const handleSelectLayout = (layout: typeof layouts[0]) => {
    form.setValue("navbarSection.containerStyles", layout.containerStyles);
    form.setValue("navbarSection.navStyles", layout.navStyles);
    setSelectedNavStyles(layout.navStyles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Choose a Navbar Layout</DialogTitle>
          <DialogDescription>
            Select a pre-defined layout for your main navigation bar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[70vh] overflow-y-auto">
          {layouts.map((layout) => (
            <Card
              key={layout.name}
              onClick={() => handleSelectLayout(layout)}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                selectedNavStyles === layout.navStyles ? "border-primary ring-2 ring-primary" : "border-muted"
              )}
            >
              <div className="p-4 h-32 flex items-center justify-center bg-muted/50">{layout.preview}</div>
              <div className="p-4 border-t flex items-center justify-between">
                <p className="font-medium text-sm">{layout.name}</p>
                 {selectedNavStyles === layout.navStyles && <Check className="h-5 w-5 text-primary" />}
              </div>
            </Card>
          ))}
        </div>
         <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

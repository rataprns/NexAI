
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

interface HeroLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CombinedFormData>;
}

const layouts = [
  {
    name: "Text Left, Image Right",
    containerStyles: "w-full py-20 md:py-32 lg:py-40 bg-background",
    gridStyles: "grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16",
    preview: (
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <Skeleton className="h-full w-full" />
      </div>
    ),
  },
  {
    name: "Text Right, Image Left",
    containerStyles: "w-full py-20 md:py-32 lg:py-40 bg-background",
    gridStyles: "grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 [&>div:last-child]:order-first",
    preview: (
      <div className="grid grid-cols-2 gap-4 h-full">
        <Skeleton className="h-full w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Text Center, Image Background",
    containerStyles: "relative w-full h-[80vh] flex items-center justify-center text-center",
    gridStyles: "relative z-10 space-y-4",
    preview: (
      <div className="relative w-full h-full flex items-center justify-center">
        <Skeleton className="absolute inset-0 h-full w-full" />
        <div className="relative space-y-4 p-4 rounded-lg bg-background/50">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <div className="flex gap-2 pt-4 justify-center">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    ),
  },
];


export function HeroLayoutDialog({ isOpen, onOpenChange, form }: HeroLayoutDialogProps) {
  const [selectedGridStyles, setSelectedGridStyles] = useState(form.getValues("heroSection.gridStyles"));

  const handleSelectLayout = (layout: typeof layouts[0]) => {
    form.setValue("heroSection.containerStyles", layout.containerStyles, { shouldDirty: true });
    form.setValue("heroSection.gridStyles", layout.gridStyles, { shouldDirty: true });
    setSelectedGridStyles(layout.gridStyles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Choose a Hero Layout</DialogTitle>
          <DialogDescription>
            Select a pre-defined layout for your hero section. The content will adapt automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[70vh] overflow-y-auto">
          {layouts.map((layout) => (
            <Card
              key={layout.name}
              onClick={() => handleSelectLayout(layout)}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                selectedGridStyles === layout.gridStyles ? "border-primary ring-2 ring-primary" : "border-muted"
              )}
            >
              <div className="p-4 h-48">{layout.preview}</div>
              <div className="p-4 border-t flex items-center justify-between">
                <p className="font-medium text-sm">{layout.name}</p>
                 {selectedGridStyles === layout.gridStyles && <Check className="h-5 w-5 text-primary" />}
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

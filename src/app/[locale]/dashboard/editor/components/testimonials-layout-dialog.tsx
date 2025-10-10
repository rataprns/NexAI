
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

interface TestimonialsLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CombinedFormData>;
}

const layouts = [
  {
    name: "Carousel",
    containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-background",
    gridStyles: "", // Empty gridStyles will trigger the carousel
    preview: (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Skeleton className="h-full w-1/3 absolute left-0" />
            <Skeleton className="h-full w-1/3 absolute right-0" />
            <Skeleton className="h-full w-2/3 ring-2 ring-primary" />
        </div>
    ),
  },
  {
    name: "Grid",
    containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-secondary",
    gridStyles: "mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3",
    preview: (
        <div className="grid grid-cols-3 gap-2 h-full">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
        </div>
    ),
  },
   {
    name: "Text Left, Vertical Carousel",
    containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-secondary",
    gridStyles: "grid md:grid-cols-2 gap-12 items-center vertical-carousel",
    preview: (
        <div className="grid grid-cols-2 gap-4 h-full">
            <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="relative h-full w-full overflow-hidden">
                <Skeleton className="h-1/3 w-full absolute top-0" />
                <Skeleton className="h-2/3 w-full absolute bottom-0 ring-2 ring-primary" />
            </div>
        </div>
    ),
  },
];


export function TestimonialsLayoutDialog({ isOpen, onOpenChange, form }: TestimonialsLayoutDialogProps) {
  const [selectedGridStyles, setSelectedGridStyles] = useState(form.getValues("testimonials.gridStyles"));

  const handleSelectLayout = (layout: typeof layouts[0]) => {
    form.setValue("testimonials.containerStyles", layout.containerStyles, { shouldDirty: true });
    form.setValue("testimonials.gridStyles", layout.gridStyles, { shouldDirty: true });
    setSelectedGridStyles(layout.gridStyles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Choose a Testimonials Layout</DialogTitle>
          <DialogDescription>
            Select a pre-defined layout for your testimonials section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-h-[70vh] overflow-y-auto">
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

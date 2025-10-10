
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

interface FaqLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CombinedFormData>;
}

const layouts = [
  {
    name: "Centered Accordion",
    containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-secondary",
    gridStyles: "", // Empty gridStyles will trigger the centered layout
    preview: (
        <div className="flex flex-col items-center gap-4 h-full">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="w-full flex-1 space-y-2 pt-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    ),
  },
  {
    name: "Text Left, Accordion Right",
    containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-background",
    gridStyles: "grid md:grid-cols-2 gap-12 items-start",
    preview: (
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="w-full space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
      </div>
    ),
  },
];


export function FaqLayoutDialog({ isOpen, onOpenChange, form }: FaqLayoutDialogProps) {
  const [selectedGridStyles, setSelectedGridStyles] = useState(form.getValues("faq.gridStyles"));

  const handleSelectLayout = (layout: typeof layouts[0]) => {
    form.setValue("faq.containerStyles", layout.containerStyles, { shouldDirty: true });
    form.setValue("faq.gridStyles", layout.gridStyles, { shouldDirty: true });
    setSelectedGridStyles(layout.gridStyles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Choose a FAQ Layout</DialogTitle>
          <DialogDescription>
            Select a pre-defined layout for your FAQ section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[70vh] overflow-y-auto">
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

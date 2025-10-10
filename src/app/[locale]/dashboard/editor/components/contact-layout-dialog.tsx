
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

interface ContactLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CombinedFormData>;
}

const layouts = [
  {
    name: "Text Left, Form Right",
    containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-background",
    gridStyles: "grid gap-12 lg:grid-cols-2 lg:gap-16",
    preview: (
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-full w-full" />
      </div>
    ),
  },
  {
    name: "Text Right, Form Left",
    containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-background",
    gridStyles: "grid gap-12 lg:grid-cols-2 lg:gap-16 [&>div:first-child]:order-last",
     preview: (
      <div className="grid grid-cols-2 gap-4 h-full">
        <Skeleton className="h-full w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ),
  },
  {
    name: "Text Center, Form Below",
    containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-secondary",
    gridStyles: "flex flex-col items-center justify-center text-center gap-12",
    preview: (
      <div className="flex flex-col items-center gap-4 h-full">
        <div className="space-y-2 text-center w-full">
            <Skeleton className="h-4 w-1/4 mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full mx-auto" />
        </div>
        <Skeleton className="h-1/2 w-3/4" />
      </div>
    ),
  },
];


export function ContactLayoutDialog({ isOpen, onOpenChange, form }: ContactLayoutDialogProps) {
  const [selectedGridStyles, setSelectedGridStyles] = useState(form.getValues("contactSection.gridStyles"));

  const handleSelectLayout = (layout: typeof layouts[0]) => {
    form.setValue("contactSection.containerStyles", layout.containerStyles, { shouldDirty: true });
    form.setValue("contactSection.gridStyles", layout.gridStyles, { shouldDirty: true });
    setSelectedGridStyles(layout.gridStyles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Choose a Contact Layout</DialogTitle>
          <DialogDescription>
            Select a pre-defined layout for your contact section.
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

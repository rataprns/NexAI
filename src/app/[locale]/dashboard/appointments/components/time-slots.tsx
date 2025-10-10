
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const defaultTimes = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

interface TimeSlotsProps {
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
    busySlots: string[];
    isLoading: boolean;
    availableTimes?: string[];
}

export function TimeSlots({ selectedTime, onSelectTime, busySlots, isLoading, availableTimes = defaultTimes }: TimeSlotsProps) {
  if (isLoading) {
    return (
        <div className="grid grid-cols-4 gap-2">
            {availableTimes.map(time => <Skeleton key={time} className="h-10 w-full" />)}
        </div>
    );
  }
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {availableTimes.map((time) => {
        const isBusy = busySlots.includes(time);
        return (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              onClick={() => onSelectTime(time)}
              disabled={isBusy}
              className={cn("w-full", {
                "cursor-not-allowed bg-muted text-muted-foreground": isBusy
              })}
            >
              {time}
            </Button>
        )
      })}
    </div>
  );
}

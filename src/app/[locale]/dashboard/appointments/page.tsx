
"use client";

import { useState, useEffect } from "react";
import { PlusCircle, List, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { BookAppointmentDialog } from "./components/book-appointment-dialog";
import { AppointmentList } from "./components/appointment-list";
import { AppointmentCalendar } from "./components/appointment-calendar";
import { useScopedI18n } from "@/locales/client";
import { useAppointments, useCancelAppointment, useRebookAppointment } from "./_hooks/useAppointments";
import { useQueryClient } from "@tanstack/react-query";

export default function AppointmentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const tDashboard = useScopedI18n("dashboard");
  const tAppointments = useScopedI18n("appointments");

  const { data: appointments, isLoading, isError, error } = useAppointments();
  const cancelMutation = useCancelAppointment();
  const rebookMutation = useRebookAppointment();

  useEffect(() => {
    if (isError) {
        toast({
            title: tAppointments('error-title'),
            description: error.message,
            variant: "destructive",
        });
    }
  }, [isError, error, toast, tAppointments]);

  useEffect(() => {
    if (cancelMutation.isSuccess) {
      toast({
        title: tAppointments('cancel-success-title'),
        description: tAppointments('cancel-success-description'),
      });
    }
    if (cancelMutation.isError) {
      toast({
        title: tAppointments('error-title'),
        description: cancelMutation.error.message,
        variant: "destructive",
      });
    }
  }, [cancelMutation.isSuccess, cancelMutation.isError, cancelMutation.error, toast, tAppointments]);
  
  useEffect(() => {
    if (rebookMutation.isSuccess) {
      toast({
        title: tAppointments('rebook-success-title'),
        description: tAppointments('rebook-success-description'),
      });
    }
    if (rebookMutation.isError) {
      toast({
        title: tAppointments('error-title'),
        description: rebookMutation.error.message,
        variant: "destructive",
      });
    }
  }, [rebookMutation.isSuccess, rebookMutation.isError, rebookMutation.error, toast, tAppointments]);


  const handleCancelAppointment = (appointmentId: string) => {
    cancelMutation.mutate(appointmentId);
  };
  
  const handleRebookAppointment = (appointmentId: string) => {
    rebookMutation.mutate(appointmentId);
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{tDashboard('appointments')}</h1>
        <div className="ml-auto flex items-center gap-2">
           <Button
            variant={view === 'list' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setView('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'calendar' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setView('calendar')}
            aria-label="Calendar view"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button size="sm" className="h-9 gap-1" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {tAppointments('book-button')}
            </span>
          </Button>
        </div>
      </div>
      <div className="flex flex-1 items-start rounded-lg border border-dashed shadow-sm p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{tAppointments('manage-title')}</CardTitle>
            <CardDescription>{tAppointments('manage-description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : view === 'list' ? (
              <AppointmentList
                appointments={appointments || []}
                onCancelAppointment={handleCancelAppointment}
                onRebookAppointment={handleRebookAppointment}
              />
            ) : (
              <AppointmentCalendar
                appointments={appointments || []}
                onCancelAppointment={handleCancelAppointment}
                onRebookAppointment={handleRebookAppointment}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <BookAppointmentDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAppointmentBooked={() => {
          setIsDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }}
      />
    </>
  );
}


"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/modules/scheduling/domain/entities/appointment.entity";
import { AppointmentStatus } from "@/lib/types";
import { Trash2, RefreshCcw, Mail } from "lucide-react";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { format, toZonedTime } from "date-fns-tz";
import { enUS, es } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useSettingsQuery } from "../../settings/_hooks/useSettings";

interface AppointmentListProps {
  appointments: Appointment[];
  onCancelAppointment: (appointmentId: string) => void;
  onRebookAppointment: (appointmentId: string) => void;
}

const CancelAppointmentDialog = ({ onConfirm, appointmentId, children }: { onConfirm: (id: string) => void, appointmentId: string, children: React.ReactNode }) => {
    const t = useScopedI18n("appointments");
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        onConfirm(appointmentId);
        setIsOpen(false);
    };

    const footer = (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
             <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
                {t('cancel-dialog-back')}
            </Button>
            <Button onClick={handleConfirm} className="w-full sm:w-auto">
               {t('cancel-dialog-confirm')}
            </Button>
        </div>
    );

    return (
        <>
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                {children}
            </div>
            <ResponsiveDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                title={t('cancel-dialog-title')}
                description={t('cancel-dialog-description')}
                footer={footer}
            >
                <div />
            </ResponsiveDialog>
        </>
    );
};

const RebookAppointmentDialog = ({ onConfirm, appointmentId, children }: { onConfirm: (id: string) => void, appointmentId: string, children: React.ReactNode }) => {
    const t = useScopedI18n("appointments");
     const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        onConfirm(appointmentId);
        setIsOpen(false);
    };

     const footer = (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
                {t('cancel-dialog-back')}
            </Button>
            <Button onClick={handleConfirm} className="w-full sm:w-auto">
               {t('rebook-dialog-confirm')}
            </Button>
        </div>
    );

    return (
       <>
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                {children}
            </div>
            <ResponsiveDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                title={t('rebook-dialog-title')}
                description={t('rebook-dialog-description')}
                footer={footer}
            >
                <div />
            </ResponsiveDialog>
        </>
    );
};


export function AppointmentList({ appointments, onCancelAppointment, onRebookAppointment }: AppointmentListProps) {
  const t = useScopedI18n("appointments");
  const { data: settings } = useSettingsQuery();
  const timeZone = settings?.timezone || 'America/Santiago';
  const currentLocale = useCurrentLocale();
  const dateFnsLocale = currentLocale === 'es' ? es : enUS;
  const isMobile = useIsMobile();
  
  if (appointments.length === 0) {
    return <p className="text-center text-muted-foreground">{t('no-appointments')}</p>;
  }

  const getStatusVariant = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Scheduled:
        return "default";
      case AppointmentStatus.Completed:
        return "secondary";
      case AppointmentStatus.Cancelled:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTranslatedStatus = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Scheduled:
        return t('status-scheduled');
      case AppointmentStatus.Cancelled:
        return t('status-cancelled');
      case AppointmentStatus.Completed:
        return t('status-completed');
      default:
        return status;
    }
  }

  const ActionButtons = ({ appointment }: { appointment: Appointment }) => (
    <div className="flex items-center justify-end">
      {appointment.status === AppointmentStatus.Scheduled && (
        <CancelAppointmentDialog onConfirm={onCancelAppointment} appointmentId={appointment.id}>
             <Button variant="ghost" size="icon" title={t('cancel-tooltip')}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </CancelAppointmentDialog>
      )}
       {appointment.status === AppointmentStatus.Cancelled && (
        <RebookAppointmentDialog onConfirm={onRebookAppointment} appointmentId={appointment.id}>
            <Button variant="ghost" size="icon" title={t('rebook-tooltip')}>
                <RefreshCcw className="h-4 w-4" />
            </Button>
        </RebookAppointmentDialog>
      )}
    </div>
  );

  if (isMobile) {
    return (
        <Accordion type="multiple" className="w-full space-y-2">
            {appointments.map((appointment) => {
                const zonedDate = toZonedTime(new Date(appointment.date), timeZone);
                return (
                <AccordionItem key={appointment.id} value={appointment.id} className="border rounded-lg px-4 bg-muted/20">
                     <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col items-start text-left gap-1">
                            <span className="font-semibold">{appointment.name}</span>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{format(zonedDate, "PPP", { timeZone, locale: dateFnsLocale })}</span>
                                <span>-</span>
                                <span>{format(zonedDate, "p", { timeZone, locale: dateFnsLocale })}</span>
                            </div>
                             <Badge variant={getStatusVariant(appointment.status)} className="mt-1">{getTranslatedStatus(appointment.status)}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2 pt-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.email}</span>
                            </div>
                            <ActionButtons appointment={appointment} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            )})}
        </Accordion>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table-header-name')}</TableHead>
            <TableHead>{t('table-header-email')}</TableHead>
            <TableHead>{t('table-header-date')}</TableHead>
            <TableHead>{t('table-header-time')}</TableHead>
            <TableHead>{t('table-header-status')}</TableHead>
            <TableHead className="text-right">{t('table-header-actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
             const zonedDate = toZonedTime(new Date(appointment.date), timeZone);
             return (
                <TableRow key={appointment.id}>
                <TableCell>{appointment.name || 'N/A'}</TableCell>
                <TableCell>{appointment.email || 'N/A'}</TableCell>
                <TableCell>{format(zonedDate, "PPP", { timeZone, locale: dateFnsLocale })}</TableCell>
                <TableCell>{format(zonedDate, "p", { timeZone, locale: dateFnsLocale })}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(appointment.status)}>
                    {getTranslatedStatus(appointment.status)}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <ActionButtons appointment={appointment} />
                </TableCell>
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}

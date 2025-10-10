
"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Appointment } from "@/modules/scheduling/domain/entities/appointment.entity";
import { format, isSameDay, startOfDay } from "date-fns";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { enUS, es } from "date-fns/locale";
import { AppointmentList } from "./appointment-list";
import { Day, DayProps } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { useSettingsQuery } from "../../settings/_hooks/useSettings";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onCancelAppointment: (appointmentId: string) => void;
  onRebookAppointment: (appointmentId: string) => void;
}

export function AppointmentCalendar({ appointments, onCancelAppointment, onRebookAppointment }: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const t = useScopedI18n("appointments");
  const currentLocale = useCurrentLocale();
  const dateFnsLocale = currentLocale === 'es' ? es : enUS;

  const { data: settings } = useSettingsQuery();
  
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, number>();
    appointments.forEach(app => {
        const day = startOfDay(new Date(app.date)).toISOString();
        map.set(day, (map.get(day) || 0) + 1);
    });
    return map;
  }, [appointments]);

  const selectedDayAppointments = useMemo(() => {
    if (!date) return [];
    return appointments.filter(app => isSameDay(new Date(app.date), date));
  }, [appointments, date]);

  function CustomDay(props: DayProps) {
    const dayKey = startOfDay(props.date).toISOString();
    const count = appointmentsByDate.get(dayKey);
    return (
      <div className="relative">
        <Day {...props} />
        {count && (
           <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs pointer-events-none"
            >
              {count}
            </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            locale={dateFnsLocale}
            components={{
              Day: CustomDay,
            }}
        />
        {date && (
            <div className="w-full">
                <h3 className="text-lg font-semibold mb-4 text-center">
                    {t('appointments-for-date', { date: format(date, 'PPP', { locale: dateFnsLocale }) })}
                </h3>
                {selectedDayAppointments.length > 0 ? (
                    <AppointmentList 
                        appointments={selectedDayAppointments}
                        onCancelAppointment={onCancelAppointment}
                        onRebookAppointment={onRebookAppointment}
                    />
                ) : (
                    <p className="text-center text-muted-foreground">{t('no-appointments-for-date')}</p>
                )}
            </div>
        )}
    </div>
  );
}

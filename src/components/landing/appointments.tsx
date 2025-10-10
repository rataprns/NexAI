
'use client';

import { useScopedI18n } from "@/locales/client";
import { PublicAppointmentForm } from "./public-appointment-form";
import type { Setting } from "@/modules/settings/domain/entities/setting.entity";
import type { AppointmentsSection as AppointmentsSectionEntity } from "@/modules/appointments-section/domain/entities/appointments-section.entity";
import defaultSettings from "@/lib/default-settings.json";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Location } from "@/modules/locations/domain/entities/location.entity";

type AppointmentsProps = {
  settings: Setting | null;
  appointmentsSection: AppointmentsSectionEntity | null;
  locations: Location[];
};

export function Appointments({ settings, appointmentsSection, locations }: AppointmentsProps) {
  const content = useMemo(() => {
    return appointmentsSection || defaultSettings.landingPage.appointments;
  }, [appointmentsSection]);

  const {
    containerStyles,
    gridStyles,
    badge,
    title,
    subtitle,
    titleColor,
    subtitleColor,
  } = content;

  return (
    <section id="appointments" className={cn(containerStyles)}>
      <div className="container px-4 md:px-6">
        <div className={cn(gridStyles)}>
            <div className="space-y-4">
                 <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">{badge}</div>
                <h2
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline"
                  style={{ color: titleColor || undefined }}
                >
                    {title}
                </h2>
                <p
                  className="max-w-[600px] text-muted-foreground md:text-xl/relaxed"
                  style={{ color: subtitleColor || undefined }}
                >
                    {subtitle}
                </p>
            </div>
             <div className="w-full max-w-xl mx-auto">
                <PublicAppointmentForm locations={locations} settings={settings} />
            </div>
        </div>
      </div>
    </section>
  );
}

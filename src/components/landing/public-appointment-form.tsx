
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlots } from "@/app/[locale]/dashboard/appointments/components/time-slots";
import { useToast } from "@/hooks/use-toast";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { enUS, es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import type { Location } from "@/modules/locations/domain/entities/location.entity";
import { Service } from "@/modules/services/domain/entities/service.entity";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Info, ArrowRight, Copy } from "lucide-react";
import { ServiceDetail } from "./service-detail";
import type { Setting } from "@/modules/settings/domain/entities/setting.entity";

const fetchAvailability = async (date: Date, locationId: string): Promise<string[]> => {
    if (!date || !locationId) return [];
    const dateString = format(date, "yyyy-MM-dd");
    const res = await fetch(`/api/scheduling/availability?date=${dateString}&locationId=${locationId}`);
    if (!res.ok) throw new Error("Failed to fetch availability");
    return res.json();
};

const fetchLocationById = async (locationId: string): Promise<Location | null> => {
  if (!locationId) return null;
  const res = await fetch(`/api/locations?id=${locationId}`);
  if (!res.ok) throw new Error("Failed to fetch location data");
  return res.json();
}

const fetchServices = async (): Promise<Service[]> => {
    const res = await fetch('/api/services?active=true');
    if (!res.ok) throw new Error("Failed to fetch services");
    return res.json();
}

export function PublicAppointmentForm({ locations, settings }: { locations: Location[], settings: Setting | null }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();
  const currentLocale = useCurrentLocale();
  const dateFnsLocale = currentLocale === 'es' ? es : enUS;
  const t = useScopedI18n("appointments");
  const tServices = useScopedI18n("services");

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate]);

  const { data: locationSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['locationSettings', selectedLocationId],
    queryFn: () => fetchLocationById(selectedLocationId!),
    enabled: !!selectedLocationId,
  });

  const { data: allServices, isLoading: isLoadingServices } = useQuery({
      queryKey: ['activeServices'],
      queryFn: fetchServices
  });

  const { data: busySlots = [], isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['availability', selectedLocationId, selectedDate ? format(selectedDate, "yyyy-MM-dd") : ''],
    queryFn: () => fetchAvailability(selectedDate!, selectedLocationId!),
    enabled: !!selectedDate && !!selectedLocationId,
  });

  const timeZone = settings?.timezone || 'America/Santiago';

  const selectedService = allServices?.find(s => s.id === selectedServiceId);
  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  const handleSubmit = async () => {
    if (!name || !email || !selectedLocationId || !selectedServiceId || !selectedDate || !selectedTime) {
      toast({
        title: t("incomplete-selection-title"),
        description: t("incomplete-selection-description"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
        const res = await fetch("/api/scheduling", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                date: format(selectedDate, "yyyy-MM-dd"), // Send date as string
                time: selectedTime, // Send time as string
                name: name,
                email: email,
                locationId: selectedLocationId,
                serviceId: selectedServiceId,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || t("booking-error"));
        }

        const { client } = await res.json();

        const handleCopy = () => {
            navigator.clipboard.writeText(`${client.secretWord1} ${client.secretWord2}`);
            toast({ title: 'Copiado!', description: 'Palabras secretas copiadas al portapapeles.' });
        };
        
        toast({
          title: t('public-booking-success-title'),
          description: (
            <div className="space-y-2">
              <p>Tu cita ha sido agendada. IMPORTANTE: Guarda tus palabras secretas para gestionar tu cita más adelante.</p>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                <span className="font-mono font-semibold text-sm flex-1">{client.secretWord1} {client.secretWord2}</span>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ),
          duration: 15000,
        });
        
        setName('');
        setEmail('');
        setSelectedLocationId(null);
        setSelectedServiceId(null);
        setSelectedDate(new Date());
        setSelectedTime(null);

    } catch (error: any) {
        toast({
            title: t("error-title"),
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const isDayDisabled = (date: Date) => {
      if (!locationSettings) return true;
      const today = new Date();
      today.setHours(0,0,0,0);
      if (date < today) return true;
      
      const dayOfWeek = date.getDay();
      if (!locationSettings?.availability?.availableDays?.includes(dayOfWeek)) return true;

      const dateString = format(date, 'yyyy-MM-dd');
      const disabledDatesAsStrings = locationSettings?.availability?.disabledDates?.map(d => format(parseISO(d as unknown as string), 'yyyy-MM-dd')) || [];
      if (disabledDatesAsStrings.includes(dateString)) return true;
      
      return false;
  };

  const filteredServices = allServices?.filter(service => 
    service.locationIds.includes(selectedLocationId || '')
  ) || [];
  
  if (locations.length === 0) {
      return (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Reservas no disponibles</AlertTitle>
            <AlertDescription>
                El agendamiento de citas no está disponible en este momento. Por favor, inténtelo más tarde.
            </AlertDescription>
        </Alert>
      );
  }

  return (
    <>
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('book-public-title')}</CardTitle>
        <CardDescription>{t('book-public-description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
           <div className="grid grid-cols-1 gap-4">
             <div className="space-y-2">
                <Label htmlFor="location">{t('form-label-location')}</Label>
                <Select value={selectedLocationId || ''} onValueChange={(value) => {
                    setSelectedLocationId(value);
                    setSelectedServiceId(null);
                    setSelectedTime(null);
                }}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('form-placeholder-location')} />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map(location => (
                            <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="service">{tServices('page-title')}</Label>
                <Select value={selectedServiceId || ''} onValueChange={setSelectedServiceId} disabled={!selectedLocationId || isLoadingServices}>
                    <SelectTrigger>
                        <SelectValue placeholder={tServices('form-locations-desc')} />
                    </SelectTrigger>
                    <SelectContent>
                        {isLoadingServices ? (
                            <SelectItem value="loading" disabled>Cargando...</SelectItem>
                        ) : filteredServices.length > 0 ? (
                            filteredServices.map(service => (
                                <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                            ))
                        ) : (
                             <SelectItem value="no-services" disabled>No hay servicios disponibles en esta sucursal.</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
            {selectedService && selectedLocation && (
              <Card className="bg-muted/50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                          <h4 className="font-semibold">{selectedService.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedLocation.name} - {selectedService.duration} min - ${selectedService.price} {selectedService.currency}
                          </p>
                      </div>
                      <Button variant="secondary" onClick={() => setIsDetailOpen(true)} className="w-full sm:w-auto">
                          Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                  </div>
              </Card>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="public-name">{t('form-label-name')}</Label>
                <Input id="public-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="public-email">{t('form-label-email')}</Label>
                <Input id="public-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                </div>
            </div>
          </div>
          
          <div className={`grid md:grid-cols-2 gap-6 items-start transition-opacity duration-300 ${!selectedLocationId || !selectedServiceId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className="space-y-2">
                  <Label className="text-center block">{t('form-label-date')}</Label>
                  <div className="flex justify-center">
                    {selectedDate && (
                      <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={isDayDisabled}
                          className="rounded-md border"
                          locale={dateFnsLocale}
                      />
                    )}
                  </div>
              </div>

              <div className="space-y-2">
                   <Label className="text-center block">{t('form-label-time')}</Label>
                  {selectedDate && (
                    <TimeSlots 
                        selectedTime={selectedTime} 
                        onSelectTime={setSelectedTime} 
                        busySlots={busySlots}
                        isLoading={isLoadingAvailability || isLoadingSettings}
                        availableTimes={locationSettings?.availability?.availableTimes}
                    />
                  )}
              </div>
          </div>

          <Button 
            type="button"
            onClick={handleSubmit}
            className="w-full"
            disabled={!selectedLocationId || !selectedServiceId || !selectedDate || !selectedTime || isLoading || !name || !email}
          >
            {isLoading ? t('booking-button-loading') : t('confirm-button')}
          </Button>
        </div>
      </CardContent>
    </Card>
    
    {selectedService && (
        <ServiceDetail
          isOpen={isDetailOpen}
          onOpenChange={(open) => !open && setSelectedServiceId(null)}
          service={selectedService}
          locations={locations.filter(l => selectedService.locationIds.includes(l.id))}
        />
    )}
    </>
  );
}


"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TimeSlots } from "./time-slots";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { enUS, es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useAvailability, useClientsForAppointments, useLocationsForAppointments, useServicesForAppointments } from "../_hooks/useAppointments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Combobox } from "@/components/ui/combobox";
import { Switch } from "@/components/ui/switch";

interface BookAppointmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentBooked: () => void;
}

export function BookAppointmentDialog({ isOpen, onOpenChange, onAppointmentBooked }: BookAppointmentDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isNewClient, setIsNewClient] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const currentLocale = useCurrentLocale();
  const dateFnsLocale = currentLocale === 'es' ? es : enUS;
  const t = useScopedI18n("appointments");
  const tServices = useScopedI18n("services");

  useEffect(() => {
    if (isOpen && !selectedDate) {
      setSelectedDate(new Date());
    } else if (!isOpen) {
        resetState();
    }
  }, [isOpen, selectedDate]);

  const { data: locations, isLoading: isLoadingLocations } = useLocationsForAppointments();
  const { data: allServices, isLoading: isLoadingServices } = useServicesForAppointments();
  const { data: clients, isLoading: isLoadingClients } = useClientsForAppointments();

  const selectedLocation = locations?.find(loc => loc.id === selectedLocationId);

  const { data: busySlots = [], isLoading: isLoadingAvailability } = useAvailability(selectedDate, selectedLocationId);
  
  useEffect(() => {
    if (!isNewClient && selectedClientId) {
      const client = clients?.find(c => c.id === selectedClientId);
      if (client) {
        setName(client.name);
        setEmail(client.email);
      }
    } else {
      setName('');
      setEmail('');
    }
  }, [isNewClient, selectedClientId, clients]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !selectedLocationId || !selectedServiceId || !selectedDate || !selectedTime) {
      toast({
        title: t("incomplete-selection-title"),
        description: t("incomplete-selection-description-admin"),
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

      toast({
        title: t("booking-success-title"),
        description: t("booking-success-description"),
      });
      onAppointmentBooked();
      resetState();
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

  const resetState = () => {
    setName('');
    setEmail('');
    setSelectedClientId(null);
    setIsNewClient(true);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setSelectedLocationId(null);
    setSelectedServiceId(null);
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  }

  const isDayDisabled = (date: Date) => {
      if (!selectedLocation) return true;
      const today = new Date();
      today.setHours(0,0,0,0);
      if (date < today) return true;
      
      const dayOfWeek = date.getDay();
      if (!selectedLocation?.availability?.availableDays?.includes(dayOfWeek)) return true;

      const dateString = format(date, 'yyyy-MM-dd');
      const disabledDatesAsStrings = selectedLocation?.availability?.disabledDates?.map(d => format(parseISO(d as unknown as string), 'yyyy-MM-dd')) || [];
      if (disabledDatesAsStrings.includes(dateString)) return true;
      
      return false;
  };
  
  const filteredServices = allServices?.filter(service => 
    service.locationIds.includes(selectedLocationId || '')
  ) || [];

  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: `${client.name} (${client.email})`,
  })) || [];

  const DialogFooterContent = (
      <Button 
        type="button" 
        onClick={handleSubmit} 
        disabled={!name || !email || !selectedLocationId || !selectedServiceId || !selectedDate || !selectedTime || isLoading}
        className="w-full"
      >
        {isLoading ? t('booking-button-loading') : t('confirm-button')}
      </Button>
  );

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={t('book-new-title')}
      description={t('book-new-description-admin')}
      footer={DialogFooterContent}
    >
      <div className="grid gap-4 py-4">
        <div className="flex items-center space-x-2">
            <Label htmlFor="client-type-switch">Crear Nuevo Cliente</Label>
            <Switch
                id="client-type-switch"
                checked={!isNewClient}
                onCheckedChange={(checked) => setIsNewClient(!checked)}
            />
            <Label htmlFor="client-type-switch">Cliente Existente</Label>
        </div>

        {isNewClient ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('form-label-name')}</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t('form-label-email')}</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
            </div>
        ) : (
             <div className="space-y-2">
                <Label>Seleccionar Cliente</Label>
                 <Combobox
                    options={clientOptions}
                    value={selectedClientId}
                    onChange={setSelectedClientId}
                    placeholder="Buscar cliente..."
                    searchPlaceholder="Buscar por nombre o email..."
                    noResultsText="No se encontraron clientes."
                />
            </div>
        )}
{/*  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        {isLoadingLocations ? (
                            <SelectItem value="loading" disabled>Cargando...</SelectItem>
                        ): locations?.map(location => (
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
                             <SelectItem value="no-services" disabled>No hay servicios en esta sucursal.</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className={`grid md:grid-cols-2 gap-4 items-start transition-opacity duration-300 ${!selectedLocationId || !selectedServiceId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-full flex flex-col items-center">
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
          <div className="w-full">
            {selectedDate && (
              <div className="space-y-2">
                <Label className="text-center block">{t('form-label-time')}</Label>
                <TimeSlots 
                    selectedTime={selectedTime} 
                    onSelectTime={setSelectedTime} 
                    busySlots={busySlots}
                    isLoading={isLoadingAvailability || isLoadingLocations}
                    availableTimes={selectedLocation?.availability?.availableTimes}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

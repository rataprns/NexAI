
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Location } from "@/modules/locations/domain/entities/location.entity";
import { LocationDto, locationSchema } from "@/modules/locations/application/dtos/location.dto";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useScopedI18n } from "@/locales/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useServicesForLocations } from "../_hooks/useLocations";

interface LocationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
  onSave: (data: LocationDto) => void;
  isSaving: boolean;
}

const daysOfWeek = [
    { id: 0, label: 'Sunday' },
    { id: 1, label: 'Monday' },
    { id: 2, label: 'Tuesday' },
    { id: 3, label: 'Wednesday' },
    { id: 4, label: 'Thursday' },
    { id: 5, label: 'Friday' },
    { id: 6, label: 'Saturday' },
];

export function LocationDialog({ isOpen, onOpenChange, location, onSave, isSaving }: LocationDialogProps) {
  const t = useScopedI18n("locations");
  const tAvailability = useScopedI18n("availability");

  const { data: services, isLoading: isLoadingServices } = useServicesForLocations();

  const form = useForm<LocationDto>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      isActive: true,
      availability: {
        availableDays: [],
        availableTimes: [],
        disabledDates: [],
      },
      serviceIds: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (location) {
        form.reset({
          ...location,
          phone: location.phone || '',
          address: location.address || '',
          availability: {
            ...location.availability,
            disabledDates: location.availability?.disabledDates?.map(d => new Date(d)) || []
          }
        });
      } else {
        form.reset({
          name: '',
          address: '',
          phone: '',
          isActive: true,
          availability: {
            availableDays: [1, 2, 3, 4, 5],
            availableTimes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
            disabledDates: [],
          },
          serviceIds: [],
        });
      }
    }
  }, [location, form, isOpen]);

  const onSubmit = (data: LocationDto) => {
    const payload = {
        ...data,
        availability: {
            ...data.availability,
            disabledDates: data.availability?.disabledDates?.map(d => new Date(d).toISOString().split('T')[0]) || []
        }
    };
    onSave(payload);
  };

  const DialogFooter = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
      <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving} className="w-full sm:w-auto">
        {t('dialog-cancel-button')}
      </Button>
      <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? t('dialog-save-button-loading') : t('dialog-save-button')}
      </Button>
    </div>
  );

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={location ? t('dialog-edit-title') : t('dialog-new-title')}
      description={t('dialog-description')}
      footer={DialogFooter}
    >
      <ScrollArea className="max-h-[70vh]">
        <div className="pr-6">
            <Form {...form}>
            <form className="space-y-6 py-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('form-name-label')}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('form-address-label')}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('form-phone-label')}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                  control={form.control}
                  name="serviceIds"
                  render={() => (
                    <FormItem>
                        <FormLabel>{t('form-services-label')}</FormLabel>
                        <FormDescription>{t('form-services-desc')}</FormDescription>
                        {isLoadingServices ? (
                            <div className="space-y-2"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-6 w-1/3" /></div>
                        ) : !services || services.length === 0 ? (
                           <Alert>
                                <AlertTitle>{t('no-services-alert-title')}</AlertTitle>
                                <AlertDescription>
                                    {t('no-services-alert-desc-prefix')} <Link href="/dashboard/services" className="underline font-semibold">{t('no-services-alert-link')}</Link> {t('no-services-alert-desc-suffix')}
                                </AlertDescription>
                           </Alert>
                        ) : (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            {services?.map((service) => (
                            <FormField
                                key={service.id}
                                control={form.control}
                                name="serviceIds"
                                render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(service.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), service.id])
                                            : field.onChange(field.value?.filter((value) => value !== service.id));
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">{service.name}</FormLabel>
                                </FormItem>
                                )}
                            />
                            ))}
                        </div>
                        )}
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availability.availableDays"
                  render={() => (
                    <FormItem>
                      <FormLabel>{tAvailability('available-days-label')}</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">
                        {daysOfWeek.map((day) => (
                          <FormField
                            key={day.id}
                            control={form.control}
                            name="availability.availableDays"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), day.id])
                                        : field.onChange(field.value?.filter((value) => value !== day.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{tAvailability(day.label as any)}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                    <FormLabel>{tAvailability('available-times-label')}</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {form.watch('availability.availableTimes')?.map((time, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <Input value={time} readOnly className="bg-muted" />
                                <Button type="button" variant="destructive" size="icon" onClick={() => {
                                    const currentTimes = form.getValues('availability.availableTimes') || [];
                                    form.setValue('availability.availableTimes', currentTimes.filter((_, i) => i !== index));
                                }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <div className="flex items-center gap-2 pt-2">
                        <Input
                            type="time"
                            id="new-time-slot"
                        />
                        <Button type="button" onClick={() => {
                            const newTimeInput = document.getElementById('new-time-slot') as HTMLInputElement;
                            const newTime = newTimeInput.value;
                            if (newTime && !form.getValues('availability.availableTimes')?.includes(newTime)) {
                                const currentTimes = form.getValues('availability.availableTimes') || [];
                                const sortedTimes = [...currentTimes, newTime].sort();
                                form.setValue('availability.availableTimes', sortedTimes);
                                newTimeInput.value = '';
                            }
                        }}>{tAvailability('add-time-button')}</Button>
                    </div>
                </FormItem>

                <FormField
                  control={form.control}
                  name="availability.disabledDates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{tAvailability('disabled-dates-label')}</FormLabel>
                      <Calendar
                        mode="multiple"
                        selected={field.value as Date[]}
                        onSelect={field.onChange}
                        className="rounded-md border self-center"
                      />
                    </FormItem>
                  )}
                />
            </form>
            </Form>
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
}

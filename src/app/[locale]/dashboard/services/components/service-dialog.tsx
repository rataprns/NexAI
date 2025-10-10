
"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service } from "@/modules/services/domain/entities/service.entity";
import { ServiceDto, serviceSchema } from "@/modules/services/application/dtos/service.dto";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useScopedI18n } from "@/locales/client";
import { PlusCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocationsForServices } from "../_hooks/useServices";

interface ServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSave: (data: ServiceDto) => void;
  isSaving: boolean;
}

export function ServiceDialog({ isOpen, onOpenChange, service, onSave, isSaving }: ServiceDialogProps) {
  const t = useScopedI18n("services");

  const { data: locations, isLoading: isLoadingLocations } = useLocationsForServices();

  const form = useForm<ServiceDto>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      imageUrl: '',
      duration: 30,
      price: 0,
      currency: 'USD',
      customFields: [],
      locationIds: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFields",
  });

  useEffect(() => {
    if (service) {
      form.reset(service);
    } else {
      form.reset({
        name: '',
        description: '',
        isActive: true,
        imageUrl: '',
        duration: 30,
        price: 0,
        currency: 'USD',
        customFields: [],
        locationIds: [],
      });
    }
  }, [service, form, isOpen]);

  const onSubmit = (data: ServiceDto) => {
    onSave(data);
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
      title={service ? t('dialog-edit-title') : t('dialog-new-title')}
      description={t('dialog-description')}
      footer={DialogFooter}
    >
      <ScrollArea className="max-h-[70vh]">
        <div className="pr-6">
            <Form {...form}>
            <form className="space-y-4 py-4">
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
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('form-description-label')}</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('form-image-url-label')}</FormLabel>
                    <FormControl><Input {...field} placeholder="https://..." /></FormControl>
                    <FormDescription>{t('form-image-url-desc')}</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('form-price-label')}</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('form-currency-label')}</FormLabel>
                        <FormControl><Input {...field} maxLength={3} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('form-duration-label')}</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                
                 <FormField
                  control={form.control}
                  name="locationIds"
                  render={() => (
                    <FormItem>
                        <FormLabel>{t('form-locations-label')}</FormLabel>
                        <FormDescription>{t('form-locations-desc')}</FormDescription>
                        {isLoadingLocations ? (
                            <div className="space-y-2"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-6 w-1/3" /></div>
                        ) : (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            {locations?.map((location) => (
                            <FormField
                                key={location.id}
                                control={form.control}
                                name="locationIds"
                                render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(location.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), location.id])
                                            : field.onChange(field.value?.filter((value) => value !== location.id));
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">{location.name}</FormLabel>
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

                <div>
                    <FormLabel>{t('form-custom-fields-label')}</FormLabel>
                    <FormDescription className="mb-2">{t('form-custom-fields-desc')}</FormDescription>
                    <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end">
                            <FormField
                                control={form.control}
                                name={`customFields.${index}.label`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormControl><Input {...field} placeholder={t('custom-field-label-placeholder')} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`customFields.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormControl><Input {...field} placeholder={t('custom-field-value-placeholder')} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ label: "", value: "" })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('form-add-custom-field-button')}
                    </Button>
                    </div>
                </div>

            </form>
            </Form>
        </div>
      </ScrollArea>
    </ResponsiveDialog>
  );
}

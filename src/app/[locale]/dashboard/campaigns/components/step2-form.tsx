
"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/locales/client";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Service } from "@/modules/services/domain/entities/service.entity";

async function fetchServices(): Promise<Service[]> {
    const res = await fetch("/api/services?active=true");
    if (!res.ok) throw new Error("Could not load services.");
    return res.json();
}

interface Step2FormProps {
    onBack: () => void;
    onPublish: () => void;
    onSaveDraft: () => void;
    isLoading: boolean;
}

export function Step2Form({ onBack, onPublish, onSaveDraft, isLoading }: Step2FormProps) {
    const { control } = useFormContext();
    const t = useScopedI18n("campaigns");

    const { data: services, isLoading: isLoadingServices } = useQuery({
        queryKey: ['services'],
        queryFn: fetchServices
    });

    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="generatedTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form-generated-title-label')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="generatedSubtitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form-generated-subtitle-label')}</FormLabel>
                        <FormControl><Textarea {...field} rows={2} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="generatedBody"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form-generated-body-label')}</FormLabel>
                        <FormControl><Textarea {...field} rows={4} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="chatbotInitialMessage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form-chatbot-greeting-label')}</FormLabel>
                        <FormControl><Textarea {...field} rows={2} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="chatbotConversionGoal"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form-chatbot-goal-label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('form-chatbot-goal-placeholder')} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="contact">Contact Form</SelectItem>
                                {isLoadingServices ? (
                                    <SelectItem value="loading" disabled>Loading services...</SelectItem>
                                ) : (
                                    services?.map(service => (
                                        <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>{t('dialog-back-button')}</Button>
                <Button type="button" variant="secondary" onClick={onSaveDraft} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('dialog-save-draft-button')}
                </Button>
                <Button type="button" onClick={onPublish} disabled={isLoading}>
                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('dialog-publish-button')}
                </Button>
            </div>
        </div>
    );
}

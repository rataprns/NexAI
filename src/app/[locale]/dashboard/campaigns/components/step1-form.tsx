
"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/locales/client";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

interface Step1FormProps {
    onNext: () => void;
    isLoading: boolean;
    onCancel: () => void;
    onSuggest: () => void;
}

export function Step1Form({ onNext, isLoading, onCancel, onSuggest }: Step1FormProps) {
    const { control, trigger } = useFormContext();
    const t = useScopedI18n("campaigns");

    const handleNextClick = async () => {
        const isValid = await trigger(["name", "slug", "description"]);
        if (isValid) {
            onNext();
        }
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={onSuggest} disabled={isLoading}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {t('dialog-suggest-button')}
                </Button>
            </div>
             <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form-name-label')}</FormLabel>
                        <FormControl><Input {...field} placeholder={t('form-name-placeholder')} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="slug"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form-slug-label')}</FormLabel>
                        <FormControl><Input {...field} placeholder={t('form-slug-placeholder')} /></FormControl>
                        <FormDescription>{t('form-slug-description')}</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('form-description-label')}</FormLabel>
                        <FormControl><Textarea {...field} placeholder={t('form-description-placeholder')} rows={5} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>{t('dialog-cancel-button')}</Button>
                <Button type="button" onClick={handleNextClick} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? t('dialog-button-loading') : t('dialog-next-button')}
                </Button>
            </div>
        </div>
    );
}

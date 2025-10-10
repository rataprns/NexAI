
"use client";

import { useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import { FormField, FormControl, FormLabel, FormMessage, FormItem, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CombinedFormData } from "../hooks/use-editor-content";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ContactLayoutDialog } from "./contact-layout-dialog";
import { TextareaWithAI } from "@/components/ui/textarea-with-ai";
import { ColorPicker } from "@/components/ui/color-picker";
import { useScopedI18n } from "@/locales/client";

interface ContactSectionFormProps {
  control: Control<CombinedFormData>;
}

export function ContactSectionForm({ control }: ContactSectionFormProps) {
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false);
  const form = useFormContext<CombinedFormData>();
  const t = useScopedI18n("editor");

  return (
    <>
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{t('contact.title')}</h3>
            <Button variant="outline" size="sm" onClick={() => setIsLayoutDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('common.editLayout')}
            </Button>
        </div>
        <Separator />
        <FormField
          control={control}
          name="contactSection.badge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.badge')}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contactSection.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.title')}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contactSection.titleColor"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel>{t('common.titleColor')}</FormLabel>
                <FormControl>
                  <ColorPicker
                    color={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormDescription>
                {t('common.titleColorDesc', { section: t('contact.title').toLowerCase() })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contactSection.subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.subtitle')}</FormLabel>
              <FormControl><TextareaWithAI {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contactSection.subtitleColor"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel>{t('common.subtitleColor')}</FormLabel>
                <FormControl>
                  <ColorPicker
                    color={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormDescription>
                {t('common.subtitleColorDesc', { section: t('contact.title').toLowerCase() })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('contact.formDesc')}} />
      </div>
      <ContactLayoutDialog
        isOpen={isLayoutDialogOpen}
        onOpenChange={setIsLayoutDialogOpen}
        form={form}
      />
    </>
  );
}

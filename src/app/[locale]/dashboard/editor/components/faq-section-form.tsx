
"use client";

import { useState } from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { FormField, FormControl, FormLabel, FormMessage, FormItem, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { CombinedFormData } from "../hooks/use-editor-content";
import { FaqLayoutDialog } from "./faq-layout-dialog";
import { TextareaWithAI } from "@/components/ui/textarea-with-ai";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ColorPicker } from "@/components/ui/color-picker";
import { useScopedI18n } from "@/locales/client";

interface FaqSectionFormProps {
  control: Control<CombinedFormData>;
}

export function FaqSectionForm({ control }: FaqSectionFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq.items",
  });
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false);
  const form = useFormContext<CombinedFormData>();
  const t = useScopedI18n("editor");

  return (
    <>
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{t('faq.title')}</h3>
            <Button variant="outline" size="sm" onClick={() => setIsLayoutDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('common.editLayout')}
            </Button>
        </div>
        <Separator />
        <FormField
          control={control}
          name="faq.badge"
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
          name="faq.title"
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
          name="faq.titleColor"
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
                {t('common.titleColorDesc', { section: t('faq.title').toLowerCase() })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="faq.subtitle"
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
          name="faq.subtitleColor"
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
                {t('common.subtitleColorDesc', { section: t('faq.title').toLowerCase() })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <div className="space-y-4">
          <FormLabel>{t('faq.items')}</FormLabel>
          <FormDescription>{t('faq.itemsDesc')}</FormDescription>
            <Accordion type="multiple" className="w-full space-y-2">
                {fields.map((field, index) => (
                    <AccordionItem key={field.id} value={`item-${index}`} className="rounded-lg border bg-muted/50 px-4">
                        <div className="flex items-center">
                            <AccordionTrigger className="flex-1 text-left">
                                {form.watch(`faq.items.${index}.question`) || `${t('faq.question')} ${index + 1}`}
                            </AccordionTrigger>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="ml-2">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                        <AccordionContent>
                            <div className="grid gap-4 pt-4">
                            <FormField
                                control={control}
                                name={`faq.items.${index}.question`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('faq.question')}</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={control}
                                name={`faq.items.${index}.answer`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('faq.answer')}</FormLabel>
                                    <FormControl><TextareaWithAI {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ question: "", answer: "" })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('faq.addItem')}
          </Button>
        </div>
      </div>
      <FaqLayoutDialog
        isOpen={isLayoutDialogOpen}
        onOpenChange={setIsLayoutDialogOpen}
        form={form}
      />
    </>
  );
}

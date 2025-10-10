
"use client";

import { useState } from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { FormField, FormControl, FormLabel, FormMessage, FormItem, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { CombinedFormData } from "../hooks/use-editor-content";
import { FeaturesLayoutDialog } from "./features-layout-dialog";
import { TextareaWithAI } from "@/components/ui/textarea-with-ai";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ColorPicker } from "@/components/ui/color-picker";
import { useScopedI18n } from "@/locales/client";

interface FeaturesSectionFormProps {
  control: Control<CombinedFormData>;
}

export function FeaturesSectionForm({ control }: FeaturesSectionFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features.items",
  });
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false);
  const form = useFormContext<CombinedFormData>();
  const t = useScopedI18n("editor");

  return (
    <>
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{t('features.title')}</h3>
            <Button variant="outline" size="sm" onClick={() => setIsLayoutDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('common.editLayout')}
            </Button>
        </div>
        <Separator />
        <FormField
          control={control}
          name="features.badge"
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
          name="features.title"
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
          name="features.titleColor"
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
                {t('common.titleColorDesc', { section: t('features.title').toLowerCase() })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="features.subtitle"
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
          name="features.subtitleColor"
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
                {t('common.subtitleColorDesc', { section: t('features.title').toLowerCase() })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={control}
          name="features.imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.imageUrl')}</FormLabel>
              <FormControl><Input placeholder="https://picsum.photos/..." {...field} value={field.value ?? ''} /></FormControl>
              <FormDescription>{t('features.imageUrlDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <div className="space-y-4">
          <FormLabel>{t('features.items')}</FormLabel>
          <FormDescription>{t('features.itemsDesc')}</FormDescription>
            <Accordion type="multiple" className="w-full space-y-2">
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={`item-${index}`} className="rounded-lg border bg-muted/50 px-4">
                    <div className="flex items-center">
                        <AccordionTrigger className="flex-1 text-left">
                            {form.watch(`features.items.${index}.title`) || `${t('features.itemTitle')} ${index + 1}`}
                        </AccordionTrigger>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="ml-2">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                  <AccordionContent>
                    <div className="grid gap-4 pt-4">
                      <FormField
                        control={control}
                        name={`features.items.${index}.icon`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('features.icon')}</FormLabel>
                            <FormControl><Input placeholder="e.g. Layers" {...field} /></FormControl>
                            <FormDescription>{t('features.iconDesc')}</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`features.items.${index}.title`}
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
                        name={`features.items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('common.description')}</FormLabel>
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
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ icon: "", title: "", description: "" })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('features.addItem')}
          </Button>
        </div>
      </div>
       <FeaturesLayoutDialog
        isOpen={isLayoutDialogOpen}
        onOpenChange={setIsLayoutDialogOpen}
        form={form}
      />
    </>
  );
}

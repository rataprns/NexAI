
"use client";

import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { FormField, FormControl, FormLabel, FormMessage, FormItem, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { CombinedFormData } from "../hooks/use-editor-content";
import { TextareaWithAI } from "@/components/ui/textarea-with-ai";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScopedI18n } from "@/locales/client";

interface FooterSectionFormProps {
  control: Control<CombinedFormData>;
}

export function FooterSectionForm({ control }: FooterSectionFormProps) {
  const { fields: columnFields, append: appendColumn, remove: removeColumn } = useFieldArray({
    control,
    name: "footerSection.linkColumns",
  });
  const form = useFormContext<CombinedFormData>();
  const t = useScopedI18n("editor");

  return (
    <div className="space-y-6 rounded-lg border p-4">
      <FormField
        control={control}
        name="footerSection.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('footer.description')}</FormLabel>
            <FormControl><TextareaWithAI {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>{t('footer.linkColumns')}</FormLabel>
        <FormDescription>{t('footer.linkColumnsDesc')}</FormDescription>
        <Accordion type="multiple" className="w-full space-y-2">
            {columnFields.map((columnField, columnIndex) => (
            <AccordionItem key={columnField.id} value={`item-${columnIndex}`} className="rounded-lg border bg-muted/50 px-4">
                <div className="flex items-center">
                    <AccordionTrigger className="flex-1 text-left">
                        {form.watch(`footerSection.linkColumns.${columnIndex}.title`) || `${t('footer.column')} ${columnIndex + 1}`}
                    </AccordionTrigger>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeColumn(columnIndex)} className="ml-2">
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
                <AccordionContent>
                    <div className="space-y-4 pt-4">
                        <FormField
                        control={control}
                        name={`footerSection.linkColumns.${columnIndex}.title`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('footer.columnTitle')}</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <LinkArray control={control} columnIndex={columnIndex} />
                    </div>
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => appendColumn({ title: t('footer.newColumn'), links: [] })}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('footer.addColumn')}
        </Button>
      </div>
    </div>
  );
}


function LinkArray({ columnIndex, control }: { columnIndex: number, control: Control<CombinedFormData> }) {
  const t = useScopedI18n("editor");
  const { fields, append, remove } = useFieldArray({
    control,
    name: `footerSection.linkColumns.${columnIndex}.links`
  });

  return (
    <div className="space-y-3 pl-4 border-l">
      <FormLabel>{t('footer.links')}</FormLabel>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <div className="grid grid-cols-2 gap-2 flex-1">
             <FormField
              control={control}
              name={`footerSection.linkColumns.${columnIndex}.links.${index}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormControl><Input placeholder={t('footer.linkTextPlaceholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name={`footerSection.linkColumns.${columnIndex}.links.${index}.href`}
              render={({ field }) => (
                <FormItem>
                  <FormControl><Input placeholder="/#contact" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ text: t('footer.newLink'), href: "#" })}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        {t('footer.addLink')}
      </Button>
    </div>
  );
}

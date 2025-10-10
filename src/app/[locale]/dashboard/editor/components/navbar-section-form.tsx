
"use client";

import { useState } from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { FormField, FormControl, FormLabel, FormMessage, FormItem, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import { CombinedFormData } from "../hooks/use-editor-content";
import { NavbarLayoutDialog } from "./navbar-layout-dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";

interface NavbarSectionFormProps {
  control: Control<CombinedFormData>;
}

export function NavbarSectionForm({ control }: NavbarSectionFormProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "navbarSection.links",
  });
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false);
  const form = useFormContext<CombinedFormData>();
  const t = useScopedI18n("editor");

  const toggleVisibility = (index: number) => {
    const link = form.getValues(`navbarSection.links.${index}`);
    update(index, { ...link, visible: !link.visible });
  };

  return (
    <>
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{t('navbar.title')}</h3>
            <Button variant="outline" size="sm" onClick={() => setIsLayoutDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('common.editLayout')}
            </Button>
        </div>
        <Separator />
        <div className="space-y-4">
          <FormLabel>{t('navbar.links')}</FormLabel>
          <FormDescription>{t('navbar.linksDesc')}</FormDescription>
          {fields.map((field, index) => {
            const isVisible = form.watch(`navbarSection.links.${index}.visible`, true);
            return (
            <div key={field.id} className={cn("grid grid-cols-[1fr_1fr_auto_auto] items-end gap-2 p-4 rounded-lg border", isVisible ? "bg-muted/50" : "bg-muted/20 opacity-60")}>
              <FormField
                control={control}
                name={`navbarSection.links.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('navbar.linkText')}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`navbarSection.links.${index}.href`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('navbar.linkUrl')}</FormLabel>
                    <FormControl><Input placeholder="/#contact" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => toggleVisibility(index)}>
                  {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )})}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ text: t('navbar.newLink'), href: "#", visible: true })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('navbar.addLink')}
          </Button>
        </div>
      </div>
       <NavbarLayoutDialog 
        isOpen={isLayoutDialogOpen} 
        onOpenChange={setIsLayoutDialogOpen} 
        form={form}
      />
    </>
  );
}

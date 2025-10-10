
"use client";

import { useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import { FormField, FormControl, FormLabel, FormMessage, FormItem, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { CombinedFormData } from "../hooks/use-editor-content";
import { HeroLayoutDialog } from "./hero-layout-dialog";
import { TextareaWithAI } from "@/components/ui/textarea-with-ai";
import { ColorPicker } from "@/components/ui/color-picker";
import { useScopedI18n } from "@/locales/client";

interface HeroSectionFormProps {
  control: Control<CombinedFormData>;
}

export function HeroSectionForm({ control }: HeroSectionFormProps) {
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false);
  const form = useFormContext<CombinedFormData>();
  const t = useScopedI18n("editor");

  return (
    <>
      <div className="space-y-4 rounded-lg border p-4">
         <div className="flex items-center justify-between">
            <FormLabel>{t('hero.content')}</FormLabel>
            <Button variant="outline" size="sm" onClick={() => setIsLayoutDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('common.editLayout')}
            </Button>
        </div>
        <FormField
          control={control}
          name="heroSection.title"
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
          name="heroSection.titleColor"
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
                {t('common.titleColorDesc', { section: t('hero.title').toLowerCase() })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="heroSection.subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.subtitle')}</FormLabel>
              <FormControl><TextareaWithAI {...field} /></FormControl>
              <FormDescription>
                {t('hero.subtitleDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={control}
          name="heroSection.subtitleColor"
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
                {t('common.subtitleColorDesc', { section: t('hero.title').toLowerCase() })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="heroSection.imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.imageUrl')}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="heroSection.ctaButton1Text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hero.cta1')}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="heroSection.ctaButton2Text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hero.cta2')}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <HeroLayoutDialog 
        isOpen={isLayoutDialogOpen} 
        onOpenChange={setIsLayoutDialogOpen} 
        form={form}
      />
    </>
  );
}

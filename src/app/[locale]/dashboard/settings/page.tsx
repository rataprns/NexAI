
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeSelector } from "@/components/theme-selector";
import { updateSettingSchema, UpdateSettingDto } from "@/modules/settings/application/dtos/setting.dto";
import defaultSettings from "@/lib/default-settings.json";
import { useScopedI18n } from "@/locales/client";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsQuery, useUpdateSettingsMutation } from "./_hooks/useSettings";

export default function SettingsPage() {
  const { toast } = useToast();
  const t = useScopedI18n("settings");

  const { data: settings, isLoading, isError } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  const form = useForm<UpdateSettingDto>({
    resolver: zodResolver(updateSettingSchema),
    defaultValues: defaultSettings as unknown as UpdateSettingDto,
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Could not load settings.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);
  
  useEffect(() => {
    if (updateMutation.isSuccess) {
      const newSettings = updateMutation.data;
      form.reset(newSettings);
      
      toast({
        title: t('success-save-title'),
        description: t('success-save-description'),
      });
      
      const dirtyFields = form.formState.dirtyFields;
      if (dirtyFields.theme || dirtyFields.appName || dirtyFields.logoUrl || dirtyFields.logoIconName || dirtyFields.isIconLogo) {
        window.location.reload();
      }
    }
    if (updateMutation.isError) {
      toast({
        title: "Error",
        description: updateMutation.error.message || t('error-save'),
        variant: "destructive",
      });
    }
  }, [updateMutation.isSuccess, updateMutation.isError, updateMutation.data, updateMutation.error, form, t, toast]);


  async function onSubmit(values: UpdateSettingDto) {
    updateMutation.mutate(values);
  }

  if (isLoading) {
      return (
        <>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
          </div>
          <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4">
              <div className="w-full space-y-8">
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-10 w-24" />
              </div>
          </div>
        </>
      )
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
      </div>
      <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('card-title')}</CardTitle>
            <CardDescription>
              {t('card-description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('app-name-label')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Your App Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('app-name-description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact-email-label')}</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@yourapp.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('contact-email-description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('timezone-label')}</FormLabel>
                      <FormControl>
                        <Input placeholder="America/Santiago" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('timezone-description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />

                <div>
                    <h4 className="mb-4 text-md font-medium">{t('ai-title')}</h4>
                     <div className="space-y-4 rounded-lg border p-4">
                        <FormField
                          control={form.control}
                          name="plugin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('ai-plugin-label')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a plugin" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="googleai">Google AI</SelectItem>
                                    </SelectContent>
                                </Select>
                              <FormDescription>
                                {t('ai-plugin-description')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('ai-model-label')}</FormLabel>
                              <FormControl>
                                <Input placeholder="gemini-1.5-flash" {...field} />
                              </FormControl>
                              <FormDescription>
                                {t('ai-model-description')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                </div>

                <Separator />
                
                <div>
                    <h4 className="mb-4 text-md font-medium">{t('logo-title')}</h4>
                     <div className="space-y-4 rounded-lg border p-4">
                        <FormField
                            control={form.control}
                            name="isIconLogo"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">{t('logo-type-label')}</FormLabel>
                                    <FormDescription>
                                        {t('logo-type-description')}
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <span>Image</span>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        <span>Icon</span>
                                    </div>
                                </FormControl>
                                </FormItem>
                            )}
                        />
                        {form.watch('isIconLogo') ? (
                            <FormField
                                control={form.control}
                                name="logoIconName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('logo-icon-name-label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mountain" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t('logo-icon-name-description')}
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="logoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('logo-url-label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t('logo-url-description')}
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('theme-label')}</FormLabel>
                      <FormDescription>
                        {t('theme-description')}
                      </FormDescription>
                      <FormControl>
                        <ThemeSelector value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />

                <div>
                    <h4 className="mb-4 text-md font-medium">{t('visibility-title')}</h4>
                    <div className="space-y-4 rounded-lg border p-4">
                       <FormField
                          control={form.control}
                          name="landingPage.showLanguageSelector"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base">{t('language-selector-label')}</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="landingPage.showServices"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base">{t('services-section-label')}</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="landingPage.showFeatures"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base">{t('features-section-label')}</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="landingPage.showTestimonials"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base">{t('testimonials-section-label')}</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="landingPage.showAppointments"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base">{t('appointments-section-label')}</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="landingPage.showFaq"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base">{t('faq-section-label')}</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="landingPage.showContact"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base">{t('contact-section-label')}</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              </FormItem>
                          )}
                      />
                    </div>
                </div>

                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? t('save-button-loading') : t('save-button')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

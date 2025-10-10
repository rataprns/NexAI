
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
import { Skeleton } from "@/components/ui/skeleton";
import defaultSettings from "@/lib/default-settings.json";
import { z } from "zod";
import { useScopedI18n } from "@/locales/client";
import { TextareaWithAI } from "@/components/ui/textarea-with-ai";
import { useAiSettings, useUpdateAiSettings } from "./_hooks/useAiSettings";
import { UpdateSettingDto } from "@/modules/settings/application/dtos/setting.dto";

const aiSettingsSchema = z.object({
  knowledgeBase: z.string().optional(),
  chatbotInitialMessage: z.string().optional(),
});

type AiSettingsFormData = z.infer<typeof aiSettingsSchema>;

export default function AiSettingsPage() {
  const { toast } = useToast();
  const t = useScopedI18n("ai-settings");

  const { data: settings, isLoading, isError } = useAiSettings();
  const mutation = useUpdateAiSettings();

  const form = useForm<AiSettingsFormData>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      knowledgeBase: "",
      chatbotInitialMessage: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        knowledgeBase: settings.knowledgeBase,
        chatbotInitialMessage: settings.chatbotInitialMessage,
      });
    }
  }, [settings, form]);
  
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: t('error-load'),
        variant: "destructive",
      });
      form.reset({
          knowledgeBase: defaultSettings.knowledgeBase,
          chatbotInitialMessage: defaultSettings.chatbotInitialMessage,
      });
    }
  }, [isError, form, toast, t]);

  useEffect(() => {
    if (mutation.isSuccess) {
      const newSettings = mutation.data as UpdateSettingDto;
      form.reset({
        knowledgeBase: newSettings.knowledgeBase,
        chatbotInitialMessage: newSettings.chatbotInitialMessage,
      });
      toast({
        title: t('success-save-title'),
        description: t('success-save-description'),
      });
    }
    if (mutation.isError) {
       toast({
        title: "Error",
        description: mutation.error.message || t('error-save'),
        variant: "destructive",
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.data, mutation.error, form, toast, t]);


  async function onSubmit(values: AiSettingsFormData) {
    if (settings) {
      const updatedSettings = { ...settings, ...values };
      mutation.mutate(updatedSettings);
    }
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
            {isLoading ? (
                <div className="space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                </div>
            ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="chatbotInitialMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('initial-message-label')}</FormLabel>
                      <FormControl>
                        <TextareaWithAI
                          placeholder={t('initial-message-placeholder')}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('initial-message-description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="knowledgeBase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('knowledge-base-label')}</FormLabel>
                      <FormControl>
                        <TextareaWithAI
                          placeholder={t('knowledge-base-placeholder')}
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('knowledge-base-description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? t('save-button-loading') : t('save-button')}
                </Button>
              </form>
            </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

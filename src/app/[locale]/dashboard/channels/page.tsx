

"use client";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { updateSettingSchema, UpdateSettingDto } from "@/modules/settings/application/dtos/setting.dto";
import { useScopedI18n } from "@/locales/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Info, Copy, RefreshCw } from "lucide-react";
import defaultSettings from "@/lib/default-settings.json";
import { ChannelsGuideDialog } from "./components/channels-guide-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fetchSettings = async (): Promise<UpdateSettingDto> => {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
};

const updateSettings = async (data: Partial<UpdateSettingDto>) => {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update settings");
  }
  return res.json();
};

export default function ChannelsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useScopedI18n("channels");
  const [showWhatsappSecret, setShowWhatsappSecret] = useState(false);
  const [showMessengerSecret, setShowMessengerSecret] = useState(false);
  const [showInstagramSecret, setShowInstagramSecret] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    // This ensures window is defined, only runs on client
    setBaseUrl(window.location.origin);
  }, []);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  const form = useForm<UpdateSettingDto>({
    resolver: zodResolver(updateSettingSchema),
    defaultValues: defaultSettings as unknown as UpdateSettingDto,
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        ...form.getValues(),
        ...settings,
        integrations: {
          whatsapp: {
            webhookVerifyToken: settings.integrations?.whatsapp?.webhookVerifyToken || '',
            accessToken: settings.integrations?.whatsapp?.accessToken || '',
            appSecret: settings.integrations?.whatsapp?.appSecret || '',
            fromNumberId: settings.integrations?.whatsapp?.fromNumberId || '',
          },
          messenger: {
            webhookVerifyToken: settings.integrations?.messenger?.webhookVerifyToken || '',
            accessToken: settings.integrations?.messenger?.accessToken || '',
            appSecret: settings.integrations?.messenger?.appSecret || '',
          },
          instagram: {
            webhookVerifyToken: settings.integrations?.instagram?.webhookVerifyToken || '',
            accessToken: settings.integrations?.instagram?.accessToken || '',
            appSecret: settings.integrations?.instagram?.appSecret || '',
          }
        }
      });
    }
  }, [settings, form]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (newSettings) => {
      queryClient.setQueryData(['settings'], newSettings);
      form.reset(newSettings);
      toast({
        title: t('success-save-title'),
        description: t('success-save-description'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('error-title'),
        description: error.message || t('error-save'),
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: UpdateSettingDto) {
    mutation.mutate(values);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard.",
    });
  }
  
  const generateToken = () => {
    // Simple random token generator for client-side use
    return [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
  }

  if (isLoading) {
    return (
        <div className="space-y-8 w-full">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
         <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsGuideOpen(true)}>
            <Info className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('integrations-title')}</CardTitle>
                        <CardDescription>{t('integrations-description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full" defaultValue="whatsapp">
                            <AccordionItem value="whatsapp">
                                <AccordionTrigger>{t('whatsapp-title')}</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                     <FormItem>
                                        <FormLabel>{t('webhook-url-label')}</FormLabel>
                                        <div className="flex gap-2">
                                            <Input readOnly value={`${baseUrl}/api/webhooks/whatsapp`} />
                                            <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(`${baseUrl}/api/webhooks/whatsapp`)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormDescription>{t('webhook-url-description')}</FormDescription>
                                    </FormItem>
                                     <FormField
                                        control={form.control}
                                        name="integrations.whatsapp.webhookVerifyToken"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>{t('verify-token-label')}</FormLabel>
                                            <div className="flex gap-2">
                                                <FormControl>
                                                    <Input placeholder="your-secret-verify-token" {...field} />
                                                </FormControl>
                                                <Button type="button" variant="outline" size="icon" onClick={() => form.setValue('integrations.whatsapp.webhookVerifyToken', generateToken())}>
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormDescription>{t('verify-token-description')}</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    <FormField
                                    control={form.control}
                                    name="integrations.whatsapp.accessToken"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{t('access-token-label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="EAA..." {...field} />
                                        </FormControl>
                                        <FormDescription>{t('whatsapp-access-token-description')}</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="integrations.whatsapp.fromNumberId"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>{t('from-number-id-label')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1234567890" {...field} />
                                            </FormControl>
                                            <FormDescription>{t('from-number-id-description')}</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="integrations.whatsapp.appSecret"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>{t('app-secret-label')}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type={showWhatsappSecret ? "text" : "password"} {...field} />
                                                    <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute inset-y-0 right-0 h-full px-3"
                                                    onClick={() => setShowWhatsappSecret(!showWhatsappSecret)}
                                                    >
                                                    {showWhatsappSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>{t('app-secret-description')}</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="messenger">
                                <AccordionTrigger>{t('messenger-title')}</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                    <FormItem>
                                        <FormLabel>{t('webhook-url-label')}</FormLabel>
                                        <div className="flex gap-2">
                                            <Input readOnly value={`${baseUrl}/api/webhooks/messenger`} />
                                            <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(`${baseUrl}/api/webhooks/messenger`)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormDescription>{t('webhook-url-description')}</FormDescription>
                                    </FormItem>
                                    <FormField
                                        control={form.control}
                                        name="integrations.messenger.webhookVerifyToken"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('verify-token-label')}</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input placeholder="your-secret-verify-token" {...field} />
                                                    </FormControl>
                                                    <Button type="button" variant="outline" size="icon" onClick={() => form.setValue('integrations.messenger.webhookVerifyToken', generateToken())}>
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <FormDescription>{t('verify-token-description')}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="integrations.messenger.accessToken"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>{t('access-token-label')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="EAA..." {...field} />
                                            </FormControl>
                                            <FormDescription>{t('access-token-description')}</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="integrations.messenger.appSecret"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>{t('app-secret-label')}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type={showMessengerSecret ? "text" : "password"} {...field} />
                                                    <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute inset-y-0 right-0 h-full px-3"
                                                    onClick={() => setShowMessengerSecret(!showMessengerSecret)}
                                                    >
                                                    {showMessengerSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>{t('app-secret-description')}</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="instagram">
                                <AccordionTrigger>{t('instagram-title')}</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                     <FormItem>
                                        <FormLabel>{t('webhook-url-label')}</FormLabel>
                                        <div className="flex gap-2">
                                            <Input readOnly value={`${baseUrl}/api/webhooks/instagram`} />
                                            <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(`${baseUrl}/api/webhooks/instagram`)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormDescription>{t('webhook-url-description')}</FormDescription>
                                    </FormItem>
                                     <FormField
                                        control={form.control}
                                        name="integrations.instagram.webhookVerifyToken"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('verify-token-label')}</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input placeholder="your-secret-verify-token" {...field} />
                                                    </FormControl>
                                                    <Button type="button" variant="outline" size="icon" onClick={() => form.setValue('integrations.instagram.webhookVerifyToken', generateToken())}>
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <FormDescription>{t('verify-token-description')}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="integrations.instagram.accessToken"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{t('access-token-label')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="EAA..." {...field} />
                                        </FormControl>
                                        <FormDescription>{t('access-token-description')}</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="integrations.instagram.appSecret"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>{t('app-secret-label')}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type={showInstagramSecret ? "text" : "password"} {...field} />
                                                    <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute inset-y-0 right-0 h-full px-3"
                                                    onClick={() => setShowInstagramSecret(!showInstagramSecret)}
                                                    >
                                                    {showInstagramSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>{t('app-secret-description')}</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? t('save-button-loading') : t('save-button')}
                </Button>
            </form>
        </Form>
      </div>
      <ChannelsGuideDialog isOpen={isGuideOpen} onOpenChange={setIsGuideOpen} />
    </>
  );
}

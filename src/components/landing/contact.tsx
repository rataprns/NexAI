
'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScopedI18n } from "@/locales/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, ContactFormDto } from "@/modules/contact/application/dtos/contact.dto";
import type { Setting } from "@/modules/settings/domain/entities/setting.entity";
import type { ContactSection as ContactSectionEntity } from "@/modules/contact-section/domain/entities/contact-section.entity";
import defaultSettings from "@/lib/default-settings.json";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const sendContactMessage = async (values: ContactFormDto) => {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return response.json();
}

type ContactProps = {
  settings: Setting | null;
  contactSection: ContactSectionEntity | null;
};

export function Contact({ settings, contactSection }: ContactProps) {
  const t = useScopedI18n('common');
  const { toast } = useToast();

  const content = useMemo(() => {
    return contactSection || defaultSettings.landingPage.contactSection;
  }, [contactSection]);

  const {
    containerStyles,
    gridStyles,
    badge,
    title,
    subtitle,
    titleColor,
    subtitleColor,
  } = content;

  const form = useForm<ContactFormDto>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactEmail = settings?.contactEmail || defaultSettings.contactEmail;

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      toast({
        title: 'Message Sent!',
        description: "We've received your message and will get back to you shortly.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: "destructive",
      });
    }
  });

  async function onSubmit(values: ContactFormDto) {
    mutation.mutate(values);
  }

  return (
    <section id="contact" className={cn(containerStyles)}>
      <div className="container px-4 md:px-6">
        <div className={cn(gridStyles)}>
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">{badge}</div>
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline"
              style={{ color: titleColor || undefined }}
            >
              {title}
            </h2>
            <p
              className="max-w-[600px] text-muted-foreground md:text-xl/relaxed"
              style={{ color: subtitleColor || undefined }}
            >
              {subtitle}
            </p>
             <div className="space-y-4 text-muted-foreground">
                <p>Fill out the form, or email us at:</p>
                <a href={`mailto:${contactEmail}`} className="font-semibold text-primary hover:underline">{contactEmail}</a>
            </div>
          </div>
          <div className="w-full">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input {...form.register("name")} type="text" placeholder='Name' className="h-12" />
                <Input {...form.register("email")} type="email" placeholder='Email' className="h-12" />
              </div>
              <Textarea {...form.register("message")} placeholder='Your Message' className="min-h-[150px]" />
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={mutation.isPending}>
                {mutation.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

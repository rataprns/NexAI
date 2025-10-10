
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import defaultSettings from "@/lib/default-settings.json";
import type { Setting } from "@/modules/settings/domain/entities/setting.entity";
import { updateHeroSectionSchema, UpdateHeroSectionDto } from "@/modules/hero/application/dtos/hero-section.dto";
import { updateFeaturesSchema, UpdateFeaturesDto } from "@/modules/features/application/dtos/feature.dto";
import { updateTestimonialsSchema, UpdateTestimonialsDto } from "@/modules/testimonials/application/dtos/testimonial.dto";
import { updateFaqSchema, UpdateFaqDto } from "@/modules/faq/application/dtos/faq.dto";
import { updateSettingSchema, UpdateSettingDto } from "@/modules/settings/application/dtos/setting.dto";
import { updateAppointmentsSectionSchema, UpdateAppointmentsSectionDto } from "@/modules/appointments-section/application/dtos/appointments-section.dto";
import { updateFooterSectionSchema, UpdateFooterSectionDto } from "@/modules/footer-section/application/dtos/footer-section.dto";
import { updateNavbarSectionSchema, UpdateNavbarSectionDto } from "@/modules/navbar-section/application/dtos/navbar-section.dto";
import { updateContactSectionSchema, UpdateContactSectionDto } from "@/modules/contact-section/application/dtos/contact-section.dto";
import { updateServicesSectionSchema, UpdateServicesSectionDto } from "@/modules/services-section/application/dtos/services-section.dto";

const combinedFormSchema = z.object({
  heroSection: updateHeroSectionSchema,
  features: updateFeaturesSchema,
  testimonials: updateTestimonialsSchema,
  faq: updateFaqSchema,
  appointmentsSection: updateAppointmentsSectionSchema,
  contactSection: updateContactSectionSchema,
  servicesSection: updateServicesSectionSchema,
  footerSection: updateFooterSectionSchema,
  navbarSection: updateNavbarSectionSchema,
  settings: updateSettingSchema,
});

export type CombinedFormData = z.infer<typeof combinedFormSchema>;

const fetchAllContent = async () => {
    const [heroRes, featuresRes, testimonialsRes, faqRes, appointmentsRes, footerRes, navbarRes, contactSectionRes, servicesSectionRes, settingsRes] = await Promise.all([
      fetch("/api/hero"),
      fetch("/api/features"),
      fetch("/api/testimonials"),
      fetch("/api/faq"),
      fetch("/api/appointments-section"),
      fetch("/api/footer-section"),
      fetch("/api/navbar-section"),
      fetch("/api/contact-section"),
      fetch("/api/services-section"),
      fetch("/api/settings"),
    ]);

    if (!heroRes.ok || !featuresRes.ok || !testimonialsRes.ok || !faqRes.ok || !appointmentsRes.ok || !footerRes.ok || !navbarRes.ok || !contactSectionRes.ok || !servicesSectionRes.ok || !settingsRes.ok) {
      throw new Error("Failed to fetch page content");
    }

    return {
        heroSection: await heroRes.json(),
        features: await featuresRes.json(),
        testimonials: await testimonialsRes.json(),
        faq: await faqRes.json(),
        appointmentsSection: await appointmentsRes.json(),
        footerSection: await footerRes.json(),
        navbarSection: await navbarRes.json(),
        contactSection: await contactSectionRes.json(),
        servicesSection: await servicesSectionRes.json(),
        settings: await settingsRes.json(),
    };
};

const updateAllContent = async (data: {
    values: CombinedFormData;
    orderedSections: string[];
}) => {
    const { values, orderedSections } = data;
    const validation = combinedFormSchema.safeParse(values);

    if (!validation.success) {
      console.error("Form validation errors:", validation.error.flatten());
      throw new Error("Invalid Input. Please check your input values.");
    }
    
    const updatedSettingsPayload: UpdateSettingDto = {
      ...values.settings,
      landingPage: {
          ...values.settings.landingPage,
          sectionOrder: orderedSections,
      }
    };

    const [heroRes, featuresRes, testimonialsRes, faqRes, appointmentsRes, footerRes, navbarRes, contactSectionRes, servicesSectionRes, settingsRes] = await Promise.all([
      fetch("/api/hero", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.heroSection) }),
      fetch("/api/features", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.features) }),
      fetch("/api/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.testimonials) }),
      fetch("/api/faq", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.faq) }),
      fetch("/api/appointments-section", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.appointmentsSection) }),
      fetch("/api/footer-section", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.footerSection) }),
      fetch("/api/navbar-section", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.navbarSection) }),
      fetch("/api/contact-section", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.contactSection) }),
      fetch("/api/services-section", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values.servicesSection) }),
      fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedSettingsPayload) }),
    ]);

    if (!heroRes.ok || !featuresRes.ok || !testimonialsRes.ok || !faqRes.ok || !appointmentsRes.ok || !footerRes.ok || !navbarRes.ok || !contactSectionRes.ok || !servicesSectionRes.ok || !settingsRes.ok) {
      throw new Error("Failed to save one or more content sections");
    }
    
    return {
        heroSection: await heroRes.json(),
        features: await featuresRes.json(),
        testimonials: await testimonialsRes.json(),
        faq: await faqRes.json(),
        appointmentsSection: await appointmentsRes.json(),
        footerSection: await footerRes.json(),
        navbarSection: await navbarRes.json(),
        contactSection: await contactSectionRes.json(),
        servicesSection: await servicesSectionRes.json(),
        settings: await settingsRes.json(),
    };
};

export function useEditorContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [orderedSections, setOrderedSections] = useState<string[]>([]);
  
  const { data: content, isLoading, isError, error } = useQuery({
      queryKey: ['landingPageContent'],
      queryFn: fetchAllContent,
  });

  const form = useForm<CombinedFormData>({
    defaultValues: {
      heroSection: defaultSettings.landingPage.heroSection as UpdateHeroSectionDto,
      features: defaultSettings.landingPage.features as UpdateFeaturesDto,
      testimonials: defaultSettings.landingPage.testimonials as UpdateTestimonialsDto,
      faq: defaultSettings.landingPage.faq as UpdateFaqDto,
      appointmentsSection: defaultSettings.landingPage.appointments as UpdateAppointmentsSectionDto,
      contactSection: defaultSettings.landingPage.contactSection as UpdateContactSectionDto,
      servicesSection: (defaultSettings.landingPage as any).servicesSection as UpdateServicesSectionDto,
      footerSection: defaultSettings.landingPage.footer as UpdateFooterSectionDto,
      navbarSection: defaultSettings.landingPage.navbar as unknown as UpdateNavbarSectionDto,
      settings: defaultSettings as unknown as Setting
    },
  });

  useEffect(() => {
      if (content) {
          form.reset({
            heroSection: content.heroSection || defaultSettings.landingPage.heroSection,
            features: content.features || defaultSettings.landingPage.features,
            testimonials: content.testimonials || defaultSettings.landingPage.testimonials,
            faq: content.faq || defaultSettings.landingPage.faq,
            appointmentsSection: content.appointmentsSection || defaultSettings.landingPage.appointments,
            contactSection: content.contactSection || defaultSettings.landingPage.contactSection,
            servicesSection: content.servicesSection || (defaultSettings.landingPage as any).servicesSection,
            footerSection: content.footerSection || defaultSettings.landingPage.footer,
            navbarSection: content.navbarSection || defaultSettings.landingPage.navbar,
            settings: content.settings || defaultSettings,
          });
          setOrderedSections(content.settings?.landingPage?.sectionOrder.filter((s: string) => s !== 'navbar' && s !== 'footer') || []);
      }
      if (isError) {
        toast({
          title: "Error",
          description: (error as Error).message || "Could not load page content.",
          variant: "destructive",
        });
      }
  }, [content, isError, error, form, toast]);

  const mutation = useMutation({
      mutationFn: updateAllContent,
      onSuccess: (newData) => {
          queryClient.setQueryData(['landingPageContent'], newData);
          form.reset({
              heroSection: newData.heroSection,
              features: newData.features,
              testimonials: newData.testimonials,
              faq: newData.faq,
              appointmentsSection: newData.appointmentsSection,
              contactSection: newData.contactSection,
              servicesSection: newData.servicesSection,
              footerSection: newData.footerSection,
              navbarSection: newData.navbarSection,
              settings: newData.settings,
          });
          setOrderedSections(newData.settings.landingPage.sectionOrder.filter((s: string) => s !== 'navbar' && s !== 'footer'));
          toast({
              title: "Success",
              description: "Your landing page content has been saved successfully.",
          });
      },
      onError: (error: any) => {
          toast({
              title: "Error",
              description: error.message || "An unexpected error occurred.",
              variant: "destructive",
          });
      }
  });

  return {
    form,
    content,
    isLoading,
    mutation,
    orderedSections,
    setOrderedSections,
  };
}

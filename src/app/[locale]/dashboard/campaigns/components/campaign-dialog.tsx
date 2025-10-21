
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useScopedI18n, useCurrentLocale } from "@/locales/client";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Form } from "@/components/ui/form";
import { useCreateCampaign, useGenerateCampaignContent, useSuggestCampaignIdea, useUpdateCampaign } from "../_hooks/useCampaigns";
import { Campaign } from "@/modules/campaigns/domain/entities/campaign.entity";
import { Step1Form } from "./step1-form";
import { Step2Form } from "./step2-form";
import { z } from "zod";

interface CampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: Campaign | null;
  onCampaignCreated: () => void;
}

const createCampaignSchemaStep1 = z.object({
  name: z.string().min(1, "Campaign name is required"),
  slug: z.string().min(1, "URL Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().min(10, "Description must be at least 10 characters long"),
});

const updateCampaignSchemaStep2 = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Campaign name is required"),
  slug: z.string().min(1, "URL Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().min(1, "Description is required"),
  status: z.nativeEnum(require('@/modules/campaigns/domain/entities/campaign.entity').CampaignStatus),
  generatedTitle: z.string().min(1, "Title is required"),
  generatedSubtitle: z.string().min(1, "Subtitle is required"),
  generatedBody: z.string().min(1, "Body is required"),
  chatbotInitialMessage: z.string().min(1, "Chatbot greeting is required"),
  chatbotConversionGoal: z.string().min(1, "Chatbot goal is required"),
});


export function CampaignDialog({ isOpen, onOpenChange, campaign, onCampaignCreated }: CampaignDialogProps) {
  const [step, setStep] = useState(1);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const { toast } = useToast();
  const t = useScopedI18n("campaigns");
  const locale = useCurrentLocale();

  const createMutation = useCreateCampaign();
  const generateContentMutation = useGenerateCampaignContent();
  const suggestIdeaMutation = useSuggestCampaignIdea();
  const updateMutation = useUpdateCampaign();

  const form = useForm({
    resolver: zodResolver(step === 1 ? createCampaignSchemaStep1 : updateCampaignSchemaStep2),
    defaultValues: {
      id: campaign?.id || '',
      name: campaign?.name || '',
      slug: campaign?.slug || '',
      description: campaign?.description || '',
      status: campaign?.status || 'DRAFT',
      generatedTitle: campaign?.generatedTitle || '',
      generatedSubtitle: campaign?.generatedSubtitle || '',
      generatedBody: campaign?.generatedBody || '',
      chatbotInitialMessage: campaign?.chatbotInitialMessage || '',
      chatbotConversionGoal: campaign?.chatbotConversionGoal || '',
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        id: campaign.id,
        name: campaign.name,
        slug: campaign.slug,
        description: campaign.description,
        status: campaign.status,
        generatedTitle: campaign.generatedTitle,
        generatedSubtitle: campaign.generatedSubtitle,
        generatedBody: campaign.generatedBody,
        chatbotInitialMessage: campaign.chatbotInitialMessage,
        chatbotConversionGoal: campaign.chatbotConversionGoal,
      });
      setStep(2); // If editing, go straight to step 2
    } else {
      form.reset({
        name: '', slug: '', description: '', status: 'DRAFT',
        generatedTitle: '', generatedSubtitle: '', generatedBody: '',
        chatbotInitialMessage: '', chatbotConversionGoal: ''
      });
      setStep(1);
    }
  }, [campaign, isOpen, form]);

  useEffect(() => {
    if (generatedData) {
        form.setValue('generatedTitle', generatedData.generatedTitle);
        form.setValue('generatedSubtitle', generatedData.generatedSubtitle);
        form.setValue('generatedBody', generatedData.generatedBody);
        form.setValue('chatbotInitialMessage', generatedData.suggestedChatbotGreeting);
        form.setValue('chatbotConversionGoal', generatedData.suggestedConversionGoal);
        setStep(2);
    }
  }, [generatedData, form]);

  const handleSuggestIdea = () => {
    suggestIdeaMutation.mutate({ language: locale }, {
        onSuccess: (data) => {
            form.setValue('name', data.name);
            form.setValue('slug', data.slug);
            form.setValue('description', data.description);
            toast({ title: "Idea Sugerida", description: "Se ha autocompletado el formulario con una nueva idea." });
        },
        onError: (error) => toast({ title: t('error-title'), description: error.message, variant: 'destructive' }),
    });
  }

  const handleStep1Submit = async (data: any) => {
    generateContentMutation.mutate({ ...data, language: locale }, {
      onSuccess: setGeneratedData,
      onError: (error) => toast({ title: t('error-title'), description: error.message, variant: 'destructive' }),
    });
  };

  const handleStep2Submit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();
    const payload = { ...data, status: 'PUBLISHED' };
    const mutationFn = campaign ? updateMutation.mutateAsync : createAndThenUpdate;
    
    mutationFn(payload, {
        onSuccess: () => {
            toast({ title: t('success-update-title'), description: t('success-update-description') });
            onOpenChange(false);
        },
        onError: (error) => toast({ title: t('error-title'), description: error.message, variant: 'destructive' }),
    });
  };

  const handleSaveDraft = async () => {
    const data = form.getValues();
    const payload = { ...data, status: 'DRAFT' };
     const mutationFn = campaign ? updateMutation.mutateAsync : createAndThenUpdate;

    mutationFn(payload, {
      onSuccess: () => {
        toast({ title: "Draft Saved", description: "Your campaign draft has been saved." });
        onOpenChange(false);
      },
      onError: (error:any) => toast({ title: t('error-title'), description: error.message, variant: 'destructive' }),
    });
  };
  
  const createAndThenUpdate = async (updateData: any) => {
    const createData = { name: updateData.name, slug: updateData.slug, description: updateData.description };
    const newCampaign = await createMutation.mutateAsync(createData);
    return updateMutation.mutateAsync({ ...updateData, id: newCampaign.id });
  };
  
  const isProcessing = generateContentMutation.isPending || createMutation.isPending || updateMutation.isPending || suggestIdeaMutation.isPending;

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={campaign ? t('dialog-edit-title') : t('dialog-new-title')}
      description={step === 1 ? t('dialog-description-step1') : t('dialog-description-step2')}
      className="sm:max-w-3xl"
    >
      <Form {...form}>
        <form className="space-y-6 py-4">
          {step === 1 ? (
            <Step1Form 
              onNext={form.handleSubmit(handleStep1Submit)} 
              isLoading={isProcessing}
              onCancel={() => onOpenChange(false)}
              onSuggest={handleSuggestIdea}
            />
          ) : (
            <Step2Form
              onBack={() => setStep(1)}
              onPublish={handleStep2Submit}
              onSaveDraft={handleSaveDraft}
              isLoading={isProcessing}
            />
          )}
        </form>
      </Form>
    </ResponsiveDialog>
  );
}

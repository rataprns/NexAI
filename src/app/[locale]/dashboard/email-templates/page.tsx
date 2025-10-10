
"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { useScopedI18n } from "@/locales/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TextareaWithAI } from "@/components/ui/textarea-with-ai";
import { z } from "zod";
import { EmailTemplateType } from "@/modules/email-templates/domain/entities/email-template.entity";
import { useEmailTemplates, useUpdateEmailTemplate } from "./_hooks/useEmailTemplates";

const formSchema = z.object({
  templates: z.array(z.object({
    id: z.string(),
    type: z.nativeEnum(EmailTemplateType),
    subject: z.string().min(1, "Subject is required"),
    body: z.string().min(1, "Body is required"),
  }))
});

type FormValues = z.infer<typeof formSchema>;

export default function EmailTemplatesPage() {
  const { toast } = useToast();
  const t = useScopedI18n("email-templates");

  const { data: templates, isLoading } = useEmailTemplates();
  const mutation = useUpdateEmailTemplate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { templates: [] },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "templates",
  });

  useEffect(() => {
    if (templates) {
      form.reset({ templates });
    }
  }, [templates, form]);
  
  useEffect(() => {
    if (mutation.isSuccess) {
      toast({
        title: t('success-save-title'),
        description: t('success-save-description'),
      });
    }
    if (mutation.isError) {
      toast({
        title: t('error-title'),
        description: mutation.error.message || t('error-save'),
        variant: "destructive",
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error, t, toast]);


  async function onSubmit(values: FormValues, type: EmailTemplateType) {
    const templateToSave = values.templates.find(t => t.type === type);
    if(templateToSave) {
        mutation.mutate(templateToSave);
    }
  }

  const getTemplateName = (type: EmailTemplateType) => {
    switch (type) {
      case EmailTemplateType.APPOINTMENT_CONFIRMATION:
        return t('appointment-confirmation-title');
      case EmailTemplateType.APPOINTMENT_CANCELLATION:
        return t('appointment-cancellation-title');
      default:
        return 'Unknown Template';
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
      </div>
      <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('card-title')}</CardTitle>
            <CardDescription>{t('card-description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <Form {...form}>
                <form className="space-y-8">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {fields.map((field, index) => (
                      <AccordionItem key={field.id} value={field.type} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-lg font-medium hover:no-underline">
                          {getTemplateName(field.type)}
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-6">
                            <FormField
                              control={form.control}
                              name={`templates.${index}.subject`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('subject-label')}</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`templates.${index}.body`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('body-label')}</FormLabel>
                                  <FormControl>
                                    <TextareaWithAI className="min-h-[250px]" {...field} />
                                  </FormControl>
                                  <FormDescription>{t('body-description')}</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button 
                              type="button" 
                              onClick={form.handleSubmit(data => onSubmit(data, field.type))}
                              disabled={mutation.isPending && (mutation.variables as any)?.type === field.type}
                            >
                              {mutation.isPending && (mutation.variables as any)?.type === field.type ? t('save-button-loading') : t('save-button')}
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

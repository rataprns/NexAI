
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { GripVertical } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorContent, type CombinedFormData } from "./hooks/use-editor-content";
import { HeroSectionForm } from "./components/hero-section-form";
import { FeaturesSectionForm } from "./components/features-section-form";
import { TestimonialsSectionForm } from "./components/testimonials-section-form";
import { AppointmentsSectionForm } from "./components/appointments-section-form";
import { FaqSectionForm } from "./components/faq-section-form";
import { ContactSectionForm } from "./components/contact-section-form";
import { FooterSectionForm } from "./components/footer-section-form";
import { NavbarSectionForm } from "./components/navbar-section-form";
import { ServicesSectionForm } from "./components/services-section-form";
import { useScopedI18n } from "@/locales/client";

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div className={`flex items-center rounded-t-lg border ${isDragging ? 'bg-muted' : 'bg-background'}`}>
                <div {...listeners} className="p-3 cursor-grab">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                {children}
            </div>
        </div>
    );
}

export default function EditorForm() {
  const t = useScopedI18n("editor");

  const sectionConfig: Record<string, { title: string }> = {
    navbar: { title: t('section-navbar') },
    heroSection: { title: t('section-hero') },
    features: { title: t('section-features') },
    services: { title: t('section-services') },
    testimonials: { title: t('section-testimonials') },
    appointments: { title: t('section-appointments') },
    faq: { title: t('section-faq') },
    contact: { title: t('section-contact') },
    footer: { title: t('section-footer') },
  };
  
  const {
    form,
    content,
    isLoading,
    mutation,
    orderedSections,
    setOrderedSections,
  } = useEditorContent();

  const { control } = form;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrderedSections((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  async function onSubmit(values: CombinedFormData) {
    mutation.mutate({ values, orderedSections });
  }

  const renderSectionForm = (sectionId: string) => {
    switch (sectionId) {
      case 'navbar':
        return <NavbarSectionForm control={control} />;
      case 'heroSection':
        return <HeroSectionForm control={control} />;
      case 'features':
        return <FeaturesSectionForm control={control} />;
      case 'services':
        return <ServicesSectionForm control={control} />;
      case 'testimonials':
        return <TestimonialsSectionForm control={control} />;
      case 'appointments':
        return <AppointmentsSectionForm control={control} />;
      case 'faq':
        return <FaqSectionForm control={control} />;
      case 'contact':
        return <ContactSectionForm control={control} />;
      case 'footer':
        return <FooterSectionForm control={control} />;
      default:
        return null;
    }
  }

  if (isLoading) {
    return (
        <div className="space-y-8 w-full">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-32" />
        </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={"navbar"} className="border rounded-lg">
                <AccordionTrigger className="flex-1 text-lg font-medium py-3 px-4 hover:no-underline">
                  {sectionConfig['navbar']?.title || 'Unknown Section'}
                </AccordionTrigger>
                <AccordionContent>
                  {renderSectionForm('navbar')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={orderedSections} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {orderedSections.map((sectionId) => (
                    <Accordion key={sectionId} type="single" collapsible className="w-full">
                      <SortableItem id={sectionId}>
                          <AccordionItem value={sectionId} className="border-none flex-1">
                              <AccordionTrigger className="flex-1 text-lg font-medium py-3 pr-3 hover:no-underline">
                                  {sectionConfig[sectionId]?.title || 'Unknown Section'}
                              </AccordionTrigger>
                              <AccordionContent className="border border-t-0 rounded-b-lg">
                                  {renderSectionForm(sectionId)}
                              </AccordionContent>
                          </AccordionItem>
                      </SortableItem>
                    </Accordion>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={"footer"} className="border rounded-lg">
                <AccordionTrigger className="flex-1 text-lg font-medium py-3 px-4 hover:no-underline">
                  {sectionConfig['footer']?.title || 'Unknown Section'}
                </AccordionTrigger>
                <AccordionContent>
                  {renderSectionForm('footer')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t('button-saving') : t('button-save')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

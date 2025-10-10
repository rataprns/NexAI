
'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import type { FaqSection } from "@/modules/faq/domain/entities/faq.entity";
import defaultSettings from "@/lib/default-settings.json";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type FaqProps = {
  faq: FaqSection | null;
}

export function Faq({ faq }: FaqProps) {
  const faqContent = useMemo(() => {
    return faq || defaultSettings.landingPage.faq;
  }, [faq]);
  
  const {
    containerStyles,
    gridStyles,
    badge,
    title,
    subtitle,
    items,
    titleColor,
    subtitleColor,
  } = faqContent;

  const hasGridLayout = gridStyles && gridStyles.includes("grid");

  if (!hasGridLayout) {
    return (
      <section id="faq" className={cn(containerStyles)}>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-medium">{badge}</div>
              <h2
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline"
                style={{ color: titleColor || undefined }}
              >
                {title}
              </h2>
              <p
                className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                style={{ color: subtitleColor || undefined }}
              >
                  {subtitle}
              </p>
          </div>
          <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                  {items.map((faqItem, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-lg font-semibold text-left">{faqItem.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-base">
                              {faqItem.answer}
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
          </div>
        </div>
      </section>
    );
  }

  return (
     <section id="faq" className={cn(containerStyles)}>
      <div className="container px-4 md:px-6">
        <div className={cn(gridStyles)}>
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">{badge}</div>
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline"
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
          </div>
          <div className="w-full">
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

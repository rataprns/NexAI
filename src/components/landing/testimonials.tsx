
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star } from "lucide-react";
import { useMemo } from "react";
import type { TestimonialsSection } from "@/modules/testimonials/domain/entities/testimonial.entity";
import defaultSettings from "@/lib/default-settings.json";
import { cn } from "@/lib/utils";

type TestimonialsProps = {
  testimonials: TestimonialsSection | null;
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const testimonialsContent = useMemo(() => {
    return testimonials || defaultSettings.landingPage.testimonials;
  }, [testimonials]);

  const {
    containerStyles,
    gridStyles,
    badge,
    title,
    subtitle,
    items,
    titleColor,
    subtitleColor,
  } = testimonialsContent;

  const hasGridLayout = gridStyles && gridStyles.includes("grid");
  const isVerticalCarousel = gridStyles && gridStyles.includes("vertical-carousel");

  if (isVerticalCarousel) {
    return (
      <section id="testimonials" className={cn(containerStyles)}>
        <div className="container px-4 md:px-6">
            <div className={cn(gridStyles)}>
                <div className="space-y-4 pl-12">
                    <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-medium">{badge}</div>
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
                <div className="relative w-full max-w-md">
                    <Carousel
                    opts={{ align: "start", loop: true }}
                    orientation="vertical"
                    className="w-full"
                    >
                    <CarouselContent className="-mt-4 h-[550px]">
                        {items.map((testimonial, index) => (
                        <CarouselItem key={index} className="pt-4 md:basis-1/2">
                            <Card className="flex flex-col justify-between h-full shadow-sm hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 flex flex-col items-start gap-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                    <blockquote className="text-lg font-medium leading-relaxed">"{testimonial.quote}"</blockquote>
                                    <div className="flex items-center gap-4 mt-auto pt-4">
                                        <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full" />
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute -top-12 left-1/2 -translate-x-1/2 rotate-90" />
                    <CarouselNext className="absolute -bottom-12 left-1/2 -translate-x-1/2 rotate-90" />
                    </Carousel>
                </div>
            </div>
        </div>
      </section>
    )
  }

  if (!hasGridLayout) {
     return (
        <section id="testimonials" className={cn(containerStyles)}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">{badge}</div>
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
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {items.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col justify-between h-full shadow-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-start gap-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <p className="text-lg font-medium leading-relaxed">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4 mt-auto pt-4">
                                <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full" />
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      );
  }

  // Grid Layout
  return (
    <section id="testimonials" className={cn(containerStyles)}>
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
            <div className={cn(gridStyles)}>
                {items.map((testimonial, index) => (
                    <Card key={index} className="flex flex-col justify-between h-full shadow-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-start gap-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <blockquote className="text-lg font-medium leading-relaxed">"{testimonial.quote}"</blockquote>
                            <div className="flex items-center gap-4 mt-auto pt-4">
                                <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full" />
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
  );
}

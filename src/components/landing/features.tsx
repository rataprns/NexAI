
'use client';

import * as LucideIcons from "lucide-react";
import type { FeaturesSection } from "@/modules/features/domain/entities/feature.entity";
import defaultSettings from "@/lib/default-settings.json";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type FeaturesProps = {
  features: FeaturesSection | null;
}

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) {
    return <LucideIcons.HelpCircle className={className} />;
  }
  return <LucideIcon className={className} />;
};

export function Features({ features }: FeaturesProps) {
  const featuresContent = useMemo(() => {
    return features || defaultSettings.landingPage.features;
  }, [features]);

  const {
    containerStyles,
    gridStyles,
    imageUrl,
    badge,
    title,
    subtitle,
    items,
    titleColor,
    subtitleColor,
  } = featuresContent;

  const hasGridLayoutWithImage = gridStyles && gridStyles.includes("grid");

  if (!hasGridLayoutWithImage) {
    // Fallback to original centered layout if no grid is specified
    return (
      <section id="features" className={cn("w-full py-20 md:py-28 lg:py-32 bg-background", containerStyles)}>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
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
          </div>
          <div className="mx-auto grid max-w-6xl items-start gap-10 sm:grid-cols-2 md:grid-cols-3">
            {items.map((feature, index) => (
              <div key={index} className="grid gap-4 text-left p-6 rounded-lg bg-card shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                      <Icon name={feature.icon} className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // New flexible grid layout
  return (
    <section id="features" className={cn(containerStyles)}>
      <div className="container px-4 md:px-6">
        <div className={cn(gridStyles)}>
          <div className="space-y-6">
             <div className="space-y-3">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-medium">{badge}</div>
                <h2
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline"
                  style={{ color: titleColor || undefined }}
                >
                  {title}
                </h2>
                <p
                  className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  style={{ color: subtitleColor || undefined }}
                >
                  {subtitle}
                </p>
              </div>
            <div className="grid gap-6 sm:grid-cols-2">
                {items.map((feature, index) => (
                    <div key={index} className="grid gap-2">
                        <div className="flex items-center gap-3">
                             <Icon name={feature.icon} className="h-6 w-6 text-primary" />
                            <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
          </div>
          {imageUrl && hasGridLayoutWithImage && (
            <Image
              src={imageUrl}
              alt={title}
              width={600}
              height={600}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}

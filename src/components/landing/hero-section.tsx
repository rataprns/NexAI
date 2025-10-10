
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Setting } from "@/modules/settings/domain/entities/setting.entity";
import type { HeroSection as HeroSectionEntity } from "@/modules/hero/domain/entities/hero-section.entity";
import defaultSettings from "@/lib/default-settings.json";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  settings: Setting | null;
  heroSection: HeroSectionEntity | null;
}

export function HeroSection({ settings, heroSection }: HeroSectionProps) {
  const heroContent = heroSection || defaultSettings.landingPage.heroSection;

  const title = heroContent.title;
  const subtitle = heroContent.subtitle;
  const cta1Text = heroContent.ctaButton1Text;
  const cta1Href = heroContent.ctaButton1Href || "/#contact";
  const cta2Text = heroContent.ctaButton2Text;
  const cta2Href = heroContent.ctaButton2Href || "/#features";
  const imageUrl = heroContent.imageUrl;
  const containerStyles = heroContent.containerStyles;
  const gridStyles = heroContent.gridStyles;
  const titleColor = heroContent.titleColor;
  const subtitleColor = heroContent.subtitleColor;

  return (
    <section className={cn(containerStyles)}>
      {gridStyles?.includes('relative') && imageUrl && (
        <Image
          src={imageUrl}
          alt="Background"
          fill
          className="object-cover"
        />
      )}
      <div className="container px-4 md:px-6">
        <div className={cn(gridStyles)}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center items-center space-y-6"
          >
            <div className="space-y-4">
              <h1 
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl/none font-headline"
                style={{ color: titleColor || undefined }}
              >
                {title}
              </h1>
              <p 
                className="max-w-[600px] text-muted-foreground md:text-xl lg:text-lg xl:text-xl"
                style={{ color: subtitleColor || undefined }}
              >
                {subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href={cta1Href}>
                  {cta1Text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={cta2Href}>{cta2Text}</Link>
              </Button>
            </div>
          </motion.div>
          {gridStyles && !gridStyles.includes('relative') && imageUrl && (
             <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
             >
                <Image
                    src={imageUrl}
                    alt="Hero"
                    width={1400}
                    height={900}
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                />
             </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

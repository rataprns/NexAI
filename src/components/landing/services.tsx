
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Service } from "@/modules/services/domain/entities/service.entity";
import { ServicesSection as ServicesSectionEntity } from "@/modules/services-section/domain/entities/services-section.entity";
import { Tag, Info } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useScopedI18n } from "@/locales/client";
import { Location } from "@/modules/locations/domain/entities/location.entity";
import { ServiceDetail } from "./service-detail";
import { useActiveCampaigns } from "@/app/[locale]/dashboard/campaigns/_hooks/useCampaigns";
import { Badge } from "../ui/badge";

type ServicesProps = {
  services: Service[];
  servicesSection: ServicesSectionEntity | null;
  locations: Location[];
};

export function Services({ services, servicesSection, locations }: ServicesProps) {
  const t = useScopedI18n("services");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { data: activeCampaigns } = useActiveCampaigns();

  const content = useMemo(() => {
    return servicesSection || {
      badge: "Our Services",
      title: "What We Offer",
      subtitle: "Explore the range of professional services we offer to help you achieve your goals.",
      containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-muted",
      gridStyles: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
    };
  }, [servicesSection]);

  const {
    containerStyles,
    gridStyles,
    badge,
    title,
    subtitle,
    titleColor,
    subtitleColor,
  } = content;

  const getCampaignForService = (service: Service) => {
    if (!service.campaignId) return null;
    return activeCampaigns?.find(c => c.id === service.campaignId);
  }

  const calculateDiscount = (originalPrice: number, offerPrice: number) => {
      if (originalPrice <= 0 || offerPrice < 0 || offerPrice >= originalPrice) {
          return 0;
      }
      return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  }

  return (
    <>
    <section id="services" className={cn(containerStyles)}>
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
        
        {services.length > 0 ? (
            <div className={cn(gridStyles)}>
            {services.map((service) => {
                const campaign = getCampaignForService(service);
                const hasOffer = campaign && typeof service.offerPrice === 'number';
                const discountPercentage = hasOffer ? calculateDiscount(service.price, service.offerPrice!) : 0;

                return (
                    <Card 
                        key={service.id} 
                        className="flex flex-col cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                        onClick={() => setSelectedService(service)}
                    >
                    {service.imageUrl && (
                        <div className="relative">
                            <div className="relative h-40 w-full">
                                <Image src={service.imageUrl} alt={service.name} layout="fill" objectFit="cover" />
                            </div>
                            {hasOffer && discountPercentage > 0 && (
                                <Badge variant="destructive" className="absolute top-2 right-2 text-base">
                                    {discountPercentage}% OFF
                                </Badge>
                            )}
                            {hasOffer && campaign && (
                                <Badge className="absolute top-2 left-2">{campaign.name}</Badge>
                            )}
                        </div>
                    )}
                    <CardHeader>
                        {!service.imageUrl && hasOffer && (
                            <div className="flex justify-between items-start mb-2">
                                {campaign && <Badge>{campaign.name}</Badge>}
                                {discountPercentage > 0 && <Badge variant="destructive" className="text-base">{discountPercentage}% OFF</Badge>}
                            </div>
                        )}
                        <CardTitle>{service.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{service.duration} min</span>
                             <div className="flex items-baseline gap-2">
                                {hasOffer ? (
                                    <>
                                        <span className="font-bold text-lg text-primary">{service.offerPrice?.toFixed(2)} {service.currency}</span>
                                        <span className="line-through text-xs">{service.price.toFixed(2)} {service.currency}</span>
                                    </>
                                ) : (
                                    <span className="font-bold text-lg">{service.price.toFixed(2)} {service.currency}</span>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <CardDescription className="flex-1 line-clamp-3">{service.description}</CardDescription>
                        {service.customFields.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-semibold mb-2 text-sm">Details:</h4>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    {service.customFields.map(field => (
                                        <div key={field.label} className="flex items-start">
                                            <Tag className="h-3 w-3 mr-2 mt-0.5 shrink-0" />
                                            <span><strong>{field.label}:</strong> {field.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                    </Card>
                )
            })}
            </div>
        ) : (
            <Alert className="max-w-2xl mx-auto">
                <Info className="h-4 w-4" />
                <AlertTitle>Services Coming Soon</AlertTitle>
                <AlertDescription>
                    We are currently finalizing our service offerings. Please check back later for updates.
                </AlertDescription>
            </Alert>
        )}
      </div>
    </section>

    {selectedService && (
        <ServiceDetail
          isOpen={!!selectedService}
          onOpenChange={(open) => !open && setSelectedService(null)}
          service={selectedService}
          locations={locations}
        />
      )}
    </>
  );
}

"use client";

import { Service } from "@/modules/services/domain/entities/service.entity";
import { Location } from "@/modules/locations/domain/entities/location.entity";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import Image from "next/image";
import { Clock, MapPin, Tag } from "lucide-react";
import { Badge } from "../ui/badge";
import { useActiveCampaigns } from "@/app/[locale]/dashboard/campaigns/_hooks/useCampaigns";
import { useScopedI18n } from "@/locales/client";

interface ServiceDetailProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  locations: Location[];
}

export function ServiceDetail({ isOpen, onOpenChange, service, locations }: ServiceDetailProps) {
  const { data: activeCampaigns } = useActiveCampaigns();
  const t = useScopedI18n("services");
  
  const availableLocations = locations.filter(loc => service.locationIds.includes(loc.id));
  
  const campaignForService = service.campaignId ? activeCampaigns?.find(c => c.id === service.campaignId) : null;
  const hasOffer = campaignForService && typeof service.offerPrice === 'number';

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={service.name}
      description={service.description}
    >
      <div className="py-4 space-y-6">
        {service.imageUrl && (
          <div className="relative h-48 w-full rounded-lg overflow-hidden">
            <Image src={service.imageUrl} alt={service.name} layout="fill" objectFit="cover" />
             {hasOffer && campaignForService && (
                <Badge className="absolute top-2 left-2 z-10">{campaignForService.name}</Badge>
             )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">{t('detail-duration')}</p>
                    <p className="text-muted-foreground">{service.duration} {t('detail-minutes')}</p>
                </div>
            </div>
            <div className="flex items-baseline gap-2 justify-end">
                {hasOffer ? (
                    <>
                        <span className="font-bold text-2xl text-primary">{service.offerPrice?.toFixed(2)}</span>
                        <span className="line-through text-muted-foreground">{service.price.toFixed(2)}</span>
                        <span className="text-muted-foreground">{service.currency}</span>
                    </>
                ) : (
                    <>
                        <span className="font-bold text-2xl text-primary">{service.price.toFixed(2)}</span>
                         <span className="text-muted-foreground">{service.currency}</span>
                    </>
                )}
            </div>
        </div>

        {availableLocations.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> {t('detail-available-at')}</h3>
            <div className="flex flex-wrap gap-2">
              {availableLocations.map(loc => (
                <Badge key={loc.id} variant="secondary">{loc.name}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {service.customFields.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><Tag className="h-5 w-5 text-primary" /> {t('detail-additional-details')}</h3>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
              {service.customFields.map((field) => (
                <li key={field.label}>
                  <strong>{field.label}:</strong> {field.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  );
}
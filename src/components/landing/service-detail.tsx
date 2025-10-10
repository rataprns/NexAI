
"use client";

import { Service } from "@/modules/services/domain/entities/service.entity";
import { Location } from "@/modules/locations/domain/entities/location.entity";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import Image from "next/image";
import { Clock, MapPin, Tag } from "lucide-react";
import { Badge } from "../ui/badge";

interface ServiceDetailProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  locations: Location[];
}

export function ServiceDetail({ isOpen, onOpenChange, service, locations }: ServiceDetailProps) {
  
  const availableLocations = locations.filter(loc => service.locationIds.includes(loc.id));

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
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-muted-foreground">{service.duration} minutes</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-primary">{service.price.toFixed(2)}</p>
                <p className="text-muted-foreground">{service.currency}</p>
            </div>
        </div>

        {availableLocations.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Available At</h3>
            <div className="flex flex-wrap gap-2">
              {availableLocations.map(loc => (
                <Badge key={loc.id} variant="secondary">{loc.name}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {service.customFields.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><Tag className="h-5 w-5 text-primary" /> Additional Details</h3>
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

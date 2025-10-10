
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { Location } from "@/modules/locations/domain/entities/location.entity";
import { LocationList } from "./components/location-list";
import { LocationDialog } from "./components/location-dialog";
import { useScopedI18n } from "@/locales/client";
import { LocationDto } from "@/modules/locations/application/dtos/location.dto";
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from "./_hooks/useLocations";

export default function LocationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { toast } = useToast();
  const t = useScopedI18n("locations");

  const { data: locations, isLoading, isError, error } = useLocations();
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  useEffect(() => {
    if (isError) {
      toast({ title: t('error-title'), description: error?.message, variant: "destructive" });
    }
    if(createMutation.isSuccess) {
        toast({ title: t('success-create-title'), description: t('success-create-description') });
    }
    if(updateMutation.isSuccess) {
        toast({ title: t('success-update-title'), description: t('success-update-description') });
    }
    if(deleteMutation.isSuccess) {
        toast({ title: t('success-delete-title'), description: t('success-delete-description') });
    }
    if (createMutation.isError || updateMutation.isError || deleteMutation.isError) {
        const mutationError = createMutation.error || updateMutation.error || deleteMutation.error;
        toast({ title: t('error-title'), description: mutationError?.message, variant: "destructive" });
    }
  }, [isError, error, createMutation.isSuccess, updateMutation.isSuccess, deleteMutation.isSuccess, createMutation.isError, updateMutation.isError, deleteMutation.isError, toast, t]);


  const handleNewLocation = () => {
    setSelectedLocation(null);
    setIsDialogOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsDialogOpen(true);
  };

  const handleDeleteLocation = (id: string) => {
    deleteMutation.mutate(id);
  }

  const handleToggleActive = (location: Location) => {
    updateMutation.mutate({ ...location, id: location.id, isActive: !location.isActive });
  };
  
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-9 gap-1" onClick={handleNewLocation}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t('new-location-button')}
            </span>
          </Button>
        </div>
      </div>
       <div className="flex flex-1 items-start rounded-lg border border-dashed shadow-sm p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('card-title')}</CardTitle>
            <CardDescription>{t('card-description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <LocationList
                locations={locations || []}
                onEdit={handleEditLocation}
                onDelete={handleDeleteLocation}
                onToggleActive={handleToggleActive}
              />
            )}
          </CardContent>
        </Card>
      </div>

       <LocationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        location={selectedLocation}
        onSave={async (data) => {
            if (selectedLocation) {
                await updateMutation.mutateAsync({ ...data, id: selectedLocation.id });
            } else {
                await createMutation.mutateAsync(data);
            }
            setIsDialogOpen(false);
        }}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}

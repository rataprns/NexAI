
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Service } from "@/modules/services/domain/entities/service.entity";
import { PlusCircle } from "lucide-react";
import { ServiceList } from "./components/service-list";
import { ServiceDialog } from "./components/service-dialog";
import { useScopedI18n } from "@/locales/client";
import { ServiceDto, UpdateServiceDto } from "@/modules/services/application/dtos/service.dto";
import { useServices, useCreateService, useUpdateService, useDeleteService } from "./_hooks/useServices";

export default function ServicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { toast } = useToast();
  const t = useScopedI18n("services");

  const { data: services, isLoading, isError, error } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

 useEffect(() => {
    if (isError) {
        toast({ title: t('error-title'), description: error?.message, variant: "destructive" });
    }
    if (createMutation.isSuccess) {
        toast({ title: t('success-create-title'), description: t('success-create-description') });
    }
    if (updateMutation.isSuccess) {
        toast({ title: t('success-update-title'), description: t('success-update-description') });
    }
    if (deleteMutation.isSuccess) {
        toast({ title: t('success-delete-title'), description: t('success-delete-description') });
    }
    if (createMutation.isError || updateMutation.isError || deleteMutation.isError) {
        const mutationError = createMutation.error || updateMutation.error || deleteMutation.error;
        toast({ title: t('error-title'), description: mutationError?.message, variant: "destructive" });
    }
}, [isError, error, createMutation.isSuccess, updateMutation.isSuccess, deleteMutation.isSuccess, createMutation.isError, updateMutation.isError, deleteMutation.isError, toast, t]);


  const handleNewService = () => {
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (id: string) => {
    deleteMutation.mutate(id);
  }

  const handleToggleActive = (service: Service) => {
    updateMutation.mutate({ ...service, id: service.id, isActive: !service.isActive });
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-9 gap-1" onClick={handleNewService}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t('new-service-button')}
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
              <ServiceList
                services={services || []}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onToggleActive={handleToggleActive}
              />
            )}
          </CardContent>
        </Card>
      </div>

       <ServiceDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={selectedService}
        onSave={async (data) => {
            if (selectedService) {
                await updateMutation.mutateAsync({ ...data, id: selectedService.id } as UpdateServiceDto);
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

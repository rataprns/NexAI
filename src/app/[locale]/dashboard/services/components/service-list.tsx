
"use client";

import { useState } from "react";
import { useScopedI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import { Service } from "@/modules/services/domain/entities/service.entity";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleActive: (service: Service) => void;
}

export function ServiceList({ services, onEdit, onDelete, onToggleActive }: ServiceListProps) {
  const t = useScopedI18n("services");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  if (services.length === 0) {
    return <p className="text-center text-muted-foreground">{t('no-services')}</p>;
  }

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      onDelete(serviceToDelete.id);
      setDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const DialogFooter = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
        <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
            {t('delete-confirm-cancel')}
        </Button>
        <Button onClick={handleConfirmDelete} className="w-full sm:w-auto" variant="destructive">
            {t('delete-confirm-delete')}
        </Button>
    </div>
  );

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('list-header-name')}</TableHead>
              <TableHead>{t('list-header-price')}</TableHead>
              <TableHead>{t('list-header-duration')}</TableHead>
              <TableHead>{t('list-header-status')}</TableHead>
              <TableHead className="text-right">{t('list-header-actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{`${service.price.toFixed(2)} ${service.currency}`}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell>
                  <Switch
                    checked={service.isActive}
                    onCheckedChange={(checked) => onToggleActive({ ...service, isActive: checked })}
                    aria-label="Toggle service status"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(service)} title={t('edit-tooltip')}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(service)} title={t('delete-tooltip')}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       <ResponsiveDialog
            isOpen={dialogOpen}
            onOpenChange={setDialogOpen}
            title={t('delete-confirm-title')}
            description={t('delete-confirm-description')}
            footer={DialogFooter}
        >
            <div />
        </ResponsiveDialog>
    </>
  );
}

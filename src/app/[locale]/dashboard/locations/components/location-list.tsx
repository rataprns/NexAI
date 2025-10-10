
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
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import { Location } from "@/modules/locations/domain/entities/location.entity";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

interface LocationListProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  onToggleActive: (location: Location) => void;
}

export function LocationList({ locations, onEdit, onDelete, onToggleActive }: LocationListProps) {
  const t = useScopedI18n("locations");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  if (locations.length === 0) {
    return <p className="text-center text-muted-foreground">{t('no-locations')}</p>;
  }

  const handleDeleteClick = (location: Location) => {
    setLocationToDelete(location);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (locationToDelete) {
      onDelete(locationToDelete.id);
      setDialogOpen(false);
      setLocationToDelete(null);
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
              <TableHead>{t('list-header-address')}</TableHead>
              <TableHead>{t('list-header-status')}</TableHead>
              <TableHead className="text-right">{t('list-header-actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>
                  <Switch
                    checked={location.isActive}
                    onCheckedChange={() => onToggleActive(location)}
                    aria-label="Toggle location status"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(location)} title={t('edit-tooltip')}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(location)} title={t('delete-tooltip')}>
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

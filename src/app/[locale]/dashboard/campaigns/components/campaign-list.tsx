
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
import { Edit, Trash2, Eye } from "lucide-react";
import { Campaign, CampaignStatus } from "@/modules/campaigns/domain/entities/campaign.entity";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useDeleteCampaign } from "../_hooks/useCampaigns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CampaignDialog } from "./campaign-dialog";

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const t = useScopedI18n("campaigns");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const deleteMutation = useDeleteCampaign();

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setDialogOpen(true);
  };
  
  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  }

  const handleConfirmDelete = () => {
    if (campaignToDelete) {
      deleteMutation.mutate(campaignToDelete.id, {
        onSuccess: () => toast({ title: t('success-delete-title'), description: t('success-delete-description') }),
        onError: (error: any) => toast({ title: t('error-title'), description: error.message, variant: "destructive" }),
        onSettled: () => {
            setDialogOpen(false);
            setCampaignToDelete(null);
        }
      });
    }
  };

  const DialogFooter = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
        <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
            {t('delete-confirm-cancel')}
        </Button>
        <Button onClick={handleConfirmDelete} className="w-full sm:w-auto" variant="destructive" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? t('dialog-button-loading') : t('delete-confirm-delete')}
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
              <TableHead>{t('list-header-slug')}</TableHead>
              <TableHead>{t('list-header-status')}</TableHead>
              <TableHead className="text-right">{t('list-header-actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns && campaigns.length > 0 ? campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>/c/{campaign.slug}</TableCell>
                <TableCell>
                  <Badge variant={campaign.status === CampaignStatus.PUBLISHED ? 'default' : 'secondary'}>
                    {t(campaign.status === CampaignStatus.PUBLISHED ? 'status-published' : 'status-draft')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {campaign.status === CampaignStatus.PUBLISHED && (
                        <Button asChild variant="ghost" size="icon" title={t('view-tooltip')}>
                            <Link href={`/c/${campaign.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                        </Button>
                    )}
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(campaign)} title={t('edit-tooltip')}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(campaign)} title={t('delete-tooltip')}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">{t('no-campaigns')}</TableCell>
                </TableRow>
            )}
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
        
        {editingCampaign && (
            <CampaignDialog
                isOpen={!!editingCampaign}
                onOpenChange={() => setEditingCampaign(null)}
                campaign={editingCampaign}
                onCampaignCreated={() => setEditingCampaign(null)}
            />
        )}
    </>
  );
}

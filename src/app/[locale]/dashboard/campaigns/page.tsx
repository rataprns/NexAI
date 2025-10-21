
'use client';

// This is a placeholder file for the new campaigns page.
// The full implementation will be provided in subsequent steps.

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScopedI18n } from "@/locales/client";
import { useCampaigns } from "./_hooks/useCampaigns";
import { CampaignList } from "./components/campaign-list";
import { CampaignDialog } from "./components/campaign-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const t = useScopedI18n("campaigns");

    const { data: campaigns, isLoading } = useCampaigns();

    const handleNewCampaign = () => {
        setIsDialogOpen(true);
    };

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
                <div className="ml-auto">
                    <Button size="sm" onClick={handleNewCampaign}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('new-campaign-button')}
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{t('card-title')}</CardTitle>
                    <CardDescription>{t('card-description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <CampaignList campaigns={campaigns || []} />
                    )}
                </CardContent>
            </Card>
            <CampaignDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onCampaignCreated={() => setIsDialogOpen(false)}
            />
        </>
    );
}

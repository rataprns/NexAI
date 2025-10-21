
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import { useActiveCampaigns } from "@/app/[locale]/dashboard/campaigns/_hooks/useCampaigns";
import { Skeleton } from "../ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";

export function CampaignFloatingButton() {
    const { data: activeCampaigns, isLoading } = useActiveCampaigns();

    const firstCampaign = activeCampaigns?.[0];
    
    return (
        <AnimatePresence>
            {isLoading ? (
                <div className="fixed bottom-4 left-4 z-50">
                    <Skeleton className="h-14 w-14 rounded-full" />
                </div>
            ) : firstCampaign ? (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-4 left-4 z-50"
                >
                    <Button asChild size="icon" className="rounded-full w-14 h-14 shadow-lg animate-pulse" title={firstCampaign.name}>
                        <Link href={`/c/${firstCampaign.slug}`}>
                            <Megaphone className="h-7 w-7" />
                            <span className="sr-only">Active Campaign</span>
                        </Link>
                    </Button>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

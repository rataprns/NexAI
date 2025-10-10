
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar as CalendarIcon, Edit, Clock } from "lucide-react";
import { useScopedI18n } from "@/locales/client";

export default function QuickActionsPage() {
    const t = useScopedI18n("dashboard");

    return (
        <>
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{t('quick-actions-title')}</h1>
        </div>
        <div className="flex flex-1 items-start rounded-lg border border-dashed shadow-sm p-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>{t('quick-actions-title')}</CardTitle>
                    <CardDescription>{t('quick-actions-subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                   <Button asChild className="w-full justify-start" variant="outline">
                        <Link href="/dashboard/appointments">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {t('book-appointment-button')}
                        </Link>
                   </Button>
                   <Link href="/dashboard/editor">
                    <Button className="w-full justify-start" variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        {t('edit-landing-button')}
                    </Button>
                   </Link>
                   <Link href="/dashboard/availability">
                    <Button className="w-full justify-start" variant="outline">
                        <Clock className="mr-2 h-4 w-4" />
                        {t('manage-availability-button')}
                    </Button>
                   </Link>
                </CardContent>
            </Card>
        </div>
        </>
    );
}

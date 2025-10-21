
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useScopedI18n } from "@/locales/client";
import { useConversionRateAnalytics } from "../_hooks/useAnalytics";

export function ConversionRateTab() {
    const t = useScopedI18n("analytics.conversion");
    const { data, isLoading, isError } = useConversionRateAnalytics();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-12 w-1/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
    
    if (isError) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('error-title')}</CardTitle>
                    <CardDescription>{t('error-description')}</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>{t('total-conversations-title')}</CardTitle>
                    <CardDescription>{t('total-conversations-desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{data?.totalConversations || 0}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t('converted-sessions-title')}</CardTitle>
                    <CardDescription>{t('converted-sessions-desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-4xl font-bold">{data?.convertedSessions || 0}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t('conversion-rate-title')}</CardTitle>
                    <CardDescription>{t('conversion-rate-desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{data?.conversionRate.toFixed(2) || '0.00'}%</p>
                </CardContent>
            </Card>
        </div>
    );
}

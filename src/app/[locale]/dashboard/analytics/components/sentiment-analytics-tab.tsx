
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useScopedI18n } from "@/locales/client";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useSentimentAnalytics } from "../_hooks/useAnalytics";

export function SentimentAnalyticsTab() {
    const t = useScopedI18n("analytics.sentiments");
    const { data, isLoading, isError } = useSentimentAnalytics();

    if (isLoading) {
        return (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[200px] w-full" />
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

    const sentimentChartConfig = { count: { label: t('chart-label-sentiment') } };
    const urgencyChartConfig = { count: { label: t('chart-label-urgency') } };
    const interactionTypeChartConfig = { count: { label: t('chart-label-interaction') } };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>{t('sentiment-title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={sentimentChartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={data?.sentimentData}>
                            <XAxis dataKey="sentiment" tickLine={false} axisLine={false} tickFormatter={(value) => t(value as any)} />
                            <YAxis />
                            <Tooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t('urgency-title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={urgencyChartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={data?.urgencyData}>
                            <XAxis dataKey="urgency" tickLine={false} axisLine={false} tickFormatter={(value) => t(value as any)} />
                            <YAxis />
                            <Tooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t('interaction-title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={interactionTypeChartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={data?.interactionTypeData}>
                            <XAxis dataKey="interactionType" tickLine={false} axisLine={false} tickFormatter={(value) => t(value as any)} />
                            <YAxis />
                            <Tooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

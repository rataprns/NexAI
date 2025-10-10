
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useScopedI18n } from "@/locales/client";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useIntentAnalytics } from "../_hooks/useAnalytics";

export function IntentAnalyticsTab() {
    const t = useScopedI18n("analytics.intents");
    const { data, isLoading, isError } = useIntentAnalytics();

    const chartConfig = {
      count: {
        label: t('chart-label'),
      },
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
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
        <Card>
            <CardHeader>
                <CardTitle>{t('card-title')}</CardTitle>
                <CardDescription>{t('card-description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart accessibilityLayer data={data}>
                        <XAxis
                            dataKey="intent"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => t(value as any)}
                        />
                        <YAxis />
                        <Tooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-primary)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

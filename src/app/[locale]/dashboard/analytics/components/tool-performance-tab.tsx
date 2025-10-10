
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useScopedI18n } from "@/locales/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToolPerformanceAnalytics } from "../_hooks/useAnalytics";

export function ToolPerformanceTab() {
    const t = useScopedI18n("analytics.tool-performance");
    const { data, isLoading, isError } = useToolPerformanceAnalytics();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
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
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('tool-name-header')}</TableHead>
                                <TableHead>{t('total-calls-header')}</TableHead>
                                <TableHead>{t('successful-calls-header')}</TableHead>
                                <TableHead>{t('failed-calls-header')}</TableHead>
                                <TableHead>{t('success-rate-header')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ? data.map((tool: any) => (
                                <TableRow key={tool._id}>
                                    <TableCell className="font-medium">{tool._id}</TableCell>
                                    <TableCell>{tool.totalCalls}</TableCell>
                                    <TableCell>{tool.successfulCalls}</TableCell>
                                    <TableCell>{tool.failedCalls}</TableCell>
                                    <TableCell>
                                         <Badge variant={tool.successRate < 75 ? "destructive" : "default"}>
                                            {tool.successRate.toFixed(2)}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">{t('no-data')}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

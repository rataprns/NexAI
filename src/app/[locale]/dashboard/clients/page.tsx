
"use client";

import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { format } from "date-fns";
import { es, enUS } from 'date-fns/locale';
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, CalendarDays } from "lucide-react";
import { useClients } from "./_hooks/useClients";
import { useEffect } from "react";

export default function ClientsPage() {
    const { toast } = useToast();
    const t = useScopedI18n("clients");
    const tDashboard = useScopedI18n("dashboard");
    const currentLocale = useCurrentLocale();
    const dateFnsLocale = currentLocale === 'es' ? es : enUS;
    const isMobile = useIsMobile();

    const { data: clients, isLoading, isError, error } = useClients();

    useEffect(() => {
        if (isError) {
            toast({
                title: t('error-title'),
                description: error?.message || t('error-fetch'),
                variant: "destructive",
            });
        }
    }, [isError, error, toast, t]);


    const renderMobileView = () => (
        <Accordion type="multiple" className="w-full space-y-2">
            {clients && clients.length > 0 ? (
                clients.map(client => (
                    <AccordionItem key={client.id} value={client.id} className="border rounded-lg px-4 bg-muted/20">
                        <AccordionTrigger className="hover:no-underline font-semibold">
                            {client.name}
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 pt-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>{t('table-header-since')}: {format(new Date(client.createdAt), 'PPP', { locale: dateFnsLocale })}</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))
            ) : (
                <p className="text-center text-muted-foreground py-4">{t('no-clients')}</p>
            )}
        </Accordion>
    );

    const renderDesktopView = () => (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('table-header-name')}</TableHead>
                        <TableHead>{t('table-header-email')}</TableHead>
                        <TableHead>{t('table-header-since')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients && clients.length > 0 ? (
                        clients.map(client => (
                            <TableRow key={client.id}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{format(new Date(client.createdAt), 'PPP', { locale: dateFnsLocale })}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">{t('no-clients')}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">{tDashboard('clients')}</h1>
            </div>
            <div className="flex flex-1 items-start rounded-lg border border-dashed shadow-sm p-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>{t('title')}</CardTitle>
                        <CardDescription>{t('description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : isMobile ? renderMobileView() : renderDesktopView()}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

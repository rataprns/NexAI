
"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { format } from "date-fns";
import { es, enUS } from 'date-fns/locale';
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, CalendarDays, History, User, Smartphone, Globe, MessageSquare } from "lucide-react";
import { useClients, useClientHistory } from "./_hooks/useClients";
import { Client } from "@/modules/clients/domain/entities/client.entity";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBubble } from "@/components/chat-bubble";
import { Badge } from "@/components/ui/badge";
import { ClientType } from "@/modules/clients/domain/entities/client-type.enum";

const ConversationHistoryDialog = ({ client, isOpen, onOpenChange }: { client: Client | null, isOpen: boolean, onOpenChange: (open: boolean) => void }) => {
    const t = useScopedI18n("clients");
    
    // Hooks are called unconditionally at the top level
    const { data: history, isLoading, isError } = useClientHistory(client?.id || '', isOpen && !!client);

    // Conditional rendering happens after hooks
    if (!client) return null;

    return (
        <ResponsiveDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={`${t('history-dialog-title')} ${client.name}`}
            description={t('history-dialog-desc')}
        >
            <ScrollArea className="h-[60vh] mt-4 pr-6">
                <div className="space-y-4">
                    {isLoading && <Skeleton className="h-24 w-full" />}
                    {isError && <p className="text-destructive text-center">{t('history-error')}</p>}
                    {history && history.length > 0 ? (
                        history.map((message, index) => (
                            <ChatBubble key={index} message={message} />
                        ))
                    ) : (
                        !isLoading && <p className="text-center text-muted-foreground">{t('history-no-data')}</p>
                    )}
                </div>
            </ScrollArea>
        </ResponsiveDialog>
    )
}

const ChannelIcon = ({ channel }: { channel?: string }) => {
    switch (channel) {
        case 'whatsapp':
            return <Smartphone className="h-4 w-4 text-green-500" />;
        case 'messenger':
            return <MessageSquare className="h-4 w-4 text-blue-600" />;
        case 'instagram':
            return <MessageSquare className="h-4 w-4 text-purple-500" />;
        case 'web':
        default:
            return <Globe className="h-4 w-4 text-muted-foreground" />;
    }
}


export default function ClientsPage() {
    const { toast } = useToast();
    const t = useScopedI18n("clients");
    const tDashboard = useScopedI18n("dashboard");
    const currentLocale = useCurrentLocale();
    const dateFnsLocale = currentLocale === 'es' ? es : enUS;
    const isMobile = useIsMobile();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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

    const handleViewHistory = (client: Client) => {
        setSelectedClient(client);
    };

    const getTypeVariant = (type: ClientType) => {
        switch (type) {
            case ClientType.CLIENT: return "default";
            case ClientType.LEAD: return "secondary";
            default: return "outline";
        }
    }

    const renderMobileView = () => (
        <Accordion type="multiple" className="w-full space-y-2">
            {clients && clients.length > 0 ? (
                clients.map(client => (
                    <AccordionItem key={client.id} value={client.id} className="border rounded-lg px-4 bg-muted/20">
                        <AccordionTrigger className="hover:no-underline font-semibold">
                            <div className="flex flex-col items-start gap-1 text-left">
                                <span className="truncate max-w-[200px]">{client.name}</span>
                                <Badge variant={getTypeVariant(client.type)}>{t(client.type)}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-3 pt-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.email || t('no-email')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>{t('table-header-since')}: {format(new Date(client.createdAt), 'PPP', { locale: dateFnsLocale })}</span>
                                </div>
                                 <div className="flex items-center gap-2 text-muted-foreground">
                                    <ChannelIcon channel={client.channel} />
                                    <span>{client.channel || 'N/A'}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleViewHistory(client)}>
                                    <History className="mr-2 h-4 w-4" />
                                    {t('history-button')}
                                </Button>
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
                        <TableHead>{t('table-header-channel')}</TableHead>
                        <TableHead>{t('table-header-type')}</TableHead>
                        <TableHead>{t('table-header-since')}</TableHead>
                        <TableHead className="text-right">{t('table-header-actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients && clients.length > 0 ? (
                        clients.map(client => (
                            <TableRow key={client.id}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.email || <span className="text-muted-foreground italic">{t('no-email')}</span>}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <ChannelIcon channel={client.channel} />
                                        <span>{client.channel || 'N/A'}</span>
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant={getTypeVariant(client.type)}>{t(client.type)}</Badge></TableCell>
                                <TableCell>{format(new Date(client.createdAt), 'PPP', { locale: dateFnsLocale })}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleViewHistory(client)}>
                                        <History className="mr-2 h-4 w-4" />
                                        {t('history-button')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">{t('no-clients')}</TableCell>
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
            
            <ConversationHistoryDialog
                client={selectedClient}
                isOpen={!!selectedClient}
                onOpenChange={(open) => {
                    if (!open) setSelectedClient(null);
                }}
            />
        </>
    )
}


"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useScopedI18n, useCurrentLocale } from "@/locales/client";
import { Activity, ArrowUpRight, Calendar as CalendarIcon, Users, Edit, Clock, Target, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, toZonedTime } from "date-fns-tz";
import { AppointmentStatus, CampaignStatus } from "@/lib/types";
import { es, enUS } from "date-fns/locale";
import { useDashboard } from "./_hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
    const t = useScopedI18n("dashboard");
    const locale = useCurrentLocale();
    const dateFnsLocale = locale === 'es' ? es : enUS;

    const { 
        session,
        clients, 
        appointments, 
        settings,
        campaigns,
        isLoadingSession,
        isLoadingClients,
        isLoadingAppointments,
        isLoadingSettings,
        isLoadingCampaigns
    } = useDashboard();
    
    const isLoading = isLoadingSession || isLoadingClients || isLoadingAppointments || isLoadingSettings || isLoadingCampaigns;

    const timeZone = settings?.timezone || 'America/Santiago';

    const totalClients = clients?.length ?? 0;
    const totalAppointments = appointments?.length ?? 0;
    const upcomingAppointments = appointments?.filter(a => new Date(a.date) >= new Date() && a.status === AppointmentStatus.Scheduled).length ?? 0;
    const recentAppointments = appointments?.filter(a => a.status === AppointmentStatus.Scheduled).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5) ?? [];
    
    const publishedCampaigns = campaigns?.filter(c => c.status === CampaignStatus.PUBLISHED) ?? [];

    if (isLoading) {
      return (
        <>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl"><Skeleton className="h-8 w-64" /></h1>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                  <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader><Skeleton className="h-8 w-full" /></CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )
    }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('welcome', { email: session?.email })}</h1>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('total-clients')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">{t('total-clients-subtitle')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('total-appointments')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
               <p className="text-xs text-muted-foreground">{t('total-appointments-subtitle')}</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('upcoming-appointments')}</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">{t('upcoming-appointments-subtitle')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>{t('recent-appointments-title')}</CardTitle>
                        <CardDescription>{t('recent-appointments-subtitle')}</CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/dashboard/appointments">
                        {t('view-all-button')}
                        <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('table-header-client')}</TableHead>
                                <TableHead className="text-right">{t('table-header-date')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentAppointments.length > 0 ? (
                                recentAppointments.map(app => {
                                    const zonedDate = toZonedTime(new Date(app.date), timeZone);
                                    return (
                                        <TableRow key={app.id}>
                                            <TableCell>
                                                <div className="font-medium">{app.name}</div>
                                                <div className="text-sm text-muted-foreground">{app.email}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{format(zonedDate, 'PPP p', { timeZone, locale: dateFnsLocale })}</TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">{t('no-recent-appointments')}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>{t('active-campaigns-title')}</CardTitle>
                        <CardDescription>{t('active-campaigns-subtitle', {count: publishedCampaigns.length})}</CardDescription>
                    </div>
                     <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/dashboard/campaigns">
                        {t('manage-all-button')}
                        <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('table-header-campaign')}</TableHead>
                                <TableHead className="text-right">{t('table-header-actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                         <TableBody>
                             {publishedCampaigns.length > 0 ? (
                                publishedCampaigns.slice(0, 5).map(campaign => (
                                    <TableRow key={campaign.id}>
                                        <TableCell>
                                            <div className="font-medium">{campaign.name}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/c/${campaign.slug}`} target="_blank" title="View Live">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">{t('no-active-campaigns')}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  )
}


"use client";

import { useQuery } from "@tanstack/react-query";
import type { Appointment } from "@/modules/scheduling/domain/entities/appointment.entity";
import type { Client } from "@/modules/clients/domain/entities/client.entity";
import type { UpdateSettingDto } from "@/modules/settings/application/dtos/setting.dto";
import { Campaign } from "@/modules/campaigns/domain/entities/campaign.entity";

const fetchDashboardData = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch from ${url}`);
    }
    return res.json();
}

const fetchSession = async () => {
    const res = await fetch("/api/users/me");
    if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch session");
    }
    return res.json();
}

export function useDashboard() {
    const { data: session, isLoading: isLoadingSession } = useQuery({
        queryKey: ['session'],
        queryFn: fetchSession
    });
    
    const { data: clients, isLoading: isLoadingClients } = useQuery<Client[]>({
        queryKey: ['clients'],
        queryFn: () => fetchDashboardData<Client[]>('/api/clients'),
        enabled: !!session,
    });

    const { data: appointments, isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
        queryKey: ['appointments'],
        queryFn: () => fetchDashboardData<Appointment[]>('/api/scheduling'),
        enabled: !!session,
    });

    const { data: settings, isLoading: isLoadingSettings } = useQuery<UpdateSettingDto>({
        queryKey: ['settings'],
        queryFn: () => fetchDashboardData<UpdateSettingDto>('/api/settings'),
        enabled: !!session,
    });
    
    const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery<Campaign[]>({
        queryKey: ['campaigns'],
        queryFn: () => fetchDashboardData<Campaign[]>('/api/campaigns'),
        enabled: !!session,
    });


    return {
        session,
        clients,
        appointments,
        settings,
        campaigns,
        isLoadingSession,
        isLoadingClients,
        isLoadingAppointments,
        isLoadingSettings,
        isLoadingCampaigns,
    };
}

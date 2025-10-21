
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Campaign } from "@/modules/campaigns/domain/entities/campaign.entity";
import type { CreateCampaignDto, GenerateCampaignContentDto, UpdateCampaignDto } from "@/modules/campaigns/application/dtos/campaign.dto";

const fetchCampaigns = async (activeOnly = false): Promise<Campaign[]> => {
  const url = activeOnly ? "/api/campaigns?active=true" : "/api/campaigns";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not load campaigns.");
  return res.json();
};

const createCampaign = async (data: CreateCampaignDto): Promise<Campaign> => {
  const res = await fetch("/api/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create campaign');
  }
  return res.json();
};

const generateContent = async (data: GenerateCampaignContentDto & { language: string }): Promise<any> => {
    const res = await fetch("/api/campaigns/generate?type=content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to generate content');
    }
    return res.json();
}

const suggestIdea = async (data: { language: string }): Promise<any> => {
    const res = await fetch("/api/campaigns/generate?type=idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to suggest idea');
    }
    return res.json();
}

const updateCampaign = async (data: UpdateCampaignDto): Promise<Campaign> => {
    const res = await fetch("/api/campaigns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update campaign');
    }
    return res.json();
};

const deleteCampaign = async (id: string): Promise<void> => {
    const res = await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete campaign');
    }
}

export function useCampaigns() {
    return useQuery({
        queryKey: ['campaigns'],
        queryFn: () => fetchCampaigns(false)
    });
}

export function useActiveCampaigns() {
    return useQuery({
        queryKey: ['activeCampaigns'],
        queryFn: () => fetchCampaigns(true),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useCreateCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCampaign,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        },
    });
}

export function useGenerateCampaignContent() {
    return useMutation({
        mutationFn: generateContent,
    });
}

export function useSuggestCampaignIdea() {
    return useMutation({
        mutationFn: suggestIdea,
    });
}

export function useUpdateCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCampaign,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['activeCampaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign', data.slug] });
        },
    });
}

export function useDeleteCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCampaign,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['activeCampaigns'] });
        },
    });
}

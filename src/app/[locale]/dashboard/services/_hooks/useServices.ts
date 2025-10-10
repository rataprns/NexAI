
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Service } from "@/modules/services/domain/entities/service.entity";
import { ServiceDto, UpdateServiceDto } from "@/modules/services/application/dtos/service.dto";
import { Location } from "@/modules/locations/domain/entities/location.entity";

const fetchServices = async (): Promise<Service[]> => {
  const res = await fetch("/api/services");
  if (!res.ok) throw new Error("Could not load services.");
  return res.json();
};

const createService = async (service: ServiceDto): Promise<Service> => {
  const res = await fetch("/api/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create service');
  }
  return res.json();
};

const updateService = async (service: UpdateServiceDto): Promise<Service> => {
    const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update service');
    }
    return res.json();
};

const deleteService = async (id: string): Promise<void> => {
  const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete service');
  }
};

const fetchLocations = async (): Promise<Location[]> => {
  const res = await fetch("/api/locations");
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export function useServices() {
    return useQuery<Service[], Error>({
        queryKey: ['services'],
        queryFn: fetchServices
    });
}

export function useCreateService() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
}

export function useUpdateService() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
}

export function useDeleteService() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
}

export function useLocationsForServices() {
    return useQuery<Location[], Error>({
        queryKey: ['locations'],
        queryFn: fetchLocations,
    });
}

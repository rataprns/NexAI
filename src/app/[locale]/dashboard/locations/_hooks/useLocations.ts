
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Location } from "@/modules/locations/domain/entities/location.entity";
import { LocationDto, UpdateLocationDto } from "@/modules/locations/application/dtos/location.dto";
import { Service } from "@/modules/services/domain/entities/service.entity";

const fetchLocations = async (): Promise<Location[]> => {
  const res = await fetch("/api/locations");
  if (!res.ok) throw new Error("Could not load locations.");
  return res.json();
};

const createLocation = async (location: LocationDto): Promise<Location> => {
  const res = await fetch("/api/locations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  });
  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create location');
  }
  return res.json();
};

const updateLocation = async (location: UpdateLocationDto): Promise<Location> => {
    const res = await fetch("/api/locations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update location');
    }
    return res.json();
};

const deleteLocation = async (id: string): Promise<void> => {
  const res = await fetch(`/api/locations?id=${id}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete location');
  }
};

const fetchServices = async (): Promise<Service[]> => {
  const res = await fetch("/api/services");
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
};

export function useLocations() {
    return useQuery<Location[], Error>({
        queryKey: ['locations'],
        queryFn: fetchLocations
    });
}

export function useCreateLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}

export function useUpdateLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}

export function useDeleteLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}

export function useServicesForLocations() {
    return useQuery<Service[], Error>({
        queryKey: ['services'],
        queryFn: fetchServices
    });
}

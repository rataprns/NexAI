
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@/modules/scheduling/domain/entities/appointment.entity";
import { format } from "date-fns";
import { Location } from "@/modules/locations/domain/entities/location.entity";
import { Service } from "@/modules/services/domain/entities/service.entity";
import { Client } from "@/modules/clients/domain/entities/client.entity";

const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch("/api/scheduling");
  if (!res.ok) throw new Error("Could not load appointments.");
  return res.json();
};

const cancelAppointment = async (appointmentId: string): Promise<void> => {
  const res = await fetch(`/api/scheduling?id=${appointmentId}`, { method: "DELETE" });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to cancel appointment');
  }
};

const rebookAppointment = async (appointmentId: string): Promise<Appointment> => {
  const res = await fetch(`/api/scheduling?id=${appointmentId}`, { method: "PUT" });
   if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to rebook appointment');
  }
  return res.json();
};

const fetchAvailability = async (date: Date, locationId: string): Promise<string[]> => {
    if (!date || !locationId) return [];
    const dateString = format(date, "yyyy-MM-dd");
    const res = await fetch(`/api/scheduling/availability?date=${dateString}&locationId=${locationId}`);
    if (!res.ok) throw new Error("Failed to fetch availability");
    return res.json();
};

const fetchLocations = async (): Promise<Location[]> => {
  const res = await fetch('/api/locations');
  if (!res.ok) throw new Error('Could not load locations');
  return res.json();
}

const fetchServices = async (): Promise<Service[]> => {
  const res = await fetch('/api/services');
  if (!res.ok) throw new Error('Could not load services');
  return res.json();
}

const fetchClients = async (): Promise<Client[]> => {
  const res = await fetch('/api/clients');
  if (!res.ok) throw new Error('Could not load clients');
  return res.json();
}


export function useAppointments() {
    return useQuery<Appointment[], Error>({
        queryKey: ['appointments'],
        queryFn: fetchAppointments
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }
    });
}

export function useRebookAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rebookAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }
    });
}

export function useAvailability(date: Date | undefined, locationId: string | null) {
    return useQuery({
        queryKey: ['availability', locationId, date ? format(date, "yyyy-MM-dd") : ''],
        queryFn: () => fetchAvailability(date!, locationId!),
        enabled: !!date && !!locationId,
    });
}

export function useLocationsForAppointments() {
    return useQuery<Location[]>({
        queryKey: ['locations'],
        queryFn: fetchLocations,
    });
}

export function useServicesForAppointments() {
    return useQuery<Service[]>({
        queryKey: ['services'],
        queryFn: fetchServices,
    });
}

export function useClientsForAppointments() {
    return useQuery<Client[]>({
        queryKey: ['clients'],
        queryFn: fetchClients,
    });
}

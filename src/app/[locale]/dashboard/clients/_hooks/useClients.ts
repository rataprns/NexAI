
"use client";

import { useQuery } from "@tanstack/react-query";
import { Client } from "@/modules/clients/domain/entities/client.entity";

const fetchClients = async (): Promise<Client[]> => {
    const res = await fetch('/api/clients');
    if (!res.ok) {
        throw new Error("Failed to fetch clients");
    }
    return res.json();
}

export function useClients() {
    return useQuery<Client[], Error>({
        queryKey: ['clients'],
        queryFn: fetchClients
    });
}

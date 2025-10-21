
"use client";

import { useQuery } from "@tanstack/react-query";
import { Client } from "@/modules/clients/domain/entities/client.entity";
import { ChatMessage } from "@/modules/chatbot/domain/entities/conversation-history.entity";

const fetchClients = async (): Promise<Client[]> => {
    const res = await fetch('/api/clients');
    if (!res.ok) {
        throw new Error("Failed to fetch clients");
    }
    return res.json();
}

const fetchHistory = async (clientId: string): Promise<ChatMessage[]> => {
    const res = await fetch(`/api/chatbot/history?clientId=${clientId}`);
    if (!res.ok) {
        throw new Error("Failed to fetch conversation history");
    }
    return res.json();
}


export function useClients() {
    return useQuery<Client[], Error>({
        queryKey: ['clients'],
        queryFn: fetchClients
    });
}

export function useClientHistory(clientId: string, enabled: boolean) {
    return useQuery<ChatMessage[], Error>({
        queryKey: ['clientHistory', clientId],
        queryFn: () => fetchHistory(clientId),
        enabled: enabled,
    });
}

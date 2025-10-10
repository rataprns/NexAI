
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateSettingDto } from "@/modules/settings/application/dtos/setting.dto";

const fetchSettings = async (): Promise<UpdateSettingDto> => {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
};

const updateSettings = async (data: UpdateSettingDto) => {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save AI settings");
  return res.json();
};

export function useAiSettings() {
    return useQuery<UpdateSettingDto>({
        queryKey: ['settings'],
        queryFn: fetchSettings
    });
}

export function useUpdateAiSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSettings,
        onSuccess: (newSettings) => {
            queryClient.setQueryData(['settings'], newSettings);
        }
    });
}

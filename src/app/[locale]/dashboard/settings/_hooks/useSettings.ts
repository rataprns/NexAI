
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
  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to save settings");
  }
  return res.json();
};

export function useSettingsQuery() {
    return useQuery<UpdateSettingDto, Error>({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useUpdateSettingsMutation() {
    const queryClient = useQueryClient();
    return useMutation<UpdateSettingDto, Error, UpdateSettingDto>({
        mutationFn: updateSettings,
        onSuccess: (newSettings) => {
            queryClient.setQueryData(['settings'], newSettings);
            // Optionally invalidate other queries that depend on settings
        },
    });
}

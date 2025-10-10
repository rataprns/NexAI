
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserDto } from "@/modules/users/application/dtos/user.dto";

const fetchUser = async () => {
  const res = await fetch("/api/users/me");
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
};

const updateUser = async (data: Partial<UpdateUserDto>) => {
  const res = await fetch("/api/users/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update account");
  }
  return res.json();
};

export function useUserAccount() {
    return useQuery({
        queryKey: ['user', 'me'],
        queryFn: fetchUser,
    });
}

export function useUpdateUserAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['user', 'me'], updatedUser);
        }
    });
}

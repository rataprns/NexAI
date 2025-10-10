"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useScopedI18n } from "@/locales/client";
import type { LoginDto } from "@/modules/users/application/dtos/user.dto";

const loginUser = async (values: LoginDto) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'An unexpected error occurred.');
  }
  return response.json();
};

export function useLoginMutation() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useScopedI18n("login");

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh(); // Ensures server-side state is re-fetched
    },
    onError: (error) => {
      toast({
        title: t('login-failed-title'),
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

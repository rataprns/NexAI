
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailTemplate } from "@/modules/email-templates/domain/entities/email-template.entity";

const fetchEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const res = await fetch("/api/email-templates");
  if (!res.ok) throw new Error("Failed to fetch email templates");
  return res.json();
};

const updateEmailTemplate = async (data: any) => {
  const res = await fetch("/api/email-templates", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save email template");
  return res.json();
};

export function useEmailTemplates() {
    return useQuery({
        queryKey: ['emailTemplates'],
        queryFn: fetchEmailTemplates,
    });
}

export function useUpdateEmailTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateEmailTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
        },
    });
}

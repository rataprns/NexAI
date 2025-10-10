
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, ContactFormDto } from "@/modules/contact/application/dtos/contact.dto";
import { useMutation } from "@tanstack/react-query";

const sendContactMessage = async (values: ContactFormDto) => {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return response.json();
}

export function PublicContactForm() {
  const { toast } = useToast();

  const form = useForm<ContactFormDto>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      toast({
        title: 'Message Sent!',
        description: "We've received your message and will get back to you shortly.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: "destructive",
      });
    }
  });

  async function onSubmit(values: ContactFormDto) {
    mutation.mutate(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input {...form.register("name")} type="text" placeholder='Name' className="h-12" />
        <Input {...form.register("email")} type="email" placeholder='Email' className="h-12" />
      </div>
      <Textarea {...form.register("message")} placeholder='Your Message' className="min-h-[150px]" />
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={mutation.isPending}>
        {mutation.isPending ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}

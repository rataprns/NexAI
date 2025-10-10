
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateUserDto, updateUserSchema } from "@/modules/users/application/dtos/user.dto";
import { useScopedI18n } from "@/locales/client";
import { Eye, EyeOff } from "lucide-react";
import { useUserAccount, useUpdateUserAccount } from "./_hooks/useAccount";

export default function AccountPage() {
  const { toast } = useToast();
  const t = useScopedI18n("account");
  const [showPassword, setShowPassword] = useState(false);

  const { data: user, isLoading, isError, error } = useUserAccount();
  const mutation = useUpdateUserAccount();

  const form = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  }, [user, form]);
  
  useEffect(() => {
    if (isError) {
      toast({
        title: t('error-update-title'),
        description: error.message || t('error-load'),
        variant: "destructive",
      });
    }
  }, [isError, error, toast, t]);

  useEffect(() => {
    if (mutation.isSuccess) {
       toast({
        title: t('success-update-title'),
        description: t('success-update-description'),
      });
      const updatedUser = mutation.data;
       form.reset({
        name: updatedUser.name,
        email: updatedUser.email,
        password: "",
      });
    }
    if (mutation.isError) {
       toast({
        title: t('error-update-title'),
        description: mutation.error.message || t('error-unexpected'),
        variant: "destructive",
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.data, mutation.error, form, toast, t]);


  async function onSubmit(values: UpdateUserDto) {
    const payload: Partial<UpdateUserDto> = {
      name: values.name,
      email: values.email,
    };
    if (values.password) {
      payload.password = values.password;
    }
    mutation.mutate(payload);
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
      </div>
      <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{t('card-title')}</CardTitle>
            <CardDescription>
              {t('card-description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-24 mt-4" />
                </div>
            ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name-label')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email-label')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password-label')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t('password-description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? t('submit-button-loading') : t('submit-button')}
                </Button>
              </form>
            </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

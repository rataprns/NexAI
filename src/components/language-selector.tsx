"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLocale(lang.code as "en" | "es")}
            className="justify-between"
          >
            {lang.name}
            {locale === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

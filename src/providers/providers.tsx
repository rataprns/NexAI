
"use client";

import { QueryProvider } from './query-provider';
import { I18nProviderClient } from '@/locales/client';
import type { ReactNode } from 'react';

export function Providers({
  children,
  locale
}: {
  children: ReactNode;
  locale: string;
}) {
  return (
    <I18nProviderClient locale={locale}>
      <QueryProvider>
        {children}
      </QueryProvider>
    </I18nProviderClient>
  );
}

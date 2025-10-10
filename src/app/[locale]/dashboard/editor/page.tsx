
'use client'

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { useScopedI18n } from '@/locales/client';

const EditorForm = dynamic(() => import('./editor-form'), {
  ssr: false,
  loading: () => (
    <div className="space-y-8 w-full">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-10 w-32" />
    </div>
  ),
});


export default function EditorPage() {
  const t = useScopedI18n("editor");

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
      </div>
      <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4">
        <EditorForm />
      </div>
    </>
  );
}


"use client";

import React, { useState } from 'react';
import { Mountain, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { UserNav } from './components/user-nav';
import { MainNav } from './components/main-nav';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';
import { useSettingsQuery } from './settings/_hooks/useSettings';

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) {
    return <Mountain className={className} />;
  }
  return <LucideIcon className={className} />;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { data: settings } = useSettingsQuery();

    const appName = settings?.appName || 'NexAI';
    const { isIconLogo, logoIconName, logoUrl } = settings || {};

    const LogoComponent = () => (
        <>
        {isIconLogo && logoIconName ? (
            <DynamicIcon name={logoIconName} className="h-6 w-6" />
        ) : logoUrl ? (
            <Image src={logoUrl} alt={appName} width={24} height={24} className="h-6 w-6 object-contain" />
        ) : (
            <Mountain className="h-6 w-6" />
        )}
        </>
    );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <LogoComponent />
              <span className="">{appName}</span>
            </Link>
          </div>
          <div className="flex-1">
            <MainNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <LogoComponent />
                  <span>{appName}</span>
                </Link>
                <MainNav isMobile onLinkClick={() => setIsSheetOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

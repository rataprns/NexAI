
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Mountain } from 'lucide-react';
import { getI18n, getScopedI18n } from '@/locales/server';
import { LanguageSelector } from '../language-selector';
import { resolve } from '@/services/bootstrap';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { INavbarSectionService } from '@/modules/navbar-section/domain/services/navbar-section.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import defaultSettings from '@/lib/default-settings.json';
import { cn } from '@/lib/utils';
import type { NavbarLink } from '@/modules/navbar-section/domain/entities/navbar-section.entity';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';
import { getSession } from '@/lib/auth';

const settingService = resolve<ISettingService>(SERVICE_KEYS.SettingService);
const navbarService = resolve<INavbarSectionService>(SERVICE_KEYS.NavbarSectionService);

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) {
    return <Mountain className={className} />;
  }
  return <LucideIcon className={className} />;
};

export async function Header() {
  const t = await getI18n();
  const settings = await settingService.getSettings();
  const navbarContentData = await navbarService.getNavbarSection();
  const session = await getSession();

  const navbarContent = navbarContentData ? JSON.parse(JSON.stringify(navbarContentData)) : defaultSettings.landingPage.navbar;
  const appName = settings?.appName || defaultSettings.appName;
  const containerStyles = navbarContent?.containerStyles || defaultSettings.landingPage.navbar.containerStyles;
  const navStyles = navbarContent?.navStyles || defaultSettings.landingPage.navbar.navStyles;

  const { isIconLogo, logoIconName, logoUrl } = settings || {};
  const showLanguageSelector = settings?.landingPage.showLanguageSelector !== false;

  const visibleLinks = navbarContent.links.filter((link: NavbarLink) => link.visible !== false);

  const LogoComponent = () => (
    <>
      {isIconLogo && logoIconName ? (
        <DynamicIcon name={logoIconName} className="h-6 w-6" />
      ) : logoUrl ? (
        <Image src={logoUrl} alt={appName} width={24} height={24} className="h-6 w-6 object-contain" />
      ) : (
        <Mountain className="h-6 w-6" />
      )}
      <span className="hidden font-bold sm:inline-block">
        {appName}
      </span>
    </>
  );

  return (
    <header className={cn(containerStyles)}>
      <div className={cn(navStyles)}>
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LogoComponent />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {visibleLinks.map((link: NavbarLink) => (
                <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <LogoComponent />
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {visibleLinks.map((link: NavbarLink) => (
                    <Link key={link.href} href={link.href}>{link.text}</Link>
                  ))}
                </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center space-x-2 md:hidden">
            <LogoComponent />
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {showLanguageSelector && <LanguageSelector />}
          {session ? (
            <Button asChild>
              <Link href="/dashboard">{t('common.dashboard')}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

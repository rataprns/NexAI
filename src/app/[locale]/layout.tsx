
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import '../globals.css';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DynamicChatbotWidget } from "@/components/dynamic-chatbot";
import { ThemeProvider } from '@/components/theme-provider';
import type { ReactNode } from 'react';
import { resolve } from '@/services/bootstrap';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import defaultSettings from '@/lib/default-settings.json';
import { Providers } from '@/providers/providers';

const settingService = resolve<ISettingService>(SERVICE_KEYS.SettingService);

export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingService.getSettings();
  const appName = settings?.appName || defaultSettings.appName;
  return {
    title: appName,
    description: `A boilerplate for ${appName}`,
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  const settings = await settingService.getSettings();
  const appName = settings?.appName || defaultSettings.appName;
  const chatbotInitialMessage = settings?.chatbotInitialMessage || defaultSettings.chatbotInitialMessage;
  const initialMessage = chatbotInitialMessage.replace('{appName}', appName);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers locale={locale}>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <DynamicChatbotWidget appName={appName} initialMessage={initialMessage} />
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

import Link from "next/link";
import { Mountain } from "lucide-react";
import { resolve } from "@/services/bootstrap";
import { ISettingService } from "@/modules/settings/domain/services/setting.service.interface";
import { IFooterSectionService } from "@/modules/footer-section/domain/services/footer-section.service.interface";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import defaultSettings from "@/lib/default-settings.json";

const settingService = resolve<ISettingService>(SERVICE_KEYS.SettingService);
const footerService = resolve<IFooterSectionService>(SERVICE_KEYS.FooterSectionService);

export async function Footer() {
  const settings = await settingService.getSettings();
  const footerContentData = await footerService.getFooterSection();

  const footerContent = footerContentData ? JSON.parse(JSON.stringify(footerContentData)) : defaultSettings.landingPage.footer;
  const appName = settings?.appName || defaultSettings.appName;
  
  return (
    <footer className="w-full border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Mountain className="h-6 w-6" />
                    <span className="font-bold text-lg">{appName}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                    {footerContent.description}
                </p>
            </div>
            {footerContent.linkColumns.map((column, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

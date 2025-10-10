
'use server'

import React from 'react';
import { themes } from '@/lib/themes';
import { resolve } from '@/services/bootstrap';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const settingService = resolve<ISettingService>(SERVICE_KEYS.SettingService);

export async function ThemeProvider({ children }: { children: React.ReactNode }) {
    const settings = await settingService.getSettings();
    const selectedTheme = themes.find(t => t.name === settings?.theme) || themes[0];

    const themeStyles = Object.entries(selectedTheme.colors).map(([key, value]) => {
        // camelCase to kebab-case
        const cssVar = `--${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;
        return `${cssVar}: ${value};`;
    }).join('\n');
    
  return (
    <>
      <style>{`:root {${themeStyles}}`}</style>
      {children}
    </>
  );
}

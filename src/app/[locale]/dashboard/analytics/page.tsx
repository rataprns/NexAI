
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useScopedI18n } from "@/locales/client"
import { IntentAnalyticsTab } from "./components/intent-analytics-tab";
import { SentimentAnalyticsTab } from "./components/sentiment-analytics-tab";
import { ToolPerformanceTab } from "./components/tool-performance-tab";
import { ConversionRateTab } from "./components/conversion-rate-tab";

export default function AnalyticsPage() {
  const t = useScopedI18n("analytics");

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('page-title')}</h1>
      </div>
      <div className="flex flex-1 items-start rounded-lg border border-dashed shadow-sm p-4">
        <Tabs defaultValue="intents" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="intents">{t('intents-tab')}</TabsTrigger>
            <TabsTrigger value="sentiment">{t('sentiment-tab')}</TabsTrigger>
            <TabsTrigger value="tool-performance">{t('tool-performance-tab')}</TabsTrigger>
            <TabsTrigger value="conversion-rate">{t('conversion-rate-tab')}</TabsTrigger>
          </TabsList>
          <TabsContent value="intents">
            <IntentAnalyticsTab />
          </TabsContent>
          <TabsContent value="sentiment">
            <SentimentAnalyticsTab />
          </TabsContent>
          <TabsContent value="tool-performance">
            <ToolPerformanceTab />
          </TabsContent>
          <TabsContent value="conversion-rate">
            <ConversionRateTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

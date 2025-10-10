
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createAnalyticsRepository } from './analytics-repository.factory';
import { createAnalyticsService } from './analytics-service.factory';
import { createToolCallAnalyticsRepository } from './tool-call-analytics-repository.factory';

export function bootstrapAnalyticsModule(): void {
  container.register(SERVICE_KEYS.AnalyticsRepository, createAnalyticsRepository);
  container.register(SERVICE_KEYS.ToolCallAnalyticsRepository, createToolCallAnalyticsRepository);
  container.register(SERVICE_KEYS.AnalyticsService, createAnalyticsService);
}

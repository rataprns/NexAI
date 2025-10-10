
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { AnalyticsService } from "../application/services/analytics.service";
import { IAnalyticsRepository } from "../domain/repositories/analytics.repository";
import { IToolCallAnalyticsRepository } from "../domain/repositories/tool-call-analytics.repository";
import { IAnalyticsService } from '../domain/services/analytics.service.interface';

let _serviceInstance: IAnalyticsService;

export function createAnalyticsService(): IAnalyticsService {
    if(!_serviceInstance){
        const repository = container.resolve<IAnalyticsRepository>(SERVICE_KEYS.AnalyticsRepository);
        const toolCallRepository = container.resolve<IToolCallAnalyticsRepository>(SERVICE_KEYS.ToolCallAnalyticsRepository);
        _serviceInstance = new AnalyticsService(repository, toolCallRepository);
    }
    return _serviceInstance;
}

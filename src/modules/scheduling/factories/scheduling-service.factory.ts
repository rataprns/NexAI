
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { SchedulingService } from "../application/services/scheduling.service";
import { IAppointmentRepository } from "../domain/repositories/appointment.repository";
import { ISchedulingService } from '../domain/services/scheduling.service.interface';

let _schedulingServiceInstance: ISchedulingService;

export function createSchedulingService(): ISchedulingService {
    if(!_schedulingServiceInstance){
        const repository = container.resolve<IAppointmentRepository>(SERVICE_KEYS.AppointmentRepository);
        _schedulingServiceInstance = new SchedulingService(repository);
    }
    return _schedulingServiceInstance;
}

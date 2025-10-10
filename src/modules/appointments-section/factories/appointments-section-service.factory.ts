
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { AppointmentsSectionService } from "../application/services/appointments-section.service";
import { IAppointmentsSectionRepository } from "../domain/repositories/appointments-section.repository";
import { IAppointmentsSectionService } from '../domain/services/appointments-section.service.interface';

let _serviceInstance: IAppointmentsSectionService;

export function createAppointmentsSectionService(): IAppointmentsSectionService {
    if(!_serviceInstance){
        const repository = container.resolve<IAppointmentsSectionRepository>(SERVICE_KEYS.AppointmentsSectionRepository);
        _serviceInstance = new AppointmentsSectionService(repository);
    }
    return _serviceInstance;
}

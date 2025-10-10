
import { MongooseAppointmentRepository } from "../infrastructure/persistence/mongoose/repositories/appointment.repository";
import { IAppointmentRepository } from '../domain/repositories/appointment.repository';

let _appointmentRepositoryInstance: IAppointmentRepository;

export function createAppointmentRepository(): IAppointmentRepository {
    if(!_appointmentRepositoryInstance){
        _appointmentRepositoryInstance = new MongooseAppointmentRepository();
    }
    return _appointmentRepositoryInstance;
}

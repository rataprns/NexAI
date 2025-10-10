
import { MongooseAppointmentsSectionRepository } from "../infrastructure/persistence/mongoose/repositories/appointments-section.repository";
import { IAppointmentsSectionRepository } from '../domain/repositories/appointments-section.repository';

let _repositoryInstance: IAppointmentsSectionRepository;

export function createAppointmentsSectionRepository(): IAppointmentsSectionRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseAppointmentsSectionRepository();
    }
    return _repositoryInstance;
}

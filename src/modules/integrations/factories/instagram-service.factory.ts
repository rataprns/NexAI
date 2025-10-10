
import { InstagramService } from "../application/services/instagram.service";
import { IInstagramService } from '../domain/services/instagram.service.interface';

let instance: IInstagramService;

export function createInstagramService(): IInstagramService {
    if(!instance){
        instance = new InstagramService();
    }
    return instance;
}

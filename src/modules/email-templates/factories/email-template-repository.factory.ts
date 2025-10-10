
import { MongooseEmailTemplateRepository } from "../infrastructure/persistence/mongoose/repositories/email-template.repository";
import { IEmailTemplateRepository } from '../domain/repositories/email-template.repository';

let _repositoryInstance: IEmailTemplateRepository;

export function createEmailTemplateRepository(): IEmailTemplateRepository {
  if (!_repositoryInstance) {
    _repositoryInstance = new MongooseEmailTemplateRepository();
  }
  return _repositoryInstance;
}

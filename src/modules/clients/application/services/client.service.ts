
import { IClientRepository } from '../../domain/repositories/client.repository';
import { IClientService } from '../../domain/services/client.service.interface';
import { CreateClientDto } from '../dtos/client.dto';
import { Client } from '../../domain/entities/client.entity';
import { ISecretWordService } from '@/modules/security/domain/services/secret-word.service.interface';
import { resolve } from '@/services/bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';

export class ClientService implements IClientService {
  constructor(private readonly clientRepository: IClientRepository) {}
  
  private getSecretWordService(): ISecretWordService {
    return resolve<ISecretWordService>(SERVICE_KEYS.SecretWordService);
  }

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.clientRepository.findByEmail(createClientDto.email);
    if (existingClient) {
      // If client exists but is missing secret words, generate and save them.
      if (!existingClient.secretWord1 || !existingClient.secretWord2) {
        const secretWordService = this.getSecretWordService();
        const { word1, word2 } = await secretWordService.generateUniqueWordPair();
        existingClient.secretWord1 = word1;
        existingClient.secretWord2 = word2;
        // You'll need a way to update the client in the repository
        // This assumes an update method exists. If not, this logic needs adjustment.
        return this.clientRepository.update(existingClient);
      }
      return existingClient;
    }

    const secretWordService = this.getSecretWordService();
    const { word1, word2 } = await secretWordService.generateUniqueWordPair();

    const clientDataWithWords: CreateClientDto = {
      ...createClientDto,
      secretWord1: word1,
      secretWord2: word2,
    };
    
    const newClient = await this.clientRepository.create(clientDataWithWords);
    return newClient;
  }

  async findClientById(clientId: string): Promise<Client | null> {
    return this.clientRepository.findById(clientId);
  }

  async findClientByEmail(email: string): Promise<Client | null> {
    return this.clientRepository.findByEmail(email);
  }

  async findClientByName(name: string): Promise<Client[]> {
    return this.clientRepository.findByName(name);
  }

  async findAllClients(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }
}

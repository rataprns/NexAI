
import { IClientRepository } from '../../domain/repositories/client.repository';
import { IClientService } from '../../domain/services/client.service.interface';
import { CreateClientDto } from '../dtos/client.dto';
import { Client } from '../../domain/entities/client.entity';
import { ISecretWordService } from '@/modules/security/domain/services/secret-word.service.interface';
import { resolve } from '@/services/bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { ClientType } from '../../domain/entities/client-type.enum';


export class ClientService implements IClientService {
  constructor(private readonly clientRepository: IClientRepository) {}
  
  private getSecretWordService(): ISecretWordService {
    return resolve<ISecretWordService>(SERVICE_KEYS.SecretWordService);
  }

  async createOrUpdateClient(dto: CreateClientDto): Promise<Client> {
    // 1. Prioritize finding a client by email if it's provided
    if (dto.email) {
      const existingClientByEmail = await this.clientRepository.findByEmail(dto.email);
      if (existingClientByEmail) {
        // Found an existing client by email. Update them.
        existingClientByEmail.name = dto.name || existingClientByEmail.name;
        
        // If a new senderId is provided, associate it with this client.
        if (dto.senderId && !existingClientByEmail.senderId?.includes(dto.senderId)) {
            existingClientByEmail.senderId = dto.senderId;
        }

        // If the existing client was a lead, upgrade them to a client.
        if (existingClientByEmail.type === ClientType.LEAD) {
            existingClientByEmail.type = ClientType.CLIENT;
        }

        // If the client doesn't have secret words yet, generate them.
        if (!existingClientByEmail.secretWord1 || !existingClientByEmail.secretWord2) {
             const secretWordService = this.getSecretWordService();
             const { word1, word2 } = await secretWordService.generateUniqueWordPair();
             existingClientByEmail.secretWord1 = word1;
             existingClientByEmail.secretWord2 = word2;
        }
        
        existingClientByEmail.channel = dto.channel || existingClientByEmail.channel;

        return this.clientRepository.update(existingClientByEmail);
      }
    }
    
    // 2. If no client found by email, check by senderId (for anonymous leads)
    if (dto.senderId) {
        const existingClientBySenderId = await this.clientRepository.findBySenderId(dto.senderId);
        if (existingClientBySenderId) {
            // This is an anonymous lead. Update it with the new info.
            existingClientBySenderId.name = dto.name || existingClientBySenderId.name;
            existingClientBySenderId.email = dto.email || existingClientBySenderId.email;
            existingClientBySenderId.type = dto.type || ClientType.CLIENT;
            existingClientBySenderId.channel = dto.channel || existingClientBySenderId.channel;


            if (!existingClientBySenderId.secretWord1 || !existingClientBySenderId.secretWord2) {
                const secretWordService = this.getSecretWordService();
                const { word1, word2 } = await secretWordService.generateUniqueWordPair();
                existingClientBySenderId.secretWord1 = word1;
                existingClientBySenderId.secretWord2 = word2;
            }

            return this.clientRepository.update(existingClientBySenderId);
        }
    }

    // 3. If no client is found by email or senderId, create a new one.
    const dataToCreate: CreateClientDto = {
        ...dto,
        type: dto.type || ClientType.LEAD,
    };
    
    // Generate secret words only if it's a full client registration
    if (dto.name && dto.email && (!dto.secretWord1 || !dto.secretWord2)) {
      const secretWordService = this.getSecretWordService();
      const { word1, word2 } = await secretWordService.generateUniqueWordPair();
      dataToCreate.secretWord1 = word1;
      dataToCreate.secretWord2 = word2;
    }

    return this.clientRepository.create(dataToCreate);
  }

  async findClientById(clientId: string): Promise<Client | null> {
    return this.clientRepository.findById(clientId);
  }

  async findBySenderId(senderId: string): Promise<Client | null> {
      return this.clientRepository.findBySenderId(senderId);
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

  async updateSecretWords(clientId: string, newWord1: string, newWord2: string): Promise<Client> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    return this.clientRepository.updateSecretWords(clientId, newWord1, newWord2);
  }
}


import { CreateClientDto } from '../../application/dtos/client.dto';
import { Client } from '../entities/client.entity';

export interface IClientService {
  createOrUpdateClient(createClientDto: CreateClientDto): Promise<Client>;
  findClientById(clientId: string): Promise<Client | null>;
  findClientByEmail(email: string): Promise<Client | null>;
  findBySenderId(senderId: string): Promise<Client | null>;
  findClientByName(name: string): Promise<Client[]>;
  findAllClients(): Promise<Client[]>;
  updateSecretWords(clientId: string, newWord1: string, newWord2: string): Promise<Client>;
}

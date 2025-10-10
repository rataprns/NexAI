
import { Client } from '../entities/client.entity';
import { CreateClientDto } from '../../application/dtos/client.dto';

export interface IClientRepository {
  create(clientDto: CreateClientDto): Promise<Client>;
  findByEmail(email: string): Promise<Client | null>;
  findByName(name: string): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  findAll(): Promise<Client[]>;
  update(client: Client): Promise<Client>;
}

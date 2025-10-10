
import dbConnect from '@/lib/db';
import { IClientRepository } from '@/modules/clients/domain/repositories/client.repository';
import { Client } from '@/modules/clients/domain/entities/client.entity';
import { ClientModel, IClient } from '../models/client.model';
import { ClientMapper } from '@/modules/clients/application/mappers/client.mapper';
import { CreateClientDto } from '@/modules/clients/application/dtos/client.dto';
import mongoose from 'mongoose';

export class MongooseClientRepository implements IClientRepository {
  
  public async create(clientDto: CreateClientDto): Promise<Client> {
    await dbConnect();
    const newClient = new ClientModel(clientDto);
    const savedClient = await newClient.save();
    return ClientMapper.toDomain(savedClient);
  }

  public async findByEmail(email: string): Promise<Client | null> {
    await dbConnect();
    const client = await ClientModel.findOne({ email });
    if (!client) {
      return null;
    }
    return ClientMapper.toDomain(client);
  }

  public async findByName(name: string): Promise<Client[]> {
    await dbConnect();
    // Use a case-insensitive regex for a better user experience
    const clients = await ClientModel.find({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (!clients || clients.length === 0) {
      return [];
    }
    return clients.map(client => ClientMapper.toDomain(client));
  }

  public async findById(id: string): Promise<Client | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const client = await ClientModel.findById(id);
    if (!client) {
      return null;
    }
    return ClientMapper.toDomain(client);
  }

  public async findAll(): Promise<Client[]> {
    await dbConnect();
    const clients = await ClientModel.find({}).sort({ createdAt: 'desc' });
    return clients.map(doc => ClientMapper.toDomain(doc as IClient & { createdAt: Date; updatedAt: Date }));
  }

  public async update(client: Client): Promise<Client> {
    await dbConnect();
    const clientDoc = await ClientModel.findById(client.id);
    if (!clientDoc) {
      throw new Error('Client not found for update');
    }

    clientDoc.name = client.name;
    clientDoc.email = client.email;
    clientDoc.secretWord1 = client.secretWord1;
    clientDoc.secretWord2 = client.secretWord2;
    
    const savedClient = await clientDoc.save();
    return ClientMapper.toDomain(savedClient);
  }
}

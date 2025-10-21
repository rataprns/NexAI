
import dbConnect from '@/lib/db';
import { IClientRepository } from '@/modules/clients/domain/repositories/client.repository';
import { Client } from '@/modules/clients/domain/entities/client.entity';
import { ClientModel, IClient } from '../models/client.model';
import { ClientMapper } from '@/modules/clients/application/mappers/client.mapper';
import { CreateClientDto } from '@/modules/clients/application/dtos/client.dto';
import mongoose from 'mongoose';
import { ClientType } from '../../../../domain/entities/client-type.enum';

export class MongooseClientRepository implements IClientRepository {
  
  public async create(clientDto: CreateClientDto): Promise<Client> {
    await dbConnect();
    
    let name = clientDto.name;
    if (!name && clientDto.senderId) {
      const uniquePart = clientDto.senderId.slice(-7);
      name = `Anonymous Lead ${uniquePart}`;
    } else if (!name) {
      name = 'Anonymous Lead';
    }

    const dataToSave = {
        ...clientDto,
        name,
        type: clientDto.type || ClientType.LEAD,
    };
    const newClient = new ClientModel(dataToSave);
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

  public async findBySenderId(senderId: string): Promise<Client | null> {
    await dbConnect();
    const client = await ClientModel.findOne({ senderId });
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
    clientDoc.senderId = client.senderId;
    clientDoc.channel = client.channel;
    clientDoc.type = client.type;
    clientDoc.secretWord1 = client.secretWord1;
    clientDoc.secretWord2 = client.secretWord2;
    
    const savedClient = await clientDoc.save();
    return ClientMapper.toDomain(savedClient);
  }

  public async updateSecretWords(clientId: string, newWord1: string, newWord2: string): Promise<Client> {
    await dbConnect();
    const clientDoc = await ClientModel.findByIdAndUpdate(
        clientId,
        { $set: { secretWord1: newWord1, secretWord2: newWord2 } },
        { new: true }
    );
    if (!clientDoc) {
      throw new Error('Client not found for updating secret words');
    }
    return ClientMapper.toDomain(clientDoc);
  }
}

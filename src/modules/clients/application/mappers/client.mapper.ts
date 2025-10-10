
import { Client } from '../../domain/entities/client.entity';
import { IClient } from '../../infrastructure/persistence/mongoose/models/client.model';

export class ClientMapper {
  static toDomain(clientDoc: IClient): Client {
    return new Client(
      clientDoc._id.toString(),
      clientDoc.name,
      clientDoc.email,
      clientDoc.createdAt,
      clientDoc.updatedAt,
      clientDoc.secretWord1,
      clientDoc.secretWord2
    );
  }
}

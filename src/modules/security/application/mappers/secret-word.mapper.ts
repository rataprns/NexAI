
import { SecretWord } from '../../domain/entities/secret-word.entity';
import { ISecretWord } from '../../infrastructure/persistence/mongoose/models/secret-word.model';

export class SecretWordMapper {
  static toDomain(doc: ISecretWord): SecretWord {
    return new SecretWord(
      doc._id.toString(),
      doc.word1,
      doc.word2,
      doc.createdAt,
      doc.updatedAt
    );
  }
}

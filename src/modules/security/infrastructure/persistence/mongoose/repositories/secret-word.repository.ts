
import dbConnect from '@/lib/db';
import { ISecretWordRepository } from '@/modules/security/domain/repositories/secret-word.repository';
import { SecretWord } from '@/modules/security/domain/entities/secret-word.entity';
import { SecretWordModel } from '../models/secret-word.model';
import { SecretWordMapper } from '@/modules/security/application/mappers/secret-word.mapper';

export class MongooseSecretWordRepository implements ISecretWordRepository {
  public async create(word1: string, word2: string): Promise<SecretWord> {
    await dbConnect();
    const newPair = new SecretWordModel({ word1, word2 });
    const savedPair = await newPair.save();
    return SecretWordMapper.toDomain(savedPair);
  }

  public async exists(word1: string, word2: string): Promise<boolean> {
    await dbConnect();
    const count = await SecretWordModel.countDocuments({ 
        $or: [
            { word1, word2 },
            { word1: word2, word2: word1 }
        ]
     });
    return count > 0;
  }

  public async isWordUsed(word: string): Promise<boolean> {
    await dbConnect();
    const count = await SecretWordModel.countDocuments({
      $or: [{ word1: word }, { word2: word }],
    });
    return count > 0;
  }

  public async remove(word1: string, word2: string): Promise<void> {
    await dbConnect();
    await SecretWordModel.deleteOne({ 
        $or: [
            { word1, word2 },
            { word1: word2, word2: word1 }
        ]
     });
  }
}

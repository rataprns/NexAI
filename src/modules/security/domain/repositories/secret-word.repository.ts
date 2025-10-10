
import { SecretWord } from '../entities/secret-word.entity';

export interface ISecretWordRepository {
  create(word1: string, word2: string): Promise<SecretWord>;
  exists(word1: string, word2: string): Promise<boolean>;
}


import { ISecretWordRepository } from '../../domain/repositories/secret-word.repository';
import { ISecretWordService } from '../../domain/services/secret-word.service.interface';
import { secretWords } from '../../lib/secret-word-list';

export class SecretWordService implements ISecretWordService {
  constructor(private readonly repository: ISecretWordRepository) {}

  private getRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * secretWords.length);
    return secretWords[randomIndex];
  }

  async generateUniqueWordPair(): Promise<{ word1: string; word2: string }> {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      let word1 = this.getRandomWord();
      let word2 = this.getRandomWord();

      // Ensure words are not the same
      while (word1 === word2) {
        word2 = this.getRandomWord();
      }

      // Ensure consistent order for checking existence
      const [sortedWord1, sortedWord2] = [word1, word2].sort();

      const pairExists = await this.repository.exists(sortedWord1, sortedWord2);
      if (!pairExists) {
        await this.repository.create(sortedWord1, sortedWord2);
        return { word1: sortedWord1, word2: sortedWord2 };
      }

      attempts++;
    }

    throw new Error('Failed to generate a unique word pair after multiple attempts.');
  }

  async areWordsAvailable(word1: string, word2: string): Promise<{ available: boolean; existing: string[] }> {
    const [sortedWord1, sortedWord2] = [word1, word2].sort();
    const pairExists = await this.repository.exists(sortedWord1, sortedWord2);

    if (pairExists) {
      // Since we don't know which word caused the conflict, we can check them individually
      // This is a simplification; a more complex check might be needed for precise feedback
      const existing: string[] = [];
      const w1Exists = await this.repository.isWordUsed(word1);
      const w2Exists = await this.repository.isWordUsed(word2);
      if (w1Exists) existing.push(word1);
      if (w2Exists) existing.push(word2);
      return { available: false, existing: existing.length > 0 ? existing : [word1, word2] };
    }
    return { available: true, existing: [] };
  }
}

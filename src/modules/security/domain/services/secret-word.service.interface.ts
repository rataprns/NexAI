
export interface ISecretWordService {
    generateUniqueWordPair(): Promise<{ word1: string; word2: string }>;
}

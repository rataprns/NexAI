
export interface ISecretWordService {
    generateUniqueWordPair(): Promise<{ word1: string; word2: string }>;
    areWordsAvailable(word1: string, word2: string): Promise<{ available: boolean; existing: string[] }>;
}

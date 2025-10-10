
export class SecretWord {
    id: string;
    word1: string;
    word2: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(
      id: string,
      word1: string,
      word2: string,
      createdAt: Date,
      updatedAt: Date
    ) {
      this.id = id;
      this.word1 = word1;
      this.word2 = word2;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
}

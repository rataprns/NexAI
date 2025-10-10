
export class Client {
  id: string;
  name: string;
  email: string;
  secretWord1?: string;
  secretWord2?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    secretWord1?: string,
    secretWord2?: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.secretWord1 = secretWord1;
    this.secretWord2 = secretWord2;
  }
}

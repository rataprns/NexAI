
import { ClientType } from "./client-type.enum";

export class Client {
  id: string;
  name: string;
  email?: string;
  senderId?: string;
  channel?: string;
  type: ClientType;
  secretWord1?: string;
  secretWord2?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string | undefined,
    type: ClientType,
    createdAt: Date,
    updatedAt: Date,
    senderId?: string,
    channel?: string,
    secretWord1?: string,
    secretWord2?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.senderId = senderId;
    this.channel = channel;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.secretWord1 = secretWord1;
    this.secretWord2 = secretWord2;
  }
}


export class ChatMessage {
    role: 'user' | 'bot';
    text: string;
  
    constructor(role: 'user' | 'bot', text: string) {
      this.role = role;
      this.text = text;
    }
}
  
export class ConversationHistory {
    id: string;
    senderId: string;
    history: ChatMessage[];
    lastInteraction: Date;
  
    constructor(
      id: string,
      senderId: string,
      history: ChatMessage[],
      lastInteraction: Date
    ) {
      this.id = id;
      this.senderId = senderId;
      this.history = history;
      this.lastInteraction = lastInteraction;
    }
}

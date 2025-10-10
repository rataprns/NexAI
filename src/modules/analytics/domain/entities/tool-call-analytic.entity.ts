
export class ToolCallAnalytic {
    id: string;
    senderId: string;
    channel: string;
    toolName: string;
    input: any;
    wasSuccessful: boolean;
    outputMessage: string;
    createdAt: Date;
  
    constructor(
        id: string,
        senderId: string,
        channel: string,
        toolName: string,
        input: any,
        wasSuccessful: boolean,
        outputMessage: string,
        createdAt: Date,
    ) {
      this.id = id;
      this.senderId = senderId;
      this.channel = channel;
      this.toolName = toolName;
      this.input = input;
      this.wasSuccessful = wasSuccessful;
      this.outputMessage = outputMessage;
      this.createdAt = createdAt;
    }
}

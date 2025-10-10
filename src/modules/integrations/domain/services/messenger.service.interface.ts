
export interface IMessengerService {
    sendMessage(to: string, message: string): Promise<void>;
}

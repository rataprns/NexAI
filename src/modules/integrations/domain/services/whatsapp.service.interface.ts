
export interface IWhatsappService {
    sendMessage(to: string, message: string): Promise<void>;
}

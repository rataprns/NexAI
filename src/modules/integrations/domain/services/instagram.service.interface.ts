
export interface IInstagramService {
    sendMessage(to: string, message: string): Promise<void>;
}


import { resolve } from "@/services/bootstrap";
import { IMessengerService } from "../../domain/services/messenger.service.interface";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ISettingService } from "@/modules/settings/domain/services/setting.service.interface";

export class MessengerService implements IMessengerService {
    private getSettingService(): ISettingService {
        return resolve<ISettingService>(SERVICE_KEYS.SettingService);
    }
    
    async sendMessage(to: string, message: string): Promise<void> {
        const settings = await this.getSettingService().getSettings();
        const accessToken = settings?.integrations?.messenger?.accessToken;

        if (!accessToken) {
            console.warn("Messenger access token is not configured.");
            return;
        }

        const url = `https://graph.facebook.com/v20.0/me/messages?access_token=${accessToken}`;

        const payload = {
            recipient: { id: to },
            message: { text: message },
            messaging_type: 'RESPONSE'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to send Messenger message: ${JSON.stringify(errorData)}`);
            }

            console.log(`Messenger message sent to ${to}`);
        } catch (error) {
            console.error("Error sending Messenger message:", error);
            throw error;
        }
    }
}

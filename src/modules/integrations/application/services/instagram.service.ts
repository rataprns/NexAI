
import { resolve } from "@/services/bootstrap";
import { IInstagramService } from "../../domain/services/instagram.service.interface";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ISettingService } from "@/modules/settings/domain/services/setting.service.interface";

export class InstagramService implements IInstagramService {
    private getSettingService(): ISettingService {
        return resolve<ISettingService>(SERVICE_KEYS.SettingService);
    }
    
    async sendMessage(to: string, message: string): Promise<void> {
        const settings = await this.getSettingService().getSettings();
        const accessToken = settings?.integrations?.instagram?.accessToken;

        if (!accessToken) {
            console.warn("Instagram access token is not configured.");
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
                throw new Error(`Failed to send Instagram message: ${JSON.stringify(errorData)}`);
            }

            console.log(`Instagram message sent to ${to}`);
        } catch (error) {
            console.error("Error sending Instagram message:", error);
            throw error;
        }
    }
}

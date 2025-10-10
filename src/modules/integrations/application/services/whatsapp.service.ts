import { resolve } from "@/services/bootstrap";
import { IWhatsappService } from "../../domain/services/whatsapp.service.interface";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ISettingService } from "@/modules/settings/domain/services/setting.service.interface";

export class WhatsappService implements IWhatsappService {
    private getSettingService(): ISettingService {
        return resolve<ISettingService>(SERVICE_KEYS.SettingService);
    }

    async sendMessage(to: string, message: string): Promise<void> {
        const settings = await this.getSettingService().getSettings();
        const accessToken = settings?.integrations?.whatsapp?.accessToken;
        const fromNumberId = settings?.integrations?.whatsapp?.fromNumberId;

        if (!accessToken || !fromNumberId) {
            console.warn("WhatsApp access token or From Number ID is not configured.");
            return;
        }

        const url = `https://graph.facebook.com/v20.0/${fromNumberId}/messages`;

        const payload = {
            messaging_product: "whatsapp",
            to: to,
            text: { body: message }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to send WhatsApp message: ${JSON.stringify(errorData)}`);
            }

            console.log(`WhatsApp message sent to ${to}`);
        } catch (error) {
            console.error("Error sending WhatsApp message:", error);
            throw error;
        }
    }
}

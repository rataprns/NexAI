
import { campaignController } from '@/modules/campaigns/interfaces/controllers/campaign.controller';

export const GET = campaignController.getCampaignHandler;
export const POST = campaignController.createCampaignHandler;
export const PUT = campaignController.updateCampaignHandler;
export const DELETE = campaignController.deleteCampaignHandler;

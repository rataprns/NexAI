
import { NextRequest, NextResponse } from 'next/server';
import { resolve } from '@/services/bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { ICampaignService } from '../../domain/services/campaign.service.interface';
import { createCampaignSchema, updateCampaignSchema, generateCampaignContentDtoSchema, suggestCampaignIdeaDtoSchema } from '../../application/dtos/campaign.dto';
import { verifySession } from '@/lib/auth';
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';
import { CampaignStatus } from '../../domain/entities/campaign.entity';

const getService = () => resolve<ICampaignService>(SERVICE_KEYS.CampaignService);

async function getCampaignHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const active = searchParams.get('active');

        if (slug) {
            const campaign = await getService().findCampaignBySlug(slug);
            if (!campaign || campaign.status !== 'PUBLISHED') {
                return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
            }
            return NextResponse.json(campaign);
        }

        if (active === 'true') {
            const campaigns = await getService().findAllCampaigns();
            const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.PUBLISHED);
            return NextResponse.json(activeCampaigns);
        }
        
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
        const campaigns = await getService().findAllCampaigns();
        return NextResponse.json(campaigns);

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

async function createCampaignHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const validation = createCampaignSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
        }
        
        const newCampaign = await getService().createCampaign(validation.data);
        return NextResponse.json(newCampaign, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

async function updateCampaignHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const validation = updateCampaignSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
        }

        const updatedCampaign = await getService().updateCampaign(validation.data);
        if (!updatedCampaign) {
            return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
        }
        return NextResponse.json(updatedCampaign);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

async function deleteCampaignHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ message: 'Campaign ID is required' }, { status: 400 });

        await getService().deleteCampaign(id);
        return NextResponse.json({ message: 'Campaign deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

async function generateContentHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const body = await req.json();

        if (type === 'idea') {
            const validation = suggestCampaignIdeaDtoSchema.safeParse(body);
             if (!validation.success) {
                return NextResponse.json({ message: 'Invalid input for idea generation', errors: validation.error.flatten() }, { status: 400 });
            }
            const idea = await getService().suggestCampaignIdea(validation.data);
            return NextResponse.json(idea);
        }
        
        if (type === 'content') {
            const validation = generateCampaignContentDtoSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({ message: 'Invalid input for content generation', errors: validation.error.flatten() }, { status: 400 });
            }
            const content = await getService().generateCampaignContent(validation.data);
            return NextResponse.json(content);
        }

        return NextResponse.json({ message: 'Invalid request type' }, { status: 400 });
    } catch (error: any) {
        console.error("[CAMPAIGN_GENERATE_ERROR]", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const campaignController = {
    getCampaignHandler,
    createCampaignHandler,
    updateCampaignHandler,
    deleteCampaignHandler,
    generateContentHandler,
};

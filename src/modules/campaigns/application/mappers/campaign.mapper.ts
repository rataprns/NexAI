
import { Campaign } from '../../domain/entities/campaign.entity';
import { ICampaign } from '../../infrastructure/persistence/mongoose/models/campaign.model';

export class CampaignMapper {
  static toDomain(doc: ICampaign): Campaign {
    return new Campaign(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.slug,
      doc.status,
      doc.generatedTitle,
      doc.generatedSubtitle,
      doc.generatedBody,
      doc.chatbotInitialMessage,
      doc.chatbotConversionGoal,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}

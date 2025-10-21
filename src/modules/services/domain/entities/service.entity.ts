
export class CustomField {
    label: string;
    value: string;

    constructor(label: string, value: string) {
        this.label = label;
        this.value = value;
    }
}

export class Service {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    imageUrl?: string;
    duration: number;
    price: number;
    offerPrice?: number;
    currency: string;
    customFields: CustomField[];
    locationIds: string[];
    campaignId?: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(
      id: string,
      name: string,
      description: string,
      isActive: boolean,
      duration: number,
      price: number,
      currency: string,
      customFields: CustomField[],
      locationIds: string[],
      createdAt: Date,
      updatedAt: Date,
      imageUrl?: string,
      offerPrice?: number,
      campaignId?: string,
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.isActive = isActive;
      this.duration = duration;
      this.price = price;
      this.offerPrice = offerPrice;
      this.currency = currency;
      this.customFields = customFields;
      this.locationIds = locationIds;
      this.campaignId = campaignId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.imageUrl = imageUrl;
    }
  }

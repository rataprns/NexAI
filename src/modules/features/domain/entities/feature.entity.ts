
export class FeatureItem {
  icon: string;
  title: string;
  description: string;

  constructor(icon: string, title: string, description: string) {
    this.icon = icon;
    this.title = title;
    this.description = description;
  }
}

export class FeaturesSection {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  items: FeatureItem[];
  imageUrl?: string;
  containerStyles?: string;
  gridStyles?: string;
  titleColor?: string;
  subtitleColor?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    badge: string,
    title: string,
    subtitle: string,
    items: FeatureItem[],
    imageUrl: string | undefined,
    containerStyles: string | undefined,
    gridStyles: string | undefined,
    titleColor: string | undefined,
    subtitleColor: string | undefined,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.badge = badge;
    this.title = title;
    this.subtitle = subtitle;
    this.items = items;
    this.imageUrl = imageUrl;
    this.containerStyles = containerStyles;
    this.gridStyles = gridStyles;
    this.titleColor = titleColor;
    this.subtitleColor = subtitleColor;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

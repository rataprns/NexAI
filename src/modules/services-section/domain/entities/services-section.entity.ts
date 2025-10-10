
export class ServicesSection {
    id: string;
    badge: string;
    title: string;
    subtitle: string;
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
      createdAt: Date,
      updatedAt: Date,
      containerStyles?: string,
      gridStyles?: string,
      titleColor?: string,
      subtitleColor?: string,
    ) {
      this.id = id;
      this.badge = badge;
      this.title = title;
      this.subtitle = subtitle;
      this.containerStyles = containerStyles;
      this.gridStyles = gridStyles;
      this.titleColor = titleColor;
      this.subtitleColor = subtitleColor;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

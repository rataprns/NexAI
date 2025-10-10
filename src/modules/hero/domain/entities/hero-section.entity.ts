
export class HeroSection {
    id: string;
    title: string;
    subtitle: string;
    ctaButton1Text: string;
    ctaButton2Text: string;
    imageUrl?: string;
    containerStyles?: string;
    gridStyles?: string;
    titleColor?: string;
    subtitleColor?: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(
      id: string,
      title: string,
      subtitle: string,
      ctaButton1Text: string,
      ctaButton2Text: string,
      imageUrl: string | undefined,
      containerStyles: string | undefined,
      gridStyles: string | undefined,
      titleColor: string | undefined,
      subtitleColor: string | undefined,
      createdAt: Date,
      updatedAt: Date
    ) {
      this.id = id;
      this.title = title;
      this.subtitle = subtitle;
      this.ctaButton1Text = ctaButton1Text;
      this.ctaButton2Text = ctaButton2Text;
      this.imageUrl = imageUrl;
      this.containerStyles = containerStyles;
      this.gridStyles = gridStyles;
      this.titleColor = titleColor;
      this.subtitleColor = subtitleColor;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

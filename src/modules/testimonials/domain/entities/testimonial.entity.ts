
export class TestimonialItem {
  quote: string;
  name: string;
  title: string;
  avatar: string;

  constructor(quote: string, name: string, title: string, avatar: string) {
    this.quote = quote;
    this.name = name;
    this.title = title;
    this.avatar = avatar;
  }
}

export class TestimonialsSection {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  items: TestimonialItem[];
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
    items: TestimonialItem[],
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
    this.containerStyles = containerStyles;
    this.gridStyles = gridStyles;
    this.titleColor = titleColor;
    this.subtitleColor = subtitleColor;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

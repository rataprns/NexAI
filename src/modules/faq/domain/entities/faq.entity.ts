
export class FaqItem {
  question: string;
  answer: string;

  constructor(question: string, answer: string) {
    this.question = question;
    this.answer = answer;
  }
}

export class FaqSection {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
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
    items: FaqItem[],
    createdAt: Date,
    updatedAt: Date,
    containerStyles?: string,
    gridStyles?: string,
    titleColor?: string,
    subtitleColor?: string
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

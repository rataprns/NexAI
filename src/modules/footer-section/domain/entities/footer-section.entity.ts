
export class FooterLink {
    text: string;
    href: string;

    constructor(text: string, href: string) {
        this.text = text;
        this.href = href;
    }
}

export class FooterLinkColumn {
    title: string;
    links: FooterLink[];

    constructor(title: string, links: FooterLink[]) {
        this.title = title;
        this.links = links;
    }
}

export class FooterSection {
    id: string;
    description: string;
    linkColumns: FooterLinkColumn[];
    createdAt: Date;
    updatedAt: Date;
  
    constructor(
      id: string,
      description: string,
      linkColumns: FooterLinkColumn[],
      createdAt: Date,
      updatedAt: Date
    ) {
      this.id = id;
      this.description = description;
      this.linkColumns = linkColumns;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

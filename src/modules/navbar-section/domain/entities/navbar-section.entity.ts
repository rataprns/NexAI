
export class NavbarLink {
    text: string;
    href: string;
    visible: boolean;

    constructor(text: string, href: string, visible: boolean = true) {
        this.text = text;
        this.href = href;
        this.visible = visible;
    }
}

export class NavbarSection {
    id: string;
    links: NavbarLink[];
    containerStyles?: string;
    navStyles?: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(
      id: string,
      links: NavbarLink[],
      createdAt: Date,
      updatedAt: Date,
      containerStyles?: string,
      navStyles?: string
    ) {
      this.id = id;
      this.links = links;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.containerStyles = containerStyles;
      this.navStyles = navStyles;
    }
  }

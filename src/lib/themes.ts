
export type Theme = {
  name: string;
  label: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'default',
    label: 'Default',
    colors: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      cardForeground: '240 10% 3.9%',
      popover: '0 0% 100%',
      popoverForeground: '240 10% 3.9%',
      primary: '240 5.9% 10%',
      primaryForeground: '0 0% 98%',
      secondary: '240 4.8% 95.9%',
      secondaryForeground: '240 5.9% 10%',
      muted: '240 4.8% 95.9%',
      mutedForeground: '240 3.8% 46.1%',
      accent: '240 4.8% 95.9%',
      accentForeground: '240 5.9% 10%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      border: '240 5.9% 90%',
      input: '240 5.9% 90%',
      ring: '240 10% 3.9%',
    },
  },
  {
    name: 'zinc',
    label: 'Zinc',
    colors: {
        background: '0 0% 100%',
        foreground: '240 10% 3.9%',
        card: '0 0% 100%',
        cardForeground: '240 10% 3.9%',
        popover: '0 0% 100%',
        popoverForeground: '240 10% 3.9%',
        primary: '240 5.9% 10%',
        primaryForeground: '0 0% 98%',
        secondary: '240 4.8% 95.9%',
        secondaryForeground: '240 5.9% 10%',
        muted: '240 4.8% 95.9%',
        mutedForeground: '240 3.8% 46.1%',
        accent: '240 4.8% 95.9%',
        accentForeground: '240 5.9% 10%',
        destructive: '0 84.2% 60.2%',
        destructiveForeground: '0 0% 98%',
        border: '240 5.9% 90%',
        input: '240 5.9% 90%',
        ring: '240 5.9% 10%',
    }
  },
  {
    name: 'rose',
    label: 'Rose',
    colors: {
      background: "0 0% 100%",
      foreground: "346.8 77.2% 10.2%",
      card: "0 0% 100%",
      cardForeground: "346.8 77.2% 10.2%",
      popover: "0 0% 100%",
      popoverForeground: "346.8 77.2% 10.2%",
      primary: "346.8 77.2% 49.8%",
      primaryForeground: "355.7 100% 97.3%",
      secondary: "333.3 69.2% 95.3%",
      secondaryForeground: "340 5.9% 10%",
      muted: "333.3 69.2% 95.3%",
      mutedForeground: "340 3.8% 46.1%",
      accent: "333.3 69.2% 95.3%",
      accentForeground: "340 5.9% 10%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "340 5.1% 88.6%",
      input: "340 5.1% 88.6%",
      ring: "346.8 77.2% 49.8%",
    }
  },
  {
    name: 'blue',
    label: 'Blue',
    colors: {
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      popover: "0 0% 100%",
      popoverForeground: "222.2 84% 4.9%",
      primary: "221.2 83.2% 53.3%",
      primaryForeground: "210 40% 98%",
      secondary: "210 40% 96.1%",
      secondaryForeground: "222.2 47.4% 11.2%",
      muted: "210 40% 96.1%",
      mutedForeground: "215.4 16.3% 46.9%",
      accent: "210 40% 96.1%",
      accentForeground: "222.2 47.4% 11.2%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "210 40% 98%",
      border: "214.3 31.8% 91.4%",
      input: "214.3 31.8% 91.4%",
      ring: "221.2 83.2% 53.3%",
    }
  },
  {
    name: 'green',
    label: 'Green',
    colors: {
      background: "0 0% 100%",
      foreground: "142.1 76.2% 10%",
      card: "0 0% 100%",
      cardForeground: "142.1 76.2% 10%",
      popover: "0 0% 100%",
      popoverForeground: "142.1 76.2% 10%",
      primary: "142.1 76.2% 36.3%",
      primaryForeground: "144 65.2% 95.1%",
      secondary: "148 63.4% 94.9%",
      secondaryForeground: "142.1 70.6% 21.8%",
      muted: "148 63.4% 94.9%",
      mutedForeground: "150 4.2% 46.1%",
      accent: "148 63.4% 94.9%",
      accentForeground: "142.1 70.6% 21.8%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "145.1 57.5% 86.9%",
      input: "145.1 57.5% 86.9%",
      ring: "142.1 76.2% 36.3%",
    }
  },
];

export type Screen = 'news' | 'search' | 'profile' | 'portfolio' | 'stock-detail' | 'currency' | 'language';

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  time: string;
  image: string;
  category: string;
  isTopStory?: boolean;
}

export interface Asset {
  symbol: string;
  name: string;
  price: string | number;
  change: string;
  isPositive: boolean;
  logo?: string;
  lots?: number;
  exchange?: string;
}

export interface MarketUpdate {
  symbol: string;
  price: number;
  change: string;
  isPositive: boolean;
}

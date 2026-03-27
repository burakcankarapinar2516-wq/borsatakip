import { NewsItem, Asset } from './types';

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    source: 'Bloomberg',
    title: 'The Emerald Shift: Why Sustainable Tech is Leading the Next Bull Run',
    time: '14 min ago',
    image: 'https://picsum.photos/seed/emerald/800/450',
    category: 'Markets',
    isTopStory: true
  },
  {
    id: '2',
    source: 'Reuters',
    title: 'Federal Reserve Hints at Final Rate Stabilization as Inflation Cools',
    time: '2 hours ago',
    image: 'https://picsum.photos/seed/fed/200/200',
    category: 'Economy'
  },
  {
    id: '3',
    source: 'WSJ',
    title: 'Mega-Cap Tech Earnings Surpass Expectations: Is the Rally Sustainable?',
    time: '4 hours ago',
    image: 'https://picsum.photos/seed/tech/200/200',
    category: 'Companies'
  },
  {
    id: '4',
    source: 'The Economist',
    title: 'Crude Oil Volatility: How Geopolitical Tensions Are Reshaping Energy Portfolios',
    time: '6 hours ago',
    image: 'https://picsum.photos/seed/oil/400/300',
    category: 'Markets'
  },
  {
    id: '5',
    source: 'CoinDesk',
    title: 'Institutional Adoption: Major Banks Open Custody Solutions for Digital Assets',
    time: '8 hours ago',
    image: 'https://picsum.photos/seed/crypto/400/300',
    category: 'Crypto'
  }
];

export const TRENDING_ASSETS: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$68,432.10', change: '+2.45%', isPositive: true, logo: 'https://picsum.photos/seed/btc/100/100', exchange: 'Crypto' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: '$174.52', change: '+0.82%', isPositive: true, logo: 'https://logo.clearbit.com/tesla.com', exchange: 'NASDAQ' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,421.90', change: '-1.15%', isPositive: false, logo: 'https://picsum.photos/seed/eth/100/100', exchange: 'Crypto' },
  { symbol: 'AMZN', name: 'Amazon.com', price: '$186.13', change: '+3.12%', isPositive: true, logo: 'https://logo.clearbit.com/amazon.com', exchange: 'NASDAQ' }
];

export const WATCHLIST: Asset[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$192.42', change: '+1.45%', isPositive: true, logo: 'https://logo.clearbit.com/apple.com', lots: 10, exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: '$875.28', change: '+4.22%', isPositive: true, logo: 'https://logo.clearbit.com/nvidia.com', lots: 5, exchange: 'NASDAQ' },
  { symbol: 'THYAO', name: 'Turkish Airlines', price: '$284.50', change: '-0.32%', isPositive: false, logo: 'https://logo.clearbit.com/turkishairlines.com', lots: 100, exchange: 'BIST' }
];

export const SEARCHABLE_ASSETS: Asset[] = [
  ...TRENDING_ASSETS,
  ...WATCHLIST,
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$154.21', change: '+0.45%', isPositive: true, logo: 'https://logo.clearbit.com/google.com', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$425.22', change: '+1.12%', isPositive: true, logo: 'https://logo.clearbit.com/microsoft.com', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms', price: '$485.58', change: '-0.25%', isPositive: false, logo: 'https://logo.clearbit.com/meta.com', exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix, Inc.', price: '$610.50', change: '+2.30%', isPositive: true, logo: 'https://logo.clearbit.com/netflix.com', exchange: 'NASDAQ' },
  { symbol: 'SOL', name: 'Solana', price: '$145.20', change: '+5.42%', isPositive: true, logo: 'https://picsum.photos/seed/sol/100/100', exchange: 'Crypto' },
  { symbol: 'XRP', name: 'Ripple', price: '$0.62', change: '-2.15%', isPositive: false, logo: 'https://picsum.photos/seed/xrp/100/100', exchange: 'Crypto' },
  { symbol: 'ADA', name: 'Cardano', price: '$0.45', change: '+1.05%', isPositive: true, logo: 'https://picsum.photos/seed/ada/100/100', exchange: 'Crypto' },
  { symbol: 'BABA', name: 'Alibaba Group', price: '$72.45', change: '-0.85%', isPositive: false, logo: 'https://logo.clearbit.com/alibaba.com', exchange: 'NYSE' },
  { symbol: 'TSMC', name: 'TSMC', price: '$140.12', change: '+1.45%', isPositive: true, logo: 'https://logo.clearbit.com/tsmc.com', exchange: 'NYSE' },
  { symbol: 'ASELS', name: 'Aselsan', price: '₺54.20', change: '+1.25%', isPositive: true, logo: 'https://logo.clearbit.com/aselsan.com.tr', exchange: 'BIST' },
  { symbol: 'EREGL', name: 'Erdemir', price: '₺42.15', change: '-0.45%', isPositive: false, logo: 'https://logo.clearbit.com/erdemir.com.tr', exchange: 'BIST' },
  { symbol: 'KCHOL', name: 'Koç Holding', price: '₺185.40', change: '+2.10%', isPositive: true, logo: 'https://logo.clearbit.com/koc.com.tr', exchange: 'BIST' },
  { symbol: 'SASA', name: 'Sasa Polyester', price: '₺38.90', change: '+0.85%', isPositive: true, logo: 'https://logo.clearbit.com/sasa.com.tr', exchange: 'BIST' },
  { symbol: 'BIMAS', name: 'BİM Mağazalar', price: '₺395.00', change: '+1.50%', isPositive: true, logo: 'https://logo.clearbit.com/bim.com.tr', exchange: 'BIST' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: '$195.40', change: '+0.25%', isPositive: true, logo: 'https://logo.clearbit.com/jpmorganchase.com', exchange: 'NYSE' },
  { symbol: 'V', name: 'Visa Inc.', price: '$275.12', change: '+0.15%', isPositive: true, logo: 'https://logo.clearbit.com/visa.com', exchange: 'NYSE' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: '$60.15', change: '-0.35%', isPositive: false, logo: 'https://logo.clearbit.com/walmart.com', exchange: 'NYSE' },
  { symbol: 'DIS', name: 'Disney', price: '$112.40', change: '+1.20%', isPositive: true, logo: 'https://logo.clearbit.com/disney.com', exchange: 'NYSE' },
  { symbol: 'MC.PA', name: 'LVMH', price: '€825.40', change: '+0.85%', isPositive: true, logo: 'https://logo.clearbit.com/lvmh.com', exchange: 'Euronext' },
  { symbol: 'SAP', name: 'SAP SE', price: '€175.20', change: '+1.10%', isPositive: true, logo: 'https://logo.clearbit.com/sap.com', exchange: 'Xetra' },
  { symbol: '7203.T', name: 'Toyota Motor', price: '¥3,450', change: '+2.15%', isPositive: true, logo: 'https://logo.clearbit.com/toyota.com', exchange: 'TSE' },
  { symbol: 'HSBA.L', name: 'HSBC Holdings', price: '£650.40', change: '-0.25%', isPositive: false, logo: 'https://logo.clearbit.com/hsbc.com', exchange: 'LSE' },
];

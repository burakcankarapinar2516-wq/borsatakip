/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { 
  Newspaper, 
  Search, 
  PieChart, 
  User, 
  Settings, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  Trash2,
  ChevronRight, 
  Star,
  ExternalLink,
  LogOut,
  Fingerprint,
  Globe,
  Bell,
  Moon,
  ShieldCheck,
  ShieldAlert,
  Target,
  CreditCard,
  Info,
  Menu,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from './lib/utils';
import { Screen, NewsItem, Asset, MarketUpdate } from './types';
import { NEWS_ITEMS, TRENDING_ASSETS, WATCHLIST, SEARCHABLE_ASSETS } from './constants';
import { translations, TranslationKey } from './translations';
import { AdvancedChart } from './components/AdvancedChart';

// --- Market Data Context ---

interface PriceAlert {
  symbol: string;
  targetPrice: number;
  type: 'above' | 'below';
  triggered: boolean;
}

interface MarketContextType {
  prices: Record<string, MarketUpdate>;
  alerts: PriceAlert[];
  addAlert: (symbol: string, targetPrice: number, currentPrice: number) => void;
  removeAlert: (index: number) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, MarketUpdate>>({});
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const { showToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'MARKET_UPDATE') {
        const updates: MarketUpdate[] = message.data;
        setPrices(prev => {
          const newPrices = { ...prev };
          updates.forEach(update => {
            newPrices[update.symbol] = update;
          });
          return newPrices;
        });
      }
    };

    return () => ws.close();
  }, []);

  // Check alerts whenever prices change
  useEffect(() => {
    alerts.forEach((alert, index) => {
      if (alert.triggered) return;

      const currentPrice = prices[alert.symbol]?.price;
      if (!currentPrice) return;

      const isTriggered = alert.type === 'above' 
        ? currentPrice >= alert.targetPrice 
        : currentPrice <= alert.targetPrice;

      if (isTriggered) {
        const newAlerts = [...alerts];
        newAlerts[index].triggered = true;
        setAlerts(newAlerts);
        
        showToast(
          t('alert_triggered')
            .replace('{symbol}', alert.symbol)
            .replace('{price}', `$${alert.targetPrice.toLocaleString()}`),
          'success'
        );
      }
    });
  }, [prices, alerts, showToast, t]);

  const addAlert = (symbol: string, targetPrice: number, currentPrice: number) => {
    const type = targetPrice > currentPrice ? 'above' : 'below';
    setAlerts(prev => [...prev, { symbol, targetPrice, type, triggered: false }]);
  };

  const removeAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <MarketContext.Provider value={{ prices, alerts, addAlert, removeAlert }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error('useMarket must be used within a MarketProvider');
  return context;
};

// --- Theme Context ---

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// --- Language Context ---

interface LanguageContextType {
  selectedLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('Turkish (Türkiye)');

  const setLanguage = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const t = (key: TranslationKey): string => {
    const langTranslations = translations[selectedLanguage] || translations['English (US)'];
    return langTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider');
  return context;
};

// --- Toast Context ---

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-[320px] px-4">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3",
                toast.type === 'success' ? "bg-primary/90 text-on-primary border-primary/20" :
                toast.type === 'error' ? "bg-error/90 text-on-error border-error/20" :
                "bg-surface-highest/90 text-on-surface border-outline-variant/20"
              )}
            >
              {toast.type === 'success' && <ShieldCheck size={18} />}
              {toast.type === 'info' && <Info size={18} />}
              {toast.type === 'error' && <Bell size={18} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

// --- Components ---

const BottomNav = ({ currentScreen, setScreen }: { currentScreen: Screen, setScreen: (s: Screen) => void }) => {
  const { t } = useTranslation();
  const navItems = [
    { id: 'portfolio', label: t('portfolio'), icon: PieChart },
    { id: 'search', label: t('search'), icon: Search },
    { id: 'news', label: t('news'), icon: Newspaper },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-surface-high/60 backdrop-blur-xl rounded-t-[2rem] border-t border-outline-variant/15 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1 transition-all duration-300 rounded-xl",
              isActive ? "text-primary bg-surface-bright/50 scale-105" : "text-on-surface/50 hover:text-primary/80"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="font-headline text-[10px] uppercase tracking-widest font-bold mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// --- Screens ---

const NewsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const { t } = useTranslation();
  const categories = ['All', 'Markets', 'Crypto', 'Companies', 'Economy', 'Technology', 'Healthcare', 'Real Estate'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryLabel = (cat: string) => {
    const key = cat.toLowerCase().replace(' ', '_') as TranslationKey;
    return t(key);
  };

  const filteredNews = NEWS_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const topStory = filteredNews.find(item => item.isTopStory) || filteredNews[0];
  const otherNews = filteredNews.filter(item => item.id !== topStory?.id);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pt-20 pb-32 px-6 max-w-5xl mx-auto"
    >
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 h-16 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Menu className="text-primary cursor-pointer" />
          <h1 className="font-headline font-bold text-xl">{t('market_updates')}</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 cursor-pointer" onClick={() => setScreen('profile')}>
          <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="relative mb-6 mt-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search_news') + "..."}
          className="w-full bg-surface-container-lowest border-none rounded-full py-3 pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-medium"
        />
      </div>

      <div className="flex overflow-x-auto gap-3 py-4 no-scrollbar mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-full font-headline text-sm whitespace-nowrap transition-all",
              activeCategory === cat ? "bg-primary text-on-primary font-bold" : "bg-surface-high text-on-surface hover:bg-surface-bright"
            )}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {filteredNews.length > 0 ? (
        <>
          {topStory && (
            <section className="mb-10 group cursor-pointer" onClick={() => setScreen('stock-detail')}>
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-4 shadow-2xl noise-overlay">
                <img src={topStory.image} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest mb-3">{t('top_stories')}</span>
                  <h2 className="font-headline text-2xl md:text-4xl font-extrabold leading-tight mb-2">{topStory.title}</h2>
                  <div className="flex items-center gap-3 text-on-surface-variant text-sm font-medium">
                    <span>{topStory.source}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span>{topStory.time}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-headline text-lg font-bold text-on-surface-variant">{t('latest_headlines')}</h3>
              <div className="h-px flex-1 bg-outline-variant/20" />
            </div>

            {otherNews.map((item) => (
              <article key={item.id} className="flex gap-4 items-start p-4 rounded-2xl bg-surface-low/40 hover:bg-surface-high transition-all border border-outline-variant/5 cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{item.source}</span>
                    <span className="text-[10px] text-on-surface-variant">{item.time}</span>
                  </div>
                  <h4 className="font-headline text-lg font-bold leading-snug">{item.title}</h4>
                </div>
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt="News" className="w-full h-full object-cover" />
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
          <p className="text-on-surface-variant font-medium">{t('no_news_found')}</p>
        </div>
      )}
    </motion.div>
  );
};

const SearchScreen = ({ setScreen, onSelectAsset, watchlist, onToggleWatchlist }: { 
  setScreen: (s: Screen) => void, 
  onSelectAsset: (a: Asset) => void,
  watchlist: Asset[],
  onToggleWatchlist: (a: Asset, lots?: number) => void
}) => {
  const { prices } = useMarket();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Asset[]>([]);
  const recent = ['NVDA', 'AAPL', 'SOL', 'GOOGL'];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      const filtered = SEARCHABLE_ASSETS.filter(asset => 
        asset.symbol.toLowerCase().includes(val.toLowerCase()) || 
        asset.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 pt-4 pb-2 bg-background">
        <div className="flex items-center gap-4">
          <button onClick={() => setScreen('news')} className="text-primary hover:bg-surface-low p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-primary font-headline tracking-tight font-bold text-3xl">{t('search_markets')}</h1>
        </div>
        <button className="text-primary hover:bg-surface-low p-2 rounded-full transition-colors">
          <SlidersHorizontal size={24} />
        </button>
      </header>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
        <input 
          type="text" 
          value={query}
          onChange={handleSearch}
          placeholder={t('search_markets') + "..."}
          className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary transition-all font-medium"
        />
        
        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-surface-highest rounded-2xl shadow-2xl border border-outline-variant/20 z-[60] overflow-hidden"
            >
              {suggestions.map((asset) => (
                <div 
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset)}
                  className="p-4 hover:bg-surface-bright flex items-center justify-between cursor-pointer transition-colors border-b border-outline-variant/10 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-highest flex items-center justify-center overflow-hidden">
                      {asset.logo ? (
                        <img src={asset.logo} alt={asset.symbol} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-primary font-bold text-xs">{asset.symbol[0]}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{asset.symbol}</p>
                        {asset.exchange && (
                          <span className="text-[8px] font-bold bg-surface-high px-1.5 py-0.5 rounded text-on-surface-variant uppercase tracking-tighter">
                            {asset.exchange}
                          </span>
                        )}
                      </div>
                      <p className="text-on-surface-variant text-[10px]">{asset.name}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-on-surface-variant" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{t('recent_searches')}</h2>
          <button className="text-primary text-xs font-semibold">{t('clear_all')}</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {recent.map(r => (
            <div key={r} className="flex-none bg-surface-high hover:bg-surface-bright text-on-surface px-5 py-2 rounded-full border border-outline-variant/15 transition-all cursor-pointer">
              <span className="text-sm font-medium">{r}</span>
            </div>
          ))}
        </div>
      </div>

      <section>
        <h2 className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">{t('trending_assets')}</h2>
        <div className="space-y-4">
          {TRENDING_ASSETS.map((asset) => {
            const liveData = prices[asset.symbol];
            const price = liveData ? `$${liveData.price.toLocaleString()}` : asset.price;
            const change = liveData ? liveData.change : asset.change;
            const isPositive = liveData ? liveData.isPositive : asset.isPositive;
            const isInWatchlist = watchlist.some(a => a.symbol === asset.symbol);

            return (
              <div 
                key={asset.symbol} 
                className="group relative bg-surface-low hover:bg-surface-container p-4 rounded-xl transition-all duration-300 flex items-center justify-between overflow-hidden noise-overlay cursor-pointer"
              >
                <div className="flex items-center gap-4 z-10 flex-1" onClick={() => onSelectAsset(asset)}>
                  <div className="w-12 h-12 bg-surface-highest rounded-full flex items-center justify-center overflow-hidden">
                    {asset.logo ? (
                      <img src={asset.logo} alt={asset.symbol} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="font-headline font-bold text-primary">{asset.symbol[0]}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline font-bold text-lg leading-tight">{asset.symbol}</h3>
                      {asset.exchange && (
                        <span className="text-[9px] font-bold bg-surface-highest px-2 py-0.5 rounded-full text-primary uppercase tracking-widest">
                          {asset.exchange}
                        </span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-xs">{asset.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 z-10">
                  <div className="text-right" onClick={() => onSelectAsset(asset)}>
                    <p className="font-headline font-bold text-on-surface">{price}</p>
                    <p className={cn("text-sm font-semibold", isPositive ? "text-primary" : "text-error")}>{change}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(asset);
                    }}
                    className={cn(
                      "p-2 rounded-full transition-all",
                      isInWatchlist ? "text-primary bg-primary/10" : "text-on-surface-variant hover:bg-surface-high"
                    )}
                  >
                    <Star size={20} fill={isInWatchlist ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">{t('market_sentiment')}</p>
            <h4 className="font-headline font-bold text-2xl mb-1">{t('greed_rising')}</h4>
            <p className="text-on-surface-variant text-sm max-w-[200px]">{t('institutional_buying')}</p>
          </div>
          <TrendingUp className="absolute right-6 top-6 text-primary/30" size={48} />
        </div>
      </section>
    </motion.div>
  );
};

const ProfileScreen = ({ setScreen }: { 
  setScreen: (s: Screen) => void
}) => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { selectedLanguage, t } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const sections = [
    { title: t('account'), items: [
      { label: t('personal_info'), icon: User, onClick: () => showToast(t('personal_info_coming_soon'), 'info') },
      { label: t('security'), icon: ShieldCheck, badge: t('active'), onClick: () => showToast(t('security_settings_coming_soon'), 'info') },
      { label: t('linked_banks'), icon: CreditCard, onClick: () => showToast(t('banking_integration_coming_soon'), 'info') },
      { label: t('privacy_data'), icon: Info, onClick: () => showToast(t('privacy_settings_coming_soon'), 'info') },
    ]},
    { title: t('preferences'), items: [
      { label: t('theme'), icon: Moon, value: theme === 'light' ? t('light_mode') : t('dark_mode'), onClick: toggleTheme },
      { label: t('notifications'), icon: Bell, value: notificationsEnabled ? t('on') : t('off'), onClick: () => {
        setNotificationsEnabled(!notificationsEnabled);
        showToast(t('notifications_turned').replace('{status}', !notificationsEnabled ? t('on') : t('off')), 'success');
      }},
      { label: t('language'), icon: Globe, value: selectedLanguage, onClick: () => setScreen('language') },
    ]}
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto px-6 pt-4 pb-32"
    >
      <header className="flex items-center justify-between py-4 mb-6">
        <button onClick={() => setScreen('portfolio')} className="text-primary hover:bg-surface-low p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-headline font-bold text-lg text-primary">{t('portfolio_executive')}</h1>
        <div className="w-10" /> {/* Spacer to keep title centered */}
      </header>

      <section className="flex flex-col items-center mb-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="relative w-28 h-28 rounded-full border-2 border-primary/30 object-cover" />
          <div className="absolute bottom-1 right-1 bg-primary text-on-primary p-1.5 rounded-full border-4 border-background shadow-xl">
            <Plus size={16} />
          </div>
        </div>
        <h2 className="mt-6 font-headline text-2xl font-extrabold tracking-tight">Emre Yılmaz</h2>
        <div className="mt-1 flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
          <ShieldCheck size={14} className="text-primary" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary">{t('premium_member')}</span>
        </div>
      </section>

      <section className="mb-10 p-8 bg-surface-highest rounded-xl shadow-2xl relative overflow-hidden noise-overlay">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant block mb-2">{t('account_value')}</span>
            <div className="font-headline text-3xl font-extrabold tracking-tighter flex items-baseline gap-1">
              $142,850<span className="text-sm font-medium text-on-surface-variant">.42</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant block mb-2">{t('growth')}</span>
            <div className="text-primary font-bold flex items-center justify-end gap-1">
              <TrendingUp size={18} /> +12.4%
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full transition-all active:scale-95">
            <Plus size={20} /> {t('deposit')}
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-surface-container text-on-surface font-bold rounded-full border border-outline-variant/20 transition-all active:scale-95">
            <Minus size={20} /> {t('withdraw')}
          </button>
        </div>
      </section>

      <div className="space-y-10">
        {sections.map(section => (
          <section key={section.title}>
            <h3 className="text-[10px] font-headline font-bold uppercase tracking-[0.15em] text-on-surface-variant/60 mb-4 px-2">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.label} 
                    onClick={item.onClick}
                    className="flex items-center justify-between p-4 bg-surface-low rounded-xl hover:bg-surface-container transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center group-hover:text-primary transition-colors">
                        <Icon size={20} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">{item.badge}</span>}
                      {item.value && <span className="text-xs font-semibold text-on-surface-variant">{item.value}</span>}
                      <ChevronRight size={20} className="text-on-surface-variant" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <button 
        onClick={() => showToast(t('signed_out_success'), 'success')}
        className="w-full mt-16 py-4 px-6 flex items-center justify-center gap-3 text-error font-bold bg-error/10 rounded-xl border border-error/20 active:scale-95 transition-all"
      >
        <LogOut size={20} /> {t('sign_out')}
      </button>
    </motion.div>
  );
};

const PortfolioScreen = ({ setScreen, watchlist, onRemoveFromWatchlist, onSelectAsset }: { 
  setScreen: (s: Screen) => void,
  watchlist: Asset[],
  onRemoveFromWatchlist: (a: Asset) => void,
  onSelectAsset: (a: Asset) => void
}) => {
  const { prices } = useMarket();
  const { t } = useTranslation();

  const totalValue = useMemo(() => {
    return watchlist.reduce((acc, asset) => {
      const liveData = prices[asset.symbol];
      const currentPrice = liveData ? liveData.price : parseFloat(String(asset.price).replace('$', '').replace(',', ''));
      return acc + (currentPrice * (asset.lots || 0));
    }, 0);
  }, [watchlist, prices]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-6 pt-6 pb-32 space-y-8"
    >
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-highest overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-headline font-bold text-xl">{t('portfolio')}</h1>
        </div>
        <button onClick={() => setScreen('profile')} className="text-primary hover:bg-surface-low p-2 rounded-xl transition-colors">
          <Settings size={24} />
        </button>
      </header>

      <section className="relative overflow-hidden bg-surface-highest rounded-xl p-8 shadow-2xl border-t border-on-surface/5 noise-overlay">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div className="space-y-2">
            <span className="font-headline text-[10px] uppercase tracking-[0.05em] font-semibold text-on-surface-variant">{t('total_value')}</span>
            <div className="text-primary font-headline font-extrabold text-5xl tracking-tighter">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <TrendingUp size={16} />
              <span className="text-lg">+12.4% <span className="text-on-surface-variant font-normal text-sm ml-1">{t('all').toLowerCase()}</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-2xl tracking-tight">{t('watchlist')}</h2>
          <button onClick={() => setScreen('search')} className="text-primary font-headline text-sm font-semibold flex items-center gap-1">
            <Plus size={16} /> {t('search')}
          </button>
        </div>
        <div className="space-y-4">
          {watchlist.length === 0 ? (
            <div className="text-center py-12 bg-surface-low rounded-xl border border-dashed border-outline-variant/30">
              <Star size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
              <p className="text-on-surface-variant font-medium">{t('empty_watchlist')}</p>
              <button 
                onClick={() => setScreen('search')}
                className="mt-4 text-primary font-bold text-sm"
              >
                {t('search')}
              </button>
            </div>
          ) : (
            watchlist.map(asset => {
              const liveData = prices[asset.symbol];
              const price = liveData ? `$${liveData.price.toLocaleString()}` : asset.price;
              const change = liveData ? liveData.change : asset.change;
              const isPositive = liveData ? liveData.isPositive : asset.isPositive;
              const currentPrice = liveData ? liveData.price : parseFloat(String(asset.price).replace('$', '').replace(',', ''));
              const assetTotalValue = currentPrice * (asset.lots || 0);

              return (
                <div 
                  key={asset.symbol} 
                  className="flex items-center justify-between p-5 rounded-xl bg-surface-low hover:bg-surface-container transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1" onClick={() => onSelectAsset(asset)}>
                    <div className="w-12 h-12 flex items-center justify-center bg-surface-highest rounded-full overflow-hidden">
                      {asset.logo ? (
                        <img src={asset.logo} alt={asset.symbol} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="font-bold text-primary">{asset.symbol[0]}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline font-bold text-lg leading-none">{asset.symbol}</h3>
                        {asset.exchange && (
                          <span className="text-[8px] font-bold bg-surface-highest px-1.5 py-0.5 rounded text-primary uppercase tracking-tighter">
                            {asset.exchange}
                          </span>
                        )}
                      </div>
                      <p className="text-on-surface-variant text-sm mt-1">{asset.name}</p>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{asset.lots || 0} LOTS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right" onClick={() => onSelectAsset(asset)}>
                      <p className="font-headline font-bold text-lg">${assetTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{price}</p>
                      <span className={cn(
                        "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1",
                        isPositive ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
                      )}>
                        {change}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(asset);
                      }}
                      className="p-2 text-error hover:bg-error/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Minus size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </motion.div>
  );
};

const StockDetailScreen = ({ setScreen, asset, watchlist, onToggleWatchlist }: { 
  setScreen: (s: Screen) => void,
  asset: Asset | null,
  watchlist: Asset[],
  onToggleWatchlist: (a: Asset, lots?: number) => void
}) => {
  const { prices, alerts, addAlert, removeAlert } = useMarket();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [calculatorModal, setCalculatorModal] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [investment, setInvestment] = useState('1000');
  const [targetPrice, setTargetPrice] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [lotsInput, setLotsInput] = useState('1');
  
  const currencies = [
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'EUR', symbol: '€', rate: 0.92 },
    { code: 'TRY', symbol: '₺', rate: 32.25 },
  ];

  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  const formatPrice = (usdPrice: string | number) => {
    const numericPrice = typeof usdPrice === 'string' 
      ? parseFloat(usdPrice.replace('$', '').replace(',', '')) 
      : usdPrice;
    
    const converted = numericPrice * currentCurrency.rate;
    return `${currentCurrency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const filters = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  const stats = [
    { label: t('market_cap'), value: '$2.89T' },
    { label: t('pe_ratio'), value: '29.41' },
    { label: t('52w_range'), value: '$124 - $199' },
    { label: t('avg_volume'), value: '54.2M' },
    { label: t('div_yield'), value: '0.51%' },
  ];

  // Mock data generation for AdvancedChart
  const chartDataResult = useMemo(() => {
    const data = [];
    const sma20 = [];
    const sma50 = [];
    const rsi = [];
    let price = 150;
    const now = new Date();
    
    let points = 100;
    let interval = 24 * 60 * 60 * 1000; // default 1 day
    
    if (selectedTimeframe === '1D') {
      points = 24;
      interval = 60 * 60 * 1000; // 1 hour
    } else if (selectedTimeframe === '1W') {
      points = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (selectedTimeframe === '1M') {
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (selectedTimeframe === '3M') {
      points = 90;
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else if (selectedTimeframe === '1Y') {
      points = 12;
      interval = 30 * 24 * 60 * 60 * 1000; // ~1 month
    } else if (selectedTimeframe === 'ALL') {
      points = 24;
      interval = 60 * 24 * 60 * 60 * 1000; // ~2 months
    }

    for (let i = points; i >= 0; i--) {
      const date = new Date(now.getTime() - i * interval);
      const time = Math.floor(date.getTime() / 1000);
        
      const open = price + (Math.random() - 0.5) * 5;
      const high = open + Math.random() * 5;
      const low = open - Math.random() * 5;
      const close = (high + low) / 2 + (Math.random() - 0.5) * 2;
      
      data.push({ time, open, high, low, close });
      sma20.push({ time, value: price * 0.98 + (Math.random() - 0.5) * 2 });
      sma50.push({ time, value: price * 0.95 + (Math.random() - 0.5) * 3 });
      rsi.push({ time, value: 30 + Math.random() * 40 });
      
      price = close;
    }
    return { data, sma20, sma50, rsi };
  }, [selectedTimeframe]);

  const marketCapData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    if (selectedTimeframe === '1D') {
      return Array.from({ length: 12 }, (_, i) => ({
        label: `${i * 2}:00`,
        cap: 2.5 + Math.random() * 0.5
      }));
    }
    if (selectedTimeframe === '1W') {
      return days.map(day => ({
        label: day,
        cap: 2.6 + Math.random() * 0.4
      }));
    }
    if (selectedTimeframe === '1M') {
      return Array.from({ length: 4 }, (_, i) => ({
        label: `Week ${i + 1}`,
        cap: 2.7 + Math.random() * 0.3
      }));
    }
    // Default for 1Y, ALL, 3M
    return months.map(month => ({
      label: month,
      cap: 2.1 + Math.random() * 0.9
    }));
  }, [selectedTimeframe]);

  const { data: chartData, sma20: sma20Data, sma50: sma50Data, rsi: rsiData } = chartDataResult;

  if (!asset) return null;

  const liveData = prices[asset.symbol];
  const usdPrice = liveData ? liveData.price : parseFloat(String(asset.price).replace('$', '').replace(',', ''));
  const price = formatPrice(usdPrice);
  const change = liveData ? liveData.change : asset.change;
  const isPositive = liveData ? liveData.isPositive : asset.isPositive;
  const isInWatchlist = watchlist.some(a => a.symbol === asset.symbol);

  // Profit Calculation Logic
  const calculatePotentialProfit = () => {
    const inv = parseFloat(investment) || 0;
    const target = parseFloat(targetPrice) || 0;
    if (inv <= 0 || target <= 0) return 0;
    
    const currentPriceInSelectedCurrency = usdPrice * currentCurrency.rate;
    const units = inv / currentPriceInSelectedCurrency;
    const finalValue = units * target;
    return finalValue - inv;
  };

  const potentialProfit = calculatePotentialProfit();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }}
      className="pt-20 pb-32 px-4 md:px-8 max-w-6xl mx-auto space-y-8"
    >
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-background">
        <div className="flex items-center gap-4">
          <button onClick={() => setScreen('portfolio')} className="text-primary hover:bg-surface-low p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-highest flex items-center justify-center overflow-hidden">
            {asset.logo ? (
              <img src={asset.logo} alt={asset.symbol} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
            ) : (
              <span className="font-headline text-xs font-bold text-primary">{asset.symbol[0]}</span>
            )}
          </div>
          <span className="font-headline text-lg font-bold tracking-tight text-primary">{asset.symbol} • {asset.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container rounded-full p-1 mr-2">
            {currencies.map(c => (
              <button 
                key={c.code}
                onClick={() => setSelectedCurrency(c.code)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold transition-all",
                  selectedCurrency === c.code ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {c.code}
              </button>
            ))}
          </div>
          <button 
            onClick={() => onToggleWatchlist(asset)}
            className={cn(
              "p-2 rounded-full transition-all",
              isInWatchlist ? "text-primary bg-primary/10" : "text-on-surface-variant hover:bg-surface-high"
            )}
          >
            <Star size={24} fill={isInWatchlist ? "currentColor" : "none"} />
          </button>
          <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-8 h-8 rounded-full border border-outline-variant/20" />
        </div>
      </header>

      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter mb-2">{asset.name}</h1>
          <div className="flex items-center gap-3">
            {asset.exchange && (
              <span className="bg-surface-high px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                {asset.exchange}
              </span>
            )}
            <span className="text-on-surface-variant text-sm font-medium">Technology • Cupertino, CA</span>
          </div>
        </div>
        <div className="text-right flex flex-col items-start md:items-end">
          <span className="font-headline text-5xl font-black tracking-tighter">{price}</span>
          <div className="flex items-center gap-2 mt-1">
            {isPositive ? <TrendingUp size={20} className="text-primary" /> : <TrendingDown size={20} className="text-error" />}
            <span className={cn("font-bold text-lg", isPositive ? "text-primary" : "text-error")}>{change}</span>
            <span className="text-on-surface-variant text-sm ml-2">{t('today')}</span>
          </div>
        </div>
      </section>

      <section className="bg-surface-low rounded-xl p-6 relative noise-overlay overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-xl font-bold tracking-tight">{t('price_chart')}</h3>
          <div className="flex gap-1 bg-surface-container-lowest p-1 rounded-full">
            {filters.map(f => (
              <button 
                key={f} 
                onClick={() => setSelectedTimeframe(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                  selectedTimeframe === f ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full relative">
          <AdvancedChart 
            data={chartData} 
            sma20Data={sma20Data} 
            sma50Data={sma50Data} 
            rsiData={rsiData}
            isPositive={isPositive}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-surface-container rounded-xl p-5 border-l-2 border-primary/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-2">{s.label}</p>
            <p className="font-headline text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="bg-surface-low rounded-xl p-6 shadow-2xl border border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-xl font-bold tracking-tight">{t('market_cap_history')}</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t('values_in_trillions')}</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketCapData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.1} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 600 }}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: 'var(--surface-highest)', opacity: 0.1 }}
                contentStyle={{ 
                  backgroundColor: 'var(--surface-highest)', 
                  border: '1px solid var(--outline-variant)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
                itemStyle={{ color: 'var(--primary)' }}
              />
              <Bar dataKey="cap" radius={[4, 4, 0, 0]}>
                {marketCapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === marketCapData.length - 1 ? 'var(--primary)' : 'var(--primary-container)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-surface-highest rounded-3xl p-8 shadow-2xl relative overflow-hidden noise-overlay border border-outline-variant/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-headline text-2xl font-black tracking-tight mb-1">{t('profit_calculator')}</h3>
            <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">{t('simulate_gains')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{t('current_price')}</p>
            <p className="font-headline font-bold text-primary text-xl">{price}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 relative z-10">
          <button 
            onClick={() => {
              onToggleWatchlist(asset);
              showToast(isInWatchlist ? t('removed_from_tracker').replace('{symbol}', asset.symbol) : t('added_to_tracker').replace('{symbol}', asset.symbol), 'success');
            }}
            className={cn(
              "group relative py-6 rounded-2xl border-2 font-headline font-bold overflow-hidden transition-all active:scale-95",
              isInWatchlist ? "border-error/20 text-error hover:border-error/40" : "border-primary/20 text-primary hover:border-primary/40"
            )}
          >
            <div className={cn(
              "absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300",
              isInWatchlist ? "bg-error/5" : "bg-primary/5"
            )} />
            <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
              {isInWatchlist ? <Minus size={24} /> : <Plus size={24} />} {t('add_to_tracker')}
            </span>
          </button>
          <button 
            onClick={() => setCalculatorModal({ isOpen: true })}
            className="group relative py-6 rounded-2xl bg-primary text-on-primary font-headline font-bold shadow-2xl shadow-primary/20 overflow-hidden transition-all hover:shadow-primary/40 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
              <PieChart size={24} /> {t('calculate')}
            </span>
          </button>
        </div>
      </section>

      <section className="bg-surface-highest rounded-3xl p-8 shadow-2xl relative overflow-hidden noise-overlay border border-outline-variant/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-headline text-2xl font-black tracking-tight mb-1">{t('price_targets')}</h3>
            <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">{t('monitor_price_levels')}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <ShieldCheck size={24} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 ml-2">
              <ShieldAlert size={14} className="text-error" />
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t('entry_price')}</label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-error font-bold">{currentCurrency.symbol}</span>
              <input 
                type="number" 
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="0.00"
                className="w-full bg-surface-low border-2 border-error/10 rounded-2xl py-4 pl-10 pr-4 font-headline font-bold focus:border-error/30 focus:outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 ml-2">
              <Target size={14} className="text-primary" />
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t('exit_price')}</label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">{currentCurrency.symbol}</span>
              <input 
                type="number" 
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="0.00"
                className="w-full bg-surface-low border-2 border-primary/10 rounded-2xl py-4 pl-10 pr-4 font-headline font-bold focus:border-primary/30 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            if (!stopLoss && !takeProfit) {
              showToast(t('enter_price_point'), 'error');
              return;
            }
            showToast(`${t('price_targets')} set for ${asset.symbol}`, 'success');
          }}
          className="w-full mt-8 py-4 bg-surface-bright text-on-surface font-headline font-bold rounded-2xl border border-outline-variant/20 hover:bg-surface-container transition-all active:scale-[0.98]"
        >
          {t('set_targets')}
        </button>
      </section>

      <section className="bg-surface-highest rounded-3xl p-8 shadow-2xl relative overflow-hidden noise-overlay border border-outline-variant/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-headline text-2xl font-black tracking-tight mb-1">{t('price_alerts')}</h3>
            <p className="text-on-surface-variant text-xs font-medium uppercase tracking-widest">{t('get_notified_target')}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Bell size={24} />
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">{currentCurrency.symbol}</span>
              <input 
                type="number" 
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                placeholder={t('target_price')}
                className="w-full bg-surface-low border-2 border-outline-variant/10 rounded-2xl py-4 pl-10 pr-4 font-headline font-bold focus:border-primary/30 focus:outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => {
                if (!alertPrice) {
                  showToast(t('enter_target_price'), 'error');
                  return;
                }
                const target = parseFloat(alertPrice) / currentCurrency.rate;
                addAlert(asset.symbol, target, usdPrice);
                showToast(
                  t('alert_set_success')
                    .replace('{symbol}', asset.symbol)
                    .replace('{price}', formatPrice(target)), 
                  'success'
                );
                setAlertPrice('');
              }}
              className="px-8 bg-primary text-on-primary font-headline font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
            >
              {t('set_alert')}
            </button>
          </div>

          <div className="space-y-3">
            {alerts.filter(a => a.symbol === asset.symbol).map((alert, i) => (
              <div key={i} className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all",
                alert.triggered ? "bg-surface-container-highest border-outline-variant/20 opacity-60" : "bg-surface-low border-primary/10"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    alert.triggered ? "bg-on-surface-variant/10 text-on-surface-variant" : "bg-primary/10 text-primary"
                  )}>
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="font-headline font-bold">
                      {alert.type === 'above' ? t('above') : t('below')} {formatPrice(alert.targetPrice)}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      {alert.triggered ? t('triggered') : t('active')}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => removeAlert(alerts.indexOf(alert))}
                  className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-2xl border-t border-outline-variant/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          {!isInWatchlist && (
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">{t('lots')}</label>
              <input 
                type="number" 
                value={lotsInput}
                onChange={(e) => setLotsInput(e.target.value)}
                className="w-full bg-surface-highest border-none rounded-full py-3 px-6 font-headline font-bold text-center focus:ring-1 focus:ring-primary"
                placeholder="1"
              />
            </div>
          )}
          <button 
            onClick={() => setCalculatorModal({ isOpen: true })}
            className={cn(
              "py-4 rounded-full border-2 border-outline-variant font-headline font-bold hover:bg-surface-high transition-all",
              isInWatchlist ? "flex-1" : "px-8"
            )}
          >
            {t('calculate')}
          </button>
          <button 
            onClick={() => {
              onToggleWatchlist(asset, parseFloat(lotsInput) || 1);
              showToast(isInWatchlist ? t('removed_from_tracker').replace('{symbol}', asset.symbol) : t('added_to_tracker').replace('{symbol}', asset.symbol), 'success');
            }}
            className="flex-[2] py-4 rounded-full bg-gradient-to-r from-primary to-primary-container font-headline font-bold text-on-primary shadow-lg transition-all active:scale-95"
          >
            {isInWatchlist ? t('remove_from_tracker') : t('add_to_tracker')}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {calculatorModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCalculatorModal({ isOpen: false })}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-highest rounded-[2.5rem] p-8 shadow-2xl border border-outline-variant/20 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-container" />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-headline text-3xl font-black tracking-tight">
                    {t('profit_calculator')}
                  </h3>
                  <p className="text-on-surface-variant text-sm font-medium mt-1">{asset.symbol} • {asset.name}</p>
                </div>
                <button 
                  onClick={() => setCalculatorModal({ isOpen: false })}
                  className="p-2 hover:bg-surface-low rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-surface-low p-6 rounded-2xl border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Current Price</span>
                    <span className="font-headline font-bold text-lg">{price}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t('investment_amount')}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">{currentCurrency.symbol}</span>
                        <input 
                          type="number" 
                          value={investment}
                          onChange={(e) => setInvestment(e.target.value)}
                          className="w-full bg-surface-highest border-none rounded-xl py-3 pl-10 pr-4 font-headline font-bold text-lg focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t('target_price')}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">{currentCurrency.symbol}</span>
                        <input 
                          type="number" 
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          placeholder={t('enter_target_price_placeholder')}
                          className="w-full bg-surface-highest border-none rounded-xl py-3 pl-10 pr-4 font-headline font-bold text-lg focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-on-surface-variant">{t('potential_profit')}</span>
                    <span className={cn(
                      "font-headline text-2xl font-black",
                      potentialProfit >= 0 ? "text-primary" : "text-error"
                    )}>
                      {currentCurrency.symbol}{potentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-medium text-on-surface-variant">{t('roi')}</span>
                    <span className={cn(
                      "text-sm font-bold",
                      potentialProfit >= 0 ? "text-primary" : "text-error"
                    )}>
                      {((potentialProfit / (parseFloat(investment) || 1)) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setCalculatorModal({ isOpen: false })}
                  className="w-full py-5 rounded-2xl bg-primary text-on-primary font-headline font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                  {t('done')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LanguageScreen = ({ setScreen }: { 
  setScreen: (s: Screen) => void
}) => {
  const { showToast } = useToast();
  const { selectedLanguage, setLanguage, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const languages = [
    { name: 'English (US)', sub: 'Default' },
    { name: 'Turkish (Türkiye)', sub: 'Türkçe' },
    { name: 'German (Deutsch)' },
    { name: 'French (Français)' },
    { name: 'Spanish (Español)' },
    { name: 'Chinese (简体中文)' },
    { name: 'Arabic (العربية)' },
    { name: 'Japanese (日本語)' },
  ];

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (lang.sub && lang.sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (name: string) => {
    setLanguage(name);
    showToast(t('language_changed').replace('{name}', name));
    setTimeout(() => setScreen('profile'), 500);
  };

  const suggested = filteredLanguages.slice(0, 2);
  const others = filteredLanguages.slice(2);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 px-6 pt-20 pb-32 max-w-2xl mx-auto w-full"
    >
      <header className="fixed top-0 left-0 w-full z-50 bg-background flex items-center px-6 py-4">
        <button onClick={() => setScreen('profile')} className="text-primary hover:bg-surface-low p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-headline text-lg font-bold ml-4">{t('language')}</h1>
      </header>

      <div className="mb-8 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_language') + "..."}
            className="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="space-y-8">
        {suggested.length > 0 && (
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4 block">{t('suggested').toUpperCase()}</label>
            <div className="space-y-3">
              {suggested.map(lang => {
                const isActive = selectedLanguage === lang.name;
                return (
                  <div 
                    key={lang.name} 
                    onClick={() => handleSelect(lang.name)}
                    className={cn(
                      "noise-texture p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer",
                      isActive ? "bg-surface-bright border border-primary/30 shadow-lg" : "bg-surface-container-high hover:bg-surface-bright"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center font-bold text-primary">
                        {lang.name[0]}
                      </div>
                      <div>
                        <p className="font-headline font-bold">{lang.name}</p>
                        {lang.sub && <p className={cn("text-xs", isActive ? "text-primary" : "text-on-surface-variant")}>{lang.sub}</p>}
                      </div>
                    </div>
                    {isActive && <ShieldCheck className="text-primary" size={24} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4 block">{t('others').toUpperCase()}</label>
            <div className="space-y-3">
              {others.map(lang => {
                const isActive = selectedLanguage === lang.name;
                return (
                  <div 
                    key={lang.name} 
                    onClick={() => handleSelect(lang.name)}
                    className={cn(
                      "noise-texture p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer",
                      isActive ? "bg-surface-bright border border-primary/30 shadow-lg" : "bg-surface-container-high hover:bg-surface-bright"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center font-bold text-primary">
                        {lang.name[0]}
                      </div>
                      <div>
                        <p className="font-headline font-bold">{lang.name}</p>
                        {isActive && <p className="text-xs text-primary">Active</p>}
                      </div>
                    </div>
                    {isActive && <ShieldCheck className="text-primary" size={24} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {filteredLanguages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-on-surface-variant">No languages found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [currentScreen, setScreen] = useState<Screen>('portfolio');
  const [watchlist, setWatchlist] = useState<Asset[]>(WATCHLIST);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const toggleWatchlist = (asset: Asset, lots?: number) => {
    setWatchlist(prev => {
      const exists = prev.find(a => a.symbol === asset.symbol);
      if (exists) {
        return prev.filter(a => a.symbol !== asset.symbol);
      }
      return [...prev, { ...asset, lots: lots || 1 }];
    });
  };

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setScreen('stock-detail');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'news': return <NewsScreen setScreen={setScreen} />;
      case 'search': return <SearchScreen setScreen={setScreen} onSelectAsset={handleSelectAsset} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />;
      case 'profile': return <ProfileScreen setScreen={setScreen} />;
      case 'portfolio': return <PortfolioScreen setScreen={setScreen} watchlist={watchlist} onRemoveFromWatchlist={toggleWatchlist} onSelectAsset={handleSelectAsset} />;
      case 'stock-detail': return <StockDetailScreen setScreen={setScreen} asset={selectedAsset} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />;
      case 'language': return <LanguageScreen setScreen={setScreen} />;
      default: return <NewsScreen setScreen={setScreen} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <MarketProvider>
            <div className="min-h-screen bg-background text-on-surface overflow-x-hidden transition-colors duration-300">
              <AnimatePresence mode="wait">
                {renderScreen()}
              </AnimatePresence>
              
              {['news', 'search', 'portfolio', 'profile'].includes(currentScreen) && (
                <BottomNav currentScreen={currentScreen} setScreen={setScreen} />
              )}
            </div>
          </MarketProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

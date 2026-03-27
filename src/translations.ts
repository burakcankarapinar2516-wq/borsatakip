export type TranslationKey = 
  | 'news' 
  | 'search' 
  | 'portfolio' 
  | 'profile' 
  | 'search_markets' 
  | 'recent_searches' 
  | 'trending_assets' 
  | 'market_sentiment' 
  | 'greed_rising' 
  | 'institutional_buying' 
  | 'clear_all' 
  | 'sell' 
  | 'buy' 
  | 'market_cap_history' 
  | 'values_in_trillions' 
  | 'language' 
  | 'theme' 
  | 'notifications' 
  | 'account' 
  | 'preferences' 
  | 'personal_info' 
  | 'security' 
  | 'linked_banks' 
  | 'privacy_data' 
  | 'sign_out'
  | 'top_stories'
  | 'market_updates'
  | 'all'
  | 'markets'
  | 'economy'
  | 'companies'
  | 'crypto'
  | 'technology'
  | 'healthcare'
  | 'real_estate'
  | 'watchlist'
  | 'empty_watchlist'
  | 'total_value'
  | 'tracked_assets'
  | 'today_change'
  | 'latest_headlines'
  | 'forex'
  | 'search_news'
  | 'no_news_found'
  | 'price_alerts'
  | 'set_alert'
  | 'alert_set_success'
  | 'alert_triggered'
  | 'profit_calculator'
  | 'investment_amount'
  | 'target_price'
  | 'potential_profit'
  | 'calculate'
  | 'add_to_tracker'
  | 'price_targets'
  | 'set_targets'
  | 'entry_price'
  | 'exit_price'
  | 'profit_loss'
  | 'today'
  | 'market_cap'
  | 'pe_ratio'
  | '52w_range'
  | 'avg_volume'
  | 'div_yield'
  | 'simulate_gains'
  | 'current_price'
  | 'removed_from_tracker'
  | 'added_to_tracker'
  | 'monitor_price_levels'
  | 'enter_price_point'
  | 'get_notified_target'
  | 'enter_target_price'
  | 'above'
  | 'below'
  | 'triggered'
  | 'active'
  | 'remove_from_tracker'
  | 'done'
  | 'roi'
  | 'enter_target_price_placeholder'
  | 'account_value'
  | 'growth'
  | 'deposit'
  | 'withdraw'
  | 'premium_member'
  | 'personal_info_coming_soon'
  | 'security_settings_coming_soon'
  | 'banking_integration_coming_soon'
  | 'privacy_settings_coming_soon'
  | 'light_mode'
  | 'dark_mode'
  | 'on'
  | 'off'
  | 'notifications_turned'
  | 'portfolio_executive'
  | 'signed_out_success'
  | 'price_chart'
  | 'lots'
  | 'search_language'
  | 'suggested'
  | 'others'
  | 'language_changed';

export const translations: Record<string, Record<TranslationKey, string>> = {
  'English (US)': {
    news: 'News',
    search: 'Search',
    portfolio: 'Portfolio',
    profile: 'Profile',
    search_markets: 'Search Markets',
    recent_searches: 'Recent Searches',
    trending_assets: 'Trending Assets',
    market_sentiment: 'Market Sentiment',
    greed_rising: 'Greed is rising.',
    institutional_buying: 'Institutional buying in Tech sector has reached a 4-month high.',
    clear_all: 'Clear All',
    sell: 'Calculate Profit',
    buy: 'Add to Tracker',
    market_cap_history: 'Market Cap History (1Y)',
    values_in_trillions: 'Values in Trillions ($)',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    account: 'Account',
    preferences: 'Preferences',
    personal_info: 'Personal Info',
    security: 'Security (2FA)',
    linked_banks: 'Linked Banks',
    privacy_data: 'Privacy & Data',
    sign_out: 'Sign Out',
    top_stories: 'Top Stories',
    market_updates: 'Market Updates',
    all: 'All',
    markets: 'Markets',
    economy: 'Economy',
    companies: 'Companies',
    crypto: 'Crypto',
    technology: 'Technology',
    healthcare: 'Healthcare',
    real_estate: 'Real Estate',
    watchlist: 'Watchlist',
    empty_watchlist: 'Your watchlist is empty. Start adding assets to track them!',
    total_value: 'Total Value',
    tracked_assets: 'Tracked Assets',
    today_change: 'Today\'s Change',
    latest_headlines: 'Latest Headlines',
    forex: 'Forex',
    search_news: 'Search News',
    no_news_found: 'No news found matching your search.',
    price_alerts: 'Price Alerts',
    set_alert: 'Set Alert',
    alert_set_success: 'Price alert set for {symbol} at {price}',
    alert_triggered: 'PRICE ALERT: {symbol} has reached {price}!',
    profit_calculator: 'Profit Calculator',
    investment_amount: 'Investment Amount',
    target_price: 'Target Price',
    potential_profit: 'Potential Profit',
    calculate: 'Calculate',
    add_to_tracker: 'Add to Tracker',
    price_targets: 'Price Targets',
    set_targets: 'Set Targets',
    entry_price: 'Entry Price',
    exit_price: 'Exit Price',
    profit_loss: 'Profit / Loss',
    today: 'Today',
    market_cap: 'Market Cap',
    pe_ratio: 'P/E Ratio',
    '52w_range': '52W Range',
    avg_volume: 'Avg Volume',
    div_yield: 'Div Yield',
    simulate_gains: 'Simulate potential gains',
    current_price: 'Current Price',
    removed_from_tracker: 'Removed {symbol} from tracker',
    added_to_tracker: 'Added {symbol} to tracker',
    monitor_price_levels: 'Monitor key price levels',
    enter_price_point: 'Please enter at least one price point',
    get_notified_target: 'Get notified when price hits your target',
    enter_target_price: 'Please enter a target price',
    above: 'Above',
    below: 'Below',
    triggered: 'Triggered',
    active: 'Active',
    remove_from_tracker: 'Remove from Tracker',
    done: 'Done',
    roi: 'Return on Investment',
    enter_target_price_placeholder: 'Enter target price',
    account_value: 'Account Value',
    growth: 'Growth',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    premium_member: 'Premium Member',
    personal_info_coming_soon: 'Personal Info coming soon',
    security_settings_coming_soon: 'Security settings coming soon',
    banking_integration_coming_soon: 'Banking integration coming soon',
    privacy_settings_coming_soon: 'Privacy settings coming soon',
    light_mode: 'Light Mode',
    dark_mode: 'Dark Mode',
    on: 'On',
    off: 'Off',
    notifications_turned: 'Notifications turned {status}',
    portfolio_executive: 'Portfolio Executive',
    signed_out_success: 'Signed out successfully',
    price_chart: 'Price Chart',
    lots: 'Lots',
    search_language: 'Search language',
    suggested: 'Suggested',
    others: 'Others',
    language_changed: 'Language changed to {name}'
  },
  'Turkish (Türkiye)': {
    news: 'Haberler',
    search: 'Ara',
    portfolio: 'Portföy',
    profile: 'Profil',
    search_markets: 'Piyasalarda Ara',
    recent_searches: 'Son Aramalar',
    trending_assets: 'Trend Varlıklar',
    market_sentiment: 'Piyasa Duyarlılığı',
    greed_rising: 'Açgözlülük artıyor.',
    institutional_buying: 'Teknoloji sektöründeki kurumsal alımlar 4 ayın en yüksek seviyesine ulaştı.',
    clear_all: 'Hepsini Temizle',
    sell: 'Kazanç Hesapla',
    buy: 'Takibe Ekle',
    market_cap_history: 'Piyasa Değeri Geçmişi (1Y)',
    values_in_trillions: 'Trilyon Dolar Cinsinden Değerler ($)',
    language: 'Dil',
    theme: 'Tema',
    notifications: 'Bildirimler',
    account: 'Hesap',
    preferences: 'Tercihler',
    personal_info: 'Kişisel Bilgiler',
    security: 'Güvenlik (2FA)',
    linked_banks: 'Bağlı Bankalar',
    privacy_data: 'Gizlilik ve Veri',
    sign_out: 'Çıkış Yap',
    top_stories: 'Öne Çıkanlar',
    market_updates: 'Piyasa Güncellemeleri',
    all: 'Hepsi',
    markets: 'Piyasalar',
    economy: 'Ekonomi',
    companies: 'Şirketler',
    crypto: 'Kripto',
    technology: 'Teknoloji',
    healthcare: 'Sağlık',
    real_estate: 'Emlak',
    watchlist: 'İzleme Listesi',
    empty_watchlist: 'İzleme listeniz boş. Takip etmek için varlık eklemeye başlayın!',
    total_value: 'Toplam Değer',
    tracked_assets: 'Takip Edilen Varlıklar',
    today_change: 'Bugünkü Değişim',
    latest_headlines: 'Son Başlıklar',
    forex: 'Döviz',
    search_news: 'Haberlerde Ara',
    no_news_found: 'Aramanızla eşleşen haber bulunamadı.',
    price_alerts: 'Fiyat Alarmları',
    set_alert: 'Alarm Kur',
    alert_set_success: '{symbol} için {price} seviyesinde alarm kuruldu',
    alert_triggered: 'FİYAT ALARMI: {symbol} {price} seviyesine ulaştı!',
    profit_calculator: 'Kazanç Hesaplayıcı',
    investment_amount: 'Yatırım Tutarı',
    target_price: 'Hedef Fiyat',
    potential_profit: 'Potansiyel Kazanç',
    calculate: 'Hesapla',
    add_to_tracker: 'Takibe Ekle',
    price_targets: 'Fiyat Hedefleri',
    set_targets: 'Hedefleri Belirle',
    entry_price: 'Giriş Fiyatı',
    exit_price: 'Çıkış Fiyatı',
    profit_loss: 'Kar / Zarar',
    today: 'Bugün',
    market_cap: 'Piyasa Değeri',
    pe_ratio: 'F/K Oranı',
    '52w_range': '52 Haftalık Aralık',
    avg_volume: 'Ort. Hacim',
    div_yield: 'Temettü Verimi',
    simulate_gains: 'Potansiyel kazançları simüle edin',
    current_price: 'Güncel Fiyat',
    removed_from_tracker: '{symbol} takipten çıkarıldı',
    added_to_tracker: '{symbol} takibe eklendi',
    monitor_price_levels: 'Kritik fiyat seviyelerini izleyin',
    enter_price_point: 'Lütfen en az bir fiyat noktası girin',
    get_notified_target: 'Fiyat hedefinize ulaştığında bildirim alın',
    enter_target_price: 'Lütfen bir hedef fiyat girin',
    above: 'Üstünde',
    below: 'Altında',
    triggered: 'Tetiklendi',
    active: 'Aktif',
    remove_from_tracker: 'Takipten Çıkar',
    done: 'Tamam',
    roi: 'Yatırım Getirisi',
    enter_target_price_placeholder: 'Hedef fiyat girin',
    account_value: 'Hesap Değeri',
    growth: 'Büyüme',
    deposit: 'Yatır',
    withdraw: 'Çek',
    premium_member: 'Premium Üye',
    personal_info_coming_soon: 'Kişisel Bilgiler yakında eklenecek',
    security_settings_coming_soon: 'Güvenlik ayarları yakında eklenecek',
    banking_integration_coming_soon: 'Banka entegrasyonu yakında eklenecek',
    privacy_settings_coming_soon: 'Gizlilik ayarları yakında eklenecek',
    light_mode: 'Açık Mod',
    dark_mode: 'Karanlık Mod',
    on: 'Açık',
    off: 'Kapalı',
    notifications_turned: 'Bildirimler {status} duruma getirildi',
    portfolio_executive: 'Portföy Yöneticisi',
    signed_out_success: 'Başarıyla çıkış yapıldı',
    price_chart: 'Fiyat Grafiği',
    lots: 'Lot Sayısı',
    search_language: 'Dil ara',
    suggested: 'Önerilenler',
    others: 'Diğerleri',
    language_changed: 'Dil {name} olarak değiştirildi'
  }
};

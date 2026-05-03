import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { useState, useMemo } from 'react';
import { Search, Filter as FilterIcon, X, Star, ThumbsUp, MessageCircle, Sparkles, TrendingUp, Award, Eye } from 'lucide-react';
import { FilterPanel } from '../components/filter-panel';
import { SortDropdown } from '../components/sort-dropdown';
import { LayoutSwitcher, LayoutType } from '../components/layout-switcher';
import { Link } from 'react-router';
import { useContentControls } from '../hooks/use-content-controls';
import { motion } from 'motion/react';

// Expanded mock review data
const allReviews = [
  { id: 1, title: 'اینترستلار', titleEn: 'Interstellar', reviewer: 'علی احمدی', rating: 9.5, likes: 124, comments: 18, year: 2014, time: '۲ روز پیش', content: 'شاهکار کریستوفر نولان. ترکیبی بی‌نظیر از علم، احساسات انسانی و بصری خیره‌کننده.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'علمی-تخیلی', featured: true, trending: 150 },
  { id: 2, title: 'گادفادر', titleEn: 'The Godfather', reviewer: 'سارا محمدی', rating: 9.8, likes: 287, comments: 42, year: 1972, time: '۱ روز پیش', content: 'بدون شک یکی از بهترین فیلم‌های تاریخ سینما. شاهکار کاپولا.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'جنایی، درام', featured: true, trending: 280 },
  { id: 3, title: 'دارک نایت', titleEn: 'The Dark Knight', reviewer: 'محمد رضایی', rating: 9.2, likes: 196, comments: 31, year: 2008, time: '۳ روز پیش', content: 'هیث لجر فوق‌العاده بود. بهترین فیلم ابرقهرمانی تاریخ.', poster: '/assets/movies/movie-1.svg', type: 'user', genre: 'اکشن', trending: 220 },
  { id: 4, title: 'شاوشنک', titleEn: 'Shawshank Redemption', reviewer: 'فاطمه کریمی', rating: 9.9, likes: 412, comments: 67, year: 1994, time: '۴ روز پیش', content: 'داستان امید و دوستی. نمی‌توان این فیلم را نبینید و نگریید.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'درام', featured: true, trending: 350 },
  { id: 5, title: 'پالپ فیکشن', titleEn: 'Pulp Fiction', reviewer: 'رضا نوری', rating: 8.7, likes: 143, comments: 22, year: 1994, time: '۵ روز پیش', content: 'تارانتینو در بهترین حالتش. دیالوگ‌ها خارق‌العاده‌اند.', poster: '/assets/movies/movie-1.svg', type: 'user', genre: 'جنایی', trending: 120 },
  { id: 6, title: 'ماتریکس', titleEn: 'The Matrix', reviewer: 'زهرا حسینی', rating: 9.1, likes: 233, comments: 38, year: 1999, time: '۱ هفته پیش', content: 'انقلاب در سینمای اکشن و علمی-تخیلی. جلوه‌های ویژه تاریخ‌ساز.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'علمی-تخیلی، اکشن', featured: true, trending: 190 },
  { id: 7, title: 'لیست شیندلر', titleEn: "Schindler's List", reviewer: 'امین صادقی', rating: 9.4, likes: 321, comments: 51, year: 1993, time: '۲ هفته پیش', content: 'شاهکار اسپیلبرگ. فیلمی که باید دید و به یاد آورد.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'تاریخی، درام', featured: true, trending: 145 },
  { id: 8, title: 'باشگاه مشت‌زنی', titleEn: 'Fight Club', reviewer: 'مریم امیری', rating: 8.9, likes: 178, comments: 29, year: 1999, time: '۳ هفته پیش', content: 'فیلمی که هر بار می‌بینیش چیز جدیدی کشف می‌کنی.', poster: '/assets/movies/movie-1.svg', type: 'user', genre: 'درام', trending: 165 },
  { id: 9, title: 'فارست گامپ', titleEn: 'Forrest Gump', reviewer: 'حسن عباسی', rating: 9.0, likes: 267, comments: 44, year: 1994, time: '۱ ماه پیش', content: 'تام هنکس فوق‌العاده. فیلمی احساسی و الهام‌بخش.', poster: '/assets/movies/movie-1.svg', type: 'user', genre: 'درام', trending: 210 },
  { id: 10, title: 'شروع', titleEn: 'Inception', reviewer: 'نگار فرهادی', rating: 9.3, likes: 298, comments: 47, year: 2010, time: '۲ ماه پیش', content: 'نولان دوباره ذهن ما را به چالش می‌کشد. بصری خیره‌کننده.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'علمی-تخیلی', trending: 240 },
  { id: 11, title: 'بریکینگ بد', titleEn: 'Breaking Bad', reviewer: 'کیوان موسوی', rating: 9.7, likes: 356, comments: 63, year: 2008, time: '۳ ماه پیش', content: 'بهترین سریال تاریخ. والتر وایت نماد تحول شخصیت.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'جنایی، درام', featured: true, trending: 410 },
  { id: 12, title: 'جوکر', titleEn: 'Joker', reviewer: 'لیلا احمدی', rating: 8.8, likes: 189, comments: 34, year: 2019, time: '۴ ماه پیش', content: 'خواکین فینیکس استثنایی بود. فیلمی تلخ و تکان‌دهنده.', poster: '/assets/movies/movie-1.svg', type: 'user', genre: 'درام', trending: 175 },
  { id: 13, title: 'پارازیت', titleEn: 'Parasite', reviewer: 'سعید رحمانی', rating: 9.2, likes: 276, comments: 48, year: 2019, time: '۵ ماه پیش', content: 'سینمای کره در اوج. نقد اجتماعی هوشمندانه.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'درام', featured: true, trending: 290 },
  { id: 14, title: 'گلادیاتور', titleEn: 'Gladiator', reviewer: 'پریسا جعفری', rating: 8.6, likes: 154, comments: 26, year: 2000, time: '۶ ماه پیش', content: 'راسل کرو عالی. حماسه‌ای زیبا در روم باستان.', poster: '/assets/movies/movie-1.svg', type: 'user', genre: 'اکشن، درام', trending: 130 },
  { id: 15, title: 'اوپنهایمر', titleEn: 'Oppenheimer', reviewer: 'آرش کامرانی', rating: 9.0, likes: 243, comments: 41, year: 2023, time: '۷ ماه پیش', content: 'نولان دوباره شگفت‌زده کرد. کیلیان مورفی فوق‌العاده.', poster: '/assets/movies/movie-1.svg', type: 'critic', genre: 'تاریخی، درام', featured: true, trending: 320 },
];

export function ReviewsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const {
    items,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    layout,
    setLayout,
    filters,
    setFilters,
    activeFilterCount,
    clearFilters,
    resultCount,
    totalCount,
  } = useContentControls(allReviews, 'reviews');

  // Additional tab-based filtering
  const tabFilteredItems = useMemo(() => {
    switch (activeTab) {
      case 'featured':
        return items.filter(item => (item as any).featured);
      case 'critics':
        return items.filter(item => (item as any).type === 'critic');
      case 'community':
        return items.filter(item => (item as any).type === 'user');
      case 'trending':
        return [...items].sort((a, b) => ((b as any).trending || 0) - ((a as any).trending || 0));
      case 'most-liked':
        return [...items].sort((a, b) => ((b as any).likes || 0) - ((a as any).likes || 0));
      case 'latest':
        return [...items].sort((a, b) => b.year - a.year);
      case 'all':
      default:
        return items;
    }
  }, [items, activeTab]);

  const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'most-liked', label: 'پرلایک‌ترین' },
    { value: 'most-commented', label: 'پرنظرترین' },
    { value: 'trending', label: 'ترند' },
    { value: 'highest-rated', label: 'بالاترین امتیاز' },
    { value: 'lowest-rated', label: 'پایین‌ترین امتیاز' },
    { value: 'a-z', label: 'الفبایی (الف-ی)' },
    { value: 'z-a', label: 'الفبایی (ی-الف)' },
    { value: 'random', label: 'کشف تصادفی' },
  ];

  const tabs = [
    { id: 'all', label: 'همه نقدها', icon: <Star className="w-4 h-4" /> },
    { id: 'featured', label: 'ویژه', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'latest', label: 'جدیدترین', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'critics', label: 'منتقدان', icon: <Award className="w-4 h-4" /> },
    { id: 'community', label: 'جامعه', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'trending', label: 'ترند', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'most-liked', label: 'پرلایک', icon: <ThumbsUp className="w-4 h-4" /> },
  ];

  const hasActiveFilters = activeFilterCount > 0 || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">نقدها</h1>
            <motion.p
              key={tabFilteredItems.length}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl text-muted-foreground"
            >
              {tabFilteredItems.length === totalCount
                ? `${totalCount.toLocaleString('fa-IR')} نقد`
                : `${tabFilteredItems.length.toLocaleString('fa-IR')} نتیجه از ${totalCount.toLocaleString('fa-IR')} نقد`}
            </motion.p>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-8 -mx-6 lg:mx-0 px-6 lg:px-0">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نقد..."
                className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  activeFilterCount > 0
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <FilterIcon className="w-4 h-4" />
                <span className="text-sm font-medium">فیلتر</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <SortDropdown value={sortBy} onChange={setSortBy} options={sortOptions} />

              <LayoutSwitcher value={layout} onChange={setLayout} />

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  پاک کردن
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {filters.genres && filters.genres.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-6 flex-wrap"
            >
              <span className="text-sm text-muted-foreground">فیلترهای فعال:</span>
              {filters.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg flex items-center gap-2"
                >
                  {genre}
                  <button
                    onClick={() => {
                      setFilters({
                        ...filters,
                        genres: filters.genres!.filter((g) => g !== genre),
                      });
                    }}
                    className="hover:bg-primary/20 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </motion.div>
          )}

          {/* Reviews Grid/List */}
          <div className="space-y-6">
            {renderReviews(layout, tabFilteredItems)}
          </div>
        </div>
      </main>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />

      <Footer />
    </div>
  );
}

function renderReviews(layout: LayoutType, reviews: any[]) {
  if (reviews.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Star className="w-10 h-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-2xl font-bold mb-3">موردی یافت نشد</h3>
        <p className="text-muted-foreground mb-6">
          نتیجه‌ای با این فیلتر پیدا نشد. لطفاً فیلترها را تغییر دهید.
        </p>
      </div>
    );
  }

  if (layout === 'compact-list') {
    return reviews.map((review) => (
      <Link
        key={review.id}
        to={`/review/${review.id}`}
        className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all"
      >
        <img
          src={review.poster}
          className="w-16 h-24 rounded-xl object-cover"
          alt=""
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold mb-1 line-clamp-1">{review.title}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span>{review.reviewer}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="font-medium text-accent">{review.rating}</span>
            </div>
            <span>•</span>
            <span>{review.time}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{review.content}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{review.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{review.comments}</span>
          </div>
        </div>
      </Link>
    ));
  }

  // Default: detailed-list
  return reviews.map((review) => (
    <Link
      key={review.id}
      to={`/review/${review.id}`}
      className="p-6 bg-card border border-border rounded-3xl hover:border-primary/30 transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <img
          src={review.poster}
          className="w-20 h-28 rounded-xl object-cover"
          alt=""
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold mb-1">{review.title}</h3>
              <div className="text-sm text-muted-foreground">{review.titleEn}</div>
            </div>
            {review.type === 'critic' && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                منتقد
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{review.reviewer}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-bold text-accent">{review.rating}</span>
            </div>
            <span>•</span>
            <span>{review.time}</span>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-4">
        {review.content}
      </p>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>{review.likes} مفید</span>
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{review.comments} دیدگاه</span>
        </button>
      </div>
    </Link>
  ));
}

import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { Filter as FilterIcon, Search, X, Award, Calendar, TrendingUp, Star, MapPin } from 'lucide-react';
import { useState } from 'react';
import { FilterPanel } from '../components/filter-panel';
import { SortDropdown } from '../components/sort-dropdown';
import { LayoutSwitcher } from '../components/layout-switcher';
import { ContentGrid } from '../components/content-grid';
import { useContentControls } from '../hooks/use-content-controls';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { awards, upcomingCeremonies, winners } from '../data/awards-content';
import { OptimizedImage } from '../components/optimized-image';

// Transform awards for ContentGrid
const allAwards = awards.map(award => ({
  id: award.id,
  title: award.name,
  titleEn: award.nameEn,
  year: award.founded,
  rating: award.prestige === 'legendary' ? 9.5 : award.prestige === 'high' ? 8.5 : 7.5,
  poster: award.banner,
  genre: award.type === 'iranian' ? 'ایرانی' : 'بین‌المللی',
  type: 'award' as const,
}));

export function AwardsMainPage() {
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
  } = useContentControls(allAwards, 'awards');

  const sortOptions = [
    { value: 'prestige', label: 'معتبرترین' },
    { value: 'popular', label: 'محبوب‌ترین' },
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'a-z', label: 'الفبایی (الف-ی)' },
    { value: 'random', label: 'کشف تصادفی' },
  ];

  const quickChips = [
    { id: 'oscar', label: 'Oscar', icon: '🏆' },
    { id: 'cannes', label: 'Cannes', icon: '🌴' },
    { id: 'golden-globe', label: 'Golden Globe', icon: '🌟' },
    { id: 'venice', label: 'Venice', icon: '🦁' },
    { id: 'berlin', label: 'Berlin', icon: '🐻' },
    { id: 'bafta', label: 'BAFTA', icon: '🎭' },
    { id: 'emmy', label: 'Emmy', icon: '📺' },
    { id: 'sundance', label: 'Sundance', icon: '⛰️' },
    { id: 'fajr', label: 'فجر', icon: '🦅' },
    { id: 'international', label: 'بین‌المللی', icon: '🌍' },
    { id: 'iranian', label: 'ایرانی', icon: '🇮🇷' },
  ];

  const hasActiveFilters = activeFilterCount > 0 || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-muted mb-8">
              <OptimizedImage
                src={awards[0].banner}
                alt="Awards Hero"
                type="banner"
                index={0}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-6xl font-bold text-white mb-4">جوایز و جشنواره‌ها</h1>
                  <p className="text-2xl text-white/90 mb-6">
                    دنیای درخشان جوایز سینمایی و تلویزیونی
                  </p>
                  <div className="flex items-center gap-6 text-white/80">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <span>{awards.length} جایزه</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>{winners.length} برنده</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{upcomingCeremonies.length} مراسم پیش‌رو</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Chips */}
          <div className="mb-8 overflow-x-auto scrollbar-hide -mx-6 px-6">
            <div className="flex items-center gap-3 min-w-max">
              {quickChips.map((chip) => (
                <button
                  key={chip.id}
                  className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-primary hover:text-white rounded-xl transition-all whitespace-nowrap"
                >
                  <span>{chip.icon}</span>
                  <span className="text-sm font-medium">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Ceremonies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">مراسم‌های پیش‌رو</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingCeremonies.map((ceremony) => (
                <Link
                  key={ceremony.id}
                  to={`/award/${ceremony.awardId}`}
                  className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {ceremony.awardName}
                      </h3>
                      <p className="text-sm text-muted-foreground">دوره {ceremony.edition}</p>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {ceremony.daysUntil} روز مانده
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(ceremony.date).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{ceremony.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Winners */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">برندگان اخیر</h2>
              <Link
                to="/awards/winners"
                className="text-primary hover:underline"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {winners.slice(0, 5).map((winner) => (
                <Link
                  key={winner.id}
                  to={`/movie/${winner.movieId}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-muted mb-3">
                    <OptimizedImage
                      src={winner.poster}
                      alt={winner.movieTitle}
                      type="movie"
                      index={winner.movieId}
                      title={winner.movieTitle}
                      subtitle={winner.movieTitleEn}
                      year={winner.year}
                      className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="px-2 py-1 bg-accent/90 backdrop-blur-xl rounded-lg">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {winner.movieTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {winner.awardName} {winner.year}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">همه جوایز</h2>
              <motion.p
                key={resultCount}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-muted-foreground"
              >
                {resultCount === totalCount
                  ? `${totalCount.toLocaleString('fa-IR')} جایزه`
                  : `${resultCount.toLocaleString('fa-IR')} نتیجه از ${totalCount.toLocaleString('fa-IR')} جایزه`}
              </motion.p>
            </div>
          </div>

          {/* Search and Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی جایزه یا جشنواره..."
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

          {/* Active Filters */}
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

          {/* Awards Grid */}
          <ContentGrid items={items} layout={layout} baseUrl="/award" />
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

import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { Filter as FilterIcon, Search, X } from 'lucide-react';
import { useState } from 'react';
import { FilterPanel } from '../components/filter-panel';
import { SortDropdown } from '../components/sort-dropdown';
import { LayoutSwitcher } from '../components/layout-switcher';
import { ContentGrid } from '../components/content-grid';
import { useContentControls } from '../hooks/use-content-controls';
import { motion } from 'motion/react';
import { demoSeries as allSeries } from '../data/demo-content';

export function SeriesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
  } = useContentControls(allSeries, 'series');

  const sortOptions = [
    { value: 'popular', label: 'محبوب‌ترین' },
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'highest-rated', label: 'بالاترین امتیاز' },
    { value: 'lowest-rated', label: 'پایین‌ترین امتیاز' },
    { value: 'a-z', label: 'الفبایی (الف-ی)' },
    { value: 'z-a', label: 'الفبایی (ی-الف)' },
    { value: 'random', label: 'کشف تصادفی' },
  ];

  const hasActiveFilters = activeFilterCount > 0 || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-4">سریال‌ها</h1>
              <motion.p
                key={resultCount}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-muted-foreground"
              >
                {resultCount === totalCount
                  ? `${totalCount.toLocaleString('fa-IR')} سریال`
                  : `${resultCount.toLocaleString('fa-IR')} نتیجه از ${totalCount.toLocaleString('fa-IR')} سریال`}
              </motion.p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی سریال..."
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

          {/* Series Grid */}
          <ContentGrid items={items} layout={layout} baseUrl="/series" />
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

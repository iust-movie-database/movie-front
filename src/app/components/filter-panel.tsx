import { X, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export function FilterPanel({ isOpen, onClose, onApply }: FilterPanelProps) {
  const [contentType, setContentType] = useState<string[]>(['movie', 'series']);
  const [genres, setGenres] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState([1, 10]);
  const [reviewType, setReviewType] = useState<string[]>(['critics', 'users', 'editors']);
  const [length, setLength] = useState<string[]>([]);
  const [spoiler, setSpoiler] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [popularity, setPopularity] = useState<string>('');

  const genreOptions = [
    'اکشن', 'درام', 'کمدی', 'ترسناک', 'علمی-تخیلی', 'عاشقانه',
    'هیجانی', 'انیمیشن', 'مستند', 'تاریخی', 'خانوادگی', 'جنایی',
    'فانتزی', 'ماجراجویی'
  ];

  const handleReset = () => {
    setContentType(['movie', 'series']);
    setGenres([]);
    setRatingRange([1, 10]);
    setReviewType(['critics', 'users', 'editors']);
    setLength([]);
    setSpoiler('all');
    setDateFilter('all');
    setPopularity('');
  };

  const handleApply = () => {
    onApply({
      contentType,
      genres,
      ratingRange,
      reviewType,
      length,
      spoiler,
      dateFilter,
      popularity,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed left-0 top-0 h-screen w-full md:w-96 bg-card border-r border-border z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">فیلترها</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Content Type */}
              <FilterSection title="نوع محتوا">
                <div className="space-y-2">
                  {[
                    { id: 'movie', label: 'فیلم' },
                    { id: 'series', label: 'سریال' },
                  ].map((type) => (
                    <label key={type.id} className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={contentType.includes(type.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setContentType([...contentType, type.id]);
                          } else {
                            setContentType(contentType.filter((t) => t !== type.id));
                          }
                        }}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Genres */}
              <FilterSection title="ژانر">
                <div className="grid grid-cols-2 gap-2">
                  {genreOptions.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        if (genres.includes(genre)) {
                          setGenres(genres.filter((g) => g !== genre));
                        } else {
                          setGenres([...genres, genre]);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-sm transition-all ${
                        genres.includes(genre)
                          ? 'bg-primary text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Rating Range */}
              <FilterSection title="امتیاز">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>{ratingRange[0]}</span>
                    <span>{ratingRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={ratingRange[1]}
                    onChange={(e) => setRatingRange([ratingRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                </div>
              </FilterSection>

              {/* Review Type */}
              <FilterSection title="نوع نقد">
                <div className="space-y-2">
                  {[
                    { id: 'critics', label: 'منتقدان' },
                    { id: 'users', label: 'کاربران' },
                    { id: 'editors', label: 'سردبیران' },
                  ].map((type) => (
                    <label key={type.id} className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={reviewType.includes(type.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReviewType([...reviewType, type.id]);
                          } else {
                            setReviewType(reviewType.filter((t) => t !== type.id));
                          }
                        }}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Length */}
              <FilterSection title="طول نقد">
                <div className="flex gap-2">
                  {['کوتاه', 'متوسط', 'بلند'].map((len) => (
                    <button
                      key={len}
                      onClick={() => {
                        if (length.includes(len)) {
                          setLength(length.filter((l) => l !== len));
                        } else {
                          setLength([...length, len]);
                        }
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm transition-all ${
                        length.includes(len)
                          ? 'bg-primary text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Spoiler */}
              <FilterSection title="اسپویلر">
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'همه' },
                    { id: 'no-spoiler', label: 'بدون اسپویلر' },
                    { id: 'with-spoiler', label: 'دارای اسپویلر' },
                  ].map((option) => (
                    <label key={option.id} className="flex items-center gap-3 p-3 hover:bg-muted rounded-xl cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="spoiler"
                        checked={spoiler === option.id}
                        onChange={() => setSpoiler(option.id)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Date */}
              <FilterSection title="تاریخ">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full p-3 bg-muted rounded-xl outline-none"
                >
                  <option value="all">همه</option>
                  <option value="today">امروز</option>
                  <option value="week">این هفته</option>
                  <option value="month">این ماه</option>
                  <option value="year">امسال</option>
                </select>
              </FilterSection>

              {/* Popularity */}
              <FilterSection title="محبوبیت">
                <select
                  value={popularity}
                  onChange={(e) => setPopularity(e.target.value)}
                  className="w-full p-3 bg-muted rounded-xl outline-none"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="liked">پرلایک‌ترین</option>
                  <option value="commented">پرنظرترین</option>
                  <option value="shared">پراشتراک‌ترین</option>
                  <option value="trending">ترند</option>
                </select>
              </FilterSection>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors"
              >
                بازنشانی
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-6 py-3 bg-gradient-to-l from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                اعمال فیلتر
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

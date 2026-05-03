import { useState } from 'react';
import { Heart, Film, Users, Globe, Check } from 'lucide-react';

export function PreferencesSettings() {
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(['علمی-تخیلی', 'درام', 'جنایی']);
  const [contentLanguage, setContentLanguage] = useState('all');
  const [enableRecommendations, setEnableRecommendations] = useState(true);

  const genres = [
    'علمی-تخیلی', 'درام', 'کمدی', 'اکشن', 'ترسناک', 'جنایی',
    'عاشقانه', 'ماجراجویی', 'فانتزی', 'انیمیشن', 'مستند', 'تاریخی',
  ];

  const toggleGenre = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter(g => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all ${
        value ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
        value ? 'left-0.5' : 'right-0.5'
      }`} />
    </button>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">تنظیمات</h2>
        <p className="text-muted-foreground">سفارشی‌سازی تجربه کاربری</p>
      </div>

      <div className="space-y-8">
        {/* Favorite Genres */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="font-bold">ژانرهای مورد علاقه</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            ژانرهای موردعلاقه خود را انتخاب کنید تا پیشنهادات بهتری دریافت کنید
          </p>
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  favoriteGenres.includes(genre)
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {favoriteGenres.length} ژانر انتخاب شده
          </p>
        </section>

        {/* Favorite Actors */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold">بازیگران مورد علاقه</h3>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl">
            <button className="w-full p-4 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-all text-muted-foreground">
              + افزودن بازیگر
            </button>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              هنوز بازیگری اضافه نکرده‌اید
            </p>
          </div>
        </section>

        {/* Content Language */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-bold">زبان محتوا</h3>
          </div>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'همه زبان‌ها' },
              { value: 'fa', label: 'فارسی' },
              { value: 'en', label: 'انگلیسی' },
              { value: 'multi', label: 'چند زبانه' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setContentLanguage(option.value)}
                className={`w-full p-4 rounded-xl transition-all flex items-center justify-between ${
                  contentLanguage === option.value
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-card border-2 border-border hover:border-primary/30'
                }`}
              >
                <span className="font-medium">{option.label}</span>
                {contentLanguage === option.value && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="font-bold">پیشنهادات هوشمند</h3>
          </div>
          <div className="p-5 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium mb-1">فعال‌سازی پیشنهادات</div>
                <div className="text-sm text-muted-foreground">
                  دریافت پیشنهادات شخصی‌سازی شده بر اساس علایق شما
                </div>
              </div>
              <Toggle value={enableRecommendations} onChange={setEnableRecommendations} />
            </div>
          </div>
        </section>

        {/* Mature Content */}
        <section>
          <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium mb-1">محتوای بزرگسالان</div>
                <div className="text-sm text-muted-foreground">
                  نمایش محتوای مخصوص بزرگسالان (+18)
                </div>
              </div>
              <Toggle value={false} onChange={() => {}} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Camera, MapPin, Calendar, Heart, BookMarked, Star, List, Activity, Settings, Edit2, Users, User, Shield, Eye, Bell, Palette, Sliders, Crown } from 'lucide-react';
import { MovieCard } from '../components/movie-card';
import { Link } from 'react-router';
import { demoImages, moviePosters } from '../utils/image-placeholders';
import { demoMovies } from '../data/demo-content';
import { LayoutSwitcher, LayoutType } from '../components/layout-switcher';
import { ContentGrid } from '../components/content-grid';
import { AccountSettings } from '../components/settings/account-settings';
import { SecuritySettings } from '../components/settings/security-settings';
import { PrivacySettings } from '../components/settings/privacy-settings';
import { NotificationsSettings } from '../components/settings/notifications-settings';
import { AppearanceSettings } from '../components/settings/appearance-settings';
import { PreferencesSettings } from '../components/settings/preferences-settings';
import { SubscriptionSettings } from '../components/settings/subscription-settings';

export function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const tabs = [
    { id: 'overview', label: 'خلاصه', icon: <Activity className="w-4 h-4" /> },
    { id: 'watchlist', label: 'لیست تماشا', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'favorites', label: 'علاقه‌مندی‌ها', icon: <Heart className="w-4 h-4" /> },
    { id: 'reviews', label: 'نقدها', icon: <Star className="w-4 h-4" /> },
    { id: 'lists', label: 'لیست‌ها', icon: <List className="w-4 h-4" /> },
    { id: 'activity', label: 'فعالیت', icon: <Activity className="w-4 h-4" /> },
    { id: 'settings', label: 'تنظیمات', icon: <Settings className="w-4 h-4" /> },
  ];

  const stats = [
    { label: 'دیده‌شده', value: '189' },
    { label: 'نقدها', value: '24' },
    { label: 'امتیازها', value: '256' },
    { label: 'لیست‌ها', value: '12' },
    { label: 'دنبال‌کنندگان', value: '847' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Profile Hero */}
        <div className="relative h-64 lg:h-80 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
          <img
            src={demoImages.banners[0]}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <button className="absolute top-6 left-6 p-3 bg-black/30 backdrop-blur-xl hover:bg-black/50 rounded-xl transition-all">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="relative -mt-20 mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl">
                  <div className="w-full h-full rounded-[22px] bg-card flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary">ع</span>
                    </div>
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-primary hover:bg-secondary rounded-xl shadow-lg transition-all">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">علی احمدی</h1>
                <p className="text-muted-foreground mb-4 leading-relaxed max-w-2xl">
                  علاقه‌مند به سینمای کلاسیک و فیلم‌های هنری. طرفدار نولان، کوبریک و تارانتینو
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>تهران، ایران</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>عضویت از آذر ۱۴۰۲</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-all flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">دنبال کردن</span>
                </button>
                <Link to="/profile/edit" className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl transition-all flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  <span className="font-medium">ویرایش پروفایل</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all cursor-pointer">
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-8 -mx-6 lg:mx-0 px-6 lg:px-0">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchParams({ tab: tab.id })}
                  className={`flex items-center gap-2 px-4 md:px-6 py-4 border-b-2 transition-all whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-20">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'watchlist' && <WatchlistTab />}
            {activeTab === 'favorites' && <FavoritesTab />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'lists' && <ListsTab />}
            {activeTab === 'activity' && <ActivityTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function OverviewTab() {
  const recentActivities = [
    { type: 'rating', movie: 'اینترستلار', rating: 9.5, time: '۲ ساعت پیش', icon: <Star className="w-4 h-4" /> },
    { type: 'review', movie: 'دارک نایت', time: '۵ ساعت پیش', icon: <Star className="w-4 h-4" /> },
    { type: 'watchlist', movie: 'اوپنهایمر', time: '۱ روز پیش', icon: <BookMarked className="w-4 h-4" /> },
    { type: 'favorite', movie: 'گادفادر', time: '۲ روز پیش', icon: <Heart className="w-4 h-4" /> },
    { type: 'rating', movie: 'شاوشنک', rating: 9.3, time: '۳ روز پیش', icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-12">
      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-bold mb-6">فعالیت اخیر</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, i) => (
            <div key={i} className="p-5 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{activity.movie}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {activity.type === 'rating' && `امتیاز ${activity.rating} داده شد`}
                      {activity.type === 'review' && 'نقد نوشته شد'}
                      {activity.type === 'watchlist' && 'به لیست تماشا اضافه شد'}
                      {activity.type === 'favorite' && 'به علاقه‌مندی‌ها اضافه شد'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Ratings */}
      <section>
        <h2 className="text-2xl font-bold mb-6">امتیازهای اخیر</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {demoMovies.slice(0, 5).map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <MovieCard
                id={movie.id}
                title={movie.title}
                titleEn={movie.titleEn}
                year={movie.year}
                rating={movie.rating}
                poster={movie.poster}
                genre={movie.genre}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Favorite Genres */}
      <section>
        <h2 className="text-2xl font-bold mb-6">ژانرهای محبوب</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'علمی-تخیلی', count: 45, gradient: 'from-cyan-500 to-blue-600' },
            { name: 'درام', count: 38, gradient: 'from-purple-500 to-pink-600' },
            { name: 'جنایی', count: 32, gradient: 'from-red-500 to-orange-600' },
            { name: 'اکشن', count: 28, gradient: 'from-yellow-500 to-amber-600' },
          ].map((genre) => (
            <div
              key={genre.name}
              className={`p-6 bg-gradient-to-br ${genre.gradient} rounded-2xl text-white cursor-pointer hover:scale-105 transition-transform`}
            >
              <div className="text-3xl font-bold mb-1">{genre.count}</div>
              <div className="text-white/90">{genre.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Review */}
      <section>
        <h2 className="text-2xl font-bold mb-6">آخرین نقد</h2>
        <div className="p-8 bg-card border border-border rounded-3xl">
          <div className="flex items-start gap-4 mb-6">
            <img
              src={moviePosters.interstellar}
              className="w-16 h-24 rounded-xl object-cover"
              alt=""
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">اینترستلار</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-bold text-accent">9.5</span>
                </div>
                <span>۲ روز پیش</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            شاهکار کریستوفر نولان. ترکیبی بی‌نظیر از علم، احساسات انسانی و بصری خیره‌کننده. موسیقی هانس زیمر فوق‌العاده است و صحنه‌های فضایی واقعاً تأثیرگذار هستند...
          </p>
          <Link to="/review/1" className="inline-block mt-4 text-primary hover:underline text-sm font-medium">
            ادامه مطلب ←
          </Link>
        </div>
      </section>
    </div>
  );
}

function WatchlistTab() {
  const [layout, setLayout] = useState<LayoutType>(() => {
    const saved = localStorage.getItem('profile-watchlist-layout');
    return (saved as LayoutType) || 'poster-grid';
  });

  useState(() => {
    localStorage.setItem('profile-watchlist-layout', layout);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">لیست تماشا</h2>
        <div className="flex items-center gap-4">
          <div className="text-muted-foreground">۴۵ عنوان</div>
          <LayoutSwitcher value={layout} onChange={setLayout} />
        </div>
      </div>
      <ContentGrid items={demoMovies.slice(0, 10)} layout={layout} baseUrl="/movie" />
    </div>
  );
}

function FavoritesTab() {
  const [layout, setLayout] = useState<LayoutType>(() => {
    const saved = localStorage.getItem('profile-favorites-layout');
    return (saved as LayoutType) || 'poster-grid';
  });

  useState(() => {
    localStorage.setItem('profile-favorites-layout', layout);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">علاقه‌مندی‌ها</h2>
        <div className="flex items-center gap-4">
          <div className="text-muted-foreground">۱۲۸ عنوان</div>
          <LayoutSwitcher value={layout} onChange={setLayout} />
        </div>
      </div>
      <ContentGrid items={demoMovies.slice(5, 15)} layout={layout} baseUrl="/movie" />
    </div>
  );
}

function ReviewsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">نقدهای من</h2>
        <div className="text-muted-foreground">۲۴ نقد</div>
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-8 bg-card border border-border rounded-3xl hover:border-primary/30 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={demoMovies[i].poster}
                className="w-16 h-24 rounded-xl object-cover"
                alt=""
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">اینترستلار</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-bold text-accent">9.5</span>
                  </div>
                  <span>۲ روز پیش</span>
                  <span>۱۲۴ لایک</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed line-clamp-3">
              شاهکار کریستوفر نولان. ترکیبی بی‌نظیر از علم، احساسات انسانی و بصری خیره‌کننده...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListsTab() {
  const lists = [
    { id: 1, name: 'بهترین‌های دهه ۹۰', count: 24 },
    { id: 2, name: 'فیلم‌های علمی-تخیلی', count: 18 },
    { id: 3, name: 'آثار برنده اسکار', count: 32 },
    { id: 4, name: 'سریال‌های کوتاه', count: 12 },
    { id: 5, name: 'درام‌های محبوب', count: 27 },
    { id: 6, name: 'کلاسیک‌های سینما', count: 15 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">لیست‌های من</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-all">
          لیست جدید
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lists.map((list) => (
          <Link
            key={list.id}
            to={`/list/${list.id}`}
            className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all cursor-pointer group"
          >
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{list.name}</h3>
            <div className="text-sm text-muted-foreground">{list.count} فیلم</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ActivityTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">فعالیت اخیر</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-6 bg-card border border-border rounded-2xl">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <Star className="w-4 h-4 text-primary" />
              <span>امتیاز داد</span>
              <span>•</span>
              <span>۲ ساعت پیش</span>
            </div>
            <div className="font-medium">اینترستلار - امتیاز: 9.5</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [activeSection, setActiveSection] = useState('account');

  const sections = [
    { id: 'account', label: 'حساب کاربری', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'امنیت', icon: <Shield className="w-4 h-4" /> },
    { id: 'privacy', label: 'حریم خصوصی', icon: <Eye className="w-4 h-4" /> },
    { id: 'notifications', label: 'اعلان‌ها', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'ظاهر', icon: <Palette className="w-4 h-4" /> },
    { id: 'preferences', label: 'تنظیمات', icon: <Sliders className="w-4 h-4" /> },
    { id: 'subscription', label: 'اشتراک', icon: <Crown className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-8">
      {/* Settings Navigation */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <div className="sticky top-24 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right ${
                activeSection === section.id
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border hover:border-primary/30'
              }`}
            >
              {section.icon}
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden mb-6">
        <select
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
          className="w-full p-3 bg-card border border-border rounded-xl outline-none"
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        {activeSection === 'account' && <AccountSettings />}
        {activeSection === 'security' && <SecuritySettings />}
        {activeSection === 'privacy' && <PrivacySettings />}
        {activeSection === 'notifications' && <NotificationsSettings />}
        {activeSection === 'appearance' && <AppearanceSettings />}
        {activeSection === 'preferences' && <PreferencesSettings />}
        {activeSection === 'subscription' && <SubscriptionSettings />}
      </div>
    </div>
  );
}

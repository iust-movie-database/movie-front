import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Heart, Share2, Users, Film, Plus, Grid3x3, List as ListIcon, SortDesc, Eye, Lock, Edit2 } from 'lucide-react';
import { MovieCard } from '../components/movie-card';
import { demoImages } from '../utils/image-placeholders';

export function ListDetailPage() {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'reviews' | 'activity' | 'followers'>('items');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'added' | 'rating' | 'year' | 'title'>('added');

  // Mock list data
  const listData = {
    id,
    title: 'بهترین‌های دهه ۹۰',
    description: 'مجموعه‌ای از شاهکارهای سینمایی که در دهه ۱۹۹۰ ساخته شدند و تاثیری ماندگار بر تاریخ سینما گذاشتند',
    creator: {
      name: 'علی احمدی',
      username: 'ali_ahmadi',
      avatar: demoImages.avatars[0],
    },
    stats: {
      items: 24,
      followers: 1247,
      views: 15820,
    },
    isPublic: true,
    isOwner: true,
    createdAt: '۱۴۰۲/۰۸/۱۵',
  };

  const listItems = [
    {
      id: 1,
      title: 'شاوشنک',
      titleEn: 'The Shawshank Redemption',
      year: 1994,
      rating: 9.3,
      poster: demoImages.movies[5],
      genre: 'درام',
      addedAt: '۱۴۰۲/۱۲/۰۱',
    },
    {
      id: 2,
      title: 'پالپ فیکشن',
      titleEn: 'Pulp Fiction',
      year: 1994,
      rating: 8.9,
      poster: demoImages.movies[6],
      genre: 'جنایی',
      addedAt: '۱۴۰۲/۱۱/۲۸',
    },
    {
      id: 3,
      title: 'لیست شیندلر',
      titleEn: "Schindler's List",
      year: 1993,
      rating: 9.0,
      poster: demoImages.movies[1],
      genre: 'تاریخی، درام',
      addedAt: '۱۴۰۲/۱۱/۲۵',
    },
    {
      id: 4,
      title: 'ماتریکس',
      titleEn: 'The Matrix',
      year: 1999,
      rating: 8.7,
      poster: demoImages.movies[3],
      genre: 'علمی-تخیلی، اکشن',
      addedAt: '۱۴۰۲/۱۱/۲۰',
    },
    {
      id: 5,
      title: 'باشگاه مشت‌زنی',
      titleEn: 'Fight Club',
      year: 1999,
      rating: 8.8,
      poster: demoImages.movies[7],
      genre: 'درام',
      addedAt: '۱۴۰۲/۱۱/۱۵',
    },
    {
      id: 6,
      title: 'فارست گامپ',
      titleEn: 'Forrest Gump',
      year: 1994,
      rating: 8.8,
      poster: demoImages.movies[0],
      genre: 'درام',
      addedAt: '۱۴۰۲/۱۱/۱۰',
    },
    {
      id: 7,
      title: 'گادفادر',
      titleEn: 'The Godfather',
      year: 1972,
      rating: 9.2,
      poster: demoImages.movies[2],
      genre: 'جنایی، درام',
      addedAt: '۱۴۰۲/۱۱/۰۵',
    },
    {
      id: 8,
      title: 'دارک نایت',
      titleEn: 'The Dark Knight',
      year: 2008,
      rating: 9.0,
      poster: demoImages.movies[4],
      genre: 'اکشن',
      addedAt: '۱۴۰۲/۱۱/۰۱',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* List Hero */}
          <div className="mb-12">
            <div className="flex items-start gap-8 mb-8">
              {/* Cover Collage */}
              <div className="hidden md:block w-64 h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0">
                <div className="grid grid-cols-2 gap-1 h-full">
                  {listItems.slice(0, 4).map((item, i) => (
                    <div key={i} className="relative overflow-hidden">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* List Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-4xl font-bold">{listData.title}</h1>
                      {listData.isPublic ? (
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <Link
                      to={`/user/${listData.creator.username}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                        <img src={listData.creator.avatar} alt={listData.creator.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium">{listData.creator.name}</span>
                      <span className="text-sm">@{listData.creator.username}</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    {listData.isOwner && (
                      <button className="p-3 bg-muted hover:bg-muted/80 rounded-xl transition-all">
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-3 bg-muted hover:bg-muted/80 rounded-xl transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        isFollowing
                          ? 'bg-muted hover:bg-muted/80'
                          : 'bg-primary hover:bg-secondary text-white'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      {isFollowing ? 'دنبال می‌کنید' : 'دنبال کردن'}
                    </button>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {listData.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    <span className="font-medium">{listData.stats.items}</span>
                    <span className="text-muted-foreground">فیلم</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">{listData.stats.followers.toLocaleString('fa-IR')}</span>
                    <span className="text-muted-foreground">دنبال‌کننده</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="font-medium">{listData.stats.views.toLocaleString('fa-IR')}</span>
                    <span className="text-muted-foreground">بازدید</span>
                  </div>
                  <div className="text-muted-foreground">
                    ایجاد شده در {listData.createdAt}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex items-center gap-1">
                {[
                  { id: 'items', label: 'آیتم‌ها', icon: <Film className="w-4 h-4" /> },
                  { id: 'reviews', label: 'نقدها', icon: <Heart className="w-4 h-4" /> },
                  { id: 'activity', label: 'فعالیت', icon: <ListIcon className="w-4 h-4" /> },
                  { id: 'followers', label: 'دنبال‌کنندگان', icon: <Users className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
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
          </div>

          {/* Tab Content */}
          {activeTab === 'items' && (
            <div>
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-primary text-white rounded-lg">
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-all">
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-muted rounded-xl outline-none cursor-pointer"
                  >
                    <option value="added">تاریخ افزودن</option>
                    <option value="rating">امتیاز</option>
                    <option value="year">سال تولید</option>
                    <option value="title">عنوان</option>
                  </select>

                  {listData.isOwner && (
                    <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      افزودن فیلم
                    </button>
                  )}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listItems.map((item) => (
                  <Link key={item.id} to={`/movie/${item.id}`}>
                    <MovieCard
                      id={item.id}
                      title={item.title}
                      titleEn={item.titleEn}
                      year={item.year}
                      rating={item.rating}
                      poster={item.poster}
                      genre={item.genre}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-20 text-muted-foreground">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">هنوز نقدی برای این لیست ثبت نشده است</p>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {[
                { action: 'افزودن فیلم', item: 'شاوشنک', time: '۲ ساعت پیش' },
                { action: 'افزودن فیلم', item: 'پالپ فیکشن', time: '۵ ساعت پیش' },
                { action: 'ویرایش لیست', item: 'تغییر توضیحات', time: '۱ روز پیش' },
                { action: 'افزودن فیلم', item: 'ماتریکس', time: '۲ روز پیش' },
              ].map((activity, i) => (
                <div key={i} className="p-6 bg-card border border-border rounded-2xl">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-medium">{activity.action}</span>
                    <span>•</span>
                    <span className="text-muted-foreground">{activity.item}</span>
                    <span>•</span>
                    <span className="text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                      <img src={demoImages.avatars[i % 4]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold mb-1">کاربر {i + 1}</div>
                      <div className="text-sm text-muted-foreground">@user{i + 1}</div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-all text-sm">
                      دنبال کردن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { Award, MapPin, Calendar, Users, TrendingUp, Star, Trophy, History } from 'lucide-react';
import { motion } from 'motion/react';
import { awards, categories, winners, upcomingCeremonies } from '../data/awards-content';
import { OptimizedImage } from '../components/optimized-image';

export function AwardDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const award = awards.find(a => a.id === Number(id));

  if (!award) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">جایزه یافت نشد</h1>
          <Link to="/awards" className="text-primary hover:underline">
            بازگشت به صفحه جوایز
          </Link>
        </div>
      </div>
    );
  }

  const awardCategories = categories.filter(c => c.awardId === award.id);
  const awardWinners = winners.filter(w => w.awardId === award.id);
  const upcomingCeremony = upcomingCeremonies.find(c => c.awardId === award.id);

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: <Award className="w-4 h-4" /> },
    { id: 'categories', label: 'دسته‌بندی‌ها', icon: <Trophy className="w-4 h-4" /> },
    { id: 'winners', label: 'برندگان', icon: <Star className="w-4 h-4" /> },
    { id: 'nominees', label: 'نامزدها', icon: <Users className="w-4 h-4" /> },
    { id: 'history', label: 'تاریخچه', icon: <History className="w-4 h-4" /> },
    { id: 'gallery', label: 'گالری', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Hero Banner */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-muted mb-8">
            <OptimizedImage
              src={award.banner}
              alt={award.name}
              type="banner"
              index={award.id}
              title={award.name}
              subtitle={award.nameEn}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 rounded-2xl bg-card/90 backdrop-blur-xl flex items-center justify-center">
                      <Award className="w-16 h-16 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-6xl font-bold text-white mb-2">{award.name}</h1>
                      <p className="text-2xl text-white/80 mb-4">{award.nameEn}</p>
                      <p className="text-lg text-white/70">{award.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl transition-all">
                      دنبال کردن
                    </button>
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-xl transition-all">
                      یادآوری
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-white/80">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{award.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>تأسیس {award.founded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    <span>{award.categories} دسته‌بندی</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{award.followers} دنبال‌کننده</span>
                  </div>
                  <div className="px-3 py-1 bg-accent/90 backdrop-blur-xl text-white rounded-lg text-sm font-medium">
                    {award.prestige === 'legendary' ? '🌟 افسانه‌ای' : award.prestige === 'high' ? '⭐ معتبر' : '✨ محبوب'}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Upcoming Ceremony Alert */}
          {upcomingCeremony && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-primary/10 border border-primary/30 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">مراسم پیش‌رو: دوره {upcomingCeremony.edition}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(upcomingCeremony.date).toLocaleDateString('fa-IR')} • {upcomingCeremony.location}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-primary">{upcomingCeremony.daysUntil}</div>
                  <div className="text-sm text-muted-foreground">روز مانده</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="border-b border-border mb-8">
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

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">درباره {award.name}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {award.description} - این جایزه از سال {award.founded} میلادی برگزار می‌شود و یکی از معتبرترین
                  جوایز {award.type === 'iranian' ? 'ایرانی' : 'بین‌المللی'} در حوزه سینما و تلویزیون به شمار می‌رود.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">آمار و ارقام</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="text-4xl font-bold text-primary mb-2">{award.categories}</div>
                    <div className="text-sm text-muted-foreground">دسته‌بندی</div>
                  </div>
                  <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="text-4xl font-bold text-primary mb-2">{2026 - award.founded}</div>
                    <div className="text-sm text-muted-foreground">سال فعالیت</div>
                  </div>
                  <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="text-4xl font-bold text-primary mb-2">{award.followers}</div>
                    <div className="text-sm text-muted-foreground">دنبال‌کننده</div>
                  </div>
                  <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="text-4xl font-bold text-primary mb-2">{awardWinners.length}</div>
                    <div className="text-sm text-muted-foreground">برنده</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">دسته‌بندی‌ها</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {awardCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/award/${award.id}/category/${category.id}`}
                    className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all group"
                  >
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.nameEn}</p>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {category.winners} برنده
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'winners' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">برندگان</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {awardWinners.map((winner) => (
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
                        <div className="px-3 py-1 bg-accent/90 backdrop-blur-xl rounded-lg flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-white" />
                          <span className="text-xs text-white font-medium">{winner.year}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {winner.movieTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {winner.categoryName}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">تاریخچه</h2>
              <div className="relative">
                <div className="absolute right-8 top-0 bottom-0 w-px bg-border" />
                {awardWinners.map((winner, index) => (
                  <div key={winner.id} className="relative pr-20 pb-12">
                    <div className="absolute right-[26px] top-2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                    <div className="text-sm font-bold text-primary mb-2">{winner.year}</div>
                    <Link
                      to={`/movie/${winner.movieId}`}
                      className="flex items-start gap-4 p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all group"
                    >
                      <OptimizedImage
                        src={winner.poster}
                        alt={winner.movieTitle}
                        type="movie"
                        index={winner.movieId}
                        title={winner.movieTitle}
                        className="w-20 h-30 rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                          {winner.movieTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{winner.movieTitleEn}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-accent" />
                          <span className="text-accent font-medium">{winner.categoryName}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

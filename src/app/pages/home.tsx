import { Navbar } from '../components/navbar-clean';
import { HeroSlider } from '../components/hero-slider';
import { MovieSection } from '../components/movie-section';
import { ActorCard } from '../components/actor-card';
import { GenreCard } from '../components/genre-card';
import { TrendingCard } from '../components/trending-card';
import { Footer } from '../components/footer';
import { Flame, Sparkles, Clock, Award, Heart, Star, Zap, Film, Drama, Laugh, Ghost, Swords } from 'lucide-react';
import { Link } from 'react-router';
import { demoImages } from '../utils/image-placeholders';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <HeroSlider />

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <MovieSection
            title="جدیدترین‌ها"
            subtitle="تازه‌ترین فیلم‌ها و سریال‌های منتشر شده"
            icon={<Sparkles className="w-6 h-6 text-primary" />}
          />

          <section className="py-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-primary/30">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">ترند هفته</h2>
                <p className="text-muted-foreground mt-1">محبوب‌ترین‌های این هفته</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingData.map((item) => (
                <TrendingCard key={item.rank} {...item} />
              ))}
            </div>
          </section>

          <MovieSection
            title="برترین امتیازها"
            subtitle="بهترین فیلم‌ها بر اساس رای کاربران"
            icon={<Star className="w-6 h-6 text-accent" />}
          />

          <section className="py-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-primary/30">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">ژانرهای محبوب</h2>
                <p className="text-muted-foreground mt-1">کاوش بر اساس دسته‌بندی</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Link to="/genre/action">
                <GenreCard
                  title="اکشن"
                  count={1240}
                  gradient="bg-gradient-to-br from-red-500 to-orange-600"
                  icon={<Swords className="w-6 h-6 text-white" />}
                />
              </Link>
              <Link to="/genre/drama">
                <GenreCard
                  title="درام"
                  count={2180}
                  gradient="bg-gradient-to-br from-blue-500 to-purple-600"
                  icon={<Drama className="w-6 h-6 text-white" />}
                />
              </Link>
              <Link to="/genre/comedy">
                <GenreCard
                  title="کمدی"
                  count={980}
                  gradient="bg-gradient-to-br from-yellow-500 to-pink-600"
                  icon={<Laugh className="w-6 h-6 text-white" />}
                />
              </Link>
              <Link to="/genre/horror">
                <GenreCard
                  title="ترسناک"
                  count={540}
                  gradient="bg-gradient-to-br from-purple-800 to-black"
                  icon={<Ghost className="w-6 h-6 text-white" />}
                />
              </Link>
              <Link to="/genre/scifi">
                <GenreCard
                  title="علمی-تخیلی"
                  count={720}
                  gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
                  icon={<Zap className="w-6 h-6 text-white" />}
                />
              </Link>
            </div>
          </section>

          <MovieSection
            title="انتخاب سردبیر"
            subtitle="پیشنهادهای ویژه تیم دیدار"
            icon={<Award className="w-6 h-6 text-primary" />}
          />

          <section className="py-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-primary/30">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">بازیگران محبوب</h2>
                <p className="text-muted-foreground mt-1">ستاره‌های محبوب سینما</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {actorsData.map((actor, index) => (
                <Link key={index} to={`/actor/${index + 1}`}>
                  <ActorCard {...actor} />
                </Link>
              ))}
            </div>
          </section>

          <MovieSection
            title="پیشنهاد ویژه برای شما"
            subtitle="بر اساس سلیقه و علایق شما"
            icon={<Heart className="w-6 h-6 text-primary" />}
          />

          <MovieSection
            title="به‌زودی"
            subtitle="فیلم‌ها و سریال‌های در راه"
            icon={<Clock className="w-6 h-6 text-primary" />}
          />

          <section className="py-12 mb-12">
            <div className="relative p-12 lg:p-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl overflow-hidden">
              <img
                src={demoImages.banners[1]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-10"
              />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl font-bold text-white mb-4">
                  به خانواده دیدار بپیوندید
                </h2>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  با عضویت در دیدار، از امکانات ویژه مانند لیست‌های شخصی، امتیازدهی، نوشتن نقد و پیشنهادهای هوشمند بهره‌مند شوید.
                </p>
                <Link to="/signup" className="inline-block px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl">
                  ثبت‌نام رایگان
                </Link>
              </div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}

const trendingData = [
  {
    rank: 1,
    title: 'اوپنهایمر',
    titleEn: 'Oppenheimer',
    rating: 8.5,
    poster: demoImages.movies[8],
    change: 3,
    id: 9,
  },
  {
    rank: 2,
    title: 'دون',
    titleEn: 'Dune',
    rating: 8.0,
    poster: demoImages.movies[9],
    change: 5,
    id: 10,
  },
  {
    rank: 3,
    title: 'جوکر',
    titleEn: 'Joker',
    rating: 8.4,
    poster: demoImages.movies[10],
    change: 2,
    id: 11,
  },
  {
    rank: 4,
    title: 'شروع',
    titleEn: 'Inception',
    rating: 8.8,
    poster: demoImages.movies[6],
    change: -1,
    id: 7,
  },
  {
    rank: 5,
    title: 'بریکینگ بد',
    titleEn: 'Breaking Bad',
    rating: 9.5,
    poster: demoImages.series[0],
    change: 1,
    id: 1,
  },
  {
    rank: 6,
    title: 'دارک',
    titleEn: 'Dark',
    rating: 8.8,
    poster: demoImages.series[1],
    change: -2,
    id: 4,
  },
];

const actorsData = [
  {
    name: 'لئوناردو دی کاپریو',
    nameEn: 'Leonardo DiCaprio',
    image: demoImages.actors[0],
    moviesCount: 45,
  },
  {
    name: 'مارگو رابی',
    nameEn: 'Margot Robbie',
    image: demoImages.actors[1],
    moviesCount: 32,
  },
  {
    name: 'تیموتی شالامه',
    nameEn: 'Timothée Chalamet',
    image: demoImages.actors[2],
    moviesCount: 28,
  },
  {
    name: 'زندایا',
    nameEn: 'Zendaya',
    image: demoImages.actors[3],
    moviesCount: 24,
  },
  {
    name: 'کیلیان مورفی',
    nameEn: 'Cillian Murphy',
    image: demoImages.actors[0],
    moviesCount: 38,
  },
];

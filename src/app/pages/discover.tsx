import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { Sparkles, TrendingUp, Star, Flame, Clock, Award } from 'lucide-react';
import { MovieCard } from '../components/movie-card';
import { Link } from 'react-router';
import { moviePosters } from '../utils/image-placeholders';

export function DiscoverPage() {
  const categories = [
    { title: 'پرطرفدارترین‌ها', icon: <Flame className="w-5 h-5" />, color: 'from-red-500 to-orange-500' },
    { title: 'جدیدترین‌ها', icon: <Sparkles className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { title: 'برترین امتیازها', icon: <Star className="w-5 h-5" />, color: 'from-yellow-500 to-amber-500' },
    { title: 'ترندهای روز', icon: <TrendingUp className="w-5 h-5" />, color: 'from-cyan-500 to-blue-500' },
    { title: 'برندگان جوایز', icon: <Award className="w-5 h-5" />, color: 'from-violet-500 to-purple-500' },
    { title: 'به‌زودی', icon: <Clock className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">کشف کنید</h1>
            <p className="text-xl text-muted-foreground">دنیای بی‌پایان فیلم و سریال را کاوش کنید</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {categories.map((cat, idx) => (
              <div key={idx} className={`p-6 bg-gradient-to-br ${cat.color} rounded-2xl cursor-pointer hover:scale-105 transition-transform`}>
                <div className="text-white mb-2">{cat.icon}</div>
                <div className="text-white font-bold">{cat.title}</div>
              </div>
            ))}
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">پیشنهاد ویژه برای شما</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {mockMovies.map((movie, idx) => (
                <Link key={idx} to={`/movie/${idx + 1}`}>
                  <MovieCard {...movie} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const mockMovies = [
  { title: 'اینترستلار', titleEn: 'Interstellar', year: 2014, rating: 8.7, poster: moviePosters.interstellar, genre: 'علمی-تخیلی' },
  { title: 'گادفادر', titleEn: 'The Godfather', year: 1972, rating: 9.2, poster: moviePosters.godfather, genre: 'جنایی' },
  { title: 'دارک نایت', titleEn: 'The Dark Knight', year: 2008, rating: 9.0, poster: moviePosters.darkKnight, genre: 'اکشن' },
  { title: 'شاوشنک', titleEn: 'Shawshank', year: 1994, rating: 9.3, poster: moviePosters.shawshank, genre: 'درام' },
  { title: 'پالپ فیکشن', titleEn: 'Pulp Fiction', year: 1994, rating: 8.9, poster: moviePosters.pulpFiction, genre: 'جنایی' },
];

import { useState, useEffect } from 'react';
import { Info, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';

const heroMovies = [
  {
    id: 1,
    title: 'اینترستلار',
    titleEn: 'Interstellar',
    description: 'گروهی از مسافران فضایی وارد یک کرم‌چاله در کنار زحل می‌شوند تا از گرسنگی و انقراض نسل بشر جلوگیری کنند.',
    rating: 8.7,
    year: 2014,
    genre: 'علمی-تخیلی، ماجراجویی',
    backdrop: '/assets/banners/cinema-wide.jpg',
  },
  {
    id: 2,
    title: 'شوالیه تاریکی',
    titleEn: 'The Dark Knight',
    description: 'بتمن باید یکی از بزرگترین آزمایشات روانی و فیزیکی را که توسط جوکر برای مبارزه با جنایت در شهر گاتهام انجام می‌شود، بپذیرد.',
    rating: 9.0,
    year: 2008,
    genre: 'اکشن، جنایی، درام',
    backdrop: '/assets/banners/film-wide.jpg',
  },
  {
    id: 3,
    title: 'ارباب حلقه‌ها: بازگشت پادشاه',
    titleEn: 'The Lord of the Rings',
    description: 'گندالف و آراگورن لشکر مردان را به نبرد با نیروهای ساورون فرا می‌خوانند تا توجه او را از فرودو و سَم که به مردور نزدیک می‌شوند، منحرف کنند.',
    rating: 9.0,
    year: 2003,
    genre: 'اکشن، ماجراجویی، فانتزی',
    backdrop: '/assets/banners/theater-wide.jpg',
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const movie = heroMovies[currentIndex];

  return (
    <div className="relative h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/40 to-background z-10" />

          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-4 py-1.5 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full">
                    <span className="text-sm font-medium text-primary">پیشنهاد ویژه</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 backdrop-blur-xl border border-accent/30 rounded-full">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">ترند هفته</span>
                  </div>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold mb-3 leading-tight">
                  {movie.title}
                </h1>
                <div className="text-xl lg:text-2xl text-muted-foreground mb-6 font-light">
                  {movie.titleEn}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-xl border border-accent/30 rounded-2xl">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="text-lg font-bold text-accent">{movie.rating}</span>
                  </div>
                  <span className="text-lg text-muted-foreground">{movie.year}</span>
                  <span className="text-lg text-muted-foreground">{movie.genre}</span>
                </div>

                <p className="text-lg text-foreground/90 mb-8 leading-relaxed line-clamp-3">
                  {movie.description}
                </p>

                <div className="flex items-center gap-4">
                  <Link to={`/movie/${movie.id}`} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-l from-primary to-secondary rounded-2xl text-white font-medium shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
                    <Info className="w-5 h-5" />
                    <span className="font-medium">مشاهده جزئیات</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length)}
          className="p-3 bg-card/50 backdrop-blur-xl border border-border rounded-full hover:bg-card transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-2 bg-primary'
                  : 'w-2 h-2 bg-muted-foreground/50 hover:bg-muted-foreground'
              } rounded-full`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % heroMovies.length)}
          className="p-3 bg-card/50 backdrop-blur-xl border border-border rounded-full hover:bg-card transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

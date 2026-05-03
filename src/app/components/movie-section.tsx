import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './movie-card';
import { useRef } from 'react';

interface MovieSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const movies = [
  {
    id: 1,
    title: 'گادفادر',
    titleEn: 'The Godfather',
    year: 1972,
    rating: 9.2,
    poster: '/assets/movies/cinema.jpg',
    genre: 'جنایی، درام',
  },
  {
    id: 2,
    title: 'فرار از زندان شاوشنک',
    titleEn: 'The Shawshank Redemption',
    year: 1994,
    rating: 9.3,
    poster: '/assets/movies/cinema.jpg',
    genre: 'درام',
  },
  {
    id: 3,
    title: 'لیست شیندلر',
    titleEn: "Schindler's List",
    year: 1993,
    rating: 9.0,
    poster: '/assets/movies/cinema.jpg',
    genre: 'تاریخی، درام',
  },
  {
    id: 4,
    title: 'پالپ فیکشن',
    titleEn: 'Pulp Fiction',
    year: 1994,
    rating: 8.9,
    poster: '/assets/movies/cinema.jpg',
    genre: 'جنایی، درام',
  },
  {
    id: 5,
    title: 'باشگاه مشت‌زنی',
    titleEn: 'Fight Club',
    year: 1999,
    rating: 8.8,
    poster: '/assets/movies/cinema.jpg',
    genre: 'درام',
  },
  {
    id: 6,
    title: 'ماتریکس',
    titleEn: 'The Matrix',
    year: 1999,
    rating: 8.7,
    poster: '/assets/movies/cinema.jpg',
    genre: 'علمی-تخیلی، اکشن',
  },
];

export function MovieSection({ title, subtitle, icon }: MovieSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-primary/30">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('right')}
            className="p-3 bg-muted hover:bg-muted/80 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('left')}
            className="p-3 bg-muted hover:bg-muted/80 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-[200px] lg:w-[240px]">
            <MovieCard {...movie} />
          </div>
        ))}
      </div>
    </section>
  );
}

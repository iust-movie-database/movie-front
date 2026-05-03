import { Star, Heart, Bookmark, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { OptimizedImage } from './optimized-image';

interface MovieCardProps {
  title: string;
  titleEn: string;
  year: number;
  rating: number;
  poster: string;
  genre?: string;
  id?: string | number;
}

export function MovieCard({ title, titleEn, year, rating, poster, genre, id = 1 }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`Action: ${action} for ${title}`);
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-muted">
        <OptimizedImage
          src={poster}
          alt={title}
          type="movie"
          index={id}
          title={title}
          subtitle={titleEn}
          year={year}
          rating={rating}
          className="w-full h-full"
        />
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 flex flex-col justify-end p-5"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleButtonClick(e, 'favorite')}
                className="p-3 bg-card/50 backdrop-blur-xl rounded-full hover:bg-red-500 hover:text-white transition-all hover:scale-110 active:scale-95"
              >
                <Heart className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={(e) => handleButtonClick(e, 'watchlist')}
                className="p-3 bg-card/50 backdrop-blur-xl rounded-full hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-95"
              >
                <Bookmark className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={(e) => handleButtonClick(e, 'info')}
                className="p-3 bg-primary rounded-full hover:bg-secondary transition-all hover:scale-110 active:scale-95"
              >
                <Info className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          </motion.div>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-xl rounded-full">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="text-sm font-bold text-white">{rating}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1 px-1">
        <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="text-sm text-muted-foreground line-clamp-1">{titleEn}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{year}</span>
          {genre && (
            <>
              <span>•</span>
              <span className="line-clamp-1">{genre}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

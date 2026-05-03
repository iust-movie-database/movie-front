import { TrendingUp, Star, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

interface TrendingCardProps {
  rank: number;
  title: string;
  titleEn: string;
  rating: number;
  poster: string;
  change: number;
  id?: string | number;
}

export function TrendingCard({ rank, title, titleEn, rating, poster, change, id = 1 }: TrendingCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/movie/${id || rank}`)}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all cursor-pointer group"
    >
      <div className="text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors w-12 text-center">
        {rank}
      </div>

      <div className="relative w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
          <div className="p-1.5 bg-primary rounded-full">
            <Info className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="text-sm text-muted-foreground line-clamp-1">{titleEn}</div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="font-medium text-accent">{rating}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs ${
            change > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            <TrendingUp className={`w-3.5 h-3.5 ${change < 0 ? 'rotate-180' : ''}`} />
            <span className="font-medium">{Math.abs(change)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { toPersianDigits, translations as t } from "../../../i18n/fa";
import { RatingDisplay } from "./RatingDisplay";
import { SaveButton } from "./SaveButton";
import type { MovieData } from "../../types";
import type { WatchlistStatus } from "../../../services/api";

interface MovieCardProps {
  movie: MovieData;
  onClick?: () => void;
  showTypeBadge?: boolean;
  saveStatus?: WatchlistStatus | null;
  onSave?: (status: WatchlistStatus | null) => void;
  isLoggedIn?: boolean;
}

export function MovieCard({ 
  movie, 
  onClick, 
  showTypeBadge = false,
  saveStatus = null,
  onSave,
  isLoggedIn = false
}: MovieCardProps) {
  const [saved, setSaved] = useState(saveStatus !== null);
  const [currentStatus, setCurrentStatus] = useState<WatchlistStatus | null>(saveStatus);

  useEffect(() => {
    setSaved(saveStatus !== null);
    setCurrentStatus(saveStatus);
  }, [saveStatus]);

  const handleToggle = () => {
    if (!isLoggedIn) {
      console.log('Please login to save titles');
      return;
    }
    
    if (!saved && onSave) {
      onSave('want_to_watch');
      setSaved(true);
      setCurrentStatus('want_to_watch');
    } else if (saved && onSave) {
    }
  };

  const handleSelectStatus = (status: WatchlistStatus) => {
    if (onSave) {
      onSave(status);
      setSaved(true);
      setCurrentStatus(status);
    }
  };

  const handleRemove = () => {
    if (onSave) {
      onSave(null);
      setSaved(false);
      setCurrentStatus(null);
    }
  };

  return (
    <div 
      onClick={onClick} 
      className="relative group rounded-xl overflow-hidden bg-card border border-white/10 dark:border-white/10 light:border-black/15 hover:border-white/25 dark:hover:border-white/25 light:hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 dark:hover:shadow-black/60 light:hover:shadow-primary/20 cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.img}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        
        {showTypeBadge && (
          <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-white text-[9px] font-bold rounded ${
            movie.type === "TV" ? "bg-blue-600/80" : "bg-purple-600/80"
          }`}>
            {movie.type === "TV" ? t.common.tvSeries : t.common.movie}
          </span>
        )}
        
        {/* دکمه Save جدید با سه وضعیت */}
        {onSave && (
          <div className="absolute top-2.5 right-2.5" onClick={(e) => e.stopPropagation()}>
            <SaveButton
              saved={saved}
              status={currentStatus}
              onToggle={handleToggle}
              onSelectStatus={handleSelectStatus}
              onRemove={handleRemove}
            />
          </div>
        )}
        
        <div className="absolute bottom-2.5 left-2.5">
          <RatingDisplay rating={movie.rating} size="sm" />
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm leading-tight mb-0.5 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-white/35 dark:text-white/35 light:text-black/40 text-[11px] leading-tight mb-2 line-clamp-1 font-light">
          {movie.originalTitle}
        </p>
        <div className="flex items-center gap-1.5 text-white/40 dark:text-white/40 light:text-black/50 text-xs mb-2">
          <span>{toPersianDigits(movie.year)}</span>
          <span>·</span>
          <span>{movie.duration}</span>
          <span>·</span>
          <span className="border border-white/25 dark:border-white/25 light:border-black/30 px-1 rounded text-[10px]">
            {movie.age}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {movie.genres.slice(0, 2).map((g) => (
            <span key={g} className="px-1.5 py-0.5 bg-white/8 dark:bg-white/8 light:bg-black/8 rounded text-white/50 dark:text-white/50 light:text-black/60 text-[10px]">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
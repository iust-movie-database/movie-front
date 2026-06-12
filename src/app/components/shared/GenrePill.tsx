import { genreIcons } from "../../../i18n/fa";

interface GenrePillProps {
  genre: string;
  active?: boolean;
  onClick?: () => void;
  showIcon?: boolean; 
}

export function GenrePill({ genre, active, onClick, showIcon = false }: GenrePillProps) {
  const IconComponent = genreIcons[genre];
  
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? "bg-primary text-white"
          : "bg-white/10 text-white/70 hover:bg-white/20"
      }`}
    >
      {showIcon && IconComponent && (
        <IconComponent size={12} className="inline ml-1" />
      )}
      {genre}
    </button>
  );
}
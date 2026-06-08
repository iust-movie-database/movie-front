import { genreIcons } from "../../../i18n/fa";

export function GenrePill({ genre, active = false, onClick }: { genre: string; active?: boolean; onClick?: () => void }) {
  const IconComponent = genreIcons[genre];

  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-md overflow-hidden ${
        active
          ? "bg-gradient-to-br from-primary/25 to-accent/20 border-2 border-primary/50 text-white shadow-lg shadow-primary/40"
          : "bg-gradient-to-br from-white/8 to-white/5 dark:from-white/8 dark:to-white/5 light:from-black/8 light:to-black/5 border border-white/20 dark:border-white/20 light:border-black/20 text-foreground/80 hover:from-primary/15 hover:to-accent/10 hover:border-primary/40 hover:text-foreground"
      }`}
      style={{
        background: active
          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(167, 139, 250, 0.20) 100%)'
          : undefined
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        active ? 'from-primary/10 to-accent/5' : 'from-white/5 to-transparent dark:from-white/5 light:from-black/5'
      }`} />

      {IconComponent && (
        <IconComponent
          size={16}
          className={`relative z-10 flex-shrink-0 ${
            active
              ? 'text-primary-foreground drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]'
              : 'text-primary/80 dark:text-primary/80 light:text-primary/80 group-hover:text-primary'
          }`}
        />
      )}

      <span className="relative z-10 tracking-wide">{genre}</span>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
    </button>
  );
}

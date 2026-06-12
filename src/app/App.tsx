import { useState, useRef, useEffect } from "react";
import {
  Star, Bookmark, BookmarkCheck, Search, ChevronLeft, ChevronRight,
  ChevronDown, X, Edit2, Trash2, Calendar, Clock, Sun, Moon, Award, Filter, Mail, List
} from "lucide-react";
import { ReviewModal } from "./components/ReviewModal";
import { translations as t, toPersianDigits, formatPersianNumber, genreIcons } from "../i18n/fa";
import { AuthFlow } from "./components/AuthFlow";
import {
  RatingDisplay,
  HalfStarRating,
  GenrePill,
  SaveButton,
  FilterChip,
  BackButton,
  MovieCard,
  SectionHeader,
} from "./components/shared";
import { WatchlistModal } from "./components/WatchlistModal";
import { MOVIES, TV_SERIES, COMING_SOON, SEED_RATINGS } from "./data/mockData";
import type { Page, MovieData, RatedEntry } from "./types";
import { 
  getUserProfile, 
  getUserWatchlist,
  type UserProfile,
  type WatchlistItem,
  type UserRating,
  addToWatchlist,
  removeFromWatchlist,
  getUserRatings,
  addOrUpdateRating,
  deleteRating,
  updateProfile,
  deleteProfile,
  updateWatchlistStatus,      
  type WatchlistStatus,
  getWatchlistFromLocalStorage,
  saveWatchlistToLocalStorage,
  updateWatchlistInLocalStorage,
  syncWatchlistFromServer,
} from '../services/api';

import { 
  getHero, 
  getPopularGenres, 
  getTopMovies, 
  getTopSeries, 
  getRecommendations, 
  getComingSoon,
  getTitleDetails,
  getTitleCast,
  getTitleCrew,
  getTitleAwards,
  getTitleReviews,
  getSimilarTitles,
  getSeasons,
  getEpisodes,
  searchTitles
} from "../services/api";

import type { 
  HeroTitle, 
  PopularGenre, 
  TopMovie, 
  TopSeries, 
  Recommendation,
  TitleDetails,
  CastMember,
  CrewMember,
  Review,
  SimilarTitle,
  Season,
  Episode,
  SearchResult,
  SearchParams
} from "../services/api";

function convertHeroToMovieData(hero: HeroTitle): MovieData {
  return {
    id: hero.title_id,
    title: hero.name_fa,
    originalTitle: hero.name_en,
    img: hero.poster_url || '/placeholder.jpg',
    rating: hero.score,
    year: hero.release_year,
    duration: hero.duration_mins ? `${hero.duration_mins} دقیقه` : 
              hero.total_seasons ? `${hero.total_seasons} فصل` : 'نامشخص',
    age: hero.age_rating,
    summary: hero.summary,
    genres: hero.genres.split(', '),
    type: hero.t_type === 'S' ? 'TV' : 'Movie',
    voteCount: 0,
    similarMovieIds: [],
    cast: [],
    crew: [],
    awards: [],
    reviews: [],
  };
}

function convertTopMovieToMovieData(movie: TopMovie): MovieData {
  return {
    id: movie.title_id,
    title: movie.name_fa,
    originalTitle: movie.name_en,
    img: movie.poster_url || '/placeholder.jpg',
    rating: movie.score,
    year: movie.release_year,
    duration: movie.duration_mins ? `${movie.duration_mins} دقیقه` : 'نامشخص',
    age: movie.age_rating,
    summary: '',
    genres: movie.genres.split(', '),
    type: 'Movie',
    voteCount: 0,
    similarMovieIds: [],
    cast: [],
    crew: [],
    awards: [],
    reviews: [],
  };
}

function convertTopSeriesToMovieData(series: TopSeries): MovieData {
  return {
    id: series.title_id,
    title: series.name_fa,
    originalTitle: series.name_en,
    img: series.poster_url || '/placeholder.jpg',
    rating: series.score,
    year: series.release_year,
    duration: series.total_episodes ? `${series.total_episodes} قسمت` : 'نامشخص',
    age: series.age_rating,
    summary: '',
    genres: series.genres.split(', '),
    type: 'TV',
    voteCount: 0,
    similarMovieIds: [],
    cast: [],
    crew: [],
    awards: [],
    reviews: [],
  };
}

function convertRecommendationToMovieData(rec: Recommendation): MovieData {
  return {
    id: rec.title_id,
    title: rec.name_fa,
    originalTitle: rec.name_en,
    img: rec.poster_url || '/placeholder.jpg',
    rating: rec.score,
    year: rec.release_year,
    duration: rec.duration_mins ? `${rec.duration_mins} دقیقه` : 
              rec.total_seasons ? `${rec.total_seasons} فصل` : 'نامشخص',
    age: rec.age_rating,
    summary: '',
    genres: rec.genres.split(', '),
    type: rec.t_type === 'S' ? 'TV' : 'Movie',
    voteCount: 0,
    similarMovieIds: [],
    cast: [],
    crew: [],
    awards: [],
    reviews: [],
  };
}

function convertSearchResultToMovieData(item: SearchResult): MovieData {
  let durationText = 'نامشخص';
  if (item.duration_mins) {
    durationText = `${item.duration_mins} دقیقه`;
  } else if (item.total_seasons) {
    durationText = `${item.total_seasons} فصل`;
  } else if (item.total_episodes) {
    durationText = `${item.total_episodes} قسمت`;
  }
  
  return {
    id: item.title_id,
    title: item.name_fa,
    originalTitle: item.name_en,
    img: item.poster_url || '/placeholder.jpg',
    rating: item.score,
    year: item.release_year,
    duration: durationText,
    age: item.age_rating || 'PG-13',  
    summary: '',
    genres: item.genres.split(', '),
    type: item.t_type === 'S' ? 'TV' : 'Movie',
    voteCount: item.vote_count || 0,
    similarMovieIds: [],
    cast: [],
    crew: [],
    awards: [],
    reviews: [],
  };
}

async function syncWatchlistToServerAndLocal(
  titleId: number, 
  status: WatchlistStatus, 
  movieData: MovieData,
  savedBefore: boolean
): Promise<boolean> {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    let backendStatus = '';
    if (status === 'want_to_watch') backendStatus = 'Want to Watch';
    else if (status === 'watching') backendStatus = 'Watching';
    else if (status === 'watched') backendStatus = 'Watched';
    
    const localItemData: Partial<WatchlistItem> = {
      title_id: titleId,
      name_fa: movieData.title,
      name_en: movieData.originalTitle,
      poster_url: movieData.img,
      genres: movieData.genres.join(', '),
      release_year: movieData.year,
      t_type: movieData.type === 'TV' ? 'S' : 'M',
      age_rating: movieData.age,
      duration_mins: null,
      total_seasons: movieData.type === 'TV' ? (parseInt(movieData.duration) || null) : null,
      total_episodes: null,
    };
    
    updateWatchlistInLocalStorage(titleId, status, localItemData);
    
    const response = await fetch(`http://localhost:8000/saved/${titleId}`, {
      method: savedBefore ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: backendStatus }),
    });
    
    if (!response.ok) {
      console.warn('Server sync failed, but data saved locally');
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing watchlist:', error);
    return false;
  }
}

// ── Navigation ─────────────────────────────────────────────────────────────────

function Nav({
  page, setPage, globalSearch, setGlobalSearch, isLoggedIn, onLogin, onLogout, theme, onThemeToggle, currentUser,
}: {
  page: Page;
  setPage: (p: Page, movieData?: MovieData) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
  currentUser: { user_id: number; username: string; email: string } | null;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [authReason, setAuthReason] = useState<"profile" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const allContent: MovieData[] = [...MOVIES, ...TV_SERIES];
  const dropdownResults = globalSearch.trim().length > 1
    ? allContent.filter((m) => m.title.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 6)
    : [];
  const showDropdown = searchOpen && globalSearch.trim().length > 1;

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openSearch() {
    setSearchOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { setSearchOpen(false); setGlobalSearch(""); }
    if (e.key === "Enter" && globalSearch.trim()) {
      setPage("browse");
      setSearchOpen(false);
    }
  }

  function handleResultClick(m: MovieData) {
    setSearchOpen(false);
    setPage(m.type === "TV" ? "tv" : "movie", m);
  }

  function clearSearch() {
    setGlobalSearch("");
    setSearchOpen(false);
  }

  const links: { id: Page; label: string }[] = [
    { id: "home", label: t.nav.home },
    { id: "browse", label: t.nav.discover },
    ...(isLoggedIn ? [{ id: "profile" as Page, label: t.nav.profile }] : []),
  ];

  return (
    <>
      <nav ref={navRef} className="sticky top-0 z-50 bg-background/96 backdrop-blur-md border-b border-border">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center gap-8">
          <button onClick={() => setPage("home")} className="flex-shrink-0 flex items-center gap-1.5 mr-2">
            <span className="text-primary font-bold text-2xl tracking-tight leading-none" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.appName}</span>
          </button>

          {!searchOpen && (
            <div className="flex items-center gap-1 flex-1">
              {links.map((l) => {
                const active = page === l.id;
                return (
                  <button key={l.id} onClick={() => setPage(l.id)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all group ${active ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}>
                    {l.label}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-primary transition-all duration-200 ${active ? "w-4/5 opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-60"}`} />
                  </button>
                );
              })}
            </div>
          )}

          {searchOpen && (
            <div className="flex-1 relative">
              <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                ref={inputRef}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.browse.searchPlaceholder}
                className="w-full bg-[#1A1A1A] border border-white/12 rounded-lg pr-10 pl-10 py-2 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
              {globalSearch && (
                <button onClick={clearSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 flex-shrink-0">
            {searchOpen ? (
              <button onClick={() => { setSearchOpen(false); setGlobalSearch(""); }}
                className="text-white/40 dark:text-white/40 light:text-black/40 hover:text-white dark:hover:text-white light:hover:text-black text-sm transition-colors px-2">
                {t.nav.cancel}
              </button>
            ) : isLoggedIn ? (
              <>
                <button
                  onClick={onThemeToggle}
                  className="p-2 text-white/45 dark:text-white/45 light:text-black/45 hover:text-white dark:hover:text-white light:hover:text-black transition-all rounded-lg hover:bg-white/6 dark:hover:bg-white/6 light:hover:bg-black/6"
                  title={theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
                >
                  {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <button onClick={openSearch} className="p-2 text-white/45 dark:text-white/45 light:text-black/45 hover:text-white dark:hover:text-white light:hover:text-black transition-colors rounded-lg hover:bg-white/6 dark:hover:bg-white/6 light:hover:bg-black/6">
                  <Search size={17} />
                </button>
                <div className="w-px h-5 bg-white/10 dark:bg-white/10 light:bg-black/10" />
                <button
                  onClick={() => setPage("profile")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/6 border border-white/12 hover:bg-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E50914] to-[#5A0009] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {currentUser?.username?.slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <span className="text-white/80 text-sm font-medium">{currentUser?.username || 'user'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-1.5 rounded-lg border border-white/15 dark:border-white/15 light:border-black/15 text-white/40 dark:text-white/40 light:text-black/40 text-sm font-medium hover:border-white/30 dark:hover:border-white/30 light:hover:border-black/30 hover:text-white/70 dark:hover:text-white/70 light:hover:text-black/70 transition-all"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onThemeToggle}
                  className="p-2 text-white/45 dark:text-white/45 light:text-black/45 hover:text-white dark:hover:text-white light:hover:text-black transition-all rounded-lg hover:bg-white/6 dark:hover:bg-white/6 light:hover:bg-black/6"
                  title={theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
                >
                  {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <button onClick={openSearch} className="p-2 text-white/45 dark:text-white/45 light:text-black/45 hover:text-white dark:hover:text-white light:hover:text-black transition-colors rounded-lg hover:bg-white/6 dark:hover:bg-white/6 light:hover:bg-black/6">
                  <Search size={17} />
                </button>
                <div className="w-px h-5 bg-white/10 dark:bg-white/10 light:bg-black/10" />
                <button onClick={() => { setAuthReason(null); setAuthModal("login"); }} className="px-4 py-1.5 rounded-lg border border-border text-foreground/70 text-sm font-medium hover:border-primary/40 hover:text-foreground transition-all">
                  {t.nav.login}
                </button>
                <button onClick={() => { setAuthReason(null); setAuthModal("signup"); }} className="px-4 py-1.5 rounded-lg bg-primary border border-primary text-white text-sm font-medium hover:bg-accent transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40">
                  {t.nav.signup}
                </button>
              </>
            )}
          </div>
        </div>

        {showDropdown && (
          <div className="absolute left-0 right-0 top-full bg-background/98 backdrop-blur-md border-b border-white/8 dark:border-white/8 light:border-black/10 shadow-2xl z-50">
            <div className="max-w-[1440px] mx-auto px-8 py-3">
              {dropdownResults.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {dropdownResults.map((m) => (
                      <button key={m.id} onClick={() => handleResultClick(m)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/6 dark:hover:bg-white/6 light:hover:bg-black/5 transition-colors text-left group">
                        <img src={m.img} alt={m.title} className="w-10 h-14 object-cover rounded-lg flex-shrink-0 border border-white/10 dark:border-white/10 light:border-black/15" />
                        <div className="min-w-0">
                          <p className="text-white dark:text-white light:text-black text-sm font-medium truncate group-hover:text-primary transition-colors">{m.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`px-1.5 py-0 text-[9px] font-bold rounded ${m.type === "TV" ? "bg-blue-600/70 text-white" : "bg-purple-600/70 text-white"}`}>{m.type === "TV" ? t.common.tvSeries : t.common.movie}</span>
                            <span className="text-white/35 dark:text-white/35 light:text-black/40 text-xs">{toPersianDigits(m.year)}</span>
                            <RatingDisplay rating={m.rating} size="sm" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => { setPage("browse"); setSearchOpen(false); }}
                    className="w-full py-2 text-center text-primary text-sm font-medium hover:text-red-400 transition-colors border-t border-white/6">
                    {t.home.seeAllInDiscover} "{globalSearch}" ←
                  </button>
                </>
              ) : (
                <div className="py-4 text-center text-white/30 dark:text-white/30 light:text-black/40 text-sm">{t.home.noTitlesFound} "{globalSearch}"</div>
              )}
            </div>
          </div>
        )}
      </nav>
      {authModal && (
        <AuthFlow
          initialScreen={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={() => { onLogin(); setAuthModal(null); }}
          reason={authReason}
        />
      )}
    </>
  );
}

// ── Page 1: Design System ──────────────────────────────────────────────────────

function DesignSystemPage() {
  const [genreActive, setGenreActive] = useState(false);
  const [btnSaved, setBtnSaved] = useState(false);
  const [filters, setFilters] = useState(["Genre: Drama", "2023–2024", "Rating: 8+"]);

  const colors = [
    { name: "Background", hex: "#0A0A0A", extra: "border border-white/15" },
    { name: "Surface", hex: "#1A1A1A", extra: "" },
    { name: "Surface 2", hex: "#2A2A2A", extra: "" },
    { name: "Accent Red", hex: "#E50914", extra: "" },
    { name: "Text White", hex: "#F5F5F5", extra: "" },
    { name: "Text Muted", hex: "#6B7280", extra: "" },
    { name: "Rating Gold", hex: "#F59E0B", extra: "" },
    { name: "Border", hex: "rgba(255,255,255,0.10)", extra: "border border-white/15" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <div className="mb-12">
        <p className="text-primary text-sm font-mono uppercase tracking-widest mb-2">Design Language</p>
        <h1
          className="text-5xl font-bold text-white mb-3"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          CineBase Design System
        </h1>
        <p className="text-white/40 text-base">
          UI component library, tokens, and visual language for the CineBase platform.
        </p>
      </div>

      <section className="mb-14">
        <h2
          className="text-xl font-bold text-white mb-6 uppercase tracking-wide"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Color Palette
        </h2>
        <div className="grid grid-cols-8 gap-4">
          {colors.map((c) => (
            <div key={c.name}>
              <div
                className={`h-16 rounded-xl mb-3 ${c.extra}`}
                style={{ background: c.hex }}
              />
              <p className="text-white text-xs font-medium mb-0.5">{c.name}</p>
              <p className="text-white/30 text-[10px] font-mono">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2
          className="text-xl font-bold text-white mb-6 uppercase tracking-wide"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Typography
        </h2>
        <div className="bg-[#1A1A1A] rounded-2xl p-10 border border-white/8 space-y-8">
          <div>
            <span className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono block mb-2">
              Heading 1 — Oswald 56px / 700
            </span>
            <h1
              className="text-6xl font-bold text-white leading-none"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              The Grand Illusion
            </h1>
          </div>
          <div className="border-t border-white/8 pt-8">
            <span className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono block mb-2">
              Heading 2 — Oswald 36px / 700
            </span>
            <h2
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Featured This Week
            </h2>
          </div>
          <div className="border-t border-white/8 pt-8">
            <span className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono block mb-2">
              Card Title — DM Sans 16px / 600
            </span>
            <p className="text-base font-semibold text-white">Dune: Part Two</p>
          </div>
          <div className="border-t border-white/8 pt-8">
            <span className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono block mb-2">
              Body — DM Sans 14px / 400
            </span>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
              Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against
              the conspirators who destroyed his family. Messianic fervor sweeps across the universe.
            </p>
          </div>
          <div className="border-t border-white/8 pt-8">
            <span className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono block mb-2">
              Metadata Label — DM Sans 11px / Mono Uppercase
            </span>
            <p className="text-xs text-white/35 font-mono uppercase tracking-widest">
              2024 · PG-13 · 2h 46m
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2
          className="text-xl font-bold text-white mb-6 uppercase tracking-wide"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Components
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/8">
            <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono mb-5">Movie Card</p>
            <div className="w-44">
              <MovieCard movie={MOVIES[0]} />
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/8 space-y-8">
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono mb-4">Save Button</p>
              <div className="flex gap-3">
                <SaveButton saved={false} status={null} onToggle={()=>{}} onSelectStatus={()=>{}} onRemove={()=>{}} />
                <SaveButton saved={true} status="watched" onToggle={()=>{}} onSelectStatus={()=>{}} onRemove={()=>{}} />
                <SaveButton saved={btnSaved} status={btnSaved ? "watched" : null} onToggle={()=>setBtnSaved(!btnSaved)} onSelectStatus={()=>{}} onRemove={()=>{}} />
              </div>
            </div>
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono mb-4">Rating Display</p>
              <div className="flex gap-6 items-center">
                <RatingDisplay rating={6.8} size="sm" />
                <RatingDisplay rating={7.9} size="md" />
                <RatingDisplay rating={9.1} size="lg" />
              </div>
            </div>
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono mb-4">Genre Pills</p>
              <div className="flex flex-wrap gap-2">
                <GenrePill genre="درام" active={genreActive} onClick={() => setGenreActive(!genreActive)} />
                <GenrePill genre="علمی-تخیلی" />
                <GenrePill genre="اکشن" />
                <GenrePill genre="ترسناک" />
                <GenrePill genre="کمدی" />
              </div>
            </div>
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono mb-4">Filter Chips</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <FilterChip
                    key={f}
                    label={f}
                    onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}
                  />
                ))}
                {filters.length === 0 && (
                  <button
                    onClick={() => setFilters(["Genre: Drama", "2023–2024", "Rating: 8+"])}
                    className="text-primary text-xs"
                  >
                    Reset demo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Page 2: Homepage (با اتصال به API) ─────────────────────────────────────────
function getGenreGradient(genreName: string): string {
  const gradients: Record<string, string> = {
    'اکشن': 'from-red-500 to-orange-500',
    'درام': 'from-purple-500 to-pink-500',
    'کمدی': 'from-yellow-500 to-amber-500',
    'ترسناک': 'from-gray-700 to-gray-900',
    'علمی-تخیلی': 'from-blue-500 to-purple-500',
    'فانتزی': 'from-emerald-500 to-teal-500',
    'عاشقانه': 'from-rose-500 to-pink-500',
    'جنایی': 'from-gray-600 to-gray-800',
    'تاریخی': 'from-amber-600 to-orange-600',
    'هیجان‌انگیز': 'from-indigo-500 to-blue-500',
    'ماجراجویی': 'from-green-500 to-emerald-500',
    'معمایی': 'from-slate-600 to-gray-700',
    'خانوادگی': 'from-cyan-500 to-blue-500',
    'جنگی': 'from-red-700 to-red-900',
  };
  return gradients[genreName] || 'from-primary to-secondary';
}

function HomePage({
  setPage,
  globalSearch,
  setGlobalSearch,
  isLoggedIn,
  onAuthRequest,
}: {
  setPage: (p: Page, movieData?: MovieData) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isLoggedIn: boolean;
  onAuthRequest: () => void;
}) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [heroSavedStatus, setHeroSavedStatus] = useState<Record<number, { saved: boolean; status: WatchlistStatus | null }>>({});
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [pendingHeroItem, setPendingHeroItem] = useState<MovieData | null>(null);
  const [heroData, setHeroData] = useState<HeroTitle[]>([]);
  const [popularGenres, setPopularGenres] = useState<PopularGenre[]>([]);
  const [topMovies, setTopMovies] = useState<TopMovie[]>([]);
  const [topSeries, setTopSeries] = useState<TopSeries[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [comingSoon, setComingSoon] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // ریکامندیشن‌ها را جداگانه fetch کن
  useEffect(() => {
    async function fetchRecommendations() {
      if (!isLoggedIn) {
        console.log('👤 User not logged in, skipping recommendations');
        setRecommendations([]);
        return;
      }
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('⚠️ User logged in but no token found');
        setRecommendations([]);
        return;
      }
      
      try {
        console.log('🔄 Fetching recommendations...');
        const recs = await getRecommendations(5);
        console.log(`📺 Recommendations received: ${recs.length} items`);
        setRecommendations(recs);
      } catch (err) {
        console.error('❌ Recommendations error:', err);
        setRecommendations([]);
      }
    }
    
    fetchRecommendations();
  }, [isLoggedIn]); // فقط وقتی isLoggedIn تغییر کند اجرا می‌شود

  useEffect(() => {
    async function fetchHomepageData() {
      setIsLoading(true);
      setApiError(null);
      try {
        const hero = await getHero(4);
        setHeroData(hero);
        
        const genres = await getPopularGenres(5);
        setPopularGenres(genres);
        
        const movies = await getTopMovies(5);
        setTopMovies(movies);
        
        const series = await getTopSeries(5);
        setTopSeries(series);
        
        try {
          const coming = await getComingSoon(5);
          setComingSoon(coming);
        } catch (err) {
          console.log('Coming soon endpoint not available');
          setComingSoon([]);
        }
        
        if (isLoggedIn) {
          try {
            const recs = await getRecommendations(5);
            setRecommendations(recs);
          } catch (err) {
            console.log('Recommendations not available:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setApiError('خطا در دریافت اطلاعات از سرور');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHomepageData();
  }, [isLoggedIn]);

  const heroSlides = heroData.map(convertHeroToMovieData);
  const hero = heroSlides[heroIndex] || heroSlides[0];

  useEffect(() => {
    async function checkWatchlistStatus() {
      if (!isLoggedIn || heroSlides.length === 0) return;
      
      try {
        const watchlist = await getUserWatchlist(true);
        const statusMap: Record<number, { saved: boolean; status: WatchlistStatus | null }> = {};
        
        heroSlides.forEach(slide => {
          const found = watchlist.find(item => item.title_id === slide.id);
          if (found) {
            statusMap[slide.id] = { saved: true, status: found.status };
          } else {
            statusMap[slide.id] = { saved: false, status: null };
          }
        });
        
        setHeroSavedStatus(statusMap);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    checkWatchlistStatus();
  }, [isLoggedIn, heroSlides]);

  useEffect(() => {
    if (isPaused || heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  function goToSlide(index: number) {
    setHeroIndex(index);
  }

  function nextSlide() {
    setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  }

  function prevSlide() {
    setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }

  function filterContent(items: MovieData[]) {
    return items.filter((m) => {
      const matchesGenre = !activeGenre || m.genres.includes(activeGenre);
      const matchesSearch = !globalSearch.trim() || m.title.toLowerCase().includes(globalSearch.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }

  const isFiltering = !!activeGenre || !!globalSearch.trim();
  
  const allContentFromAPI: MovieData[] = [
    ...topMovies.map(convertTopMovieToMovieData),
    ...topSeries.map(convertTopSeriesToMovieData),
  ];
  
  const handleSaveClick = (movie: MovieData) => {
    if (!isLoggedIn) {
      onAuthRequest();
      return;
    }
    setPendingHeroItem(movie);
    setShowWatchlistModal(true);
  };

  const handleSelectList = async (status: WatchlistStatus) => {
    if (!pendingHeroItem || !status || !isLoggedIn) return;
    
    const isSaved = heroSavedStatus[pendingHeroItem.id]?.saved || false;
    
    setHeroSavedStatus(prev => ({
      ...prev,
      [pendingHeroItem.id]: { saved: true, status }
    }));
    setShowWatchlistModal(false);
    
    await syncWatchlistToServerAndLocal(pendingHeroItem.id, status, pendingHeroItem, isSaved);
    setPendingHeroItem(null);
  };

  const handleRemoveFromWatchlist = async (movie: MovieData) => {
    if (!isLoggedIn) {
      onAuthRequest();
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/saved/${movie.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      setHeroSavedStatus(prev => ({
        ...prev,
        [movie.id]: { saved: false, status: null }
      }));
    } catch (error) {
      alert('خطا در حذف از لیست تماشا');
    }
  };

  const filteredAll = filterContent(allContentFromAPI);

  function handleGenre(g: string) {
    setActiveGenre(activeGenre === g ? null : g);
  }

  function clearAll() {
    setActiveGenre(null);
    setGlobalSearch("");
  }

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-32 text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-white/40 mt-4">در حال بارگذاری...</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-32 text-center">
        <p className="text-red-500 mb-4">{apiError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div>
      {!isFiltering && heroSlides.length > 0 && (
        <section
          className="relative h-[700px] overflow-hidden bg-background"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute inset-0">
            {heroSlides.map((slide, i) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  i === heroIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={slide.img.replace("w=400&h=600", "w=1440&h=700")}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover scale-110 blur-2xl opacity-50"
                />
                <img
                  src={slide.img.replace("w=400&h=600", "w=1440&h=700")}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/50" />
          </div>

          {hero && (
            <div className="relative z-30 h-full max-w-[1440px] mx-auto px-8 flex items-center pb-24">
              <div className="max-w-2xl space-y-5">
                <div>
                  <span className={`inline-block px-4 py-1.5 text-white text-sm font-bold rounded-lg uppercase tracking-wide ${
                    hero.type === "TV"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700"
                      : "bg-gradient-to-r from-primary to-accent"
                  }`}>
                    {hero.type === "TV" ? t.common.tvSeries : t.common.movie}
                  </span>
                </div>

                <h1
                  className="text-[46px] font-black text-white leading-tight tracking-tight"
                  style={{ fontFamily: "'Vazirmatn', sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                >
                  {hero.title}
                </h1>

                <p className="text-white/55 text-lg font-light tracking-wide">
                  {hero.originalTitle}
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} fill="#FCD34D" className="text-amber-400" />
                    <span className="text-amber-300 font-bold">{toPersianDigits(hero.rating.toFixed(1))}</span>
                    <span className="text-white/40 text-sm">/۱۰</span>
                  </div>
                  <span className="text-white/30">•</span>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Calendar size={14} />
                    <span>{toPersianDigits(hero.year)}</span>
                  </div>
                  <span className="text-white/30">•</span>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Clock size={14} />
                    <span>{hero.duration}</span>
                  </div>
                  <span className="px-2 py-0.5 border border-white/30 text-white/60 text-xs rounded">{hero.age}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hero.genres.slice(0, 4).map((g) => (
                    <span key={g} className="px-4 py-1.5 bg-white/10 rounded-xl text-sm">
                      {g}
                    </span>
                  ))}
                </div>

                <p className="text-white/80 text-base leading-relaxed max-w-xl line-clamp-3">
                  {hero.summary}
                </p>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setPage(hero.type === "TV" ? "tv" : "movie", hero)}
                    className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/30"
                  >
                    {t.detail.viewDetails}
                  </button>
                  {(() => {
                    const status = heroSavedStatus[hero.id];
                    const isSaved = status?.saved || false;
                    
                    let buttonText = t.detail.save;
                    let buttonIcon = <Bookmark size={18} />;
                    
                    if (isSaved && status?.status === 'want_to_watch') {
                      buttonText = 'می‌خواهم تماشا کنم';
                      buttonIcon = <BookmarkCheck size={18} />;
                    } else if (isSaved && status?.status === 'watching') {
                      buttonText = 'در حال تماشا';
                      buttonIcon = <BookmarkCheck size={18} />;
                    } else if (isSaved && status?.status === 'watched') {
                      buttonText = 'تماشا شده';
                      buttonIcon = <BookmarkCheck size={18} />;
                    }
                    
                    return (
                      <button
                        onClick={() => {
                          if (isSaved) {
                            handleRemoveFromWatchlist(hero);
                          } else {
                            handleSaveClick(hero);
                          }
                        }}
                        className={`px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                          isSaved
                            ? 'bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        {buttonIcon}
                        {buttonText}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-5 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full px-5 py-2.5 shadow-2xl">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-primary/50 transition-all hover:scale-110 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-2.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all rounded-full ${
                    i === heroIndex
                      ? "w-10 h-2.5 bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/60"
                      : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50 hover:w-6"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-primary/50 transition-all hover:scale-110 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
          </div>
        </section>
      )}

      <div className="max-w-[1440px] mx-auto px-8 py-14 space-y-16">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-wide uppercase" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.home.popularGenres}</h2>
            {isFiltering && (
              <button onClick={clearAll} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
                <X size={13} /> {t.home.clearFilters}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5">
            {popularGenres.map((genre, index) => {
              const isActive = activeGenre === genre.genre_name;
              const GenreIcon = genreIcons[genre.genre_name];
              
              return (
                <button
                  key={genre.genre_id}
                  onClick={() => handleGenre(genre.genre_name)}
                  className={`
                    group relative overflow-hidden rounded-2xl transition-all duration-500
                    hover:scale-[1.03] hover:-translate-y-1
                    ${isActive 
                      ? 'shadow-2xl shadow-primary/40' 
                      : 'hover:shadow-xl hover:shadow-primary/20'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`
                    absolute inset-0 transition-all duration-500
                    ${isActive 
                      ? 'bg-gradient-to-br from-primary via-purple-600 to-accent' 
                      : 'bg-gradient-to-br from-white/8 to-white/2 backdrop-blur-sm'
                    }
                  `} />
                  
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute -inset-full w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  
                  
                  {!isActive && (
                    <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-primary/50 transition-all duration-300" />
                  )}
                  
                  
                  {isActive && (
                    <>
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-purple-500 blur-xl opacity-50 animate-pulse" />
                      <div className="absolute inset-0 rounded-2xl ring-2 ring-white/30 ring-offset-2 ring-offset-background" />
                    </>
                  )}
                  
                  <div className="relative z-10 text-center p-5">
                    <div className={`
                      mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center 
                      transition-all duration-500 transform
                      ${isActive 
                        ? 'bg-white/20 scale-110 shadow-lg shadow-black/20' 
                        : 'bg-gradient-to-br from-white/15 to-white/5 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-purple-600/30'
                      }
                    `}>
                      <GenreIcon 
                        className={`
                          w-8 h-8 transition-all duration-300
                          ${isActive ? 'text-white' : 'text-primary/80 group-hover:text-white'}
                        `} 
                        strokeWidth={1.6} 
                      />
                    </div>

                    <h3 className={`
                      text-base font-bold mb-1.5 tracking-tight transition-all duration-300
                      ${isActive ? 'text-white' : 'text-foreground group-hover:text-primary'}
                    `}>
                      {genre.genre_name}
                    </h3>

                    <div className={`
                      inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono
                      transition-all duration-300 backdrop-blur-sm
                      ${isActive 
                        ? 'bg-white/20 text-white/90' 
                        : 'bg-black/20 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                      }
                    `}>
                      <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                      {toPersianDigits(genre.title_count)} عنوان
                      <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                    </div>
                  </div>
                  
                  <div className={`
                    absolute bottom-0 left-0 h-1 rounded-b-2xl transition-all duration-500
                    ${isActive 
                      ? 'w-full bg-gradient-to-r from-white/50 to-white/10' 
                      : 'w-0 group-hover:w-full bg-gradient-to-r from-primary to-purple-500'
                    }
                  `} />
                  

                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{ borderColor: isActive ? 'rgba(255,255,255,0.3)' : 'var(--primary)' }} />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{ borderColor: isActive ? 'rgba(255,255,255,0.3)' : 'var(--primary)' }} />
                </button>
              );
            })}
          </div>

          {isFiltering && (
            <p className="text-white/35 text-sm mt-4">
              {toPersianDigits(filteredAll.length)} {t.home.results}
              {activeGenre ? ` ${activeGenre}` : ""}
              {globalSearch ? ` ${t.browse.matching} "${globalSearch}"` : ""}
            </p>
          )}
        </section>

        {isFiltering ? (
          <>
            {filteredAll.length === 0 ? (
              <section className="text-center py-16">
                <Search size={40} className="text-white/10 mx-auto mb-4" />
                <p className="text-white/40 text-lg mb-2">{t.home.noTitlesFound}</p>
                <p className="text-white/25 text-sm mb-6">{t.home.tryDifferentSearch}</p>
                <button onClick={clearAll} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent transition-colors">
                  {t.home.clearFilters}
                </button>
              </section>
            ) : (
              <section>
                <SectionHeader title={t.home.results} action={t.home.seeAllInDiscover} onActionClick={() => setPage("browse")} />
                <div className="grid grid-cols-5 gap-5">
                  {filteredAll.map((m) => (
                    <MovieCard key={m.id} movie={m} onClick={() => setPage(m.type === "TV" ? "tv" : "movie", m)} showTypeBadge />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            {isLoggedIn && recommendations.length > 0 && (
              <section>
                <SectionHeader title={t.home.recommendedForYou} />
                <div className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
                  {recommendations.map((rec) => {
                    const movieData = convertRecommendationToMovieData(rec);
                    return (
                      <div key={movieData.id} className="flex-shrink-0 w-44">
                        <MovieCard movie={movieData} onClick={() => setPage(movieData.type === "TV" ? "tv" : "movie", movieData)} showTypeBadge />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* اگر کاربر لاگین است ولی ریکامندیشنی وجود ندارد */}
            {isLoggedIn && recommendations.length === 0 && !isLoading && (
              <section>
                <SectionHeader title={t.home.recommendedForYou} />
                <div className="text-center py-12 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <Star size={28} className="text-white/30" />
                  </div>
                  <p className="text-white/40 text-sm mb-1">هنوز ریکامندیشنی وجود ندارد</p>
                  <p className="text-white/25 text-xs">با امتیاز دادن و افزودن فیلم‌ها به لیست تماشا، پیشنهادات شخصی‌سازی شده دریافت کنید</p>
                </div>
              </section>
            )}

            <section>
              <SectionHeader title={t.home.topRatedMovies} action={t.home.seeAll} onActionClick={() => setPage("browse")} />
              <div className="grid grid-cols-5 gap-5">
                {topMovies.map((movie) => {
                  const movieData = convertTopMovieToMovieData(movie);
                  return (
                    <MovieCard
                      key={movieData.id}
                      movie={movieData}
                      onClick={() => setPage("movie", movieData)}
                      showTypeBadge
                    />
                  );
                })}
              </div>
            </section>

            <section>
              <SectionHeader title={t.home.topRatedSeries} action={t.home.seeAll} onActionClick={() => setPage("browse")} />
              <div className="grid grid-cols-5 gap-5">
                {topSeries.map((series) => {
                  const seriesData = convertTopSeriesToMovieData(series);
                  return (
                    <MovieCard
                      key={seriesData.id}
                      movie={seriesData}
                      onClick={() => setPage("tv", seriesData)}
                      showTypeBadge
                    />
                  );
                })}
              </div>
            </section>

            {comingSoon.length > 0 && (
              <section>
                <SectionHeader title={t.home.comingSoon} action={t.home.seeCalendar} onActionClick={() => setPage("browse")} />
                <div className="grid grid-cols-5 gap-5">
                  {comingSoon.map((item) => {
                    const movieData: MovieData = {
                      id: item.title_id,
                      title: item.name_fa,
                      originalTitle: item.name_en,
                      img: item.poster_url || '/placeholder.jpg',
                      rating: 0,
                      year: item.release_year,
                      duration: item.duration_mins ? `${item.duration_mins} دقیقه` : 
                                item.total_seasons ? `${item.total_seasons} فصل` : 'نامشخص',
                      age: item.age_rating,
                      summary: 'در حال آمدن...',
                      genres: item.genres?.split(', ') || [],
                      type: item.t_type === 'S' ? 'TV' : 'Movie',
                      voteCount: 0,
                      similarMovieIds: [],
                      cast: [],
                      crew: [],
                      awards: [],
                      reviews: [],
                    };
                    return (
                      <div key={item.title_id} onClick={() => setPage(movieData.type === "TV" ? "tv" : "movie", movieData)}
                        className="relative group rounded-xl overflow-hidden bg-card border border-white/10 dark:border-white/10 light:border-black/15 hover:border-white/25 dark:hover:border-white/25 light:hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 dark:hover:shadow-black/40 light:hover:shadow-primary/15 cursor-pointer">
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <img src={movieData.img} alt={movieData.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded tracking-wider uppercase">{t.badges.comingSoon}</span>
                            <span className={`px-2 py-0.5 text-white text-[9px] font-bold rounded uppercase tracking-wider ${movieData.type === "TV" ? "bg-blue-600/80" : "bg-purple-600/80"}`}>{movieData.type === "TV" ? t.common.tvSeries : t.common.movie}</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-foreground text-sm leading-tight mb-0.5 line-clamp-1">{movieData.title}</h3>
                          <p className="text-white/35 dark:text-white/35 light:text-black/40 text-[11px] leading-tight mb-1.5 line-clamp-1 font-light">{movieData.originalTitle}</p>
                          <div className="flex flex-wrap gap-1">
                            {movieData.genres.slice(0, 2).map((g: string) => (
                              <span key={g} className="px-1.5 py-0.5 bg-white/8 rounded text-white/50 text-[10px]">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      <WatchlistModal
        isOpen={showWatchlistModal}
        onClose={() => {
          setShowWatchlistModal(false);
          setPendingHeroItem(null);
        }}
        onSelect={handleSelectList}
        currentStatus={pendingHeroItem ? heroSavedStatus[pendingHeroItem.id]?.status || null : null}
        titleName={pendingHeroItem?.title || ''}
      />
    </div>
  );
}

// ── Page 3: Movie Detail (با اتصال به API و پشتیبانی از localStorage) ─────────────────

function MovieDetailPage({
  movie,
  setPage,
  navigateBack,
  ratedTitles,
  onRate,
  setGlobalSearch,
  isLoggedIn,
  onAuthRequest,
  onOpenReviewModal,
  userReviews,
}: {
  movie: MovieData;
  setPage: (p: Page, movieData?: MovieData) => void;
  navigateBack: () => void;
  ratedTitles: RatedEntry[];
  onRate: (entry: RatedEntry) => void;
  setGlobalSearch: (q: string) => void;
  isLoggedIn: boolean;
  onAuthRequest: () => void;
  onOpenReviewModal: (movie: MovieData) => void;
  userReviews: RatedEntry[];
}) {
  const [saved, setSaved] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<WatchlistStatus | null>(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [pendingScore, setPendingScore] = useState(0);
  const [details, setDetails] = useState<TitleDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarTitles, setSimilarTitles] = useState<SimilarTitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const existingRating = ratedTitles.find((r) => r.id === movie.id);
  const myReview = userReviews.find((r) => r.id === movie.id);

  // Check watchlist status on load
  useEffect(() => {
    async function checkWatchlistStatus() {
      if (!isLoggedIn) {
        setSaved(false);
        setCurrentStatus(null);
        return;
      }
      
      console.log('Checking watchlist status for movie:', movie.id);
      
      try {
        const freshWatchlist = await getUserWatchlist(true);
        console.log('Fresh watchlist from server:', freshWatchlist.length, 'items');
        
        const serverFound = freshWatchlist.find(item => item.title_id === movie.id);
        
        if (serverFound) {
          console.log('Found on server with status:', serverFound.status);
          setSaved(true);
          setCurrentStatus(serverFound.status);
        } else {
          console.log('Not found on server');
          setSaved(false);
          setCurrentStatus(null);
        }
      } catch (error) {
        console.error('Server check failed:', error);
        const localWatchlist = getWatchlistFromLocalStorage();
        const localFound = localWatchlist.find(item => item.title_id === movie.id);
        if (localFound) {
          setSaved(true);
          setCurrentStatus(localFound.status);
        } else {
          setSaved(false);
          setCurrentStatus(null);
        }
      }
    }
    
    checkWatchlistStatus();
  }, [movie.id, isLoggedIn]);

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      try {
        const [detailsData, castData, crewData, awardsData, similarData] = await Promise.all([
          getTitleDetails(movie.id),
          getTitleCast(movie.id),
          getTitleCrew(movie.id),
          getTitleAwards(movie.id),
          getSimilarTitles(movie.id, 10)
        ]);
        setDetails(detailsData);
        setCast(castData);
        setCrew(crewData);
        setAwards(awardsData);
        setSimilarTitles(similarData);
        
        try {
          const reviewsData = await getTitleReviews(movie.id, 10);
          setReviews(reviewsData);
        } catch (err) {
          console.log('Reviews endpoint error:', err);
          setReviews([]);
        }
      } catch (error) {
        console.error('Error fetching title details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [movie.id]);

  const handleSaveClick = () => {
    if (!isLoggedIn) {
      onAuthRequest();
      return;
    }
    setShowWatchlistModal(true);
  };

  const handleSelectList = async (status: WatchlistStatus) => {
    if (!status || !isLoggedIn) {
      if (!isLoggedIn) onAuthRequest();
      return;
    }
    
    if (currentStatus === status && saved) {
      setShowWatchlistModal(false);
      return;
    }
   
    const previousSaved = saved;
    const previousStatus = currentStatus;

    setSaved(true);
    setCurrentStatus(status);
    setShowWatchlistModal(false);
 
    const success = await syncWatchlistToServerAndLocal(movie.id, status, movie, previousSaved);
    
    if (!success) {
      setSaved(previousSaved);
      setCurrentStatus(previousStatus);
      alert('خطا در اتصال به سرور. تغییرات ذخیره نشد.');
    } else {
      const statusText = status === 'want_to_watch' ? 'می‌خواهم تماشا کنم' : 
                         status === 'watching' ? 'در حال تماشا' : 'تماشا شده';
    }
  };

  function goToBrowseWithQuery(q: string) {
    setGlobalSearch(q);
    setPage("browse");
  }

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-32 text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-white/40 mt-4">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <div className="mb-6">
        <BackButton onClick={navigateBack} />
      </div>

      <div className="flex gap-10 mb-14">
        <div className="flex-shrink-0 w-60">
          <img
            src={movie.img}
            alt={movie.title}
            className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-black"
          />
        </div>
        <div className="flex-1 pt-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((g) => (
              <GenrePill key={g} genre={g} onClick={() => goToBrowseWithQuery(g)} showIcon={false} />
            ))}
          </div>
          <h1
            className="text-[36px] font-bold text-white mb-2 leading-tight"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {details?.name_fa || movie.title}
          </h1>
          <p className="text-white/35 text-base mb-5">{details?.name_en || movie.originalTitle}</p>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <RatingDisplay rating={details?.score || movie.rating} size="lg" />
              <span className="text-white/40 text-sm">/{toPersianDigits(10)}</span>
              <span className="text-white/35 text-sm">({formatPersianNumber(details?.vote_count || movie.voteCount || 0)} {t.common.votes})</span>
            </div>
            <span className="text-white/20">·</span>
            <span className="text-white/60 text-sm">{toPersianDigits(details?.release_date ? new Date(details.release_date).getFullYear() : movie.year)}</span>
            <span className="text-white/20">·</span>
            <span className="border border-white/25 text-white/50 text-xs px-2 py-0.5 rounded">{details?.age_rating || movie.age}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/60 text-sm flex items-center gap-1.5">
              <Clock size={13} /> {details?.duration_mins ? `${toPersianDigits(details.duration_mins)} دقیقه` : movie.duration}
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-2xl">{details?.summary || movie.summary}</p>
          
          {/* دکمه‌های Save و نقد */}
          <div className="flex gap-3 flex-wrap items-center">
            <SaveButton 
              saved={saved}
              status={currentStatus}
              onToggle={handleSaveClick}
              onSelectStatus={handleSelectList}
              onRemove={async () => {
                if (!isLoggedIn) {
                  onAuthRequest();
                  return;
                }
                try {
                  const token = localStorage.getItem('access_token');
                  if (!token) throw new Error('No token');
                  await fetch(`http://localhost:8000/saved/${movie.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                  });
                  updateWatchlistInLocalStorage(movie.id, null);
                  setSaved(false);
                  setCurrentStatus(null);
                } catch (error) {
                  console.error('Error removing from watchlist:', error);
                  alert('خطا در حذف از لیست تماشا');
                }
              }}
            />
            
            {/* دکمه نوشتن نقد */}
            <button
              onClick={() => onOpenReviewModal(movie)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                myReview
                  ? "bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <Star size={16} />
              {myReview ? "ویرایش نقد" : "نوشتن نقد"}
            </button>
          </div>
          
          {/* نمایش امتیاز قبلی اگر وجود داشته باشد */}
          {existingRating && !myReview && (
            <div className="mt-3 flex items-center gap-3 bg-[#1A1A1A] border border-primary/30 rounded-lg px-4 py-2.5 w-fit">
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">{t.detail.alreadyRated}</span>
              <span className="text-white/20">·</span>
              <RatingDisplay rating={existingRating.score} size="sm" />
              <span className="text-white/35 text-xs">/{toPersianDigits(10)}</span>
              <button
                onClick={() => setPage("profile")}
                className="text-white/35 text-xs hover:text-white/70 underline underline-offset-2 transition-colors ml-1"
              >
                {t.detail.editInProfile}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {cast.length > 0 && (
          <section>
            <SectionHeader title={t.detail.cast} />
            <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
              {cast.map((a) => (
                <div key={a.person_id} onClick={() => goToBrowseWithQuery(a.name_fa)} className="flex-shrink-0 w-[120px] text-center group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl mb-3 w-[120px] h-[120px] border border-white/10 bg-white/5">
                    <img
                      src={a.photo_url || '/placeholder.jpg'}
                      alt={a.name_fa}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-white text-xs font-semibold leading-tight">{a.name_fa}</p>
                  <p className="text-white/40 text-[11px] mt-0.5 leading-tight">{a.character_name_fa}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {crew.length > 0 && (
          <section>
            <SectionHeader title={t.detail.crew} />
            <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
              {crew.map((c) => (
                <div key={c.person_id} onClick={() => goToBrowseWithQuery(c.name_fa)} className="flex-shrink-0 bg-[#1A1A1A] rounded-xl px-5 py-4 border border-white/8 hover:border-white/18 hover:bg-white/3 transition-colors min-w-[160px] cursor-pointer">
                  <p className="text-white text-sm font-semibold mb-1">{c.name_fa}</p>
                  <p className="text-white/40 text-xs">{c.role_name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {awards.length > 0 && (
          <section>
            <SectionHeader title={t.detail.awards} />
            <div className="space-y-2.5">
              {awards.map((a, i) => (
                <div
                  key={`award-${a.award_name}-${a.ceremony_year}-${a.category}-${i}`}
                  className="flex items-center gap-4 bg-[#1A1A1A] rounded-xl px-5 py-3.5 border border-white/8 hover:border-white/15 transition-colors"
                >
                  <span className="text-white/35 text-xs font-mono w-16 flex-shrink-0">{toPersianDigits(a.ceremony_year)}</span>
                  <Award size={14} className={`flex-shrink-0 ${a.status === "won" ? "text-amber-400" : "text-white/20"}`} />
                  <span className="text-white/80 text-sm font-medium flex-shrink-0">{a.award_name}</span>
                  <span className="text-white/25 text-xs">—</span>
                  <span className="text-white/55 text-sm flex-1">{a.category}</span>
                  <span
                    className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      a.status === "won"
                        ? "bg-amber-400/15 border border-amber-400/40 text-amber-400"
                        : "bg-white/6 border border-white/15 text-white/35"
                    }`}
                  >
                    {a.status === "won" ? t.detail.won : t.detail.nominated}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {similarTitles.length > 0 && (
          <section>
            <SectionHeader title={t.detail.similarTitles} />
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
              {similarTitles.map((item, index) => {
                const similarMovieData: MovieData = {
                  id: item.title_id,
                  title: item.name_fa,
                  originalTitle: item.name_en,
                  img: item.poster_url || '/placeholder.jpg',
                  rating: item.score,
                  year: item.release_year,
                  duration: item.duration_mins ? `${item.duration_mins} دقیقه` : 
                            item.total_seasons ? `${item.total_seasons} فصل` : 'نامشخص',
                  age: item.age_rating,
                  summary: '',
                  genres: item.genres.split(', '),
                  type: item.t_type === 'S' ? 'TV' : 'Movie',
                  voteCount: 0,
                  similarMovieIds: [],
                  cast: [],
                  crew: [],
                  awards: [],
                  reviews: [],
                };
                return (
                  <div key={`similar-${item.title_id}-${index}`} className="flex-shrink-0 w-40">
                    <MovieCard movie={similarMovieData} onClick={() => setPage(similarMovieData.type === "TV" ? "tv" : "movie", similarMovieData)} />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {reviews.length > 0 && (
          <section>
            <SectionHeader title={t.detail.reviews} />
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 bg-[#1A1A1A] rounded-xl px-6 py-4 border border-white/8 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E50914]/40 to-[#E50914]/10 border border-primary/30 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {r.user?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-white text-sm font-medium">{r.user || 'کاربر'}</span>
                    <div className="flex items-center gap-1">
                      <RatingDisplay rating={r.rating || 0} size="sm" />
                      <span className="text-white/30 text-xs">/{toPersianDigits(10)}</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed flex-1">{r.comment || r.review_text || 'نظری ثبت نشده است'}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Watchlist Selection Modal */}
      <WatchlistModal
        isOpen={showWatchlistModal}
        onClose={() => setShowWatchlistModal(false)}
        onSelect={handleSelectList}
        currentStatus={currentStatus}
        titleName={movie.title}
      />
    </div>
  );
}

// ── Page 4: TV Series Detail (با اتصال به API و پشتیبانی از localStorage) ─────────────────

function TVDetailPage({
  movie,
  setPage,
  navigateBack,
  ratedTitles,
  onRate,
  setGlobalSearch,
  isLoggedIn,
  onAuthRequest,
  onOpenReviewModal,
  userReviews,
}: {
  movie: MovieData;
  setPage: (p: Page, movieData?: MovieData) => void;
  navigateBack: () => void;
  ratedTitles: RatedEntry[];
  onRate: (entry: RatedEntry) => void;
  setGlobalSearch: (q: string) => void;
  isLoggedIn: boolean;
  onAuthRequest: () => void;
  onOpenReviewModal: (movie: MovieData) => void;
  userReviews: RatedEntry[];
}) {
  const [saved, setSaved] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<WatchlistStatus | null>(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [pendingScore, setPendingScore] = useState(0);
  const [details, setDetails] = useState<TitleDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarTitles, setSimilarTitles] = useState<SimilarTitle[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tvShow = movie;
  const existingRating = ratedTitles.find((r) => r.id === tvShow.id);
  const myReview = userReviews.find((r) => r.id === tvShow.id);

  // Check watchlist status on load
  useEffect(() => {
    async function checkWatchlistStatus() {
      if (!isLoggedIn) {
        setSaved(false);
        setCurrentStatus(null);
        return;
      }
      
      console.log('Checking watchlist status for TV series:', tvShow.id);
      
      try {
        const freshWatchlist = await getUserWatchlist(true);
        console.log('Fresh watchlist from server:', freshWatchlist.length, 'items');
        
        const serverFound = freshWatchlist.find(item => item.title_id === tvShow.id);
        
        if (serverFound) {
          console.log('Found on server with status:', serverFound.status);
          setSaved(true);
          setCurrentStatus(serverFound.status);
        } else {
          console.log('Not found on server');
          setSaved(false);
          setCurrentStatus(null);
        }
      } catch (error) {
        console.error('Server check failed:', error);
        const localWatchlist = getWatchlistFromLocalStorage();
        const localFound = localWatchlist.find(item => item.title_id === tvShow.id);
        if (localFound) {
          setSaved(true);
          setCurrentStatus(localFound.status);
        } else {
          setSaved(false);
          setCurrentStatus(null);
        }
      }
    }
    
    checkWatchlistStatus();
  }, [tvShow.id, isLoggedIn]);

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      try {
        const [detailsData, castData, crewData, awardsData, similarData, seasonsData, episodesData] = await Promise.all([
          getTitleDetails(tvShow.id),
          getTitleCast(tvShow.id),
          getTitleCrew(tvShow.id),
          getTitleAwards(tvShow.id),
          getSimilarTitles(tvShow.id, 10),
          getSeasons(tvShow.id),
          getEpisodes(tvShow.id)
        ]);
        setDetails(detailsData);
        setCast(castData);
        setCrew(crewData);
        setAwards(awardsData);
        setSimilarTitles(similarData);
        setSeasons(seasonsData);
        setEpisodes(episodesData);
        
        try {
          const reviewsData = await getTitleReviews(tvShow.id, 10);
          setReviews(reviewsData);
        } catch (err) {
          console.log('Reviews endpoint error:', err);
          setReviews([]);
        }
        
        if (seasonsData.length > 0) {
          setExpandedSeason(seasonsData[0].season_number);
        }
      } catch (error) {
        console.error('Error fetching TV details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [tvShow.id]);

  const handleSaveClick = () => {
    if (!isLoggedIn) {
      onAuthRequest();
      return;
    }
    setShowWatchlistModal(true);
  };

  const handleSelectList = async (status: WatchlistStatus) => {
    if (!status || !isLoggedIn) {
      if (!isLoggedIn) onAuthRequest();
      return;
    }
    
    if (currentStatus === status && saved) {
      setShowWatchlistModal(false);
      return;
    }
    
    const previousSaved = saved;
    const previousStatus = currentStatus;
    
    setSaved(true);
    setCurrentStatus(status);
    setShowWatchlistModal(false);
    
    const success = await syncWatchlistToServerAndLocal(tvShow.id, status, tvShow, previousSaved);
    
    if (!success) {
      setSaved(previousSaved);
      setCurrentStatus(previousStatus);
      alert('خطا در اتصال به سرور. تغییرات ذخیره نشد.');
    } else {
      const statusText = status === 'want_to_watch' ? 'می‌خواهم تماشا کنم' : 
                         status === 'watching' ? 'در حال تماشا' : 'تماشا شده';
    }
  };
  
  function goToBrowseWithQuery(q: string) {
    setGlobalSearch(q);
    setPage("browse");
  }

  const episodesBySeason = episodes.reduce((acc, episode) => {
    if (!acc[episode.season_number]) {
      acc[episode.season_number] = [];
    }
    acc[episode.season_number].push(episode);
    return acc;
  }, {} as Record<number, Episode[]>);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-32 text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-white/40 mt-4">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <div className="mb-6">
        <BackButton onClick={navigateBack} />
      </div>

      <div className="flex gap-10 mb-14">
        <div className="flex-shrink-0 w-60">
          <img
            src={tvShow.img}
            alt={tvShow.title}
            className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-black"
          />
        </div>
        <div className="flex-1 pt-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 border border-primary/50 text-primary text-xs font-bold rounded uppercase tracking-wider">
              {t.common.tvSeries}
            </span>
            {tvShow.genres.map((g) => (
              <GenrePill key={g} genre={g} onClick={() => goToBrowseWithQuery(g)} />
            ))}
          </div>
          <h1
            className="text-[36px] font-bold text-white dark:text-white light:text-black mb-2 leading-tight"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {details?.name_fa || tvShow.title}
          </h1>
          <p className="text-white/35 dark:text-white/35 light:text-black/35 text-base mb-5">{details?.name_en || tvShow.originalTitle}</p>
          <div className="flex flex-wrap items-center gap-3 mb-6 mt-4">
            <div className="flex items-center gap-2">
              <RatingDisplay rating={details?.score || tvShow.rating} size="lg" />
              <span className="text-white/40 dark:text-white/40 light:text-black/40 text-sm">/{toPersianDigits(10)}</span>
              <span className="text-white/35 dark:text-white/35 light:text-black/35 text-sm">({formatPersianNumber(details?.vote_count || tvShow.voteCount || 0)} {t.common.votes})</span>
            </div>
            <span className="text-white/20 dark:text-white/20 light:text-black/20">·</span>
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm flex items-center gap-1.5">
              {toPersianDigits(details?.release_date ? new Date(details.release_date).getFullYear().toString() : tvShow.year.toString())}{details?.end_date ? `–${toPersianDigits(new Date(details.end_date).getFullYear().toString())}` : ''}
            </span>
            <span className="text-white/20 dark:text-white/20 light:text-black/20">·</span>
            <span className="border border-white/25 dark:border-white/25 light:border-black/25 text-white/50 dark:text-white/50 light:text-black/50 text-xs px-2 py-0.5 rounded">{details?.age_rating || tvShow.age}</span>
            <span className="text-white/20 dark:text-white/20 light:text-black/20">·</span>
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm flex items-center gap-1.5">
              <Clock size={13} /> {details?.total_episodes ? `${toPersianDigits(details.total_episodes)} قسمت` : tvShow.duration}
            </span>
            {details?.total_seasons && (
              <>
                <span className="text-white/20 dark:text-white/20 light:text-black/20">·</span>
                <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">{toPersianDigits(details.total_seasons)} فصل</span>
              </>
            )}
          </div>
          <p className="text-white/60 dark:text-white/60 light:text-black/60 text-sm leading-relaxed mb-8 max-w-2xl">
            {details?.summary || tvShow.summary}
          </p>
          
          {/* دکمه‌های Save و نقد */}
          <div className="flex gap-3 flex-wrap items-center">
            <SaveButton 
              saved={saved}
              status={currentStatus}
              onToggle={handleSaveClick}
              onSelectStatus={handleSelectList}
              onRemove={async () => {
                if (!isLoggedIn) {
                  onAuthRequest();
                  return;
                }
                try {
                  const token = localStorage.getItem('access_token');
                  if (!token) throw new Error('No token');
                  await fetch(`http://localhost:8000/saved/${tvShow.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                  });
                  updateWatchlistInLocalStorage(tvShow.id, null);
                  setSaved(false);
                  setCurrentStatus(null);
                } catch (error) {
                  console.error('Error removing from watchlist:', error);
                  alert('خطا در حذف از لیست تماشا');
                }
              }}
            />
            
            {/* دکمه نوشتن نقد */}
            <button
              onClick={() => onOpenReviewModal(tvShow)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                myReview
                  ? "bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <Star size={16} />
              {myReview ? "ویرایش نقد" : "نوشتن نقد"}
            </button>
          </div>
          
          {/* نمایش امتیاز قبلی اگر وجود داشته باشد */}
          {existingRating && !myReview && (
            <div className="mt-3 flex items-center gap-3 bg-[#1A1A1A] border border-primary/30 rounded-lg px-4 py-2.5 w-fit">
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">{t.detail.alreadyRated}</span>
              <span className="text-white/20">·</span>
              <RatingDisplay rating={existingRating.score} size="sm" />
              <span className="text-white/35 text-xs">/{toPersianDigits(10)}</span>
              <button
                onClick={() => setPage("profile")}
                className="text-white/35 text-xs hover:text-white/70 underline underline-offset-2 transition-colors ml-1"
              >
                {t.detail.editInProfile}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {cast.length > 0 && (
          <section>
            <SectionHeader title={t.detail.cast} />
            <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
              {cast.map((a) => (
                <div key={a.person_id} onClick={() => goToBrowseWithQuery(a.name_fa)} className="flex-shrink-0 w-[120px] text-center group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl mb-3 w-[120px] h-[120px] border border-white/10 bg-white/5">
                    <img
                      src={a.photo_url || '/placeholder.jpg'}
                      alt={a.name_fa}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-white text-xs font-semibold leading-tight">{a.name_fa}</p>
                  <p className="text-white/40 text-[11px] mt-0.5 leading-tight">{a.character_name_fa}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {crew.length > 0 && (
          <section>
            <SectionHeader title={t.detail.crew} />
            <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
              {crew.map((c) => (
                <div key={c.person_id} onClick={() => goToBrowseWithQuery(c.name_fa)} className="flex-shrink-0 bg-[#1A1A1A] rounded-xl px-5 py-4 border border-white/8 hover:border-white/18 hover:bg-white/3 transition-colors min-w-[170px] cursor-pointer">
                  <p className="text-white text-sm font-semibold mb-1">{c.name_fa}</p>
                  <p className="text-white/40 text-xs">{c.role_name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {awards.length > 0 && (
          <section>
            <SectionHeader title={t.detail.awards} />
            <div className="space-y-2.5">
              {awards.map((a, i) => (
                <div
                  key={`award-${a.award_name}-${a.ceremony_year}-${a.category}-${i}`}
                  className="flex items-center gap-4 bg-[#1A1A1A] rounded-xl px-5 py-3.5 border border-white/8 hover:border-white/15 transition-colors"
                >
                  <span className="text-white/35 text-xs font-mono w-16 flex-shrink-0">{toPersianDigits(a.ceremony_year)}</span>
                  <Award size={14} className={`flex-shrink-0 ${a.status === "won" ? "text-amber-400" : "text-white/20"}`} />
                  <span className="text-white/80 text-sm font-medium flex-shrink-0">{a.award_name}</span>
                  <span className="text-white/25 text-xs">—</span>
                  <span className="text-white/55 text-sm flex-1">{a.category}</span>
                  <span
                    className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      a.status === "won"
                        ? "bg-amber-400/15 border border-amber-400/40 text-amber-400"
                        : "bg-white/6 border border-white/15 text-white/35"
                    }`}
                  >
                    {a.status === "won" ? t.detail.won : t.detail.nominated}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {seasons.length > 0 && (
          <section>
            <SectionHeader title={t.detail.seasonsAndEpisodes} />
            <div className="space-y-2.5">
              {seasons.map((season) => {
                const seasonEpisodes = episodesBySeason[season.season_number] || [];
                return (
                  <div key={`season-list-${season.season_number}`} className="bg-card rounded-2xl border border-white/8 dark:border-white/8 light:border-black/8 overflow-hidden">
                    <button
                      onClick={() => setExpandedSeason(expandedSeason === season.season_number ? null : season.season_number)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/3 dark:hover:bg-white/3 light:hover:bg-black/3 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="text-white dark:text-white light:text-black font-bold"
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {t.detail.season} {toPersianDigits(season.season_number)}
                        </span>
                        <span className="px-2 py-0.5 bg-white/8 dark:bg-white/8 light:bg-black/8 border border-white/10 dark:border-white/10 light:border-black/10 text-white/45 dark:text-white/45 light:text-black/45 text-xs rounded font-mono">
                          {toPersianDigits(new Date(season.season_release_date).getFullYear())}
                        </span>
                        <span className="text-white/30 dark:text-white/30 light:text-black/30 text-sm">{toPersianDigits(season.total_episodes)} {t.detail.episodes}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-white/30 dark:text-white/30 light:text-black/30 group-hover:text-white/60 dark:group-hover:text-white/60 light:group-hover:text-black/60 transition-all duration-200 ${
                          expandedSeason === season.season_number ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSeason === season.season_number && (
                      <div className="border-t border-white/6 dark:border-white/6 light:border-black/6 divide-y divide-white/5 dark:divide-white/5 light:divide-black/5">
                        {seasonEpisodes.map((ep, epIndex) => (
                          <div
                            key={`season-${season.season_number}-ep-${ep.episode_number}-${epIndex}`}
                            className="flex items-start gap-5 px-6 py-4 hover:bg-white/2 dark:hover:bg-white/2 light:hover:bg-black/2 transition-colors"
                          >
                            <span className="text-white/25 dark:text-white/25 light:text-black/25 text-xs font-mono w-12 flex-shrink-0 mt-0.5 text-center">
                              {toPersianDigits(ep.episode_number)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                <p className="text-white dark:text-white light:text-black text-sm font-medium">{ep.episode_name_fa}</p>
                                <span className="text-white/25 dark:text-white/25 light:text-black/25 text-xs flex items-center gap-1">
                                  <Clock size={10} /> {ep.episode_duration} دقیقه
                                </span>
                                <span className="text-white/20 dark:text-white/20 light:text-black/20 text-xs flex items-center gap-1">
                                  <Calendar size={10} /> {new Date(ep.episode_release_date).toLocaleDateString('fa-IR')}
                                </span>
                              </div>
                              {ep.episode_summary && (
                                <p className="text-white/40 dark:text-white/40 light:text-black/40 text-xs leading-relaxed line-clamp-2">{ep.episode_summary}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {similarTitles.length > 0 && (
          <section>
            <SectionHeader title={t.detail.similarTitles} />
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
              {similarTitles.map((item, index) => {
                const similarMovieData: MovieData = {
                  id: item.title_id,
                  title: item.name_fa,
                  originalTitle: item.name_en,
                  img: item.poster_url || '/placeholder.jpg',
                  rating: item.score,
                  year: item.release_year,
                  duration: item.duration_mins ? `${item.duration_mins} دقیقه` : 
                            item.total_seasons ? `${item.total_seasons} فصل` : 'نامشخص',
                  age: item.age_rating,
                  summary: '',
                  genres: item.genres.split(', '),
                  type: item.t_type === 'S' ? 'TV' : 'Movie',
                  voteCount: 0,
                  similarMovieIds: [],
                  cast: [],
                  crew: [],
                  awards: [],
                  reviews: [],
                };
                return (
                  <div key={`similar-${item.title_id}-${index}`} className="flex-shrink-0 w-40">
                    <MovieCard movie={similarMovieData} onClick={() => setPage(similarMovieData.type === "TV" ? "tv" : "movie", similarMovieData)} />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {reviews.length > 0 && (
          <section>
            <SectionHeader title={t.detail.reviews} />
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 bg-[#1A1A1A] rounded-xl px-6 py-4 border border-white/8 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E50914]/40 to-[#E50914]/10 border border-primary/30 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {r.user?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-white text-sm font-medium">{r.user || 'کاربر'}</span>
                    <div className="flex items-center gap-1">
                      <RatingDisplay rating={r.rating || 0} size="sm" />
                      <span className="text-white/30 text-xs">/{toPersianDigits(10)}</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed flex-1">{r.comment || r.review_text || 'نظری ثبت نشده است'}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Watchlist Selection Modal */}
      <WatchlistModal
        isOpen={showWatchlistModal}
        onClose={() => setShowWatchlistModal(false)}
        onSelect={handleSelectList}
        currentStatus={currentStatus}
        titleName={tvShow.title}
      />
    </div>
  );
}

// ── Page 5: Browse (با اتصال به API جستجو) ─────────────────────────────────────

function BrowsePage({
  setPage,
  globalSearch,
  setGlobalSearch,
}: {
  setPage: (p: Page, movieData?: MovieData) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}) {
  const [search, setSearch] = useState(globalSearch);
  const [tab, setTab] = useState<"all" | "movies" | "tv">("all");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [yearRange, setYearRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("score_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedAgeRatings, setSelectedAgeRatings] = useState<string[]>([]);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const ageRatings = ["G", "PG", "PG-13", "R", "TV-14", "TV-MA", "TV-Y", "TV-Y7"];
  const toggleAgeRating = (age: string) => {
    setSelectedAgeRatings(prev =>
      prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
    );
    setCurrentPage(1);
  };

  const allGenres = ["اکشن", "درام", "علمی-تخیلی", "ترسناک", "کمدی", "فانتزی", "جنایی", "تاریخی", "عاشقانه", "جنگی", "هیجان‌انگیز", "ماجراجویی", "معمایی", "خانوادگی"];
  
  const genreNameToId: Record<string, number> = {
    "اکشن": 1,
    "درام": 2,
    "علمی-تخیلی": 3,
    "ترسناک": 4,
    "کمدی": 5,
    "فانتزی": 6,
    "جنایی": 7,
    "تاریخی": 8,
    "عاشقانه": 9,
    "جنگی": 10,
    "هیجان‌انگیز": 11,
    "ماجراجویی": 12,
    "معمایی": 13,
    "خانوادگی": 14,
  };

  const performSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const mediaType: "M" | "S" | undefined = tab === "movies" ? "M" : tab === "tv" ? "S" : undefined;
      
      const sortMap: Record<string, string> = {
        popularity: "score_desc",
        rating: "score_desc",
        year_desc: "year_desc",
        year_asc: "year_asc",
        title_asc: "title_asc",
        title_desc: "title_desc",
        score_desc: "score_desc"
      };
      
      let minYear: number | undefined = undefined;
      let maxYear: number | undefined = undefined;
      
      if (yearRange === "2024") {
        minYear = 2024;
        maxYear = 2024;
      } else if (yearRange === "2023") {
        minYear = 2023;
        maxYear = 2023;
      } else if (yearRange === "2022-2023") {
        minYear = 2022;
        maxYear = 2023;
      } else if (yearRange === "2020-2021") {
        minYear = 2020;
        maxYear = 2021;
      }
      
      const genreIds = selectedGenres.map(g => genreNameToId[g]).filter(id => id !== undefined);
      
      const params: SearchParams = {
        search_text: search || undefined,
        media_type: mediaType,
        genre_ids: genreIds.length > 0 ? genreIds : undefined,
        min_year: minYear,
        max_year: maxYear,
        min_score: minRating > 0 ? minRating : undefined,
        sort_by: (sortMap[sortBy] as any) || "score_desc",
        limit: 20,
        offset: (currentPage - 1) * 20
      };
      
      console.log('Search params:', params);
      
      const results = await searchTitles(params);
      setSearchResults(results);
      setTotalResults(results.length > 0 ? results[0].total_count : 0);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, tab, selectedGenres, minRating, yearRange, sortBy, currentPage]);

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const paginatedResults = searchResults;
  
  const pageNums: (number | "...")[] = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pageNums.push(i);
  } else {
    pageNums.push(1, 2, 3, "...", totalPages - 1, totalPages);
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setMinRating(0);
    setYearRange("all");
    setSortBy("score_desc");
    setSearch("");
    setGlobalSearch("");
    setCurrentPage(1);
  };

  const activeFilterCount = selectedGenres.length + (minRating > 0 ? 1 : 0) + (yearRange !== "all" ? 1 : 0);

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <h1
        className="text-[34px] font-bold text-white dark:text-white light:text-black mb-10"
        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
      >
        {t.browse.browseDiscover}
      </h1>

      <div className="relative mb-6">
        <Search size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 dark:text-white/35 light:text-black/35" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setGlobalSearch(e.target.value); setCurrentPage(1); }}
          placeholder={t.browse.searchPlaceholder}
          className="w-full bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-xl pr-12 pl-12 py-4 text-foreground placeholder:text-white/25 dark:placeholder:text-white/25 light:placeholder:text-black/25 text-sm focus:outline-none focus:border-primary/40 transition-colors"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); setGlobalSearch(""); setCurrentPage(1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 dark:text-white/30 light:text-black/30 hover:text-white/60 dark:hover:text-white/60 light:hover:text-black/60 transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-6 bg-card border border-white/8 dark:border-white/8 light:border-black/8 rounded-xl p-1 w-fit">
        {(["all", "movies", "tv"] as const).map((tabType) => (
          <button
            key={tabType}
            onClick={() => { setTab(tabType); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === tabType
                ? "bg-primary text-white shadow-lg shadow-[#E50914]/20"
                : "text-white/50 dark:text-white/50 light:text-black/50 hover:text-white dark:hover:text-white light:hover:text-black"
            }`}
          >
            {tabType === "tv" ? t.browse.tvShows : tabType === "all" ? t.browse.all : t.browse.movies}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* دکمه ژانر */}
        <div className="relative">
          <button
            onClick={() => setShowGenreDropdown(!showGenreDropdown)}
            className="flex items-center gap-2 bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-2.5 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-colors"
          >
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">{t.browse.genre} {selectedGenres.length > 0 && `(${toPersianDigits(selectedGenres.length)})`}</span>
            <ChevronDown size={13} className="text-white/30 dark:text-white/30 light:text-black/30" />
          </button>
          {showGenreDropdown && (
            <div className="absolute top-full mt-2 bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-xl p-3 z-50 min-w-[280px] shadow-2xl">
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2">
                {allGenres.map(g => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedGenres.includes(g)
                        ? "bg-primary text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* دکمه سال */}
        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="flex items-center gap-2 bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-2.5 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-colors"
          >
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">
              {yearRange === "all" ? "همه سال‌ها" : 
                yearRange === "2024" ? "۱۴۰۳" : 
                yearRange === "2023" ? "۱۴۰۲" : 
                yearRange === "2022-2023" ? "۱۴۰۱-۱۴۰۲" : 
                "۱۴۰۰-۱۴۰۱"}
            </span>
            <ChevronDown size={13} className="text-white/30 dark:text-white/30 light:text-black/30" />
          </button>
          {showYearDropdown && (
            <div className="absolute top-full mt-2 bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-xl p-2 z-50 min-w-[140px] shadow-2xl">
              {[
                { value: "all", label: "همه سال‌ها" },
                { value: "2024", label: "۱۴۰۳" },
                { value: "2023", label: "۱۴۰۲" },
                { value: "2022-2023", label: "۱۴۰۱-۱۴۰۲" },
                { value: "2020-2021", label: "۱۴۰۰-۱۴۰۱" }
              ].map(yr => (
                <button
                  key={yr.value}
                  onClick={() => { setYearRange(yr.value); setShowYearDropdown(false); setCurrentPage(1); }}
                  className="w-full text-right px-3 py-2 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-black/8 rounded-lg text-sm transition-colors"
                >
                  {yr.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* دکمه امتیاز */}
        <div className="relative">
          <button
            onClick={() => setShowRatingDropdown(!showRatingDropdown)}
            className="flex items-center gap-2 bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-2.5 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-colors"
          >
            <Star size={11} className="text-amber-400" />
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">
              {minRating === 0 ? "همه امتیازها" : `${toPersianDigits(minRating)}+ ستاره`}
            </span>
            <ChevronDown size={13} className="text-white/30 dark:text-white/30 light:text-black/30" />
          </button>
          {showRatingDropdown && (
            <div className="absolute top-full mt-2 bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-xl p-2 z-50 min-w-[140px] shadow-2xl">
              {[
                { value: 0, label: "همه امتیازها" },
                { value: 7, label: "۷+ ستاره" },
                { value: 8, label: "۸+ ستاره" },
                { value: 9, label: "۹+ ستاره" }
              ].map(rating => (
                <button
                  key={rating.value}
                  onClick={() => { setMinRating(rating.value); setShowRatingDropdown(false); setCurrentPage(1); }}
                  className="w-full text-right px-3 py-2 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-black/8 rounded-lg text-sm transition-colors"
                >
                  {rating.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* دکمه مرتب‌سازی */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-2.5 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-colors"
          >
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">
              مرتب‌سازی: {
                sortBy === "score_desc" ? "بیشترین امتیاز" :
                sortBy === "year_desc" ? "جدیدترین" :
                sortBy === "year_asc" ? "قدیمی‌ترین" :
                "الفبایی"
              }
            </span>
            <ChevronDown size={13} className="text-white/30 dark:text-white/30 light:text-black/30" />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full mt-2 bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-xl p-2 z-50 min-w-[160px] shadow-2xl">
              {[
                { value: "score_desc", label: "بیشترین امتیاز" },
                { value: "year_desc", label: "جدیدترین" },
                { value: "year_asc", label: "قدیمی‌ترین" },
                { value: "title_asc", label: "الفبایی" }
              ].map(sort => (
                <button
                  key={sort.value}
                  onClick={() => { setSortBy(sort.value); setShowSortDropdown(false); }}
                  className="w-full text-right px-3 py-2 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-black/8 rounded-lg text-sm transition-colors"
                >
                  {sort.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-white/40 dark:text-white/40 light:text-black/40 hover:text-white/60 dark:hover:text-white/60 light:hover:text-black/60 text-sm transition-colors"
          >
            <X size={13} /> پاک کردن همه فیلترها
          </button>
        )}
      </div>

      {/* نمایش فیلترهای فعال */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 mb-7 flex-wrap">
          <span className="text-white/30 dark:text-white/30 light:text-black/30 text-xs font-mono uppercase tracking-wider">فیلترهای فعال:</span>
          {selectedGenres.map((g) => (
            <FilterChip key={g} label={g} onRemove={() => toggleGenre(g)} />
          ))}
          {minRating > 0 && (
            <FilterChip label={`${toPersianDigits(minRating)}+ ستاره`} onRemove={() => { setMinRating(0); setCurrentPage(1); }} />
          )}
          {yearRange !== "all" && (
            <FilterChip label={`سال: ${yearRange}`} onRemove={() => { setYearRange("all"); setCurrentPage(1); }} />
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 dark:text-white/40 light:text-black/40 text-sm">
          {hasSearched ? (
            `${toPersianDigits(totalResults)} نتیجه پیدا شد`
          ) : (
            "برای شروع جستجو کنید"
          )}
        </p>
      </div>

      {isSearching ? (
        <div className="text-center py-32">
          <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-white/40 mt-4">در حال جستجو...</p>
        </div>
      ) : paginatedResults.length > 0 ? (
        <div className="grid grid-cols-4 gap-5 mb-12">
          {paginatedResults.map((item) => {
            const movieData = convertSearchResultToMovieData(item);
            return (
              <MovieCard key={item.title_id} movie={movieData} onClick={() => setPage(movieData.type === "TV" ? "tv" : "movie", movieData)} showTypeBadge />
            );
          })}
        </div>
      ) : hasSearched ? (
        <div className="text-center py-20">
          <p className="text-white/40 dark:text-white/40 light:text-black/50 text-lg mb-2">نتیجه‌ای یافت نشد</p>
          <p className="text-white/25 dark:text-white/25 light:text-black/35 text-sm mb-6">لطفاً فیلترهای دیگری را امتحان کنید</p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent transition-colors"
          >
            پاک کردن همه فیلترها
          </button>
        </div>
      ) : null}

      {paginatedResults.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm"
          >
            <ChevronRight size={14} /> قبلی
          </button>
          <div className="flex gap-1.5">
            {pageNums.map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === "number" && setCurrentPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  p === currentPage
                    ? "bg-primary text-white shadow-lg shadow-[#E50914]/20"
                    : p === "..."
                    ? "text-white/25 dark:text-white/25 light:text-black/25 cursor-default"
                    : "bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black"
                }`}
              >
                {typeof p === "number" ? toPersianDigits(p) : p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm"
          >
            بعدی <ChevronLeft size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page 6: Profile ──────────────────────────────────────────────────────────────

function ProfilePage({
  setPage,
  ratedTitles,
  onEditRating,
  onDeleteRating,
  user,
}: {
  setPage: (p: Page, movieData?: MovieData) => void;
  ratedTitles: RatedEntry[];
  onEditRating: (id: number, score: number, review: string) => void;
  onDeleteRating: (id: number) => void;
  user: { user_id: number; username: string; email: string } | null;
}) {
  const [watchlistPage, setWatchlistPage] = useState(1);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);
 
  const [activeTypeFilter, setActiveTypeFilter] = useState<"all" | "movie" | "tv">("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState<WatchlistStatus | "all">("all");
  const [activeSortBy, setActiveSortBy] = useState<"date" | "title" | "year">("date");
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [profileUsername, setProfileUsername] = useState(user?.username || "کاربر");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileJoinDate, setProfileJoinDate] = useState("");
  const [profileStats, setProfileStats] = useState({
    total_rated: 0,
    total_written: 0,
    total_want_to_watch: 0,
    total_watching: 0,
    total_watched: 0
  });

  const allContent = [...MOVIES, ...TV_SERIES];

  useEffect(() => {
    async function fetchProfile() {
      setIsLoadingProfile(true);
      setIsLoadingWatchlist(true);
      setIsLoadingRatings(true);
      
      try {
        const data = await getUserProfile();
        setProfileData(data);
        setProfileUsername(data.username);
        setProfileEmail(data.email);
        setProfileJoinDate(data.join_date);
        setProfilePhotoUrl(data.photo_url || null);
        setProfileStats({
          total_rated: data.total_rated || 0,
          total_written: data.total_written || 0,
          total_want_to_watch: data.total_want_to_watch || 0,
          total_watching: data.total_watching || 0,
          total_watched: data.total_watched || 0
        });

        try {
          const watchlistData = await getUserWatchlist(true);
          console.log('📋 Watchlist data received in profile:', watchlistData);
          console.log('📊 Status distribution:', {
            want_to_watch: watchlistData.filter(i => i.status === 'want_to_watch').length,
            watching: watchlistData.filter(i => i.status === 'watching').length,
            watched: watchlistData.filter(i => i.status === 'watched').length,
          });
         
          console.log('🔍 First 3 items status:', watchlistData.slice(0, 3).map(i => ({ id: i.title_id, name: i.name_fa, status: i.status })));
          setWatchlistItems(watchlistData);
        } catch (watchlistErr) {
          console.error('Failed to fetch watchlist:', watchlistErr);
          const localWatchlist = getWatchlistFromLocalStorage();
          console.log('📋 Local watchlist:', localWatchlist);
          setWatchlistItems(localWatchlist);
        }
        
      try {
        const storedRatings = localStorage.getItem('user_ratings');
        if (storedRatings) {
          const ratingsData = JSON.parse(storedRatings);
          setUserRatings(ratingsData);
          console.log('✅ Ratings loaded from localStorage:', ratingsData.length);
        } else {
          setUserRatings([]);
        }
      } catch (ratingErr) {
        console.error('Failed to load ratings from localStorage:', ratingErr);
        setUserRatings([]);
      }
      } catch (error) {
        if (user) {
          setProfileUsername(user.username);
          setProfileEmail(user.email);
        }
      } finally {
        setIsLoadingProfile(false);
        setIsLoadingWatchlist(false);
        setIsLoadingRatings(false);
      }
    }
    
    fetchProfile();
  }, [user]);

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  function getAvatarInitials(username: string) {
    const parts = username.split(/[^a-zA-Z0-9]/);
    return parts.filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "??";
  }

  function convertWatchlistToMovieData(item: WatchlistItem): MovieData {
    return {
      id: item.title_id,
      title: item.name_fa,
      originalTitle: item.name_en,
      img: item.poster_url || '/placeholder.jpg',
      rating: item.score,
      year: item.release_year,
      duration: item.duration_mins ? `${item.duration_mins} دقیقه` : 
                item.total_seasons ? `${item.total_seasons} فصل` : 'نامشخص',
      age: item.age_rating,
      summary: '',
      genres: item.genres?.split(', ') || [],
      type: item.t_type === 'S' ? 'TV' : 'Movie',
      voteCount: 0,
      similarMovieIds: [],
      cast: [],
      crew: [],
      awards: [],
      reviews: [],
    };
  }

  function normalizeStatus(status: string): WatchlistStatus {
    if (!status) return 'want_to_watch';
    const statusLower = status.toLowerCase();
    if (statusLower === 'want to watch') return 'want_to_watch';
    if (statusLower === 'watching') return 'watching';
    if (statusLower === 'watched') return 'watched';
    return 'want_to_watch';
  }

  let filteredWatchlist = [...watchlistItems];

  if (activeStatusFilter !== "all") {
    filteredWatchlist = filteredWatchlist.filter(item => {
      const normalizedItemStatus = normalizeStatus(item.status);
      return normalizedItemStatus === activeStatusFilter;
    });
  }

  if (activeTypeFilter === "movie") {
    filteredWatchlist = filteredWatchlist.filter(item => item.t_type !== 'S');
  } else if (activeTypeFilter === "tv") {
    filteredWatchlist = filteredWatchlist.filter(item => item.t_type === 'S');
  }

  if (activeSortBy === "title") {
    filteredWatchlist.sort((a, b) => a.name_fa.localeCompare(b.name_fa));
  } else if (activeSortBy === "year") {
    filteredWatchlist.sort((a, b) => b.release_year - a.release_year);
  } else if (activeSortBy === "date") {
    filteredWatchlist.sort((a, b) => b.title_id - a.title_id);
  }

  const ITEMS_PER_PAGE = 6;
  const totalWlPages = Math.ceil(filteredWatchlist.length / ITEMS_PER_PAGE);
  const paginatedWatchlist = filteredWatchlist.slice(
    (watchlistPage - 1) * ITEMS_PER_PAGE, 
    watchlistPage * ITEMS_PER_PAGE
  );

  const stats = [
    { label: t.profile.rated, value: profileStats.total_rated},
    { label: t.profile.reviews, value: profileStats.total_written},
    { label: t.profile.wantToWatch, value: profileStats.total_want_to_watch},
    { label: t.profile.watching, value: profileStats.total_watching},
    { label: t.profile.watched, value: profileStats.total_watched},
  ];

  const REVIEWS_PER_PAGE = 5;
  const totalReviewPages = Math.ceil(userRatings.length / REVIEWS_PER_PAGE);
  const paginatedReviews = userRatings.slice((reviewsPage - 1) * REVIEWS_PER_PAGE, reviewsPage * REVIEWS_PER_PAGE);

  const wantToWatchCount = watchlistItems.filter(i => normalizeStatus(i.status) === 'want_to_watch').length;
  const watchingCount = watchlistItems.filter(i => normalizeStatus(i.status) === 'watching').length;
  const watchedCount = watchlistItems.filter(i => normalizeStatus(i.status) === 'watched').length;
  
  const typeFilters = [
    { id: "all", label: "همه"},
    { id: "movie", label: "فیلم‌ها",},
    { id: "tv", label: "سریال‌ها"},
  ];

  const statusFilters = [
    { id: "all", label: "همه", color: "bg-white/10", textColor: "text-white/70", count: watchlistItems.length },
    { id: "want_to_watch", label: "می‌خواهم تماشا کنم", color: "bg-blue-500/20", textColor: "text-blue-400", count: wantToWatchCount },
    { id: "watching", label: "در حال تماشا", color: "bg-yellow-500/20", textColor: "text-yellow-400", count: watchingCount },
    { id: "watched", label: "تماشا شده", color: "bg-green-500/20", textColor: "text-green-400", count: watchedCount },
  ];

  function openEdit(entry: UserRating) {
    setEditingId(entry.title_id);
    setEditScore(entry.rating_score);
    setEditComment(entry.review_text || "");
  }

  async function saveEdit() {
    if (editingId === null || editScore === 0) return;
    try {
      await addOrUpdateRating(editingId, {
        score: editScore,
        comment: editComment,
        is_spoiler: false,
      });
      setUserRatings(prev => prev.map(r => 
        r.title_id === editingId 
          ? { ...r, rating_score: editScore, review_text: editComment }
          : r
      ));
      onEditRating(editingId, editScore, editComment);
      setEditingId(null);
    } catch (error) {
      alert('خطا در به روزرسانی امتیاز');
    }
  }

  function confirmDelete(id: number) { setConfirmDeleteId(id); }

  async function executeDelete() {
    if (confirmDeleteId !== null) {
      try {
        await deleteRating(confirmDeleteId);
        setUserRatings(prev => prev.filter(r => r.title_id !== confirmDeleteId));
        onDeleteRating(confirmDeleteId);
        setConfirmDeleteId(null);
        const newTotal = userRatings.length - 1;
        const maxPage = Math.ceil(newTotal / REVIEWS_PER_PAGE) || 1;
        if (reviewsPage > maxPage) setReviewsPage(maxPage);
      } catch (error) {
        alert('خطا در حذف امتیاز');
      }
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-32 text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-white/40 mt-4">در حال بارگذاری پروفایل...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      {/* Profile Header - با طراحی جدید */}
      <div className="flex items-start gap-6 mb-12 pb-12 border-b border-white/8 dark:border-white/8 light:border-black/8">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#E50914] to-[#5A0009] flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 shadow-2xl overflow-hidden ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
            {profilePhotoUrl ? (
              <img src={profilePhotoUrl} alt={profileUsername} className="w-full h-full object-cover" />
            ) : (
              getAvatarInitials(profileUsername)
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center">
            <Edit2 size={12} className="text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-[32px] font-bold text-white dark:text-white light:text-black mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {profileUsername}
          </h1>
          <p className="text-white/35 dark:text-white/35 light:text-black/35 text-sm mb-2 font-mono flex items-center gap-2">
            <Mail size={14} /> {profileEmail}
          </p>
          <p className="text-white/25 text-xs flex items-center gap-1.5">
            <Calendar size={12} /> {t.profile.memberSince} 
            {profileJoinDate ? new Date(profileJoinDate).toLocaleDateString('fa-IR') : 'اخیرا'}
          </p>
        </div>
        <button
          onClick={() => { 
            setEditUsername(profileUsername); 
            setEditEmail(profileEmail);
            setEditPhotoUrl(profilePhotoUrl || ""); 
            setCurrentPassword("");
            setEditPassword("");
            setShowEditProfile(true); 
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/8 backdrop-blur-sm border border-white/15 rounded-xl text-white/70 hover:text-white hover:border-white/30 hover:bg-white/12 transition-all duration-300 text-sm font-medium"
        >
          <Edit2 size={14} /> {t.profile.editProfile}
        </button>
      </div>

      {/* Stats Cards - با طراحی کارتی جدید */}
      <div className="grid grid-cols-5 gap-4 mb-14">
        {stats.map((s) => (
          <div key={s.label} className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-5 border border-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
              {toPersianDigits(s.value)}
            </p>
            <p className="text-white/40 text-xs uppercase tracking-wider font-mono">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Watchlist Section - طراحی حرفه‌ای جدید */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
              {t.profile.watchlist}
            </h2>
          </div>
          
          {/* دکمه تغییر وضعیت فیلتر */}
          <button
            onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-sm text-white/70"
          >
            <Filter size={14} />
            فیلترها
            <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterBarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* نوار فیلتر پیشرفته - با انیمیشن */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isFilterBarOpen ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0"}`}>
          <div className="bg-gradient-to-r from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {/* فیلتر وضعیت - دکمه‌های رنگی با آمار */}
            <div className="mb-6">
              <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                <List size={12} /> وضعیت تماشا
              </p>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => { setActiveStatusFilter(filter.id as any); setWatchlistPage(1); }}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeStatusFilter === filter.id
                        ? `${filter.color} ${filter.textColor} border-2 border-current shadow-lg scale-[1.02]`
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {filter.label}
                      {filter.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          activeStatusFilter === filter.id ? "bg-white/20" : "bg-white/10"
                        }`}>
                          {toPersianDigits(filter.count)}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* فیلتر نوع و مرتب‌سازی در یک ردیف */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <p className="text-white/40 text-xs font-mono uppercase tracking-wider">نوع محتوا</p>
                <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                  {typeFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => { setActiveTypeFilter(filter.id as any); setWatchlistPage(1); }}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeTypeFilter === filter.id
                          ? "bg-primary text-white shadow-lg"
                          : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-white/40 text-xs font-mono uppercase tracking-wider">مرتب‌سازی بر اساس</p>
                <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                  {[
                    { id: "date", label: "جدیدترین"},
                    { id: "title", label: "عنوان"},
                    { id: "year", label: "سال"},
                  ].map((sort) => (
                    <button
                      key={sort.id}
                      onClick={() => { setActiveSortBy(sort.id as any); setWatchlistPage(1); }}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeSortBy === sort.id
                          ? "bg-primary text-white shadow-lg"
                          : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* دکمه ریست فیلترها */}
            {(activeStatusFilter !== "all" || activeTypeFilter !== "all") && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setActiveStatusFilter("all");
                    setActiveTypeFilter("all");
                    setActiveSortBy("date");
                    setWatchlistPage(1);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                >
                  <X size={12} /> پاک کردن فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
        
        {isLoadingWatchlist ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-white/40 mt-4 text-sm">در حال بارگذاری لیست تماشا...</p>
          </div>
        ) : watchlistItems.length === 0 ? (
          <div className="text-center py-24 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Bookmark size={32} className="text-white/20" />
            </div>
            <p className="text-white/40 text-base mb-2">لیست تماشای شما خالی است</p>
            <p className="text-white/25 text-sm">با افزودن فیلم و سریال به لیست تماشا، آنها را اینجا مشاهده خواهید کرد</p>
          </div>
        ) : (
          <>
            {/* نمایش نتایج و وضعیت فعال */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/40 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                {toPersianDigits(filteredWatchlist.length)} عنوان در لیست تماشا
                {activeStatusFilter !== "all" && (
                  <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                    {statusFilters.find(f => f.id === activeStatusFilter)?.label}
                  </span>
                )}
              </p>
            </div>

            {/* گرید لیست تماشا */}
            {paginatedWatchlist.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/8">
                <p className="text-white/40 text-sm">هیچ عنوانی با این فیلترها یافت نشد</p>
                <button
                  onClick={() => {
                    setActiveStatusFilter("all");
                    setActiveTypeFilter("all");
                    setActiveSortBy("date");
                    setWatchlistPage(1);
                  }}
                  className="mt-3 text-primary text-xs hover:text-primary/80 transition-colors"
                >
                  نمایش همه عنوان‌ها
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-5 mb-8">
                {paginatedWatchlist.map((item) => {
                  const movieData = convertWatchlistToMovieData(item);
                  return (
                    <div key={item.title_id} className="transform transition-all duration-300 hover:-translate-y-2">
                      <MovieCard 
                        movie={movieData} 
                        onClick={() => setPage(movieData.type === "TV" ? "tv" : "movie", movieData)} 
                        showTypeBadge 
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* صفحه‌بندی مدرن */}
            {totalWlPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button 
                  onClick={() => setWatchlistPage((p) => Math.max(1, p - 1))} 
                  disabled={watchlistPage === 1} 
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                >
                  <ChevronRight size={16} /> قبلی
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: Math.min(totalWlPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setWatchlistPage(p)} 
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-300 ${
                        p === watchlistPage
                          ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 scale-105"
                          : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {toPersianDigits(p)}
                    </button>
                  ))}
                  {totalWlPages > 5 && (
                    <>
                      <span className="text-white/30 px-2">...</span>
                      <button 
                        onClick={() => setWatchlistPage(totalWlPages)} 
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-300 ${
                          totalWlPages === watchlistPage
                            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 scale-105"
                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {toPersianDigits(totalWlPages)}
                      </button>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => setWatchlistPage((p) => Math.min(totalWlPages, p + 1))} 
                  disabled={watchlistPage === totalWlPages} 
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                >
                  بعدی <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Ratings and Reviews Section - با طراحی بهبود یافته */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {t.profile.ratingsAndReviews}
          </h2>
        </div>
        
        {isLoadingRatings ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-white/40 mt-4 text-sm">در حال بارگذاری نظرات...</p>
          </div>
        ) : userRatings.length === 0 ? (
          <div className="text-center py-24 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Star size={32} className="text-white/20" />
            </div>
            <p className="text-white/40 text-base mb-2">هنوز امتیازی ثبت نکرده‌اید</p>
            <p className="text-white/25 text-sm">با امتیاز دادن به فیلم‌ها و سریال‌ها، آنها را اینجا مشاهده خواهید کرد</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {paginatedReviews.map((rating) => {
                const movieData = allContent.find(m => m.id === rating.title_id);
                return (
                  <div key={rating.title_id} className="group bg-gradient-to-r from-white/5 to-white/0 rounded-2xl p-5 border border-white/8 hover:border-white/15 hover:bg-white/5 transition-all duration-300">
                    <div className="flex gap-5">
                      <img
                        src={rating.poster_url || '/placeholder.jpg'}
                        alt={rating.title_name_fa}
                        className="w-16 h-24 object-cover rounded-xl flex-shrink-0 border border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          if (movieData) setPage(rating.t_type === 'S' ? "tv" : "movie", movieData);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div>
                            <h3
                              onClick={() => {
                                if (movieData) setPage(rating.t_type === 'S' ? "tv" : "movie", movieData);
                              }}
                              className="text-foreground font-semibold text-base hover:text-primary transition-colors cursor-pointer"
                            >
                              {rating.title_name_fa}
                            </h3>
                            <p className="text-white/35 text-xs mt-1 flex items-center gap-2">
                              <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(rating.rating_date).toLocaleDateString('fa-IR')}</span>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${rating.t_type === 'S' ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                                {rating.t_type === 'S' ? "سریال" : "فیلم"}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5">
                              <RatingDisplay rating={rating.rating_score} size="sm" />
                              <span className="text-white/30 text-xs">/{toPersianDigits(10)}</span>
                            </div>
                            <button
                              onClick={() => openEdit(rating)}
                              className="p-2 text-white/30 hover:text-white/70 hover:bg-white/10 rounded-xl transition-all"
                              title={t.profile.edit}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => confirmDelete(rating.title_id)}
                              className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                              title={t.profile.delete}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {rating.review_text ? (
                          <p className="text-white/45 text-sm leading-relaxed line-clamp-2 mt-2">{rating.review_text}</p>
                        ) : (
                          <p className="text-white/20 text-xs italic mt-2">{t.profile.noWrittenReview}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {totalReviewPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setReviewsPage((p) => Math.max(1, p - 1))} disabled={reviewsPage === 1} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">
                  <ChevronRight size={16} /> قبلی
                </button>
                {Array.from({ length: Math.min(totalReviewPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setReviewsPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p === reviewsPage ? "bg-primary text-white shadow-lg scale-105" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>{toPersianDigits(p)}</button>
                ))}
                {totalReviewPages > 5 && (
                  <>
                    <span className="text-white/30 px-2">...</span>
                    <button onClick={() => setReviewsPage(totalReviewPages)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${totalReviewPages === reviewsPage ? "bg-primary text-white shadow-lg scale-105" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>{toPersianDigits(totalReviewPages)}</button>
                  </>
                )}
                <button onClick={() => setReviewsPage((p) => Math.min(totalReviewPages, p + 1))} disabled={reviewsPage === totalReviewPages} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">
                  بعدی <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={() => setShowEditProfile(false)}>
          <div className="bg-card border border-white/15 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>ویرایش پروفایل</h2>
              <button onClick={() => setShowEditProfile(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <div className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-white/60 text-sm mb-2">نام کاربری</label>
                <input 
                  type="text" 
                  value={editUsername} 
                  onChange={(e) => setEditUsername(e.target.value)} 
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors" 
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-white/60 text-sm mb-2">ایمیل</label>
                <input 
                  type="email" 
                  value={editEmail} 
                  onChange={(e) => setEditEmail(e.target.value)} 
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors" 
                />
              </div>
              
              {/* Photo URL */}
              <div>
                <label className="block text-white/60 text-sm mb-2">آدرس عکس پروفایل</label>
                <input 
                  type="url" 
                  value={editPhotoUrl} 
                  onChange={(e) => setEditPhotoUrl(e.target.value)} 
                  placeholder="https://example.com/photo.jpg" 
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors" 
                />
              </div>
              
              {/* Current Password */}
              <div>
                <label className="block text-white/60 text-sm mb-2">رمز عبور فعلی <span className="text-red-400 text-xs">(برای تغییر رمز الزامی است)</span></label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordError(""); // Clear error when user types
                  }} 
                  placeholder="رمز عبور فعلی را وارد کنید" 
                  className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors ${
                    passwordError ? "border-red-500 border-2" : "border-white/10"
                  }`}
                />
                {passwordError && (
                  <p className="text-red-400 text-xs mt-1">{passwordError}</p>
                )}
              </div>
              
              {/* New Password */}
              <div>
                <label className="block text-white/60 text-sm mb-2">رمز عبور جدید (اختیاری)</label>
                <input 
                  type="password" 
                  value={editPassword} 
                  onChange={(e) => setEditPassword(e.target.value)} 
                  placeholder="رمز عبور جدید" 
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors" 
                />
              </div>
              
              {/* Delete Account Section */}
              <div className="pt-4 border-t border-white/10">
                <button 
                  onClick={() => setShowDeleteModal(true)} 
                  className="w-full px-6 py-3 bg-red-600/20 border border-red-500/50 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-600/30 transition-all"
                >
                  حذف حساب کاربری
                </button>
                <p className="text-white/30 text-xs text-center mt-2">برای حذف حساب، رمز عبور خود را وارد کنید</p>
              </div>
              
              {/* Buttons */}
              {generalError && (
                <p className="text-red-400 text-sm text-center py-2">{generalError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowEditProfile(false)} 
                  className="flex-1 px-6 py-3 bg-white/8 border border-white/15 text-white rounded-lg text-sm font-medium hover:bg-white/12 transition-all"
                >
                  انصراف
                </button>
                
                <button 
                  onClick={async () => { 
                    try { 
                      // Clear previous errors
                      setPasswordError("");
                      setGeneralError("");
                      
                      // Check if trying to change password without current password
                      if (editPassword.trim() && !currentPassword.trim()) {
                        setPasswordError("برای تغییر رمز عبور، رمز عبور فعلی الزامی است");
                        return;
                      }
                      
                      // Prepare update data with all fields
                      const updateData = {
                        current_password: currentPassword.trim() || null,
                        username: (editUsername.trim() && editUsername !== profileUsername) ? editUsername.trim() : null,
                        email: (editEmail.trim() && editEmail !== profileEmail) ? editEmail.trim() : null,
                        photo_url: (editPhotoUrl.trim() && editPhotoUrl !== profilePhotoUrl) ? editPhotoUrl.trim() : null,
                        new_password: editPassword.trim() || null
                      };
                      
                      // Only proceed if there's at least one field to update
                      const hasChanges = Object.values(updateData).some(value => value !== null);
                      if (!hasChanges) {
                        setGeneralError("هیچ تغییری اعمال نشده است");
                        return;
                      }
                      
                      // Send to backend and get response with new token and user data
                      const response = await updateProfile(updateData);
                      
                      // Update token in localStorage
                      if (response.access_token) {
                        localStorage.setItem('access_token', response.access_token);
                      }
                      
                      // Update user data from backend response
                      setProfileUsername(response.username);
                      setProfileEmail(response.email);
                      // Use default photo_url if backend doesn't return one
                      const defaultPhotoUrl = 'https://ui-avatars.com/api/?background=E50914&color=fff&size=96&name=' + encodeURIComponent(response.username);
                      setProfilePhotoUrl(defaultPhotoUrl);
                      
                      // Update localStorage user_data
                      const updatedUserData = {
                        user_id: response.user_id,
                        username: response.username,
                        email: response.email,
                        photo_url: defaultPhotoUrl
                      };
                      localStorage.setItem('user_data', JSON.stringify(updatedUserData));
                      
                      // Close modal and reset form
                      setShowEditProfile(false); 
                      setEditPassword(""); 
                      setEditPhotoUrl("");
                      setCurrentPassword("");
                      setPasswordError("");
                      setGeneralError("");
                      setEditEmail("");
                      setEditUsername("");
                                            
                    } catch (error: any) { 
                      console.error('Update error:', error);
                      
                      let errorMessage = "خطا در به روزرسانی پروفایل";
                      
                      if (error?.message && typeof error.message === 'string') {
                        errorMessage = error.message;
                      } else if (error?.toString && error.toString() !== '[object Object]') {
                        errorMessage = error.toString();
                      }
                      
                      if (errorMessage.includes("422") || 
                          errorMessage.includes("password") || 
                          errorMessage.includes("رمز") ||
                          errorMessage.includes("current")) {
                        setPasswordError("رمز عبور فعلی اشتباه است");
                      } else {
                        setGeneralError(errorMessage);
                      }
                    }
                  }} 
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent transition-all shadow-lg shadow-primary/20"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-8" onClick={() => {
          setShowDeleteModal(false);
          setDeletePassword("");
          setDeleteError("");
        }}>
          <div className="bg-card border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>حذف حساب کاربری</h2>
              <button onClick={() => {
                setShowDeleteModal(false);
                setDeletePassword("");
                setDeleteError("");
              }} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
                  <div className="text-red-500 text-2xl font-bold">!</div>
                </div>
                <p className="text-white/80 text-sm mb-2">
                  آیا از حذف حساب کاربری خود اطمینان دارید؟
                </p>
                <p className="text-white/40 text-xs">
                  این عمل غیرقابل بازگشت است و تمام اطلاعات شما برای همیشه حذف خواهد شد.
                </p>
              </div>
              
              <div>
                <label className="block text-white/60 text-sm mb-2">رمز عبور خود را وارد کنید</label>
                <input 
                  type="password" 
                  value={deletePassword} 
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError("");
                  }} 
                  placeholder="رمز عبور فعلی" 
                  className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors ${
                    deleteError ? "border-red-500 border-2" : "border-white/10"
                  }`}
                />
                {deleteError && (
                  <p className="text-red-400 text-xs mt-1">{deleteError}</p>
                )}
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                    setDeleteError("");
                  }} 
                  className="flex-1 px-6 py-3 bg-white/8 border border-white/15 text-white rounded-lg text-sm font-medium hover:bg-white/12 transition-all"
                >
                  انصراف
                </button>
                
                <button 
                  onClick={async () => { 
                    if (!deletePassword.trim()) {
                      setDeleteError("لطفاً رمز عبور خود را وارد کنید");
                      return;
                    }
                    
                    setIsDeleting(true);
                    setDeleteError("");
                    
                    try { 
                      await deleteProfile(deletePassword); 
                      localStorage.removeItem('access_token'); 
                      localStorage.removeItem('user_data'); 
                      setPage("home"); 
                      window.location.reload(); 
                    } catch (error: any) { 
                      console.error('Delete error:', error);
                      setDeleteError("رمز عبور اشتباه است یا خطایی رخ داده است");
                    } finally {
                      setIsDeleting(false);
                    } 
                  }} 
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "در حال حذف..." : "تأیید و حذف"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rating Modal - بدون تغییر */}
      {editingId !== null && (() => {
        const rating = userRatings.find(r => r.title_id === editingId);
        if (!rating) return null;
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={() => setEditingId(null)}>
            <div className="bg-card border border-white/15 dark:border-white/15 light:border-black/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.editRating.title}</h2>
                <button onClick={() => setEditingId(null)} className="text-white/40 dark:text-white/40 light:text-black/40 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"><X size={20} /></button>
              </div>
              <p className="text-white/40 dark:text-white/40 light:text-black/50 text-sm mb-6">{rating.title_name_fa}</p>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">{t.editRating.yourRating} <span className="text-white/30 dark:text-white/30 light:text-black/40 text-xs">({t.editRating.required})</span></label>
                    {editScore > 0 && (<span className="text-amber-400 font-semibold">{toPersianDigits(editScore)}/{toPersianDigits(10)}</span>)}
                  </div>
                  <HalfStarRating value={editScore} onChange={setEditScore} size={26} />
                  {editScore === 0 && (<p className="text-primary text-xs mt-2">{t.editRating.scoreRequired}</p>)}
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">{t.editRating.review} <span className="text-white/30 dark:text-white/30 light:text-black/40 text-xs">({t.editRating.optional})</span></label>
                  <textarea rows={4} value={editComment} onChange={(e) => setEditComment(e.target.value)} className="w-full bg-background border border-white/10 dark:border-white/10 light:border-black/15 rounded-lg px-4 py-3 text-foreground placeholder:text-white/25 dark:placeholder:text-white/25 light:placeholder:text-black/30 text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none" placeholder={t.editRating.reviewPlaceholderLong} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditingId(null)} className="flex-1 px-6 py-3 bg-white/8 dark:bg-white/8 light:bg-white border border-white/15 dark:border-white/15 light:border-black/20 text-foreground rounded-lg text-sm font-medium hover:bg-white/12 dark:hover:bg-white/12 light:hover:bg-black/5 transition-all">{t.editRating.cancel}</button>
                  <button onClick={saveEdit} disabled={editScore === 0} className="flex-1 px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed">{t.editRating.saveChanges}</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation Modal - بدون تغییر */}
      {confirmDeleteId !== null && (() => {
        const rating = userRatings.find(r => r.title_id === confirmDeleteId);
        if (!rating) return null;
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={() => setConfirmDeleteId(null)}>
            <div className="bg-card border border-white/15 dark:border-white/15 light:border-black/20 rounded-2xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.deleteConfirm.deleteRating}</h2>
                <button onClick={() => setConfirmDeleteId(null)} className="text-white/40 dark:text-white/40 light:text-black/40 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"><X size={18} /></button>
              </div>
              <p className="text-white/55 dark:text-white/55 light:text-black/60 text-sm mb-1">{t.deleteConfirm.removeRatingFor}</p>
              <p className="text-foreground font-semibold mb-4">{rating.title_name_fa}</p>
              <p className="text-white/35 dark:text-white/35 light:text-black/45 text-xs mb-6">{t.deleteConfirm.permanentDelete}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 px-5 py-3 bg-white/8 dark:bg-white/8 light:bg-white border border-white/15 dark:border-white/15 light:border-black/20 text-foreground rounded-lg text-sm font-medium hover:bg-white/12 dark:hover:bg-white/12 light:hover:bg-black/5 transition-all">{t.deleteConfirm.cancel}</button>
                <button onClick={executeDelete} className="flex-1 px-5 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent transition-colors">{t.deleteConfirm.delete}</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [pageHistory, setPageHistory] = useState<Page[]>([]);
  const [ratedTitles, setRatedTitles] = useState<RatedEntry[]>(SEED_RATINGS);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authGateModal, setAuthGateModal] = useState<"login" | "signup" | null>(null);
  const [currentUser, setCurrentUser] = useState<{ user_id: number; username: string; email: string } | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return (saved === "light" || saved === "dark") ? saved : "dark";
    }
    return "dark";
  });

  const [userReviews, setUserReviews] = useState<RatedEntry[]>(SEED_RATINGS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewTitle, setCurrentReviewTitle] = useState<MovieData | null>(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    const token = localStorage.getItem('access_token');
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function navigate(p: Page, movieData?: MovieData) {
    console.log('Navigating to:', p, 'isLoggedIn:', isLoggedIn);
    
    if (p === "profile" && !isLoggedIn) {
      console.log('Profile access denied, showing auth modal');
      setAuthGateModal("login");
      return;
    }
    if (movieData) {
      setSelectedMovie(movieData);
    }
    setPageHistory((prev) => [...prev, page]);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function navigateBack() {
    if (pageHistory.length === 0) { setPage("home"); return; }
    const prev = pageHistory[pageHistory.length - 1];
    setPageHistory((h) => h.slice(0, -1));
    setPage(prev);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleOpenReviewModal(movie: MovieData) {
    if (!isLoggedIn) {
      setAuthGateModal("login");
      return;
    }
    setCurrentReviewTitle(movie);
    setShowReviewModal(true);
  }

  async function handleSubmitReview(data: { rating: number; reviewText: string }) {
    if (!currentReviewTitle) return;
    
    try {
      await addOrUpdateRating(currentReviewTitle.id, {
        score: data.rating,
        comment: data.reviewText,
        is_spoiler: false,
      });

      const existingIndex = userReviews.findIndex(r => r.id === currentReviewTitle.id);
      const newReview: RatedEntry = {
        id: currentReviewTitle.id,
        title: currentReviewTitle.title,
        img: currentReviewTitle.img,
        type: currentReviewTitle.type === "TV" ? "TV" : "Movie",
        score: data.rating,
        review: data.reviewText,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      
      if (existingIndex !== -1) {
        const newReviews = [...userReviews];
        newReviews[existingIndex] = newReview;
        setUserReviews(newReviews);
      } else {
        setUserReviews([newReview, ...userReviews]);
      }
      
      setShowReviewModal(false);
      setCurrentReviewTitle(null);
    } catch (error) {
      console.error('Error saving review:', error);
      alert('خطا در ذخیره نقد. لطفاً دوباره تلاش کنید.');
    }
  }

  async function handleLogin() {
    console.log('Handling login...');
    
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        console.log('User set:', user);
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
    
    setIsLoggedIn(true);
    setAuthGateModal(null);
    
    console.log('Login completed, isLoggedIn set to true');

    try {
      const watchlist = await syncWatchlistFromServer();
      console.log('Watchlist synced:', watchlist.length, 'items');
    } catch (error) {
      console.error('Failed to sync watchlist:', error);
    }
 
    if (page === "home") {
      window.location.reload();
    }
  }

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_watchlist');
    
    setCurrentUser(null);
    setIsLoggedIn(false);
    
    if (page === "profile") {
      setPage("home");
      setPageHistory([]);
    }
    
    window.location.href = '/';
  }

  function handleRate(entry: RatedEntry) {
    if (ratedTitles.some((r) => r.id === entry.id)) return;
    setRatedTitles((prev) => [entry, ...prev]);
  }

  function handleEditRating(id: number, score: number, review: string) {
    setRatedTitles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, score, review } : r))
    );
  }

  function handleDeleteRating(id: number) {
    setRatedTitles((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Nav
        page={page}
        setPage={navigate}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={toggleTheme}
        currentUser={currentUser}
      />
      {authGateModal && (
        <AuthFlow
          initialScreen={authGateModal}
          onClose={() => setAuthGateModal(null)}
          onSuccess={() => {
            handleLogin();
            setAuthGateModal(null);
            setPageHistory((prev) => [...prev, page]);
            setPage("profile");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          reason="profile"
        />
      )}
      {page === "design" && <DesignSystemPage />}
      {page === "home" && (
        <HomePage
          setPage={navigate}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          isLoggedIn={isLoggedIn}
          onAuthRequest={() => setAuthGateModal("login")}
        />
      )}

      {page === "movie" && selectedMovie && (
        <MovieDetailPage 
          movie={selectedMovie} 
          setPage={navigate} 
          navigateBack={navigateBack} 
          ratedTitles={ratedTitles} 
          onRate={handleRate} 
          setGlobalSearch={setGlobalSearch} 
          isLoggedIn={isLoggedIn} 
          onAuthRequest={() => setAuthGateModal("login")}
          onOpenReviewModal={handleOpenReviewModal}
          userReviews={userReviews}
        />
      )}
      {page === "tv" && selectedMovie && (
        <TVDetailPage 
          movie={selectedMovie} 
          setPage={navigate} 
          navigateBack={navigateBack} 
          ratedTitles={ratedTitles} 
          onRate={handleRate} 
          setGlobalSearch={setGlobalSearch} 
          isLoggedIn={isLoggedIn} 
          onAuthRequest={() => setAuthGateModal("login")}
          onOpenReviewModal={handleOpenReviewModal}
          userReviews={userReviews}
        />
      )}

      {page === "browse" && (
        <BrowsePage
          setPage={navigate}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />
      )}

      {page === "profile" && (
        <ProfilePage
          setPage={navigate}
          ratedTitles={ratedTitles}
          onEditRating={handleEditRating}
          onDeleteRating={handleDeleteRating}
          user={currentUser}
        />
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        titleId={currentReviewTitle?.id || 0}
        titleName={currentReviewTitle?.title || ""}
        titleImg={currentReviewTitle?.img}
        titleType={currentReviewTitle?.type === "TV" ? "TV" : "Movie"}
        existingReview={userReviews.find(r => r.id === currentReviewTitle?.id) ? {
          rating: userReviews.find(r => r.id === currentReviewTitle?.id)?.score || 0,
          reviewText: userReviews.find(r => r.id === currentReviewTitle?.id)?.review || ""
        } : null}
        onSubmit={handleSubmitReview}
        isLoggedIn={isLoggedIn}
        onAuthRequest={() => setAuthGateModal("login")}
      />
    </div>
  );
}
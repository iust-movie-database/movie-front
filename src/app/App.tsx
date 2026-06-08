import { useState, useRef, useEffect } from "react";
import {
  Star, Bookmark, BookmarkCheck, Search, ChevronLeft, ChevronRight,
  ChevronDown, X, Edit2, Trash2, Award, Calendar, Clock, Sun, Moon,
} from "lucide-react";
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
import { MOVIES, TV_SERIES, COMING_SOON, SEED_RATINGS } from "./data/mockData";
import type { Page, MovieData, ComingSoonData, RatedEntry } from "./types";

// ── Shared Components (remaining in-file for now) ──────────────────────────────

// ── Navigation ─────────────────────────────────────────────────────────────────

function Nav({
  page, setPage, globalSearch, setGlobalSearch, isLoggedIn, onLogin, onLogout, theme, onThemeToggle,
}: {
  page: Page;
  setPage: (p: Page) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
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
          {/* Logo */}
          <button onClick={() => setPage("home")} className="flex-shrink-0 flex items-center gap-1.5 mr-2">
            <span className="text-primary font-bold text-2xl tracking-tight leading-none" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.appName}</span>
          </button>

          {/* Nav Links */}
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

          {/* Expanded Search Input */}
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

          {/* Right side */}
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/6 dark:bg-white/6 light:bg-black/6 border border-white/12 dark:border-white/12 light:border-black/12 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E50914] to-[#5A0009] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                    JD
                  </div>
                  <span className="text-white/80 dark:text-white/80 light:text-black/80 text-sm font-medium">john_doe</span>
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

        {/* Search dropdown */}
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

      {/* Colors */}
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

      {/* Typography */}
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

      {/* Components */}
      <section>
        <h2
          className="text-xl font-bold text-white mb-6 uppercase tracking-wide"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Components
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Movie Card */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/8">
            <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono mb-5">Movie Card</p>
            <div className="w-44">
              <MovieCard movie={MOVIES[0]} />
            </div>
          </div>

          {/* Buttons + Interactive */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/8 space-y-8">
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-mono mb-4">Save Button</p>
              <div className="flex gap-3">
                <SaveButton saved={false} />
                <SaveButton saved={true} />
                <SaveButton saved={btnSaved} onToggle={() => setBtnSaved(!btnSaved)} />
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


// ── Page 2: Homepage ───────────────────────────────────────────────────────────

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
  const genres = [t.genres.action, t.genres.drama, t.genres.scifi, t.genres.horror, t.genres.comedy];
  const heroSlides = MOVIES.slice(0, 4);
  const hero = heroSlides[heroIndex];
  const allContent: MovieData[] = [...MOVIES, ...TV_SERIES];

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000); // 6 seconds per slide
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
  const filteredAll = filterContent(allContent);
  const filteredMovies = filterContent(MOVIES);
  const filteredTV = filterContent(TV_SERIES);
  const filteredComingSoon = COMING_SOON.filter((m) =>
    (!globalSearch.trim() || m.title.toLowerCase().includes(globalSearch.toLowerCase())) &&
    (!activeGenre || m.genres.includes(activeGenre))
  );

  function handleGenre(g: string) {
    setActiveGenre(activeGenre === g ? null : g);
  }

  function clearAll() {
    setActiveGenre(null);
    setGlobalSearch("");
  }

  return (
    <div>
      {/* Hero Carousel — hidden while filtering */}
      {!isFiltering && (
        <section
          className="relative h-[700px] overflow-hidden bg-background"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slides Container — cinematic backdrop presentation */}
          <div className="absolute inset-0">
            {heroSlides.map((slide, i) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  i === heroIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {/* Blurred background fill */}
                <img
                  src={slide.img.replace("w=400&h=600", "w=1440&h=700")}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover scale-110 blur-2xl opacity-50"
                />
                {/* Main backdrop — wide, preserving composition */}
                <img
                  src={slide.img.replace("w=400&h=600", "w=1440&h=700")}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            ))}
          </div>

          {/* Persistent gradient overlays — always visible, never fade with slides */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/50" />
          </div>

          {/* Content Container — always visible, updates only on slide change */}
          <div className="relative z-30 h-full max-w-[1440px] mx-auto px-8 flex items-center pb-24">
            <div className="max-w-2xl space-y-5">
              {/* Content Type Badge */}
              <div>
                <span className={`inline-block px-4 py-1.5 text-white text-sm font-bold rounded-lg uppercase tracking-wide ${
                  hero.type === "TV"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700"
                    : "bg-gradient-to-r from-primary to-accent"
                }`}>
                  {hero.type === "TV" ? t.common.tvSeries : t.common.movie}
                </span>
              </div>

              {/* Persian Title */}
              <h1
                className="text-[46px] font-black text-white leading-tight tracking-tight"
                style={{ fontFamily: "'Vazirmatn', sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                {hero.title}
              </h1>

              {/* English Title */}
              <p className="text-white/55 text-lg font-light tracking-wide">
                {hero.originalTitle}
              </p>

              {/* Metadata Row */}
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

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {hero.genres.slice(0, 4).map((g) => {
                  const IconComponent = genreIcons[g];
                  return (
                    <span
                      key={g}
                      className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-br from-white/12 to-white/8 backdrop-blur-md border border-white/20 text-white/90 text-sm rounded-xl font-medium shadow-lg shadow-black/30 hover:from-primary/20 hover:to-accent/15 hover:border-primary/40 transition-all duration-300"
                    >
                      {IconComponent && (
                        <IconComponent size={16} className="text-primary/90 drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]" />
                      )}
                      {g}
                    </span>
                  );
                })}
              </div>

              {/* Description */}
              <p className="text-white/80 text-base leading-relaxed max-w-xl line-clamp-3">
                {hero.summary}
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setPage(hero.type === "TV" ? "tv" : "movie", hero)}
                  className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/30"
                >
                  {t.detail.viewDetails}
                </button>
                <button className="px-6 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2">
                  <Bookmark size={18} />
                  {t.detail.save}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-8 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full px-6 py-4 shadow-2xl">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-primary/50 transition-all hover:scale-110 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-3">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all rounded-full ${
                    i === heroIndex
                      ? "w-12 h-3 bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/60"
                      : "w-3 h-3 bg-white/30 hover:bg-white/50 hover:w-8"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-primary/50 transition-all hover:scale-110 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
          </div>
        </section>
      )}

      <div className="max-w-[1440px] mx-auto px-8 py-14 space-y-16">
        {/* Popular Genres */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-wide uppercase" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.home.popularGenres}</h2>
            {isFiltering && (
              <button onClick={clearAll} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
                <X size={13} /> {t.home.clearFilters}
              </button>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            {genres.map((g) => (
              <button key={g} onClick={() => handleGenre(g)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  activeGenre === g
                    ? "bg-primary border-primary text-white"
                    : "bg-transparent border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                }`}>
                {g}
              </button>
            ))}
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
            {/* Recommended — logged-in only */}
            {isLoggedIn && (
              <section>
                <SectionHeader title={t.home.recommendedForYou} />
                <div className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
                  {MOVIES.slice(0, 5).map((m) => (
                    <div key={m.id} className="flex-shrink-0 w-44">
                      <MovieCard movie={m} onClick={() => setPage("movie", m)} showTypeBadge />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Top Rated Movies */}
            <section>
              <SectionHeader title={t.home.topRatedMovies} action={t.home.seeAll} onActionClick={() => setPage("browse")} />
              <div className="grid grid-cols-5 gap-5">
                {MOVIES.slice(0, 5).map((m) => (
                  <MovieCard key={m.id} movie={m} onClick={() => setPage("movie", m)} showTypeBadge />
                ))}
              </div>
            </section>

            {/* Top Rated Series */}
            <section>
              <SectionHeader title={t.home.topRatedSeries} action={t.home.seeAll} onActionClick={() => setPage("browse")} />
              <div className="grid grid-cols-5 gap-5">
                {TV_SERIES.map((m) => (
                  <MovieCard key={m.id} movie={m} onClick={() => setPage("tv", m)} showTypeBadge />
                ))}
              </div>
            </section>

            {/* Coming Soon */}
            <section>
              <SectionHeader title={t.home.comingSoon} action={t.home.seeCalendar} onActionClick={() => setPage("browse")} />
              <div className="grid grid-cols-5 gap-5">
                {COMING_SOON.map((m) => {
                  // For coming soon items, we need full movie data
                  const allContent = [...MOVIES, ...TV_SERIES];
                  const fullData = allContent.find(movie => movie.id === m.id) || {
                    ...m,
                    rating: 0,
                    duration: "TBA",
                    summary: "Coming soon...",
                    age: "TBA",
                    voteCount: 0
                  } as MovieData;
                  return (
                  <div key={m.id} onClick={() => setPage(m.type === "TV" ? "tv" : "movie", fullData)}
                    className="relative group rounded-xl overflow-hidden bg-card border border-white/10 dark:border-white/10 light:border-black/15 hover:border-white/25 dark:hover:border-white/25 light:hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 dark:hover:shadow-black/40 light:hover:shadow-primary/15 cursor-pointer">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded tracking-wider uppercase">{t.badges.comingSoon}</span>
                        <span className={`px-2 py-0.5 text-white text-[9px] font-bold rounded uppercase tracking-wider ${m.type === "TV" ? "bg-blue-600/80" : "bg-purple-600/80"}`}>{m.type === "TV" ? t.common.tvSeries : t.common.movie}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-xs">
                        <Calendar size={11} /><span>{m.releaseDate}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-foreground text-sm leading-tight mb-0.5 line-clamp-1">{m.title}</h3>
                      <p className="text-white/35 dark:text-white/35 light:text-black/40 text-[11px] leading-tight mb-1.5 line-clamp-1 font-light">{m.originalTitle}</p>
                      <div className="flex flex-wrap gap-1">
                        {m.genres.map((g) => <span key={g} className="px-1.5 py-0.5 bg-white/8 dark:bg-white/8 light:bg-black/8 rounded text-white/50 dark:text-white/50 light:text-black/60 text-[10px]">{g}</span>)}
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}


// ── Page 3: Movie Detail ───────────────────────────────────────────────────────

function MovieDetailPage({
  movie,
  setPage,
  navigateBack,
  ratedTitles,
  onRate,
  setGlobalSearch,
}: {
  movie: MovieData;
  setPage: (p: Page, movieData?: MovieData) => void;
  navigateBack: () => void;
  ratedTitles: RatedEntry[];
  onRate: (entry: RatedEntry) => void;
  setGlobalSearch: (q: string) => void;
}) {
  const [saved, setSaved] = useState(false);
  const [pendingScore, setPendingScore] = useState(0);
  const existingRating = ratedTitles.find((r) => r.id === movie.id);

  function goToBrowseWithQuery(q: string) {
    setGlobalSearch(q);
    setPage("browse");
  }

  function submitRating() {
    if (pendingScore === 0) return;
    onRate({
      id: movie.id,
      title: movie.title,
      img: movie.img,
      type: "Movie",
      score: pendingScore,
      review: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
  }

  const allContent = [...MOVIES, ...TV_SERIES];
  const cast = movie.cast ?? [];
  const crew = movie.crew ?? [];
  const awards = movie.awards ?? [];
  const reviews = movie.reviews ?? [];
  const similarMovies = (movie.similarMovieIds ?? []).map((id) => allContent.find((m) => m.id === id)).filter(Boolean) as typeof MOVIES;

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton onClick={navigateBack} />
      </div>

      {/* Header */}
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
              <GenrePill key={g} genre={g} onClick={() => goToBrowseWithQuery(g)} />
            ))}
          </div>
          <h1
            className="text-[36px] font-bold text-white mb-2 leading-tight"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {movie.title}
          </h1>
          <p className="text-white/35 text-base mb-5">{movie.originalTitle}</p>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <RatingDisplay rating={movie.rating} size="lg" />
              <span className="text-white/40 text-sm">/{toPersianDigits(10)}</span>
              <span className="text-white/35 text-sm">({formatPersianNumber(movie.voteCount || 0)} {t.common.votes})</span>
            </div>
            <span className="text-white/20">·</span>
            <span className="text-white/60 text-sm">{toPersianDigits(movie.year)}</span>
            <span className="text-white/20">·</span>
            <span className="border border-white/25 text-white/50 text-xs px-2 py-0.5 rounded">{movie.age}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/60 text-sm flex items-center gap-1.5">
              <Clock size={13} /> {movie.duration}
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-2xl">{movie.summary}</p>
          <div className="flex gap-3 flex-wrap items-center">
            <SaveButton saved={saved} onToggle={() => setSaved(!saved)} />
            {existingRating ? (
              <div className="flex items-center gap-3 bg-[#1A1A1A] border border-primary/30 rounded-lg px-4 py-2.5">
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
            ) : (
              <div className="flex items-center gap-3 bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5">
                <span className="text-white/40 text-sm">{t.detail.rate}</span>
                <HalfStarRating value={pendingScore} onChange={setPendingScore} size={16} />
                {pendingScore > 0 && (
                  <>
                    <span className="text-amber-400 text-sm font-semibold">{toPersianDigits(pendingScore)}/{toPersianDigits(10)}</span>
                    <button
                      onClick={submitRating}
                      className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-md hover:bg-accent transition-colors ml-1"
                    >
                      {t.detail.submit}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Cast */}
        <section>
          <SectionHeader title={t.detail.cast} />
          <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {cast.map((a) => (
              <div key={a.name} onClick={() => goToBrowseWithQuery(a.name)} className="flex-shrink-0 w-[120px] text-center group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-3 w-[120px] h-[120px] border border-white/10">
                  <img
                    src={a.img}
                    alt={a.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-white text-xs font-semibold leading-tight">{a.name}</p>
                <p className="text-white/40 text-[11px] mt-0.5 leading-tight">{a.character}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Crew */}
        <section>
          <SectionHeader title={t.detail.crew} />
          <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {crew.map((c) => (
              <div key={c.name} onClick={() => goToBrowseWithQuery(c.name)} className="flex-shrink-0 bg-[#1A1A1A] rounded-xl px-5 py-4 border border-white/8 hover:border-white/18 hover:bg-white/3 transition-colors min-w-[160px] cursor-pointer">
                <p className="text-white text-sm font-semibold mb-1">{c.name}</p>
                <p className="text-white/40 text-xs">{c.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section>
          <SectionHeader title={t.detail.awards} />
          <div className="space-y-2.5">
            {awards.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-[#1A1A1A] rounded-xl px-5 py-3.5 border border-white/8 hover:border-white/15 transition-colors"
              >
                <span className="text-white/35 text-xs font-mono w-10 flex-shrink-0">{toPersianDigits(a.year)}</span>
                <Award size={14} className={`flex-shrink-0 ${a.status === "won" ? "text-amber-400" : "text-white/20"}`} />
                <span className="text-white/80 text-sm font-medium flex-shrink-0">{a.name}</span>
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

        {/* Similar Titles */}
        <section>
          <SectionHeader title={t.detail.similarTitles} />
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {similarMovies.map((m) => (
              <div key={m.id} className="flex-shrink-0 w-40">
                <MovieCard movie={m} onClick={() => setPage(m.type === "TV" ? "tv" : "movie", m)} />
              </div>
            ))}
          </div>
        </section>

        {/* User Reviews */}
        <section>
          <SectionHeader title={t.detail.reviews} />
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.user}
                className="flex items-center gap-6 bg-[#1A1A1A] rounded-xl px-6 py-4 border border-white/8 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center gap-3 flex-shrink-0 w-44">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E50914]/40 to-[#E50914]/10 border border-primary/30 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {r.user[0].toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-medium">{r.user}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RatingDisplay rating={r.score} size="sm" />
                  <span className="text-white/30 text-xs">/{toPersianDigits(10)}</span>
                </div>
                {r.spoiler && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider">
                    {t.detail.spoilerWarning}
                  </span>
                )}
                <p className="text-white/50 text-sm leading-relaxed flex-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Page 4: TV Series Detail ───────────────────────────────────────────────────

function TVDetailPage({
  movie,
  setPage,
  navigateBack,
  ratedTitles,
  onRate,
  setGlobalSearch,
}: {
  movie: MovieData;
  setPage: (p: Page, movieData?: MovieData) => void;
  navigateBack: () => void;
  ratedTitles: RatedEntry[];
  onRate: (entry: RatedEntry) => void;
  setGlobalSearch: (q: string) => void;
}) {
  const [saved, setSaved] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(1);
  const [pendingScore, setPendingScore] = useState(0);
  const tvShow = movie;
  const existingRating = ratedTitles.find((r) => r.id === tvShow.id);

  function goToBrowseWithQuery(q: string) {
    setGlobalSearch(q);
    setPage("browse");
  }

  function submitRating() {
    if (pendingScore === 0) return;
    onRate({
      id: tvShow.id,
      title: tvShow.title,
      img: tvShow.img,
      type: "TV",
      score: pendingScore,
      review: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
  }

  const allContent = [...MOVIES, ...TV_SERIES];
  const cast = tvShow.cast ?? [];
  const crew = tvShow.crew ?? [];
  const awards = tvShow.awards ?? [];
  const reviews = tvShow.reviews ?? [];
  const similarShows = (tvShow.similarMovieIds ?? []).map((id) => allContent.find((m) => m.id === id)).filter(Boolean) as typeof TV_SERIES;
  const seasons = [
    {
      num: 1,
      year: 2022,
      episodes: [
        { num: 1, title: "System", duration: "35m", releaseDate: "Jun 23, 2022", desc: "Carmen Berzatto returns to Chicago to run his late brother's sandwich shop after a tragedy." },
        { num: 2, title: "Hands", duration: "32m", releaseDate: "Jun 23, 2022", desc: "The kitchen is under pressure as the crew adapts to Carmy's new management style." },
        { num: 3, title: "Brigade", duration: "28m", releaseDate: "Jun 23, 2022", desc: "Carmy attempts to bring structure and order to the chaotic kitchen environment." },
        { num: 4, title: "Dogs", duration: "30m", releaseDate: "Jun 23, 2022", desc: "Sydney's past catches up with her as tensions in the kitchen escalate to a breaking point." },
        { num: 5, title: "Sheridan", duration: "29m", releaseDate: "Jun 23, 2022", desc: "A catastrophic day at The Beef pushes every member of the crew to their absolute limit." },
      ],
    },
    {
      num: 2,
      year: 2023,
      episodes: [
        { num: 1, title: "Beef", duration: "38m", releaseDate: "Jun 22, 2023", desc: "The crew prepares for the opening of their new restaurant as tensions reach an all-time high." },
        { num: 2, title: "Pasta", duration: "28m", releaseDate: "Jun 22, 2023", desc: "Sydney experiments with new dishes while managing the chaos of opening night preparations." },
        { num: 3, title: "Sundae", duration: "32m", releaseDate: "Jun 22, 2023", desc: "Marcus travels to Copenhagen for a culinary experience that changes his perspective." },
        { num: 4, title: "Honeydew", duration: "30m", releaseDate: "Jun 22, 2023", desc: "Marcus continues his journey abroad while the team faces challenges back home." },
        { num: 5, title: "Pop", duration: "34m", releaseDate: "Jun 22, 2023", desc: "A pivotal family flashback reshapes everything we understand about Carmy and his brother." },
      ],
    },
    {
      num: 3,
      year: 2024,
      episodes: [
        { num: 1, title: "Career Day", duration: "30m", releaseDate: "Jun 27, 2024", desc: "The restaurant opens to the public as the team braces for the first real dinner service." },
        { num: 2, title: "Napkins", duration: "28m", releaseDate: "Jun 27, 2024", desc: "Small disasters compound as the kitchen finds its rhythm under mounting expectations." },
        { num: 3, title: "Doors", duration: "33m", releaseDate: "Jun 27, 2024", desc: "Sydney faces a critical decision about her future, weighing loyalty against ambition." },
      ],
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton onClick={navigateBack} />
      </div>

      {/* Header */}
      <div className="flex gap-10 mb-14">
        <div className="flex-shrink-0 w-60">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop&auto=format"
            alt="The Bear"
            className="w-full rounded-2xl border border-white/10 shadow-2xl shadow-black"
          />
        </div>
        <div className="flex-1 pt-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 border border-primary/50 text-primary text-xs font-bold rounded uppercase tracking-wider">
              {t.common.tvSeries}
            </span>
            {[t.genres.drama, t.genres.comedy].map((g) => (
              <GenrePill key={g} genre={g} onClick={() => goToBrowseWithQuery(g)} />
            ))}
          </div>
          <h1
            className="text-[36px] font-bold text-white dark:text-white light:text-black mb-2 leading-tight"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {tvShow.title}
          </h1>
          <p className="text-white/35 dark:text-white/35 light:text-black/35 text-base mb-5">{tvShow.originalTitle}</p>
          <div className="flex flex-wrap items-center gap-3 mb-6 mt-4">
            <div className="flex items-center gap-2">
              <RatingDisplay rating={tvShow.rating} size="lg" />
              <span className="text-white/40 dark:text-white/40 light:text-black/40 text-sm">/{toPersianDigits(10)}</span>
              <span className="text-white/35 dark:text-white/35 light:text-black/35 text-sm">({formatPersianNumber(tvShow.voteCount || 0)} {t.common.votes})</span>
            </div>
            <span className="text-white/20 dark:text-white/20 light:text-black/20">·</span>
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm flex items-center gap-1.5">
              <Calendar size={13} /> {toPersianDigits("2022")}–{toPersianDigits("2024")}
            </span>
            <span className="text-white/20 dark:text-white/20 light:text-black/20">·</span>
            <span className="border border-white/25 dark:border-white/25 light:border-black/25 text-white/50 dark:text-white/50 light:text-black/50 text-xs px-2 py-0.5 rounded">{tvShow.age}</span>
            <span className="text-white/20 dark:text-white/20 light:text-black/20">·</span>
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm flex items-center gap-1.5">
              <Clock size={13} /> {toPersianDigits(30)} دقیقه / {t.detail.episode}
            </span>
            <span className="text-white/20 dark:text-white/20 light:text-black/20">·</span>
            <span className="text-white/50 dark:text-white/50 light:text-black/50 text-sm">{toPersianDigits(3)} فصل</span>
          </div>
          <p className="text-white/60 dark:text-white/60 light:text-black/60 text-sm leading-relaxed mb-8 max-w-2xl">
            {tvShow.summary}
          </p>
          <div className="flex gap-3 flex-wrap items-center">
            <SaveButton saved={saved} onToggle={() => setSaved(!saved)} />
            {existingRating ? (
              <div className="flex items-center gap-3 bg-[#1A1A1A] border border-primary/30 rounded-lg px-4 py-2.5">
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
            ) : (
              <div className="flex items-center gap-3 bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5">
                <span className="text-white/40 text-sm">{t.detail.rate}</span>
                <HalfStarRating value={pendingScore} onChange={setPendingScore} size={16} />
                {pendingScore > 0 && (
                  <>
                    <span className="text-amber-400 text-sm font-semibold">{toPersianDigits(pendingScore)}/{toPersianDigits(10)}</span>
                    <button
                      onClick={submitRating}
                      className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-md hover:bg-accent transition-colors ml-1"
                    >
                      {t.detail.submit}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Cast */}
        <section>
          <SectionHeader title={t.detail.cast} />
          <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {cast.map((a) => (
              <div key={a.name} onClick={() => goToBrowseWithQuery(a.name)} className="flex-shrink-0 w-[120px] text-center group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-3 w-[120px] h-[120px] border border-white/10">
                  <img
                    src={a.img}
                    alt={a.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-white text-xs font-semibold leading-tight">{a.name}</p>
                <p className="text-white/40 text-[11px] mt-0.5 leading-tight">{a.character}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Crew */}
        <section>
          <SectionHeader title={t.detail.crew} />
          <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {crew.map((c) => (
              <div key={c.name} onClick={() => goToBrowseWithQuery(c.name)} className="flex-shrink-0 bg-[#1A1A1A] rounded-xl px-5 py-4 border border-white/8 hover:border-white/18 hover:bg-white/3 transition-colors min-w-[170px] cursor-pointer">
                <p className="text-white text-sm font-semibold mb-1">{c.name}</p>
                <p className="text-white/40 text-xs">{c.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section>
          <SectionHeader title={t.detail.awards} />
          <div className="space-y-2.5">
            {awards.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-[#1A1A1A] rounded-xl px-5 py-3.5 border border-white/8 hover:border-white/15 transition-colors"
              >
                <span className="text-white/35 text-xs font-mono w-10 flex-shrink-0">{toPersianDigits(a.year)}</span>
                <Award size={14} className={`flex-shrink-0 ${a.status === "won" ? "text-amber-400" : "text-white/20"}`} />
                <span className="text-white/80 text-sm font-medium flex-shrink-0">{a.name}</span>
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

        {/* Seasons & Episodes */}
        <section>
          <SectionHeader title={t.detail.seasonsAndEpisodes} />
          <div className="space-y-2.5">
            {seasons.map((season) => (
              <div key={season.num} className="bg-card rounded-2xl border border-white/8 dark:border-white/8 light:border-black/8 overflow-hidden">
                <button
                  onClick={() => setExpandedSeason(expandedSeason === season.num ? null : season.num)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/3 dark:hover:bg-white/3 light:hover:bg-black/3 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-white dark:text-white light:text-black font-bold"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {t.detail.season} {toPersianDigits(season.num)}
                    </span>
                    <span className="px-2 py-0.5 bg-white/8 dark:bg-white/8 light:bg-black/8 border border-white/10 dark:border-white/10 light:border-black/10 text-white/45 dark:text-white/45 light:text-black/45 text-xs rounded font-mono">{toPersianDigits(season.year)}</span>
                    <span className="text-white/30 dark:text-white/30 light:text-black/30 text-sm">{toPersianDigits(season.episodes.length)} {t.detail.episodes}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-white/30 dark:text-white/30 light:text-black/30 group-hover:text-white/60 dark:group-hover:text-white/60 light:group-hover:text-black/60 transition-all duration-200 ${
                      expandedSeason === season.num ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSeason === season.num && (
                  <div className="border-t border-white/6 dark:border-white/6 light:border-black/6 divide-y divide-white/5 dark:divide-white/5 light:divide-black/5">
                    {season.episodes.map((ep) => (
                      <div
                        key={ep.num}
                        className="flex items-start gap-5 px-6 py-4 hover:bg-white/2 dark:hover:bg-white/2 light:hover:bg-black/2 transition-colors"
                      >
                        <span className="text-white/25 dark:text-white/25 light:text-black/25 text-xs font-mono w-8 flex-shrink-0 mt-0.5 text-center">
                          {toPersianDigits(ep.num)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            <p className="text-white dark:text-white light:text-black text-sm font-medium">{ep.title}</p>
                            <span className="text-white/25 dark:text-white/25 light:text-black/25 text-xs flex items-center gap-1">
                              <Clock size={10} /> {ep.duration}
                            </span>
                            <span className="text-white/20 dark:text-white/20 light:text-black/20 text-xs flex items-center gap-1">
                              <Calendar size={10} /> {ep.releaseDate}
                            </span>
                          </div>
                          <p className="text-white/40 dark:text-white/40 light:text-black/40 text-xs leading-relaxed">{ep.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Similar */}
        <section>
          <SectionHeader title={t.detail.similarTitles} />
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {similarShows.map((m) => (
              <div key={m.id} className="flex-shrink-0 w-40">
                <MovieCard movie={m} onClick={() => setPage(m.type === "TV" ? "tv" : "movie", m)} />
              </div>
            ))}
          </div>
        </section>

        {/* User Reviews */}
        <section>
          <SectionHeader title={t.detail.reviews} />
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.user}
                className="flex items-center gap-6 bg-[#1A1A1A] rounded-xl px-6 py-4 border border-white/8 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center gap-3 flex-shrink-0 w-44">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E50914]/40 to-[#E50914]/10 border border-primary/30 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {r.user[0].toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-medium">{r.user}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RatingDisplay rating={r.score} size="sm" />
                  <span className="text-white/30 text-xs">/{toPersianDigits(10)}</span>
                </div>
                {r.spoiler && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded uppercase tracking-wider">
                    {t.detail.spoilerWarning}
                  </span>
                )}
                <p className="text-white/50 text-sm leading-relaxed flex-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Page 5: Browse ─────────────────────────────────────────────────────────────

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

  useEffect(() => {
    setSearch(globalSearch);
  }, [globalSearch]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [yearRange, setYearRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const allGenres = ["اکشن", "درام", "علمی-تخیلی", "ترسناک", "کمدی", "فانتزی", "جنایی", "تاریخی", "عاشقانه", "جنگی", "هیجان‌انگیز", "ماجراجویی", "معمایی", "خانوادگی"];
  const allContent = [...MOVIES, ...TV_SERIES];

  // Filter logic
  let filteredResults = allContent.filter(item => {
    // Tab filter
    if (tab === "movies" && item.type !== "Movie") return false;
    if (tab === "tv" && item.type !== "TV") return false;

    // Search filter
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;

    // Genre filter
    if (selectedGenres.length > 0 && !selectedGenres.some(g => item.genres.includes(g))) return false;

    // Rating filter
    if (minRating > 0 && item.rating < minRating) return false;

    // Year filter
    if (yearRange === "2024") {
      if (item.year !== 2024) return false;
    } else if (yearRange === "2023") {
      if (item.year !== 2023) return false;
    } else if (yearRange === "2022-2023") {
      if (item.year < 2022 || item.year > 2023) return false;
    } else if (yearRange === "2020-2021") {
      if (item.year < 2020 || item.year > 2021) return false;
    }

    return true;
  });

  // Sort logic
  if (sortBy === "rating") {
    filteredResults = [...filteredResults].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "year") {
    filteredResults = [...filteredResults].sort((a, b) => b.year - a.year);
  } else if (sortBy === "title") {
    filteredResults = [...filteredResults].sort((a, b) => a.title.localeCompare(b.title));
  }

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = filteredResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    setSortBy("popularity");
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

      {/* Search */}
      <div className="relative mb-6">
        <Search size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 dark:text-white/35 light:text-black/35" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setGlobalSearch(e.target.value); }}
          placeholder={t.browse.searchPlaceholder}
          className="w-full bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-xl pr-12 pl-12 py-4 text-foreground placeholder:text-white/25 dark:placeholder:text-white/25 light:placeholder:text-black/25 text-sm focus:outline-none focus:border-primary/40 transition-colors"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); setGlobalSearch(""); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 dark:text-white/30 light:text-black/30 hover:text-white/60 dark:hover:text-white/60 light:hover:text-black/60 transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Media Tabs */}
      <div className="flex gap-1 mb-6 bg-card border border-white/8 dark:border-white/8 light:border-black/8 rounded-xl p-1 w-fit">
        {(["all", "movies", "tv"] as const).map((tabType) => (
          <button
            key={tabType}
            onClick={() => setTab(tabType)}
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

      {/* Filter Row */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Genre Filter */}
        <div className="relative">
          <button
            onClick={() => setShowGenreDropdown(!showGenreDropdown)}
            className="flex items-center gap-2 bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-2.5 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-colors"
          >
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">{t.browse.genre} {selectedGenres.length > 0 && `(${toPersianDigits(selectedGenres.length)})`}</span>
            <ChevronDown size={13} className="text-white/30 dark:text-white/30 light:text-black/30" />
          </button>
          {showGenreDropdown && (
            <div className="absolute top-full mt-2 bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-xl p-3 z-50 min-w-[200px] shadow-2xl">
              <div className="flex flex-wrap gap-2">
                {allGenres.map(g => (
                  <GenrePill key={g} genre={g} active={selectedGenres.includes(g)} onClick={() => toggleGenre(g)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Year Range Filter */}
        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="flex items-center gap-2 bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-2.5 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-colors"
          >
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">
              {yearRange === "all" ? t.browse.yearRange : yearRange === "2024" ? toPersianDigits("2024") : yearRange === "2023" ? toPersianDigits("2023") : yearRange === "2022-2023" ? `${toPersianDigits("2022")}-${toPersianDigits("2023")}` : `${toPersianDigits("2020")}-${toPersianDigits("2021")}`}
            </span>
            <ChevronDown size={13} className="text-white/30 dark:text-white/30 light:text-black/30" />
          </button>
          {showYearDropdown && (
            <div className="absolute top-full mt-2 bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-xl p-2 z-50 min-w-[160px] shadow-2xl">
              {["all", "2024", "2023", "2022-2023", "2020-2021"].map(yr => (
                <button
                  key={yr}
                  onClick={() => { setYearRange(yr); setShowYearDropdown(false); setCurrentPage(1); }}
                  className="w-full text-right px-3 py-2 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-black/8 rounded-lg text-sm transition-colors"
                >
                  {yr === "all" ? t.browse.allYears : yr === "2024" ? toPersianDigits("2024") : yr === "2023" ? toPersianDigits("2023") : yr === "2022-2023" ? `${toPersianDigits("2022")}-${toPersianDigits("2023")}` : `${toPersianDigits("2020")}-${toPersianDigits("2021")}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <button
            onClick={() => setShowRatingDropdown(!showRatingDropdown)}
            className="flex items-center gap-2 bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-2.5 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-colors"
          >
            <Star size={11} className="text-amber-400" />
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">
              {minRating === 0 ? t.browse.rating : `${toPersianDigits(minRating)}+`}
            </span>
            <ChevronDown size={13} className="text-white/30 dark:text-white/30 light:text-black/30" />
          </button>
          {showRatingDropdown && (
            <div className="absolute top-full mt-2 bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-xl p-2 z-50 min-w-[140px] shadow-2xl">
              {[0, 7, 8, 9].map(rating => (
                <button
                  key={rating}
                  onClick={() => { setMinRating(rating); setShowRatingDropdown(false); setCurrentPage(1); }}
                  className="w-full text-right px-3 py-2 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-black/8 rounded-lg text-sm transition-colors"
                >
                  {rating === 0 ? t.browse.allRatings : `${toPersianDigits(rating)}+ ستاره`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 bg-card border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-2.5 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 transition-colors"
          >
            <span className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">
              {t.browse.sortBy}: {sortBy === "popularity" ? t.browse.popularity : sortBy === "rating" ? t.browse.rating : sortBy === "year" ? t.browse.releaseDate : t.browse.title}
            </span>
            <ChevronDown size={13} className="text-white/30 dark:text-white/30 light:text-black/30" />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full mt-2 bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-xl p-2 z-50 min-w-[160px] shadow-2xl">
              {["popularity", "rating", "year", "title"].map(sort => (
                <button
                  key={sort}
                  onClick={() => { setSortBy(sort); setShowSortDropdown(false); }}
                  className="w-full text-right px-3 py-2 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-black/8 rounded-lg text-sm transition-colors"
                >
                  {sort === "popularity" ? t.browse.popularity : sort === "rating" ? t.browse.rating : sort === "year" ? t.browse.releaseDate : t.browse.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-white/40 dark:text-white/40 light:text-black/40 hover:text-white/60 dark:hover:text-white/60 light:hover:text-black/60 text-sm transition-colors mr-2"
          >
            <X size={13} /> {t.browse.clearAll}
          </button>
        )}
      </div>

      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 mb-7 flex-wrap">
          <span className="text-white/30 dark:text-white/30 light:text-black/30 text-xs font-mono uppercase tracking-wider">{t.browse.active}:</span>
          {selectedGenres.map((g) => (
            <FilterChip key={g} label={g} onRemove={() => toggleGenre(g)} />
          ))}
          {minRating > 0 && (
            <FilterChip label={`${t.browse.rating}: ${toPersianDigits(minRating)}+`} onRemove={() => { setMinRating(0); setCurrentPage(1); }} />
          )}
          {yearRange !== "all" && (
            <FilterChip label={`${t.browse.year}: ${yearRange}`} onRemove={() => { setYearRange("all"); setCurrentPage(1); }} />
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 dark:text-white/40 light:text-black/40 text-sm">
          {t.browse.showing} <span className="text-white/70 dark:text-white/70 light:text-black/70">{toPersianDigits(Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredResults.length))}–{toPersianDigits(Math.min(currentPage * ITEMS_PER_PAGE, filteredResults.length))}</span> {t.browse.of}{" "}
          <span className="text-white/70 dark:text-white/70 light:text-black/70">{toPersianDigits(filteredResults.length)}</span> {t.browse.results}
        </p>
      </div>

      {/* Results Grid */}
      {paginatedResults.length > 0 ? (
        <div className="grid grid-cols-4 gap-5 mb-12">
          {paginatedResults.map((m) => (
            <MovieCard key={m.id} movie={m} onClick={() => setPage(m.type === "TV" ? "tv" : "movie", m)} showTypeBadge />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/40 dark:text-white/40 light:text-black/50 text-lg mb-2">{t.home.noTitlesFound}</p>
          <p className="text-white/25 dark:text-white/25 light:text-black/35 text-sm mb-6">{t.home.tryDifferentSearch}</p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent active:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            {t.home.clearFilters}
          </button>
        </div>
      )}

      {/* Pagination */}
      {paginatedResults.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm"
          >
            <ChevronRight size={14} /> {t.browse.previous}
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
                    : "bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20"
                }`}
              >
                {typeof p === "number" ? toPersianDigits(p) : p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm"
          >
            {t.browse.next} <ChevronLeft size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page 6: Profile ────────────────────────────────────────────────────────────

function ProfilePage({
  setPage,
  ratedTitles,
  onEditRating,
  onDeleteRating,
}: {
  setPage: (p: Page, movieData?: MovieData) => void;
  ratedTitles: RatedEntry[];
  onEditRating: (id: number, score: number, review: string) => void;
  onDeleteRating: (id: number) => void;
}) {
  const [watchlistPage, setWatchlistPage] = useState(1);
  const [watchlistFilter, setWatchlistFilter] = useState<"all" | "movies" | "tv">("all");
  const [reviewsPage, setReviewsPage] = useState(1);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [profileUsername, setProfileUsername] = useState("john_doe");
  const [profileEmail, setProfileEmail] = useState("john@example.com");
  const [profileBio, setProfileBio] = useState("Film enthusiast and critic. Love indie films and classic cinema.");
  const [profileAvatar, setProfileAvatar] = useState("red");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("red");

  const AVATARS = [
    { id: "red", color: "from-[#E50914] to-[#5A0009]", border: "border-primary" },
    { id: "blue", color: "from-blue-500 to-blue-900", border: "border-blue-500" },
    { id: "purple", color: "from-purple-500 to-purple-900", border: "border-purple-500" },
    { id: "amber", color: "from-amber-400 to-amber-800", border: "border-amber-400" },
  ];

  function getAvatarGradient(id: string) {
    return AVATARS.find((a) => a.id === id)?.color ?? AVATARS[0].color;
  }
  function getAvatarBorder(id: string) {
    return AVATARS.find((a) => a.id === id)?.border ?? AVATARS[0].border;
  }
  function getAvatarInitials(username: string) {
    const parts = username.split(/[^a-zA-Z0-9]/);
    return parts.filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "??";
  }

  const ITEMS = 6;
  const allWatchlist = [...MOVIES, ...TV_SERIES, ...MOVIES.slice(0, 2)];
  let filteredWatchlist = allWatchlist;
  if (watchlistFilter === "movies") filteredWatchlist = allWatchlist.filter(i => i.type === "Movie");
  else if (watchlistFilter === "tv") filteredWatchlist = allWatchlist.filter(i => i.type === "TV");

  const totalWlPages = Math.ceil(filteredWatchlist.length / ITEMS);
  const watchlist = filteredWatchlist.slice((watchlistPage - 1) * ITEMS, watchlistPage * ITEMS);

  const stats = [
    { label: t.profile.rated, value: ratedTitles.length },
    { label: t.profile.reviews, value: ratedTitles.filter(r => r.review.trim().length > 0).length },
    { label: t.profile.wantToWatch, value: 112 },
    { label: t.profile.watching, value: 7 },
    { label: t.profile.watched, value: 583 },
  ];

  const REVIEWS_PER_PAGE = 5;
  const totalReviewPages = Math.ceil(ratedTitles.length / REVIEWS_PER_PAGE);
  const paginatedReviews = ratedTitles.slice((reviewsPage - 1) * REVIEWS_PER_PAGE, reviewsPage * REVIEWS_PER_PAGE);

  function openEdit(entry: RatedEntry) {
    setEditingId(entry.id);
    setEditScore(entry.score);
    setEditComment(entry.review);
  }

  function saveEdit() {
    if (editingId === null || editScore === 0) return;
    onEditRating(editingId, editScore, editComment);
    setEditingId(null);
  }

  function confirmDelete(id: number) {
    setConfirmDeleteId(id);
  }

  function executeDelete() {
    if (confirmDeleteId !== null) {
      onDeleteRating(confirmDeleteId);
      setConfirmDeleteId(null);
      // clamp page if needed
      const newTotal = ratedTitles.length - 1;
      const maxPage = Math.ceil(newTotal / REVIEWS_PER_PAGE) || 1;
      if (reviewsPage > maxPage) setReviewsPage(maxPage);
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-12 pb-12 border-b border-white/8 dark:border-white/8 light:border-black/8">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarGradient(profileAvatar)} flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-2xl`}
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
          {getAvatarInitials(profileUsername)}
        </div>
        <div className="flex-1">
          <h1 className="text-[28px] font-bold text-white dark:text-white light:text-black mb-1" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {profileUsername}
          </h1>
          <p className="text-white/35 dark:text-white/35 light:text-black/35 text-sm mb-1 font-mono">{profileEmail}</p>
          <p className="text-white/25 dark:text-white/25 light:text-black/25 text-xs flex items-center gap-1.5">
            <Calendar size={11} /> {t.profile.memberSince} فوریه ۲۰۱۹
          </p>
          {profileBio && <p className="text-white/40 dark:text-white/40 light:text-black/40 text-sm mt-2 max-w-md">{profileBio}</p>}
        </div>
        <button
          onClick={() => { setEditUsername(profileUsername); setEditEmail(profileEmail); setEditBio(profileBio); setEditAvatar(profileAvatar); setShowEditProfile(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 dark:border-white/15 light:border-black/15 text-white/50 dark:text-white/50 light:text-black/50 text-sm hover:border-white/30 dark:hover:border-white/30 light:hover:border-black/30 hover:text-white dark:hover:text-white light:hover:text-black transition-all"
        >
          <Edit2 size={14} /> {t.profile.editProfile}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-14">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-6 border border-white/8 dark:border-white/8 light:border-black/8 text-center hover:border-white/15 dark:hover:border-white/15 light:hover:border-black/15 transition-colors">
            <p className="text-4xl font-bold text-white dark:text-white light:text-black mb-1" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
              {toPersianDigits(s.value)}
            </p>
            <p className="text-white/40 dark:text-white/40 light:text-black/40 text-xs uppercase tracking-wider font-mono">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Watchlist */}
      <section className="mb-14">
        <SectionHeader title={t.profile.watchlist} />
        <div className="flex gap-1 mb-6 bg-card border border-white/8 dark:border-white/8 light:border-black/8 rounded-xl p-1 w-fit">
          {(["all", "movies", "tv"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => { setWatchlistFilter(filter); setWatchlistPage(1); }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                watchlistFilter === filter ? "bg-primary text-white shadow-lg shadow-[#E50914]/20" : "text-white/50 dark:text-white/50 light:text-black/50 hover:text-white dark:hover:text-white light:hover:text-black"
              }`}
            >
              {filter === "tv" ? t.profile.tvShows : filter === "movies" ? t.browse.movies : t.browse.all}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-4 mb-6">
          {watchlist.map((m) => (
            <MovieCard key={m.id} movie={m} onClick={() => setPage(m.type === "TV" ? "tv" : "movie", m)} showTypeBadge />
          ))}
        </div>
        {totalWlPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setWatchlistPage((p) => Math.max(1, p - 1))} disabled={watchlistPage === 1} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm">
              <ChevronRight size={14} /> {t.browse.previous}
            </button>
            {Array.from({ length: totalWlPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setWatchlistPage(p)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === watchlistPage ? "bg-primary text-white shadow-lg shadow-[#E50914]/20" : "bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black"}`}>{toPersianDigits(p)}</button>
            ))}
            <button onClick={() => setWatchlistPage((p) => Math.min(totalWlPages, p + 1))} disabled={watchlistPage === totalWlPages} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm">
              {t.browse.next} <ChevronLeft size={14} />
            </button>
          </div>
        )}
      </section>

      {/* Ratings & Reviews */}
      <section>
        <SectionHeader title={t.profile.ratingsAndReviews} />
        {ratedTitles.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-white/8 dark:border-white/8 light:border-black/12">
            <Star size={32} className="text-white/15 dark:text-white/15 light:text-black/20 mx-auto mb-3" />
            <p className="text-white/40 dark:text-white/40 light:text-black/50 text-sm">{t.profile.noRatingsYet}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {paginatedReviews.map((r) => {
                const allContent = [...MOVIES, ...TV_SERIES];
                const movieData = allContent.find(m => m.id === r.id);
                return (
                <div key={r.id} className="flex gap-5 bg-card rounded-2xl p-5 border border-white/8 dark:border-white/8 light:border-black/12 hover:border-white/15 dark:hover:border-white/15 light:hover:border-primary/30 transition-all">
                  <img
                    src={r.img}
                    alt={r.title}
                    className="w-14 h-20 object-cover rounded-lg flex-shrink-0 border border-white/10 dark:border-white/10 light:border-black/15 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => movieData && setPage(r.type === "TV" ? "tv" : "movie", movieData)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          onClick={() => movieData && setPage(r.type === "TV" ? "tv" : "movie", movieData)}
                          className="text-foreground font-semibold text-sm hover:text-primary transition-colors cursor-pointer"
                        >
                          {r.title}
                        </h3>
                        <p className="text-white/35 dark:text-white/35 light:text-black/40 text-xs mt-0.5">{r.date}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <div className="flex items-center gap-1">
                          <RatingDisplay rating={r.score} size="sm" />
                          <span className="text-white/30 dark:text-white/30 light:text-black/40 text-xs">/{toPersianDigits(10)}</span>
                        </div>
                        <button
                          onClick={() => openEdit(r)}
                          className="p-1.5 text-white/30 dark:text-white/30 light:text-black/40 hover:text-white/70 dark:hover:text-white/70 light:hover:text-black/70 hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-black/8 rounded-lg transition-all"
                          title={t.profile.edit}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => confirmDelete(r.id)}
                          className="p-1.5 text-white/30 dark:text-white/30 light:text-black/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title={t.profile.delete}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {r.review ? (
                      <p className="text-white/45 dark:text-white/45 light:text-black/55 text-sm leading-relaxed line-clamp-2">{r.review}</p>
                    ) : (
                      <p className="text-white/20 dark:text-white/20 light:text-black/30 text-xs italic">{t.profile.noWrittenReview}</p>
                    )}
                  </div>
                </div>
              );
              })}
            </div>
            {totalReviewPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setReviewsPage((p) => Math.max(1, p - 1))} disabled={reviewsPage === 1} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm">
                  <ChevronRight size={14} /> {t.browse.previous}
                </button>
                {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setReviewsPage(p)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === reviewsPage ? "bg-primary text-white shadow-lg shadow-[#E50914]/20" : "bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black"}`}>{toPersianDigits(p)}</button>
                ))}
                <button onClick={() => setReviewsPage((p) => Math.min(totalReviewPages, p + 1))} disabled={reviewsPage === totalReviewPages} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-white/10 dark:border-white/10 light:border-black/10 text-white/60 dark:text-white/60 light:text-black/60 hover:text-white dark:hover:text-white light:hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm">
                  {t.browse.next} <ChevronLeft size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={() => setShowEditProfile(false)}>
          <div className="bg-card border border-white/15 dark:border-white/15 light:border-black/15 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white dark:text-white light:text-black" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.editProfile.title}</h2>
              <button onClick={() => setShowEditProfile(false)} className="text-white/40 dark:text-white/40 light:text-black/40 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-5">
              {/* Avatar Picker */}
              <div>
                <label className="block text-white/60 dark:text-white/60 light:text-black/60 text-sm mb-3">{t.editProfile.avatarColor}</label>
                <div className="flex items-center gap-4">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => setEditAvatar(av.id)}
                      className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${av.color} flex items-center justify-center text-white font-bold transition-all ${
                        editAvatar === av.id ? `ring-2 ring-offset-2 ring-offset-card ${av.border} scale-110` : "opacity-60 hover:opacity-90"
                      }`}
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {getAvatarInitials(editUsername || profileUsername)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/60 dark:text-white/60 light:text-black/60 text-sm mb-2">{t.editProfile.username}</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-background border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 dark:text-white/60 light:text-black/60 text-sm mb-2">{t.editProfile.email}</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-background border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 dark:text-white/60 light:text-black/60 text-sm mb-2">{t.editProfile.bio}</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-background border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 px-6 py-3 bg-white/8 dark:bg-white/8 light:bg-black/8 border border-white/15 dark:border-white/15 light:border-black/15 text-white dark:text-white light:text-black rounded-lg text-sm font-medium hover:bg-white/12 dark:hover:bg-white/12 light:hover:bg-black/12 transition-all"
                >
                  {t.editProfile.cancel}
                </button>
                <button
                  onClick={() => {
                    setProfileUsername(editUsername.trim() || profileUsername);
                    setProfileEmail(editEmail.trim() || profileEmail);
                    setProfileBio(editBio);
                    setProfileAvatar(editAvatar);
                    setShowEditProfile(false);
                  }}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent active:bg-primary/90 transition-all shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/40"
                >
                  {t.editProfile.saveChanges}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rating Modal */}
      {editingId !== null && (() => {
        const entry = ratedTitles.find(r => r.id === editingId);
        if (!entry) return null;
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={() => setEditingId(null)}>
            <div className="bg-card border border-white/15 dark:border-white/15 light:border-black/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.editRating.title}</h2>
                <button onClick={() => setEditingId(null)} className="text-white/40 dark:text-white/40 light:text-black/40 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"><X size={20} /></button>
              </div>
              <p className="text-white/40 dark:text-white/40 light:text-black/50 text-sm mb-6">{entry.title}</p>
              <div className="space-y-6">
                {/* Half-star rating */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white/60 dark:text-white/60 light:text-black/60 text-sm">{t.editRating.yourRating} <span className="text-white/30 dark:text-white/30 light:text-black/40 text-xs">({t.editRating.required})</span></label>
                    {editScore > 0 && (
                      <span className="text-amber-400 font-semibold">{toPersianDigits(editScore)}/{toPersianDigits(10)}</span>
                    )}
                  </div>
                  <HalfStarRating value={editScore} onChange={setEditScore} size={26} />
                  {editScore === 0 && (
                    <p className="text-primary text-xs mt-2">{t.editRating.scoreRequired}</p>
                  )}
                </div>
                {/* Review text (optional) */}
                <div>
                  <label className="block text-white/60 text-sm mb-2">
                    {t.editRating.review} <span className="text-white/30 dark:text-white/30 light:text-black/40 text-xs">({t.editRating.optional})</span>
                  </label>
                  <textarea
                    rows={4}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full bg-background border border-white/10 dark:border-white/10 light:border-black/15 rounded-lg px-4 py-3 text-foreground placeholder:text-white/25 dark:placeholder:text-white/25 light:placeholder:text-black/30 text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
                    placeholder={t.editRating.reviewPlaceholderLong}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditingId(null)} className="flex-1 px-6 py-3 bg-white/8 dark:bg-white/8 light:bg-white border border-white/15 dark:border-white/15 light:border-black/20 text-foreground rounded-lg text-sm font-medium hover:bg-white/12 dark:hover:bg-white/12 light:hover:bg-black/5 transition-all">{t.editRating.cancel}</button>
                  <button
                    onClick={saveEdit}
                    disabled={editScore === 0}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t.editRating.saveChanges}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId !== null && (() => {
        const entry = ratedTitles.find(r => r.id === confirmDeleteId);
        if (!entry) return null;
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={() => setConfirmDeleteId(null)}>
            <div className="bg-card border border-white/15 dark:border-white/15 light:border-black/20 rounded-2xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>{t.deleteConfirm.deleteRating}</h2>
                <button onClick={() => setConfirmDeleteId(null)} className="text-white/40 dark:text-white/40 light:text-black/40 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"><X size={18} /></button>
              </div>
              <p className="text-white/55 dark:text-white/55 light:text-black/60 text-sm mb-1">{t.deleteConfirm.removeRatingFor}</p>
              <p className="text-foreground font-semibold mb-4">{entry.title}</p>
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
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return (saved === "light" || saved === "dark") ? saved : "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function navigate(p: Page, movieData?: MovieData) {
    if (p === "profile" && !isLoggedIn) {
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

  function handleLogin() {
    setIsLoggedIn(true);
    setAuthGateModal(null);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    if (page === "profile") {
      setPage("home");
      setPageHistory([]);
    }
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
        <MovieDetailPage movie={selectedMovie} setPage={navigate} navigateBack={navigateBack} ratedTitles={ratedTitles} onRate={handleRate} setGlobalSearch={setGlobalSearch} />
      )}
      {page === "tv" && selectedMovie && (
        <TVDetailPage movie={selectedMovie} setPage={navigate} navigateBack={navigateBack} ratedTitles={ratedTitles} onRate={handleRate} setGlobalSearch={setGlobalSearch} />
      )}
      {page === "browse" && (
        <BrowsePage setPage={navigate} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
      )}
      {page === "profile" && isLoggedIn && (
        <ProfilePage
          setPage={navigate}
          ratedTitles={ratedTitles}
          onEditRating={handleEditRating}
          onDeleteRating={handleDeleteRating}
        />
      )}
    </div>
  );
}

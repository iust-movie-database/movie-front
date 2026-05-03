// Local asset paths for offline-first image loading
// All assets are stored in public/assets/

export const ASSETS = {
  // Placeholders
  placeholders: {
    moviePoster: '/assets/placeholders/movie-poster.svg',
    banner: '/assets/placeholders/banner.svg',
    avatar: '/assets/placeholders/avatar.svg',
    actor: '/assets/placeholders/actor.svg',
    backdrop: '/assets/placeholders/backdrop.svg',
  },

  // Logo and branding
  logo: {
    main: '/assets/logo/didar-logo.svg',
    icon: '/assets/logo/didar-icon.svg',
  },

  // Movie posters
  movies: {
    interstellar: '/assets/movies/interstellar.jpg',
    inception: '/assets/movies/inception.jpg',
    darkKnight: '/assets/movies/dark-knight.jpg',
    godfather: '/assets/movies/godfather.jpg',
    pulpFiction: '/assets/movies/pulp-fiction.jpg',
    fightClub: '/assets/movies/fight-club.jpg',
    matrix: '/assets/movies/matrix.jpg',
    forrestGump: '/assets/movies/forrest-gump.jpg',
    shawshank: '/assets/movies/shawshank.jpg',
    lotr: '/assets/movies/lotr.jpg',
    default: '/assets/placeholders/movie-poster.svg',
  },

  // Movie backdrops
  backdrops: {
    interstellar: '/assets/movie-backdrops/interstellar.jpg',
    inception: '/assets/movie-backdrops/inception.jpg',
    darkKnight: '/assets/movie-backdrops/dark-knight.jpg',
    default: '/assets/placeholders/backdrop.svg',
  },

  // Series covers
  series: {
    breakingBad: '/assets/series/breaking-bad.jpg',
    gameOfThrones: '/assets/series/game-of-thrones.jpg',
    strangerThings: '/assets/series/stranger-things.jpg',
    theWire: '/assets/series/the-wire.jpg',
    dark: '/assets/series/dark.jpg',
    default: '/assets/placeholders/movie-poster.svg',
  },

  // Actors
  actors: {
    leonardoDiCaprio: '/assets/actors/leonardo-dicaprio.jpg',
    scarlettJohansson: '/assets/actors/scarlett-johansson.jpg',
    robertDowneyJr: '/assets/actors/robert-downey-jr.jpg',
    default: '/assets/placeholders/actor.svg',
  },

  // User avatars
  avatars: {
    user1: '/assets/avatars/user-01.jpg',
    user2: '/assets/avatars/user-02.jpg',
    user3: '/assets/avatars/user-03.jpg',
    default: '/assets/placeholders/avatar.svg',
  },

  // Banners
  banners: {
    home1: '/assets/banners/home-banner-01.jpg',
    home2: '/assets/banners/home-banner-02.jpg',
    home3: '/assets/banners/home-banner-03.jpg',
    default: '/assets/placeholders/banner.svg',
  },

  // Awards
  awards: {
    oscar: '/assets/awards/oscar.jpg',
    cannes: '/assets/awards/cannes.jpg',
    goldenGlobe: '/assets/awards/golden-globe.jpg',
    default: '/assets/placeholders/movie-poster.svg',
  },

  // Genres
  genres: {
    action: '/assets/genres/action.jpg',
    drama: '/assets/genres/drama.jpg',
    comedy: '/assets/genres/comedy.jpg',
    sciFi: '/assets/genres/sci-fi.jpg',
    default: '/assets/placeholders/banner.svg',
  },

  // Backgrounds
  backgrounds: {
    auth: '/assets/backgrounds/auth-bg.jpg',
    hero: '/assets/backgrounds/hero-bg.jpg',
    default: '/assets/placeholders/backdrop.svg',
  },
};

// Helper function to get asset with fallback
export function getAsset(path: string | undefined, fallback: string): string {
  if (!path) return fallback;
  return path;
}

// Helper to get movie poster with fallback
export function getMoviePoster(movieId?: string): string {
  if (!movieId) return ASSETS.placeholders.moviePoster;
  // Map movie IDs to local assets
  const posterMap: Record<string, string> = {
    '1': ASSETS.movies.interstellar,
    '2': ASSETS.movies.inception,
    '3': ASSETS.movies.darkKnight,
    '4': ASSETS.movies.godfather,
    '5': ASSETS.movies.pulpFiction,
  };
  return posterMap[movieId] || ASSETS.movies.default;
}

// Helper to get backdrop with fallback
export function getBackdrop(movieId?: string): string {
  if (!movieId) return ASSETS.placeholders.backdrop;
  const backdropMap: Record<string, string> = {
    '1': ASSETS.backdrops.interstellar,
    '2': ASSETS.backdrops.inception,
    '3': ASSETS.backdrops.darkKnight,
  };
  return backdropMap[movieId] || ASSETS.backdrops.default;
}

// Helper to get avatar with fallback
export function getAvatar(userId?: string): string {
  if (!userId) return ASSETS.placeholders.avatar;
  const avatarMap: Record<string, string> = {
    '1': ASSETS.avatars.user1,
    '2': ASSETS.avatars.user2,
    '3': ASSETS.avatars.user3,
  };
  return avatarMap[userId] || ASSETS.avatars.default;
}

// Local offline images - all JPG/PNG files bundled in project
// No external URLs, no CDN dependencies, fully offline-capable

export const demoImages = {
  // Movie posters (local JPG files)
  movies: [
    '/assets/movies/interstellar.jpg',
    '/assets/movies/godfather.jpg',
    '/assets/movies/batman.jpg',
    '/assets/movies/shawshank.jpg',
    '/assets/movies/pulp-fiction.jpg',
    '/assets/movies/matrix.jpg',
    '/assets/movies/inception.jpg',
    '/assets/movies/fight-club.jpg',
    '/assets/movies/oppenheimer.jpg',
    '/assets/movies/dune.jpg',
    '/assets/movies/joker.jpg',
    '/assets/movies/cinema.jpg',
    '/assets/movies/film.jpg',
    '/assets/movies/night-city.jpg',
    '/assets/movies/tech.jpg',
    '/assets/movies/space.jpg',
    '/assets/movies/abstract.jpg',
    '/assets/movies/urban.jpg',
    '/assets/movies/dark.jpg',
  ],

  // Series covers (local JPG files)
  series: [
    '/assets/series/breaking-bad.jpg',
    '/assets/series/dark.jpg',
    '/assets/series/game-of-thrones.jpg',
    '/assets/series/stranger-things.jpg',
    '/assets/series/the-crown.jpg',
  ],

  // Wide banners/backdrops (local JPG files)
  banners: [
    '/assets/banners/cinema-wide.jpg',
    '/assets/banners/film-wide.jpg',
    '/assets/banners/theater-wide.jpg',
    '/assets/banners/night-wide.jpg',
  ],

  // Actor portraits (local JPG files)
  actors: [
    '/assets/actors/actor-1.jpg',
    '/assets/actors/actor-2.jpg',
    '/assets/actors/actor-3.jpg',
    '/assets/actors/actor-4.jpg',
  ],

  // User avatars (local JPG files)
  avatars: [
    '/assets/avatars/user-1.jpg',
    '/assets/avatars/user-2.jpg',
    '/assets/avatars/user-3.jpg',
    '/assets/avatars/user-4.jpg',
  ],
};

// Specific movie poster mappings (for matching titles)
export const moviePosters = {
  interstellar: '/assets/movies/interstellar.jpg',
  godfather: '/assets/movies/godfather.jpg',
  batman: '/assets/movies/batman.jpg',
  darkKnight: '/assets/movies/batman.jpg',
  shawshank: '/assets/movies/shawshank.jpg',
  pulpFiction: '/assets/movies/pulp-fiction.jpg',
  matrix: '/assets/movies/matrix.jpg',
  inception: '/assets/movies/inception.jpg',
  fightClub: '/assets/movies/fight-club.jpg',
  oppenheimer: '/assets/movies/oppenheimer.jpg',
  dune: '/assets/movies/dune.jpg',
  joker: '/assets/movies/joker.jpg',
};

// Get random movie poster
export const getRandomMoviePoster = (index: number = 0): string => {
  return demoImages.movies[index % demoImages.movies.length];
};

// Get random series cover
export const getRandomSeriesCover = (index: number = 0): string => {
  return demoImages.series[index % demoImages.series.length];
};

// Get random actor portrait
export const getRandomActorPortrait = (index: number = 0): string => {
  return demoImages.actors[index % demoImages.actors.length];
};

// Get random avatar
export const getRandomAvatar = (index: number = 0): string => {
  return demoImages.avatars[index % demoImages.avatars.length];
};

// Get random banner
export const getRandomBanner = (index: number = 0): string => {
  return demoImages.banners[index % demoImages.banners.length];
};

// Get image with fallback for different types
export const getImageWithFallback = (
  src: string | undefined,
  type: 'movie' | 'banner' | 'actor' | 'avatar' | 'backdrop' = 'movie',
  index: number | string = 0,
  metadata?: { title?: string; subtitle?: string; year?: number; rating?: number }
): string => {
  // If src is provided, use it
  if (src) return src;

  // Convert index to number
  const numIndex = typeof index === 'string' ? parseInt(index) || 0 : index;

  // Return fallback based on type
  switch (type) {
    case 'movie':
      return getRandomMoviePoster(numIndex);
    case 'banner':
    case 'backdrop':
      return getRandomBanner(numIndex);
    case 'actor':
      return getRandomActorPortrait(numIndex);
    case 'avatar':
      return getRandomAvatar(numIndex);
    default:
      return getRandomMoviePoster(numIndex);
  }
};

// src/services/api.ts

// از آدرس نسبی استفاده کنید (با /api شروع می‌شود)
const API_BASE_URL = '/api';

// تابع کمکی برای مدیریت پاسخ‌ها
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ============ Types ============

export interface HeroTitle {
  title_id: number;
  name_fa: string;
  name_en: string;
  poster_url: string | null;
  genres: string;
  score: number;
  release_year: number;
  age_rating: string;
  summary: string;
  t_type: 'M' | 'S';
  duration_mins: number | null;
  total_seasons: number | null;
  total_episodes: number | null;
  end_year: number | null;
  is_saved: boolean;
}

export interface PopularGenre {
  genre_id: number;
  genre_name: string;
  title_count: number;
}

export interface TopMovie {
  title_id: number;
  t_type: 'M' | 'S';
  score: number;
  age_rating: string;
  name_fa: string;
  name_en: string;
  poster_url: string | null;
  genres: string;
  release_year: number;
  duration_mins: number | null;
  is_saved: boolean;
}

export interface TopSeries {
  title_id: number;
  t_type: 'S';
  score: number;
  age_rating: string;
  name_fa: string;
  name_en: string;
  poster_url: string | null;
  genres: string;
  release_year: number;
  end_year: number | null;
  total_episodes: number;
  is_saved: boolean;
}

export interface Recommendation {
  title_id: number;
  t_type: string;
  score: number;
  age_rating: string;
  name_fa: string;
  name_en: string;
  poster_url: string | null;
  genres: string;
  release_year: number;
  duration_mins: number | null;
  total_seasons: number | null;
  total_episodes: number | null;
  end_year: number | null;
  is_saved: boolean;
}

// ============ Single Title Types ============

export interface TitleDetails {
  title_id: number;
  name_fa: string;
  name_en: string;
  poster_url: string | null;
  score: number;
  vote_count: number;
  release_date: string;
  end_date: string | null;
  age_rating: string;
  duration_mins: number | null;
  genres: string;
  summary: string;
  t_type: string;
  total_seasons: number | null;
  total_episodes: number | null;
  is_saved: boolean;
}

export interface CastMember {
  person_id: number;
  name_fa: string;
  name_en: string;
  photo_url: string | null;
  role_name: string;
  character_name_fa: string;
  character_name_en: string;
  ordering: number;
}

export interface CrewMember {
  person_id: number;
  name_fa: string;
  name_en: string;
  photo_url: string | null;
  role_name: string;
  ordering: number;
}

export interface Award {
  award_name: string;
  category: string;
  ceremony_year: number;
  status: string;
}

export interface Review {
  user?: string;
  rating?: number;
  comment?: string;
  review_text?: string;
}

export interface SimilarTitle {
  title_id: number;
  t_type: string;
  score: number;
  age_rating: string;
  name_fa: string;
  name_en: string;
  poster_url: string | null;
  genres: string;
  release_year: number;
  duration_mins: number | null;
  total_seasons: number | null;
  total_episodes: number | null;
  similarity_score: number;
  is_saved: boolean;
}

export interface Season {
  season_number: number;
  season_release_date: string;
  season_end_date: string | null;
  total_episodes: number;
}

export interface Episode {
  season_number: number;
  episode_number: number;
  episode_name_fa: string;
  episode_name_en: string;
  episode_duration: number;
  episode_release_date: string;
  episode_summary: string;
}

// ============ Search Types ============

// در src/services/api.ts
export interface SearchResult {
  title_id: number;
  t_type: string;
  name_fa: string;
  name_en: string;
  poster_url: string | null;
  release_year: number;
  year_end: number | null;
  score: number;
  vote_count: number;
  genres: string;
  duration_mins: number | null;
  total_seasons: number | null;
  total_episodes: number | null;
  age_rating?: string;  
  is_saved: boolean;
  total_count: number;
}

export interface SearchParams {
  search_text?: string;
  media_type?: 'M' | 'S';
  genre_ids?: number[];
  min_year?: number;
  max_year?: number;
  min_score?: number;
  min_votes?: number;
  sort_by?: 'score_desc' | 'votes_desc' | 'year_desc' | 'year_asc' | 'title_asc' | 'title_desc';
  limit?: number;
  offset?: number;
}

// ============ توابع API ============

export async function getHero(limit: number = 5): Promise<HeroTitle[]> {
  const response = await fetch(`${API_BASE_URL}/homepage/hero?limit=${limit}`);
  return handleResponse<HeroTitle[]>(response);
}

export async function getPopularGenres(limit: number = 5): Promise<PopularGenre[]> {
  const response = await fetch(`${API_BASE_URL}/homepage/popular-genres?limit=${limit}`);
  return handleResponse<PopularGenre[]>(response);
}

export async function getRecommendations(limit: number = 5, token?: string): Promise<Recommendation[]> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}/homepage/recommendations?limit=${limit}`, { headers });
  return handleResponse<Recommendation[]>(response);
}

export async function getTopMovies(limit: number = 5): Promise<TopMovie[]> {
  const response = await fetch(`${API_BASE_URL}/homepage/top-movies?limit=${limit}`);
  return handleResponse<TopMovie[]>(response);
}

export async function getTopSeries(limit: number = 5): Promise<TopSeries[]> {
  const response = await fetch(`${API_BASE_URL}/homepage/top-series?limit=${limit}`);
  return handleResponse<TopSeries[]>(response);
}

export async function getComingSoon(limit: number = 5): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/homepage/coming-soon?limit=${limit}`);
    if (response.status === 404) {
      console.log('Coming soon endpoint not implemented yet');
      return [];
    }
    return handleResponse<any[]>(response);
  } catch (error) {
    console.log('Error fetching coming soon:', error);
    return [];
  }
}

// ============ Single Title APIs ============

export async function getTitleDetails(title_id: number): Promise<TitleDetails> {
  const response = await fetch(`${API_BASE_URL}/single/${title_id}`);
  return handleResponse<TitleDetails>(response);
}

export async function getTitleCast(title_id: number): Promise<CastMember[]> {
  const response = await fetch(`${API_BASE_URL}/single/${title_id}/cast`);
  return handleResponse<CastMember[]>(response);
}

export async function getTitleCrew(title_id: number): Promise<CrewMember[]> {
  const response = await fetch(`${API_BASE_URL}/single/${title_id}/crew`);
  return handleResponse<CrewMember[]>(response);
}

export async function getTitleAwards(title_id: number): Promise<Award[]> {
  const response = await fetch(`${API_BASE_URL}/single/${title_id}/awards`);
  return handleResponse<Award[]>(response);
}

export async function getTitleReviews(title_id: number, limit: number = 10): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/single/${title_id}/reviews?limit=${limit}`);
  return handleResponse<Review[]>(response);
}

export async function getSimilarTitles(title_id: number, limit: number = 10): Promise<SimilarTitle[]> {
  const response = await fetch(`${API_BASE_URL}/single/${title_id}/similar?limit=${limit}`);
  return handleResponse<SimilarTitle[]>(response);
}

export async function getSeasons(title_id: number): Promise<Season[]> {
  const response = await fetch(`${API_BASE_URL}/single/${title_id}/seasons`);
  return handleResponse<Season[]>(response);
}

export async function getEpisodes(title_id: number): Promise<Episode[]> {
  const response = await fetch(`${API_BASE_URL}/single/${title_id}/episodes`);
  return handleResponse<Episode[]>(response);
}

// ============ Search API ============

// در تابع searchTitles
// در تابع searchTitles
export async function searchTitles(params: SearchParams = {}): Promise<SearchResult[]> {
  const queryParams = new URLSearchParams();
  
  if (params.search_text) queryParams.append('search_text', params.search_text);
  if (params.media_type) queryParams.append('media_type', params.media_type);
  if (params.genre_ids && params.genre_ids.length > 0) {
    queryParams.append('genre_ids', params.genre_ids.join(','));
  }
  if (params.min_year) queryParams.append('min_year', params.min_year.toString());
  if (params.max_year) queryParams.append('max_year', params.max_year.toString());
  if (params.min_score) queryParams.append('min_score', params.min_score.toString());
  if (params.min_votes) queryParams.append('min_votes', params.min_votes.toString());
  if (params.sort_by) queryParams.append('sort_by', params.sort_by);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());
  
  const url = `${API_BASE_URL}/search/titles?${queryParams.toString()}`;
  console.log('Search URL:', url); // برای دیباگ
  const response = await fetch(url);
  return handleResponse<SearchResult[]>(response);
}
import { getToken, setToken, removeToken } from '../utils/jwt.utils';
const API_BASE_URL = 'http://localhost:8000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ============ JWT Auth Types & Functions ============

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
  email: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await handleResponse<AuthResponse>(response);
  
  if (data.access_token) {
    setToken(data.access_token);
  }
  
  return data;
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await handleResponse<AuthResponse>(response);
  
  if (data.access_token) {
    setToken(data.access_token);
  }
  
  return data;
}

export async function logout(): Promise<void> {
  removeToken();
  localStorage.removeItem('user_data');
  localStorage.removeItem('user_watchlist');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export async function getCurrentUser(): Promise<Omit<AuthResponse, 'access_token'>> {
  const userDataStr = localStorage.getItem('user_data');
  if (!userDataStr) {
    throw new Error('No user data found');
  }
  return JSON.parse(userDataStr);
}

export const saveUserData = (response: AuthResponse): void => {
  const userData = {
    user_id: response.user_id,
    username: response.username,
    email: response.email,
  };
  localStorage.setItem('user_data', JSON.stringify(userData));
};

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function authenticatedFetch<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...getAuthHeaders(),
    },
  });
  
  if (response.status === 401) {
    removeToken();
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_watchlist');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please login again.');
  }
  
  return handleResponse<T>(response);
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

export type WatchlistStatus = 'want_to_watch' | 'watching' | 'watched';

function toBackendStatus(status: WatchlistStatus): string {
  switch (status) {
    case 'want_to_watch': return 'Want to Watch';
    case 'watching': return 'Watching';
    case 'watched': return 'Watched';
    default: return 'Want to Watch';
  }
}

export interface WatchlistItem {
  title_id: number;
  t_type: string;
  age_rating: string;
  name_fa: string;
  name_en: string;
  poster_url: string | null;
  genres: string;
  release_year: number;
  duration_mins: number | null;
  total_seasons: number | null;
  total_episodes: number | null;
  status: WatchlistStatus;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

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
  age_rating: string;  
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

export interface UserRating {
  title_id: number;
  title_name_fa: string;
  title_name_en: string;
  poster_url: string;
  rating_score: number;
  rating_date: string;
  review_text: string;
  is_spoiler: boolean;
  t_type: string;
}

export interface UserProfile {
  username: string;
  join_date: string;
  photo_url: string | null;
  email: string;
  total_rated: number;
  total_written: number;
  total_want_to_watch: number;
  total_watching: number;
  total_watched: number;
}

// ============ Watchlist LocalStorage Functions ============

const WATCHLIST_STORAGE_KEY = 'user_watchlist';

export function saveWatchlistToLocalStorage(items: WatchlistItem[]): void {
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
}

export function getWatchlistFromLocalStorage(): WatchlistItem[] {
  const data = localStorage.getItem(WATCHLIST_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function updateWatchlistInLocalStorage(
  titleId: number, 
  status: WatchlistStatus | null, 
  itemData?: Partial<WatchlistItem>
): WatchlistItem[] {
  const currentList = getWatchlistFromLocalStorage();
  
  if (status === null) {
    const newList = currentList.filter(item => item.title_id !== titleId);
    saveWatchlistToLocalStorage(newList);
    return newList;
  } else {
    const existingIndex = currentList.findIndex(item => item.title_id === titleId);
    
    const newItem: WatchlistItem = {
      title_id: titleId,
      t_type: itemData?.t_type || 'M',
      age_rating: itemData?.age_rating || '',
      name_fa: itemData?.name_fa || '',
      name_en: itemData?.name_en || '',
      poster_url: itemData?.poster_url || null,
      genres: itemData?.genres || '',
      release_year: itemData?.release_year || 0,
      duration_mins: itemData?.duration_mins || null,
      total_seasons: itemData?.total_seasons || null,
      total_episodes: itemData?.total_episodes || null,
      status: status,
    };
    
    if (existingIndex >= 0) {
      currentList[existingIndex] = { ...currentList[existingIndex], ...newItem, status };
      saveWatchlistToLocalStorage(currentList);
      return currentList;
    } else {
      const newList = [...currentList, newItem];
      saveWatchlistToLocalStorage(newList);
      return newList;
    }
  }
}

// ============ Watchlist API Functions ============

export async function addToWatchlist(titleId: number, status: WatchlistStatus = 'want_to_watch'): Promise<ApiResponse> {
  updateWatchlistInLocalStorage(titleId, status);
  
  try {
    const response = await fetch(`${API_BASE_URL}/saved/${titleId}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: toBackendStatus(status) }),
    });
    
    if (response.ok) {
      return handleResponse<ApiResponse>(response);
    }
  } catch (error) {
    console.error('Server error, but saved locally:', error);
  }
  
  return { success: true, message: 'Saved locally' };
}

export async function updateWatchlistStatus(titleId: number, status: WatchlistStatus): Promise<ApiResponse> {
  updateWatchlistInLocalStorage(titleId, status);
  
  try {
    const response = await fetch(`${API_BASE_URL}/saved/${titleId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: toBackendStatus(status) }),
    });
    
    if (response.ok) {
      return handleResponse<ApiResponse>(response);
    }
  } catch (error) {
    console.error('Server error, but updated locally:', error);
  }
  
  return { success: true, message: 'Updated locally' };
}

export async function removeFromWatchlist(titleId: number): Promise<ApiResponse> {
  updateWatchlistInLocalStorage(titleId, null);
  
  try {
    const response = await fetch(`${API_BASE_URL}/saved/${titleId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      return handleResponse<ApiResponse>(response);
    }
  } catch (error) {
    console.error('Server error, but removed locally:', error);
  }
  
  return { success: true, message: 'Removed locally' };
}

export async function getUserWatchlist(forceRefresh: boolean = false): Promise<WatchlistItem[]> {
  if (forceRefresh) {
    console.log('🔄 Force fetching watchlist from server...');
    const token = getToken();
    if (!token) {
      console.log('No token, returning empty');
      return [];
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/user/watchlist`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        let data = await response.json();
        data = data.map((item: WatchlistItem) => ({
          ...item,
          status: normalizeBackendStatus(item.status)
        }));
        console.log('✅ Watchlist fetched:', data.length, 'items');
        saveWatchlistToLocalStorage(data);
        return data;
      } else {
        console.log('❌ Watchlist fetch failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  }
  
  const localData = getWatchlistFromLocalStorage();
  if (localData && localData.length > 0) {
    console.log('📦 Using cached watchlist:', localData.length, 'items');
    return localData;
  }
  
  if (!forceRefresh) {
    return getUserWatchlist(true);
  }
  
  return [];
}

function normalizeBackendStatus(status: string): WatchlistStatus {
  if (!status) return 'want_to_watch';
  const statusLower = status.toLowerCase();
  if (statusLower === 'want to watch') return 'want_to_watch';
  if (statusLower === 'watching') return 'watching';
  if (statusLower === 'watched') return 'watched';
  return 'want_to_watch';
}

export async function syncWatchlistFromServer(): Promise<WatchlistItem[]> {
  console.log('🔄 Syncing watchlist from server...');
  const token = getToken();
  if (!token) {
    console.log('No token found');
    return [];
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/user/watchlist`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Watchlist synced:', data.length, 'items');
      saveWatchlistToLocalStorage(data);
      return data;
    } else {
      console.log('❌ Sync failed with status:', response.status);
      return [];
    }
  } catch (error) {
    console.error('❌ Sync error:', error);
    return [];
  }
}

// ============ Profile API Functions ============

export async function getUserProfile(): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<UserProfile>(response);
}

export async function updateProfile(data: any): Promise<{
  access_token: string;
  token_type: string;
  user_id: number;
  username: string;
  email: string;
}> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteProfile(password: string): Promise<{ success: boolean; message: string }> {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: password }),
  });
  
  console.log('Response status:', response.status);
  return handleResponse<{ success: boolean; message: string }>(response);
}

// ============ Ratings API Functions ============

export async function getUserRatings(): Promise<UserRating[]> {
  const storedRatings = localStorage.getItem('user_ratings');
  if (storedRatings) {
    try {
      return JSON.parse(storedRatings);
    } catch (e) {
      console.error('Failed to parse stored ratings', e);
    }
  }
  return [];
}

export async function addOrUpdateRating(titleId: number, data: {
  score: number;
  comment: string;
  is_spoiler: boolean;
}): Promise<ApiResponse> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${titleId}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const titleDetails = await getTitleDetails(titleId);
      const userRating: UserRating = {
        title_id: titleId,
        title_name_fa: titleDetails.name_fa,
        title_name_en: titleDetails.name_en,
        poster_url: titleDetails.poster_url || '',
        rating_score: data.score,
        rating_date: new Date().toISOString().split('T')[0],
        review_text: data.comment,
        is_spoiler: data.is_spoiler,
        t_type: titleDetails.t_type
      };
      saveUserRating(userRating);
      return handleResponse<ApiResponse>(response);
    }
  } catch (error) {
    console.error('Server error, saving locally only:', error);
  }
  
  try {
    const titleDetails = await getTitleDetails(titleId);
    const userRating: UserRating = {
      title_id: titleId,
      title_name_fa: titleDetails.name_fa,
      title_name_en: titleDetails.name_en,
      poster_url: titleDetails.poster_url || '',
      rating_score: data.score,
      rating_date: new Date().toISOString().split('T')[0],
      review_text: data.comment,
      is_spoiler: data.is_spoiler,
      t_type: titleDetails.t_type
    };
    saveUserRating(userRating);
  } catch (error) {
    console.error('Failed to get title details for local save:', error);
  }
  
  return { success: true, message: 'Rating saved locally' };
}

export async function deleteRating(titleId: number): Promise<ApiResponse> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  deleteUserRating(titleId);
 
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${titleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (response.ok) {
      return handleResponse<ApiResponse>(response);
    }
  } catch (error) {
    console.error('Server error, but removed locally:', error);
  }
  
  return { success: true, message: 'Rating removed locally' };
}

// ============ User Ratings LocalStorage Functions ============

export function saveUserRating(rating: UserRating): void {
  const storedRatings = localStorage.getItem('user_ratings');
  let ratings: UserRating[] = storedRatings ? JSON.parse(storedRatings) : [];
  
  const existingIndex = ratings.findIndex(r => r.title_id === rating.title_id);
  if (existingIndex >= 0) {
    ratings[existingIndex] = rating;
  } else {
    ratings = [rating, ...ratings];
  }
  
  localStorage.setItem('user_ratings', JSON.stringify(ratings));
}

export function deleteUserRating(titleId: number): void {
  const storedRatings = localStorage.getItem('user_ratings');
  if (storedRatings) {
    let ratings: UserRating[] = JSON.parse(storedRatings);
    ratings = ratings.filter(r => r.title_id !== titleId);
    localStorage.setItem('user_ratings', JSON.stringify(ratings));
  }
}
// ============ Homepage APIs ============

export async function getHero(limit: number = 5): Promise<HeroTitle[]> {
  const response = await fetch(`${API_BASE_URL}/homepage/hero?limit=${limit}`);
  return handleResponse<HeroTitle[]>(response);
}

export async function getPopularGenres(limit: number = 5): Promise<PopularGenre[]> {
  const response = await fetch(`${API_BASE_URL}/homepage/popular-genres?limit=${limit}`);
  return handleResponse<PopularGenre[]>(response);
}

export async function getRecommendations(limit: number = 5): Promise<Recommendation[]> {
  const token = getToken();
  
  console.log('🔑 getRecommendations - Token exists:', !!token);
  
  if (!token) {
    console.log('❌ No token found, returning empty array');
    return [];
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/homepage/recommendations?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Recommendations response status:', response.status);
    
    if (response.status === 401) {
      console.log('🔐 Token invalid or expired - clearing storage');
      removeToken();
      localStorage.removeItem('user_data');
      return [];
    }
    
    if (!response.ok) {
      console.log(`❌ Recommendations API error: ${response.status}`);
      return [];
    }
    
    const data = await handleResponse<Recommendation[]>(response);
    console.log(`✅ Recommendations received: ${data.length} items`);
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch recommendations:', error);
    return [];
  }
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
      return [];
    }
    return handleResponse<any[]>(response);
  } catch (error) {
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
  const response = await fetch(url);
  return handleResponse<SearchResult[]>(response);
}
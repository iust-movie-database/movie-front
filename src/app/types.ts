// Shared types for the application

export type Page = "design" | "home" | "movie" | "tv" | "browse" | "profile";

export interface CastMember {
  name: string;
  character: string;
  img: string;
}

export interface CrewMember {
  name: string;
  role: string;
}

export interface AwardEntry {
  year: number;
  name: string;
  category: string;
  status: "won" | "nominated";
}

export interface ReviewEntry {
  user: string;
  score: number;
  comment: string;
  spoiler: boolean;
}

export interface MovieData {
  id: number;
  title: string;
  originalTitle: string;
  year: number;
  rating: number;
  duration: string;
  genres: string[];
  img: string;
  summary: string;
  age: string;
  type: "Movie" | "TV";
  voteCount?: number;
  cast?: CastMember[];
  crew?: CrewMember[];
  awards?: AwardEntry[];
  reviews?: ReviewEntry[];
  similarMovieIds?: number[];
}

export interface ComingSoonData {
  id: number;
  title: string;
  originalTitle: string;
  year: number;
  genres: string[];
  img: string;
  type: "Movie" | "TV";
  releaseDate: string;
}

export interface RatedEntry {
  id: number;
  title: string;
  img: string;
  type: "Movie" | "TV";
  score: number;
  review: string;
  date: string;
}

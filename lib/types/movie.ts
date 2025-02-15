export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_title: string;
  original_language: string;
  popularity: number;
  backdrop_path: string | null;
  adult: boolean;
  genre_ids: number[];
  video: boolean;
}

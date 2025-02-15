import { Question } from '@/lib/constants/questions';
import { Movie } from '@/lib/types/movie';

export type DrawerStep = 'question-selection' | 'question-answer' | 'movie-blocks';

export interface QuestionSelectionProps {
  onQuestionSelect: (question: Question) => void;
}

export interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  hasSearched: boolean;
  setHasSearched: (searched: boolean) => void;
}

export interface QuestionAnswerProps {
  question: Question;
  onBack: () => void;
  onMovieSelect: (movie: Movie) => void;
  searchState: SearchState;
}

export interface QuestionCardProps {
  question: Question;
  onClick: () => void;
}

export interface MovieBlocksContentProps {
  movie: Movie;
  onBack: () => void;
}

export interface MovieBlockProps {
  movie: Movie;
  variant: 'tiny' | 'tall' | 'medium' | 'wide' | 'large';
}

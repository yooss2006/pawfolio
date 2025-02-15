'use client';

import { Question } from '@/lib/constants/questions';
import { QuestionSelectionContent } from './question-selection-content';
import { QuestionAnswerContent } from './question-answer-content';
import { MovieBlocksContent } from './movie-blocks-content';
import { DrawerStep } from '../types';
import { useState } from 'react';
import { Movie } from '@/lib/types/movie';

export function DrawerContentContainer() {
  const [step, setStep] = useState<DrawerStep>('question-selection');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // 검색 관련 상태를 최상위로 이동
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    setStep('question-answer');
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setStep('movie-blocks');
  };

  const handleBack = () => {
    if (step === 'movie-blocks') {
      setStep('question-answer');
      setSelectedMovie(null);
    } else {
      setStep('question-selection');
      setSelectedQuestion(null);
      // 질문 선택 단계로 돌아갈 때만 검색 상태 초기화
      setSearchQuery('');
      setMovies([]);
      setCurrentPage(1);
      setTotalPages(0);
      setHasSearched(false);
    }
  };

  if (step === 'question-selection') {
    return <QuestionSelectionContent onQuestionSelect={handleQuestionSelect} />;
  }

  if (step === 'movie-blocks' && selectedMovie) {
    return <MovieBlocksContent movie={selectedMovie} onBack={handleBack} />;
  }

  if (!selectedQuestion) {
    throw new Error('Selected question is required for answer step');
  }

  return (
    <QuestionAnswerContent
      question={selectedQuestion}
      onBack={handleBack}
      onMovieSelect={handleMovieSelect}
      searchState={{
        query: searchQuery,
        setQuery: setSearchQuery,
        movies,
        setMovies,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        hasSearched,
        setHasSearched
      }}
    />
  );
}

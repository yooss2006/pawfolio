'use client';

import { QuestionDrawerHeader } from './question-drawer-header';
import { MovieSearch } from './movie-search';
import { QuestionAnswerProps } from '../types';

export function QuestionAnswerContent({
  question,
  onBack,
  onMovieSelect,
  searchState
}: QuestionAnswerProps) {
  return (
    <>
      <QuestionDrawerHeader title={question.title} onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        {question.id === 'movie' && (
          <MovieSearch onMovieSelect={onMovieSelect} searchState={searchState} />
        )}
      </div>
    </>
  );
}

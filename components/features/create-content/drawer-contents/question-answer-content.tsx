import { Question } from '@/lib/constants/questions';
import { QuestionDrawerHeader } from './question-drawer-header';
import { MovieSearch } from './movie-search';

interface QuestionAnswerContentProps {
  question: Question;
  onBack: () => void;
}

export function QuestionAnswerContent({ question, onBack }: QuestionAnswerContentProps) {
  return (
    <>
      <QuestionDrawerHeader title={question.title} onBack={onBack} />
      <div className="flex-1 overflow-y-auto">{question.id === 'movie' && <MovieSearch />}</div>
    </>
  );
}

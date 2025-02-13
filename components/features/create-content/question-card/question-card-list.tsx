import { QUESTIONS } from '@/lib/constants/questions';
import { QuestionCard } from './question-card';
import { QuestionSelectionProps } from '../types';

export function QuestionCardList({ onQuestionSelect }: QuestionSelectionProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {QUESTIONS.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          onClick={() => onQuestionSelect(question)}
        />
      ))}
    </div>
  );
}

import { Question } from '@/lib/constants/questions';

import { QUESTIONS } from '@/lib/constants/questions';
import { cn } from '@/lib/utils';
import { FC } from 'react';

export function QuestionCardList() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {QUESTIONS.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: FC<QuestionCardProps> = ({ question }) => {
  return (
    <div
      className={cn(
        'group relative w-full rounded-xl p-6 text-left transition-all',
        'bg-gradient-to-r from-white to-theme-background hover:shadow-xl',
        'hover:from-theme-primary/5 hover:to-theme-secondary/10',
        'border border-theme-primary/20 hover:border-theme-primary/40',
        'transform hover:scale-[1.02] hover:cursor-pointer'
      )}
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl">{question.icon}</span>
        <div className="space-y-2">
          <h3 className="font-bold text-theme-primary group-hover:text-theme-primary/90">
            {question.title}
          </h3>
          <p className="text-sm text-muted-foreground">{question.description}</p>
        </div>
      </div>
    </div>
  );
};

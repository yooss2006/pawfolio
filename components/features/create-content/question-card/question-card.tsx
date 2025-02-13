import { cn } from '@/lib/utils';
import { QuestionCardProps } from '../types';

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative w-full rounded-xl p-6 text-left transition-all',
        'bg-gradient-to-r from-white to-theme-background hover:shadow-xl',
        'hover:from-theme-primary/5 hover:to-theme-secondary/10',
        'border border-theme-primary/20 hover:border-theme-primary/40',
        'transform hover:scale-[1.02] hover:cursor-pointer'
      )}
    >
      <QuestionCardContent question={question} />
    </div>
  );
}

function QuestionCardContent({ question }: Pick<QuestionCardProps, 'question'>) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-2xl">{question.icon}</span>
      <div className="space-y-2">
        <h3 className="font-bold text-theme-primary group-hover:text-theme-primary/90">
          {question.title}
        </h3>
        <p className="text-sm text-muted-foreground">{question.description}</p>
      </div>
    </div>
  );
}

import { Question } from '@/lib/constants/questions';

export type DrawerStep = 'question-selection' | 'question-answer';

export interface QuestionSelectionProps {
  onQuestionSelect: (question: Question) => void;
}

export interface QuestionAnswerProps {
  question: Question;
  onBack: () => void;
}

export interface QuestionCardProps {
  question: Question;
  onClick: () => void;
}

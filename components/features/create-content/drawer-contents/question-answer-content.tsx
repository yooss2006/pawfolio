import { Question } from '@/lib/constants/questions';
import { QuestionDrawerHeader } from './question-drawer-header';

interface QuestionAnswerContentProps {
  question: Question;
  onBack: () => void;
}

export function QuestionAnswerContent({ question, onBack }: QuestionAnswerContentProps) {
  return (
    <>
      <QuestionDrawerHeader title={question.title} onBack={onBack} />

      <div className="p-4">{/* 여기에 답변 입력 폼을 추가할 수 있습니다 */}</div>
    </>
  );
}

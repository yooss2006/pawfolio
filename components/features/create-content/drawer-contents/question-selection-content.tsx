import { DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { QuestionCardList } from '../question-card';
import { Question } from '@/lib/constants/questions';
import { QuestionDrawerHeader } from './question-drawer-header';

interface QuestionSelectionContentProps {
  onQuestionSelect: (question: Question) => void;
}

export function QuestionSelectionContent({ onQuestionSelect }: QuestionSelectionContentProps) {
  return (
    <>
      <QuestionDrawerHeader
        title="게시하고 싶은 내용은 무엇인가요?"
        description="답하고 싶은 질문을 선택하세요."
      />
      <QuestionCardList onQuestionSelect={onQuestionSelect} />
    </>
  );
}

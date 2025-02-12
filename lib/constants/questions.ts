export type QuestionType = 'movie' | 'book' | 'music';

export interface Question {
  id: QuestionType;
  title: string;
  description: string;
  icon: string;
}

export const QUESTIONS: Question[] = [
  {
    id: 'movie',
    title: '가장 인상 깊게 본 영화는 무엇인가요?',
    description: '당신의 인생 영화를 공유해주세요',
    icon: '🎬'
  },
  {
    id: 'book',
    title: '최근에 읽은 인상적인 책은 무엇인가요?',
    description: '마음에 남은 구절이나 생각을 함께 나눠주세요',
    icon: '📚'
  },
  {
    id: 'music',
    title: '지금 이 순간 듣고 싶은 음악은?',
    description: '당신의 플레이리스트를 구경하고 싶어요',
    icon: '🎵'
  }
];

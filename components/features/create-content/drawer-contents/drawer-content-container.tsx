'use client';

import { Question } from '@/lib/constants/questions';
import { QuestionSelectionContent } from './question-selection-content';
import { QuestionAnswerContent } from './question-answer-content';
import { DrawerStep } from '../types';
import { useState } from 'react';

export function DrawerContentContainer() {
  const [step, setStep] = useState<DrawerStep>('question-selection');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    setStep('question-answer');
  };

  const handleBack = () => {
    setStep('question-selection');
    setSelectedQuestion(null);
  };

  if (step === 'question-selection') {
    return <QuestionSelectionContent onQuestionSelect={handleQuestionSelect} />;
  }

  if (!selectedQuestion) {
    throw new Error('Selected question is required for answer step');
  }

  return <QuestionAnswerContent question={selectedQuestion} onBack={handleBack} />;
}

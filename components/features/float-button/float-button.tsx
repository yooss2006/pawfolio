'use client';

import { X, MessageSquare, LayoutGrid, Lightbulb, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, useState } from 'react';
import CreateContentDrawer from '../create-content/create-content-drawer';

type FloatButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  onToggleBlocks?: () => void;
};

export default function FloatButton({ className, onToggleBlocks, ...props }: FloatButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleMainButtonClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setTimeout(() => setIsVisible(false), 300);
    } else {
      setIsVisible(true);
      setTimeout(() => setIsExpanded(true), 50);
    }
    onToggleBlocks?.();
  };

  // 메인 버튼 스타일
  const mainButtonClasses = cn(
    'flex h-14 w-14 items-center justify-center rounded-full',
    'bg-gradient-to-br from-theme-primary to-theme-primary shadow-lg',
    'hover:bg-gradient-to-tl hover:from-theme-primary hover:to-theme-accent',
    'transition-all duration-300'
  );

  // 확장 버튼 공통 스타일 (glassmorphism)
  const expandedButtonClasses = cn(
    'flex h-14 w-14 items-center justify-center rounded-full',
    'bg-white/90 backdrop-blur-sm shadow-lg',
    'border border-theme-primary/10',
    'hover:border-theme-primary/20 hover:bg-theme-primary/5',
    'hover:scale-105 transform transition-all duration-300'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-[2rem]">
      <div
        className={cn(
          'absolute bottom-full mb-4 flex flex-col items-center gap-4',
          'transition-all duration-300 ease-in-out',
          isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
          isVisible ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {isVisible && (
          <>
            <CreateContentDrawer onButtonClick={handleMainButtonClick} />
            <button onClick={handleMainButtonClick} className={expandedButtonClasses} {...props}>
              <Package className="size-6 text-theme-primary" />
            </button>
          </>
        )}
      </div>

      <button
        onClick={handleMainButtonClick}
        className={cn(mainButtonClasses, 'hover:animate-scale-up-down', className)}
        {...props}
      >
        {isExpanded ? (
          <X className="size-6 text-white" />
        ) : (
          <Lightbulb className="size-6 text-white" />
        )}
      </button>
    </div>
  );
}

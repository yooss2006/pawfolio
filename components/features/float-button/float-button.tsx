'use client';

import { X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, useState } from 'react';
import CreateContentDrawer from '../create-content/create-content-drawer';
import { TemporaryBlocksButton } from '../temporary-blocks/temporary-blocks-button';

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
  };

  // 메인 버튼 스타일
  const mainButtonClasses = cn(
    'flex h-14 w-14 items-center justify-center rounded-full',
    'bg-gradient-to-br from-theme-primary to-theme-primary shadow-lg',
    'hover:bg-gradient-to-tl hover:from-theme-primary hover:to-theme-accent',
    'transition-all duration-300'
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
            <TemporaryBlocksButton
              onToggle={(e) => {
                handleMainButtonClick();
                onToggleBlocks?.();
              }}
              buttonProps={props}
            />
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

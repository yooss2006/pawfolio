'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

// 빈 인터페이스 대신 타입 확장
type FloatButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function FloatButton({ className, ...props }: FloatButtonProps) {
  return (
    <button
      className={cn(
        'fixed flex h-14 w-14 items-center justify-center rounded-full shadow-lg',
        'bg-gradient-to-br from-theme-primary to-theme-primary transition-all duration-300',
        'hover:bg-gradient-to-tl hover:from-theme-primary hover:to-theme-accent',
        'hover:animate-scale-up-down',
        'bottom-6 right-6 md:bottom-8 md:right-[2rem]',
        className
      )}
      {...props}
    >
      <Plus className="size-8 text-white" />
    </button>
  );
}

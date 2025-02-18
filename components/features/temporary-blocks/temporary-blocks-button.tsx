import { Package } from 'lucide-react';
import { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Movie } from '@/lib/types/movie';
import { BlockVariant } from '@/lib/constants/blocks';

interface BlockData {
  movie: Movie;
  blockSize: {
    cols: number;
    rows: number;
  };
  variant: BlockVariant;
  createdAt: string;
}

interface TemporaryBlocksButtonProps {
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export function TemporaryBlocksButton({
  onToggle,
  className,
  buttonProps
}: TemporaryBlocksButtonProps) {
  const [hasValidBlocks, setHasValidBlocks] = useState(false);

  useEffect(() => {
    const checkBlocks = () => {
      try {
        const storedBlocks = localStorage.getItem('blocks');
        if (!storedBlocks) return setHasValidBlocks(false);

        const parsedBlocks = JSON.parse(storedBlocks) as BlockData[];
        if (!Array.isArray(parsedBlocks) || parsedBlocks.length === 0) {
          return setHasValidBlocks(false);
        }

        // 데이터 유효성 검사
        const isValid = parsedBlocks.every(
          (block) =>
            block.movie &&
            block.blockSize &&
            typeof block.blockSize.cols === 'number' &&
            typeof block.blockSize.rows === 'number' &&
            block.variant &&
            block.createdAt
        );

        setHasValidBlocks(isValid);
      } catch (error) {
        setHasValidBlocks(false);
      }
    };

    // 초기 체크
    checkBlocks();

    // localStorage 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blocks') {
        checkBlocks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', checkBlocks);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', checkBlocks);
    };
  }, []);

  if (!hasValidBlocks) return null;

  const buttonClasses = cn(
    'flex h-14 w-14 items-center justify-center rounded-full',
    'bg-white/90 backdrop-blur-sm shadow-lg',
    'border border-theme-primary/10',
    'hover:border-theme-primary/20 hover:bg-theme-primary/5',
    'hover:scale-105 transform transition-all duration-300',
    className
  );

  return (
    <button onClick={onToggle} className={buttonClasses} {...buttonProps}>
      <Package className="size-6 text-theme-primary" />
    </button>
  );
}

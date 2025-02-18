'use client';

import { useCallback, useEffect, useState } from 'react';
import { Movie } from '@/lib/types/movie';
import { BlockVariant } from '@/lib/constants/blocks';
import { MovieBlock } from './movie-block';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { DragEndEvent } from '@dnd-kit/core';

interface BlockData {
  movie: Movie;
  blockSize: {
    cols: number;
    rows: number;
  };
  variant: BlockVariant;
  createdAt: string;
}

interface TemporaryBlocksContainerProps {
  onClose: () => void;
}

export function TemporaryBlocksContainer({ onClose }: TemporaryBlocksContainerProps) {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  /**
   * 개별 블록 유효성 검사 함수
   */
  const isValidBlock = useCallback((block: any): boolean => {
    return (
      block.movie &&
      block.blockSize &&
      typeof block.blockSize.cols === 'number' &&
      typeof block.blockSize.rows === 'number' &&
      block.variant &&
      block.createdAt
    );
  }, []);

  /**
   * 로컬 스토리지의 'blocks' 데이터 로드 및 상태 업데이트
   */
  const loadBlocks = useCallback(() => {
    try {
      const storedBlocks = localStorage.getItem('blocks');
      if (!storedBlocks) return;

      const parsedBlocks = JSON.parse(storedBlocks);
      if (!Array.isArray(parsedBlocks) || parsedBlocks.length === 0) return;

      const validBlocks = parsedBlocks.filter(isValidBlock);
      setBlocks(validBlocks);
    } catch (error) {
      console.error('블록 데이터 로드 중 오류:', error);
    }
  }, [isValidBlock]);

  /**
   * 화면 크기 변화에 따라 isLargeScreen 상태 업데이트
   */
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth > 600);
  };

  // 로컬 스토리지 변경 감지 (다른 탭/창 및 같은 탭 내 커스텀 이벤트)
  useEffect(() => {
    loadBlocks();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blocks') {
        loadBlocks();
      }
    };

    const handleCustomStorageChange = () => {
      loadBlocks();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, [loadBlocks]);

  // 화면 크기 변경 시 상태 업데이트
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 블록 배열이 비어 있으면 아무것도 렌더링하지 않음
  if (blocks.length === 0) return null;

  /**
   * 화면 크기에 따라 다른 레이아웃 스타일을 적용
   */
  const containerClasses = isLargeScreen
    ? 'right-4 top-4 flex max-h-[80vh] w-[600px] flex-col gap-4 overflow-y-auto rounded-lg p-4'
    : 'bottom-4 left-[2.5%] flex max-h-[60vh] w-[95%] flex-col gap-3 overflow-y-auto rounded-lg p-3';

  // 블록 크기 계산 함수
  const getBlockDimensions = (variant: BlockVariant) => {
    const mobileWidth = typeof window !== 'undefined' ? window.innerWidth * 0.95 : 400;
    const mobileCellSize = Math.min(110, (mobileWidth - 24) / 3);
    const cellSize = isLargeScreen ? 138 : mobileCellSize;

    switch (variant) {
      case 'tiny': // 1x1
        return { width: cellSize, height: cellSize };
      case 'tall': // 1x3
        return {
          width: cellSize,
          height: isLargeScreen ? 300 : 250 // 하드코딩된 높이 값을 직접 사용
        };
      case 'medium': // 2x3
        return { width: cellSize * 2, height: cellSize * 3 };
      case 'wide': // 3x1
        return { width: cellSize * 3, height: cellSize };
      case 'large': // 3x2
        return { width: cellSize * 3, height: cellSize * 2 };
      default:
        return { width: cellSize, height: cellSize };
    }
  };

  return (
    <div className={cn('fixed z-10 bg-white/80 backdrop-blur-sm', containerClasses)}>
      <div className="sticky top-0 z-20 flex justify-end">
        <button
          onClick={onClose}
          className={cn(
            'mr-3 flex h-10 w-10 items-center justify-center rounded-full',
            'bg-gray-900/80 text-white',
            'hover:bg-gray-900/90 active:bg-gray-900',
            'transition-colors duration-200',
            'md:h-12 md:w-12'
          )}
        >
          <X className="size-5 md:size-6" />
        </button>
      </div>

      {blocks.map((block, index) => {
        const dimensions = getBlockDimensions(block.variant);

        return (
          <div
            key={`${block.movie.id}-${index}`}
            className={cn('transform', isLargeScreen ? 'mx-auto' : 'ml-0')}
            style={{
              width: dimensions.width,
              height: dimensions.height
            }}
          >
            <MovieBlock
              movie={block.movie}
              variant={block.variant}
              isDraggable={true}
              id={`draggable-block-${block.movie.id}-${index}`}
              dimensions={dimensions}
              className={cn(
                '[&_h3]:text-sm [&_img]:!relative [&_img]:!h-full [&_img]:!w-full [&_img]:!object-cover',
                isLargeScreen
                  ? '[&_p]:text-xs'
                  : '[&_h3]:!text-xs [&_p]:!line-clamp-1 [&_p]:!text-[10px]'
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

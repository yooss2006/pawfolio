'use client';

import { useCallback, useEffect, useState } from 'react';
import { Movie } from '@/lib/types/movie';
import { BlockVariant } from '@/lib/constants/blocks';
import { MovieBlock } from './movie-block';
import { cn } from '@/lib/utils';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';

interface BlockData {
  movie: Movie;
  blockSize: {
    cols: number;
    rows: number;
  };
  variant: BlockVariant;
  createdAt: string;
}

export function TemporaryBlocksScroll() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [containerHeight, setContainerHeight] = useState(96);
  const [isDraggingGridBlock, setIsDraggingGridBlock] = useState(false);
  
  // 임시 블록 저장소 영역을 드롭 가능한 영역으로 만듦
  const { setNodeRef, isOver } = useDroppable({
    id: 'temporary-blocks-container',
    data: { isTemporaryBlocksContainer: true },
    disabled: !isDraggingGridBlock // 그리드 블록을 드래그할 때만 드롭 가능
  });
  
  // 드래그 이벤트 모니터링
  useDndMonitor({
    onDragStart: (event) => {
      const { active } = event;
      const { isGridBlock } = active.data.current || {};
      setIsDraggingGridBlock(!!isGridBlock);
    },
    onDragEnd: () => {
      setIsDraggingGridBlock(false);
    },
    onDragCancel: () => {
      setIsDraggingGridBlock(false);
    }
  });

  useEffect(() => {
    const updateHeightByWidth = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setContainerHeight(96); // h-24 (모바일)
      } else if (width < 640) {
        setContainerHeight(112); // sm:h-28
      } else if (width < 768) {
        setContainerHeight(128); // sm:h-32
      } else {
        setContainerHeight(144); // md:h-36 (데스크탑)
      }
    };

    updateHeightByWidth();
    window.addEventListener('resize', updateHeightByWidth);
    return () => window.removeEventListener('resize', updateHeightByWidth);
  }, []);

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

  const loadBlocks = useCallback(() => {
    try {
      const storedBlocks = localStorage.getItem('blocks');
      if (!storedBlocks) {
        setBlocks([]);
        return;
      }

      const parsedBlocks = JSON.parse(storedBlocks);
      if (!Array.isArray(parsedBlocks)) {
        setBlocks([]);
        return;
      }

      const validBlocks = parsedBlocks.filter(isValidBlock);
      
      if (JSON.stringify(blocks) !== JSON.stringify(validBlocks)) {
        setBlocks(validBlocks);
      }
    } catch (error) {
      console.error('블록 데이터 로드 중 오류:', error);
      setBlocks([]);
    }
  }, [isValidBlock, blocks]);

  useEffect(() => {
    loadBlocks();

    let debounceTimer: NodeJS.Timeout;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blocks') {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadBlocks();
        }, 100);
      }
    };
    
    const handleLocalStorageChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadBlocks();
      }, 100);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange);
      clearTimeout(debounceTimer);
    };
  }, [loadBlocks]);

  const getBlockDimensions = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    let baseSize = width < 400 ? 90 : width < 500 ? 100 : width < 768 ? 110 : 120;

    const maxHeight = containerHeight - 16;
    const squareSize = Math.min(baseSize, maxHeight);

    return {
      width: squareSize,
      height: squareSize
    };
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex w-full overflow-x-auto overflow-y-hidden pb-2 transition-all duration-200",
        isDraggingGridBlock && isOver && "bg-green-50 ring-2 ring-green-500 rounded-lg",
        isDraggingGridBlock && !isOver && "ring-1 ring-gray-300 rounded-lg"
      )}
      style={{ height: containerHeight }}
    >
      {blocks.length > 0 ? (
        <div className="flex min-w-0 items-center gap-4 px-2">
          {blocks.map((block, index) => {
            const dimensions = getBlockDimensions();
            return (
              <div
                key={`${block.movie.id}-${index}`}
                className="relative flex-shrink-0"
                style={{
                  height: dimensions.height,
                  width: dimensions.width,
                  position: 'relative'
                }}
              >
                <MovieBlock
                  movie={block.movie}
                  variant={block.variant}
                  isDraggable={true}
                  id={`draggable-block-${block.movie.id}-${index}`}
                  dimensions={dimensions}
                  className={cn(
                    'h-full w-full',
                    '[&_h3]:!text-[9px] sm:[&_h3]:!text-xs md:[&_h3]:!text-sm',
                    '[&_img]:!relative [&_img]:!h-full [&_img]:!w-full [&_img]:!object-cover',
                    '[&_p]:!line-clamp-1 [&_p]:!text-[7px] sm:[&_p]:!text-xs'
                  )}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center p-4 text-xs text-gray-500 sm:text-sm">
          블록을 추가해주세요
        </div>
      )}
    </div>
  );
}

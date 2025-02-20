'use client';

import { useCallback, useEffect, useState } from 'react';
import { Movie } from '@/lib/types/movie';
import { BlockVariant } from '@/lib/constants/blocks';
import { MovieBlock } from './movie-block';
import { cn } from '@/lib/utils';

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
      if (!storedBlocks) return;

      const parsedBlocks = JSON.parse(storedBlocks);
      if (!Array.isArray(parsedBlocks) || parsedBlocks.length === 0) return;

      const validBlocks = parsedBlocks.filter(isValidBlock);
      setBlocks(validBlocks);
    } catch (error) {
      console.error('블록 데이터 로드 중 오류:', error);
    }
  }, [isValidBlock]);

  useEffect(() => {
    loadBlocks();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blocks') {
        loadBlocks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', loadBlocks);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', loadBlocks);
    };
  }, [loadBlocks]);

  // 블록 크기 계산 함수 수정
  const getBlockDimensions = (blockSize: { cols: number; rows: number }) => {
    const baseSize = 40;

    return {
      width: blockSize.cols * baseSize,
      height: blockSize.rows * baseSize
    };
  };

  // 블록이 없어도 컨테이너는 렌더링
  return (
    <div className="flex h-full gap-2 overflow-x-auto overflow-y-hidden pb-1">
      {blocks.length > 0 ? (
        blocks.map((block, index) => {
          const dimensions = getBlockDimensions(block.blockSize);
          return (
            <div
              key={`${block.movie.id}-${index}`}
              className="mr-4 flex flex-shrink-0 justify-center"
              style={{
                width: dimensions.width,
                height: '100%'
              }}
            >
              <div
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
                    'h-full w-full',
                    '[&_h3]:!text-[9px] [&_img]:!relative [&_img]:!h-full [&_img]:!w-full [&_img]:!object-cover',
                    '[&_p]:!line-clamp-1 [&_p]:!text-[7px]'
                  )}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex w-full items-center justify-center text-xs text-gray-500">
          {' '}
          {/* 텍스트 크기 축소 */}
          블록을 추가해주세요
        </div>
      )}
    </div>
  );
}

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
  // 화면 크기에 따른 동적 높이 조정을 위한 상태
  const [containerHeight, setContainerHeight] = useState(96); // h-24 기본값

  // 화면 크기에 따라 컨테이너 높이 설정
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

  // 반응형 블록 크기 계산 - 완전한 정사각형으로 수정
  const getBlockDimensions = () => {
    // 화면 너비에 따라 블록 크기 조정
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;

    // 기본 사이즈 결정 (화면 크기에 따라)
    let baseSize =
      width < 400
        ? 90 // 모바일에서 더 작게
        : width < 500
          ? 100
          : width < 768
            ? 110 // 태블릿
            : 120; // 데스크탑

    // 컨테이너 높이에 따른 정사각형 크기 제한
    const maxHeight = containerHeight - 16; // 패딩과 마진 고려

    // 정사각형을 만들기 위해 너비와 높이 중 작은 값으로 통일
    const squareSize = Math.min(baseSize, maxHeight);

    return {
      width: squareSize,
      height: squareSize // 너비와 높이를 동일하게 설정
    };
  };

  return (
    <div
      className="flex overflow-x-auto overflow-y-hidden pb-2"
      style={{ height: containerHeight }}
    >
      {blocks.length > 0 ? (
        <div className="flex items-center gap-4 px-2">
          {blocks.map((block, index) => {
            const dimensions = getBlockDimensions();
            return (
              <div
                key={`${block.movie.id}-${index}`}
                className="flex-shrink-0"
                style={{ height: dimensions.height }}
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

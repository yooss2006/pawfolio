'use client';

import { Movie } from '@/lib/types/movie';
import { QuestionDrawerHeader } from './question-drawer-header';
import { cn } from '@/lib/utils';
import { MovieBlock } from './movie-block';
import { useEffect, useState } from 'react';

interface MovieBlocksContentProps {
  movie: Movie;
  onBack: () => void;
}

// 그리드 설정
const GRID = {
  COLS: 4,
  ROWS: 10,
  CELL_SIZE: {
    DEFAULT: 138,
    SM: 110, // 600px 미만에서의 셀 크기 (조정됨)
    XS: 85 // 400px 미만에서의 셀 크기 (조정됨)
  },
  GAP: 0
};

// 블록 타입별 차지하는 그리드 셀 크기
const BLOCK_SIZES = {
  tiny: { cols: 1, rows: 1 }, // 1x1 블록
  tall: { cols: 1, rows: 3 }, // 1x3 블록
  medium: { cols: 2, rows: 3 }, // 2x3 블록
  wide: { cols: 3, rows: 1 }, // 3x1 블록
  large: { cols: 3, rows: 2 } // 3x2 블록
} as const;

// 블록들의 초기 위치 재조정
const INITIAL_POSITIONS = {
  tiny: { col: 3, row: 0 }, // 1x1 블록
  wide: { col: 0, row: 1 }, // 3x1 블록
  tall: { col: 0, row: 3 }, // 1x3 블록
  medium: { col: 2, row: 3 }, // 2x3 블록
  large: { col: 0, row: 7 } // 3x2 블록
};

export function MovieBlocksContent({ movie, onBack }: MovieBlocksContentProps) {
  const [cellSize, setCellSize] = useState(GRID.CELL_SIZE.DEFAULT);

  useEffect(() => {
    const updateCellSize = () => {
      const width = window.innerWidth;
      const containerPadding = 32; // 좌우 패딩 합계
      const scrollbarWidth = 16; // 스크롤바 너비
      const availableWidth = width - containerPadding - scrollbarWidth;

      // 각 셀 크기별 필요한 전체 너비 계산
      const defaultWidth = GRID.COLS * GRID.CELL_SIZE.DEFAULT;
      const smWidth = GRID.COLS * GRID.CELL_SIZE.SM;
      const xsWidth = GRID.COLS * GRID.CELL_SIZE.XS;

      // 가용 너비에 따라 적절한 셀 크기 선택
      if (availableWidth >= defaultWidth) {
        setCellSize(GRID.CELL_SIZE.DEFAULT);
      } else if (availableWidth >= smWidth) {
        setCellSize(GRID.CELL_SIZE.SM);
      } else {
        setCellSize(GRID.CELL_SIZE.XS);
      }
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  return (
    <>
      <QuestionDrawerHeader
        title="블록 레이아웃 선택"
        description="마음에 드는 블록 레이아웃을 선택해주세요"
        onBack={onBack}
      />
      <div className="mb-4 flex-1 overflow-y-auto overflow-x-hidden px-4">
        <div className="mx-auto w-fit">
          <div
            className="relative"
            style={{
              width: GRID.COLS * cellSize,
              height: GRID.ROWS * cellSize,
              minHeight: '80vh'
            }}
          >
            {/* 그리드 가이드라인 */}
            <div className="absolute inset-0 grid auto-rows-fr grid-cols-4">
              {Array.from({ length: GRID.COLS * GRID.ROWS }).map((_, i) => (
                <div
                  key={`grid-cell-${i}`}
                  className="border border-theme-primary/10 bg-theme-background/50"
                />
              ))}
            </div>

            {/* 블록들 */}
            {Object.entries(INITIAL_POSITIONS).map(([variant, position]) => {
              const size = BLOCK_SIZES[variant as keyof typeof BLOCK_SIZES];
              const width = size.cols * cellSize;
              const height = size.rows * cellSize;
              const left = position.col * cellSize;
              const top = position.row * cellSize;

              return (
                <div
                  key={variant}
                  className={cn(
                    'absolute transition-all duration-300',
                    'animate-in fade-in zoom-in',
                    'hover:z-10 hover:scale-[1.02]'
                  )}
                  style={{
                    left,
                    top,
                    width,
                    height
                  }}
                >
                  <MovieBlock movie={movie} variant={variant as keyof typeof BLOCK_SIZES} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

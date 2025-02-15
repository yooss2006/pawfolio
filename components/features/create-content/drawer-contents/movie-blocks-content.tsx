'use client';

import { Movie } from '@/lib/types/movie';
import { QuestionDrawerHeader } from './question-drawer-header';
import { cn } from '@/lib/utils';
import { MovieBlock } from './movie-block';
import { useEffect, useState } from 'react';
import { BLOCK_SIZES, BlockVariant } from '@/lib/constants/blocks';
import { useToast } from '@/hooks/use-toast';
import { DrawerClose } from '@/components/ui/drawer';
import { PartyPopper, AlertCircle } from 'lucide-react';

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
  const { toast } = useToast();

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

  const handleBlockSelect = (variant: BlockVariant) => {
    try {
      // 선택한 블록 정보를 로컬 스토리지에 저장
      const blockData = {
        movie,
        blockSize: BLOCK_SIZES[variant],
        variant,
        createdAt: new Date().toISOString()
      };

      // 기존 블록 데이터 배열 가져오기
      const existingBlocks = JSON.parse(localStorage.getItem('blocks') || '[]');

      // 새 블록 추가
      localStorage.setItem('blocks', JSON.stringify([...existingBlocks, blockData]));

      // 성공 토스트 메시지 표시
      toast({
        title: '블록 저장 완료',
        description: '선택하신 블록이 저장되었습니다.',
        duration: 3000,
        variant: 'success',
        icon: <PartyPopper className="size-5 animate-bounce text-green-500" />
      });
    } catch (error) {
      // 에러 발생 시 토스트 메시지
      toast({
        title: '저장 실패',
        description: '블록 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
        duration: 3000,
        icon: <AlertCircle className="size-5 text-red-500" />
      });
    }
  };

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
              const size = BLOCK_SIZES[variant as BlockVariant];
              const width = size.cols * cellSize;
              const height = size.rows * cellSize;
              const left = position.col * cellSize;
              const top = position.row * cellSize;

              return (
                <DrawerClose key={variant} asChild>
                  <div
                    onClick={() => handleBlockSelect(variant as BlockVariant)}
                    className={cn(
                      'absolute transition-all duration-300',
                      'animate-in fade-in zoom-in',
                      'cursor-pointer hover:z-10 hover:scale-[1.02]'
                    )}
                    style={{
                      left,
                      top,
                      width,
                      height
                    }}
                  >
                    <MovieBlock movie={movie} variant={variant as BlockVariant} />
                  </div>
                </DrawerClose>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

const GRID_COLS = 4;
const GRID_ROWS = 6;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

export default function GridContainer() {
  // 그리드 셀의 점유 상태 관리
  const [occupiedCells, setOccupiedCells] = useState<Set<number>>(new Set());

  // 로컬 스토리지에서 저장된 블록 불러오기 - 향후 확장할 경우를 대비
  useEffect(() => {
    try {
      const storedBlocks = localStorage.getItem('placedBlocks');
      if (storedBlocks) {
        const parsed = JSON.parse(storedBlocks);
        if (Array.isArray(parsed)) {
          const occupied = new Set(parsed.map((block) => block.position));
          setOccupiedCells(occupied);
        }
      }
    } catch (error) {
      console.error('그리드 데이터 로드 오류:', error);
    }
  }, []);

  // 각 그리드 셀을 드롭 가능한 영역으로 만듦
  const renderGridItems = () => {
    return Array.from({ length: TOTAL_CELLS }).map((_, index) => {
      const isOccupied = occupiedCells.has(index);

      const { setNodeRef, isOver } = useDroppable({
        id: `grid-cell-${index}`,
        data: { index, isOccupied }
      });

      return (
        <div
          ref={setNodeRef}
          key={`grid-item-${index}`}
          className={cn(
            'rounded-lg border-2 transition-all duration-200',
            isOver && !isOccupied
              ? 'scale-105 border-green-500 bg-green-50'
              : isOver && isOccupied
                ? 'scale-105 border-red-500 bg-red-50'
                : isOccupied
                  ? 'border-gray-400 bg-gray-100'
                  : 'border-theme-primary/20 bg-theme-background hover:bg-theme-accent/5',
            'min-h-[100px]'
          )}
        >
          <div className="text-sm text-theme-primary/80"></div>
        </div>
      );
    });
  };

  return (
    <div className={cn('grid h-full grid-cols-4 grid-rows-6 gap-2 p-4')}>{renderGridItems()}</div>
  );
}

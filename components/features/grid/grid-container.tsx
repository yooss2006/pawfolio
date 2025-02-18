import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

const GRID_COLS = 4;
const GRID_ROWS = 6;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

export default function GridContainer() {
  // 각 그리드 셀을 드롭 가능한 영역으로 만듦
  const renderGridItems = () => {
    return Array.from({ length: TOTAL_CELLS }).map((_, index) => {
      const { setNodeRef, isOver } = useDroppable({
        id: `grid-cell-${index}`,
        data: { index }
      });

      return (
        <div
          ref={setNodeRef}
          key={`grid-item-${index}`}
          className={cn(
            'rounded-lg border-2 transition-all duration-200',
            isOver
              ? 'scale-105 border-green-500 bg-green-50'
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

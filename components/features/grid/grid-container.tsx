import { cn } from '@/lib/utils';

const GRID_COLS = 3;
const GRID_ROWS = 5;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

export default function GridContainer() {
  const renderGridItems = () => {
    return Array.from({ length: TOTAL_CELLS }).map((_, index) => (
      <div
        key={index}
        className={cn(
          'flex items-center justify-center',
          'rounded-lg border border-theme-primary/20',
          'bg-theme-background transition-colors duration-200 hover:bg-theme-accent/5'
        )}
      >
        <p className="text-sm text-theme-primary/80">{index + 1} 칸</p>
      </div>
    ));
  };

  return (
    <div className={cn('grid h-full w-full grid-cols-3 grid-rows-5')}>{renderGridItems()}</div>
  );
}

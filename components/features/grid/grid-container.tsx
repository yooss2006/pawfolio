import { cn } from '@/lib/utils';

const GRID_COLS = 4;
const GRID_ROWS = 6;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

export default function GridContainer() {
  const renderGridItems = () => {
    return Array.from({ length: TOTAL_CELLS }).map((_, index) => (
      <div
        key={`grid-item-${index}`}
        className={cn(
          'rounded-lg border border-theme-primary/20 bg-theme-background',
          'transition-colors duration-200 hover:bg-theme-accent/5'
        )}
      >
        <div className="text-sm text-theme-primary/80"></div>
      </div>
    ));
  };

  return <div className={cn('grid h-full grid-cols-4 grid-rows-6')}>{renderGridItems()}</div>;
}

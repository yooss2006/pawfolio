'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import GridContainer from '@/components/features/grid/grid-container';
import CreateContentDrawer from '@/components/features/create-content/create-content-drawer';
import { TemporaryBlocksContainer } from '@/components/features/temporary-blocks/temporary-blocks-container';
import FloatButton from '@/components/features/float-button/float-button';
import { useState } from 'react';
import { MovieBlock } from '@/components/features/create-content/drawer-contents/movie-block';
import { cn } from '@/lib/utils';

export default function Home() {
  const [showBlocks, setShowBlocks] = useState(false);
  const [activeBlock, setActiveBlock] = useState<{
    movie: any;
    variant: any;
    dimensions?: {
      width: number;
      height: number;
    };
    isLargeScreen?: boolean;
  } | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { movie, variant, dimensions, isLargeScreen } = active.data.current || {};

    if (movie && variant) {
      setActiveBlock({ movie, variant, dimensions, isLargeScreen });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const gridCellIndex = parseInt(over.id.toString().split('-')[2]);
    const blockData = active.data.current;

    if (blockData) {
      console.log('Block dropped at index:', gridCellIndex, 'Block data:', blockData);
    }

    setActiveBlock(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="relative h-full">
        <GridContainer />
        <FloatButton onToggleBlocks={() => setShowBlocks((prev) => !prev)} />
        {showBlocks && <TemporaryBlocksContainer onClose={() => setShowBlocks(false)} />}
      </div>
      <DragOverlay>
        {activeBlock ? (
          <div
            style={
              activeBlock.dimensions
                ? {
                    width: activeBlock.dimensions.width,
                    height: activeBlock.dimensions.height
                  }
                : undefined
            }
          >
            <MovieBlock
              movie={activeBlock.movie}
              variant={activeBlock.variant}
              className={cn(
                'pointer-events-none',
                '[&_h3]:text-sm [&_img]:!relative [&_img]:!h-full [&_img]:!w-full [&_img]:!object-cover',
                activeBlock.isLargeScreen
                  ? '[&_p]:text-xs'
                  : '[&_h3]:!text-xs [&_p]:!line-clamp-1 [&_p]:!text-[10px]'
              )}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

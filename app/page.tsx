'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin
} from '@dnd-kit/core';
import GridContainer from '@/components/features/grid/grid-container';
import CreateContentDrawer from '@/components/features/create-content/create-content-drawer';
import { useState } from 'react';
import { MovieBlock } from '@/components/features/temporary-blocks/movie-block';
import { cn } from '@/lib/utils';
import { TemporaryBlocksScroll } from '@/components/features/temporary-blocks/temporary-blocks-scroll';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { movie, variant, dimensions, isLargeScreen } = active.data.current || {};

    if (movie && variant) {
      setActiveBlock({ movie, variant, dimensions, isLargeScreen });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveBlock(null);
      return;
    }

    // 드롭 위치가 그리드 셀인지 확인
    if (over.id.toString().includes('grid-cell')) {
      const gridCellIndex = parseInt(over.id.toString().split('-')[2]);
      const blockData = active.data.current;

      if (blockData) {
        console.log('Block dropped at index:', gridCellIndex, 'Block data:', blockData);

        // 성공적으로 배치되었다는 알림 표시
        toast({
          title: '블록 배치 완료',
          description: '그리드에 블록이 성공적으로 배치되었습니다.',
          variant: 'success',
          duration: 2000
        });
      }
    }

    setActiveBlock(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // 드래그 중인 항목이 닿는 모든 드롭 가능 영역을 감지
      collisionDetection={pointerWithin}
    >
      <div className="relative flex h-[100dvh] flex-col">
        {/* 그리드 영역 - 화면 크기에 따라 유동적으로 조절 */}
        <div className="min-h-0 flex-1">
          <GridContainer />
        </div>

        {/* 하단 블록 저장소 영역 - 고정 높이 */}
        <div className="shrink-0">
          <div className="relative mx-4 mb-4 overflow-hidden rounded-2xl border bg-white/95 p-4 shadow-xl backdrop-blur-sm">
            {/* 블록 스크롤 영역 - 높이 축소 및 overflow 설정 */}
            <div className="h-24 overflow-hidden sm:h-32">
              <TemporaryBlocksScroll />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer 버튼 위치 수정 - 더 위로 올리고 z-index 높임 */}
      <div className="-2 absolute bottom-2 right-2">
        <CreateContentDrawer
          onButtonClick={() => {}}
          className="h-12 w-12 rounded-full bg-gradient-to-br from-theme-primary to-theme-secondary shadow-lg transition-transform hover:scale-105"
        />
      </div>

      {/* 드래그 오버레이 - 드래그 중인 요소의 시각적 표현 */}
      <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
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
              dimensions={activeBlock.dimensions || { width: 200, height: 200 }}
              className={cn(
                'pointer-events-none shadow-xl',
                'scale-105 ring-2 ring-theme-primary',
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

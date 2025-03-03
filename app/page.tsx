'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  pointerWithin
} from '@dnd-kit/core';
import GridContainer from '@/components/features/grid/grid-container';
import CreateContentDrawer from '@/components/features/create-content/create-content-drawer';
import { useState, useEffect } from 'react';
import { MovieBlock } from '@/components/features/temporary-blocks/movie-block';
import { cn } from '@/lib/utils';
import { TemporaryBlocksScroll } from '@/components/features/temporary-blocks/temporary-blocks-scroll';
import { useToast } from '@/hooks/use-toast';
import { BLOCK_SIZES, BlockVariant } from '@/lib/constants/blocks';
import { GridMovieBlock } from '@/components/features/create-content/drawer-contents/grid-movie-block';
import { Movie } from '@/lib/types/movie';
import { useGridStore } from '@/lib/store/grid-store';

// 그리드 상수
const GRID_COLS = 4;
const GRID_ROWS = 6;

export default function Home() {
  const [showBlocks, setShowBlocks] = useState(false);
  const [activeBlock, setActiveBlock] = useState<{
    movie: Movie;
    variant: BlockVariant;
    dimensions?: {
      width: number;
      height: number;
    };
    isLargeScreen?: boolean;
    blockId?: string; // 임시 블록 저장소에서의 ID
    gridBlockId?: string; // 그리드 블록 ID
    position?: number; // 그리드 블록 위치
    isGridBlock?: boolean; // 그리드 블록인지 여부
  } | null>(null);
  const [isTemporaryStorageHovered, setIsTemporaryStorageHovered] = useState(false);
  const { toast } = useToast();
  
  // 그리드 스토어에서 필요한 함수 가져오기
  const addGridBlock = useGridStore((state) => state.addBlock);
  const removeGridBlock = useGridStore((state) => state.removeBlock);
  const arePositionsOccupied = useGridStore((state) => state.arePositionsOccupied);
  const placedBlocks = useGridStore((state) => state.placedBlocks);

  // 임시 블록 저장소에 블록 추가
  const addBlockToTemporaryStorage = (movie: Movie, variant: BlockVariant) => {
    try {
      // 로컬 스토리지에서 기존 블록 가져오기
      const storedBlocks = localStorage.getItem('blocks');
      let blocks = [];
      
      if (storedBlocks) {
        blocks = JSON.parse(storedBlocks);
        if (!Array.isArray(blocks)) {
          blocks = [];
        }
      }
      
      // 새 블록 생성
      const newBlock = {
        movie,
        blockSize: BLOCK_SIZES[variant],
        variant,
        createdAt: new Date().toISOString()
      };
      
      // 블록 추가
      blocks.push(newBlock);
      
      // 로컬 스토리지 업데이트
      localStorage.setItem('blocks', JSON.stringify(blocks));
      
      // 로컬 스토리지 변경 이벤트 발생시켜 TemporaryBlocksScroll 컴포넌트에 알림
      window.dispatchEvent(new Event('localStorageChange'));
    } catch (error) {
      console.error('임시 블록 추가 오류:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { 
      movie, 
      variant, 
      dimensions, 
      isLargeScreen, 
      blockId, 
      gridBlockId, 
      position,
      isGridBlock 
    } = active.data.current || {};

    if (movie && variant) {
      setActiveBlock({ 
        movie, 
        variant, 
        dimensions, 
        isLargeScreen, 
        blockId, 
        gridBlockId, 
        position,
        isGridBlock 
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !activeBlock) {
      setActiveBlock(null);
      return;
    }

    // 드롭 위치가 임시 블록 저장소인 경우
    if (over.id === 'temporary-blocks-container') {
      // 그리드 블록인 경우에만 처리
      if (activeBlock.isGridBlock && activeBlock.gridBlockId) {
        // 그리드에서 블록 제거
        removeGridBlock(activeBlock.gridBlockId);
        
        // 임시 블록 저장소에 블록 추가
        addBlockToTemporaryStorage(activeBlock.movie, activeBlock.variant);
        
        toast({
          title: '블록 이동 완료',
          description: '블록이 임시 저장소로 이동되었습니다.',
          variant: 'success',
          duration: 2000
        });
        
        setActiveBlock(null);
        return;
      }
    }

    // 드롭 위치가 그리드 셀인지 확인
    if (over.id.toString().includes('grid-cell')) {
      const gridCellIndex = parseInt(over.id.toString().split('-')[2]);
      const blockData = active.data.current;

      if (blockData && activeBlock) {
        // 블록 크기 가져오기
        const blockSize = BLOCK_SIZES[activeBlock.variant];
        const { cols, rows } = blockSize;
        
        // 블록이 배치될 모든 셀 위치 계산
        const baseRow = Math.floor(gridCellIndex / GRID_COLS);
        const baseCol = gridCellIndex % GRID_COLS;
        
        // 블록이 그리드 범위를 벗어나는지 확인
        if (baseCol + cols > GRID_COLS || baseRow + rows > GRID_ROWS) {
          toast({
            title: '블록 배치 실패',
            description: '블록이 그리드 범위를 벗어납니다.',
            variant: 'destructive',
            duration: 2000
          });
          setActiveBlock(null);
          return;
        }
        
        // 블록이 차지할 모든 셀 위치 계산
        const cellPositions: number[] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const cellIndex = (baseRow + r) * GRID_COLS + (baseCol + c);
            cellPositions.push(cellIndex);
          }
        }
        
        // 그리드 내 블록 이동인 경우, 자기 자신이 차지하던 위치는 제외
        let isOccupied = false;
        if (activeBlock.isGridBlock && activeBlock.gridBlockId) {
          // 현재 드래그 중인 블록 찾기
          const currentBlock = placedBlocks.find(block => block.id === activeBlock.gridBlockId);
          
          if (currentBlock) {
            // 현재 블록이 차지하는 위치 계산
            const currentPositions: number[] = [];
            const currentBaseRow = Math.floor(currentBlock.position / GRID_COLS);
            const currentBaseCol = currentBlock.position % GRID_COLS;
            const currentSize = BLOCK_SIZES[currentBlock.variant];
            
            for (let r = 0; r < currentSize.rows; r++) {
              for (let c = 0; c < currentSize.cols; c++) {
                const cellIndex = (currentBaseRow + r) * GRID_COLS + (currentBaseCol + c);
                currentPositions.push(cellIndex);
              }
            }
            
            // 자기 자신이 차지하던 위치를 제외한 나머지 위치가 점유되었는지 확인
            isOccupied = cellPositions.some(pos => 
              !currentPositions.includes(pos) && 
              placedBlocks.some(block => {
                const blockBaseRow = Math.floor(block.position / GRID_COLS);
                const blockBaseCol = block.position % GRID_COLS;
                const blockSize = BLOCK_SIZES[block.variant];
                
                for (let r = 0; r < blockSize.rows; r++) {
                  for (let c = 0; c < blockSize.cols; c++) {
                    const blockCellIndex = (blockBaseRow + r) * GRID_COLS + (blockBaseCol + c);
                    if (blockCellIndex === pos) return true;
                  }
                }
                
                return false;
              })
            );
          } else {
            isOccupied = arePositionsOccupied(cellPositions);
          }
        } else {
          // 임시 블록 저장소에서 드래그하는 경우
          isOccupied = arePositionsOccupied(cellPositions);
        }
        
        if (isOccupied) {
          toast({
            title: '블록 배치 실패',
            description: '이미 점유된 셀이 있습니다.',
            variant: 'destructive',
            duration: 2000
          });
          setActiveBlock(null);
          return;
        }
        
        // 그리드 내 블록 이동인 경우
        if (activeBlock.isGridBlock && activeBlock.gridBlockId) {
          // 기존 블록 제거
          removeGridBlock(activeBlock.gridBlockId);
          
          // 새 위치에 블록 추가
          addGridBlock({
            movie: activeBlock.movie,
            variant: activeBlock.variant,
            position: gridCellIndex,
            createdAt: new Date().toISOString()
          });
          
          toast({
            title: '블록 이동 완료',
            description: '그리드 내에서 블록이 성공적으로 이동되었습니다.',
            variant: 'success',
            duration: 2000
          });
        } else {
          // 임시 블록 저장소에서 드래그하는 경우
          // 그리드에 블록 추가
          addGridBlock({
            movie: activeBlock.movie,
            variant: activeBlock.variant,
            position: gridCellIndex,
            createdAt: new Date().toISOString()
          });
          
          // 임시 블록 저장소에서 블록 제거
          if (activeBlock.blockId) {
            removeBlockFromTemporaryStorage(activeBlock.blockId);
          }
          
          // 성공적으로 배치되었다는 알림 표시
          toast({
            title: '블록 배치 완료',
            description: '그리드에 블록이 성공적으로 배치되었습니다.',
            variant: 'success',
            duration: 2000
          });
        }
      }
    }

    setActiveBlock(null);
  };
  
  // 임시 블록 저장소에서 블록 제거
  const removeBlockFromTemporaryStorage = (blockId: string) => {
    try {
      const storedBlocks = localStorage.getItem('blocks');
      if (!storedBlocks) return;
      
      const parsedBlocks = JSON.parse(storedBlocks);
      if (!Array.isArray(parsedBlocks) || parsedBlocks.length === 0) return;
      
      // blockId로 블록 인덱스 찾기
      const blockIndex = parsedBlocks.findIndex((block, index) => 
        `draggable-block-${block.movie.id}-${index}` === blockId
      );
      
      if (blockIndex !== -1) {
        // 블록 제거
        parsedBlocks.splice(blockIndex, 1);
        
        // 로컬 스토리지 업데이트
        localStorage.setItem('blocks', JSON.stringify(parsedBlocks));
        
        // 로컬 스토리지 변경 이벤트 발생시켜 TemporaryBlocksScroll 컴포넌트에 알림
        window.dispatchEvent(new Event('localStorageChange'));
      }
    } catch (error) {
      console.error('임시 블록 제거 오류:', error);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    // 임시 블록 저장소 영역에 hover 상태인지 확인
    if (over && over.id === 'temporary-blocks-container' && activeBlock?.isGridBlock) {
      setIsTemporaryStorageHovered(true);
    } else {
      setIsTemporaryStorageHovered(false);
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      // 드래그 중인 항목이 닿는 모든 드롭 가능 영역을 감지
      collisionDetection={pointerWithin}
    >
      <div className="relative flex h-[100dvh] flex-col">
        {/* 그리드 영역 - 화면 크기에 따라 유동적으로 조절 */}
        <div className="min-h-0 flex-1">
          <GridContainer activeBlock={activeBlock} />
        </div>

        {/* 하단 블록 저장소 영역 - 고정 높이 */}
        <div className="shrink-0">
          <div 
            className={cn(
              "relative mx-4 mb-4 overflow-hidden rounded-2xl border bg-white/95 p-4 shadow-xl backdrop-blur-sm transition-all duration-200",
              activeBlock?.isGridBlock && isTemporaryStorageHovered && "ring-2 ring-green-500 bg-green-50/30"
            )}
          >
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
            className="pointer-events-none"
            style={
              activeBlock.dimensions
                ? {
                    // 블록 타입에 따른 원래 비율로 크기 조정
                    width: activeBlock.isGridBlock
                      ? activeBlock.dimensions.width * BLOCK_SIZES[activeBlock.variant].cols
                      : activeBlock.dimensions.width * BLOCK_SIZES[activeBlock.variant].cols * 0.75,
                    height: activeBlock.isGridBlock
                      ? activeBlock.dimensions.width * BLOCK_SIZES[activeBlock.variant].rows
                      : activeBlock.dimensions.width * BLOCK_SIZES[activeBlock.variant].rows * 0.75
                  }
                : undefined
            }
          >
            <GridMovieBlock
              movie={activeBlock.movie}
              variant={activeBlock.variant}
              className={cn(
                'pointer-events-none h-full w-full shadow-xl',
                'ring-2 ring-theme-primary',
                'aspect-auto' // 정사각형 비율을 강제로 해제하고 원래 비율 적용
              )}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

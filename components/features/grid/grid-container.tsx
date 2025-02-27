import { cn } from '@/lib/utils';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { useEffect, useState, useRef } from 'react';

const GRID_COLS = 4;
const GRID_ROWS = 6;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

// 화면 크기별 셀 크기 정의 - 데스크톱 크기 증가
const CELL_SIZES = {
  DEFAULT: 135, // 데스크톱 - 크기 증가
  TABLET: 90, // 태블릿
  MOBILE: 65 // 모바일
};

export default function GridContainer() {
  const [occupiedCells, setOccupiedCells] = useState<Set<number>>(new Set());
  const [cellSize, setCellSize] = useState(CELL_SIZES.DEFAULT);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // dnd-kit의 드래그 이벤트 모니터링
  useDndMonitor({
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setIsDragging(false),
    onDragCancel: () => setIsDragging(false)
  });

  // 화면 크기에 따른 셀 크기 및 컨테이너 높이 조정
  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const availableHeight = height - 150; // 하단 블록 저장소 및 여백 고려

      // 임시 블록 저장소 너비 계산 (mx-4 고려)
      const storageWidth = Math.min(width - 32, 600 - 32); // 최대 600px에서 좌우 마진 제외
      setContainerWidth(storageWidth);

      // 화면 높이도 고려하여 셀 크기 결정
      if (width < 360 || height < 600) {
        setCellSize(Math.min(CELL_SIZES.MOBILE, Math.floor(width / 6)));
      } else if (width < 500 || height < 700) {
        setCellSize(Math.min(CELL_SIZES.TABLET, Math.floor(width / 5)));
      } else {
        // 컨테이너 너비 기준으로 셀 크기 계산
        const containerBasedSize = Math.floor((storageWidth - 32) / GRID_COLS); // 32px는 패딩
        const heightBasedSize = Math.floor(availableHeight / (GRID_ROWS + 1));
        setCellSize(Math.min(containerBasedSize, heightBasedSize, CELL_SIZES.DEFAULT));
      }

      // 컨테이너 높이 계산
      setContainerHeight(availableHeight);
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  // 로컬 스토리지에서 저장된 블록 불러오기
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
            'aspect-square transition-all duration-200',
            // 드래그 중일 때만 기본 테두리 표시
            isDragging ? 'border border-gray-300 bg-white' : 'border-transparent bg-white',
            isOver && !isOccupied
              ? 'scale-105 border-2 border-green-500 bg-green-50'
              : isOver && isOccupied
                ? 'scale-105 border-2 border-red-500 bg-red-50'
                : isOccupied
                  ? isDragging
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-transparent bg-gray-50'
                  : isDragging
                    ? 'hover:border-gray-400 hover:bg-gray-50'
                    : 'hover:bg-gray-50'
          )}
          style={{
            width: cellSize,
            height: cellSize
          }}
        />
      );
    });
  };

  // 그리드 전체 너비 계산
  const gridHeight = GRID_ROWS * cellSize;

  // 패딩 감소 및 컨테이너 조정
  return (
    <div
      ref={containerRef}
      className="flex w-full items-center justify-center"
      style={{ height: `calc(100% - 20px)` }} // 하단 여백 고려
    >
      {/* 항상 표시되는 바깥쪽 테두리 - 임시 블록 저장소와 정확히 동일한 스타일과 너비 적용 */}
      <div
        className="mt-4 flex h-full items-center justify-center rounded-2xl border border-gray-300 bg-white/95 shadow-xl backdrop-blur-sm"
        style={{
          width: containerWidth > 0 ? containerWidth : 'auto',
          maxWidth: 'calc(100% - 32px)', // 좌우 마진 고려
          minHeight: containerHeight > 0 ? Math.min(gridHeight + 40, containerHeight - 40) : 'auto'
        }}
      >
        {/* 그리드 아이템을 가로, 세로 중앙에 배치 */}
        <div className="grid max-w-full grid-cols-4 place-items-center p-4">
          {renderGridItems()}
        </div>
      </div>
    </div>
  );
}

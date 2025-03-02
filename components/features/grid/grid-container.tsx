import { cn } from '@/lib/utils';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { useEffect, useState, useRef } from 'react';
import { BLOCK_SIZES, BlockVariant } from '@/lib/constants/blocks';

const GRID_COLS = 4;
const GRID_ROWS = 6;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

// 화면 크기별 셀 크기 정의 - 데스크톱 크기 증가
const CELL_SIZES = {
  DEFAULT: 135, // 데스크톱 - 크기 증가
  TABLET: 90, // 태블릿
  MOBILE: 65 // 모바일
};

interface GridContainerProps {
  activeBlock: {
    movie: any;
    variant: BlockVariant;
    dimensions?: {
      width: number;
      height: number;
    };
    isLargeScreen?: boolean;
  } | null;
}

export default function GridContainer({ activeBlock }: GridContainerProps) {
  const [occupiedCells, setOccupiedCells] = useState<Set<number>>(new Set());
  const [cellSize, setCellSize] = useState(CELL_SIZES.DEFAULT);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredCellIndex, setHoveredCellIndex] = useState<number | null>(null);

  // dnd-kit의 드래그 이벤트 모니터링
  useDndMonitor({
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => {
      setIsDragging(false);
      setHoveredCellIndex(null);
    },
    onDragCancel: () => {
      setIsDragging(false);
      setHoveredCellIndex(null);
    },
    onDragOver: (event) => {
      const { over } = event;
      if (over && over.id.toString().includes('grid-cell')) {
        const cellIndex = parseInt(over.id.toString().split('-')[2]);
        setHoveredCellIndex(cellIndex);
      }
    }
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

  // 블록 크기에 따라 하이라이트할 셀 인덱스 계산
  const getHighlightedCells = (baseIndex: number): { validCells: number[]; invalidCells: number[] } => {
    if (!activeBlock || hoveredCellIndex === null) return { validCells: [], invalidCells: [] };

    const blockSize = BLOCK_SIZES[activeBlock.variant];
    const { cols, rows } = blockSize;
    
    const validCells: number[] = [];
    const invalidCells: number[] = [];
    const baseRow = Math.floor(baseIndex / GRID_COLS);
    const baseCol = baseIndex % GRID_COLS;
    
    // 블록이 그리드 범위를 벗어나는지 확인
    const isOutOfBounds = baseCol + cols > GRID_COLS || baseRow + rows > GRID_ROWS;
    
    // 그리드 범위를 벗어나는 경우 모든 셀을 invalidCells에 추가
    if (isOutOfBounds) {
      // 블록이 차지하는 모든 셀 인덱스 계산 (그리드 내에 있는 셀만)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const currentRow = baseRow + r;
          const currentCol = baseCol + c;
          
          // 그리드 범위 내에 있는 셀만 처리
          if (currentRow < GRID_ROWS && currentCol < GRID_COLS) {
            const cellIndex = currentRow * GRID_COLS + currentCol;
            invalidCells.push(cellIndex);
          }
        }
      }
      return { validCells: [], invalidCells };
    }
    
    // 그리드 범위 내에 있는 경우 점유 여부에 따라 분류
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellIndex = (baseRow + r) * GRID_COLS + (baseCol + c);
        
        // 이미 점유된 셀인지 확인
        if (occupiedCells.has(cellIndex)) {
          invalidCells.push(cellIndex);
        } else {
          validCells.push(cellIndex);
        }
      }
    }
    
    // 점유된 셀이 하나라도 있으면 모든 셀을 invalidCells로 표시
    if (invalidCells.length > 0) {
      return { validCells: [], invalidCells: [...validCells, ...invalidCells] };
    }
    
    return { validCells, invalidCells };
  };

  // 각 그리드 셀을 드롭 가능한 영역으로 만듦
  const renderGridItems = () => {
    return Array.from({ length: TOTAL_CELLS }).map((_, index) => {
      const isOccupied = occupiedCells.has(index);
      const { validCells, invalidCells } = hoveredCellIndex !== null ? getHighlightedCells(hoveredCellIndex) : { validCells: [], invalidCells: [] };
      
      const isValid = validCells.includes(index);
      const isInvalid = invalidCells.includes(index);

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
            isValid
              ? 'scale-105 border-2 border-green-500 bg-green-50'
              : isInvalid
                ? 'scale-105 border-2 border-red-500 bg-red-50'
                : isOver && !isOccupied
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

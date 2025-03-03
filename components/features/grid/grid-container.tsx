import { cn } from '@/lib/utils';
import { useDroppable, useDndMonitor, useDraggable } from '@dnd-kit/core';
import { useEffect, useState, useRef } from 'react';
import { BLOCK_SIZES, BlockVariant } from '@/lib/constants/blocks';
import { useGridStore, loadGridBlocksFromStorage, GridBlock } from '@/lib/store/grid-store';
import { GridMovieBlock } from '@/components/features/create-content/drawer-contents/grid-movie-block';

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
    blockId?: string; // 임시 블록 저장소에서의 ID
    gridBlockId?: string; // 그리드 블록 ID
    position?: number; // 그리드 블록 위치
    isGridBlock?: boolean; // 그리드 블록인지 여부
  } | null;
}

// 드래그 가능한 그리드 블록 컴포넌트
interface DraggableGridBlockProps {
  block: GridBlock;
  cellSize: number;
  activeBlockId: string | undefined;
}

function DraggableGridBlock({ block, cellSize, activeBlockId }: DraggableGridBlockProps) {
  const { id, movie, variant, position } = block;
  const blockSize = BLOCK_SIZES[variant];
  const { cols, rows } = blockSize;
  
  // 블록 위치 계산
  const baseRow = Math.floor(position / GRID_COLS);
  const baseCol = position % GRID_COLS;
  
  // 블록 스타일 계산
  const blockStyle = {
    position: 'absolute' as const,
    top: baseRow * cellSize,
    left: baseCol * cellSize,
    width: cols * cellSize,
    height: rows * cellSize,
    zIndex: 1
  };
  
  // 현재 드래그 중인 블록인지 확인
  const isDraggingThisBlock = activeBlockId === id;
  
  // 드래그 중인 블록은 투명하게 표시 (원래 위치 표시용)
  const opacity = isDraggingThisBlock ? 0.3 : 1;
  
  // 드래그 가능한 블록 설정
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `grid-block-${id}`,
    data: {
      gridBlockId: id,
      movie,
      variant,
      position,
      isGridBlock: true, // 그리드 블록임을 표시
      dimensions: {
        width: cellSize,
        height: cellSize
      }
    }
  });
  
  // 드래그 중인 블록의 변환 스타일
  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999
  } : undefined;
  
  return (
    <div 
      key={id} 
      ref={setNodeRef}
      style={{
        ...blockStyle,
        ...dragStyle,
        opacity,
        cursor: 'grab'
      }} 
      className="pointer-events-auto"
      {...attributes}
      {...listeners}
    >
      <GridMovieBlock
        movie={movie}
        variant={variant}
        className="h-full w-full rounded-lg shadow-md"
      />
    </div>
  );
}

export default function GridContainer({ activeBlock }: GridContainerProps) {
  const placedBlocks = useGridStore((state) => state.placedBlocks);
  const [occupiedCells, setOccupiedCells] = useState<Set<number>>(new Set());
  const [cellSize, setCellSize] = useState(CELL_SIZES.DEFAULT);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredCellIndex, setHoveredCellIndex] = useState<number | null>(null);
  const [isHoveringTemporaryStorage, setIsHoveringTemporaryStorage] = useState(false);

  // dnd-kit의 드래그 이벤트 모니터링
  useDndMonitor({
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => {
      setIsDragging(false);
      setHoveredCellIndex(null);
      setIsHoveringTemporaryStorage(false);
    },
    onDragCancel: () => {
      setIsDragging(false);
      setHoveredCellIndex(null);
      setIsHoveringTemporaryStorage(false);
    },
    onDragOver: (event) => {
      const { over } = event;
      
      // 임시 블록 저장소 영역에 hover 상태인지 확인
      if (over && over.id === 'temporary-blocks-container') {
        setIsHoveringTemporaryStorage(true);
        setHoveredCellIndex(null);
        return;
      }
      
      setIsHoveringTemporaryStorage(false);
      
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
    // zustand 스토어에서 로컬 스토리지 데이터 로드
    loadGridBlocksFromStorage();
    
    // 점유된 셀 계산
    const calculateOccupiedCells = () => {
      const occupied = new Set<number>();
      
      placedBlocks.forEach(block => {
        const { position, variant } = block;
        const { cols, rows } = BLOCK_SIZES[variant];
        const baseRow = Math.floor(position / GRID_COLS);
        const baseCol = position % GRID_COLS;
        
        // 블록이 차지하는 모든 셀 추가
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const cellIndex = (baseRow + r) * GRID_COLS + (baseCol + c);
            occupied.add(cellIndex);
          }
        }
      });
      
      setOccupiedCells(occupied);
    };
    
    calculateOccupiedCells();
  }, [placedBlocks]);

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
    
    // 현재 드래그 중인 블록이 그리드 블록인 경우, 자기 자신이 차지하던 위치 계산
    const currentBlockPositions: number[] = [];
    if (activeBlock.isGridBlock && activeBlock.gridBlockId) {
      const currentBlock = placedBlocks.find(block => block.id === activeBlock.gridBlockId);
      
      if (currentBlock) {
        const currentBaseRow = Math.floor(currentBlock.position / GRID_COLS);
        const currentBaseCol = currentBlock.position % GRID_COLS;
        const currentSize = BLOCK_SIZES[currentBlock.variant];
        
        for (let r = 0; r < currentSize.rows; r++) {
          for (let c = 0; c < currentSize.cols; c++) {
            const cellIndex = (currentBaseRow + r) * GRID_COLS + (currentBaseCol + c);
            currentBlockPositions.push(cellIndex);
          }
        }
      }
    }
    
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
        
        // 자기 자신이 차지하던 위치는 점유된 것으로 간주하지 않음
        if (currentBlockPositions.includes(cellIndex)) {
          validCells.push(cellIndex);
        } else if (occupiedCells.has(cellIndex)) {
          // 이미 점유된 셀인지 확인
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
      
      // 임시 블록 저장소 영역에 hover 상태일 때는 하이라이트 비활성화
      const { validCells, invalidCells } = 
        (hoveredCellIndex !== null && !isHoveringTemporaryStorage) 
          ? getHighlightedCells(hoveredCellIndex) 
          : { validCells: [], invalidCells: [] };
      
      const isValid = validCells.includes(index);
      const isInvalid = invalidCells.includes(index);

      const { setNodeRef, isOver } = useDroppable({
        id: `grid-cell-${index}`,
        data: { index, isOccupied },
        disabled: isHoveringTemporaryStorage && activeBlock?.isGridBlock // 임시 저장소에 hover 중이면 그리드 셀 비활성화
      });

      return (
        <div
          ref={setNodeRef}
          key={`grid-item-${index}`}
          className={cn(
            'aspect-square transition-all duration-200',
            // 드래그 중일 때만 기본 테두리 표시
            isDragging && !isHoveringTemporaryStorage ? 'border border-gray-300 bg-white' : 'border-transparent bg-white',
            isValid
              ? 'scale-105 border-2 border-green-500 bg-green-50'
              : isInvalid
                ? 'scale-105 border-2 border-red-500 bg-red-50'
                : isOver && !isOccupied && !isHoveringTemporaryStorage
                  ? 'scale-105 border-2 border-green-500 bg-green-50'
                  : isOver && isOccupied && !isHoveringTemporaryStorage
                    ? 'scale-105 border-2 border-red-500 bg-red-50'
                    : isOccupied
                      ? isDragging && !isHoveringTemporaryStorage
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-transparent bg-gray-50'
                      : isDragging && !isHoveringTemporaryStorage
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

  // 배치된 블록 렌더링
  const renderPlacedBlocks = () => {
    return placedBlocks.map((block) => (
      <DraggableGridBlock 
        key={block.id}
        block={block}
        cellSize={cellSize}
        activeBlockId={activeBlock?.gridBlockId}
      />
    ));
  };

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
        <div className="relative grid max-w-full grid-cols-4 place-items-center p-4">
          {renderGridItems()}
          {renderPlacedBlocks()}
        </div>
      </div>
    </div>
  );
}

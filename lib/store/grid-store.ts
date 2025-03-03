import { create } from 'zustand';
import { Movie } from '@/lib/types/movie';
import { BlockVariant, BLOCK_SIZES } from '@/lib/constants/blocks';

// 그리드 상수
const GRID_COLS = 4;

// 그리드에 배치된 블록 타입 정의
export interface GridBlock {
  id: string; // 고유 ID
  movie: Movie;
  variant: BlockVariant;
  position: number; // 그리드 내 시작 위치 (인덱스)
  createdAt: string;
}

// 그리드 스토어 상태 타입 정의
interface GridState {
  // 그리드에 배치된 블록 목록
  placedBlocks: GridBlock[];
  
  // 블록 추가 액션
  addBlock: (block: Omit<GridBlock, 'id'>) => void;
  
  // 블록 제거 액션
  removeBlock: (id: string) => void;
  
  // 특정 위치의 블록 가져오기
  getBlockAtPosition: (position: number) => GridBlock | undefined;
  
  // 특정 위치들이 점유되었는지 확인
  arePositionsOccupied: (positions: number[]) => boolean;
}

// zustand 스토어 생성
export const useGridStore = create<GridState>((set, get) => ({
  placedBlocks: [],
  
  // 블록 추가 액션
  addBlock: (block) => {
    const id = `grid-block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newBlock = { ...block, id };
    
    set((state) => {
      const updatedBlocks = [...state.placedBlocks, newBlock];
      
      // 로컬 스토리지에 저장
      try {
        localStorage.setItem('placedBlocks', JSON.stringify(updatedBlocks));
      } catch (error) {
        console.error('그리드 블록 저장 오류:', error);
      }
      
      return { placedBlocks: updatedBlocks };
    });
  },
  
  // 블록 제거 액션
  removeBlock: (id) => {
    set((state) => {
      const updatedBlocks = state.placedBlocks.filter((block) => block.id !== id);
      
      // 로컬 스토리지 업데이트
      try {
        localStorage.setItem('placedBlocks', JSON.stringify(updatedBlocks));
      } catch (error) {
        console.error('그리드 블록 저장 오류:', error);
      }
      
      return { placedBlocks: updatedBlocks };
    });
  },
  
  // 특정 위치의 블록 가져오기
  getBlockAtPosition: (position) => {
    return get().placedBlocks.find((block) => block.position === position);
  },
  
  // 특정 위치들이 점유되었는지 확인
  arePositionsOccupied: (positions) => {
    const { placedBlocks } = get();
    
    // 각 배치된 블록이 차지하는 모든 셀 위치 계산
    const occupiedPositions = new Set<number>();
    
    placedBlocks.forEach(block => {
      const { position, variant } = block;
      const { cols, rows } = BLOCK_SIZES[variant];
      const baseRow = Math.floor(position / GRID_COLS);
      const baseCol = position % GRID_COLS;
      
      // 블록이 차지하는 모든 셀 추가
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cellIndex = (baseRow + r) * GRID_COLS + (baseCol + c);
          occupiedPositions.add(cellIndex);
        }
      }
    });
    
    // 요청된 위치 중 하나라도 점유되었는지 확인
    return positions.some(position => occupiedPositions.has(position));
  }
}));

// 로컬 스토리지에서 그리드 블록 로드하는 함수
export const loadGridBlocksFromStorage = () => {
  try {
    const storedBlocks = localStorage.getItem('placedBlocks');
    if (storedBlocks) {
      const parsedBlocks = JSON.parse(storedBlocks);
      if (Array.isArray(parsedBlocks)) {
        // 현재 상태와 비교하여 변경된 경우에만 업데이트
        const currentBlocks = useGridStore.getState().placedBlocks;
        
        // 블록 배열이 다른 경우에만 상태 업데이트
        if (JSON.stringify(currentBlocks) !== JSON.stringify(parsedBlocks)) {
          useGridStore.setState({ placedBlocks: parsedBlocks });
        }
      }
    }
  } catch (error) {
    console.error('그리드 블록 로드 오류:', error);
  }
}; 
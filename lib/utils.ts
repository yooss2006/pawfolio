import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 그리드 관련 유틸리티 함수 추가
export const calculateGridPosition = (index: number, cols: number) => {
  const row = Math.floor(index / cols);
  const col = index % cols;
  return { row, col };
};

export const isValidGridPosition = (row: number, col: number, maxRows: number, maxCols: number) => {
  return row >= 0 && row < maxRows && col >= 0 && col < maxCols;
};

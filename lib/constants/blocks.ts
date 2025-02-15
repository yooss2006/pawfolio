export const BLOCK_SIZES = {
  tiny: { cols: 1, rows: 1 }, // 1x1 블록
  tall: { cols: 1, rows: 3 }, // 1x3 블록
  medium: { cols: 2, rows: 3 }, // 2x3 블록
  wide: { cols: 3, rows: 1 }, // 3x1 블록
  large: { cols: 3, rows: 2 } // 3x2 블록
} as const;

export type BlockVariant = keyof typeof BLOCK_SIZES;

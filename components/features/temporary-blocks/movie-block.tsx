import { Movie } from '@/lib/types/movie';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useDraggable } from '@dnd-kit/core';
import { BlockVariant } from '@/lib/constants/blocks';
import { BLOCK_SIZES } from '@/lib/constants/blocks';
import { CSSProperties } from 'react';
import { GridMovieBlock } from '@/components/features/create-content/drawer-contents/grid-movie-block';

interface MovieBlockProps {
  movie: Movie;
  variant: BlockVariant;
  isDraggable?: boolean;
  id?: string;
  dimensions: {
    width: number;
    height: number;
  };
  className?: string;
}

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export function MovieBlock({
  movie,
  variant,
  isDraggable = false,
  id,
  dimensions,
  className
}: MovieBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id || `movie-${movie.id}`,
    data: {
      movie,
      variant,
      dimensions,
      isLargeScreen: typeof window !== 'undefined' ? window.innerWidth > 600 : true,
      blockId: id
    },
    disabled: !isDraggable
  });

  const style = transform
    ? ({
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        opacity: 0,
        transition: 'opacity 0.2s ease',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      } as CSSProperties)
    : undefined;

  const imageUrl = `${TMDB_IMAGE_URL}${movie.poster_path}`;

  // 블록 형태 설정
  const blockSizeConfig = BLOCK_SIZES[variant];

  // 미리보기 박스 크기 계산 (전체 크기의 18% - 약간 감소)
  const previewBoxSize = Math.floor(dimensions.width * 0.18);
  const previewMaxSize = previewBoxSize * 0.7;
  const previewCellSize = Math.min(
    previewMaxSize / Math.max(blockSizeConfig.cols, blockSizeConfig.rows),
    previewMaxSize / 3 // 최대 3칸으로 제한
  );

  // 예상 높이 계산하여 폰트 크기 및 여백 조절
  const isSmallHeight = dimensions.height < 110;

  // 블록의 실제 종횡비 계산
  const aspectRatio = blockSizeConfig.cols / blockSizeConfig.rows;

  // 드래그 시 원래 블록 크기 비율 적용을 위한 치수 계산 (0.75배 축소)
  const dragWidth = isDragging ? dimensions.width * blockSizeConfig.cols * 0.75 : dimensions.width;
  const dragHeight = isDragging
    ? dimensions.width * blockSizeConfig.rows * 0.75
    : dimensions.height;

  // 블록 내용 - 드래그 중일 때와 아닐 때 다르게 표시
  const blockContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg bg-white shadow-md',
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        // 드래그 중이 아닐 때만 정사각형 비율 적용
        !isDragging && 'aspect-square',
        isDragging ? 'shadow-lg ring-2 ring-theme-primary/50' : '',
        className
      )}
      style={{
        width: isDragging ? dragWidth : dimensions.width,
        height: isDragging ? dragHeight : dimensions.height,
        minWidth: isDragging ? dragWidth : dimensions.width,
        minHeight: isDragging ? dragHeight : dimensions.height,
        // 드래그 중일 때 원래 블록 비율 적용
        ...(isDraggable && style)
      }}
    >
      {isDragging ? (
        // 드래그 중일 때는 GridMovieBlock 형태로 표시
        <div className="h-full w-full">
          <GridMovieBlock movie={movie} variant={variant} className="h-full w-full" />
        </div>
      ) : (
        // 드래그 중이 아닐 때는 기존 정사각형 형태 유지
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes={`(max-width: 400px) ${dimensions.width}px, (max-width: 768px) ${dimensions.width}px, ${dimensions.width}px`}
          />

          {/* 좌측 하단 제목 - 작은 화면에서 패딩 줄임 */}
          <div
            className={cn(
              'absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent',
              isSmallHeight ? 'px-1.5 pb-1 pt-6' : 'px-2 pb-1.5 pt-8 md:px-3'
            )}
          >
            <h3
              className={cn(
                'line-clamp-2 font-bold text-white',
                isSmallHeight ? 'text-[8px] leading-tight' : 'text-xs leading-snug md:text-sm'
              )}
            >
              {movie.title}
            </h3>
          </div>

          {/* 우측 상단 블록 형태 표시 */}
          <div
            className={cn(
              'absolute flex items-center justify-center rounded-lg bg-black/80 p-0.5',
              isSmallHeight ? 'right-1 top-1' : 'right-2 top-2 p-1 md:right-3 md:top-3'
            )}
            style={{ width: previewBoxSize, height: previewBoxSize }}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="grid gap-[1px]"
                style={{
                  gridTemplateColumns: `repeat(${blockSizeConfig.cols}, ${previewCellSize}px)`,
                  gridTemplateRows: `repeat(${blockSizeConfig.rows}, ${previewCellSize}px)`
                }}
              >
                {Array.from({ length: blockSizeConfig.cols * blockSizeConfig.rows }).map((_, i) => (
                  <div
                    key={`preview-cell-${i}`}
                    className="border border-gray-400 bg-white"
                    style={{
                      width: previewCellSize,
                      height: previewCellSize
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isDraggable) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={cn(
          'relative touch-none',
          isDragging && ['z-[9999]', 'pointer-events-none'],
          !isDragging && 'pointer-events-auto'
        )}
      >
        {blockContent}
      </div>
    );
  }

  return blockContent;
}

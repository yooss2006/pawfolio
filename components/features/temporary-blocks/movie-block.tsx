import { Movie } from '@/lib/types/movie';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useDraggable } from '@dnd-kit/core';
import { BlockVariant } from '@/lib/constants/blocks';
import { BLOCK_SIZES } from '@/lib/constants/blocks';
import { CSSProperties } from 'react';

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
      isLargeScreen: typeof window !== 'undefined' ? window.innerWidth > 600 : true
    },
    disabled: !isDraggable
  });

  const style = transform
    ? ({
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        opacity: isDragging ? 0.3 : 1,
        transition: 'opacity 0.2s ease',
        position: 'relative' as const
      } as CSSProperties)
    : undefined;

  const imageUrl = `${TMDB_IMAGE_URL}${movie.poster_path}`;

  // 미리보기 박스 크기 계산 (전체 크기의 18% - 약간 감소)
  const previewBoxSize = Math.floor(dimensions.width * 0.18);

  // 블록 형태 미리보기를 위한 계산
  const blockSizeConfig = BLOCK_SIZES[variant];
  const previewMaxSize = previewBoxSize * 0.7;
  const previewCellSize = Math.min(
    previewMaxSize / Math.max(blockSizeConfig.cols, blockSizeConfig.rows),
    previewMaxSize / 3 // 최대 3칸으로 제한
  );

  // 예상 높이 계산하여 폰트 크기 및 여백 조절
  const isSmallHeight = dimensions.height < 110;

  const blockContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg bg-white shadow-md',
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        'aspect-square',
        isDragging ? 'shadow-lg ring-2 ring-theme-primary/50' : '',
        className
      )}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        minWidth: dimensions.width,
        minHeight: dimensions.height,
        ...(isDraggable && style)
      }}
    >
      {/* 영화 포스터 이미지 */}
      <div className="relative h-full w-full">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          className={cn('object-cover', isDragging ? 'brightness-90' : '')}
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

        {/* 우측 상단 블록 형태 표시 - 크기 및 위치 조정 */}
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

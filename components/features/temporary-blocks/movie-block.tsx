import { Movie } from '@/lib/types/movie';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useDraggable } from '@dnd-kit/core';
import { BlockVariant } from '@/lib/constants/blocks';
import { DraggableBlock } from './draggable-block';

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
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        opacity: isDragging ? 0 : 1
      }
    : undefined;

  const imageUrl = `${TMDB_IMAGE_URL}${movie.poster_path}`;

  const renderContent = () => {
    switch (variant) {
      case 'tiny': // 1x1
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        );

      case 'tall': // 1x3
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
        );

      case 'medium': // 2x3
        return (
          <div className="flex h-full w-full flex-col overflow-hidden rounded-lg">
            <div className="relative h-[70%] w-full">
              <Image
                src={imageUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex h-[30%] flex-col justify-center bg-white p-2">
              <h3 className="line-clamp-1 font-bold text-theme-primary">{movie.title}</h3>
              <p className="line-clamp-1 text-gray-600">{movie.overview}</p>
            </div>
          </div>
        );

      case 'wide': // 3x1
        return (
          <div className="flex h-full w-full overflow-hidden rounded-lg bg-white">
            <div className="relative h-full w-[33%]">
              <Image
                src={imageUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
            </div>
            <div className="flex w-[67%] items-center justify-center p-2">
              <h3 className="line-clamp-1 font-bold text-theme-primary">{movie.title}</h3>
            </div>
          </div>
        );

      case 'large': // 3x2
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 75vw"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2">
              <h3 className="line-clamp-1 font-bold text-white">{movie.title}</h3>
              <p className="line-clamp-1 text-gray-200">{movie.overview}</p>
            </div>
          </div>
        );
    }
  };

  const blockContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg bg-white shadow-md',
        'transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg',
        className
      )}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        minWidth: dimensions.width,
        minHeight: dimensions.height
      }}
    >
      {renderContent()}
    </div>
  );

  if (isDraggable) {
    return (
      <DraggableBlock
        id={id!}
        data={{
          movie,
          variant,
          dimensions
        }}
      >
        {blockContent}
      </DraggableBlock>
    );
  }

  return blockContent;
}

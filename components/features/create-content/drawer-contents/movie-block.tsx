import { Movie } from '@/lib/types/movie';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MovieBlockProps {
  movie: Movie;
  variant: 'tiny' | 'tall' | 'medium' | 'wide' | 'large';
  className?: string;
}

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export function MovieBlock({ movie, variant, className }: MovieBlockProps) {
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
              className="object-cover object-[center_30%]"
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
              className="object-cover object-[center_20%]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        );

      case 'medium': // 2x3
        return (
          <div className="flex h-full w-full flex-col overflow-hidden rounded-lg">
            <div className="relative h-2/3 w-full">
              <Image
                src={imageUrl}
                alt={movie.title}
                fill
                className="object-cover object-[center_25%]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center bg-white p-4">
              <h3 className="text-base font-bold text-theme-primary sm:text-lg">{movie.title}</h3>
              <p className="line-clamp-2 text-xs text-gray-600 sm:text-sm">{movie.overview}</p>
            </div>
          </div>
        );

      case 'wide': // 3x1
        return (
          <div className="flex h-full w-full overflow-hidden rounded-lg bg-white">
            <div className="relative h-full w-1/3">
              <Image
                src={imageUrl}
                alt={movie.title}
                fill
                className="object-cover object-[center_35%]"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
            </div>
            <div className="flex flex-1 items-center justify-center p-4">
              <h3 className="text-base font-bold text-theme-primary sm:text-xl">{movie.title}</h3>
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
              className="object-cover object-[center_30%]"
              sizes="(max-width: 768px) 100vw, 75vw"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-base font-bold text-white sm:text-xl">{movie.title}</h3>
              <p className="line-clamp-2 text-xs text-gray-200 sm:text-sm">{movie.overview}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn('h-full w-full p-2', className)}>
      <div
        className={cn(
          'h-full w-full shadow-lg transition-all',
          'hover:shadow-xl hover:shadow-theme-primary/10'
        )}
      >
        {renderContent()}
      </div>
    </div>
  );
}

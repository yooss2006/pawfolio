'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Film, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie } from '@/lib/types/movie';
import Image from 'next/image';

interface MovieResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

interface MovieSearchProps {
  onMovieSelect: (movie: Movie) => void;
  searchState: {
    query: string;
    setQuery: (query: string) => void;
    movies: Movie[];
    setMovies: (movies: Movie[]) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    setTotalPages: (pages: number) => void;
    hasSearched: boolean;
    setHasSearched: (searched: boolean) => void;
  };
}

/**
 * 1. 큰 덩어리를 세분화하여 관심사(역할)를 분리했습니다.
 *    - SearchForm: 검색 폼 (query 상태, submit)
 *    - MovieList: 영화 리스트와 관련된 렌더링
 *    - Pagination: 페이지네이션 UI
 *
 * 2. poster_path가 없는 경우와 있는 경우를 하나의 MoviePoster 컴포넌트로
 *    통일하여 코드 중복을 줄였습니다.
 *
 * 3. 스크롤바 디자인을 개선하기 위해 Tailwind 스크롤바 유틸리티 클래스를 추가했습니다.
 *    (scrollbar-track-rounded, scrollbar-thumb-rounded 등)
 */

export function MovieSearch({ onMovieSelect, searchState }: MovieSearchProps) {
  const {
    query,
    setQuery,
    movies,
    setMovies,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    hasSearched,
    setHasSearched
  } = searchState;

  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleSearch: API 호출로 영화 검색을 수행합니다.
   *               - query가 비어있다면 검색하지 않도록 예외처리.
   *               - currentPage(state)와 page(함수 파라미터) 동기화.
   */
  const handleSearch = async (e: React.FormEvent, page = 1) => {
    e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setCurrentPage(page);

    try {
      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`
      );
      const data: MovieResponse = await response.json();

      setMovies(data.results);
      setTotalPages(data.total_pages);
      setHasSearched(true);
    } catch (error) {
      console.error('영화 검색 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handlePageChange: 페이지 버튼 클릭 시 handleSearch를 재호출하여 새로운 페이지 로드
   */
  const handlePageChange = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    handleSearch(e, page);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      {/* 검색 폼 */}
      <SearchForm query={query} setQuery={setQuery} isLoading={isLoading} onSearch={handleSearch} />

      {/* 로딩 상태 */}
      {isLoading && <LoadingState />}

      {/* 검색 결과가 없을 경우 */}
      {!isLoading && hasSearched && movies.length === 0 && <NoResults />}

      {/* 검색 결과 리스트 */}
      {!isLoading && movies.length > 0 && (
        <>
          <MovieList movies={movies} onMovieSelect={onMovieSelect} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

/**
 * SearchForm: 검색 입력창 + 검색 버튼
 */
function SearchForm({
  query,
  setQuery,
  isLoading,
  onSearch
}: {
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
  onSearch: (e: React.FormEvent, page?: number) => void;
}) {
  return (
    <form onSubmit={onSearch} className="flex shrink-0 gap-2">
      <Input
        type="text"
        placeholder="영화 제목을 입력하세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        검색
      </Button>
    </form>
  );
}

/**
 * MovieList: 영화 목록 UI
 *  - poster_path 여부에 따라 Poster를 다르게 렌더링
 *  - 스크롤바를 좀 더 세련되게 보이도록 Tailwind 스크롤바 관련 클래스를 적용
 */
function MovieList({
  movies,
  onMovieSelect
}: {
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
}) {
  return (
    <div
      className={cn(
        'flex-1 space-y-4 overflow-y-auto rounded-lg pr-2',
        'scrollbar scrollbar-thin scrollbar-track-transparent scrollbar-thumb-theme-primary/20',
        'hover:scrollbar-thumb-gray-400 scrollbar-track-rounded scrollbar-thumb-rounded'
      )}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={() => onMovieSelect(movie)} />
      ))}
    </div>
  );
}

/**
 * MovieCard: 단일 영화 카드
 *  - 포스터가 있으면 이미지, 없으면 placeholder 렌더링
 */
function MovieCard({ movie, onClick }: { movie: Movie; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex cursor-pointer gap-4 rounded-lg border p-4',
        'bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300',
        'hover:border-theme-primary/50 hover:shadow-md hover:shadow-theme-primary/5'
      )}
    >
      <MoviePoster posterPath={movie.poster_path} title={movie.title} />
      <div className="flex flex-col gap-2">
        <h3 className="font-bold group-hover:text-theme-primary">{movie.title}</h3>
        <p className="text-sm text-gray-500">{movie.release_date}</p>
        <p className="line-clamp-3 text-sm">{movie.overview}</p>
      </div>
    </div>
  );
}

/**
 * MoviePoster:
 *  - 실제 포스터 이미지(있을 경우)
 *  - 혹은 placeholder 아이콘(없을 경우)
 *  - 동일한 크기를 유지하도록 h-[138px], w-[92px], object-cover 통일
 */
function MoviePoster({ posterPath, title }: { posterPath: string | null; title: string }) {
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w92';

  if (posterPath) {
    return (
      <div className="relative aspect-[2/3] h-[138px] w-auto shrink-0 overflow-hidden">
        <Image
          src={`${IMAGE_BASE_URL}${posterPath}`}
          alt={title}
          fill
          className="rounded-md object-cover"
          sizes="92px"
          priority
        />
      </div>
    );
  }

  // 포스터가 없을 경우 동일한 크기의 영역을 잡아주되, 아이콘만 가운데 표시
  return (
    <div className="flex aspect-[2/3] h-[138px] w-auto shrink-0 items-center justify-center rounded-md border bg-gray-100">
      <Film className="h-8 w-8 text-gray-500" />
    </div>
  );
}

/**
 * Pagination: 이전/다음 버튼, 현재/전체 페이지 표시
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (e: React.MouseEvent, page: number) => void;
}) {
  return (
    <div className="mt-2 flex shrink-0 items-center justify-center gap-2 py-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => onPageChange(e, currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="size-4" />
        이전
      </Button>
      <span className="mx-2 text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => onPageChange(e, currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

/**
 * LoadingState: 로딩 중일 때 표시
 */
function LoadingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2 className="size-12 animate-spin text-theme-primary" />
      <p className="text-theme-primary">영화를 검색하고 있어요...</p>
    </div>
  );
}

/**
 * NoResults: 검색 결과가 없을 때 표시
 */
function NoResults() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Film className="size-12 text-theme-primary" />
      <div className="text-center">
        <p className="font-medium">앗! 검색 결과가 없어요</p>
        <p className="text-sm">다른 키워드로 검색해보시는 건 어떨까요?</p>
      </div>
    </div>
  );
}

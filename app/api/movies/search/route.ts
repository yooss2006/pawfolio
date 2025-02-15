import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const page = searchParams.get('page') || '1';

  if (!query) {
    return NextResponse.json({ error: '검색어를 입력해주세요' }, { status: 400 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=ko-KR&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('영화 검색 중 오류:', error);
    return NextResponse.json({ error: '영화 검색 중 오류가 발생했습니다' }, { status: 500 });
  }
}

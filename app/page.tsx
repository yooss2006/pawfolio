import GridContainer from '@/components/features/grid/grid-container';
import FloatButton from '@/components/features/float-button/float-button';

export default function Home() {
  return (
    <div className="relative h-full">
      <GridContainer />
      <FloatButton aria-label="콘텐츠 추가" />
    </div>
  );
}

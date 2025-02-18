import GridContainer from '@/components/features/grid/grid-container';
import CreateContentDrawer from '@/components/features/create-content/create-content-drawer';
import { TemporaryBlocksContainer } from '@/components/features/temporary-blocks/temporary-blocks-container';
import FloatButton from '@/components/features/float-button/float-button';

export default function Home() {
  return (
    <div className="relative h-full">
      <GridContainer />
      <FloatButton />
      <TemporaryBlocksContainer />
    </div>
  );
}

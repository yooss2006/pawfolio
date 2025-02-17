import GridContainer from '@/components/features/grid/grid-container';
import CreateContentDrawer from '@/components/features/create-content/create-content-drawer';
import { TemporaryBlocksContainer } from '@/components/features/temporary-blocks/temporary-blocks-container';

export default function Home() {
  return (
    <div className="relative h-full">
      <GridContainer />
      <CreateContentDrawer />
      <TemporaryBlocksContainer />
    </div>
  );
}

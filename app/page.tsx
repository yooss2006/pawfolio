import GridContainer from '@/components/features/grid/grid-container';
import CreateContentDrawer from '@/components/features/create-content/create-content-drawer';

export default function Home() {
  return (
    <div className="relative h-full">
      <GridContainer />
      <CreateContentDrawer />
    </div>
  );
}

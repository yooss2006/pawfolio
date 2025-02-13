import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import FloatButton from '../float-button/float-button';
import { DrawerContentContainer } from './drawer-contents/drawer-content-container';

export default function CreateContentDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <FloatButton />
      </DrawerTrigger>

      <DrawerContent className="mx-auto h-[80vh] max-w-[600px]">
        <DrawerContentContainer />
      </DrawerContent>
    </Drawer>
  );
}

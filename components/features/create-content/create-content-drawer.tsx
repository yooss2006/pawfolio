import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { PackagePlus } from 'lucide-react';
import { DrawerContentContainer } from './drawer-contents/drawer-content-container';

interface CreateContentDrawerProps {
  onButtonClick?: () => void;
  className?: string;
}

export default function CreateContentDrawer({
  onButtonClick,
  className
}: CreateContentDrawerProps) {
  return (
    <Drawer
      onOpenChange={(open) => {
        if (!open) {
          onButtonClick?.();
        }
      }}
    >
      <DrawerTrigger asChild>
        <Button className={className}>
          <PackagePlus className="size-6 text-white" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto h-[80vh] max-w-[600px]">
        <DrawerContentContainer />
      </DrawerContent>
    </Drawer>
  );
}

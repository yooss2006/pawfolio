import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { PackagePlus } from 'lucide-react';
import { DrawerContentContainer } from './drawer-contents/drawer-content-container';
import { cn } from '@/lib/utils';

interface CreateContentDrawerProps {
  onButtonClick?: () => void;
}

export default function CreateContentDrawer({ onButtonClick }: CreateContentDrawerProps) {
  return (
    <Drawer
      onOpenChange={(open) => {
        if (!open) {
          onButtonClick?.();
        }
      }}
    >
      <DrawerTrigger asChild>
        <Button
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full',
            'bg-white/90 shadow-lg backdrop-blur-sm',
            'border border-theme-primary/10',
            'hover:border-theme-primary/20 hover:bg-theme-primary/5',
            'transform transition-all duration-300 hover:scale-105'
          )}
        >
          <PackagePlus className="!size-6 text-theme-primary" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto h-[80vh] max-w-[600px]">
        <DrawerContentContainer />
      </DrawerContent>
    </Drawer>
  );
}

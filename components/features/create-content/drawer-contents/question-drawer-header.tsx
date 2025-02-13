import { Button } from '@/components/ui/button';
import { DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { ArrowLeft } from 'lucide-react';

type QuestionDrawerHeaderProps = {
  title: string;
  description?: string;
  onBack?: () => void;
};

export function QuestionDrawerHeader({ title, description, onBack }: QuestionDrawerHeaderProps) {
  return (
    <DrawerHeader className="relative p-4 md:text-center">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-5 top-[50%] h-8 w-8 -translate-y-1/2"
        >
          <ArrowLeft className="size-4" />
        </Button>
      )}
      <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
      {description && <DrawerDescription>{description}</DrawerDescription>}
    </DrawerHeader>
  );
}

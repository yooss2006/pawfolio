'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription
} from '@/components/ui/drawer';
import FloatButton from '../float-button/float-button';

export default function CreateContentDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <FloatButton />
      </DrawerTrigger>
      <DrawerContent className="mx-auto h-[80vh] max-w-[600px]">
        <DrawerHeader className="p-4 md:text-center">
          <DrawerTitle className="text-xl font-bold">게시하고 싶은 내용은 무엇인가요?</DrawerTitle>
          <DrawerDescription>답하고 싶은 질문을 선택하세요.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

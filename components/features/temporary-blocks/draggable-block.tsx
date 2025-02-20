'use client';

import { useDraggable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface DraggableBlockProps {
  id: string;
  data: any;
  children: ReactNode;
}

export function DraggableBlock({ id, data, children }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

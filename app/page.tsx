'use client';

import GridContainer from '@/components/features/grid/grid-container';
import CreateContentDrawer from '@/components/features/create-content/create-content-drawer';
import { TemporaryBlocksContainer } from '@/components/features/temporary-blocks/temporary-blocks-container';
import FloatButton from '@/components/features/float-button/float-button';
import { useState } from 'react';

export default function Home() {
  const [showBlocks, setShowBlocks] = useState(false);

  return (
    <div className="relative h-full">
      <GridContainer />
      <FloatButton onToggleBlocks={() => setShowBlocks((prev) => !prev)} />
      {showBlocks && <TemporaryBlocksContainer onClose={() => setShowBlocks(false)} />}
    </div>
  );
}

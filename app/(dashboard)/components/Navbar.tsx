'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/ModeToggle';

const Navbar = () => {
  return (
    <header className={cn(
      "flex items-center justify-between px-4 py-3 shadow-md",
      "bg-background",
      "text-foreground",
      "border-b border-border"
    )}>
      <div className="flex items-center space-x-4">
        {/* Your logo or other left-aligned content */}
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <ModeToggle />
        {/* Other navigation items */}
      </div>
    </header>
  );
};

export default Navbar;
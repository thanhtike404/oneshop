'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Users', href: '/dashboard/users' },
  { name: 'Products', href: '/dashboard/product' },
  { name: 'Settings', href: '/dashboard/settings' },
];

function Sidebar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible && (
        <aside className="w-64 bg-gray-900 text-white p-4 space-y-6">
          <h1 className="text-2xl font-bold">Admin</h1>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded hover:bg-gray-700 transition',
                  pathname === item.href && 'bg-gray-700'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
}

export default Sidebar;

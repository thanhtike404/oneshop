'use client';

import React from 'react';
import Link from 'next/link';
import SidebarToggle from './SidebarToggle';
import { ModeToggle } from '@/components/ModeToggle';

const Navbar = () => {
  return (
    <header className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-4 py-3 shadow-md">
      <div className="flex items-center space-x-4">
        <SidebarToggle />
        <span className="text-xl font-bold">Admin Panel</span>
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <ModeToggle />
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/dashboard/product" className="hover:underline">Products</Link>
        <Link href="/dashboard/users" className="hover:underline">Users</Link>
        <Link href="/dashboard/settings" className="hover:underline">Settings</Link>
      </div>
    </header>
  );
};

export default Navbar;

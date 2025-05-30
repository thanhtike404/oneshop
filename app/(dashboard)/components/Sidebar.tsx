'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FiMenu, FiX, FiHome, FiShoppingBag, FiUsers, FiSettings, FiPieChart, FiTag } from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
  { name: 'Products', href: '/dashboard/product', icon: <FiShoppingBag className="w-5 h-5" /> },
  { name: 'Categories', href: '/dashboard/category', icon: <FiTag className="w-5 h-5" /> },
  { name: 'Customers', href: '/dashboard/customers', icon: <FiUsers className="w-5 h-5" /> },
  { name: 'Analytics', href: '/dashboard/analytics', icon: <FiPieChart className="w-5 h-5" /> },
  { name: 'Settings', href: '/dashboard/settings', icon: <FiSettings className="w-5 h-5" /> },
];

function Sidebar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      <button
        onClick={toggleVisibility}
        className={cn(
          "fixed lg:hidden z-50 top-4 left-4 p-2 rounded-md",
          "bg-background text-foreground"
        )}
      >
        {isVisible ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {isVisible && (
        <aside className={cn(
          "fixed lg:static h-screen transition-all duration-300 ease-in-out",
          "border-r border-border",
          "bg-background text-foreground",
          "z-40 flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}>
          <div className={cn(
            "p-4 border-b border-border",
            "flex items-center justify-between"
          )}>
            {!isCollapsed && (
              <h1 className="text-xl font-bold">
                FashionAdmin
              </h1>
            )}
            <button
              onClick={toggleCollapse}
              className={cn(
                "p-2 rounded-md",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive ? 'bg-accent text-accent-foreground font-medium' : ''
                  )}
                >
                  <span className={cn(isCollapsed ? "mx-auto" : "")}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {!isCollapsed && (
            <div className={cn(
              "p-4 border-t border-border",
              "text-muted-foreground text-xs"
            )}>
              © {new Date().getFullYear()} FashionShop
            </div>
          )}
        </aside>
      )}
    </>
  );
}

export default Sidebar;
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FiMenu, FiX, FiHome, FiShoppingBag, FiUsers, FiSettings, FiPieChart, FiTag } from 'react-icons/fi';
import { theme } from '@/lib/theme';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
  { name: 'Products', href: '/dashboard/product', icon: <FiShoppingBag className="w-5 h-5" /> },
  { name: 'Categories', href: '/dashboard/categories', icon: <FiTag className="w-5 h-5" /> },
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
          "fixed lg:hidden z-50 top-4 left-4 p-2 rounded-md shadow-md",
          theme.colors.light.background,
          "dark:" + theme.colors.dark.background
        )}
      >
        {isVisible ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {isVisible && (
        <aside className={cn(
          "fixed lg:static h-screen transition-all duration-300 ease-in-out",
          "border-r",
          theme.colors.light.background,
          theme.colors.light.border,
          "dark:" + theme.colors.dark.background,
          "dark:" + theme.colors.dark.border,
          "z-40 flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}>
          <div className={cn(
            "p-4 border-b",
            theme.colors.light.border,
            "dark:" + theme.colors.dark.border,
            "flex items-center justify-between"
          )}>
            {!isCollapsed && (
              <h1 className={cn(
                "text-xl font-bold",
                theme.colors.light.text,
                "dark:" + theme.colors.dark.text
              )}>
                FashionAdmin
              </h1>
            )}
            <button
              onClick={toggleCollapse}
              className={cn(
                "p-2 rounded-md",
                theme.colors.light.hover,
                "dark:" + theme.colors.dark.hover
              )}
            >
              {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-colors',
                  theme.colors.light.hover,
                  theme.colors.light.text,
                  "dark:" + theme.colors.dark.hover,
                  "dark:" + theme.colors.dark.text,
                  pathname.startsWith(item.href) && [
                    theme.colors.light.active,
                    "dark:" + theme.colors.dark.active
                  ],
                  isCollapsed && 'justify-center'
                )}
              >
                <span className={cn(isCollapsed ? "mx-auto" : "")}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>

          {!isCollapsed && (
            <div className={cn(
              "p-4 border-t",
              theme.colors.light.border,
              theme.colors.light.muted,
              "dark:" + theme.colors.dark.border,
              "dark:" + theme.colors.dark.muted,
              "text-xs"
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
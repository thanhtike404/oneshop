'use client';

import React, { useState } from 'react';

function SidebarToggle() {
  const [open, setOpen] = useState(true);

  return (
    <button
      className="px-4 py-2 bg-gray-800 text-white rounded"
      onClick={() => {
        const sidebar = document.querySelector('aside');
        if (sidebar) {
          sidebar.classList.toggle('hidden');
        }
        setOpen(!open);
      }}
    >
      {open ? 'Hide Sidebar' : 'Show Sidebar'}
    </button>
  );
}

export default SidebarToggle;

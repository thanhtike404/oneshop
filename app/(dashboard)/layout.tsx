// app/dashboard/layout.tsx
import Sidebar from '@/app/(dashboard)/components/Sidebar';
import Navbar from '@/app/(dashboard)/components/Navbar';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">

      <Sidebar />
      <div className="flex-1 flex flex-col">
      <Navbar />
        <main className="p-4 overflow-auto">{children}</main>
      </div>

 
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import ProtectedRoute from '@/components/ProtectedRoute';
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation';
import { useLogoutMutation } from '@/redux/features/auth/authApi';
import { logout } from '@/redux/features/auth/authSlices';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutFromServer] = useLogoutMutation();

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await logoutFromServer().unwrap();
    } catch {
      // The local session should still be cleared when the API is unavailable.
    }
    dispatch(logout());
    router.replace('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);
  const viewportBelowNavbar = {
    top: 'var(--app-navbar-height)',
    height: 'calc(100dvh - var(--app-navbar-height))',
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="grid min-h-[calc(100dvh-var(--app-navbar-height))] min-w-0 max-w-full grid-cols-1 bg-gray-50 md:grid-cols-[17rem_minmax(0,1fr)]">
        <header
          className="sticky z-30 flex min-w-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm md:hidden"
          style={{ top: 'var(--app-navbar-height)' }}
        >
          <h1 className="truncate text-lg font-bold text-gray-900">Admin Dashboard</h1>
          <button
            type="button"
            aria-label="Open dashboard menu"
            aria-expanded={sidebarOpen}
            aria-controls="dashboard-mobile-sidebar"
            onClick={() => setSidebarOpen(true)}
            className="-mr-2 rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </header>

        <aside
          className="sticky hidden self-start overflow-y-auto border-r border-gray-200 bg-white px-4 py-6 md:flex md:flex-col"
          style={viewportBelowNavbar}
        >
          <h2 className="mb-6 px-3 text-2xl font-extrabold tracking-tight text-gray-900">
            Dashboard
          </h2>
          <DashboardNavigation onLogout={handleLogout} />
        </aside>

        <button
          type="button"
          aria-label="Close dashboard menu"
          tabIndex={sidebarOpen ? 0 : -1}
          className={`fixed inset-x-0 bottom-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
            sidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
          style={{ top: 'var(--app-navbar-height)' }}
          onClick={closeSidebar}
        />

        <aside
          id="dashboard-mobile-sidebar"
          aria-label="Dashboard menu"
          aria-hidden={!sidebarOpen}
          inert={!sidebarOpen}
          className={`fixed bottom-0 left-0 z-50 flex w-72 max-w-[calc(100vw-2rem)] flex-col overflow-y-auto border-r border-gray-200 bg-white px-4 py-4 shadow-xl transition-transform duration-300 ease-out md:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ top: 'var(--app-navbar-height)' }}
        >
          <div className="mb-4 flex items-center justify-between gap-3 px-2">
            <h2 className="truncate text-xl font-bold text-gray-900">Dashboard</h2>
            <button
              type="button"
              aria-label="Close dashboard menu"
              onClick={closeSidebar}
              className="shrink-0 rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <DashboardNavigation onNavigate={closeSidebar} onLogout={handleLogout} />
        </aside>

        <section aria-label="Dashboard content" className="min-w-0 max-w-full bg-white py-5 sm:py-7 md:py-8">
          {children}
        </section>
      </div>
    </ProtectedRoute>
  );
}

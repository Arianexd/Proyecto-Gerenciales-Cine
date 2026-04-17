'use client';

import { usePathname, useRouter } from 'next/navigation';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminNavigation from '@/components/AdminNavigation';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  // If it's login page, don't wrap with protection
  if (isLoginPage) {
    return (
      <div data-admin-panel>
        {children}
        <Toaster position="top-right" />
      </div>
    );
  }

  // Protected admin pages
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50" data-admin-panel>
        {/* Admin Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xl font-bold text-gray-900">Cinema Admin Panel</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome, <strong>{typeof window !== 'undefined' && localStorage.getItem('admin_username')}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Navigation Tabs */}
        <AdminNavigation />

        {/* Admin Content */}
        <main>
          {children}
        </main>
        
        <Toaster position="top-right" />
      </div>
    </AdminProtectedRoute>
  );
}


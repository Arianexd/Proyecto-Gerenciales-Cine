'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminNavigation from '@/components/AdminNavigation';
import toast from 'react-hot-toast';
import { AuthUser, clearSession, getStoredSession, getUserDisplayName, subscribeToAuthChanges } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const syncUser = () => {
      const session = getStoredSession();
      setUsername(getUserDisplayName(session?.user || null));
      setUser(session?.user || null);
    };

    syncUser();
    return subscribeToAuthChanges(syncUser);
  }, []);

  const handleLogout = () => {
    clearSession();
    toast.success('Sesión cerrada correctamente');
    router.push('/account/login');
  };

  if (isLoginPage) {
    return <div data-admin-panel>{children}</div>;
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-transparent text-slate-100 grid-lines" data-admin-panel>
        <header className="glass-panel border-b border-cyan-500/15 shadow-[0_0_40px_rgba(71,191,255,0.08)]">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight">Panel de Administración</span>
                  <p className="text-xs text-cyan-300/70 uppercase tracking-[0.3em]">Sistema Cinebook</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-slate-300">Bienvenido,</p>
                  <p className="text-sm font-semibold text-cyan-300">{username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="floating-btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-500 hover:to-red-600 transition-all text-sm font-semibold shadow-lg shadow-red-500/25"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        <AdminNavigation user={user} />

        <main className="relative">{children}</main>
      </div>
    </AdminProtectedRoute>
  );
}

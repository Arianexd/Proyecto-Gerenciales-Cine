'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clearSession, getUserDisplayName, useAuthSession } from '@/lib/auth';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

export default function PublicNavigation() {
  const pathname = usePathname();
  const session = useAuthSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearSession();
    toast.success('Sesión cerrada correctamente');
  };

  const isStaff = session?.user.Role === 'ADMIN' || session?.user.Role === 'CAJERO';
  const isCustomer = session?.user.Role === 'CUSTOMER';

  return (
    <header className="glass-panel border-b border-cyan-500/10 sticky top-0 z-50 transition-all duration-300 shadow-[0_0_40px_rgba(71,191,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Cine<span className="text-cyan-300">book</span>
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isStaff ? (
              <>
                <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                  {session?.user.Role === 'ADMIN' ? 'Administrador' : 'Cajero'}
                </span>
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  Salir
                </button>
              </>
            ) : isCustomer ? (
              <>
                <span className="text-sm text-gray-500 font-medium">
                  Hola, <span className="text-cyan-300 font-semibold">{getUserDisplayName(session.user)}</span>
                </span>
                <Link
                  href="/account"
                  className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white dark:text-black text-white text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
                >
                  Mi cuenta
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/account/login"
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-semibold hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/account/register"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2 w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Abrir menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 dark:border-white/5 space-y-2">
            {isStaff ? (
              <>
                <Link href="/admin" className="block px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold text-center">
                  Panel {session?.user.Role === 'ADMIN' ? 'Admin' : 'Cajero'}
                </Link>
                <button onClick={handleLogout} className="w-full floating-btn px-4 py-2.5 rounded-2xl text-slate-300 text-sm font-medium border border-slate-700/60 text-center hover:border-cyan-400/40 transition-all">
                  Cerrar sesión
                </button>
              </>
            ) : isCustomer ? (
              <>
                <Link href="/account" className="block px-4 py-2.5 rounded-lg bg-gray-900 dark:bg-white dark:text-black text-white text-sm font-semibold text-center">
                  Mi cuenta
                </Link>
                <button onClick={handleLogout} className="w-full floating-btn px-4 py-2.5 rounded-2xl text-slate-300 text-sm font-medium border border-slate-700/60 hover:border-cyan-400/40 transition-all">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/account/login" className="block px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold text-center">
                  Iniciar sesión
                </Link>
                <Link href="/account/register" className="block px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold text-center">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

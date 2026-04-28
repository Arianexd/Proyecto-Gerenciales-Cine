'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { storeSession } from '@/lib/auth';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/account');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    setRedirectTo(redirect || '/account');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.login({
        identity: formData.username,
        password: formData.password,
      });

      storeSession(response.data);
      const role = response.data.user.Role;

      if (role === 'ADMIN' || role === 'CAJERO') {
        toast.success('Bienvenido al panel de administración.');
        router.push('/admin');
      } else {
        toast.success('Inicio de sesión exitoso.');
        // Never send a customer to an admin route
        const destination = redirectTo.startsWith('/admin') ? '/account' : redirectTo;
        router.push(destination);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Credenciales inválidas';
      toast.error(message);
      setLoading(false);
    }
  };

  const fillDemo = (identity: string, password: string) => {
    setFormData({ username: identity, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-md w-full">

        {/* Theme toggle */}
        {mounted && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Logo + header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Cine<span className="text-red-600">book</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Accede a tu cuenta o al panel de administración</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Usuario o correo
              </label>
              <input
                id="login-username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Ingresa tu usuario"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">¿No tienes cuenta? </span>
            <Link href="/account/register" className="text-sm text-red-600 font-semibold hover:underline">
              Regístrate
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5 space-y-2.5">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Credenciales de demostración
            </p>

            <button
              type="button"
              onClick={() => fillDemo('admin', 'admin')}
              className="w-full text-left p-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
            >
              <p className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-0.5">Administrador</p>
              <p className="text-xs text-purple-600 dark:text-purple-500">
                Usuario: <code className="bg-purple-100 dark:bg-purple-500/20 px-1 rounded">admin</code>{' '}
                Contraseña: <code className="bg-purple-100 dark:bg-purple-500/20 px-1 rounded">admin</code>
              </p>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('cajero', 'cajero')}
              className="w-full text-left p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
            >
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-0.5">Cajero</p>
              <p className="text-xs text-blue-600 dark:text-blue-500">
                Usuario: <code className="bg-blue-100 dark:bg-blue-500/20 px-1 rounded">cajero</code>{' '}
                Contraseña: <code className="bg-blue-100 dark:bg-blue-500/20 px-1 rounded">cajero</code>
              </p>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('cliente', 'cliente')}
              className="w-full text-left p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
            >
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">Cliente</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Usuario: <code className="bg-emerald-100 dark:bg-emerald-500/20 px-1 rounded">cliente</code>{' '}
                Contraseña: <code className="bg-emerald-100 dark:bg-emerald-500/20 px-1 rounded">cliente</code>
              </p>
            </button>
          </div>
        </div>

        <p className="text-center text-gray-400 dark:text-gray-600 text-xs mt-6">
          Proyecto SIS 226 · 2026
        </p>
      </div>
    </div>
  );
}

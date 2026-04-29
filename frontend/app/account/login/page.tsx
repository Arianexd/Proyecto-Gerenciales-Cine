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
    <div className="relative min-h-screen overflow-hidden bg-transparent text-slate-100">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.9fr] items-center">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300 shadow-[0_0_40px_rgba(71,191,255,0.12)]">
              Futurista · Minimalista · Tecnología
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Bienvenido a <span className="text-cyan-300">Cinebook</span>
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300/90">
                Inicia sesión como administrador, cajero o cliente con un diseño oscuro y tecnológico.
                El panel está optimizado para que cada rol tenga una experiencia elegante y minimalista.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="role-badge shadow-soft-shadow">
                <p className="text-[0.68rem] font-semibold tracking-[0.25em] text-cyan-200">ADMINISTRADOR</p>
                <p className="mt-2 text-xs text-slate-400">Control total del sistema y reservas.</p>
              </div>
              <div className="role-badge shadow-soft-shadow">
                <p className="text-[0.68rem] font-semibold tracking-[0.25em] text-cyan-200">CAJERO</p>
                <p className="mt-2 text-xs text-slate-400">Gestiona ventas y atención al cliente.</p>
              </div>
              <div className="role-badge shadow-soft-shadow">
                <p className="text-[0.68rem] font-semibold tracking-[0.25em] text-cyan-200">USUARIO</p>
                <p className="mt-2 text-xs text-slate-400">Reserva entradas y revisa tu historial.</p>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[2rem] border border-cyan-500/15 bg-slate-900/90 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/10 via-slate-900/0 to-violet-500/10 blur opacity-80" />
            <div className="relative space-y-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Entrada segura</p>
                  <h2 className="text-3xl font-black text-white">Accede a tu cuenta</h2>
                </div>
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-950/80 px-4 text-sm text-slate-100 shadow-[0_15px_30px_rgba(0,0,0,0.24)] transition hover:border-cyan-400/40"
                    aria-label="Cambiar tema"
                  >
                    {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="login-username" className="block text-sm font-semibold text-slate-300">
                    Usuario o correo
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/95 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
                    placeholder="Ingresa tu usuario"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="block text-sm font-semibold text-slate-300">
                    Contraseña
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/95 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-3xl btn-primary py-3 text-sm font-semibold shadow-lg shadow-cyan-500/15 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>

              <div className="rounded-3xl border border-slate-700/60 bg-slate-950/80 p-4 text-sm text-slate-400">
                <p>¿No tienes cuenta?{' '}
                  <Link href="/account/register" className="text-cyan-300 hover:text-cyan-100">
                    Regístrate
                  </Link>
                </p>
              </div>

              <div className="grid gap-3">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Credenciales de demostración</p>
                <button
                  type="button"
                  onClick={() => fillDemo('admin', 'admin')}
                  className="rounded-3xl border border-cyan-500/20 bg-slate-950/85 px-4 py-3 text-left transition hover:border-cyan-400/40"
                >
                  <p className="text-sm font-semibold text-cyan-200">Administrador</p>
                  <p className="mt-1 text-xs text-slate-400">admin / admin</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('cajero', 'cajero')}
                  className="rounded-3xl border border-cyan-500/20 bg-slate-950/85 px-4 py-3 text-left transition hover:border-cyan-400/40"
                >
                  <p className="text-sm font-semibold text-cyan-200">Cajero</p>
                  <p className="mt-1 text-xs text-slate-400">cajero / cajero</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('cliente', 'cliente')}
                  className="rounded-3xl border border-cyan-500/20 bg-slate-950/85 px-4 py-3 text-left transition hover:border-cyan-400/40"
                >
                  <p className="text-sm font-semibold text-cyan-200">cliente / cliente</p>
                </button>
              </div>
            </div>
          </section>
        </div>

        <p className="mt-10 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
          Proyecto SIS 226 · 2026
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { storeSession } from '@/lib/auth';
import toast from 'react-hot-toast';

const CAJERO_MOCK_SESSION = {
  token: 'mock-cajero-token',
  user: {
    _id: 'mock-cajero-001',
    Username: 'cajero',
    Email: 'cajero@cinebook.local',
    Role: 'CAJERO' as const,
    CustomerID: null,
    Customer: null,
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/admin');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    setRedirectTo(redirect || '/admin');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login({
        identity: formData.username,
        password: formData.password,
      });

      const role = response.data.user.Role;
      if (role !== 'ADMIN' && role !== 'CAJERO') {
        toast.error('Esta cuenta no tiene permisos de acceso al panel');
        setLoading(false);
        return;
      }

      storeSession(response.data);
      toast.success('Inicio de sesión exitoso');
      router.push(role === 'CAJERO' ? '/admin/reservations' : redirectTo);
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Credenciales inválidas';
      toast.error(message);
      setLoading(false);
    }
  };

  const handleCajeroDemo = () => {
    storeSession(CAJERO_MOCK_SESSION);
    toast.success('Sesión de cajero iniciada (modo demo)');
    router.push('/admin/reservations');
  };

  const fillAdmin = () => setFormData({ username: 'demo', password: 'demo' });
  const fillCajero = () => setFormData({ username: 'cajero', password: 'cajero123' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración de Cine</h1>
          <p className="text-gray-600">Inicia sesión para gestionar tu cine</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario o correo
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ingresa el usuario"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ingresa la contraseña"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Acceso rápido (demo)</p>

            <button
              type="button"
              onClick={fillAdmin}
              className="w-full flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-semibold text-indigo-800">Administrador</p>
                <p className="text-xs text-indigo-600">usuario: <code>demo</code> · contraseña: <code>demo</code></p>
              </div>
              <span className="text-indigo-500 text-xs font-medium">Rellenar →</span>
            </button>

            <button
              type="button"
              onClick={handleCajeroDemo}
              className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-semibold text-blue-800">Cajero <span className="text-xs font-normal text-blue-500">(simulado)</span></p>
                <p className="text-xs text-blue-600">Acceso directo sin backend · solo ventas</p>
              </div>
              <span className="text-blue-500 text-xs font-medium">Entrar →</span>
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Sistema de Reserva de Cine © 2024
        </p>
      </div>
    </div>
  );
}

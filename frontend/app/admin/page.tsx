'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { customersApi, moviesApi, hallsApi, sessionsApi, reservationsApi, paymentsApi } from '@/lib/api';
import { getStoredSession } from '@/lib/auth';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    customers: 0,
    movies: 0,
    halls: 0,
    sessions: 0,
    reservations: 0,
    payments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStoredSession();
    if (session?.user.Role === 'CAJERO') {
      router.replace('/admin/reservations');
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [customersRes, moviesRes, hallsRes, sessionsRes, reservationsRes, paymentsRes] = await Promise.all([
        customersApi.getAll(),
        moviesApi.getAll(),
        hallsApi.getAll(),
        sessionsApi.getAll(),
        reservationsApi.getAll(),
        paymentsApi.getAll(),
      ]);
      
      setStats({
        customers: customersRes.data.length,
        movies: moviesRes.data.length,
        halls: hallsRes.data.length,
        sessions: sessionsRes.data.length,
        reservations: reservationsRes.data.length,
        payments: paymentsRes.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { name: 'Clientes', path: '/admin/customers', icon: '👥', color: 'orange', count: stats.customers },
    { name: 'Películas', path: '/admin/movies', icon: '🎬', color: 'blue', count: stats.movies },
    { name: 'Salas', path: '/admin/halls', icon: '🏛️', color: 'indigo', count: stats.halls },
    { name: 'Funciones', path: '/admin/sessions', icon: '🎭', color: 'green', count: stats.sessions },
    { name: 'Reservas', path: '/admin/reservations', icon: '📋', color: 'purple', count: stats.reservations },
    { name: 'Pagos', path: '/admin/payments', icon: '💳', color: 'emerald', count: stats.payments },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel</h1>
        <p className="text-gray-600">Bienvenido al Sistema de Gestión de Cine</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-${item.color}-500`}
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className={`text-3xl font-bold text-${item.color}-600 mb-1`}>
              {loading ? '...' : item.count}
            </div>
            <div className="text-sm text-gray-600 font-medium">{item.name}</div>
          </Link>
        ))}
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-orange-900 mb-2">👥 Gestión de Clientes</h3>
          <p className="text-orange-700 text-sm mb-4">
            Administra las cuentas de clientes, información de contacto e historial de reservas.
          </p>
          <Link href="/admin/customers" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Gestionar Clientes →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-blue-900 mb-2">🎬 Catálogo de Películas</h3>
          <p className="text-blue-700 text-sm mb-4">
            Agrega, edita y gestiona tu catálogo de películas con información detallada.
          </p>
          <Link href="/admin/movies" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Gestionar Películas →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">🏛️ Salas y Asientos</h3>
          <p className="text-indigo-700 text-sm mb-4">
            Configura las salas de cine con matriz de asientos, calidad de vista y acústica.
          </p>
          <Link href="/admin/halls" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Gestionar Salas →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-green-900 mb-2">🎭 Programación de Funciones</h3>
          <p className="text-green-700 text-sm mb-4">
            Programa funciones de películas en diferentes salas y horarios.
          </p>
          <Link href="/admin/sessions" className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Gestionar Funciones →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-purple-900 mb-2">📋 Reservas</h3>
          <p className="text-purple-700 text-sm mb-4">
            Crea reservas con selección de asientos y genera entradas con códigos QR.
          </p>
          <Link href="/admin/reservations" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Gestionar Reservas →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-emerald-900 mb-2">💳 Procesamiento de Pagos</h3>
          <p className="text-emerald-700 text-sm mb-4">
            Procesa y realiza seguimiento de los pagos de reservas y actualiza el estado de las reservas.
          </p>
          <Link href="/admin/payments" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Gestionar Pagos →
          </Link>
        </div>
      </div>
    </div>
  );
}


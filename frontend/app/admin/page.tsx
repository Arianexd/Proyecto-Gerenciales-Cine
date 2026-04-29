'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  customersApi,
  moviesApi,
  hallsApi,
  sessionsApi,
  reservationsApi,
  paymentsApi,
  snackSalesApi,
  snackProductsApi,
} from '@/lib/api';
import { AuthUser, getStoredSession, subscribeToAuthChanges } from '@/lib/auth';

export default function AdminDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState({
    customers: 0,
    movies: 0,
    halls: 0,
    sessions: 0,
    reservations: 0,
    payments: 0,
    snackSales: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sync = () => setUser(getStoredSession()?.user || null);
    sync();
    return subscribeToAuthChanges(sync);
  }, []);

  useEffect(() => {
    if (user?.Role === 'CAJERO') {
      router.replace('/admin/pos');
      return;
    }

    if (user) {
      fetchStats();
    }
  }, [user, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      if (user?.Role === 'CAJERO') {
        const [reservationsRes, paymentsRes, salesRes, productsRes] = await Promise.all([
          reservationsApi.getAll(),
          paymentsApi.getAll(),
          snackSalesApi.getAll(),
          snackProductsApi.getAll({ active: true }),
        ]);

        setStats((current) => ({
          ...current,
          reservations: reservationsRes.data.length,
          payments: paymentsRes.data.length,
          snackSales: salesRes.data.length,
          lowStock: productsRes.data.filter((product: any) => product.Stock <= 5).length,
        }));
      } else {
        const [
          customersRes,
          moviesRes,
          hallsRes,
          sessionsRes,
          reservationsRes,
          paymentsRes,
          salesRes,
          productsRes,
        ] = await Promise.all([
          customersApi.getAll(),
          moviesApi.getAll(),
          hallsApi.getAll(),
          sessionsApi.getAll(),
          reservationsApi.getAll(),
          paymentsApi.getAll(),
          snackSalesApi.getAll(),
          snackProductsApi.getAll({ active: true }),
        ]);

        setStats({
          customers: customersRes.data.length,
          movies: moviesRes.data.length,
          halls: hallsRes.data.length,
          sessions: sessionsRes.data.length,
          reservations: reservationsRes.data.length,
          payments: paymentsRes.data.length,
          snackSales: salesRes.data.length,
          lowStock: productsRes.data.filter((product: any) => product.Stock <= 5).length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.Role === 'CAJERO') {
    return <CajeroDashboard stats={stats} loading={loading} />;
  }

  return <AdminFullDashboard stats={stats} loading={loading} />;
}

function StatCard({
  icon,
  label,
  value,
  color,
  href,
  loading,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  href: string;
  loading: boolean;
}) {
  return (
    <Link
      href={href}
      className="floating-btn admin-card rounded-3xl p-6 border-l-4 border-cyan-500/50 hover:border-cyan-400 transition-all group"
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-3xl font-black text-cyan-300 mb-1">
        {loading ? '...' : value}
      </div>
      <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">{label}</div>
    </Link>
  );
}

function AdminFullDashboard({ stats, loading }: { stats: any; loading: boolean }) {
  const statCards = [
    { icon: '👥', label: 'Clientes', href: '/admin/customers', color: 'orange', value: stats.customers },
    { icon: '🎬', label: 'Peliculas', href: '/admin/movies', color: 'blue', value: stats.movies },
    { icon: '🏛️', label: 'Salas', href: '/admin/halls', color: 'indigo', value: stats.halls },
    { icon: '🎭', label: 'Funciones', href: '/admin/sessions', color: 'green', value: stats.sessions },
    { icon: '📋', label: 'Reservas', href: '/admin/reservations', color: 'purple', value: stats.reservations },
    { icon: '💳', label: 'Pagos', href: '/admin/payments', color: 'emerald', value: stats.payments },
    { icon: '🍿', label: 'Ventas Snacks', href: '/admin/snacks', color: 'yellow', value: stats.snackSales },
    { icon: '⚠️', label: 'Stock Bajo', href: '/admin/snacks', color: 'red', value: stats.lowStock },
  ];

  const managementCards = [
    {
      color: 'orange',
      icon: '👥',
      title: 'Gestion de Clientes',
      desc: 'Administra cuentas, contacto e historial de reservas.',
      href: '/admin/customers',
      label: 'Gestionar Clientes',
    },
    {
      color: 'blue',
      icon: '🎬',
      title: 'Catalogo de Peliculas',
      desc: 'Agrega, edita y gestiona el catalogo de peliculas.',
      href: '/admin/movies',
      label: 'Gestionar Peliculas',
    },
    {
      color: 'indigo',
      icon: '🏛️',
      title: 'Salas y Asientos',
      desc: 'Configura salas con matriz de asientos y calidad.',
      href: '/admin/halls',
      label: 'Gestionar Salas',
    },
    {
      color: 'green',
      icon: '🎭',
      title: 'Programacion de Funciones',
      desc: 'Programa funciones en diferentes salas y horarios.',
      href: '/admin/sessions',
      label: 'Gestionar Funciones',
    },
    {
      color: 'purple',
      icon: '📋',
      title: 'Reservas',
      desc: 'Consulta y supervisa las reservas registradas.',
      href: '/admin/reservations',
      label: 'Ver Reservas',
    },
    {
      color: 'emerald',
      icon: '💳',
      title: 'Pagos',
      desc: 'Consulta y supervisa los pagos registrados.',
      href: '/admin/payments',
      label: 'Ver Pagos',
    },
    {
      color: 'yellow',
      icon: '🍿',
      title: 'Gestion de Snacks',
      desc: 'Administra productos, categorias e inventario de snacks.',
      href: '/admin/snacks',
      label: 'Gestionar Snacks',
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Panel de Administración</h1>
        <p className="text-slate-400 text-lg">Sistema de gestión avanzado para Cinebook</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {statCards.map((card) => (
          <StatCard key={card.href + card.label} {...card} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {managementCards.map((card) => (
          <div
            key={card.href}
            className="floating-btn admin-card rounded-3xl p-8 group hover:border-cyan-400/60 transition-all"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">
              {card.title}
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{card.desc}</p>
            <Link
              href={card.href}
              className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all"
            >
              {card.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function CajeroDashboard({ stats, loading }: { stats: any; loading: boolean }) {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Panel del Cajero</h1>
        <p className="text-slate-400 text-lg">Sistema de ventas y atención al cliente</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon="📋" label="Reservas" href="/admin/reservations" color="purple" value={stats.reservations} loading={loading} />
        <StatCard icon="💳" label="Pagos" href="/admin/payments" color="emerald" value={stats.payments} loading={loading} />
        <StatCard icon="🍿" label="Ventas Snacks" href="/admin/snacks" color="yellow" value={stats.snackSales} loading={loading} />
        <StatCard icon="⚠️" label="Stock Bajo" href="/admin/snacks" color="red" value={stats.lowStock} loading={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/admin/snacks/sell" className="floating-btn admin-card rounded-3xl p-8 hover:border-orange-400/60 transition-all text-white group">
          <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🛒</div>
          <h3 className="text-2xl font-bold mb-3">Vender Snacks</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Abre la caja para vender snacks y bebidas rápidamente.</p>
          <div className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-cyan-500/25">
            Abrir caja
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link href="/admin/reservations" className="floating-btn admin-card rounded-3xl p-8 hover:border-purple-400/60 transition-all text-white group">
          <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">📋</div>
          <h3 className="text-2xl font-bold mb-3">Reservas</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Gestiona y crea reservas de boletos para funciones.</p>
          <div className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-cyan-500/25">
            Ver reservas
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link href="/admin/payments" className="floating-btn admin-card rounded-3xl p-8 hover:border-emerald-400/60 transition-all text-white group">
          <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">💳</div>
          <h3 className="text-2xl font-bold mb-3">Pagos</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Procesa y registra los pagos de reservas.</p>
          <div className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-cyan-500/25">
            Ver pagos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link href="/admin/snacks" className="floating-btn admin-card rounded-3xl p-8 hover:border-yellow-400/60 transition-all text-white group">
          <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🍿</div>
          <h3 className="text-2xl font-bold mb-3">Inventario Snacks</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Consulta el inventario y las ventas de snacks.</p>
          <div className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-cyan-500/25">
            Ver inventario
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link href="/admin/customers" className="floating-btn admin-card rounded-3xl p-8 hover:border-blue-400/60 transition-all text-white group">
          <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">👥</div>
          <h3 className="text-2xl font-bold mb-3">Clientes</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Consulta información de clientes registrados.</p>
          <div className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-cyan-500/25">
            Ver clientes
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}

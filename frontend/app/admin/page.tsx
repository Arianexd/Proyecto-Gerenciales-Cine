'use client';

import { useState, useEffect } from 'react';
import { customersApi, moviesApi, hallsApi, sessionsApi, reservationsApi, paymentsApi } from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
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
    fetchStats();
  }, []);

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
    { name: 'Customers', path: '/admin/customers', icon: '👥', color: 'orange', count: stats.customers },
    { name: 'Movies', path: '/admin/movies', icon: '🎬', color: 'blue', count: stats.movies },
    { name: 'Halls', path: '/admin/halls', icon: '🏛️', color: 'indigo', count: stats.halls },
    { name: 'Sessions', path: '/admin/sessions', icon: '🎭', color: 'green', count: stats.sessions },
    { name: 'Reservations', path: '/admin/reservations', icon: '📋', color: 'purple', count: stats.reservations },
    { name: 'Payments', path: '/admin/payments', icon: '💳', color: 'emerald', count: stats.payments },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Cinema Management System</p>
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
          <h3 className="text-lg font-bold text-orange-900 mb-2">👥 Customer Management</h3>
          <p className="text-orange-700 text-sm mb-4">
            Manage customer accounts, contact information, and booking history.
          </p>
          <Link href="/admin/customers" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Manage Customers →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-blue-900 mb-2">🎬 Movie Catalog</h3>
          <p className="text-blue-700 text-sm mb-4">
            Add, edit, and manage your movie catalog with detailed information.
          </p>
          <Link href="/admin/movies" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Manage Movies →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">🏛️ Halls & Seats</h3>
          <p className="text-indigo-700 text-sm mb-4">
            Configure cinema halls with seating matrix, view quality, and acoustics.
          </p>
          <Link href="/admin/halls" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Manage Halls →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-green-900 mb-2">🎭 Session Scheduling</h3>
          <p className="text-green-700 text-sm mb-4">
            Schedule movie sessions across different halls and time slots.
          </p>
          <Link href="/admin/sessions" className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Manage Sessions →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-purple-900 mb-2">📋 Reservations</h3>
          <p className="text-purple-700 text-sm mb-4">
            Create reservations with seat selection and generate tickets with QR codes.
          </p>
          <Link href="/admin/reservations" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Manage Reservations →
          </Link>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-emerald-900 mb-2">💳 Payment Processing</h3>
          <p className="text-emerald-700 text-sm mb-4">
            Process and track payments for reservations and update booking status.
          </p>
          <Link href="/admin/payments" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Manage Payments →
          </Link>
        </div>
      </div>
    </div>
  );
}


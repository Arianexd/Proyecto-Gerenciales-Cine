'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authApi, meApi } from '@/lib/api';
import { getStoredSession, storeSession, getUserDisplayName } from '@/lib/auth';
import { Customer, Reservation, Ticket } from '@/lib/types';
import CustomerProtectedRoute from '@/components/CustomerProtectedRoute';
import PublicNavigation from '@/components/PublicNavigation';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const [profile, setProfile] = useState<Customer | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets' | 'reservations'>('profile');
  const [formData, setFormData] = useState({
    Name: '',
    Surname: '',
    Email: '',
    PhoneNumber: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const [profileRes, reservationsRes, ticketsRes] = await Promise.all([
        meApi.getProfile(),
        meApi.getReservations(),
        meApi.getTickets(),
      ]);

      setProfile(profileRes.data);
      setReservations(reservationsRes.data);
      setTickets(ticketsRes.data);
      setFormData({
        Name: profileRes.data.Name,
        Surname: profileRes.data.Surname,
        Email: profileRes.data.Email,
        PhoneNumber: profileRes.data.PhoneNumber,
      });
    } catch (error) {
      toast.error('No se pudo cargar tu cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await authApi.updateProfile(formData);
      const session = getStoredSession();
      if (session) {
        storeSession({ token: session.token, user: response.data.user });
      }
      toast.success('Perfil actualizado correctamente');
      await fetchAccountData();
    } catch (error: any) {
      const message = error?.response?.data?.error || 'No se pudo actualizar el perfil';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Contraseña actualizada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      const message = error?.response?.data?.error || 'No se pudo cambiar la contraseña';
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const paidReservations = reservations.filter((r) => r.Status === 'PAID');

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID': return 'Pagada';
      case 'PENDING': return 'Pendiente';
      case 'CANCELLED': return 'Cancelada';
      default: return status;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'tickets', label: 'Mis Tickets', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    )},
    { id: 'reservations', label: 'Mis Reservas', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
  ] as const;

  return (
    <CustomerProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <PublicNavigation />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

          {/* Header */}
          <div className="mb-8">
            <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-1">Panel de usuario</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Mi Cuenta
            </h1>
            {!loading && profile && (
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Bienvenido de nuevo, <span className="font-semibold text-gray-800 dark:text-gray-200">{profile.Name} {profile.Surname}</span>
              </p>
            )}
          </div>

          {loading ? (
            /* Skeleton loader */
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-white/5" />
                ))}
              </div>
              <div className="h-64 rounded-2xl bg-gray-200 dark:bg-white/5" />
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Reservas</p>
                  <p className="text-4xl font-black text-gray-900 dark:text-white">{reservations.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Pagadas</p>
                  <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{paidReservations.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Tickets</p>
                  <p className="text-4xl font-black text-red-600 dark:text-red-400">{tickets.length}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-6 w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: Profile */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Información personal</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Actualiza tu nombre, correo y teléfono</p>
                  </div>
                  <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={formData.Name}
                          onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Apellido
                        </label>
                        <input
                          type="text"
                          value={formData.Surname}
                          onChange={(e) => setFormData({ ...formData, Surname: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="Tu apellido"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={formData.Email}
                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="tu@correo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.PhoneNumber}
                        onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="+591 7XXXXXXX"
                      />
                    </div>
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
                      >
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Change password card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cambiar contraseña</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Mínimo 6 caracteres</p>
                  </div>
                  <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Contraseña actual
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Nueva contraseña
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="••••••••"
                          minLength={6}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Confirmar nueva contraseña
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="••••••••"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="px-6 py-2.5 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
                      >
                        {changingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                      </button>
                    </div>
                  </form>
                </div>
                </div>
              )}

              {/* Tab: Tickets */}
              {activeTab === 'tickets' && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mis Tickets</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Tus entradas de cine compradas</p>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {tickets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                        <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <p className="text-sm font-medium">Aún no tienes tickets</p>
                        <Link href="/movies" className="mt-3 text-sm text-red-600 font-semibold hover:underline">
                          Explorar películas →
                        </Link>
                      </div>
                    ) : (
                      tickets.map((ticket) => {
                        const reservation = typeof ticket.ReservationID === 'object' ? ticket.ReservationID : null;
                        const session = reservation && typeof reservation.SessionID === 'object' ? reservation.SessionID : null;
                        const movie = session && typeof session.MovieID === 'object' ? session.MovieID : null;
                        const seat = typeof ticket.SeatID === 'object' ? ticket.SeatID : null;

                        return (
                          <div key={ticket._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {movie?.MovieName || 'Película'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Asiento {seat?.RowNumber}{seat?.SeatNumber} · #{ticket.TicketCode.slice(-8).toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={`/my-ticket/${ticket._id}`}
                              className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              Ver ticket
                            </Link>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Reservations */}
              {activeTab === 'reservations' && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mis Reservas</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Historial completo de reservas</p>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {reservations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                        <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium">Aún no tienes reservas</p>
                        <Link href="/movies" className="mt-3 text-sm text-red-600 font-semibold hover:underline">
                          Ver cartelera →
                        </Link>
                      </div>
                    ) : (
                      reservations.map((reservation) => {
                        const session = typeof reservation.SessionID === 'object' ? reservation.SessionID : null;
                        const movie = session && typeof session.MovieID === 'object' ? session.MovieID : null;
                        const seatCount = reservation.SeatIDs?.length || 0;
                        const sessionAlreadyHappened = session
                          ? new Date(session.SessionDateTime) <= new Date()
                          : false;
                        const canRate = reservation.Status === 'PAID' && sessionAlreadyHappened && !!movie;

                        return (
                          <div key={reservation._id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {movie?.MovieName || 'Película'}
                                  </p>
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyles(reservation.Status)}`}>
                                    {getStatusLabel(reservation.Status)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {session ? new Date(session.SessionDateTime).toLocaleString('es-ES', {
                                    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                  }) : 'Sin función'} · {seatCount} asiento{seatCount !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              {reservation.Status === 'PAID' && (
                                <Link
                                  href={`/confirmation/${reservation._id}`}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                  Ver compra
                                </Link>
                              )}
                              {canRate && (
                                <Link
                                  href={`/movies/${movie!._id}#valorar`}
                                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
                                >
                                  ★ Valorar
                                </Link>
                              )}
                              {movie && (
                                <Link
                                  href={`/movies/${movie._id}`}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                  Ver película
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </CustomerProtectedRoute>
  );
}

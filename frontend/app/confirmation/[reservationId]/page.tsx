'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { meApi, reservationsApi } from '@/lib/api';
import { Reservation, Ticket } from '@/lib/types';
import PublicNavigation from '@/components/PublicNavigation';
import Link from 'next/link';

export default function ConfirmationPage() {
  const params = useParams();
  const reservationId = params.reservationId as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reservationId) {
      fetchConfirmationData();
    }
  }, [reservationId]);

  const fetchConfirmationData = async () => {
    try {
      setLoading(true);
      const [reservationRes, ticketsRes] = await Promise.all([
        reservationsApi.getById(reservationId),
        meApi.getReservationTickets(reservationId),
      ]);
      setReservation(reservationRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Failed to fetch confirmation data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <PublicNavigation />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-red-600/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold tracking-widest text-xs uppercase">
              Cargando reserva…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <PublicNavigation />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                Reserva no encontrada
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Esta reserva puede haber sido eliminada o no existe.
              </p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Data ─────────────────────────────────────────────────────────────────
  const movieName =
    typeof reservation.SessionID === 'object' && typeof reservation.SessionID.MovieID === 'object'
      ? reservation.SessionID.MovieID.MovieName
      : 'Película';

  const moviePoster =
    typeof reservation.SessionID === 'object' && typeof reservation.SessionID.MovieID === 'object'
      ? reservation.SessionID.MovieID.PosterURL
      : '';

  const sessionDateTime =
    typeof reservation.SessionID === 'object' ? reservation.SessionID.SessionDateTime : null;

  const { date, time } = sessionDateTime
    ? (() => {
        const d = new Date(sessionDateTime);
        return {
          date: d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
      })()
    : { date: '—', time: '—' };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <PublicNavigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl">

        {/* ── Success hero ────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          {/* Animated check */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-red-600/40" />
            <span className="text-red-500 font-black tracking-[0.2em] uppercase text-xs">Confirmado</span>
            <div className="h-px w-16 bg-red-600/40" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">
            ¡Reserva Confirmada!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
            Tus entradas están listas. Muéstralas en el cine o encuéntralas en tu cuenta.
          </p>
        </div>

        {/* ── Movie summary card ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden mb-10">
          <div className="bg-red-600 h-1" />

          <div className="p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {moviePoster && (
              <div className="shrink-0 w-32 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
                <img src={moviePoster} alt={movieName} className="w-full h-auto" />
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              {/* Movie name */}
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">{movieName}</h2>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black tracking-widest uppercase mb-1">Fecha</p>
                  <p className="text-sm font-bold capitalize">{date}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black tracking-widest uppercase mb-1">Hora</p>
                  <p className="text-xl font-black text-red-600">{time}</p>
                </div>
              </div>

              {/* Tickets count badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {tickets.length} {tickets.length === 1 ? 'entrada confirmada' : 'entradas confirmadas'}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tickets section ───────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-10 bg-red-600 rounded-full" />
            <span className="text-red-500 font-black tracking-[0.2em] uppercase text-xs">Tus Entradas</span>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-white/10 p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Aún no se han generado entradas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA buttons ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl font-semibold hover:bg-gray-100 dark:hover:bg-white/10 transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mi Cuenta
          </Link>
          <Link
            href="/movies"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 transition-all hover:scale-105 shadow-lg shadow-red-600/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Reservar más entradas
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 dark:text-gray-600 text-xs font-bold mt-12 tracking-widest uppercase">
          ¡Disfruta tu película! · Cinebook 🍿
        </p>
      </main>
    </div>
  );
}

// ── TicketCard inline (mini ticket) ────────────────────────────────────────

function TicketCard({ ticket }: { ticket: Ticket }) {
  const reservationData = typeof ticket.ReservationID === 'object' ? ticket.ReservationID : null;
  const sessionData = reservationData && typeof reservationData.SessionID === 'object'
    ? reservationData.SessionID : null;
  const movieData = sessionData && typeof sessionData.MovieID === 'object'
    ? sessionData.MovieID : null;
  const seatData = typeof ticket.SeatID === 'object' ? ticket.SeatID : null;
  const hallData = sessionData && typeof sessionData.HallID === 'object'
    ? sessionData.HallID : null;

  const movieName = movieData?.MovieName || 'Película';
  const hallName = hallData?.HallName || 'Sala';
  const seatRow = seatData?.RowNumber || 'A';
  const seatNumber = seatData?.SeatNumber || 1;
  const sessionDateTime = sessionData?.SessionDateTime || new Date().toISOString();

  const date = new Date(sessionDateTime);
  const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Top strip */}
      <div className="bg-red-600 h-1" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Entrada</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">#{ticket.TicketCode?.slice(-8)}</span>
        </div>

        {/* Movie name */}
        <h3 className="text-lg font-black tracking-tight mb-4 truncate">{movieName}</h3>

        {/* Info row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-200 dark:border-white/10">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Fecha</p>
            <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">{dateStr}</p>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-200 dark:border-white/10">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Hora</p>
            <p className="text-sm font-black text-red-600">{timeStr}</p>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-200 dark:border-white/10">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Sala</p>
            <p className="text-xs font-bold text-gray-900 dark:text-white">{hallName}</p>
          </div>
        </div>

        {/* Seat + QR row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l.001 7a2 2 0 002 2h10a2 2 0 002-2V10M3 10V8a2 2 0 012-2h14a2 2 0 012 2v2" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Asiento</p>
              <p className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">
                {seatRow}{seatNumber}
              </p>
            </div>
          </div>

          {/* Mini QR */}
          <div className="p-2 bg-white rounded-xl shadow border border-gray-100">
            <img src={ticket.QRCode} alt="QR" className="w-16 h-16" />
          </div>
        </div>

        {/* Tear line */}
        <div className="flex items-center my-4">
          <div className="w-4 h-4 rounded-full bg-gray-50 dark:bg-gray-950 -ml-6 shrink-0" />
          <div className="flex-1 border-t-2 border-dashed border-gray-200 dark:border-white/10 mx-2" />
          <div className="w-4 h-4 rounded-full bg-gray-50 dark:bg-gray-950 -mr-6 shrink-0" />
        </div>

        {/* Check-in + view button */}
        <div className="flex items-center justify-between">
          {ticket.CheckInStatus ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Ingresado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-full text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pendiente
            </span>
          )}

          <a
            href={`/my-ticket/${ticket._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition-all hover:scale-105"
          >
            Ver entrada completa
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-red-600 h-1" />
    </div>
  );
}

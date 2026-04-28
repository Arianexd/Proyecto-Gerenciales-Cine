'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ticketsApi } from '@/lib/api';
import { Ticket } from '@/lib/types';
import PublicNavigation from '@/components/PublicNavigation';
import Link from 'next/link';

export default function MyTicketPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ticketId) {
      fetchTicketData();
    }
  }, [ticketId]);

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      const ticketRes = await ticketsApi.getById(ticketId);
      setTicket(ticketRes.data);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-red-600/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold tracking-widest text-xs uppercase">
            Cargando entrada…
          </p>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Entrada no encontrada
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Esta entrada puede haber sido eliminada o no existe.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // ── Data extraction ───────────────────────────────────────────────────────
  const reservationData = typeof ticket.ReservationID === 'object' ? ticket.ReservationID : null;
  const sessionData = reservationData && typeof reservationData.SessionID === 'object'
    ? reservationData.SessionID
    : null;
  const movieData = sessionData && typeof sessionData.MovieID === 'object'
    ? sessionData.MovieID
    : null;
  const seatData = typeof ticket.SeatID === 'object' ? ticket.SeatID : null;
  const hallData = sessionData && typeof sessionData.HallID === 'object'
    ? sessionData.HallID
    : null;

  const movieName = movieData?.MovieName || 'Película';
  const moviePoster = movieData?.PosterURL || null;
  const sessionDateTime = sessionData?.SessionDateTime || new Date().toISOString();
  const hallName = hallData?.HallName || 'Sala';
  const seatRow = seatData?.RowNumber || 'A';
  const seatNumber = seatData?.SeatNumber || 1;
  const viewQuality = seatData?.ScreenViewInfo || 'Good';
  const acousticQuality = seatData?.AcousticProfile || 'Good';

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const { date, time } = formatDateTime(sessionDateTime);

  const qualityLabel = (q: string) => {
    switch (q) {
      case 'Excellent': return 'Excelente';
      case 'Good': return 'Buena';
      case 'Average': return 'Regular';
      case 'Poor': return 'Deficiente';
      default: return q;
    }
  };

  const qualityDot = (q: string) => {
    switch (q) {
      case 'Excellent': return 'bg-emerald-500';
      case 'Good': return 'bg-blue-500';
      case 'Average': return 'bg-yellow-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { margin: 0; }
          .no-print { display: none !important; }
          .print-card {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">

        {/* Navigation */}
        <div className="no-print">
          <PublicNavigation />
        </div>

        {/* Page content */}
        <main className="container mx-auto px-4 py-12 max-w-3xl">

          {/* Back + actions bar */}
          <div className="no-print flex items-center justify-between mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </Link>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-200 transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir
            </button>
          </div>

          {/* Label above card */}
          <div className="flex items-center gap-3 mb-6 no-print">
            <div className="h-1 w-10 bg-red-600 rounded-full" />
            <span className="text-red-500 font-black tracking-[0.2em] uppercase text-xs">Tu Entrada</span>
          </div>

          {/* ─── TICKET CARD ─── */}
          <div className="print-card bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">

            {/* Perforated strip top */}
            <div className="bg-red-600 h-2" />

            {/* Movie hero banner */}
            <div className="relative bg-gray-900 overflow-hidden">
              {moviePoster && (
                <img
                  src={moviePoster}
                  alt={movieName}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md scale-110"
                />
              )}
              <div className="relative z-10 flex items-end gap-6 p-8">
                {moviePoster && (
                  <div className="shrink-0 w-28 rounded-xl overflow-hidden shadow-2xl border border-white/10 hidden sm:block">
                    <img src={moviePoster} alt={movieName} className="w-full h-auto" />
                  </div>
                )}
                <div className="flex-1">
                  {/* Cinebook badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Cinebook · Entrada de Cine</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-tight mb-2">
                    {movieName}
                  </h1>
                  <p className="text-white/50 text-sm font-mono uppercase tracking-widest">
                    #{ticket.TicketCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Tear line */}
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-950 -ml-3 shrink-0" />
              <div className="flex-1 border-t-2 border-dashed border-gray-200 dark:border-white/10 mx-2" />
              <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-950 -mr-3 shrink-0" />
            </div>

            {/* Ticket body */}
            <div className="p-8 space-y-8">

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <InfoCell label="Fecha" value={date} className="col-span-2" />
                <InfoCell label="Hora" value={time} highlight />
                <InfoCell label="Sala" value={hallName} />
              </div>

              {/* Seat big badge */}
              <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l.001 7a2 2 0 002 2h10a2 2 0 002-2V10M3 10V8a2 2 0 012-2h14a2 2 0 012 2v2" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-black tracking-widest uppercase mb-0.5">Asiento</p>
                  <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {seatRow}{seatNumber}
                  </p>
                </div>
                <div className="ml-auto grid grid-cols-2 gap-3">
                  <QualityBadge icon="👁" label="Vista" quality={viewQuality} qualityLabel={qualityLabel(viewQuality)} dot={qualityDot(viewQuality)} />
                  <QualityBadge icon="🎵" label="Acústica" quality={acousticQuality} qualityLabel={qualityLabel(acousticQuality)} dot={qualityDot(acousticQuality)} />
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                <p className="text-xs font-black tracking-widest uppercase text-gray-500 dark:text-gray-400">
                  Escanea en la entrada
                </p>
                <div className="p-4 bg-white rounded-2xl shadow-lg ring-4 ring-red-600/10">
                  <img
                    src={ticket.QRCode}
                    alt="QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56"
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono font-bold">
                  {ticket.TicketCode}
                </p>
              </div>

              {/* Check-in status */}
              <div className="flex justify-center">
                {ticket.CheckInStatus ? (
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full font-semibold text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Check-in realizado
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-full font-semibold text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Listo para ingresar
                  </div>
                )}
              </div>

              {/* Notice */}
              <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-200 dark:border-yellow-500/20 rounded-xl">
                <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400 mb-0.5">Llega 15 minutos antes</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-500/80">
                    Puede que no se permita el ingreso después del inicio de la función.
                  </p>
                </div>
              </div>
            </div>

            {/* Perforated strip bottom */}
            <div className="bg-red-600 h-2" />
          </div>

          {/* Footer */}
          <p className="no-print text-center text-gray-400 dark:text-gray-600 text-xs font-bold mt-10 tracking-widest uppercase">
            ¡Disfruta tu película! · Cinebook 🍿
          </p>
        </main>
      </div>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function InfoCell({ label, value, highlight, className = '' }: {
  label: string;
  value: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={`p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 ${className}`}>
      <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black tracking-widest uppercase mb-1">{label}</p>
      <p className={`font-bold leading-tight ${highlight ? 'text-2xl text-red-600' : 'text-gray-900 dark:text-white text-base'}`}>
        {value}
      </p>
    </div>
  );
}

function QualityBadge({ icon, label, quality, qualityLabel, dot }: {
  icon: string;
  label: string;
  quality: string;
  qualityLabel: string;
  dot: string;
}) {
  return (
    <div className="text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className={`inline-block w-2 h-2 rounded-full ${dot} mb-1`} />
      <p className="text-gray-500 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-gray-900 dark:text-white text-xs font-bold">{qualityLabel}</p>
    </div>
  );
}

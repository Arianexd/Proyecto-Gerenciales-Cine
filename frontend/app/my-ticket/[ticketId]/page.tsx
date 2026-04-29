'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ticketsApi } from '@/lib/api';
import { Ticket } from '@/lib/types';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-pulse">🎟️</div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="text-8xl mb-6">🎟️</div>
          <h2 className="text-3xl font-black mb-4">ENTRADA NO ENCONTRADA</h2>
          <p className="text-gray-400">Esta entrada puede haber sido eliminada o no existe.</p>
        </div>
      </div>
    );
  }

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
  const sessionDateTime = sessionData?.SessionDateTime || new Date().toISOString();
  const hallName = hallData?.HallName || 'Sala';
  const seatRow = seatData?.RowNumber || 'A';
  const seatNumber = seatData?.SeatNumber || 1;
  const viewQuality = seatData?.ScreenViewInfo || 'Good';
  const acousticQuality = seatData?.AcousticProfile || 'Good';

  const formatDateTime = (dateTime: string | Date) => {
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    return {
      date: date.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const { date, time } = formatDateTime(sessionDateTime);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'from-green-500 to-emerald-600';
      case 'Good': return 'from-blue-500 to-blue-600';
      case 'Average': return 'from-yellow-500 to-orange-500';
      case 'Poor': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            margin: 0;
            background: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Action Buttons (Hidden on Print) */}
          <div className="no-print flex justify-center gap-4 mb-8">
            <button
              onClick={handlePrint}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-xl font-black transition-all duration-300 shadow-lg shadow-yellow-500/50 transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              IMPRIMIR ENTRADA
            </button>
          </div>

          {/* Ticket Card - Cinema Ticket Style */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-500">
            {/* Film strip perforations top */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-yellow-500 flex gap-2 px-2">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="flex-1 bg-black rounded-sm"></div>
              ))}
            </div>

            {/* Header with Brand - Cinema Marquee Style */}
            <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 px-10 py-8 text-center relative mt-4">
              <div className="mb-4">
                <div className="text-7xl mb-3 animate-pulse">🎬</div>
                <h1 className="text-4xl font-black text-black tracking-wider mb-2">ENTRADA DE CINE</h1>
                <p className="text-black text-sm font-bold tracking-widest">EXPERIENCIA CINEBOOK PREMIUM</p>
              </div>
            </div>

            {/* Movie and Ticket Info */}
            <div className="p-10">
              <h2 className="text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 mb-8 pb-6 border-b-4 border-yellow-500/30 tracking-wide">
                {movieName}
              </h2>

              {/* Session Details - Cinema Style Grid */}
              <div className="space-y-6 mb-10">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-yellow-500/50">
                  <p className="text-xs text-yellow-400 mb-2 font-black tracking-widest">FECHA Y HORA</p>
                  <p className="font-bold text-gray-300 text-lg">{date}</p>
                  <p className="text-3xl font-black text-white mt-2">{time}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-red-500/50">
                    <p className="text-xs text-red-400 mb-2 font-black tracking-widest">SALA</p>
                    <p className="text-3xl font-black text-white">{hallName}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-green-500/50">
                    <p className="text-xs text-green-400 mb-2 font-black tracking-widest">ASIENTO</p>
                    <p className="text-3xl font-black text-white">
                      {seatRow}{seatNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code - Large and Centered - Cinema Style */}
              <div className="mb-10">
                <div className="bg-gradient-to-br from-yellow-500/10 to-red-500/10 rounded-3xl p-8 border-4 border-yellow-500/50">
                  <p className="text-center text-sm text-yellow-400 mb-6 font-black tracking-widest">
                    ESCANEA EL CÓDIGO QR EN LA ENTRADA
                  </p>
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl blur opacity-50"></div>
                      <div className="relative bg-white p-6 rounded-2xl shadow-2xl">
                        <img
                          src={ticket.QRCode}
                          alt="QR Code"
                          className="w-64 h-64"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-lg text-gray-400 font-mono font-bold bg-gray-800 rounded-lg py-3">
                    {ticket.TicketCode}
                  </p>
                </div>
              </div>

              {/* Seat Quality Indicators - Cinema Style */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className={`bg-gradient-to-br ${getQualityColor(viewQuality)} text-white rounded-2xl p-6 mb-3 shadow-lg transform hover:scale-105 transition-transform`}>
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <p className="font-black text-2xl">{viewQuality === 'Excellent' ? 'Excelente' : viewQuality === 'Good' ? 'Buena' : viewQuality === 'Average' ? 'Regular' : 'Deficiente'}</p>
                  </div>
                  <p className="text-sm text-gray-400 font-bold tracking-wider">VISTA DE PANTALLA</p>
                </div>

                <div className="text-center">
                  <div className={`bg-gradient-to-br ${getQualityColor(acousticQuality)} text-white rounded-2xl p-6 mb-3 shadow-lg transform hover:scale-105 transition-transform`}>
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 0" />
                    </svg>
                    <p className="font-black text-2xl">{acousticQuality === 'Excellent' ? 'Excelente' : acousticQuality === 'Good' ? 'Buena' : acousticQuality === 'Average' ? 'Regular' : 'Deficiente'}</p>
                  </div>
                  <p className="text-sm text-gray-400 font-bold tracking-wider">ACÚSTICA</p>
                </div>
              </div>

              {/* Check-in Status - Cinema Badge Style */}
              <div className="text-center mb-8">
                {ticket.CheckInStatus ? (
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-full font-black text-xl shadow-2xl shadow-green-500/50">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    INGRESADO
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-full font-black text-xl shadow-2xl shadow-blue-500/50">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    LISTO PARA INGRESAR
                  </div>
                )}
              </div>

              {/* Important Notes - Cinema Alert Style */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 border-4 border-yellow-500/30 rounded-2xl p-6 text-center">
                <p className="text-lg text-yellow-400 font-black mb-2 tracking-wider">
                  ⚠️ LLEGA 15 MINUTOS ANTES
                </p>
                <p className="text-sm text-gray-400 font-semibold">
                  Puede que no se permita el ingreso después del inicio de la función
                </p>
              </div>
            </div>

            {/* Footer - Cinema Credits */}
            <div className="bg-gradient-to-r from-gray-900 to-black px-10 py-6 text-center border-t-4 border-yellow-500/30">
              <p className="text-gray-400 font-bold mb-1">Gracias por elegir CINEBOOK</p>
              <p className="text-gray-500 text-sm tracking-wider">¡DISFRUTA TU PELÍCULA! 🍿</p>
            </div>

            {/* Film strip perforations bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-yellow-500 flex gap-2 px-2">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="flex-1 bg-black rounded-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

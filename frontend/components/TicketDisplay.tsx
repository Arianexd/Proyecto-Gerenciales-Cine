'use client';

import { Ticket } from '@/lib/types';
import Link from 'next/link';

interface TicketDisplayProps {
  ticket: Ticket;
}

export default function TicketDisplay({ ticket }: TicketDisplayProps) {
  // Extract data from ticket
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
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
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
    <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-500">
      {/* Film strip perforations top */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex-1 bg-black rounded-sm"></div>
        ))}
      </div>

      {/* Ticket Header - Cinema Style */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎬</div>
            <div>
              <p className="text-white font-black text-lg tracking-wider">ENTRADA DE CINE</p>
              <p className="text-yellow-300 text-xs font-bold">PRESENTAR EN LA ENTRADA</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-300 text-xs font-bold">CÓDIGO</p>
            <p className="text-white font-mono font-black text-sm">{ticket.TicketCode.slice(-8)}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Movie Title - Cinema Style */}
        <h3 className="text-3xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 tracking-wide">
          {movieName}
        </h3>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column: Details */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1 font-bold">FECHA</p>
              <p className="font-bold text-white">{date}</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1 font-bold">HORA</p>
              <p className="font-black text-yellow-400 text-xl">{time}</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1 font-bold">SALA</p>
              <p className="font-bold text-white">{hallName}</p>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-yellow-600/20 rounded-lg p-3 border-2 border-red-500/50">
              <p className="text-yellow-400 text-xs mb-1 font-bold">ASIENTO</p>
              <p className="font-black text-white text-2xl">{seatRow}{seatNumber}</p>
            </div>
          </div>

          {/* Right Column: QR Code */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-yellow-500 to-red-500 rounded-xl blur opacity-50"></div>
              <div className="relative bg-white p-3 rounded-xl shadow-2xl">
                <img
                  src={ticket.QRCode}
                  alt="QR Code"
                  className="w-40 h-40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seat Quality Info - Cinema Style */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`bg-gradient-to-br ${getQualityColor(viewQuality)} px-4 py-3 rounded-lg shadow-lg`}>
            <p className="text-xs font-bold text-white/80">VISTA</p>
            <p className="font-black text-white">{viewQuality === 'Excellent' ? 'Excelente' : viewQuality === 'Good' ? 'Buena' : viewQuality === 'Average' ? 'Regular' : 'Deficiente'}</p>
          </div>
          <div className={`bg-gradient-to-br ${getQualityColor(acousticQuality)} px-4 py-3 rounded-lg shadow-lg`}>
            <p className="text-xs font-bold text-white/80">ACÚSTICA</p>
            <p className="font-black text-white">{acousticQuality === 'Excellent' ? 'Excelente' : acousticQuality === 'Good' ? 'Buena' : acousticQuality === 'Average' ? 'Regular' : 'Deficiente'}</p>
          </div>
        </div>

        {/* Check-in Status - Cinema Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {ticket.CheckInStatus ? (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-green-500/50">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-black">INGRESADO</span>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-black">PENDIENTE</span>
            </div>
          )}
        </div>

        {/* View Full Ticket Link - Cinema CTA */}
        <Link href={`/my-ticket/${ticket._id}`} target="_blank">
          <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-4 rounded-xl font-black transition-all shadow-lg shadow-red-500/30 transform hover:scale-105 flex items-center justify-center gap-2 tracking-wider">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            VER ENTRADA COMPLETA
          </button>
        </Link>
      </div>

      {/* Film strip perforations bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex-1 bg-black rounded-sm"></div>
        ))}
      </div>
    </div>
  );
}

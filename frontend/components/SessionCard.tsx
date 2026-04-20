'use client';

import Link from 'next/link';
import { MovieSession } from '@/lib/types';

interface SessionCardProps {
  session: MovieSession;
}

export default function SessionCard({ session }: SessionCardProps) {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const { date, time } = formatDateTime(session.SessionDateTime);
  const hallName = typeof session.HallID === 'object' ? session.HallID.HallName : 'Sala';

  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-gray-800 hover:border-red-600 p-6 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/50 overflow-hidden">
      {/* Film strip perforations top */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-500 flex gap-1 px-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex-1 bg-black rounded-sm"></div>
        ))}
      </div>

      {/* Ticket corner fold effect */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-red-600 to-transparent opacity-50"></div>

      {/* Time and Price Header */}
      <div className="flex items-center justify-between mb-5 mt-2">
        <div className="flex flex-col gap-1">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-lg text-xl font-black shadow-lg shadow-red-500/50 transform group-hover:scale-110 transition-transform">
            {time}
          </div>
          <div className="text-sm text-yellow-400 font-bold tracking-wider">{date}</div>
        </div>
        <div className="relative">
          <div className="absolute -inset-2 bg-yellow-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-black text-2xl shadow-lg shadow-yellow-500/50 transform group-hover:scale-110 transition-transform">
            ${session.Price}
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="font-bold text-white">{hallName}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-gray-400 bg-gray-800/30 rounded-lg px-3 py-2 text-sm">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="font-semibold">{session.Language}</span>
          </div>

          {session.SubtitleInfo && session.SubtitleInfo !== 'None' && (
            <div className="flex items-center gap-2 text-gray-400 bg-gray-800/30 rounded-lg px-3 py-2 text-sm">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="font-semibold text-xs">{session.SubtitleInfo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Book Now Button */}
      <Link href={`/booking/${session._id}`}>
        <button className="relative w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-red-500/50 transform group-hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span className="relative z-10 text-lg tracking-wider">RESERVAR YA</span>
        </button>
      </Link>

      {/* Film strip perforations bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-500 flex gap-1 px-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex-1 bg-black rounded-sm"></div>
        ))}
      </div>

      {/* Animated glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-yellow-500/10"></div>
      </div>
    </div>
  );
}

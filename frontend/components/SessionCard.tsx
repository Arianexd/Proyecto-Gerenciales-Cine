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
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="p-5">
        {/* Time & Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{time}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{date}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-red-600">${session.Price}</p>
            <p className="text-xs text-gray-400">por entrada</p>
          </div>

        </div>

        {/* Hall & Language */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">{hallName}</span>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex-1">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-xs font-semibold text-gray-600">{session.Language}</span>
            </div>

            {session.SubtitleInfo && session.SubtitleInfo !== 'None' && (
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="text-xs font-semibold text-gray-600">{session.SubtitleInfo}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <Link href={`/booking/${session._id}`}>
          <button className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Reservar entrada
          </button>
        </Link>
      </div>
    </div>
  );
}

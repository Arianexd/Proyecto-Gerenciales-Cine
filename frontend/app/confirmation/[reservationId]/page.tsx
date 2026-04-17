'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { reservationsApi, ticketsApi } from '@/lib/api';
import { Reservation, Ticket } from '@/lib/types';
import TicketDisplay from '@/components/TicketDisplay';
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
        ticketsApi.getAll()
      ]);

      setReservation(reservationRes.data);
      
      const reservationTickets = ticketsRes.data.filter((ticket: Ticket) => {
        const ticketResId = typeof ticket.ReservationID === 'object' 
          ? ticket.ReservationID._id 
          : ticket.ReservationID;
        return ticketResId === reservationId;
      });

      setTickets(reservationTickets);
    } catch (error) {
      console.error('Failed to fetch confirmation data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-pulse">🎟️</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!reservation) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🎬</div>
            <h2 className="text-3xl font-black text-white mb-4">RESERVATION NOT FOUND</h2>
          </div>
        </div>
      </>
    );
  }

  const movieName = typeof reservation.SessionID === 'object' && typeof reservation.SessionID.MovieID === 'object'
    ? reservation.SessionID.MovieID.MovieName
    : 'Movie';

  const moviePoster = typeof reservation.SessionID === 'object' && typeof reservation.SessionID.MovieID === 'object'
    ? reservation.SessionID.MovieID.PosterURL
    : '';

  return (
    <>
      <PublicNavigation />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Success Header - Cinema Style */}
          <div className="text-center mb-12">
            {/* Animated Success Icon */}
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-bounce">
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-block relative mb-4">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-600 via-yellow-500 to-green-600 blur-2xl opacity-50 animate-pulse"></div>
                <h1 className="relative text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 tracking-wider">
                  BOOKING CONFIRMED!
                </h1>
              </div>
            </div>

            <p className="text-2xl text-gray-300 font-bold mb-4">
              Your tickets are ready!
            </p>
            <p className="text-gray-400 text-lg">
              Show the QR code at the entrance to collect your tickets
            </p>
          </div>

          {/* Movie Info Banner - Cinema Style */}
          {moviePoster && (
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-yellow-500 p-8 mb-12 overflow-hidden">
              {/* Film strip decoration */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="flex-1 bg-black rounded-sm"></div>
                ))}
              </div>

              <div className="flex items-center gap-8 mt-3">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-br from-yellow-600 to-red-600 rounded-2xl opacity-50 blur"></div>
                    <img
                      src={moviePoster}
                      alt={movieName}
                      className="relative w-40 h-60 object-cover rounded-xl border-4 border-yellow-500 shadow-2xl"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl font-black text-white mb-4">{movieName}</h2>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-black text-lg shadow-lg shadow-green-500/50">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      CONFIRMED
                    </div>
                    <div className="text-gray-400 text-lg">
                      <span className="font-semibold">{tickets.length}</span> {tickets.length === 1 ? 'Ticket' : 'Tickets'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom film strip */}
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="flex-1 bg-black rounded-sm"></div>
                ))}
              </div>
            </div>
          )}

          {/* Tickets Display */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 mb-2 tracking-wider">
                YOUR TICKETS
              </h2>
              <p className="text-gray-400">Save or print these tickets for entry</p>
            </div>

            {tickets.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-red-600 p-12 text-center">
                <div className="text-6xl mb-4">🎟️</div>
                <p className="text-gray-400 text-lg">No tickets generated yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                  <TicketDisplay key={ticket._id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons - Cinema Style */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/">
              <button className="px-10 py-4 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white font-black text-lg rounded-xl border-4 border-gray-700 hover:border-yellow-500 transition-all duration-300 shadow-lg transform hover:scale-105 tracking-wider">
                ← BACK TO HOME
              </button>
            </Link>
            <Link href="/movies">
              <button className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-lg rounded-xl transition-all duration-300 shadow-2xl shadow-red-500/50 transform hover:scale-105 tracking-wider">
                BOOK MORE TICKETS
              </button>
            </Link>
          </div>

          {/* Important Notice - Cinema Style */}
          <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-red-500/10 border-4 border-yellow-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-black text-yellow-400 mb-4 flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              IMPORTANT INFORMATION
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Please arrive at least <strong className="text-white">15 minutes before</strong> the showtime</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Show your QR code at the entrance for quick check-in</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Latecomers may not be admitted after the movie starts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Please keep your tickets safe and do not share the QR codes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

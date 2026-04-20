'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { reservationsApi, paymentsApi, ticketsApi } from '@/lib/api';
import { Reservation } from '@/lib/types';
import PaymentForm from '@/components/PaymentForm';
import PublicNavigation from '@/components/PublicNavigation';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params.reservationId as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (reservationId) {
      fetchReservationData();
    }
  }, [reservationId]);

  const fetchReservationData = async () => {
    try {
      setLoading(true);
      const reservationRes = await reservationsApi.getById(reservationId);
      const reservationData = reservationRes.data;
      setReservation(reservationData);

      const storedSeats = localStorage.getItem(`reservation_${reservationId}_seats`);
      const seatCount = storedSeats ? JSON.parse(storedSeats).length : 1;
      const sessionPrice = typeof reservationData.SessionID === 'object' ? reservationData.SessionID.Price : 0;
      const total = seatCount * sessionPrice;
      setTotalAmount(total);
    } catch (error) {
      console.error('Failed to fetch reservation data:', error);
      toast.error('No se pudo cargar la información de la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    setSubmitting(true);

    try {
      const paymentPayload = {
        ReservationID: reservationId,
        PaymentMethod: 'Tarjeta de Crédito',
        Amount: totalAmount,
        PaymentStatus: 'Completed',
        ProcessingTime: new Date().toISOString()
      };

      await paymentsApi.create(paymentPayload);
      await reservationsApi.update(reservationId, { Status: 'PAID' });

      const storedSeats = localStorage.getItem(`reservation_${reservationId}_seats`);
      if (storedSeats) {
        const seatIds = JSON.parse(storedSeats);
        const QRCode = (await import('qrcode')).default;

        for (const seatId of seatIds) {
          const ticketCode = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
          const qrCodeData = await QRCode.toDataURL(ticketCode);

          await ticketsApi.create({
            ReservationID: reservationId,
            SeatID: seatId,
            TicketCode: ticketCode,
            QRCode: qrCodeData,
            CheckInStatus: false
          });
        }
      }

      toast.success('¡Pago exitoso! Generando tus entradas...');
      
      setTimeout(() => {
        router.push(`/confirmation/${reservationId}`);
      }, 1000);
    } catch (error) {
      console.error('Failed to process payment:', error);
      toast.error('El pago falló. Por favor, inténtalo de nuevo.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-pulse">💳</div>
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
            <h2 className="text-3xl font-black text-white mb-4">RESERVA NO ENCONTRADA</h2>
          </div>
        </div>
      </>
    );
  }

  const movieName = typeof reservation.SessionID === 'object' && typeof reservation.SessionID.MovieID === 'object'
    ? reservation.SessionID.MovieID.MovieName
    : 'Película';
  
  const moviePoster = typeof reservation.SessionID === 'object' && typeof reservation.SessionID.MovieID === 'object'
    ? reservation.SessionID.MovieID.PosterURL
    : '';

  const sessionDateTime = typeof reservation.SessionID === 'object' 
    ? reservation.SessionID.SessionDateTime 
    : new Date().toISOString();

  const storedSeats = localStorage.getItem(`reservation_${reservationId}_seats`);
  const seatCount = storedSeats ? JSON.parse(storedSeats).length : 0;

  return (
    <>
      <PublicNavigation />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header - Cinema Style */}
          <div className="text-center mb-12">
            <div className="inline-block relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 blur-2xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 tracking-wider">
                PAGO
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent to-red-500"></div>
              <p className="text-gray-400 text-lg font-bold tracking-widest">
                ★ PAGO SEGURO ★
              </p>
              <div className="h-1 w-24 bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary - Cinema Ticket Style */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-yellow-500 p-8 relative overflow-hidden">
              {/* Film strip top */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="flex-1 bg-black rounded-sm"></div>
                ))}
              </div>

              <h2 className="text-3xl font-black text-yellow-400 mb-6 mt-3 tracking-wider">RESUMEN DEL PEDIDO</h2>

              {/* Movie Poster & Details */}
              <div className="flex gap-6 mb-8">
                {moviePoster && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-br from-red-600 to-yellow-600 rounded-xl opacity-50 blur"></div>
                      <img
                        src={moviePoster}
                        alt={movieName}
                        className="relative w-32 h-48 object-cover rounded-xl border-4 border-yellow-500 shadow-2xl"
                      />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white mb-3">{movieName}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">{new Date(sessionDateTime).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">{new Date(sessionDateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400 font-semibold">Asientos Seleccionados</span>
                  <span className="text-white font-black text-xl">{seatCount}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400 font-semibold">Precio por Asiento</span>
                  <span className="text-white font-black text-xl">${(totalAmount / seatCount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-lg px-4 py-3 border-2 border-yellow-500/30">
                  <span className="text-yellow-400 font-black text-2xl tracking-wider">TOTAL</span>
                  <span className="text-yellow-400 font-black text-4xl">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-3 text-green-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">Pago Seguro</span>
              </div>

              {/* Film strip bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="flex-1 bg-black rounded-sm"></div>
                ))}
              </div>
            </div>

            {/* Payment Form - Cinema Style */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-red-600 p-8">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 mb-6 tracking-wider">
                DATOS DEL PAGO
              </h2>
              
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                totalAmount={totalAmount}
                isSubmitting={submitting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

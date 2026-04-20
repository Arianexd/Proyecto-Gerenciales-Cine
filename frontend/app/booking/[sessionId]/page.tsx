'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { sessionsApi, seatsApi, reservationsApi, customersApi, ticketsApi } from '@/lib/api';
import { MovieSession, Seat } from '@/lib/types';
import SeatGrid from '@/components/SeatGrid';
import SeatPreview from '@/components/SeatPreview';
import PublicNavigation from '@/components/PublicNavigation';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<MovieSession | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [guestInfo, setGuestInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const sessionRes = await sessionsApi.getById(sessionId);
      const sessionData = sessionRes.data;
      setSession(sessionData);

      // Get hall ID
      const hallId = typeof sessionData.HallID === 'object' ? sessionData.HallID._id : sessionData.HallID;
      
      // Fetch seats for this hall
      const seatsRes = await seatsApi.getAll();
      const hallSeats = seatsRes.data.filter((seat: Seat) => {
        const seatHallId = typeof seat.HallID === 'object' ? seat.HallID._id : seat.HallID;
        return seatHallId === hallId;
      });
      setSeats(hallSeats);

      // Fetch reserved seats
      const [ticketsRes, reservationsRes] = await Promise.all([
        ticketsApi.getAll(),
        reservationsApi.getAll()
      ]);

      const sessionReservations = reservationsRes.data.filter((reservation: any) => {
        const resSessionId = typeof reservation.SessionID === 'object' 
          ? reservation.SessionID._id 
          : reservation.SessionID;
        return resSessionId === sessionId;
      });

      const reservationIds = sessionReservations.map((r: any) => r._id);

      const sessionTickets = ticketsRes.data.filter((ticket: any) => {
        const ticketResId = typeof ticket.ReservationID === 'object'
          ? ticket.ReservationID._id
          : ticket.ReservationID;
        return reservationIds.includes(ticketResId);
      });

      const reservedSeatIds = sessionTickets.map((ticket: any) => 
        typeof ticket.SeatID === 'object' ? ticket.SeatID._id : ticket.SeatID
      );

      setReservedSeats(reservedSeatIds);
    } catch (error) {
      console.error('Failed to fetch session data:', error);
      toast.error('No se pudo cargar la información de la función');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      toast.error('Por favor selecciona al menos un asiento');
      return;
    }

    setSubmitting(true);

    try {
      const customerData = {
        Name: guestInfo.name,
        Surname: guestInfo.surname,
        Email: guestInfo.email,
        PhoneNumber: guestInfo.phone
      };

      const customerRes = await customersApi.create(customerData);
      const customerId = customerRes.data._id;

      const reservationData = {
        CustomerID: customerId,
        SessionID: sessionId,
        CreationTime: new Date().toISOString(),
        Status: 'CREATED'
      };

      const reservationRes = await reservationsApi.create(reservationData);
      const reservationId = reservationRes.data._id;

      localStorage.setItem(`reservation_${reservationId}_seats`, JSON.stringify(selectedSeats));

      toast.success('¡Reserva creada! Redirigiendo al pago...');
      
      setTimeout(() => {
        router.push(`/payment/${reservationId}`);
      }, 1000);
    } catch (error) {
      console.error('Failed to create reservation:', error);
      toast.error('No se pudo crear la reserva');
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
              <div className="text-4xl animate-pulse">🎬</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🎬</div>
            <h2 className="text-3xl font-black text-white mb-4">FUNCIÓN NO ENCONTRADA</h2>
          </div>
        </div>
      </>
    );
  }

  const movieName = typeof session.MovieID === 'object' ? session.MovieID.MovieName : 'Película';
  const hallName = typeof session.HallID === 'object' ? session.HallID.HallName : 'Sala';
  const hallCapacity = typeof session.HallID === 'object' ? session.HallID.Capacity : 100;
  const totalPrice = selectedSeats.length * session.Price;

  return (
    <>
      <PublicNavigation />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
        <div className="container mx-auto px-4">
          {/* Session Info Header - Cinema Ticket Style */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-red-600 p-8 mb-8 overflow-hidden">
            {/* Film strip decoration */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1">
              {[...Array(30)].map((_, i) => (
                <div key={i} className="flex-1 bg-black rounded-sm"></div>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 mb-6 mt-3 tracking-wider">
              {movieName}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
                <span className="text-gray-400 text-sm block mb-1">SALA</span>
                <span className="text-white font-black text-lg">{hallName}</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
                <span className="text-gray-400 text-sm block mb-1">FECHA</span>
                <span className="text-yellow-400 font-black text-lg">{new Date(session.SessionDateTime).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
                <span className="text-gray-400 text-sm block mb-1">HORA</span>
                <span className="text-yellow-400 font-black text-lg">{new Date(session.SessionDateTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
                <span className="text-gray-400 text-sm block mb-1">PRECIO/ASIENTO</span>
                <span className="text-green-400 font-black text-lg">${session.Price}</span>
              </div>
            </div>

            {/* Bottom film strip */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1">
              {[...Array(30)].map((_, i) => (
                <div key={i} className="flex-1 bg-black rounded-sm"></div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Seat Grid - Cinema Hall Style */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-gray-800 p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 mb-3 tracking-wider">
                  SELECCIONA TUS ASIENTOS
                </h2>
                <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-400 font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Pasa el cursor sobre los asientos para previsualizar la vista de pantalla y la calidad acústica
                  </p>
                </div>
              </div>
              <SeatGrid
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
                onSeatHover={setHoveredSeat}
                reservedSeats={reservedSeats}
              />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Seat Preview - Cinema Style */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-purple-600 p-6">
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                  VISTA PREVIA
                </h3>
                {hoveredSeat ? (
                  <div>
                    <p className="text-gray-400 font-bold mb-4 text-center bg-gray-800 rounded-lg py-2">
                      Fila {hoveredSeat.RowNumber} • Asiento {hoveredSeat.SeatNumber}
                    </p>
                    <SeatPreview
                      viewQuality={hoveredSeat.ScreenViewInfo}
                      acousticQuality={hoveredSeat.AcousticProfile}
                      hallCapacity={hallCapacity}
                      seatRow={hoveredSeat.RowNumber}
                      seatNumber={hoveredSeat.SeatNumber}
                      totalSeatsInRow={seats.filter(s => s.RowNumber === hoveredSeat.RowNumber).length}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-20 h-20 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <p className="text-sm font-semibold">Pasa el cursor sobre un asiento</p>
                  </div>
                )}
              </div>

              {/* Order Summary - Cinema Ticket Style */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-yellow-500 p-6">
                <h3 className="text-2xl font-black text-yellow-400 mb-4">RESUMEN DEL PEDIDO</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold">Asientos Seleccionados</span>
                    <span className="text-white font-black text-lg">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold">Precio por Asiento</span>
                    <span className="text-white font-black text-lg">${session.Price}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-lg px-4 border-2 border-yellow-500/30">
                    <span className="text-yellow-400 font-black text-lg">TOTAL</span>
                    <span className="text-yellow-400 font-black text-3xl">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm font-semibold text-center">
                      ✓ {selectedSeats.length} {selectedSeats.length === 1 ? 'asiento seleccionado' : 'asientos seleccionados'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guest Form - Cinema Ticket Checkout Style */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-4 border-red-600 p-8">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 mb-6 tracking-wider">
              REGISTRO DE INVITADO
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-yellow-400 font-black text-sm mb-2 tracking-wider">
                    NOMBRE
                  </label>
                  <input
                    type="text"
                    required
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-semibold focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="Ingresa tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-black text-sm mb-2 tracking-wider">
                    APELLIDO
                  </label>
                  <input
                    type="text"
                    required
                    value={guestInfo.surname}
                    onChange={(e) => setGuestInfo({ ...guestInfo, surname: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-semibold focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="Ingresa tu apellido"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-black text-sm mb-2 tracking-wider">
                    CORREO ELECTRÓNICO
                  </label>
                  <input
                    type="email"
                    required
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-semibold focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="tu.correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 font-black text-sm mb-2 tracking-wider">
                    TELÉFONO
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white font-semibold focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="+591 70000000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || selectedSeats.length === 0}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-black text-xl py-5 rounded-xl transition-all duration-300 shadow-2xl shadow-red-500/50 disabled:shadow-none transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    PROCESANDO...
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    CONTINUAR AL PAGO
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


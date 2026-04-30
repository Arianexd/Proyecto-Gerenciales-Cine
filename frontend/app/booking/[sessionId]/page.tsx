'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { meApi, sessionsApi, seatsApi, snackProductsApi } from '@/lib/api';
import { getStoredSession } from '@/lib/auth';
import { MovieSession, Seat } from '@/lib/types';
import SeatGrid from '@/components/SeatGrid';
import SeatPreview from '@/components/SeatPreview';
import PublicNavigation from '@/components/PublicNavigation';
import toast from 'react-hot-toast';

type SnackCategory = { _id: string; Name: string };
type SnackProduct = {
  _id: string;
  Name: string;
  Description?: string;
  Category: SnackCategory | string;
  SalePrice: number;
  Stock: number;
  ImageURL?: string;
  IsActive: boolean;
};
type CartItem = { product: SnackProduct; quantity: number };

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<MovieSession | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [snackProducts, setSnackProducts] = useState<SnackProduct[]>([]);
  const [snackCart, setSnackCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ Name: string; Surname: string; Email: string; PhoneNumber: string } | null>(null);
  const [accountChecked, setAccountChecked] = useState(false);

  const pendingSelectionKey = `pending_booking_${sessionId}`;
  const pendingSnackKey = `pending_snacks_${sessionId}`;

  const categoryEmoji = (name?: string) => {
    if (!name) return '🍫';
    const n = name.toLowerCase();
    if (n.includes('bebida')) return '🥤';
    if (n.includes('palomita')) return '🍿';
    if (n.includes('dulce')) return '🍬';
    if (n.includes('nacho') || n.includes('snack')) return '🌮';
    if (n.includes('combo')) return '🎁';
    return '🍫';
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
      restorePendingSeatSelection();
      fetchCustomerProfile();
    }
  }, [sessionId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (selectedSeats.length > 0) {
      window.localStorage.setItem(pendingSelectionKey, JSON.stringify(selectedSeats));
    } else {
      window.localStorage.removeItem(pendingSelectionKey);
    }
  }, [pendingSelectionKey, selectedSeats]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (snackCart.length > 0) {
      const minimal = snackCart.map((i) => ({ id: i.product._id, q: i.quantity }));
      window.localStorage.setItem(pendingSnackKey, JSON.stringify(minimal));
    } else {
      window.localStorage.removeItem(pendingSnackKey);
    }
  }, [pendingSnackKey, snackCart]);

  const restorePendingSeatSelection = () => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(pendingSelectionKey);
    if (!stored) return;
    try {
      setSelectedSeats(JSON.parse(stored));
    } catch {
      window.localStorage.removeItem(pendingSelectionKey);
    }
  };

  const fetchCustomerProfile = async () => {
    const session = getStoredSession();
    if (!session || session.user.Role !== 'CUSTOMER') {
      setCustomerInfo(null);
      setAccountChecked(true);
      return;
    }
    try {
      const response = await meApi.getProfile();
      setCustomerInfo(response.data);
    } catch {
      setCustomerInfo(null);
    } finally {
      setAccountChecked(true);
    }
  };

  const fetchSnackProducts = async () => {
    try {
      const response = await snackProductsApi.getAll({ active: true });
      const products: SnackProduct[] = response.data.filter((p: SnackProduct) => p.IsActive && p.Stock > 0);
      setSnackProducts(products);

      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem(pendingSnackKey);
        if (stored) {
          try {
            const parsed: { id: string; q: number }[] = JSON.parse(stored);
            const restored: CartItem[] = [];
            parsed.forEach(({ id, q }) => {
              const product = products.find((p) => p._id === id);
              if (product) restored.push({ product, quantity: Math.min(q, product.Stock) });
            });
            if (restored.length > 0) setSnackCart(restored);
          } catch {
            window.localStorage.removeItem(pendingSnackKey);
          }
        }
      }
    } catch {
      // Snack catalog requires auth — silently skip if not logged in
      setSnackProducts([]);
    }
  };

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const sessionRes = await sessionsApi.getById(sessionId);
      const sessionData = sessionRes.data;

      const now = new Date();
      const sessionDate = new Date(sessionData.SessionDateTime);
      if (sessionDate < now) {
        toast.error('Esta función ya ha pasado y no acepta más reservas.');
        router.push('/movies');
        return;
      }

      setSession(sessionData);

      const hallId = typeof sessionData.HallID === 'object' ? sessionData.HallID._id : sessionData.HallID;

      const [seatsRes, availabilityRes] = await Promise.all([
        seatsApi.getAll(hallId),
        sessionsApi.getAvailability(sessionId),
      ]);

      setSeats(seatsRes.data);
      setReservedSeats(availabilityRes.data.soldSeatIds);

      await fetchSnackProducts();
    } catch (error) {
      console.error('Failed to fetch session data:', error);
      toast.error('No se pudo cargar la información de la función');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const updateSnackQuantity = (product: SnackProduct, delta: number) => {
    setSnackCart((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (!existing) {
        if (delta <= 0) return prev;
        return [...prev, { product, quantity: 1 }];
      }
      const newQty = existing.quantity + delta;
      if (newQty <= 0) return prev.filter((i) => i.product._id !== product._id);
      if (newQty > product.Stock) {
        toast.error(`Stock disponible: ${product.Stock}`);
        return prev;
      }
      return prev.map((i) => (i.product._id === product._id ? { ...i, quantity: newQty } : i));
    });
  };

  const getCartQuantity = (productId: string) =>
    snackCart.find((i) => i.product._id === productId)?.quantity || 0;

  const redirectToLogin = () => {
    if (selectedSeats.length > 0 && typeof window !== 'undefined') {
      window.localStorage.setItem(pendingSelectionKey, JSON.stringify(selectedSeats));
    }
    router.push(`/account/login?redirect=${encodeURIComponent(`/booking/${sessionId}`)}`);
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Por favor selecciona al menos un asiento');
      return;
    }

    if (!customerInfo) {
      toast('Necesitas iniciar sesión como cliente para continuar con la compra.');
      redirectToLogin();
      return;
    }

    setSubmitting(true);

    try {
      const response = await meApi.createReservation({
        SessionID: sessionId,
        SeatIDs: selectedSeats,
      });

      const reservationId = response.data._id;

      if (snackCart.length > 0) {
        try {
          await meApi.createSnackSale({
            ReservationID: reservationId,
            Items: snackCart.map((i) => ({ ProductID: i.product._id, Quantity: i.quantity })),
          });
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(pendingSnackKey);
          }
          setSnackCart([]);
        } catch (snackError: any) {
          const message = snackError?.response?.data?.error || 'No se pudo procesar los snacks';
          toast.error(`Reserva creada, pero ${message.toLowerCase()}`);
        }
      }

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(pendingSelectionKey);
      }

      toast.success('Reserva creada. Ahora completa el pago.');
      router.push(`/payment/${reservationId}`);
    } catch (error: any) {
      const message = error?.response?.data?.error || 'No se pudo crear la reserva';
      toast.error(message);
      if (error?.response?.data?.soldSeatIds) {
        setReservedSeats((prev) => Array.from(new Set([...prev, ...error.response.data.soldSeatIds])));
        setSelectedSeats((prev) => prev.filter((seatId) => !error.response.data.soldSeatIds.includes(seatId)));
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Función no encontrada</h2>
            <Link href="/movies" className="text-red-600 font-semibold hover:underline">Ver cartelera</Link>
          </div>
        </div>
      </>
    );
  }

  const movieName = typeof session.MovieID === 'object' ? session.MovieID.MovieName : 'Película';
  const hallName = typeof session.HallID === 'object' ? session.HallID.HallName : 'Sala';
  const hallCapacity = typeof session.HallID === 'object' ? session.HallID.Capacity : 100;

  const ticketTotal = selectedSeats.length * session.Price;
  const snackTotal = snackCart.reduce((sum, i) => sum + (Number(i.product.SalePrice) || 0) * i.quantity, 0);
  const grandTotal = ticketTotal + snackTotal;

  return (
    <>
      <PublicNavigation />
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-10 pb-28 lg:pb-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

          {/* Header card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <p className="text-red-600 text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-1">Reserva tu función</p>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-5 line-clamp-2">{movieName}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-100">
                <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-0.5 sm:mb-1">Sala</span>
                <span className="text-gray-900 font-bold text-sm sm:text-base">{hallName}</span>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-100">
                <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-0.5 sm:mb-1">Fecha</span>
                <span className="text-gray-900 font-bold text-sm sm:text-base">{new Date(session.SessionDateTime).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-100">
                <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-0.5 sm:mb-1">Hora</span>
                <span className="text-gray-900 font-bold text-sm sm:text-base">{new Date(session.SessionDateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-100">
                <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-0.5 sm:mb-1">Precio</span>
                <span className="text-emerald-600 font-bold text-sm sm:text-base">Bs {session.Price}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Seats */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-3 sm:p-5 md:p-6 order-1">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Selecciona tus asientos</h2>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Pasa el cursor sobre los asientos para previsualizar la vista de pantalla y la calidad acústica.</p>
                <p className="text-xs text-gray-500 sm:hidden">Toca un asiento para seleccionarlo. Desliza horizontalmente si la sala es ancha.</p>
              </div>
              <SeatGrid
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
                onSeatHover={setHoveredSeat}
                reservedSeats={reservedSeats}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6 order-2">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6 hidden lg:block">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Vista previa</h3>
                {hoveredSeat ? (
                  <div>
                    <p className="text-gray-700 font-semibold mb-3 text-center bg-gray-50 rounded-lg py-2 border border-gray-100">
                      Fila {hoveredSeat.RowNumber} • Asiento {hoveredSeat.SeatNumber}
                    </p>
                    <SeatPreview
                      viewQuality={hoveredSeat.ScreenViewInfo}
                      acousticQuality={hoveredSeat.AcousticProfile}
                      hallCapacity={hallCapacity}
                      seatRow={hoveredSeat.RowNumber}
                      seatNumber={hoveredSeat.SeatNumber}
                      totalSeatsInRow={seats.filter((s) => s.RowNumber === hoveredSeat.RowNumber).length}
                      category={hoveredSeat.Category}
                      priceModifier={hoveredSeat.PriceModifier}
                      sessionPrice={session.Price}
                    />
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">Pasa el cursor sobre un asiento</p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Resumen del pedido</h3>
                {selectedSeats.length > 0 && (
                  <div className="mb-3 pb-3 border-b border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Asientos seleccionados</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeats.map((id) => {
                        const s = seats.find((x) => x._id === id);
                        if (!s) return null;
                        return (
                          <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                            {s.RowNumber}{s.SeatNumber}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Asientos × {selectedSeats.length}</span>
                    <span className="text-gray-900 font-semibold">Bs {ticketTotal.toFixed(2)}</span>
                  </div>
                  {snackCart.length > 0 && (
                    <>
                      {snackCart.map((item) => (
                        <div key={item.product._id} className="flex justify-between items-center py-1.5 text-xs">
                          <span className="text-gray-500">
                            {item.product.Name} × {item.quantity}
                          </span>
                          <span className="text-gray-700">Bs {((Number(item.product.SalePrice) || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 border-t border-gray-100">
                        <span className="text-gray-600">Snacks</span>
                        <span className="text-gray-900 font-semibold">Bs {snackTotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="text-red-600 font-extrabold text-2xl">Bs {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Snacks section */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 md:p-8 mb-4 sm:mb-6">
            <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 flex-wrap">
              <div>
                <p className="text-red-600 text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-1">Opcional</p>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Añade snacks a tu pedido</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Recoge tus snacks en el cine al presentar tu ticket.</p>
              </div>
              {snackCart.length > 0 && (
                <div className="bg-red-50 text-red-700 text-sm font-semibold rounded-full px-4 py-2 border border-red-100">
                  {snackCart.reduce((sum, i) => sum + i.quantity, 0)} producto(s) · Bs {snackTotal.toFixed(2)}
                </div>
              )}
            </div>

            {!customerInfo ? (
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-6 text-center">
                <p className="text-sm text-gray-600">Inicia sesión como cliente para añadir snacks a tu compra.</p>
              </div>
            ) : snackProducts.length === 0 ? (
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-6 text-center">
                <p className="text-sm text-gray-600">No hay snacks disponibles en este momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {snackProducts.map((product) => {
                  const qty = getCartQuantity(product._id);
                  return (
                    <div
                      key={product._id}
                      className={`rounded-xl border p-2.5 sm:p-4 flex flex-col transition-all ${
                        qty > 0 ? 'border-red-300 bg-red-50/40' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 mb-3 flex items-center justify-center overflow-hidden">
                        <span className="text-5xl sm:text-6xl" role="img" aria-label={product.Name}>
                          {categoryEmoji(typeof product.Category === 'string' ? undefined : product.Category?.Name)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{product.Name}</h3>
                      {product.Description && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.Description}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                        <span className="text-red-600 font-bold">Bs {(Number(product.SalePrice) || 0).toFixed(2)}</span>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => updateSnackQuantity(product, 1)}
                            className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-colors"
                          >
                            Añadir
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateSnackQuantity(product, -1)}
                              className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                              aria-label="Quitar uno"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-gray-900">{qty}</span>
                            <button
                              type="button"
                              onClick={() => updateSnackQuantity(product, 1)}
                              className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                              aria-label="Añadir uno"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
              {customerInfo ? 'Confirma tu compra' : 'Acceso requerido'}
            </h2>

            {!accountChecked ? (
              <p className="text-gray-500">Comprobando tu cuenta...</p>
            ) : customerInfo ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Cliente</p>
                    <p className="text-gray-900 font-semibold">{customerInfo.Name} {customerInfo.Surname}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Correo</p>
                    <p className="text-gray-900 font-semibold truncate">{customerInfo.Email}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Teléfono</p>
                    <p className="text-gray-900 font-semibold">{customerInfo.PhoneNumber}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={submitting || selectedSeats.length === 0}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-base md:text-lg py-4 rounded-xl transition-colors"
                >
                  {submitting ? 'Procesando...' : `Continuar al pago · Bs ${grandTotal.toFixed(2)}`}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-gray-600">
                  Para comprar entradas y snacks necesitas iniciar sesión como cliente. Así podemos guardar tu historial y habilitar tus valoraciones.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={redirectToLogin}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                  >
                    Iniciar sesión
                  </button>
                  <Link
                    href={`/account/register?redirect=${encodeURIComponent(`/booking/${sessionId}`)}`}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-center"
                  >
                    Crear cuenta
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile sticky bottom bar */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 leading-none">
                {selectedSeats.length} asiento{selectedSeats.length === 1 ? '' : 's'}
                {snackCart.length > 0 ? ` · ${snackCart.reduce((s, i) => s + i.quantity, 0)} snack(s)` : ''}
              </p>
              <p className="text-red-600 font-extrabold text-lg leading-tight">Bs {grandTotal.toFixed(2)}</p>
            </div>
            {customerInfo ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={submitting || selectedSeats.length === 0}
                className="flex-shrink-0 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                {submitting ? 'Procesando...' : 'Continuar'}
              </button>
            ) : (
              <button
                type="button"
                onClick={redirectToLogin}
                disabled={selectedSeats.length === 0}
                className="flex-shrink-0 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

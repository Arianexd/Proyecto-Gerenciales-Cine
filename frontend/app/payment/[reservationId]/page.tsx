"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import { meApi, reservationsApi } from "@/lib/api";
import { Reservation } from "@/lib/types";
import PublicNavigation from "@/components/PublicNavigation";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params.reservationId as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (reservationId) {
      fetchReservationData();
    }
  }, [reservationId]);

  useEffect(() => {
    if (!reservation) return;
    const payload = JSON.stringify({
      type: "CINEMABOOK_PAYMENT_DEMO",
      reservationId,
      amount: totalAmount,
      currency: "BOB",
      issuedAt: new Date().toISOString(),
    });
    QRCode.toDataURL(payload, { width: 320, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [reservation, reservationId, totalAmount]);

  const fetchReservationData = async () => {
    try {
      setLoading(true);
      const reservationRes = await reservationsApi.getById(reservationId);
      const reservationData = reservationRes.data;
      setReservation(reservationData);

      const seatCount = reservationData.SeatIDs?.length || 1;
      const sessionPrice =
        typeof reservationData.SessionID === "object"
          ? reservationData.SessionID.Price
          : 0;
      setTotalAmount(seatCount * sessionPrice);
    } catch (error) {
      toast.error("No se pudo cargar la información de la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDemoPayment = async () => {
    setSubmitting(true);
    try {
      await meApi.payReservationByQr(reservationId);
      toast.success("Pago de demostración registrado. Tus entradas fueron generadas.");
      router.push(`/confirmation/${reservationId}`);
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "No se pudo registrar el pago de demostración.";
      toast.error(message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!reservation) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Reserva no encontrada</h2>
          </div>
        </div>
      </>
    );
  }

  const movieName =
    typeof reservation.SessionID === "object" &&
    typeof reservation.SessionID.MovieID === "object"
      ? reservation.SessionID.MovieID.MovieName
      : "Película";

  const sessionDateTime =
    typeof reservation.SessionID === "object"
      ? reservation.SessionID.SessionDateTime
      : new Date().toISOString();

  const seatCount = reservation.SeatIDs?.length || 0;

  return (
    <>
      <PublicNavigation />
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-2">
              Pago con QR · Modo demostración
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Escanea para pagar
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Esta es una pasarela simulada. Pulsa &ldquo;Confirmar pago&rdquo; para registrar
              la reserva como pagada y generar tus entradas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen del pedido</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Película</span>
                  <span className="text-gray-900 font-semibold text-right">{movieName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Función</span>
                  <span className="text-gray-900 font-semibold text-right">
                    {new Date(sessionDateTime).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Asientos</span>
                  <span className="text-gray-900 font-semibold">{seatCount}</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-gray-200">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-red-600 font-extrabold text-2xl">
                    Bs {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
                Esta es una pasarela de pago de prueba. No se procesa ningún cargo real.
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col items-center">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Código QR de pago</h2>
              <div className="rounded-2xl border-4 border-dashed border-red-200 p-4 bg-white">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="QR de pago de demostración"
                    className="w-64 h-64 object-contain"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center text-gray-400 text-sm">
                    Generando QR...
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center max-w-xs">
                Escanea con cualquier app de banca móvil (demo). El pago se simulará al
                confirmar abajo.
              </p>

              <button
                type="button"
                onClick={handleConfirmDemoPayment}
                disabled={submitting}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
              >
                {submitting ? "Registrando pago..." : `Confirmar pago · Bs ${totalAmount.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

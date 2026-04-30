'use client';

import { useState, useEffect, useRef } from 'react';
import { reservationsApi, customersApi, sessionsApi, seatsApi, ticketsApi } from '@/lib/api';
import { Reservation, Customer, MovieSession, Seat } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import SeatGrid from '@/components/SeatGrid';
import SeatPreview from '@/components/SeatPreview';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import { getStoredSession } from '@/lib/auth';

export default function ReservationsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    setCurrentUser(getStoredSession()?.user || null);
  }, []);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sessions, setSessions] = useState<MovieSession[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [selectedSession, setSelectedSession] = useState<MovieSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeatSelectionModalOpen, setIsSeatSelectionModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientSugg, setShowClientSugg] = useState(false);
  const [sessionSearch, setSessionSearch] = useState('');
  const [showSessionSugg, setShowSessionSugg] = useState(false);
  const clientAutocompleteRef = useRef<HTMLDivElement | null>(null);
  const sessionAutocompleteRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState({
    CustomerID: '',
    SessionID: '',
    Status: 'CREATED' as 'CREATED' | 'PAID' | 'CANCELLED',
  });

  // Nuevos estados para filtros y búsqueda
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (clientAutocompleteRef.current && !clientAutocompleteRef.current.contains(target)) {
        setShowClientSugg(false);
      }
      if (sessionAutocompleteRef.current && !sessionAutocompleteRef.current.contains(target)) {
        setShowSessionSugg(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedReservation) {
      const customer = selectedReservation.CustomerID;
      const session = selectedReservation.SessionID;

      if (customer && typeof customer === 'object') {
        setClientSearch(`${customer.Name} ${customer.Surname} - CI: ${customer.CI || 'N/A'}`);
      } else {
        setClientSearch('');
      }

      if (session && typeof session === 'object' && typeof session.MovieID === 'object') {
        setSessionSearch(`${session.MovieID.MovieName} - ${formatDateTime(session.SessionDateTime)}`);
      } else {
        setSessionSearch('');
      }
    } else {
      setClientSearch('');
      setSessionSearch('');
    }

    setShowClientSugg(false);
    setShowSessionSugg(false);
  }, [selectedReservation]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservationsRes, customersRes, sessionsRes] = await Promise.all([
        reservationsApi.getAll(),
        customersApi.getAll(),
        sessionsApi.getAll(),
      ]);
      setReservations(reservationsRes.data);
      setCustomers(customersRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      toast.error('No se pudieron cargar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (reservation?: Reservation) => {
    if (reservation) {
      setSelectedReservation(reservation);
      setFormData({
        CustomerID: typeof reservation.CustomerID === 'object' ? reservation.CustomerID._id : reservation.CustomerID,
        SessionID: typeof reservation.SessionID === 'object' ? reservation.SessionID._id : reservation.SessionID,
        Status: reservation.Status,
      });
    } else {
      setSelectedReservation(null);
      setFormData({
        CustomerID: '',
        SessionID: '',
        Status: 'CREATED',
      });
      setClientSearch('');
      setSessionSearch('');
    }
    setShowClientSugg(false);
    setShowSessionSugg(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
    setShowClientSugg(false);
    setShowSessionSugg(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedReservation) {
        await reservationsApi.update(selectedReservation._id, formData);
        toast.success('Reserva actualizada correctamente');
        handleCloseModal();
        fetchData();
      } else {
        // Para nuevas reservas, continuar con la selección de asientos
        if (!formData.SessionID) {
          toast.error('Por favor selecciona una función');
          return;
        }

        // Obtener asientos de la sala de la función seleccionada
        const session = sessions.find(s => s._id === formData.SessionID);
        if (!session) {
          toast.error('Función no encontrada');
          return;
        }
        
        setSelectedSession(session);
        const hallId = typeof session.HallID === 'object' ? session.HallID._id : session.HallID;
        const seatsRes = await seatsApi.getAll(hallId);
        setSeats(seatsRes.data);
        
        // Fetch already reserved seats for this session
        const allTickets = await ticketsApi.getAll();
        const sessionReservedSeats = allTickets.data
          .filter((ticket: any) => {
            const ticketSession = ticket.ReservationID?.SessionID;
            const sessionId = typeof ticketSession === 'object' ? ticketSession._id : ticketSession;
            return sessionId === formData.SessionID;
          })
          .map((ticket: any) => typeof ticket.SeatID === 'object' ? ticket.SeatID._id : ticket.SeatID);
        
        setReservedSeats(sessionReservedSeats);
        setSelectedSeats([]);
        setIsModalOpen(false);
        setIsSeatSelectionModalOpen(true);
      }
    } catch (error) {
      toast.error('La operación falló');
      console.error(error);
    }
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleConfirmReservation = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Por favor selecciona al menos un asiento');
      return;
    }

    try {
      // Crear reserva con los asientos seleccionados guardados
      const reservationData = {
        ...formData,
        SeatIDs: selectedSeats,
      };

      const reservationRes = await reservationsApi.create(reservationData);
      const newReservation = reservationRes.data;

      // Guardar asientos seleccionados temporalmente en localStorage (para generar tickets tras el pago)
      localStorage.setItem(`reservation_${newReservation._id}_seats`, JSON.stringify(selectedSeats));

      toast.success(`¡Reserva creada! Procesa el pago para generar los tickets.`);
      setIsSeatSelectionModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('No se pudo completar la reserva');
      console.error(error);
    }
  };

  const handleDeleteClick = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reservationToDelete) return;

    try {
      await reservationsApi.delete(reservationToDelete._id);
      toast.success('Reserva eliminada correctamente');
      fetchData();
    } catch (error) {
      toast.error('No se pudo eliminar la reserva');
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setReservationToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      CREATED: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };

    const labels: Record<string, string> = {
      CREATED: 'CREADA',
      PAID: 'PAGADA',
      CANCELLED: 'CANCELADA',
    };

    return (
      <span
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const formatDateTime = (dateTime: string | Date | null | undefined) => {
    if (!dateTime) return 'Sin fecha';
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCustomerName = (customer: Customer | string | null | undefined) => {
    if (customer && typeof customer === 'object' && 'Name' in customer) {
      return `${customer.Name} ${customer.Surname}`;
    }
    return 'Sin cliente';
  };

  // Función para detectar expiración (Mejora 3)
  const isExpired = (creationTime: string) => {
    const diff = (new Date().getTime() - new Date(creationTime).getTime()) / 60000;
    return diff > 15; // 15 minutos
  };

  const getMovieName = (session: MovieSession | string | null | undefined) => {
    if (session && typeof session === 'object' && 'MovieID' in session && session.MovieID && typeof session.MovieID === 'object' && 'MovieName' in session.MovieID) {
      return (session.MovieID as any).MovieName;
    }
    return 'Sin película';
  };

  // Lógica de filtrado y búsqueda (Mejoras 1, 3 y 4)
  const filteredReservations = reservations.filter((r) => {
    // Filtro por Estado (Mejora 1)
    const matchesStatus = statusFilter === 'ALL' ? true : r.Status === statusFilter;
    
    // Buscador Global (Mejora 4)
    const q = globalSearch.toLowerCase();
    const customerName = getCustomerName(r.CustomerID).toLowerCase();
    const movieName = getMovieName(r.SessionID).toLowerCase();
    const ci = r.CustomerID && typeof r.CustomerID === 'object' ? (r.CustomerID.CI || '').toLowerCase() : '';
    const matchesSearch = customerName.includes(q) || movieName.includes(q) || ci.includes(q);

    return matchesStatus && matchesSearch;
  });

  const getSessionDateTime = (session: MovieSession | string | null | undefined) => {
    if (session && typeof session === 'object' && 'SessionDateTime' in session) {
      return formatDateTime(session.SessionDateTime);
    }
    return 'Sin horario';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
        {currentUser?.Role === 'CAJERO' && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Agregar Reserva
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Nueva Interfaz de Filtros y Búsqueda */}
          <div className="bg-white p-4 rounded-t-lg border-b flex flex-col md:flex-row justify-between gap-4">
            {/* Filtros de Estado */}
            <div className="flex gap-2">
              {[
                { value: 'ALL', label: 'TODAS' },
                { value: 'CREATED', label: 'CREADA' },
                { value: 'PAID', label: 'PAGADA' },
                { value: 'CANCELLED', label: 'CANCELADA' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    statusFilter === filter.value ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Buscador Global */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar por cliente, CI o película..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Película
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario de Función
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {reservations.length === 0 ? 'No se encontraron reservas. ¡Agrega tu primera reserva!' : 'No se encontraron reservas con los filtros actuales.'}
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => (
                    <tr key={reservation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getCustomerName(reservation.CustomerID)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getMovieName(reservation.SessionID)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getSessionDateTime(reservation.SessionID)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(reservation.CreationTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(reservation.Status)}
                        {reservation.Status === 'CREATED' && isExpired(reservation.CreationTime) && (
                          <span className="ml-2 animate-pulse inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                            ⚠️ EXPIRADA
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/reservations/${reservation._id}`}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          Ver Detalles
                        </Link>
                        <button
                          onClick={() => handleOpenModal(reservation)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(reservation)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedReservation ? 'Editar Reserva' : 'Agregar Nueva Reserva'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative" ref={clientAutocompleteRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input
                type="text"
                placeholder="Buscar cliente por nombre, apellido o CI..."
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setShowClientSugg(true);
                }}
                onFocus={() => setShowClientSugg(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                disabled={!!selectedReservation}
                required
              />

              {showClientSugg && !selectedReservation && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {customers
                    .filter((c) => {
                      const q = clientSearch.toLowerCase();
                      const fullName = `${c.Name} ${c.Surname}`.toLowerCase();
                      const ci = (c.CI || '').toLowerCase();
                      return fullName.includes(q) || ci.includes(q);
                    })
                    .map((customer) => (
                      <div
                        key={customer._id}
                        className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm border-b last:border-none"
                        onClick={() => {
                          setFormData({ ...formData, CustomerID: customer._id });
                          setClientSearch(`${customer.Name} ${customer.Surname} - CI: ${customer.CI}`);
                          setShowClientSugg(false);
                        }}
                      >
                        <span className="font-medium">{customer.Name} {customer.Surname}</span>
                        <div className="text-xs text-gray-400">CI: {customer.CI} | {customer.Email}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="relative" ref={sessionAutocompleteRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funcion (Pelicula y Horario)</label>
              <input
                type="text"
                placeholder="Buscar por nombre de pelicula..."
                value={sessionSearch}
                onChange={(e) => {
                  setSessionSearch(e.target.value);
                  setShowSessionSugg(true);
                }}
                onFocus={() => setShowSessionSugg(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                disabled={!!selectedReservation}
                required
              />

              {showSessionSugg && !selectedReservation && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {sessions
                    .filter((s) => {
                      const movieName = typeof s.MovieID === 'object' ? s.MovieID.MovieName : '';
                      return movieName.toLowerCase().includes(sessionSearch.toLowerCase());
                    })
                    .map((session) => {
                      const movieName = typeof session.MovieID === 'object' ? session.MovieID.MovieName : 'Pelicula';
                      const time = formatDateTime(session.SessionDateTime);

                      return (
                        <div
                          key={session._id}
                          className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm border-b last:border-none"
                          onClick={() => {
                            setFormData({ ...formData, SessionID: session._id });
                            setSessionSearch(`${movieName} - ${time}`);
                            setShowSessionSugg(false);
                            setSelectedSeats([]);
                          }}
                        >
                          <div className="font-semibold">{movieName}</div>
                          <div className="text-xs text-emerald-600 font-medium">
                            {time} - {typeof session.HallID === 'object' ? session.HallID.HallName : 'Sala'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado de Reserva
              </label>
              <select
                required
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="CREATED">CREADA</option>
                <option value="PAID">PAGADA</option>
                <option value="CANCELLED">CANCELADA</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            >
              {selectedReservation ? 'Actualizar' : 'Crear'} Reserva
            </button>
          </div>
        </form>
      </Modal>

      {/* Seat Selection Modal */}
      <Modal
        isOpen={isSeatSelectionModalOpen}
        onClose={() => {
          setIsSeatSelectionModalOpen(false);
          setHoveredSeat(null);
        }}
        title={`Seleccionar Asientos - ${selectedSession && typeof selectedSession.MovieID === 'object' ? selectedSession.MovieID.MovieName : 'Película'}`}
        size="full"
      >
        <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 mb-1">
                <strong className="text-purple-700">Asientos Seleccionados:</strong> {selectedSeats.length}
              </p>
              <p className="text-sm text-gray-600">
                Haz clic en los asientos disponibles para seleccionarlos. Pasa el cursor sobre un asiento para ver la vista y el perfil acústico.
              </p>
            </div>
            <div className="text-right">
              {selectedSession && (
                <div className="text-sm font-medium text-gray-700">
                  <div>Precio Base: {selectedSession.Price} Bs</div>
                  <div className="text-lg font-bold text-purple-700">
                    Total: {(selectedSession.Price * selectedSeats.length) + selectedSeats.reduce((sum, seatId) => {
                      const seat = seats.find(s => s._id === seatId);
                      return sum + (seat?.PriceModifier || 0);
                    }, 0)} Bs
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout: Seat Grid + Preview - FIXED HEIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: '700px', maxHeight: '70vh' }}>
          {/* Seat Grid Column */}
          <div className="order-2 lg:order-1 h-full">
            <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto h-full">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Selecciona tus Asientos</h3>
              <SeatGrid
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
                onSeatHover={setHoveredSeat}
                reservedSeats={reservedSeats}
                showCategories={true}
              />
            </div>
          </div>

          {/* Preview Column - FIXED HEIGHT */}
          <div className="order-1 lg:order-2 h-full">
            <div className="bg-white rounded-lg border-2 border-purple-300 p-4 shadow-lg overflow-y-auto h-full">
              {hoveredSeat ? (
                <>
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <h4 className="text-xl font-bold text-gray-900">
                      Fila {hoveredSeat.RowNumber}, Asiento {hoveredSeat.SeatNumber}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Pasa el cursor sobre los asientos para comparar la calidad
                    </p>
                  </div>
                  <div>
                    <SeatPreview
                      viewQuality={hoveredSeat.ScreenViewInfo}
                      acousticQuality={hoveredSeat.AcousticProfile}
                      hallCapacity={selectedSession && typeof selectedSession.HallID === 'object' ? selectedSession.HallID.Capacity : 100}
                      seatRow={hoveredSeat.RowNumber}
                      seatNumber={hoveredSeat.SeatNumber}
                      totalSeatsInRow={seats.filter(s => s.RowNumber === hoveredSeat.RowNumber).length}
                      category={hoveredSeat.Category}
                      priceModifier={hoveredSeat.PriceModifier}
                      sessionPrice={selectedSession && typeof selectedSession === 'object' ? selectedSession.Price : 0}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-24 h-24 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-xl font-medium text-gray-700">Vista Previa del Asiento</p>
                  <p className="text-sm mt-2 text-center px-4">
                    Pasa el cursor sobre cualquier asiento a la izquierda para ver información detallada de la vista y calidad acústica
                  </p>
                  <div className="mt-6 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Asientos disponibles</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Tu selección</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-red-500 rounded opacity-50"></div>
                      <span>Ya reservados</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex justify-between items-center border-t pt-6 mt-6 bg-white sticky bottom-0">
          <div className="text-sm text-gray-600">
            {hoveredSeat ? (
              <span className="text-purple-600 font-medium">
                👆 Pasa el cursor sobre los asientos para ver la vista y el perfil acústico
              </span>
            ) : (
              <span>💡 Pasa el cursor sobre un asiento para previsualizar su calidad</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsSeatSelectionModalOpen(false);
                setHoveredSeat(null);
              }}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmReservation}
              disabled={selectedSeats.length === 0}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-purple-200 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Confirmar Reserva ({selectedSeats.length} asientos)
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Reserva"
        message="¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { seatsApi, hallsApi } from '@/lib/api';
import { Seat, Hall } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function HallSeatsPage() {
  const params = useParams();
  const router = useRouter();
  const hallId = params.id as string;

  const [hall, setHall] = useState<Hall | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isGenerateConfirmOpen, setIsGenerateConfirmOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seatToDelete, setSeatToDelete] = useState<Seat | null>(null);
  const [generating, setGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'quality' | 'category'>('quality');

  const [formData, setFormData] = useState({
    RowNumber: '',
    SeatNumber: '',
    ScreenViewInfo: '',
    AcousticProfile: '',
    Category: 'Standard',
    PriceModifier: 0,
  });

  useEffect(() => {
    fetchData();
  }, [hallId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hallRes, seatsRes] = await Promise.all([
        hallsApi.getById(hallId),
        seatsApi.getAll(),
      ]);
      setHall(hallRes.data);
      setSeats(seatsRes.data.filter((seat: Seat) => 
        (typeof seat.HallID === 'object' ? seat.HallID._id : seat.HallID) === hallId
      ));
    } catch (error) {
      toast.error('No se pudieron cargar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (seat?: Seat) => {
    if (seat) {
      setSelectedSeat(seat);
      setFormData({
        RowNumber: seat.RowNumber,
        SeatNumber: seat.SeatNumber.toString(),
        ScreenViewInfo: seat.ScreenViewInfo,
        AcousticProfile: seat.AcousticProfile,
        Category: seat.Category || 'Standard',
        PriceModifier: seat.PriceModifier || 0,
      });
    } else {
      setSelectedSeat(null);
      setFormData({
        RowNumber: '',
        SeatNumber: '',
        ScreenViewInfo: '',
        AcousticProfile: '',
        Category: 'Standard',
        PriceModifier: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSeat(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        HallID: hallId,
        RowNumber: formData.RowNumber,
        SeatNumber: parseInt(formData.SeatNumber),
        ScreenViewInfo: formData.ScreenViewInfo,
        AcousticProfile: formData.AcousticProfile,
        Category: formData.Category,
        PriceModifier: parseFloat(formData.PriceModifier.toString()),
      };

      if (selectedSeat) {
        await seatsApi.update(selectedSeat._id, data);
        toast.success('Asiento actualizado correctamente');
      } else {
        await seatsApi.create(data);
        toast.success('Asiento agregado correctamente');
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error('La operación falló');
      console.error(error);
    }
  };

  const handleDeleteClick = (seat: Seat) => {
    setSeatToDelete(seat);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!seatToDelete) return;

    try {
      await seatsApi.delete(seatToDelete._id);
      toast.success('Asiento eliminado correctamente');
      fetchData();
    } catch (error) {
      toast.error('No se pudo eliminar el asiento');
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setSeatToDelete(null);
    }
  };

  const handleGenerateSeats = async () => {
    if (!hall) return;

    try {
      setGenerating(true);
      setIsGenerateConfirmOpen(false);

      const capacity = hall.Capacity;
      const seatsPerRow = 10; // Default 10 seats per row
      const totalRows = Math.ceil(capacity / seatsPerRow);

      toast.loading('Generando asientos...', { id: 'generate' });

      // Generate seats
      for (let row = 0; row < totalRows; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, ...
        const seatsInThisRow = Math.min(seatsPerRow, capacity - (row * seatsPerRow));

        for (let seat = 1; seat <= seatsInThisRow; seat++) {
          // Determine position-based quality using enum values
          let screenViewInfo: 'Excellent' | 'Good' | 'Average' | 'Poor' = 'Average';
          let acousticProfile: 'Excellent' | 'Good' | 'Average' | 'Poor' = 'Average';

          // Row position (front, middle, back)
          const rowPosition = row / totalRows;
          
          // Seat position (left, center, right)
          const seatPosition = seat / seatsInThisRow;
          const isCenterSeat = seatPosition >= 0.3 && seatPosition <= 0.7;

          // Calculate quality based on position
          // Middle rows are best (0.3 - 0.7 of total rows)
          if (rowPosition >= 0.3 && rowPosition <= 0.7) {
            if (isCenterSeat) {
              screenViewInfo = 'Excellent';
              acousticProfile = 'Excellent';
            } else {
              screenViewInfo = 'Good';
              acousticProfile = 'Good';
            }
          } else if (rowPosition < 0.3) {
            // Front rows - too close
            if (isCenterSeat) {
              screenViewInfo = 'Good';
              acousticProfile = 'Good';
            } else {
              screenViewInfo = 'Average';
              acousticProfile = 'Average';
            }
          } else {
            // Back rows - too far
            if (isCenterSeat) {
              screenViewInfo = 'Good';
              acousticProfile = 'Good';
            } else {
              screenViewInfo = 'Poor';
              acousticProfile = 'Poor';
            }
          }

          await seatsApi.create({
            HallID: hallId,
            RowNumber: rowLetter,
            SeatNumber: seat,
            ScreenViewInfo: screenViewInfo,
            AcousticProfile: acousticProfile,
          });
        }
      }

      toast.success(`¡Se generaron ${capacity} asientos correctamente!`, { id: 'generate' });
      fetchData();
    } catch (error) {
      toast.error('No se pudieron generar los asientos', { id: 'generate' });
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleClearAllSeats = async () => {
    try {
      setIsClearConfirmOpen(false);
      toast.loading('Eliminando todos los asientos...', { id: 'clear' });

      // Delete all seats for this hall
      for (const seat of seats) {
        await seatsApi.delete(seat._id);
      }

      toast.success(`¡Se eliminaron ${seats.length} asientos correctamente!`, { id: 'clear' });
      fetchData();
    } catch (error) {
      toast.error('No se pudieron eliminar los asientos', { id: 'clear' });
      console.error(error);
    }
  };

  const groupSeatsByRow = () => {
    const grouped: { [key: string]: Seat[] } = {};
    seats.forEach(seat => {
      if (!grouped[seat.RowNumber]) {
        grouped[seat.RowNumber] = [];
      }
      grouped[seat.RowNumber].push(seat);
    });
    
    // Sort seats within each row by SeatNumber
    Object.keys(grouped).forEach(row => {
      grouped[row].sort((a, b) => a.SeatNumber - b.SeatNumber);
    });
    
    return grouped;
  };

  const groupedSeats = groupSeatsByRow();
  const rows = Object.keys(groupedSeats).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push('/admin/halls')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
          >
            ← Volver a Salas
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {hall?.HallName} - Gestión de Asientos
          </h1>
          <p className="text-gray-600 mt-1">
            Capacidad Total: <span className="font-semibold">{hall?.Capacity}</span> |
            Asientos Actuales: <span className="font-semibold">{seats.length}</span>
            {seats.length < (hall?.Capacity || 0) && (
              <span className="ml-2 text-orange-600">
                ({(hall?.Capacity || 0) - seats.length} asientos restantes)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {seats.length > 0 && (
            <button
              onClick={() => setIsClearConfirmOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Borrar Todos los Asientos
            </button>
          )}
          {seats.length === 0 && (
            <button
              onClick={() => setIsGenerateConfirmOpen(true)}
              disabled={generating || !hall?.Capacity}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {generating ? 'Generando...' : 'Generar Asientos'}
            </button>
          )}
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Asiento
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Info Card */}
          {seats.length === 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aún no hay asientos configurados</h3>
                  <p className="text-gray-700 mb-3">
                    Puedes agregar asientos manualmente o usar la función "Generar Asientos" para crear automáticamente
                    {' '}{hall?.Capacity} asientos con ubicación inteligente.
                  </p>
                  <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                    <p className="font-medium text-gray-900">La generación automática incluye:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li><span className="font-semibold text-green-600">Excelente:</span> Filas intermedias, asientos centrales (zona óptima)</li>
                      <li><span className="font-semibold text-blue-600">Buena:</span> Filas intermedias laterales, asientos centrales de delante/atrás</li>
                      <li><span className="font-semibold text-yellow-600">Regular:</span> Asientos laterales de la primera fila</li>
                      <li><span className="font-semibold text-red-600">Deficiente:</span> Asientos laterales de la última fila</li>
                      <li>Identificación automática de filas (A, B, C...)</li>
                      <li>10 asientos por fila por defecto</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seat Matrix View */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setViewMode('quality')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewMode === 'quality' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Vista y Sonido
                </button>
                <button
                  onClick={() => setViewMode('category')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewMode === 'category' 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Categorías y Precios
                </button>
              </div>

              <div className="bg-gray-800 text-white px-12 py-3 rounded-t-3xl text-sm font-semibold order-first md:order-none">
                🎬 PANTALLA
              </div>

              <div className="w-[200px] hidden md:block"></div>
            </div>

            {/* Legend */}
            {seats.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {viewMode === 'quality' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">Excelente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">Buena</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-yellow-500 rounded shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">Regular</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-500 rounded shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">Deficiente</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-amber-500 rounded shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">VIP (+15 Bs)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-600 rounded shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">Premium (+5 Bs)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-500 rounded shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">Estándar (+0 Bs)</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {rows.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Aún no hay asientos configurados. Haz clic en "Agregar Asiento" para empezar a construir tu distribución de asientos.
              </div>
            ) : (
              <div className="space-y-4">
                {rows.map((rowNumber) => (
                  <div key={rowNumber} className="flex items-center justify-center gap-2">
                    {/* Row Label */}
                    <div className="w-8 text-center font-bold text-gray-600">
                      {rowNumber}
                    </div>

                    {/* Seats in Row */}
                    <div className="flex gap-2">
                      {groupedSeats[rowNumber].map((seat) => {
                        // Color based on quality
                        const getSeatColor = (seat: Seat) => {
                          if (viewMode === 'quality') {
                            switch (seat.ScreenViewInfo) {
                              case 'Excellent': return 'bg-green-500 hover:bg-green-600 shadow-green-100';
                              case 'Good': return 'bg-blue-500 hover:bg-blue-600 shadow-blue-100';
                              case 'Average': return 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-100';
                              case 'Poor': return 'bg-red-500 hover:bg-red-600 shadow-red-100';
                              default: return 'bg-gray-500 hover:bg-gray-600';
                            }
                          } else {
                            switch (seat.Category) {
                              case 'VIP': return 'bg-amber-500 hover:bg-amber-600 shadow-amber-100';
                              case 'Premium': return 'bg-blue-600 hover:bg-blue-700 shadow-blue-200';
                              case 'Standard':
                              default: return 'bg-gray-500 hover:bg-gray-600 shadow-gray-100';
                            }
                          }
                        };
                        
                        return (
                          <div
                            key={seat._id}
                            className="group relative"
                          >
                            <button
                              onClick={() => handleOpenModal(seat)}
                              className={`w-10 h-10 rounded-t-lg ${getSeatColor(seat)} text-white text-xs font-bold flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`}
                              title={`Fila ${seat.RowNumber}, Asiento ${seat.SeatNumber}`}
                            >
                              {seat.SeatNumber}
                            </button>

                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                              <div className="bg-gray-900 text-white text-xs rounded-xl px-4 py-3 whitespace-nowrap shadow-2xl border border-gray-800">
                                <div className="font-black text-sm mb-1 text-yellow-400">
                                  ASIENTO {seat.RowNumber}{seat.SeatNumber}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-400">Categoría:</span>
                                    <span className="font-bold">{seat.Category === 'VIP' ? 'VIP' : seat.Category === 'Premium' ? 'Premium' : 'Estándar'}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-400">Recargo:</span>
                                    <span className="font-bold text-green-400">+{seat.PriceModifier || 0} Bs</span>
                                  </div>
                                  <div className="h-px bg-gray-800 my-1"></div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-400">Vista:</span>
                                    <span>{seat.ScreenViewInfo}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-400">Sonido:</span>
                                    <span>{seat.AcousticProfile}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seat Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Detalles de Asientos</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vista de Pantalla
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil Acústico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recargo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron asientos. ¡Agrega tu primer asiento!
                    </td>
                  </tr>
                ) : (
                  seats
                    .sort((a, b) => {
                      if (a.RowNumber !== b.RowNumber) {
                        return a.RowNumber.localeCompare(b.RowNumber);
                      }
                      return a.SeatNumber - b.SeatNumber;
                    })
                    .map((seat) => (
                      <tr key={seat._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Fila {seat.RowNumber}, Asiento {seat.SeatNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{seat.ScreenViewInfo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{seat.AcousticProfile}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            seat.Category === 'VIP' ? 'bg-amber-100 text-amber-800' :
                            seat.Category === 'Premium' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {seat.Category === 'VIP' ? 'VIP' : seat.Category === 'Premium' ? 'Premium' : 'Estándar'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {seat.PriceModifier > 0 ? `+${seat.PriceModifier} Bs` : '0 Bs'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(seat)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(seat)}
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
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedSeat ? 'Editar Asiento' : 'Agregar Nuevo Asiento'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Fila
                </label>
                <input
                  type="text"
                  required
                  value={formData.RowNumber}
                  onChange={(e) => setFormData({ ...formData, RowNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="A"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Asiento
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.SeatNumber}
                  onChange={(e) => setFormData({ ...formData, SeatNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Información de Vista de Pantalla
              </label>
              <select
                required
                value={formData.ScreenViewInfo}
                onChange={(e) => setFormData({ ...formData, ScreenViewInfo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecciona la calidad</option>
                <option value="Excellent">Excelente</option>
                <option value="Good">Buena</option>
                <option value="Average">Regular</option>
                <option value="Poor">Deficiente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil Acústico
              </label>
              <select
                required
                value={formData.AcousticProfile}
                onChange={(e) => setFormData({ ...formData, AcousticProfile: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecciona la calidad</option>
                <option value="Excellent">Excelente</option>
                <option value="Good">Buena</option>
                <option value="Average">Regular</option>
                <option value="Poor">Deficiente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría de Asiento
              </label>
              <select
                required
                value={formData.Category}
                onChange={(e) => {
                  const newCategory = e.target.value as 'Standard' | 'Premium' | 'VIP';
                  const defaultModifiers = { Standard: 0, Premium: 5, VIP: 15 };
                  setFormData({ 
                    ...formData, 
                    Category: newCategory,
                    PriceModifier: defaultModifiers[newCategory]
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Standard">Estándar (Precio Base)</option>
                <option value="Premium">Premium (+5 Bs)</option>
                <option value="VIP">VIP (+15 Bs)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modificador de Precio (Bs)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.PriceModifier}
                onChange={(e) => setFormData({ ...formData, PriceModifier: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Valor adicional que se sumará al precio base de la función
              </p>
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
              {selectedSeat ? 'Actualizar' : 'Agregar'} Asiento
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Asiento"
        message="¿Estás seguro de que deseas eliminar este asiento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Clear All Seats Confirmation */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearAllSeats}
        title="Borrar Todos los Asientos"
        message={`¿Estás seguro de que deseas eliminar los ${seats.length} asientos de ${hall?.HallName}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Todo"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Generate Seats Confirmation */}
      <ConfirmDialog
        isOpen={isGenerateConfirmOpen}
        onClose={() => setIsGenerateConfirmOpen(false)}
        onConfirm={handleGenerateSeats}
        title="Generar Asientos"
        message={`Esto generará automáticamente ${hall?.Capacity} asientos para ${hall?.HallName} basado en perfiles óptimos de vista y acústica. ¿Continuar?`}
        confirmText="Generar"
        cancelText="Cancelar"
        type="info"
      />
    </div>
  );
}


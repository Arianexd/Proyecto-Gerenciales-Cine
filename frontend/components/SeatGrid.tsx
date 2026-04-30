'use client';

import { Seat } from '@/lib/types';

interface SeatGridProps {
  seats: Seat[];
  selectedSeats?: string[];
  onSeatClick?: (seatId: string) => void;
  onSeatHover?: (seat: Seat | null) => void;
  reservedSeats?: string[];
  readOnly?: boolean;
  showCategories?: boolean;
}

export default function SeatGrid({ 
  seats, 
  selectedSeats = [], 
  onSeatClick,
  onSeatHover,
  reservedSeats = [],
  readOnly = false,
  showCategories = true
}: SeatGridProps) {
  
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.RowNumber;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  const getSeatColor = (seat: Seat) => {
    const seatId = seat._id;
    
    if (reservedSeats.includes(seatId)) {
      return 'bg-red-500/70 border-red-400/60 text-red-100 cursor-not-allowed';
    }
    
    if (selectedSeats.includes(seatId)) {
      return 'bg-emerald-500 border-emerald-300 text-white hover:bg-emerald-400 cursor-pointer';
    }
    
    // Color by view quality
    switch (seat.ScreenViewInfo) {
      case 'Excellent':
        return 'bg-sky-500 border-sky-300 text-white hover:bg-sky-400 cursor-pointer';
      case 'Good':
        return 'bg-sky-400 border-sky-200 text-white hover:bg-sky-300 cursor-pointer';
      case 'Average':
        return 'bg-indigo-400 border-indigo-200 text-white hover:bg-indigo-300 cursor-pointer';
      case 'Poor':
        return 'bg-gray-500 border-gray-300 text-white hover:bg-gray-400 cursor-pointer';
      default:
        return 'bg-gray-400 border-gray-200 text-white hover:bg-gray-300 cursor-pointer';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (readOnly || reservedSeats.includes(seat._id)) return;
    if (onSeatClick) onSeatClick(seat._id);
  };

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white text-center text-xs sm:text-sm font-semibold tracking-widest py-2 sm:py-3 rounded-t-3xl mx-auto max-w-2xl border border-gray-600 shadow-lg">
          PANTALLA
        </div>
        <div className="h-6 sm:h-8 mx-auto max-w-2xl bg-gradient-to-b from-gray-300/40 to-transparent rounded-b-[2rem] blur-[1px]"></div>
      </div>

      <div className="bg-black/20 border border-gray-800 rounded-2xl p-2 sm:p-4 md:p-6 overflow-x-auto">
        <div className="space-y-1.5 sm:space-y-2 min-w-fit mx-auto">
          {sortedRows.map((row) => {
            const rowSeats = seatsByRow[row].sort((a, b) => a.SeatNumber - b.SeatNumber);
            return (
              <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2">
                <div className="w-5 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-500 flex-shrink-0">{row}</div>

                <div className="flex gap-0.5 sm:gap-1">
                  {rowSeats.map((seat) => {
                    const isReserved = reservedSeats.includes(seat._id);

                    return (
                      <button
                        key={seat._id}
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => onSeatHover && onSeatHover(seat)}
                        onMouseLeave={() => onSeatHover && onSeatHover(null)}
                        disabled={readOnly || isReserved}
                        className={`
                          w-6 h-6 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg border text-[10px] sm:text-xs font-semibold flex-shrink-0
                          transition-all duration-200 transform sm:hover:scale-105 active:scale-95
                          ${getSeatColor(seat)}
                          ${isReserved ? 'opacity-50' : ''}
                        `}
                        title={`Fila ${seat.RowNumber}, Asiento ${seat.SeatNumber}\nVista: ${seat.ScreenViewInfo}\nAcústica: ${seat.AcousticProfile}`}
                      >
                        {seat.SeatNumber}
                      </button>
                    );
                  })}
                </div>

                <div className="w-5 sm:w-8 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-sky-500 rounded border border-sky-300/80 flex-shrink-0"></div>
          <span className="text-gray-700">Vista Excelente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-sky-400 rounded border border-sky-200/70 flex-shrink-0"></div>
          <span className="text-gray-700">Vista Buena</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-indigo-400 rounded border border-indigo-200/70 flex-shrink-0"></div>
          <span className="text-gray-700">Vista Regular</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-500 rounded border border-gray-300/50 flex-shrink-0"></div>
          <span className="text-gray-700">Vista Deficiente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded border border-emerald-300 flex-shrink-0"></div>
          <span className="text-gray-700">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500/70 rounded border border-red-400/60 opacity-70 flex-shrink-0"></div>
          <span className="text-gray-700">Reservado</span>
        </div>
      </div>
    </div>
  );
}


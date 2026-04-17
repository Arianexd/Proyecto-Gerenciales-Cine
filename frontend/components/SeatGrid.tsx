'use client';

import { Seat } from '@/lib/types';

interface SeatGridProps {
  seats: Seat[];
  selectedSeats?: string[];
  onSeatClick?: (seatId: string) => void;
  onSeatHover?: (seat: Seat | null) => void;
  reservedSeats?: string[];
  readOnly?: boolean;
}

export default function SeatGrid({ 
  seats, 
  selectedSeats = [], 
  onSeatClick,
  onSeatHover,
  reservedSeats = [],
  readOnly = false 
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
      return 'bg-red-500 cursor-not-allowed';
    }
    
    if (selectedSeats.includes(seatId)) {
      return 'bg-green-500 hover:bg-green-600 cursor-pointer';
    }
    
    // Color by view quality
    switch (seat.ScreenViewInfo) {
      case 'Excellent':
        return 'bg-blue-500 hover:bg-blue-600 cursor-pointer';
      case 'Good':
        return 'bg-blue-400 hover:bg-blue-500 cursor-pointer';
      case 'Average':
        return 'bg-blue-300 hover:bg-blue-400 cursor-pointer';
      case 'Poor':
        return 'bg-gray-400 hover:bg-gray-500 cursor-pointer';
      default:
        return 'bg-gray-300 hover:bg-gray-400 cursor-pointer';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (readOnly || reservedSeats.includes(seat._id)) return;
    if (onSeatClick) onSeatClick(seat._id);
  };

  return (
    <div className="w-full">
      {/* Screen */}
      <div className="mb-8">
        <div className="bg-gray-800 text-white text-center py-3 rounded-t-3xl mx-auto max-w-2xl">
          SCREEN
        </div>
      </div>

      {/* Seats */}
      <div className="space-y-2">
        {sortedRows.map((row) => {
          const rowSeats = seatsByRow[row].sort((a, b) => a.SeatNumber - b.SeatNumber);
          return (
            <div key={row} className="flex items-center justify-center gap-2">
              {/* Row Label */}
              <div className="w-8 text-center font-bold text-gray-700">{row}</div>
              
              {/* Seats in Row */}
              <div className="flex gap-1">
                {rowSeats.map((seat) => {
                  const isReserved = reservedSeats.includes(seat._id);
                  const isSelected = selectedSeats.includes(seat._id);
                  
                  return (
                    <button
                      key={seat._id}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() => onSeatHover && onSeatHover(seat)}
                      onMouseLeave={() => onSeatHover && onSeatHover(null)}
                      disabled={readOnly || isReserved}
                      className={`
                        w-10 h-10 rounded-md text-white text-xs font-semibold
                        transition-all duration-200 transform hover:scale-105
                        ${getSeatColor(seat)}
                        ${isReserved ? 'opacity-50' : ''}
                      `}
                      title={`Row ${seat.RowNumber}, Seat ${seat.SeatNumber}\nView: ${seat.ScreenViewInfo}\nAcoustic: ${seat.AcousticProfile}`}
                    >
                      {seat.SeatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <span>Excellent View</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-400 rounded"></div>
          <span>Good View</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-300 rounded"></div>
          <span>Average View</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
          <span>Poor View</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded opacity-50"></div>
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
}


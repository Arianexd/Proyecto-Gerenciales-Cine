'use client';

interface SeatPreviewProps {
  viewQuality: 'Excellent' | 'Good' | 'Average' | 'Poor';
  acousticQuality: 'Excellent' | 'Good' | 'Average' | 'Poor';
  hallCapacity: number;
  seatRow?: string;
  seatNumber?: number;
  totalSeatsInRow?: number;
}

export default function SeatPreview({
  viewQuality,
  acousticQuality,
  hallCapacity,
  seatRow,
  seatNumber,
  totalSeatsInRow = 15
}: SeatPreviewProps) {

  const hallSize = hallCapacity < 100 ? 'small' : hallCapacity < 200 ? 'medium' : 'large';

  const getSeatPosition = () => {
    if (!seatNumber || !totalSeatsInRow) return 'center';
    const position = seatNumber / totalSeatsInRow;
    if (position <= 0.33) return 'left';
    if (position >= 0.67) return 'right';
    return 'center';
  };

  const getRowPosition = () => {
    if (!seatRow) return 'middle';
    const rowCode = seatRow.charCodeAt(0) - 65;
    if (rowCode < 3) return 'front';
    if (rowCode < 7) return 'middle';
    return 'back';
  };

  const seatPosition = getSeatPosition();
  const rowPosition = getRowPosition();

  const acousticData = {
    Excellent: { clarity: '98%', bass: 'Deep', surround: '7.1', desc: 'Perfect balanced sound.' },
    Good: { clarity: '90%', bass: 'Clear', surround: '5.1', desc: 'High quality audio.' },
    Average: { clarity: '75%', bass: 'Balanced', surround: '2.1', desc: 'Standard experience.' },
    Poor: { clarity: '60%', bass: 'Low', surround: 'Stereo', desc: 'Limited sound field.' }
  }[acousticQuality];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">

      {/* Visualización Acústica */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-black text-gray-400 mb-4 tracking-widest uppercase">Acoustic Preview</h3>

        {/* Representación de Speakers L, C, R */}
        <div className="flex justify-between items-end h-12 mb-6 px-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-8 bg-gray-800 rounded-sm"></div>
            <span className="text-[10px] font-bold mt-1">L</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-4 bg-gray-800 rounded-sm"></div>
            <span className="text-[10px] font-bold mt-1">CENTER</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-8 bg-gray-800 rounded-sm"></div>
            <span className="text-[10px] font-bold mt-1">R</span>
          </div>
        </div>

        {/* Punto del usuario dinámico */}
        <div className="relative h-20 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
          <div
            className="absolute transition-all duration-700 ease-in-out"
            style={{
              left: seatPosition === 'left' ? '20%' : seatPosition === 'right' ? '80%' : '50%',
              top: rowPosition === 'front' ? '20%' : rowPosition === 'middle' ? '50%' : '80%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-4 h-4 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)] animate-pulse"></div>
            <span className="text-[10px] font-black text-purple-600 mt-1 block">YOU</span>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-purple-50 p-2 rounded text-center">
            <p className="text-[9px] font-bold text-purple-400 uppercase">Clarity</p>
            <p className="text-sm font-black text-purple-900">{acousticData.clarity}</p>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <p className="text-[9px] font-bold text-purple-400 uppercase">Bass</p>
            <p className="text-sm font-black text-purple-900">{acousticData.bass}</p>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <p className="text-[9px] font-bold text-purple-400 uppercase">Surround</p>
            <p className="text-sm font-black text-purple-900">{acousticData.surround}</p>
          </div>
        </div>
      </div>

      {/* Información de Resumen */}
      <div className="flex flex-col justify-center space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">View Quality</h4>
          <p className="text-xl font-black text-blue-900">{viewQuality}</p>
          <p className="text-xs text-blue-700 mt-1">Optimized for {hallSize} halls.</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
          <h4 className="text-xs font-bold text-purple-400 uppercase mb-1">Acoustic Profile</h4>
          <p className="text-xl font-black text-purple-900">{acousticQuality}</p>
          <p className="text-xs text-purple-700 mt-1">{acousticData.desc}</p>
        </div>
      </div>
    </div>
  );
}

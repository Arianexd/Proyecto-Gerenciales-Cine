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
  
  // 1. Cálculos de posición (Tu lógica original)
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

  // 2. Datos de Acústica (HU-6: Métricas de claridad, bajo y surround)
  const acousticData = {
    Excellent: { clarity: '98%', bass: 'Deep', surround: '7.1', desc: 'Perfect balanced sound.' },
    Good: { clarity: '90%', bass: 'Clear', surround: '5.1', desc: 'High quality audio.' },
    Average: { clarity: '75%', bass: 'Balanced', surround: '2.1', desc: 'Standard experience.' },
    Poor: { clarity: '60%', bass: 'Low', surround: 'Stereo', desc: 'Limited sound field.' }
  }[acousticQuality];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
      
      {/* Visualización Acústica (HU-6) */}
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

        {/* Métricas Requeridas */}
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
  // View preview data based on quality and hall size
  const getViewPreview = () => {
    const previews = {
      Excellent: {
        image: '/previews/view-excellent.svg',
        description: 'Vista central perfecta con ángulo de visión óptimo. La pantalla llena tu campo visual idealmente.',
        angle: '25-30°',
        distance: hallSize === 'small' ? '8-10m' : hallSize === 'medium' ? '12-15m' : '15-20m',
      },
      Good: {
        image: '/previews/view-good.svg',
        description: 'Buen ángulo de visión con clara visibilidad de la pantalla. Ligeramente descentrado pero cómodo.',
        angle: '30-40°',
        distance: hallSize === 'small' ? '6-8m' : hallSize === 'medium' ? '10-12m' : '12-15m',
      },
      Average: {
        image: '/previews/view-average.svg',
        description: 'Vista aceptable pero puede requerir girar la cabeza. Pantalla parcialmente descentrada.',
        angle: '40-50°',
        distance: hallSize === 'small' ? '5-6m' : hallSize === 'medium' ? '8-10m' : '10-12m',
      },
      Poor: {
        image: '/previews/view-poor.svg',
        description: 'Ángulo de visión limitado. Demasiado cerca de la pantalla o en posición lateral extrema. Puede causar molestias en el cuello.',
        angle: '50-60°',
        distance: hallSize === 'small' ? '3-5m' : hallSize === 'medium' ? '5-8m' : '6-10m',
      },
    };
    return previews[viewQuality];
  };

  // Acoustic preview data
  const getAcousticPreview = () => {
    const previews = {
      Excellent: {
        icon: '🔊',
        description: 'Experiencia de sonido envolvente óptima. Audio balanceado de todos los altavoces.',
        clarity: '95-100%',
        bass: 'Profundo y Claro',
        surround: '7.1 Óptimo',
      },
      Good: {
        icon: '🔉',
        description: 'Buena calidad de sonido con variaciones menores. Diálogos y efectos claros.',
        clarity: '85-95%',
        bass: 'Bueno',
        surround: '5.1 Bueno',
      },
      Average: {
        icon: '🔈',
        description: 'Sonido aceptable pero con cierto desbalance. Los diálogos son claros.',
        clarity: '70-85%',
        bass: 'Moderado',
        surround: '5.1 Regular',
      },
      Poor: {
        icon: '🔇',
        description: 'Problemas de calidad de sonido. Puede haber eco o problemas de distancia con los altavoces.',
        clarity: '50-70%',
        bass: 'Débil',
        surround: 'Limitado',
      },
    };
    return previews[acousticQuality];
  };

  const viewData = getViewPreview();
  const acousticData = getAcousticPreview();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* View Quality Preview */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Vista de Pantalla
        </h3>

        {/* View Diagram */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-300">
          <div className="relative h-32 mb-2">
            {/* Screen representation */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gray-800 rounded-sm"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">PANTALLA</div>
            
            {/* Viewing angle visualization - dynamic position */}
            <div 
              className="absolute transform -translate-x-1/2"
              style={{
                left: seatPosition === 'left' ? '25%' : seatPosition === 'right' ? '75%' : '50%',
                top: rowPosition === 'front' ? '30%' : rowPosition === 'middle' ? '50%' : '70%',
              }}
            >
              <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="text-xs text-center mt-1 text-blue-600 font-bold whitespace-nowrap">TÚ</div>
            </div>

            {/* Angle lines - dynamic based on position */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {(() => {
                const seatX = seatPosition === 'left' ? '25%' : seatPosition === 'right' ? '75%' : '50%';
                const seatY = rowPosition === 'front' ? '35%' : rowPosition === 'middle' ? '55%' : '75%';
                
                return (
                  <>
                    <line x1={seatX} y1={seatY} x2="20%" y2="10%" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1={seatX} y1={seatY} x2="80%" y2="10%" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2,2" />
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-700 font-medium">
              Ángulo de Visión: {viewData.angle}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Posición: asiento <span className="font-semibold capitalize">{seatPosition === 'left' ? 'izquierdo' : seatPosition === 'right' ? 'derecho' : 'central'}</span>, fila <span className="font-semibold capitalize">{rowPosition === 'front' ? 'delantera' : rowPosition === 'middle' ? 'central' : 'trasera'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Calidad:</span>
            <span className={`font-semibold ${
              viewQuality === 'Excellent' ? 'text-green-600' :
              viewQuality === 'Good' ? 'text-blue-600' :
              viewQuality === 'Average' ? 'text-yellow-600' :
              'text-red-600'
            }`}>{viewQuality === 'Excellent' ? 'Excelente' : viewQuality === 'Good' ? 'Buena' : viewQuality === 'Average' ? 'Regular' : 'Deficiente'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Distancia:</span>
            <span className="font-semibold text-gray-900">{viewData.distance}</span>
          </div>
          <p className="text-xs text-gray-600 mt-3 bg-blue-50 p-3 rounded">
            {viewData.description}
          </p>
        </div>
      </div>

      {/* Acoustic Quality Preview */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 2.828" />
          </svg>
          Previsualización Acústica
        </h3>

        {/* Positional Sound visualization - Like View Preview */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-300">
          <div className="relative h-32 mb-2">
            {/* Speaker representation */}
            <div className="absolute top-2 left-2 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              L
            </div>
            <div className="absolute top-2 right-2 text-xs text-gray-500 flex items-center gap-1">
              R
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Center speakers */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Your position - dynamic based on seat (both horizontal and vertical) */}
            <div 
              className="absolute transform -translate-x-1/2"
              style={{
                left: seatPosition === 'left' ? '25%' : seatPosition === 'right' ? '75%' : '50%',
                top: rowPosition === 'front' ? '30%' : rowPosition === 'middle' ? '50%' : '70%',
              }}
            >
              <div className="w-5 h-5 bg-purple-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="text-xs text-center mt-1 text-purple-600 font-bold whitespace-nowrap">TÚ</div>
            </div>

            {/* Sound waves from appropriate direction - dynamic based on position */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {(() => {
                const seatX = seatPosition === 'left' ? '25%' : seatPosition === 'right' ? '75%' : '50%';
                const seatY = rowPosition === 'front' ? '35%' : rowPosition === 'middle' ? '55%' : '75%';
                
                return (
                  <>
                    {/* Left speaker to seat */}
                    {seatPosition === 'left' && (
                      <>
                        <line x1="10%" y1="20%" x2={seatX} y2={seatY} stroke="#9333EA" strokeWidth="2" strokeDasharray="3,3" />
                        <line x1="10%" y1="25%" x2={seatX} y2={seatY} stroke="#9333EA" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                      </>
                    )}
                    
                    {/* Center speakers to seat */}
                    {seatPosition === 'center' && (
                      <>
                        <line x1="50%" y1="10%" x2={seatX} y2={seatY} stroke="#9333EA" strokeWidth="2" strokeDasharray="3,3" />
                        <line x1="40%" y1="12%" x2={seatX} y2={seatY} stroke="#9333EA" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                        <line x1="60%" y1="12%" x2={seatX} y2={seatY} stroke="#9333EA" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                      </>
                    )}
                    
                    {/* Right speaker to seat */}
                    {seatPosition === 'right' && (
                      <>
                        <line x1="90%" y1="20%" x2={seatX} y2={seatY} stroke="#9333EA" strokeWidth="2" strokeDasharray="3,3" />
                        <line x1="90%" y1="25%" x2={seatX} y2={seatY} stroke="#9333EA" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                      </>
                    )}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-700 font-medium mb-1">
              Dirección del Sonido:
              <span className="ml-2 font-bold text-purple-600">
                {seatPosition === 'left' ? 'Desde Altavoz Izquierdo' :
                 seatPosition === 'right' ? 'Desde Altavoz Derecho' :
                 'Estéreo Balanceado'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Posición de Fila: {rowPosition === 'front' ? 'Delantera' : rowPosition === 'middle' ? 'Central' : 'Trasera'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Calidad:</span>
            <span className={`font-semibold ${
              acousticQuality === 'Excellent' ? 'text-green-600' :
              acousticQuality === 'Good' ? 'text-blue-600' :
              acousticQuality === 'Average' ? 'text-yellow-600' :
              'text-red-600'
            }`}>{acousticQuality === 'Excellent' ? 'Excelente' : acousticQuality === 'Good' ? 'Buena' : acousticQuality === 'Average' ? 'Regular' : 'Deficiente'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Claridad:</span>
            <span className="font-semibold text-gray-900">{acousticData.clarity}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Graves:</span>
            <span className="font-semibold text-gray-900">{acousticData.bass}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Envolvente:</span>
            <span className="font-semibold text-gray-900">{acousticData.surround}</span>
          </div>
          <p className="text-xs text-gray-600 mt-3 bg-purple-50 p-3 rounded">
            {acousticData.description}
          </p>
        </div>

        {/* Sample sound button */}
        <button
          onClick={() => {
            // Simulated sound preview
            const audio = new Audio();
            const frequency = acousticQuality === 'Excellent' ? 1000 :
                            acousticQuality === 'Good' ? 800 :
                            acousticQuality === 'Average' ? 600 : 400;
            // In a real app, you would play actual audio samples here
            alert(`Reproduciendo muestra de audio de calidad ${acousticQuality} (${frequency}Hz)`);
          }}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          🎵 Reproducir Muestra Acústica
        </button>
      </div>

      {/* Hall Information */}
      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Tamaño de Sala: <strong className="text-gray-900 capitalize">{hallSize === 'small' ? 'pequeña' : hallSize === 'medium' ? 'mediana' : 'grande'}</strong> ({hallCapacity} asientos)
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Previsualización basada en la acústica y geometría típica de una sala de cine {hallSize === 'small' ? 'pequeña' : hallSize === 'medium' ? 'mediana' : 'grande'}
          </div>
        </div>
      </div>
    </div>
  );
}


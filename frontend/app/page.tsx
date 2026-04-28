'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { moviesApi, sessionsApi } from '@/lib/api';
import { Movie } from '@/lib/types';
import PublicNavigation from '@/components/PublicNavigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [activeMovieIds, setActiveMovieIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('Todos');

  useEffect(() => {
    fetchAllMovies();
  }, [router]);

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      const [moviesRes, sessionsRes] = await Promise.all([
        moviesApi.getAll(),
        sessionsApi.getAll()
      ]);
      
      const now = new Date();
      const activeSessions = sessionsRes.data.filter((s: any) => new Date(s.SessionDateTime) > now);
      const activeIds = new Set<string>(activeSessions.map((s: any) => 
        typeof s.MovieID === 'object' ? s.MovieID._id : s.MovieID
      ));

      setActiveMovieIds(activeIds);
      setAllMovies(moviesRes.data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const showingMovies = useMemo(() => 
    allMovies.filter(m => activeMovieIds.has(m._id)), 
    [allMovies, activeMovieIds]
  );

  const comingSoonMovies = useMemo(() => 
    allMovies
      .filter(m => !activeMovieIds.has(m._id))
      .sort((a, b) => {
        if (!a.ReleaseDate) return 1;
        if (!b.ReleaseDate) return -1;
        return new Date(a.ReleaseDate).getTime() - new Date(b.ReleaseDate).getTime();
      }), 
    [allMovies, activeMovieIds]
  );

  const featuredMovie = showingMovies.length > 0 ? showingMovies[0] : allMovies[0];

  const genres = useMemo(() => {
    // ✅ Extraer todos los géneros individuales de todas las películas
    const allGenres = new Set<string>();
    allMovies.forEach(movie => {
      if (movie.Genre) {
        // Separar géneros por coma y limpiar espacios
        const movieGenres = movie.Genre.split(',').map(g => g.trim()).filter(g => g);
        movieGenres.forEach(genre => allGenres.add(genre));
      }
    });
    return ['Todos', ...Array.from(allGenres).sort()];
  }, [allMovies]);

  const filteredShowing = useMemo(() => {
    if (selectedGenre === 'Todos') return showingMovies;
    // ✅ Filtrar por inclusión de género en lugar de coincidencia exacta
    return showingMovies.filter(movie => {
      if (!movie.Genre) return false;
      const movieGenres = movie.Genre.split(',').map(g => g.trim());
      return movieGenres.includes(selectedGenre);
    });
  }, [showingMovies, selectedGenre]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <PublicNavigation />

      {/* Hero Destacado */}
      {!loading && featuredMovie && (
        <section className="relative h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={featuredMovie.PosterURL} 
              alt={featuredMovie.MovieName}
              className="w-full h-full object-cover scale-105 blur-md opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent" />
          </div>

          <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center gap-12 relative z-10 pt-20">
            <div className="w-56 md:w-80 shrink-0 shadow-[0_0_50px_rgba(220,38,38,0.3)] rounded-2xl overflow-hidden border border-white/10 transform hover:scale-105 transition-transform duration-700">
              <img src={featuredMovie.PosterURL} alt={featuredMovie.MovieName} className="w-full h-auto" />
            </div>
            
            <div className="max-w-3xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <span className="px-3 py-1 rounded-md bg-red-600 text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-red-600/50">
                  Destacada
                </span>
                <span className="text-gray-400 text-sm font-bold tracking-tight">
                  {(featuredMovie.Genre || 'Cine').split(',')[0]} · {featuredMovie.Duration} min
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                {featuredMovie.MovieName}
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl mb-10 line-clamp-3 font-medium leading-relaxed max-w-xl">
                {featuredMovie.Description || 'Disfruta de la mejor calidad de imagen y sonido en nuestras salas VIP.'}
              </p>
              
              <div className="flex flex-wrap gap-5 justify-center md:justify-start">
                <Link
                  href={`/movies/${featuredMovie._id}`}
                  className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-red-700 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                >
                  Ver Funciones
                </Link>
                <Link
                  href="/movies"
                  className="px-10 py-4 bg-white/5 backdrop-blur-xl text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
                >
                  Explorar Catálogo
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-24 space-y-32">
        
        {/* Estrenos / En Cartelera */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-red-600 rounded-full" />
                <span className="text-red-500 font-black tracking-[0.2em] uppercase text-xs">Now Showing</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Estrenos en Cartelera</h2>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all border-2 ${
                    selectedGenre === genre
                      ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-600/20'
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {(genre || 'Todos').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredShowing.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-[40px] border border-white/5">
              <p className="text-gray-500 font-bold text-xl">No hay películas en esta categoría todavía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-10">
              {filteredShowing.map((movie) => (
                <MovieCard key={movie._id} movie={movie} isActive />
              ))}
            </div>
          )}
        </section>

        {/* Próximamente */}
        {!loading && comingSoonMovies.length > 0 && (
          <section>
            <div className="space-y-4 mb-16">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gray-600 rounded-full" />
                <span className="text-gray-500 font-black tracking-[0.2em] uppercase text-xs">Coming Soon</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Próximamente</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-10">
              {comingSoonMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} isActive={false} />
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="bg-black py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-xl">C</div>
              <span className="text-2xl font-black tracking-tighter">Cine<span className="text-red-600">book</span></span>
            </div>
            <div className="flex gap-10 text-gray-500 text-sm font-bold">
              <Link href="/movies" className="hover:text-white transition-colors">Películas</Link>
              <Link href="/account/login" className="hover:text-white transition-colors">Mi Cuenta</Link>
              <Link href="/admin/login" className="hover:text-white transition-colors">Administración</Link>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center text-gray-600 text-xs font-bold">
            © 2026 PROYECTO CINEBOOK • TODOS LOS DERECHOS RESERVADOS
          </div>
        </div>
      </footer>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="aspect-[2/3] bg-white/5 rounded-3xl" />
      <div className="space-y-3">
        <div className="h-4 bg-white/5 rounded-full w-3/4" />
        <div className="h-3 bg-white/5 rounded-full w-1/2" />
      </div>
    </div>
  );
}

function MovieCard({ movie, isActive }: { movie: Movie; isActive: boolean }) {
  const posterSrc = movie.PosterURL || `https://placehold.co/400x600/111827/f9fafb?text=${encodeURIComponent(movie.MovieName)}`;

  return (
    <Link href={`/movies/${movie._id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-[32px] overflow-hidden mb-6 shadow-2xl transition-all duration-700 group-hover:scale-[1.03] group-hover:-translate-y-3">
        <img 
          src={posterSrc} 
          alt={movie.MovieName} 
          className={`w-full h-full object-cover transition-all duration-1000 ${!isActive ? 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100' : 'scale-105 group-hover:scale-110'}`} 
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x600/111827/f9fafb?text=Sin+Poster";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-xl text-[9px] font-black border border-white/10 uppercase tracking-widest">
            {(movie.Genre || 'Cine').split(',')[0]}
          </span>
          {!isActive && (
            <span className="px-3 py-1.5 bg-yellow-500 text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20">
              PRONTO
            </span>
          )}
        </div>

        <div className="absolute inset-x-6 bottom-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black text-center shadow-2xl uppercase tracking-widest">
            {isActive ? 'Reservar Entrada' : 'Ver Detalles'}
          </div>
        </div>
      </div>
      
      <div className="space-y-2 px-1">
        <h3 className="font-black text-base line-clamp-1 group-hover:text-red-500 transition-colors uppercase tracking-tighter">
          {movie.MovieName}
        </h3>
        <div className="flex flex-col gap-1">
          <p className="text-gray-500 text-[11px] font-bold tracking-tight">
            {movie.Duration} MIN · CLAS. {movie.AgeLimit}+
          </p>
          {!isActive && movie.ReleaseDate && (
            <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.1em]">
              Estreno: {new Date(movie.ReleaseDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
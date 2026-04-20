'use client';

import { useState, useEffect } from 'react';
import { moviesApi } from '@/lib/api';
import { Movie } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import PublicNavigation from '@/components/PublicNavigation';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesApi.getAll();
      setMovies(response.data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = ['Todos', ...Array.from(new Set(movies.map(m => m.Genre.split(',')[0].trim())))];

  const filteredMovies = selectedGenre === 'Todos'
    ? movies
    : movies.filter(m => m.Genre.includes(selectedGenre));

  return (
    <>
      <PublicNavigation />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-12">
          {/* Cinema Header with Marquee Effect */}
          <div className="mb-12 text-center relative">
            {/* Film strip decoration top */}
            <div className="h-2 bg-yellow-500 mb-8 flex gap-1 px-1">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="flex-1 bg-black rounded-sm"></div>
              ))}
            </div>

            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 blur-2xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 mb-4 tracking-widest">
                EN CARTELERA
              </h1>
            </div>
            <p className="text-gray-400 text-xl font-bold tracking-wider">
              ★ EXPLORA NUESTRA COLECCIÓN ★
            </p>

            {/* Film strip decoration bottom */}
            <div className="h-2 bg-yellow-500 mt-8 flex gap-1 px-1">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="flex-1 bg-black rounded-sm"></div>
              ))}
            </div>
          </div>

          {/* Genre Filter - Cinema Ticket Style */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-red-500"></div>
              <h2 className="text-2xl font-black text-yellow-400 tracking-widest">SELECCIONA GÉNERO</h2>
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`relative px-6 py-3 rounded-lg font-black text-sm tracking-wider transition-all duration-300 transform hover:scale-110 uppercase ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl shadow-red-500/50 border-2 border-red-400'
                      : 'bg-gradient-to-r from-gray-800 to-black text-gray-300 border-2 border-gray-700 hover:border-red-600 hover:text-white'
                  }`}
                >
                  {selectedGenre === genre && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  )}
                  <span className="relative z-10">{genre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Movies Grid */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative mb-6">
                <div className="w-24 h-24 border-8 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl animate-pulse">🎬</div>
                </div>
              </div>
              <p className="text-yellow-400 text-xl font-bold tracking-widest animate-pulse">
                CARGANDO PELÍCULAS...
              </p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-black rounded-3xl border-4 border-red-600">
              <div className="text-8xl mb-6 animate-bounce">🎬</div>
              <h3 className="text-3xl font-black text-white mb-4">NO SE ENCONTRARON PELÍCULAS</h3>
              <p className="text-gray-400 text-lg">¡Vuelve pronto para ver los nuevos estrenos!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>

              {/* Movie Count */}
              <div className="text-center mt-12 pt-8 border-t-2 border-red-600">
                <p className="text-gray-400 font-bold tracking-widest">
                  MOSTRANDO <span className="text-red-500 text-2xl mx-2">{filteredMovies.length}</span> PELÍCULAS
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { moviesApi, sessionsApi } from '@/lib/api';
import { Movie, MovieSession } from '@/lib/types';
import SessionCard from '@/components/SessionCard';
import PublicNavigation from '@/components/PublicNavigation';
import Link from 'next/link';

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [sessions, setSessions] = useState<MovieSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const [movieRes, sessionsRes] = await Promise.all([
        moviesApi.getById(movieId),
        sessionsApi.getAll()
      ]);
      
      setMovie(movieRes.data);
      
      // Filter sessions for this movie
      const movieSessions = sessionsRes.data.filter((session: MovieSession) => {
        const sessionMovieId = typeof session.MovieID === 'object' ? session.MovieID._id : session.MovieID;
        return sessionMovieId === movieId;
      });
      
      setSessions(movieSessions);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-pulse">🎬</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🎬</div>
            <h2 className="text-3xl font-black text-white mb-4">MOVIE NOT FOUND</h2>
            <Link href="/movies" className="text-yellow-400 hover:text-yellow-300 font-bold text-lg">
              ← BACK TO MOVIES
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PublicNavigation />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Hero Section with Backdrop - Cinema Style */}
        <div className="relative bg-gradient-to-br from-black via-red-950 to-black text-white border-b-8 border-red-600">
          {/* Film strip top */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-yellow-500 flex gap-2 px-1 z-20">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="flex-1 bg-black rounded-sm"></div>
            ))}
          </div>

          {/* Backdrop with film grain */}
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <img 
              src={movie.PosterURL} 
              alt="" 
              className="w-full h-full object-cover blur-md scale-110"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-8 pt-12">
            <Link href="/movies" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8 font-bold transition-colors group">
              <svg className="w-6 h-6 transform group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              BACK TO MOVIES
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Poster - Cinema Frame Style */}
              <div className="md:col-span-1">
                <div className="relative group">
                  {/* Film frame decoration */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-red-600 to-yellow-600 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity blur"></div>
                  <div className="relative bg-gradient-to-br from-gray-900 to-black p-4 rounded-2xl border-4 border-yellow-500">
                    {/* Film strip perforations */}
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gray-800 flex gap-1 px-1 rounded-t-xl">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex-1 bg-black rounded-sm"></div>
                      ))}
                    </div>
                    <img
                      src={movie.PosterURL}
                      alt={movie.MovieName}
                      className="w-full rounded-xl shadow-2xl mt-3 mb-3"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-800 flex gap-1 px-1 rounded-b-xl">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex-1 bg-black rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Info - Cinema Marquee Style */}
              <div className="md:col-span-2 space-y-6">
                {/* Title */}
                <div className="relative">
                  <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 mb-2 tracking-wider leading-tight">
                    {movie.MovieName}
                  </h1>
                  <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-transparent mb-6"></div>
                </div>
                
                {/* Badges - Cinema Ticket Style */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-lg font-black shadow-lg shadow-yellow-500/50 transform hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-2xl">{movie.Rating}/10</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-lg font-black text-2xl shadow-lg shadow-red-500/50 border-2 border-red-400 transform hover:scale-110 transition-transform">
                    {movie.AgeLimit}+
                  </div>
                  
                  <div className="bg-gray-800 text-yellow-400 px-6 py-3 rounded-lg font-bold text-lg border-2 border-gray-700">
                    ⏱️ {movie.Duration} MIN
                  </div>
                  
                  <div className="bg-red-600/20 text-red-400 px-6 py-3 rounded-lg font-bold text-lg border-2 border-red-600/50 uppercase tracking-wider">
                    {movie.Genre}
                  </div>
                </div>

                {/* Movie Details */}
                <div className="space-y-6 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-800">
                  <div>
                    <h3 className="text-sm font-black text-yellow-400 mb-2 tracking-widest">DIRECTOR</h3>
                    <p className="text-2xl font-bold text-white">{movie.Director}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-yellow-400 mb-2 tracking-widest">STARRING</h3>
                    <p className="text-xl text-gray-300 leading-relaxed">{movie.Cast.join(', ')}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-yellow-400 mb-2 tracking-widest">SYNOPSIS</h3>
                    <p className="text-lg text-gray-300 leading-relaxed">{movie.Description}</p>
                  </div>
                </div>

                {/* Trailer Button */}
                {movie.TrailerURL && (
                  <a
                    href={movie.TrailerURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-xl font-black text-lg transition-all shadow-2xl shadow-red-500/50 transform hover:scale-110"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    WATCH TRAILER
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Film strip bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-500 flex gap-2 px-1">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="flex-1 bg-black rounded-sm"></div>
            ))}
          </div>
        </div>

        {/* Sessions Section - Cinema Showtimes Style */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-block relative mb-4">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 blur-xl opacity-50 animate-pulse"></div>
              <h2 className="relative text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 tracking-wider">
                SHOWTIMES
              </h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent to-red-500"></div>
              <p className="text-gray-400 text-lg font-bold tracking-widest">
                ★ SELECT YOUR SESSION ★
              </p>
              <div className="h-1 w-20 bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
          </div>
          
          {sessions.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-16 text-center border-4 border-red-600">
              <div className="text-8xl mb-6">📅</div>
              <h3 className="text-4xl font-black text-white mb-4">NO SESSIONS AVAILABLE</h3>
              <p className="text-gray-400 text-xl">Check back later for upcoming showtimes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <SessionCard key={session._id} session={session} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

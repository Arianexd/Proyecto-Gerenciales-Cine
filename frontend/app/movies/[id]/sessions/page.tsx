'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { moviesApi, sessionsApi } from '@/lib/api';
import { Movie, MovieSession } from '@/lib/types';
import SessionCard from '@/components/SessionCard';
import PublicNavigation from '@/components/PublicNavigation';

export default function MovieSessionsPage() {
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [sessions, setSessions] = useState<MovieSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    (async () => {
      try {
        setLoading(true);
        const [movieRes, sessionsRes] = await Promise.all([
          moviesApi.getById(movieId),
          sessionsApi.getAll(),
        ]);

        const now = new Date();
        const movieSessions = sessionsRes.data
          .filter((s: MovieSession) => {
            const sessionMovieId =
              typeof s.MovieID === 'object' ? s.MovieID._id : s.MovieID;
            return sessionMovieId === movieId && new Date(s.SessionDateTime) > now;
          })
          .sort(
            (a: MovieSession, b: MovieSession) =>
              new Date(a.SessionDateTime).getTime() -
              new Date(b.SessionDateTime).getTime(),
          );

        setMovie(movieRes.data);
        setSessions(movieSessions);
      } finally {
        setLoading(false);
      }
    })();
  }, [movieId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <Link
            href="/movies"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la cartelera
          </Link>
          <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-1">
            Funciones disponibles
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {loading ? 'Cargando...' : movie?.MovieName || 'Película'}
          </h1>
          {movie && !loading && (
            <p className="text-gray-500 text-sm mt-1">
              {movie.Genre} · {movie.Duration} min
              {sessions.length > 0 && (
                <>
                  {' · '}
                  {sessions.length}{' '}
                  {sessions.length === 1 ? 'función disponible' : 'funciones disponibles'}
                </>
              )}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-white border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-medium mb-1">
              No hay funciones disponibles
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Por ahora no hay funciones programadas para esta película.
            </p>
            <Link
              href="/movies"
              className="inline-block text-sm text-red-600 font-semibold hover:underline"
            >
              Ver otras películas →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

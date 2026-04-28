'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { moviesApi, reviewsApi, sessionsApi } from '@/lib/api';
import { getStoredSession, useAuthSession } from '@/lib/auth';
import { Movie, MovieSession, Review } from '@/lib/types';
import SessionCard from '@/components/SessionCard';
import PublicNavigation from '@/components/PublicNavigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ReviewSummary {
  averageScore: number;
  reviewCount: number;
}

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;
  const authSession = useAuthSession();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [sessions, setSessions] = useState<MovieSession[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary>({ averageScore: 0, reviewCount: 0 });
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewReason, setReviewReason] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ Score: 5, Comment: '' });
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const [movieRes, sessionsRes, reviewsRes] = await Promise.all([
        moviesApi.getById(movieId),
        sessionsApi.getAll(),
        reviewsApi.getMovieReviews(movieId),
      ]);

      const now = new Date();
      const movieSessions = sessionsRes.data.filter((session: MovieSession) => {
        const sessionMovieId = typeof session.MovieID === 'object' ? session.MovieID._id : session.MovieID;
        const sessionDate = new Date(session.SessionDateTime);
        return sessionMovieId === movieId && sessionDate > now;
      });

      setMovie(movieRes.data);
      setSessions(movieSessions);
      setReviews(reviewsRes.data.reviews);
      setReviewSummary(reviewsRes.data.summary);

      const session = getStoredSession();
      if (session?.user.Role === 'CUSTOMER') {
        try {
          const myStatusRes = await reviewsApi.getMyMovieStatus(movieId);
          const review = myStatusRes.data.review;
          setCanReview(Boolean(myStatusRes.data.canReview));
          setReviewReason(myStatusRes.data.reason);
          setMyReview(review);

          if (review) {
            setReviewForm({
              Score: review.Score,
              Comment: review.Comment || '',
            });
          }
        } catch {
          setCanReview(false);
          setReviewReason('Inicia sesion como cliente para valorar esta pelicula.');
        }
      } else {
        setCanReview(false);
        setMyReview(null);
        setReviewReason('Inicia sesion como cliente para valorar esta pelicula.');
      }
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      const response = await reviewsApi.saveMovieReview(movieId, reviewForm);
      setMyReview(response.data.review);
      setReviewSummary(response.data.summary);
      toast.success(myReview ? 'Valoracion actualizada correctamente' : 'Valoracion enviada correctamente');

      const latestReviews = await reviewsApi.getMovieReviews(movieId);
      setReviews(latestReviews.data.reviews);
      setMovie((current) =>
        current
          ? {
              ...current,
              UserRatingAverage: response.data.summary.averageScore,
              UserRatingCount: response.data.summary.reviewCount,
            }
          : current
      );
    } catch (error: any) {
      const message = error?.response?.data?.error || 'No se pudo guardar tu valoracion';
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Cargando pelicula...</p>
          </div>
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <PublicNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pelicula no encontrada</h2>
            <Link href="/movies" className="text-red-600 hover:text-red-700 text-sm font-semibold">
              ← Volver a peliculas
            </Link>
          </div>
        </div>
      </>
    );
  }

  const hasUserRating = Boolean(movie.UserRatingCount && movie.UserRatingCount > 0);
  const displayRating = hasUserRating
    ? `${movie.UserRatingAverage?.toFixed(1) || '0.0'}/5`
    : typeof movie.Rating === 'number' && movie.Rating > 0
      ? `${movie.Rating.toFixed(1)}/10`
      : 'Sin puntaje';
  const posterSrc =
    movie.PosterURL ||
    `https://placehold.co/300x450/111827/f9fafb?text=${encodeURIComponent(movie.MovieName)}`;
  const castList = movie.Cast && movie.Cast.length > 0
    ? movie.Cast.join(', ')
    : 'Reparto no registrado';
  const movieDescription = movie.Description || 'Sin sinopsis disponible.';
  const movieDirector = movie.Director || 'Direccion no registrada';

  return (
    <>
      <PublicNavigation />
      
      {/* Hero Section Cinematográfico */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Background con poster y efectos */}
        <div className="absolute inset-0 z-0">
          <img 
            src={posterSrc} 
            alt={movie.MovieName}
            className="w-full h-full object-cover scale-105 blur-md opacity-30"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/1920x1080/111827/f9fafb?text=Sin+Poster';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent" />
        </div>

        {/* Film Strip Top */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-yellow-500 flex gap-1 px-1 z-10">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="flex-1 bg-black rounded-sm"></div>
          ))}
        </div>

        <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center gap-12 relative z-10 pt-20">
          {/* Poster con efectos cinematográficos */}
          <div className="w-56 md:w-80 shrink-0 shadow-[0_0_50px_rgba(220,38,38,0.3)] rounded-2xl overflow-hidden border border-white/10 transform hover:scale-105 transition-all duration-700">
            <img 
              src={posterSrc} 
              alt={movie.MovieName} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x600/111827/f9fafb?text=Sin+Poster';
              }}
            />
          </div>
          
          {/* Información Principal */}
          <div className="max-w-3xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <span className="px-3 py-1 rounded-md bg-red-600 text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-red-600/50">
                AHORA EN CARTELERA
              </span>
              <span className="text-gray-400 text-sm font-bold tracking-tight">
                {(movie.Genre || 'Cine').split(',')[0]} · {movie.Duration} min
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              {movie.MovieName}
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl mb-10 line-clamp-3 font-medium leading-relaxed max-w-xl">
              {movie.Description || 'Disfruta de la mejor calidad de imagen y sonido en nuestras salas VIP.'}
            </p>
            
            {/* Rating y valoraciones */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold">{displayRating}</span>
              </div>
              <span className="text-gray-400 text-sm">{reviewSummary.reviewCount} valoraciones</span>
            </div>
            
            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              <Link
                href="#funciones"
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

      {/* Content Section */}
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-24 space-y-32">
          
          {/* Información Detallada */}
          <section className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Detalles principales */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-gray-800 p-8">
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 mb-6">
                    Información de la Película
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Director</p>
                      <p className="text-white font-semibold text-lg">{movieDirector}</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Duración</p>
                      <p className="text-white font-semibold text-lg">{movie.Duration} minutos</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Clasificación</p>
                      <p className="text-white font-semibold text-lg">+{movie.AgeLimit}</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Género</p>
                      <p className="text-white font-semibold text-lg">{movie.Genre}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Sinopsis</p>
                    <p className="text-gray-300 text-base leading-relaxed">{movieDescription}</p>
                  </div>
                  
                  {movie.Cast && movie.Cast.length > 0 && (
                    <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Reparto</p>
                      <p className="text-gray-300 text-base leading-relaxed">{castList}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trailer y acciones */}
              <div className="space-y-6">
                {movie.TrailerURL && (
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-gray-800 p-6">
                    <h3 className="text-xl font-black text-white mb-4">Tráiler</h3>
                    <a
                      href={movie.TrailerURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 rounded-xl bg-red-600 text-white text-center font-black hover:bg-red-700 transition-all hover:scale-105 shadow-lg shadow-red-500/30"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Ver Tráiler Oficial
                      </div>
                    </a>
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-gray-800 p-6">
                  <h3 className="text-xl font-black text-white mb-4">Comparte</h3>
                  <div className="flex gap-3">
                    <button className="w-12 h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105">
                      <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="w-12 h-12 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-all hover:scale-105">
                      <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button className="w-12 h-12 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all hover:scale-105">
                      <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* Sección de Funciones */}
        <section id="funciones" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-2">Funciones Disponibles</h2>
              <p className="text-gray-400 text-sm">Elige la función que mejor te venga</p>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No hay funciones disponibles</h3>
              <p className="text-gray-400 text-sm">Vuelve más tarde para ver próximas funciones.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <SessionCard key={session._id} session={session} />
              ))}
            </div>
          )}
        </section>

        {/* Sección de Valoraciones */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Valoraciones de Clientes */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-gray-800 p-8">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 mb-6">
                Valoraciones de Clientes
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Promedio</p>
                  <p className="text-3xl font-black text-white">
                    {reviewSummary.averageScore.toFixed(1)}
                    <span className="text-sm font-semibold text-gray-400">/5</span>
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Opiniones</p>
                  <p className="text-3xl font-black text-white">{reviewSummary.reviewCount}</p>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-400 py-8 text-center">Todavía no hay valoraciones para esta película.</p>
                ) : (
                  reviews.map((review) => {
                    const customer = typeof review.CustomerID === 'object' ? review.CustomerID : null;
                    return (
                      <div key={review._id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {customer ? `${customer.Name} ${customer.Surname}` : 'Cliente Anónimo'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt || '').toLocaleDateString('es-ES', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric',
                                timeZone: 'UTC'
                              })}
                            </p>
                          </div>
                          <div className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-md">
                            <span className="text-xs font-bold">{review.Score}/5</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{review.Comment}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Tu Valoración */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-gray-800 p-8">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 mb-6">
                Tu Valoración
              </h2>
              
              {canReview ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-300 mb-4">Puntuación:</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => setReviewForm({ ...reviewForm, Score: score })}
                          className={`px-4 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                            reviewForm.Score === score
                              ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/30'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {score} ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <textarea
                      value={reviewForm.Comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, Comment: e.target.value })}
                      placeholder="Comparte tu experiencia..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all resize-none"
                      rows={4}
                    />
                  </div>
                  
                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-lg shadow-lg shadow-red-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Enviando...' : 'Enviar Valoración'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-4">
                    {reviewReason || 'Debes ver la película para poder valorarla'}
                  </p>
                  {myReview && (
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-sm font-semibold text-white mb-2">Tu valoración anterior:</p>
                      <div className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-md inline-block mb-2">
                        <span className="text-xs font-bold">{myReview.Score}/5</span>
                      </div>
                      <p className="text-sm text-gray-300">{myReview.Comment}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        </div>
      </div>

      {/* Footer Cinematográfico */}
      <footer className="bg-black py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-xl">C</div>
              <span className="text-2xl font-black tracking-tighter text-white">Cine<span className="text-red-600">book</span></span>
            </div>
            <div className="flex gap-10 text-gray-500 text-sm font-bold">
              <Link href="/movies" className="hover:text-white transition-colors">Películas</Link>
              <Link href="/account/login" className="hover:text-white transition-colors">Mi Cuenta</Link>
              <Link href="/admin/login" className="hover:text-white transition-colors">Administración</Link>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center text-gray-600 text-xs font-bold">
            2026 PROYECTO CINEBOOK • TODOS LOS DERECHOS RESERVADOS
          </div>
        </div>
      </footer>
    </>
  );
}

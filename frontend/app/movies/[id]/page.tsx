'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { moviesApi, reviewsApi, sessionsApi } from '@/lib/api';
import { getStoredSession } from '@/lib/auth';
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

  const [isMounted, setIsMounted] = useState(false);

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
          setReviewReason('Inicia sesión como cliente para valorar esta película.');
        }
      } else {
        setCanReview(false);
        setMyReview(null);
        setReviewReason('Inicia sesión como cliente para valorar esta película.');
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
      toast.success(myReview ? 'Valoración actualizada correctamente' : 'Valoración enviada correctamente');

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
      const message = error?.response?.data?.error || 'No se pudo guardar tu valoración';
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
            <p className="text-gray-400 text-sm font-medium">Cargando película...</p>
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Película no encontrada</h2>
            <Link href="/movies" className="text-red-600 hover:text-red-700 text-sm font-semibold">
              ← Volver a películas
            </Link>
          </div>
        </div>
      </>
    );
  }

  const hasUserRating = Boolean(movie.UserRatingCount && movie.UserRatingCount > 0);
  const displayRating = hasUserRating
<<<<<<< HEAD
    ? `${movie.UserRatingAverage?.toFixed(1)}/5`
    : `${movie.Rating}/10`;
=======
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
>>>>>>> 8b92dbb7e776e81780a8938fa72038bc4559b760

  return (
    <>
      <PublicNavigation />
      <div className="min-h-screen bg-gray-50 text-gray-900">

<<<<<<< HEAD
        {/* ── Hero ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <Link
              href="/movies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
=======
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <img
              src={posterSrc}
              alt=""
              className="w-full h-full object-cover blur-md scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-4 py-6 md:py-8 md:pt-12">
            <Link href="/movies" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 md:mb-8 font-bold text-sm md:text-base transition-colors group">
              <svg className="w-6 h-6 transform group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
>>>>>>> 8b92dbb7e776e81780a8938fa72038bc4559b760
              </svg>
              Volver a películas
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Poster */}
              <div className="md:col-span-1">
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg aspect-[2/3] bg-gray-100">
                  <img
                    src={posterSrc}
                    alt={movie.MovieName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x450/f3f4f6/d1d5db?text=Sin+poster';
                    }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="md:col-span-2 flex flex-col gap-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100 uppercase tracking-wide">
                      {movie.Genre}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                      {movie.AgeLimit}+
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
                    {movie.MovieName}
                  </h1>

                  {/* Rating row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold">{displayRating}</span>
                    </div>
                    <span className="text-sm text-gray-400">{reviewSummary.reviewCount} valoraciones</span>
                  </div>
                </div>

                {/* Details card */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
                  <div>
<<<<<<< HEAD
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Director</p>
                    <p className="text-gray-900 font-semibold">{movie.Director}</p>
=======
                    <h3 className="text-sm font-black text-yellow-400 mb-2 tracking-widest">DIRECTOR</h3>
                    <p className="text-xl md:text-2xl font-bold text-white">{movieDirector}</p>
>>>>>>> 8b92dbb7e776e81780a8938fa72038bc4559b760
                  </div>
                  <div>
<<<<<<< HEAD
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Reparto</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{movie.Cast.join(', ')}</p>
=======
                    <h3 className="text-sm font-black text-yellow-400 mb-2 tracking-widest">REPARTO</h3>
                    <p className="text-base md:text-xl text-gray-300 leading-relaxed">{castList}</p>
>>>>>>> 8b92dbb7e776e81780a8938fa72038bc4559b760
                  </div>
                  <div>
<<<<<<< HEAD
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sinopsis</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{movie.Description}</p>
=======
                    <h3 className="text-sm font-black text-yellow-400 mb-2 tracking-widest">SINOPSIS</h3>
                    <p className="text-base md:text-lg text-gray-300 leading-relaxed">{movieDescription}</p>
>>>>>>> 8b92dbb7e776e81780a8938fa72038bc4559b760
                  </div>
                </div>

                {movie.TrailerURL && (
                  <a
                    href={movie.TrailerURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100 self-start"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Ver tráiler
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Sessions ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Funciones disponibles</h2>
              <p className="text-gray-400 text-sm mt-1">Elige la función que mejor te venga</p>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No hay funciones disponibles</h3>
              <p className="text-gray-400 text-sm">Vuelve más tarde para ver próximas funciones.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sessions.map((session) => (
                <SessionCard key={session._id} session={session} />
              ))}
            </div>
          )}
        </section>

        {/* ── Reviews ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* All reviews */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-extrabold text-gray-900 mb-5">Valoraciones de clientes</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1">Promedio</p>
                  <p className="text-2xl font-extrabold text-gray-900">{reviewSummary.averageScore.toFixed(1)}<span className="text-sm font-semibold text-gray-400">/5</span></p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1">Opiniones</p>
                  <p className="text-2xl font-extrabold text-gray-900">{reviewSummary.reviewCount}</p>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Todavía no hay valoraciones para esta película.</p>
                ) : (
                  reviews.map((review) => {
                    const customer = typeof review.CustomerID === 'object' ? review.CustomerID : null;
                    return (
                      <div key={review._id} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-gray-900">
                            {customer ? `${customer.Name} ${customer.Surname}` : 'Cliente'}
                          </p>
                          <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-md">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-bold">{review.Score}/5</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{review.Comment || 'Sin comentario adicional.'}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* My review */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-extrabold text-gray-900 mb-5">Tu valoración</h2>

              {canReview ? (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Puntuación</p>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, Score: score })}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            reviewForm.Score === score
                              ? 'bg-yellow-400 text-yellow-900 shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {score} ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Comentario
                    </label>
                    <textarea
                      value={reviewForm.Comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, Comment: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm resize-none focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 placeholder-gray-300"
                      placeholder="Cuéntales a otros clientes cómo fue tu experiencia..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold transition-colors shadow-lg shadow-red-100"
                  >
                    {submittingReview ? 'Guardando...' : myReview ? 'Actualizar valoración' : 'Enviar valoración'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">{reviewReason || 'Necesitas haber visto la película para valorarla.'}</p>
                  {!getStoredSession() && (
                    <Link
                      href={`/account/login?redirect=${encodeURIComponent(`/movies/${movieId}`)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                    >
                      Iniciar sesión
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-gray-800 font-bold text-sm">Cine<span className="text-red-600">book</span></span>
            </div>
            <p className="text-gray-400 text-xs">Proyecto SIS 226 2026</p>
          </div>
        </footer>
      </div>
    </>
  );
}

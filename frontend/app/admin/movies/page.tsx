'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import { moviesApi } from '@/lib/api';
import { Movie } from '@/lib/types';

type MovieFormData = {
  MovieName: string;
  Genre: string;
  Duration: string;
  AgeLimit: string;
  Description: string;
  PosterURL: string;
  Director: string;
  Cast: string;
  Rating: string;
  TrailerURL: string;
};

const emptyFormData: MovieFormData = {
  MovieName: '',
  Genre: '',
  Duration: '',
  AgeLimit: '',
  Description: '',
  PosterURL: '',
  Director: '',
  Cast: '',
  Rating: '',
  TrailerURL: '',
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<MovieFormData>(emptyFormData);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesApi.getAll();
      setMovies(response.data);
    } catch (error) {
      toast.error('No se pudieron cargar las peliculas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (movie?: Movie) => {
    if (movie) {
      setSelectedMovie(movie);
      setFormData({
        MovieName: movie.MovieName,
        Genre: movie.Genre,
        Duration: movie.Duration.toString(),
        AgeLimit: movie.AgeLimit.toString(),
        Description: movie.Description || '',
        PosterURL: movie.PosterURL || '',
        Director: movie.Director || '',
        Cast: movie.Cast?.join(', ') || '',
        Rating: typeof movie.Rating === 'number' && movie.Rating > 0 ? movie.Rating.toString() : '',
        TrailerURL: movie.TrailerURL || '',
      });
    } else {
      setSelectedMovie(null);
      setFormData(emptyFormData);
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setFormData(emptyFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const cast = formData.Cast
        .split(',')
        .map((actor) => actor.trim())
        .filter(Boolean);

      const data = {
        MovieName: formData.MovieName.trim(),
        Genre: formData.Genre.trim(),
        Duration: parseInt(formData.Duration, 10),
        AgeLimit: parseInt(formData.AgeLimit, 10),
        Description: formData.Description.trim(),
        PosterURL: formData.PosterURL.trim(),
        Director: formData.Director.trim(),
        Cast: cast,
        Rating: formData.Rating.trim() ? parseFloat(formData.Rating) : 0,
        TrailerURL: formData.TrailerURL.trim(),
      };

      if (selectedMovie) {
        await moviesApi.update(selectedMovie._id, data);
        toast.success('Pelicula actualizada correctamente');
      } else {
        await moviesApi.create(data);
        toast.success('Pelicula agregada correctamente');
      }

      handleCloseModal();
      fetchMovies();
    } catch (error) {
      const message = (error as any)?.response?.data?.error || 'La operacion fallo';
      toast.error(message);
      console.error(error);
    }
  };

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!movieToDelete) {
      return;
    }

    try {
      await moviesApi.delete(movieToDelete._id);
      toast.success('Pelicula eliminada correctamente');
      fetchMovies();
    } catch (error) {
      const message = (error as any)?.response?.data?.error || 'No se pudo eliminar la pelicula';
      toast.error(message);
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setMovieToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Peliculas</h1>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Agregar pelicula
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pelicula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Genero
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Duracion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Calificacion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {movies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron peliculas. Agrega la primera.
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        {movie.PosterURL && (
                          <img
                            src={movie.PosterURL}
                            alt={movie.MovieName}
                            className="mr-3 h-16 w-12 rounded object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {movie.MovieName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {movie.Director || 'Sin director registrado'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600">{movie.Genre}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600">{movie.Duration} min</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-semibold text-yellow-600">
                        {typeof movie.Rating === 'number' && movie.Rating > 0
                          ? `⭐ ${movie.Rating.toFixed(1)}`
                          : 'Sin calificacion'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(movie)}
                        className="mr-4 text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(movie)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMovie ? 'Editar pelicula' : 'Agregar nueva pelicula'}
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Titulo *
              </label>
              <input
                type="text"
                required
                value={formData.MovieName}
                onChange={(e) => setFormData({ ...formData, MovieName: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Director
              </label>
              <input
                type="text"
                value={formData.Director}
                onChange={(e) => setFormData({ ...formData, Director: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Genero *
              </label>
              <input
                type="text"
                required
                value={formData.Genre}
                onChange={(e) => setFormData({ ...formData, Genre: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Accion, Drama"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Duracion (minutos) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.Duration}
                onChange={(e) => setFormData({ ...formData, Duration: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Clasificacion por edad *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.AgeLimit}
                onChange={(e) => setFormData({ ...formData, AgeLimit: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Calificacion (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.Rating}
                onChange={(e) => setFormData({ ...formData, Rating: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reparto (separado por comas)
              </label>
              <input
                type="text"
                value={formData.Cast}
                onChange={(e) => setFormData({ ...formData, Cast: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                URL del poster
              </label>
              <input
                type="url"
                value={formData.PosterURL}
                onChange={(e) => setFormData({ ...formData, PosterURL: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://image.tmdb.org/..."
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                URL del trailer
              </label>
              <input
                type="url"
                value={formData.TrailerURL}
                onChange={(e) => setFormData({ ...formData, TrailerURL: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.youtube.com/..."
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Descripcion
              </label>
              <textarea
                rows={3}
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {selectedMovie ? 'Actualizar' : 'Agregar'} pelicula
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar pelicula"
        message="Estas seguro de que deseas eliminar esta pelicula? Tambien se borraran sus funciones, reservas y entradas asociadas."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { moviesApi } from '@/lib/api';
import { Movie } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesApi.getAll();
      setMovies(response.data);
    } catch (error) {
      toast.error('Failed to fetch movies');
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
        Description: movie.Description,
        PosterURL: movie.PosterURL || '',
        Director: movie.Director || '',
        Cast: movie.Cast?.join(', ') || '',
        Rating: movie.Rating?.toString() || '',
        TrailerURL: movie.TrailerURL || '',
      });
    } else {
      setSelectedMovie(null);
      setFormData({
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
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        MovieName: formData.MovieName,
        Genre: formData.Genre,
        Duration: parseInt(formData.Duration),
        AgeLimit: parseInt(formData.AgeLimit),
        Description: formData.Description,
        PosterURL: formData.PosterURL,
        Director: formData.Director,
        Cast: formData.Cast.split(',').map(actor => actor.trim()),
        Rating: parseFloat(formData.Rating),
        TrailerURL: formData.TrailerURL,
      };

      if (selectedMovie) {
        await moviesApi.update(selectedMovie._id, data);
        toast.success('Movie updated successfully');
      } else {
        await moviesApi.create(data);
        toast.success('Movie added successfully');
      }

      handleCloseModal();
      fetchMovies();
    } catch (error) {
      toast.error('Operation failed');
      console.error(error);
    }
  };

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return;

    try {
      await moviesApi.delete(movieToDelete._id);
      toast.success('Movie deleted successfully');
      fetchMovies();
    } catch (error) {
      toast.error('Failed to delete movie');
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setMovieToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Movies</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Movie
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No movies found. Add your first movie!
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {movie.PosterURL && (
                          <img
                            src={movie.PosterURL}
                            alt={movie.MovieName}
                            className="h-16 w-12 object-cover rounded mr-3"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {movie.MovieName}
                          </div>
                          <div className="text-sm text-gray-500">{movie.Director}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{movie.Genre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{movie.Duration} min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-yellow-600">
                        ⭐ {movie.Rating?.toFixed(1) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(movie)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(movie)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMovie ? 'Edit Movie' : 'Add New Movie'}
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie Name *
              </label>
              <input
                type="text"
                required
                value={formData.MovieName}
                onChange={(e) => setFormData({ ...formData, MovieName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Director *
              </label>
              <input
                type="text"
                required
                value={formData.Director}
                onChange={(e) => setFormData({ ...formData, Director: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre *
              </label>
              <input
                type="text"
                required
                value={formData.Genre}
                onChange={(e) => setFormData({ ...formData, Genre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Action, Drama"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.Duration}
                onChange={(e) => setFormData({ ...formData, Duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Limit *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.AgeLimit}
                onChange={(e) => setFormData({ ...formData, AgeLimit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (0-10) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="10"
                step="0.1"
                value={formData.Rating}
                onChange={(e) => setFormData({ ...formData, Rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cast (comma separated) *
              </label>
              <input
                type="text"
                required
                value={formData.Cast}
                onChange={(e) => setFormData({ ...formData, Cast: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poster URL *
              </label>
              <input
                type="url"
                required
                value={formData.PosterURL}
                onChange={(e) => setFormData({ ...formData, PosterURL: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://image.tmdb.org/..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trailer URL
              </label>
              <input
                type="url"
                value={formData.TrailerURL}
                onChange={(e) => setFormData({ ...formData, TrailerURL: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.youtube.com/..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {selectedMovie ? 'Update' : 'Add'} Movie
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Movie"
        message="Are you sure you want to delete this movie? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}


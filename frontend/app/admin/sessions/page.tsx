'use client';

import { useState, useEffect } from 'react';
import { sessionsApi, moviesApi, hallsApi } from '@/lib/api';
import { MovieSession, Movie, Hall } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<MovieSession[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<MovieSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<MovieSession | null>(null);

  const [formData, setFormData] = useState({
    MovieID: '',
    HallID: '',
    SessionDateTime: '',
    Price: '',
    Language: '',
    SubtitleInfo: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, moviesRes, hallsRes] = await Promise.all([
        sessionsApi.getAll(),
        moviesApi.getAll(),
        hallsApi.getAll(),
      ]);
      setSessions(sessionsRes.data);
      setMovies(moviesRes.data);
      setHalls(hallsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (session?: MovieSession) => {
    if (session) {
      // Edit mode
      setSelectedSession(session);
      
      // Safely format date
      let formattedDate = '';
      try {
        const date = new Date(session.SessionDateTime);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().slice(0, 16);
        }
      } catch (error) {
        console.error('Invalid date:', session.SessionDateTime);
      }
      
      setFormData({
        MovieID: typeof session.MovieID === 'object' ? session.MovieID._id : session.MovieID,
        HallID: typeof session.HallID === 'object' ? session.HallID._id : session.HallID,
        SessionDateTime: formattedDate,
        Price: session.Price?.toString() || '0',
        Language: session.Language || '',
        SubtitleInfo: session.SubtitleInfo || '',
      });
    } else {
      // Create mode
      setSelectedSession(null);
      setFormData({
        MovieID: '',
        HallID: '',
        SessionDateTime: '',
        Price: '',
        Language: '',
        SubtitleInfo: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        Price: parseFloat(formData.Price),
      };

      if (selectedSession) {
        // Update existing session
        await sessionsApi.update(selectedSession._id, data);
        toast.success('Session updated successfully');
      } else {
        // Create new session
        await sessionsApi.create(data);
        toast.success('Session added successfully');
      }
      
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error(selectedSession ? 'Failed to update session' : 'Failed to add session');
      console.error(error);
    }
  };

  const handleDeleteClick = (session: MovieSession) => {
    setSessionToDelete(session);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;

    try {
      await sessionsApi.delete(sessionToDelete._id);
      toast.success('Session deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete session');
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setSessionToDelete(null);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMovieName = (movieId: string | Movie) => {
    if (typeof movieId === 'object') return movieId.MovieName;
    const movie = movies.find((m) => m._id === movieId);
    return movie?.MovieName || 'Unknown';
  };

  const getHallName = (hallId: string | Hall) => {
    if (typeof hallId === 'object') return hallId.HallName;
    const hall = halls.find((h) => h._id === hallId);
    return hall?.HallName || 'Unknown';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Movie Sessions</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Session
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No sessions found. Add your first session!
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {typeof session.MovieID === 'object'
                      ? session.MovieID.MovieName
                      : getMovieName(session.MovieID)}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(session)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(session)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-20">Hall:</span>
                    <span>
                      {typeof session.HallID === 'object'
                        ? session.HallID.HallName
                        : getHallName(session.HallID)}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-20">Date:</span>
                    <span>{formatDateTime(session.SessionDateTime)}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-20">Price:</span>
                    <span className="font-semibold text-green-600">${session.Price}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-20">Language:</span>
                    <span>{session.Language}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-20">Subtitle:</span>
                    <span>{session.SubtitleInfo}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedSession ? 'Edit Session' : 'Add New Session'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie
              </label>
              <select
                required
                value={formData.MovieID}
                onChange={(e) => setFormData({ ...formData, MovieID: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.MovieName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hall
              </label>
              <select
                required
                value={formData.HallID}
                onChange={(e) => setFormData({ ...formData, HallID: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a hall</option>
                {halls.map((hall) => (
                  <option key={hall._id} value={hall._id}>
                    {hall.HallName} (Capacity: {hall.Capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.SessionDateTime}
                onChange={(e) => setFormData({ ...formData, SessionDateTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.Price}
                onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                required
                value={formData.Language}
                onChange={(e) => setFormData({ ...formData, Language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., English, Turkish"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle Info
              </label>
              <input
                type="text"
                value={formData.SubtitleInfo}
                onChange={(e) => setFormData({ ...formData, SubtitleInfo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Turkish, None"
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
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              {selectedSession ? 'Update Session' : 'Add Session'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}


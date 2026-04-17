'use client';

import { useState, useEffect } from 'react';
import { hallsApi, seatsApi } from '@/lib/api';
import { Hall, Seat } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import SeatGrid from '@/components/SeatGrid';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function HallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [hallToDelete, setHallToDelete] = useState<Hall | null>(null);

  const [formData, setFormData] = useState({
    HallName: '',
    Capacity: '',
  });

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const response = await hallsApi.getAll();
      setHalls(response.data);
    } catch (error) {
      toast.error('Failed to fetch halls');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (hall?: Hall) => {
    if (hall) {
      setSelectedHall(hall);
      setFormData({
        HallName: hall.HallName,
        Capacity: hall.Capacity.toString(),
      });
    } else {
      setSelectedHall(null);
      setFormData({
        HallName: '',
        Capacity: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHall(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        HallName: formData.HallName,
        Capacity: parseInt(formData.Capacity),
      };

      if (selectedHall) {
        await hallsApi.update(selectedHall._id, data);
        toast.success('Hall updated successfully');
      } else {
        await hallsApi.create(data);
        toast.success('Hall added successfully');
      }

      handleCloseModal();
      fetchHalls();
    } catch (error) {
      toast.error('Operation failed');
      console.error(error);
    }
  };

  const handleDeleteClick = (hall: Hall) => {
    setHallToDelete(hall);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!hallToDelete) return;

    try {
      await hallsApi.delete(hallToDelete._id);
      toast.success('Hall deleted successfully');
      fetchHalls();
    } catch (error) {
      toast.error('Failed to delete hall');
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setHallToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cinema Halls</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Hall
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No halls found. Add your first hall!
            </div>
          ) : (
            halls.map((hall) => (
              <div
                key={hall._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {hall.HallName}
                    </h3>
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-lg font-semibold text-indigo-600">
                        {hall.Capacity} seats
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/halls/${hall._id}/seats`}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
                  >
                    Manage Seats
                  </Link>
                  <button
                    onClick={() => handleOpenModal(hall)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(hall)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedHall ? 'Edit Hall' : 'Add New Hall'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hall Name
              </label>
              <input
                type="text"
                required
                value={formData.HallName}
                onChange={(e) => setFormData({ ...formData, HallName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Hall 1, VIP Hall, IMAX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (Total Seats)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.Capacity}
                onChange={(e) => setFormData({ ...formData, Capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 150"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">Note:</p>
              <p>After creating a hall, you can add individual seats through the Seats management section.</p>
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              {selectedHall ? 'Update' : 'Add'} Hall
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Hall"
        message={`Are you sure you want to delete "${hallToDelete?.HallName}"? This will also affect any sessions scheduled in this hall.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}


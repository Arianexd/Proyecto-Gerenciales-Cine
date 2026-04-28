'use client';

import { useState, useEffect } from 'react';
import { customersApi } from '@/lib/api';
import { Customer } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<Customer | null>(null);
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [formData, setFormData] = useState({
    Name: '',
    Surname: '',
    CI: '',
    Gender: 'Other',
    BirthDate: '',
    Age: 0,
    Email: '',
    PhoneNumber: '',
    Password: '',
    ConfirmPassword: '',
  });

  const calculateAgeFromBirthDate = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    return Math.max(age, 0);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersApi.getAll();
      setCustomers(response.data);
    } catch (error) {
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        Name: customer.Name,
        Surname: customer.Surname,
        CI: customer.CI || '',
        Gender: (customer.Gender as any) || 'Other',
        BirthDate: (customer as any).BirthDate || '',
        Age: customer.Age || 0,
        Email: customer.Email,
        PhoneNumber: customer.PhoneNumber,
        Password: '',
        ConfirmPassword: '',
      });
    } else {
      setSelectedCustomer(null);
      setFormData({
        Name: '',
        Surname: '',
        CI: '',
        Gender: 'Other',
        BirthDate: '',
        Age: 0,
        Email: '',
        PhoneNumber: '',
        Password: '',
        ConfirmPassword: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const normalizedCI = formData.CI.trim().toLowerCase();
      const ciAlreadyExists = customers.some((customer) => {
        const existingCI = (customer.CI || '').trim().toLowerCase();
        const isDifferentCustomer = selectedCustomer ? customer._id !== selectedCustomer._id : true;
        return isDifferentCustomer && existingCI === normalizedCI;
      });

      if (ciAlreadyExists) {
        toast.error('El CI ya existe. Debe ser unico.');
        return;
      }

      if (!selectedCustomer && formData.Password) {
        if (formData.Password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          return;
        }
        if (formData.Password !== formData.ConfirmPassword) {
          toast.error('Las contraseñas no coinciden');
          return;
        }
      }

      const payload: any = {
        Name: formData.Name,
        Surname: formData.Surname,
        CI: formData.CI.trim(),
        Gender: formData.Gender,
        BirthDate: formData.BirthDate,
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber,
        Age: calculateAgeFromBirthDate(formData.BirthDate),
      };

      if (selectedCustomer) {
        await customersApi.update(selectedCustomer._id, payload);
        toast.success('Cliente actualizado');
      } else {
        if (formData.Password) {
          payload.Password = formData.Password;
        }
        await customersApi.create(payload);
        toast.success(
          formData.Password
            ? 'Cliente creado con cuenta de acceso'
            : 'Cliente creado (sin cuenta de acceso)',
        );
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Error al guardar cliente';
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    try {
      await customersApi.delete(customerToDelete._id);
      toast.success('Cliente eliminado');
      fetchCustomers();
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const openPasswordModal = (customer: Customer) => {
    setPasswordTarget(customer);
    setPasswordValue('');
    setPasswordConfirm('');
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTarget) return;
    if (passwordValue.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwordValue !== passwordConfirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    try {
      await customersApi.setPassword(passwordTarget._id, passwordValue);
      toast.success(
        passwordTarget.HasAccount
          ? 'Contraseña actualizada'
          : 'Cuenta creada con contraseña',
      );
      setIsPasswordModalOpen(false);
      fetchCustomers();
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'No se pudo actualizar la contraseña';
      toast.error(msg);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Clientes</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
        >
          + AGREGAR CLIENTE
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">CI</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Edad</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Correo</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Teléfono</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Cuenta</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{c.Name} {c.Surname}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">
                      {c.Gender === 'Male' ? 'Masculino' : c.Gender === 'Female' ? 'Femenino' : 'Otro'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{c.CI}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.Age} años</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.Email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.PhoneNumber}</td>
                  <td className="px-6 py-4 text-sm">
                    {c.HasAccount ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                        ✓ Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                        Sin cuenta
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openPasswordModal(c)}
                      className="text-emerald-600 font-bold mr-4"
                      title={c.HasAccount ? 'Resetear contraseña' : 'Crear cuenta'}
                    >
                      {c.HasAccount ? 'Resetear' : 'Crear cuenta'}
                    </button>
                    <button onClick={() => handleOpenModal(c)} className="text-indigo-600 font-bold mr-4">Editar</button>
                    <button onClick={() => { setCustomerToDelete(c); setIsConfirmOpen(true); }} className="text-red-600 font-bold">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCustomer ? 'Editar cliente' : 'Agregar cliente'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Nombre" value={formData.Name} onChange={(e) => setFormData({...formData, Name: e.target.value})} className="border-2 p-2 rounded-lg outline-none focus:border-orange-500" required />
            <input placeholder="Apellido" value={formData.Surname} onChange={(e) => setFormData({...formData, Surname: e.target.value})} className="border-2 p-2 rounded-lg outline-none focus:border-orange-500" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input placeholder="CI" value={formData.CI} onChange={(e) => setFormData({...formData, CI: e.target.value})} className="border-2 p-2 rounded-lg outline-none focus:border-orange-500" required />
            <select value={formData.Gender} onChange={(e) => setFormData({...formData, Gender: e.target.value as any})} className="border-2 p-2 rounded-lg outline-none focus:border-orange-500">
              <option value="Male">Masculino</option>
              <option value="Female">Femenino</option>
              <option value="Other">Otro</option>
            </select>
            <input type="date" value={formData.BirthDate} onChange={(e) => setFormData({...formData, BirthDate: e.target.value})} className="border-2 p-2 rounded-lg outline-none focus:border-orange-500" required />
          </div>

          <p className="text-xs text-gray-500">
            Edad calculada automaticamente: <span className="font-semibold">{calculateAgeFromBirthDate(formData.BirthDate)} años</span>
          </p>

          <input placeholder="Correo electrónico" type="email" value={formData.Email} onChange={(e) => setFormData({...formData, Email: e.target.value})} className="w-full border-2 p-2 rounded-lg outline-none focus:border-orange-500" required />
          <input placeholder="Teléfono" value={formData.PhoneNumber} onChange={(e) => setFormData({...formData, PhoneNumber: e.target.value})} className="w-full border-2 p-2 rounded-lg outline-none focus:border-orange-500" required />

          {!selectedCustomer && (
            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Cuenta de acceso (opcional)</p>
                <p className="text-xs text-gray-500">
                  Si defines una contraseña, el cliente podrá iniciar sesión con su correo o CI y calificar las películas que vio. Déjala vacía para crear solo el perfil.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Contraseña (mín. 6)"
                  type="password"
                  value={formData.Password}
                  onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                  className="border-2 p-2 rounded-lg outline-none focus:border-orange-500"
                  minLength={6}
                  autoComplete="new-password"
                />
                <input
                  placeholder="Confirmar contraseña"
                  type="password"
                  value={formData.ConfirmPassword}
                  onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
                  className="border-2 p-2 rounded-lg outline-none focus:border-orange-500"
                  minLength={6}
                  autoComplete="new-password"
                  disabled={!formData.Password}
                />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg uppercase tracking-widest">Guardar cliente</button>
        </form>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title={passwordTarget?.HasAccount ? 'Resetear contraseña' : 'Crear cuenta de acceso'}
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordTarget && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-bold text-gray-900">{passwordTarget.Name} {passwordTarget.Surname}</p>
              <p className="text-gray-500">{passwordTarget.Email} · CI {passwordTarget.CI}</p>
            </div>
          )}
          <input
            placeholder="Nueva contraseña (mín. 6)"
            type="password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            className="w-full border-2 p-2 rounded-lg outline-none focus:border-orange-500"
            minLength={6}
            autoComplete="new-password"
            required
          />
          <input
            placeholder="Confirmar contraseña"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full border-2 p-2 rounded-lg outline-none focus:border-orange-500"
            minLength={6}
            autoComplete="new-password"
            required
          />
          <p className="text-xs text-gray-500">
            El cliente podrá iniciar sesión con su correo o CI y la nueva contraseña.
          </p>
          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg uppercase tracking-widest">
            {passwordTarget?.HasAccount ? 'Actualizar contraseña' : 'Crear cuenta'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDeleteConfirm} title="Eliminar cliente" message="¿Estás seguro?" confirmText="Eliminar" type="danger" />
    </div>
  );
}

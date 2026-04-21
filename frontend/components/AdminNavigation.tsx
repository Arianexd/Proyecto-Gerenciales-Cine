'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStoredSession, subscribeToAuthChanges } from '@/lib/auth';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊', roles: ['ADMIN'] },
  { name: 'Clientes', path: '/admin/customers', icon: '👥', roles: ['ADMIN', 'CAJERO'] },
  { name: 'Películas', path: '/admin/movies', icon: '🎬', roles: ['ADMIN'] },
  { name: 'Salas', path: '/admin/halls', icon: '🏛️', roles: ['ADMIN'] },
  { name: 'Funciones', path: '/admin/sessions', icon: '🎭', roles: ['ADMIN'] },
  { name: 'Reservas', path: '/admin/reservations', icon: '📋', roles: ['ADMIN', 'CAJERO'] },
  { name: 'Pagos', path: '/admin/payments', icon: '💳', roles: ['ADMIN', 'CAJERO'] },
];

export default function AdminNavigation() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const sync = () => {
      const session = getStoredSession();
      setRole(session?.user.Role ?? '');
    };
    sync();
    return subscribeToAuthChanges(sync);
  }, []);

  const filtered = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto space-x-2">
          {filtered.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap text-sm font-black transition-all border-b-4 ${
                pathname === item.path
                  ? 'border-orange-600 text-orange-600 bg-orange-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span className="tracking-tighter uppercase">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/types';

export default function AdminNavigation({ user }: { user: User }) {
  const pathname = usePathname();

  // Definimos qué puede ver cada rol
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊', roles: ['admin', 'cajero'] },
    { name: 'Customers', path: '/admin/customers', icon: '👥', roles: ['admin', 'cajero'] },
    { name: 'Movies', path: '/admin/movies', icon: '🎬', roles: ['admin'] },
    { name: 'Halls', path: '/admin/halls', icon: '🏛️', roles: ['admin'] },
    { name: 'Sessions', path: '/admin/sessions', icon: '🎭', roles: ['admin'] },
    { name: 'Reservations', path: '/admin/reservations', icon: '📋', roles: ['admin', 'cajero'] },
    { name: 'Payments', path: '/admin/payments', icon: '💳', roles: ['admin', 'cajero'] },
  ];

  // Filtramos los items según el rol del usuario actual
  const filteredItems = navItems.filter(item => item.roles.includes(user.Role));

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto space-x-2">
          {filteredItems.map((item) => (
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

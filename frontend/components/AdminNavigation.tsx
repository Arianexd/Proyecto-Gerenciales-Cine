'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Customers', path: '/admin/customers', icon: '👥' },
    { name: 'Movies', path: '/admin/movies', icon: '🎬' },
    { name: 'Halls', path: '/admin/halls', icon: '🏛️' },
    { name: 'Sessions', path: '/admin/sessions', icon: '🎭' },
    { name: 'Reservations', path: '/admin/reservations', icon: '📋' },
    { name: 'Payments', path: '/admin/payments', icon: '💳' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors border-b-2 ${
                pathname === item.path
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


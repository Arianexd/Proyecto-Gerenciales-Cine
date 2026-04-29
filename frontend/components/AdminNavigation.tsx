'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthUser, UserRole } from '@/lib/auth';

type NavItem = {
  name: string;
  path: string;
  icon: string;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin', icon: '📊', roles: ['ADMIN'] },
  { name: 'Caja POS', path: '/admin/pos', icon: '🖥️', roles: ['CAJERO'] },
  { name: 'Clientes', path: '/admin/customers', icon: '👥', roles: ['ADMIN', 'CAJERO'] },
  { name: 'Peliculas', path: '/admin/movies', icon: '🎬', roles: ['ADMIN'] },
  { name: 'Salas', path: '/admin/halls', icon: '🏛️', roles: ['ADMIN'] },
  { name: 'Funciones', path: '/admin/sessions', icon: '🎭', roles: ['ADMIN'] },
  { name: 'Reservas', path: '/admin/reservations', icon: '📋', roles: ['ADMIN', 'CAJERO'] },
  { name: 'Pagos', path: '/admin/payments', icon: '💳', roles: ['ADMIN', 'CAJERO'] },
  { name: 'Snacks', path: '/admin/snacks', icon: '🍿', roles: ['ADMIN'] },
  { name: 'Vender Snacks', path: '/admin/snacks/sell', icon: '🛒', roles: ['CAJERO'] },
];

export default function AdminNavigation({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const filteredItems = navItems.filter((item) => item.roles.includes(user.Role));

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }

    return pathname.startsWith(path);
  };

  return (
    <div className="glass-panel border-b border-cyan-500/10 shadow-[0_0_20px_rgba(71,191,255,0.05)]">
      <div className="container mx-auto px-6">
        <div className="flex overflow-x-auto space-x-2 py-2">
          {filteredItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`admin-nav-item flex items-center gap-3 px-6 py-4 whitespace-nowrap text-sm font-bold transition-all rounded-2xl ${
                isActive(item.path)
                  ? 'active text-cyan-300 bg-slate-900/80 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900/50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="tracking-tight uppercase">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

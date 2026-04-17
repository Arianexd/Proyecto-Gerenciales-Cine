'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'HOME', path: '/', icon: '🏠' },
    { name: 'MOVIES', path: '/movies', icon: '🎬' },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-2xl sticky top-0 z-50 border-b-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Cinema Style */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                🎬
              </div>
              <div className="absolute -inset-1 bg-red-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 tracking-wider">
                CINEBOOK
              </span>
              <span className="text-xs text-yellow-400 tracking-widest font-semibold">PREMIUM CINEMA EXPERIENCE</span>
            </div>
          </Link>

          {/* Navigation Links - Cinema Style */}
          <div className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-black tracking-wider transition-all duration-300 transform hover:scale-105 ${
                  pathname === item.path
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-red-600/20'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
                {pathname === item.path && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                )}
              </Link>
            ))}

            {/* Admin Login Button - Cinema Ticket Style */}
            <Link
              href="/admin/login"
              className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-lg text-sm font-black tracking-wider transition-all duration-300 shadow-lg shadow-yellow-500/50 transform hover:scale-105 overflow-hidden group"
            >
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="relative z-10">ADMIN</span>
              {/* Film strip perforations effect */}
              <div className="absolute top-0 left-0 w-full h-full flex gap-1 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex-1 bg-black"></div>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Film strip decoration */}
      <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
    </nav>
  );
}

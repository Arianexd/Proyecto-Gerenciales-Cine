'use client';

import RoleProtectedRoute from './RoleProtectedRoute';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={['ADMIN', 'CAJERO']} redirectTo="/account/login">
      {children}
    </RoleProtectedRoute>
  );
}

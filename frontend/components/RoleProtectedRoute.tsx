'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { UserRole, useAuthSession } from '@/lib/auth';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  redirectTo: string;
  children: React.ReactNode;
}

export default function RoleProtectedRoute({
  allowedRoles,
  redirectTo,
  children,
}: RoleProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAuthSession();
  const [hasMounted, setHasMounted] = useState(false);

  const allowedRolesKey = allowedRoles.join('|');
  const isAuthorized = useMemo(() => {
    if (!session) {
      return false;
    }

    return allowedRoles.includes(session.user.Role);
  }, [allowedRolesKey, allowedRoles, session]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || isAuthorized) {
      return;
    }

    const redirectUrl = pathname
      ? `${redirectTo}?redirect=${encodeURIComponent(pathname)}`
      : redirectTo;

    router.replace(redirectUrl);
  }, [hasMounted, isAuthorized, pathname, redirectTo, router]);

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

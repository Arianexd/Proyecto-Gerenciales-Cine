'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const redirect = new URLSearchParams(search).get('redirect');
    const target = redirect
      ? `/account/login?redirect=${encodeURIComponent(redirect)}`
      : '/account/login?redirect=/admin';
    router.replace(target);
  }, [router]);

  return null;
}

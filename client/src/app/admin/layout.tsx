'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isLoginPage) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/admin/login');
      }
    }
  }, [isAuthenticated, user, isLoading, isLoginPage, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoginPage && (!isAuthenticated || user?.role !== 'admin')) {
    return null;
  }

  return (
    <>
      {!isLoginPage && <Navbar />}
      {children}
    </>
  );
}


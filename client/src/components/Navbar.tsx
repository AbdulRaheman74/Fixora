'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from './Button';

// TODO: Replace with final logo files from designer
// Logo paths - SVG files in public/assets/logo/
const LogoIcon = '/assets/logo/logo-icon.svg';
const LogoFull = '/assets/logo/logo-full.svg';
const LogoFullDark = '/assets/logo/logo-full-dark.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAdminRoute = pathname?.startsWith('/admin');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    if (isAdminRoute) {
      router.push('/admin/login');
    } else {
      router.push('/');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Responsive: Icon only on mobile, full logo on desktop */}
          <Link 
            href={isAdmin ? '/admin' : '/'} 
            className="flex items-center gap-2 group"
            aria-label="Fixora - Smart Solutions for Your Home"
          >
            {/* Icon only - visible on mobile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden relative"
            >
              <Image
                src={LogoIcon}
                alt="Fixora - Smart Solutions for Your Home"
                width={40}
                height={40}
                className="transition-opacity group-hover:opacity-80"
                priority
              />
            </motion.div>
            
            {/* Full logo - visible on desktop */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:flex items-center gap-2"
            >
              <Image
                src={LogoFull}
                alt="Fixora - Smart Solutions for Your Home"
                width={140}
                height={40}
                className="h-8 w-auto transition-opacity group-hover:opacity-90"
                priority
              />
            </motion.div>
            
            {/* Admin Panel text fallback */}
            {isAdmin && (
              <span className="hidden md:block text-lg font-semibold text-gray-700 ml-2">
                Admin Panel
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isAdminRoute && navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {!isAdminRoute && (
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                )}
                {isAdmin && !isAdminRoute && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              !isAdminRoute && (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">Sign Up</Button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {!isAdminRoute && navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 font-medium ${
                    pathname === link.href
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {!isAdminRoute && (
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 font-medium text-gray-700"
                    >
                      Profile
                    </Link>
                  )}
                  {isAdmin && !isAdminRoute && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 font-medium text-gray-700"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left py-2 font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                !isAdminRoute && (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 font-medium text-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 font-medium text-primary-600"
                    >
                      Sign Up
                    </Link>
                  </>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}


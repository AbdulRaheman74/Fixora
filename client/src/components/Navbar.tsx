'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from './Button';

const LogoIcon = '/assets/logo/logo-icon.svg';
const LogoFull = '/assets/logo/logo-full.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IMPORTANT: Loading ke dauran kuch nahi dikhao - sirf loading complete hone ke baad
  // Admin check - loading complete + user admin hona chahiye
  const isAdmin = !isLoading && isAuthenticated && user?.role === 'admin';
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Authenticated UI sirf tab dikhao jab loading complete ho
  const showAuthenticatedUI = !isLoading && isAuthenticated;

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
          {/* Logo link - admin routes par /admin, normal pages par / */}
          {/* Mobile view me logo + naam dikhayenge, desktop me full logo */}
          <Link 
            href={isAdminRoute ? '/admin' : '/'} 
            className="flex items-center gap-2 sm:gap-3 group"
            aria-label="Fixora - Smart Solutions for Your Home"
          >
            {/* Mobile View - Logo Icon + Text */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 md:hidden"
            >
              <Image
                src={LogoIcon}
                alt="Fixora"
                width={36}
                height={36}
                className="transition-opacity group-hover:opacity-80 flex-shrink-0"
                priority
              />
              {/* Fixora Text - Mobile me dikhayenge */}
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Fixora
              </span>
            </motion.div>

            {/* Desktop View - Full Logo */}
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

            {/* "Admin Panel" text sirf admin routes par dikhao, normal pages par nahi */}
            {isAdmin && isAdminRoute && (
              <span className="hidden md:block text-lg font-semibold text-gray-700 ml-2">
                Admin Panel
              </span>
            )}
          </Link>

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

            {showAuthenticatedUI ? (
              <div className="flex items-center gap-4">
                {!isAdminRoute && (
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              !isLoading && !isAdminRoute && (
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

          {/* Premium Mobile Toggle Button - Stylish, Professional, Official */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
            className="md:hidden relative p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {/* Animated Background Glow Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            
            {/* Icon Container */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Premium Mobile Menu - Smooth Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-lg"
          >
            <div className="px-4 py-6 space-y-2">
              {/* Navigation Links - Premium Styling */}
              {!isAdminRoute && navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      pathname === link.href
                        ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {/* User Actions - Premium Styling */}
              {showAuthenticatedUI ? (
                <>
                  {!isAdminRoute && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 py-3 px-4 rounded-lg font-semibold text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                      >
                        <User className="w-5 h-5" />
                        Profile
                      </Link>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left py-3 px-4 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                !isLoading && !isAdminRoute && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="block py-3 px-4 rounded-lg font-semibold text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 text-center"
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <Link
                        href="/signup"
                        onClick={() => setIsOpen(false)}
                        className="block py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 text-center shadow-lg"
                      >
                        Sign Up
                      </Link>
                    </motion.div>
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

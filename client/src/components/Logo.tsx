'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// TODO: Replace with final logo files from designer
// Logo component for reusable use across the site

interface LogoProps {
  variant?: 'icon' | 'full' | 'full-dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const logoPaths = {
  icon: '/assets/logo/logo-icon.svg',
  full: '/assets/logo/logo-full.svg',
  'full-dark': '/assets/logo/logo-full-dark.svg',
};

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const fullSizeClasses = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
};

export default function Logo({ 
  variant = 'full', 
  size = 'md',
  className = '',
  showText = true 
}: LogoProps) {
  const isIconOnly = variant === 'icon';
  const sizeClass = isIconOnly ? sizeClasses[size] : fullSizeClasses[size];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={logoPaths[variant]}
        alt="Fixora - Smart Solutions for Your Home"
        className={`${sizeClass} w-auto transition-opacity hover:opacity-80`}
        width={isIconOnly ? 40 : 140}
        height={isIconOnly ? 40 : 40}
      />
    </motion.div>
  );
}


'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause, Circle, Maximize2 } from 'lucide-react';

/**
 * ============================================
 * CAROUSEL COMPONENT - Premium Professional Design
 * ============================================
 * 
 * PURPOSE:
 * - Website ka hero section - sabse pehle dikhne wala component
 * - Professional, smooth, aur beautiful carousel with advanced features
 * 
 * FEATURES:
 * - Ultra-smooth animations with parallax effects
 * - Professional glassmorphic overlays
 * - Thumbnail navigation
 * - Auto-play with progress indicator
 * - Touch/swipe gestures for mobile
 * - Keyboard navigation support
 * - Beautiful visual effects
 */

/**
 * Slide interface for carousel slides
 */
interface Slide {
  id: number;
  src: string;
  title: string;
  subtitle?: string;
  description?: string;
  alt?: string;
}

/**
 * Carousel component props
 */
interface CarouselProps {
  slides?: Slide[];
  autoPlayInterval?: number;
  autoPlay?: boolean;
  showTitle?: boolean;
  className?: string;
}

/**
 * Default slides - Electrician & AC Technician work
 */
const defaultSlides: Slide[] = [
  {
    id: 1,
    src: 'https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?w=1920&auto=format&fit=crop&q=80',
    title: 'Premium Electrician Services',
    subtitle: 'Expert Electrical Solutions',
    description: 'Professional electrical installation, repair, and maintenance services by certified technicians',
    alt: 'Professional electrician working',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85',
    title: 'AC Installation & Repair',
    subtitle: 'Expert AC Technician Services',
    description: 'Complete AC installation, repair, and maintenance for all brands with warranty',
    alt: 'AC technician installing unit',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1920&q=85',
    title: 'Electrical Wiring Solutions',
    subtitle: 'Safe & Professional Wiring',
    description: 'Complete electrical wiring solutions with safety standards and code compliance',
    alt: 'Electrical wiring work',
  },
  {
    id: 4,
    src: 'https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=1920&auto=format&fit=crop&q=80',
    title: 'AC Maintenance & Service',
    subtitle: 'Keep Your AC Running Smoothly',
    description: 'Regular AC maintenance to keep your system efficient and reduce energy bills',
    alt: 'AC maintenance service',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=85',
    title: 'Electrical Panel Upgrades',
    subtitle: 'Modern & Safe Systems',
    description: 'Upgrade your electrical panel for better safety, capacity, and energy efficiency',
    alt: 'Electrical panel upgrade',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1920&q=85',
    title: '24/7 Emergency Service',
    subtitle: 'Available Round the Clock',
    description: 'Emergency electrical and AC repair services 24/7 in Nanded - We respond fast!',
    alt: '24/7 emergency service',
  },
];

/**
 * Premium Professional Carousel Component
 * 
 * Ultra-smooth, professional carousel with advanced animations,
 * parallax effects, and beautiful UI elements
 */
export default function Carousel({
  slides = defaultSlides,
  autoPlayInterval = 5000,
  autoPlay = true,
  showTitle = true,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  /**
   * Navigate to next slide
   */
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  /**
   * Navigate to previous slide
   */
  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  /**
   * Navigate to specific slide
   */
  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  }, [currentIndex]);

  /**
   * Toggle auto-play
   */
  const toggleAutoPlay = useCallback(() => {
    setIsPaused((prev) => !prev);
    setProgress(0);
  }, []);

  /**
   * Auto-play functionality with progress tracking
   */
  useEffect(() => {
    if (!autoPlay || isPaused || isHovered || isDragging) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setProgress(0);
      return;
    }

    setProgress(0);
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / autoPlayInterval) * 100, 100);
      setProgress(newProgress);
    }, 16); // 60fps smooth progress

    const timeout = setTimeout(() => {
      goToNext();
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(timeout);
    };
  }, [autoPlay, autoPlayInterval, isPaused, isHovered, isDragging, goToNext, currentIndex]);

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNext, goToPrevious, toggleAutoPlay]);

  /**
   * Handle drag end for mobile swipe
   */
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      const swipeThreshold = 50;
      const velocityThreshold = 500;

      if (Math.abs(info.velocity.x) > velocityThreshold) {
        if (info.velocity.x > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      } else if (Math.abs(info.offset.x) > swipeThreshold) {
        if (info.offset.x > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
      x.set(0);
      setProgress(0);
    },
    [goToNext, goToPrevious, x]
  );

  const currentSlide = slides[currentIndex];

  return (
    <div
      className={`relative w-full h-[100vh] min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px] overflow-hidden ${className}`}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (autoPlay) setIsPaused(false);
      }}
    >
      {/* Main Container with Parallax Effect */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              opacity: { duration: 0.6 },
              scale: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ x: springX }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Parallax */}
            {currentSlide.src.startsWith('http') ? (
              <motion.div
                className="absolute inset-0 w-full h-full"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 10, ease: 'easeOut' }}
              >
                <img
                  src={currentSlide.src}
                  alt={currentSlide.alt || currentSlide.title}
                  className="w-full h-full object-cover"
                  loading={currentIndex === 0 ? 'eager' : 'lazy'}
                />
              </motion.div>
            ) : (
              <motion.div
                className="relative w-full h-full"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 10, ease: 'easeOut' }}
              >
                <Image
                  src={currentSlide.src}
                  alt={currentSlide.alt || currentSlide.title}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                  sizes="100vw"
                />
              </motion.div>
            )}

            {/* Multi-layer Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* Premium Glassmorphic Content Overlay */}
        {showTitle && (
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-6xl mx-auto"
            >
              {/* Premium Glass Card */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/20 shadow-2xl overflow-hidden">
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3), transparent)',
                      'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3), transparent)',
                      'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3), transparent)',
                    ],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />

                <div className="relative z-10">
                  {/* Premium Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-primary-500/90 to-primary-600/90 backdrop-blur-md rounded-full text-sm font-bold text-white uppercase tracking-wider border border-white/30 shadow-lg"
                  >
                    <Circle className="w-2 h-2 fill-white animate-pulse" />
                    Trusted Professional Services
                  </motion.div>

                  {/* Title with gradient text */}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 sm:mb-4 text-white leading-tight drop-shadow-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {currentSlide.title}
                  </motion.h2>

                  {/* Subtitle */}
                  {currentSlide.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-4 font-semibold drop-shadow-lg"
                    >
                      {currentSlide.subtitle}
                    </motion.p>
                  )}

                  {/* Description */}
                  {currentSlide.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 max-w-4xl leading-relaxed drop-shadow-md"
                    >
                      {currentSlide.description}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Premium Navigation Arrows */}
        <motion.button
          onClick={goToPrevious}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 group"
          aria-label="Previous slide"
        >
          <div className="bg-white/15 hover:bg-white/25 backdrop-blur-xl text-white p-3 md:p-4 lg:p-5 rounded-full shadow-2xl border border-white/30 transition-all duration-300 group-hover:shadow-primary-500/50">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-transform group-hover:-translate-x-1" />
          </div>
        </motion.button>

        <motion.button
          onClick={goToNext}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 group"
          aria-label="Next slide"
        >
          <div className="bg-white/15 hover:bg-white/25 backdrop-blur-xl text-white p-3 md:p-4 lg:p-5 rounded-full shadow-2xl border border-white/30 transition-all duration-300 group-hover:shadow-primary-500/50">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>

        {/* Auto-play Control */}
        {autoPlay && (
          <motion.button
            onClick={toggleAutoPlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 md:top-6 right-4 md:right-6 z-30 bg-black/50 hover:bg-black/70 backdrop-blur-xl text-white p-3 rounded-full shadow-xl border border-white/20 transition-all duration-300"
            aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
          >
            {isPaused ? (
              <Play className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Pause className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </motion.button>
        )}

        {/* Premium Slide Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 md:top-6 left-4 md:left-6 z-30 bg-black/50 backdrop-blur-xl text-white px-4 py-2 rounded-full shadow-xl border border-white/20 text-sm md:text-base font-bold"
        >
          <span className="text-primary-300">{currentIndex + 1}</span>
          <span className="text-white/60 mx-2">/</span>
          <span className="text-white/80">{slides.length}</span>
        </motion.div>

        {/* Premium Indicator Dots with Thumbnails */}
        <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 max-w-full px-4 overflow-x-auto scrollbar-hide">
            {slides.map((slide, index) => (
              <motion.button
                key={slide.id}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="focus:outline-none transition-all duration-300 group relative"
                aria-label={`Go to slide ${index + 1}`}
              >
                {/* Thumbnail */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300"
                  style={{
                    borderColor: index === currentIndex ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.3)',
                    boxShadow: index === currentIndex ? '0 0 20px rgba(99, 102, 241, 0.6)' : 'none',
                  }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    index === currentIndex ? 'bg-transparent' : 'bg-black/40'
                  }`} />
                </div>

                {/* Active Indicator */}
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Progress Bar */}
      {autoPlay && !isPaused && !isHovered && !isDragging && (
        <div className="absolute bottom-0 left-0 right-0 h-1 md:h-1.5 bg-black/40 z-30 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 shadow-lg"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
            style={{
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
            }}
          />
        </div>
      )}
    </div>
  );
}

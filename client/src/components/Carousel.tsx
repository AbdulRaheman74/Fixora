'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause, Circle } from 'lucide-react';

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
    src: 'https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3RyaWNpYW58ZW58MHx8MHx8fDA%3D',
    title: 'Premium Electrician Services',
    subtitle: 'Expert Electrical Solutions',
    description: 'Professional electrical installation, repair, and maintenance services',
    alt: 'Professional electrician working',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&q=85',
    title: 'AC Installation & Repair',
    subtitle: 'Expert AC Technician Services',
    description: 'Complete AC installation, repair, and maintenance for all brands',
    alt: 'AC technician installing unit',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1920&q=85',
    title: 'Electrical Wiring Solutions',
    subtitle: 'Safe & Professional Wiring',
    description: 'Complete electrical wiring solutions with safety standards',
    alt: 'Electrical wiring work',
  },
  {
    id: 4,
    src: 'https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWMlMjB0ZWNobmljaWFufGVufDB8fDB8fHww',
    title: 'AC Maintenance & Service',
    subtitle: 'Keep Your AC Running Smoothly',
    description: 'Regular AC maintenance to keep your system efficient',
    alt: 'AC maintenance service',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=85',
    title: 'Electrical Panel Upgrades',
    subtitle: 'Modern & Safe Systems',
    description: 'Upgrade your electrical panel for better safety and capacity',
    alt: 'Electrical panel upgrade',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1920&q=85',
    title: '24/7 Emergency Service',
    subtitle: 'Available Round the Clock',
    description: 'Emergency electrical and AC repair services 24/7 in Nanded',
    alt: '24/7 emergency service',
  },
];

/**
 * Professional Carousel Component
 * 
 * Features:
 * - Fully responsive design
 * - Professional animations
 * - Transparent glassmorphic text overlays
 * - Auto-play with pause/resume
 * - Mobile swipe gestures
 * - Smooth transitions
 * - Scalable and stable architecture
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
   * Auto-play functionality with proper cleanup
   */
  useEffect(() => {
    if (!autoPlay || isPaused || isHovered) {
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
      const newProgress = (elapsed % autoPlayInterval) / autoPlayInterval;
      setProgress(newProgress);
    }, 16);

    const timeout = setTimeout(() => {
      goToNext();
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(timeout);
    };
  }, [autoPlay, autoPlayInterval, isPaused, isHovered, goToNext, currentIndex]);

  /**
   * Handle drag end for mobile swipe
   */
  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
      setProgress(0);
    },
    [goToNext, goToPrevious]
  );

  const currentSlide = slides[currentIndex];

  return (
    <div
      className={`relative w-full h-[100vh] min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] rounded-2xl overflow-hidden shadow-2xl ${className}`}
      style={{ height: className.includes('h-full') ? '100%' : undefined }}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (autoPlay) setIsPaused(false);
      }}
    >
      {/* Main Container */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? '100%' : '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? '-100%' : '100%' }}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full"
          >
            {/* Image */}
            {currentSlide.src.startsWith('http') ? (
              <motion.img
                src={currentSlide.src}
                alt={currentSlide.alt || currentSlide.title}
                className="w-full h-full object-cover"
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'easeOut' }}
              />
            ) : (
              <motion.div
                className="relative w-full h-full"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'easeOut' }}
              >
                <Image
                  src={currentSlide.src}
                  alt={currentSlide.alt || currentSlide.title}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
                />
              </motion.div>
            )}

            {/* Gradient Overlay */}
            {showTitle && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Transparent Glassmorphic Content Overlay */}
        {showTitle && (
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-5xl"
            >
              {/* Glassmorphic Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-block px-3 py-1.5 mb-4 bg-primary-600/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-white uppercase tracking-wider border border-white/30"
                >
                  Trusted Services
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 text-white leading-tight drop-shadow-lg"
                >
                  {currentSlide.title}
                </motion.h2>

                {/* Subtitle */}
                {currentSlide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-2 sm:mb-3 font-medium"
                  >
                    {currentSlide.subtitle}
                  </motion.p>
                )}

                {/* Description */}
                {currentSlide.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl leading-relaxed"
                  >
                    {currentSlide.description}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2.5 sm:p-3 md:p-4 rounded-full shadow-xl border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-3 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2.5 sm:p-3 md:p-4 rounded-full shadow-xl border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Auto-play Control */}
        {autoPlay && (
          <button
            onClick={toggleAutoPlay}
            className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 sm:p-2.5 rounded-full shadow-lg border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
          >
            {isPaused ? (
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        )}

        {/* Slide Counter */}
        <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 z-30 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-white/20 text-xs sm:text-sm font-semibold">
          {currentIndex + 1} / {slides.length}
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-2.5 md:gap-3 flex-wrap justify-center max-w-full px-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-full transition-all duration-300 group"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                className="relative h-2 sm:h-2.5 md:h-3 rounded-full overflow-hidden"
                initial={false}
                animate={{
                  width: index === currentIndex ? 40 : 8,
                  backgroundColor:
                    index === currentIndex
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.3)',
                }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.3,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }}
                whileTap={{ scale: 0.9 }}
              >
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    layoutId="activeDot"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {autoPlay && !isPaused && !isHovered && (
        <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 bg-black/30 z-30 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
}


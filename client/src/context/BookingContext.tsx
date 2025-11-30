'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Booking } from '@/types';
import apiClient from '@/lib/api/axios';

/**
 * ============================================
 * BOOKING CONTEXT - Purpose & Working
 * ============================================
 * 
 * PURPOSE:
 * - Yeh file bookings manage karti hai (create, update, delete, fetch)
 * - Sabhi components mein bookings easily access kar sakte ho
 * 
 * HOW IT WORKS:
 * 1. Page load par API se bookings fetch karta hai
 * 2. Booking create/update/delete ke liye API call karta hai
 * 3. Har component useBooking() hook se bookings access kar sakta hai
 */

interface BookingContextType {
  bookings: Booking[];
  isLoading: boolean;
  fetchBookings: () => Promise<void>; // Manual refresh ke liye
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<boolean>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<boolean>;
  deleteBooking: (id: string) => Promise<boolean>;
  getUserBookings: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * ============================================
   * FETCH ALL BOOKINGS - API Integration
   * ============================================
   * Sabhi bookings API se fetch karta hai
   * User apni bookings dekh sakta hai, Admin sabhi dekh sakta hai
   * 
   * IMPORTANT: useCallback use kiya taaki function har render par recreate na ho
   * Isse infinite loop se bach jayenge
   */
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      // STEP 1: API call karo - GET /api/bookings
      const response = await apiClient.get('/api/bookings');
      
      // STEP 2: Agar success hai, to bookings ko state mein save karo
      if (response.data.success && response.data.bookings) {
        const bookingsList: Booking[] = response.data.bookings.map((booking: any) => ({
          id: booking.id,
          userId: booking.userId,
          serviceId: booking.serviceId,
          serviceName: booking.serviceName,
          date: booking.date,
          time: booking.time,
          status: booking.status,
          address: booking.address,
          phone: booking.phone,
          notes: booking.notes || '',
          createdAt: booking.createdAt || new Date().toISOString(),
        }));
        setBookings(bookingsList);
      }
    } catch (error: any) {
      console.error('Fetch Bookings Error:', error);
      setBookings([]); // Error case mein empty array
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array - function stable rahega

  // Page load par automatically bookings fetch karo (sirf ek baar)
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /**
   * ============================================
   * CREATE BOOKING - API Integration
   * ============================================
   * Naya booking create karta hai
   */
  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      // STEP 1: API call karo - POST /api/bookings
      const response = await apiClient.post('/api/bookings', {
        serviceId: booking.serviceId,
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        address: booking.address,
        phone: booking.phone,
        notes: booking.notes || '',
      });

      // STEP 2: Agar success hai, to booking ko state mein add karo
      if (response.data.success && response.data.booking) {
        const newBooking: Booking = {
          id: response.data.booking.id,
          userId: response.data.booking.userId,
          serviceId: response.data.booking.serviceId,
          serviceName: response.data.booking.serviceName,
          date: response.data.booking.date,
          time: response.data.booking.time,
          status: response.data.booking.status,
          address: response.data.booking.address,
          phone: response.data.booking.phone,
          notes: response.data.booking.notes || '',
          createdAt: response.data.booking.createdAt,
        };
        setBookings(prev => [...prev, newBooking]);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Create Booking Error:', error);
      return false;
    }
  };

  /**
   * ============================================
   * UPDATE BOOKING - API Integration
   * ============================================
   * Booking ko update karta hai (date, time, address, etc.)
   */
  const updateBooking = async (id: string, updates: Partial<Booking>): Promise<boolean> => {
    try {
      // STEP 1: API call karo - PUT /api/bookings/[id]
      const response = await apiClient.put(`/api/bookings/${id}`, updates);

      // STEP 2: Agar success hai, to booking ko state mein update karo
      if (response.data.success && response.data.booking) {
        const updatedBooking: Booking = {
          id: response.data.booking.id,
          userId: response.data.booking.userId,
          serviceId: response.data.booking.serviceId,
          serviceName: response.data.booking.serviceName,
          date: response.data.booking.date,
          time: response.data.booking.time,
          status: response.data.booking.status,
          address: response.data.booking.address,
          phone: response.data.booking.phone,
          notes: response.data.booking.notes || '',
          createdAt: response.data.booking.createdAt,
        };
        setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Update Booking Error:', error);
      return false;
    }
  };

  /**
   * ============================================
   * DELETE BOOKING - API Integration
   * ============================================
   * Booking ko cancel/delete karta hai
   */
  const deleteBooking = async (id: string): Promise<boolean> => {
    try {
      // STEP 1: API call karo - DELETE /api/bookings/[id]
      const response = await apiClient.delete(`/api/bookings/${id}`);

      // STEP 2: Agar success hai, to booking ko state se remove karo
      if (response.data.success) {
        setBookings(prev => prev.filter(b => b.id !== id));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Delete Booking Error:', error);
      return false;
    }
  };

  /**
   * ============================================
   * GET USER BOOKINGS - Helper Function
   * ============================================
   * Kisi specific user ki bookings filter karta hai
   */
  const getUserBookings = (userId: string): Booking[] => {
    return bookings.filter(booking => booking.userId === userId);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        isLoading,
        fetchBookings,
        addBooking,
        updateBooking,
        deleteBooking,
        getUserBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}


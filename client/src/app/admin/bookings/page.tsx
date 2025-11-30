'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, MapPin, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { useBooking } from '@/context/BookingContext';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Booking } from '@/types';

/**
 * ============================================
 * ADMIN BOOKINGS PAGE - API Integration
 * ============================================
 * Admin sabhi bookings dekh sakta hai aur manage kar sakta hai
 */
export default function ManageBookingsPage() {
  const { bookings, isLoading: bookingsLoading, fetchBookings, updateBooking, deleteBooking } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * ============================================
   * BOOKINGS FETCH - Already handled by BookingContext
   * ============================================
   * IMPORTANT: Bookings automatically BookingContext se fetch ho rahi hain
   * Yahan sirf manual refresh ke liye fetchBookings available hai
   * Page load par automatic fetch nahi karte (duplicate calls avoid karne ke liye)
   */

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  /**
   * ============================================
   * UPDATE BOOKING STATUS - API Integration
   * ============================================
   * Booking status update karta hai (pending, confirmed, etc.)
   */
  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // STEP 1: BookingContext ka updateBooking function call karo (yeh internally API call karega)
      const success = await updateBooking(id, { status: newStatus });
      
      // STEP 2: Agar success hai, to success message dikhao aur bookings refresh karo
      if (success) {
        setSuccessMessage('Booking status updated successfully!');
        fetchBookings(); // Refresh bookings
        setTimeout(() => setSuccessMessage(''), 3000); // 3 seconds baad message hide karo
      } else {
        setErrorMessage('Failed to update booking status. Please try again.');
      }
    } catch (error: any) {
      console.error('Update Status Error:', error);
      setErrorMessage(error.error || 'Failed to update booking status. Please try again.');
    }
  };

  /**
   * ============================================
   * DELETE BOOKING - API Integration
   * ============================================
   * Booking ko delete karta hai
   */
  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // STEP 1: BookingContext ka deleteBooking function call karo (yeh internally API call karega)
      const success = await deleteBooking(id);
      
      // STEP 2: Agar success hai, to success message dikhao aur bookings refresh karo
      if (success) {
        setSuccessMessage('Booking deleted successfully!');
        fetchBookings(); // Refresh bookings
        setTimeout(() => setSuccessMessage(''), 3000); // 3 seconds baad message hide karo
      } else {
        setErrorMessage('Failed to delete booking. Please try again.');
      }
    } catch (error: any) {
      console.error('Delete Booking Error:', error);
      setErrorMessage(error.error || 'Failed to delete booking. Please try again.');
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <>
      <main className="pt-16 min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-2">Manage Bookings</h1>
              <p className="text-primary-100">View and manage all service bookings</p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status as keyof typeof statusCounts]})
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {/* Loading State */}
            {bookingsLoading ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading bookings...</p>
              </div>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{booking.serviceName}</h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{booking.phone}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {booking.notes}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                        Booked on {formatDateTime(booking.createdAt)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600">No bookings found</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


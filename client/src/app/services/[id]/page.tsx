'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Clock, IndianRupee, CheckCircle, Calendar, MapPin, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Service } from '@/types';
import { formatCurrency, getWhatsAppLink } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import apiClient from '@/lib/api/axios';

// IMPORTANT: Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { addBooking } = useBooking();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
    phone: '',
    notes: '',
  });

  const serviceId = Array.isArray(params.id) ? params.id[0] : params.id;

  /**
   * ============================================
   * FETCH SINGLE SERVICE - API Integration
   * ============================================
   * Page load par single service API se fetch karta hai
   */
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // STEP 1: API call karo - GET /api/services/[id]
        const response = await apiClient.get(`/api/services/${serviceId}`);
        
        // STEP 2: Agar success hai, to service data ko state mein save karo
        if (response.data.success && response.data.service) {
          const serviceData: Service = {
            id: response.data.service.id,
            title: response.data.service.title,
            description: response.data.service.description,
            category: response.data.service.category,
            price: response.data.service.price,
            duration: response.data.service.duration,
            image: response.data.service.image,
            features: response.data.service.features || [],
            rating: response.data.service.rating || 0,
            reviews: response.data.service.reviews || 0,
          };
          setService(serviceData);
        }
      } catch (error: any) {
        console.error('Fetch Service Error:', error);
        setError(error.error || 'Service not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  // Loading State
  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error State
  if (error || !service) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The service you are looking for does not exist.'}</p>
            <Button onClick={() => router.push('/services')}>Back to Services</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleBooking = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/services/' + service.id);
      return;
    }
    setIsBookingModalOpen(true);
  };

  /**
   * ============================================
   * SUBMIT BOOKING - API Integration
   * ============================================
   * Booking create karta hai API se
   */
  const submitBooking = async () => {
    if (!user || !service) return;
    
    setIsSubmittingBooking(true);
    setBookingError('');
    setBookingSuccess('');
    
    try {
      // STEP 1: BookingContext ka addBooking function call karo (yeh internally API call karega)
      const success = await addBooking({
        userId: user.id,
        serviceId: service.id,
        serviceName: service.title,
        date: bookingData.date,
        time: bookingData.time,
        status: 'pending',
        address: bookingData.address,
        phone: bookingData.phone,
        notes: bookingData.notes,
      });
      
      // STEP 2: Agar success hai, to modal band karo aur profile page pe redirect karo
      if (success) {
        setBookingSuccess('Booking created successfully!');
        setIsBookingModalOpen(false);
        // 1 second baad profile page pe redirect karo
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      } else {
        setBookingError('Failed to create booking. Please try again.');
      }
    } catch (error: any) {
      console.error('Booking Error:', error);
      setBookingError(error.error || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const whatsappMessage = `Hello! I'm interested in booking ${service.title}.`;
  const whatsappLink = getWhatsAppLink('+917448058032', whatsappMessage);

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Image */}
            <div className="relative h-96 lg:h-full rounded-xl overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  service.category === 'electrician'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {service.category === 'electrician' ? '⚡ Electrician' : '❄️ AC Service'}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-gray-600">({service.reviews} reviews)</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-6 h-6 text-primary-600" />
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" onClick={handleBooking} className="flex-1">
                    Book Now
                  </Button>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full">
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Book Service"
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); submitBooking(); }} className="space-y-4">
          {/* Success Message */}
          {bookingSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {bookingSuccess}
            </div>
          )}
          
          {/* Error Message */}
          {bookingError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {bookingError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Time
            </label>
            <select
              required
              value={bookingData.time}
              onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select time</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address
            </label>
            <textarea
              required
              value={bookingData.address}
              onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your complete address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={bookingData.phone}
              onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any special instructions..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsBookingModalOpen(false);
                setBookingError('');
                setBookingSuccess('');
              }} 
              className="flex-1"
              disabled={isSubmittingBooking}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmittingBooking}>
              {isSubmittingBooking ? 'Creating Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </>
  );
}


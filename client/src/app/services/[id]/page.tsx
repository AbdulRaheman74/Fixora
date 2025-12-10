'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Clock, IndianRupee, CheckCircle, Calendar, MapPin, Phone, ArrowLeft, Shield, Users, Award, MessageCircle } from 'lucide-react';
import Image from 'next/image';
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
        <main className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading service details...</p>
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
        <main className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The service you are looking for does not exist.'}</p>
            <Button size="lg" onClick={() => router.push('/services')}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Services
            </Button>
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
      <main className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                Home
              </button>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => router.push('/services')}
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                Services
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">{service.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section with Image */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
                src={service.image}
                alt={service.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <motion.button
              onClick={() => router.push('/services')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </motion.button>
            </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                  service.category === 'electrician'
                      ? 'bg-blue-500/90 text-white'
                      : 'bg-green-500/90 text-white'
                }`}>
                    {service.category === 'electrician' ? '⚡ Electrician Service' : '❄️ AC Service'}
                </span>
                </motion.div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {service.title}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-bold">{service.rating}</span>
                    <span className="text-white/80">({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{service.duration}</span>
                  </div>
                </div>
              </motion.div>
            </div>
                </div>
              </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                  About This Service
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">{service.description}</p>
              </motion.div>

              {/* Features Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
                  What&apos;s Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow"
                    >
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 shadow-xl text-white"
              >
                <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full mb-3">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold mb-2">100% Guaranteed</h4>
                    <p className="text-white/80 text-sm">Quality service or money back</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full mb-3">
                      <Users className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold mb-2">Expert Team</h4>
                    <p className="text-white/80 text-sm">Trained professionals</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full mb-3">
                      <Award className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold mb-2">5+ Years Experience</h4>
                    <p className="text-white/80 text-sm">Trusted by thousands</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <IndianRupee className="w-8 h-8 text-primary-600" />
                      <span className="text-5xl font-bold text-gray-900">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                    <p className="text-gray-500 text-sm">One-time service charge</p>
                </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button
                      size="lg"
                      onClick={handleBooking}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg"
                    >
                      <Calendar className="w-5 h-5" />
                    Book Now
                  </Button>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-2 hover:bg-green-50"
                      >
                        <MessageCircle className="w-5 h-5" />
                      Chat on WhatsApp
                    </Button>
                  </a>
                  </div>

                  {/* Service Info */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Duration
                      </span>
                      <span className="font-semibold text-gray-900">{service.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        Rating
                      </span>
                      <span className="font-semibold text-gray-900">
                        {service.rating} ({service.reviews} reviews)
                      </span>
                </div>
              </div>

                  {/* Trust Note */}
                  <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-900 mb-1">Secure Booking</p>
                        <p className="text-xs text-green-700">
                          Your information is safe with us. We use secure encryption.
                        </p>
                      </div>
              </div>
              </div>
            </div>
          </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Book This Service"
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); submitBooking(); }} className="space-y-5">
          {/* Success Message */}
          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {bookingSuccess}
            </motion.div>
          )}
          
          {/* Error Message */}
          {bookingError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg"
            >
              {bookingError}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Select Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Select Time
            </label>
            <select
              required
              value={bookingData.time}
              onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">Choose a time slot</option>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              Service Address
            </label>
            <textarea
              required
              value={bookingData.address}
              onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder="Enter your complete address with landmarks"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-600" />
              Contact Number
            </label>
            <input
              type="tel"
              required
              value={bookingData.phone}
              onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder="Any special instructions or requirements..."
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
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800" 
              disabled={isSubmittingBooking}
            >
              {isSubmittingBooking ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating Booking...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </>
  );
}

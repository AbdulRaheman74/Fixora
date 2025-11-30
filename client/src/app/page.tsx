'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/AuthContext';
import testimonialsData from '@/data/testimonials.json';
import { Service, Testimonial } from '@/types';
import { getWhatsAppLink } from '@/lib/utils';
import apiClient from '@/lib/api/axios';

export default function HomePage() {
  const { isLoading: authLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const testimonials = testimonialsData as Testimonial[];

  const whatsappMessage = "Hello! I'm interested in booking a service.";
  const whatsappLink = getWhatsAppLink('+917448058032', whatsappMessage);

  /**
   * ============================================
   * FETCH SERVICES - Home Page Par
   * ============================================
   * Page load par services fetch karta hai (pehle 4 services dikhane ke liye)
   */
  useEffect(() => {
    const fetchServices = async () => {
      setIsServicesLoading(true);
      
      try {
        // STEP 1: API call karo - GET /api/services
        const response = await apiClient.get('/api/services');
        
        // STEP 2: Agar success hai, to pehle 4 services lo (ya sab agar 4 se kam hain)
        if (response.data.success && response.data.services) {
          const servicesList: Service[] = response.data.services
            .slice(0, 4) // Pehle 4 services lo
            .map((service: any) => ({
              id: service.id,
              title: service.title,
              description: service.description,
              category: service.category,
              price: service.price,
              duration: service.duration,
              image: service.image,
              features: service.features || [],
              rating: service.rating || 0,
              reviews: service.reviews || 0,
            }));
          setServices(servicesList);
        }
      } catch (error: any) {
        console.error('Fetch Services Error:', error);
        // Error case mein empty array rakh dete hain (page phir bhi load hogi)
        setServices([]);
      } finally {
        setIsServicesLoading(false);
      }
    };

    fetchServices();
  }, []); // Sirf ek baar page load par fetch karo

  // Loading state - jab tak auth check complete nahi ho, loading dikhao
  if (authLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section with Carousel */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Carousel Background */}
          <div className="absolute inset-0 w-full h-full">
            <Carousel className="h-full rounded-none" showTitle={false} autoPlayInterval={5000} />
          </div>
          
          {/* Hero Content Overlay */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 border border-white/20 shadow-2xl max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg">
                Fixora
                <span className="block text-primary-200 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">
                  Smart Solutions for Your Home
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
                Professional Electrician & AC Services in Nanded. Trusted by thousands of customers. Expert technicians, quality service, and 100% satisfaction guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Link href="/services" className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 w-full sm:w-auto min-w-[200px] sm:min-w-[220px] shadow-lg flex items-center justify-center">
                    Book Service Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto min-w-[200px] sm:min-w-[220px] shadow-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-2 bg-black/30 backdrop-blur-sm"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1 h-3 bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <p className="text-xl text-gray-600">We provide the best service experience</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '⚡', title: 'Expert Technicians', desc: 'Certified and experienced professionals' },
                { icon: '🕐', title: '24/7 Availability', desc: 'Round the clock service support' },
                { icon: '✅', title: 'Quality Guaranteed', desc: '100% satisfaction or money back' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600">Professional solutions for all your needs</p>
            </motion.div>

            {/* Services Grid */}
            {isServicesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading services...</p>
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {services.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No services available at the moment.</p>
              </div>
            )}

            <div className="text-center">
              <Link href="/services">
                <Button size="lg">
                  View All Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-xl text-gray-600">Real reviews from satisfied customers</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">&quot;{testimonial.comment}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.service}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section className="py-20 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <MessageCircle className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Need Immediate Help?</h2>
              <p className="text-xl text-green-100 mb-8">
                Chat with us on WhatsApp for instant support and booking
              </p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


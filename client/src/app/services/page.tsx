'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Service } from '@/types';
import apiClient from '@/lib/api/axios';

// IMPORTANT: Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';

function ServicesContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * ============================================
   * FETCH ALL SERVICES - API Integration
   * ============================================
   * Page load par sabhi services API se fetch karta hai
   */
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // STEP 1: Category filter ke saath API call karo
        const categoryParam = selectedCategory ? `?category=${selectedCategory}` : '';
        const response = await apiClient.get(`/api/services${categoryParam}`);
        
        // STEP 2: Agar success hai, to services ko state mein save karo
        if (response.data.success && response.data.services) {
          const servicesList: Service[] = response.data.services.map((service: any) => ({
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
        setError('Failed to load services. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory]); // Category change par automatically fetch hoga

  const categories = [
    { id: null, label: 'All Services', icon: '🔧' },
    { id: 'electrician', label: 'Electrician', icon: '⚡' },
    { id: 'ac', label: 'AC Services', icon: '❄️' },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-xl text-primary-100">
                Professional electrician and AC services in Nanded
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map(cat => (
                <motion.button
                  key={cat.id || 'all'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading services...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Services Grid */}
            {!isLoading && !error && services.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && services.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-xl text-gray-600">No services found in this category.</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    }>
      <ServicesContent />
    </Suspense>
  );
}


'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, Wind, Grid } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Service } from '@/types';
import apiClient from '@/lib/api/axios';

/**
 * ============================================
 * SERVICES PAGE - Professional Official Design
 * ============================================
 * 
 * PURPOSE:
 * - Sabhi services ko professional aur official format mein dikhata hai
 * - Category filter ke saath services organize karta hai
 * - Clean, professional, aur business-like UI
 */

// IMPORTANT: Force dynamic rendering
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

  /**
   * Categories array - Professional filter options
   */
  const categories = [
    { id: null, label: 'All Services', icon: Grid, count: services.length },
    { 
      id: 'electrician', 
      label: 'Electrician Services', 
      icon: Zap, 
      count: services.filter(s => s.category === 'electrician').length 
    },
    { 
      id: 'ac', 
      label: 'AC Services', 
      icon: Wind, 
      count: services.filter(s => s.category === 'ac').length 
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-white">
        {/* Professional Header Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Page Title */}
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  Our Services
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
              </div>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mt-6 leading-relaxed">
                Professional solutions for all your home service needs. Expert technicians, quality service, and guaranteed satisfaction.
              </p>

              {/* Services Count */}
              <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Settings className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{services.length}</div>
                    <div className="text-sm text-gray-600">Services Available</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Professional Category Filter */}
        <section className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Filter Label */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Grid className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-base font-semibold text-gray-900">Filter by Category</span>
              </div>

              {/* Category Tabs - Professional Design */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  
                  return (
                    <motion.button
                      key={cat.id || 'all'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      <span>{cat.label}</span>
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {cat.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-20">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-primary-600"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading services...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="max-w-md mx-auto text-center py-12 px-6 bg-white rounded-lg shadow-md border border-red-100">
                <p className="text-lg font-semibold text-gray-900 mb-2">Error Loading Services</p>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Services Grid */}
            {!isLoading && !error && services.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="wait">
                  {services.map((service, index) => (
                    <ServiceCard key={service.id} service={service} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && !error && services.length === 0 && (
              <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-600 mb-6">
                  No services available in this category. Please try a different filter.
                </p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Show All Services
                </button>
              </div>
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
        <main className="pt-16 min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    }>
      <ServicesContent />
    </Suspense>
  );
}

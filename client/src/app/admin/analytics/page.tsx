'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import ChartCard from '@/components/ChartCard';
import { useBooking } from '@/context/BookingContext';
import apiClient from '@/lib/api/axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

/**
 * ============================================
 * ADMIN ANALYTICS PAGE - API Integration
 * ============================================
 * Real analytics data API se fetch karta hai
 */

// IMPORTANT: Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  const { bookings } = useBooking();
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; revenue: number; bookings?: number }[]>([]);
  const [servicePopularity, setServicePopularity] = useState<{ name: string; bookings: number; revenue: number }[]>([]);
  const [services, setServices] = useState<{ id: string; category: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * ============================================
   * FETCH ANALYTICS DATA - API Integration
   * ============================================
   * Analytics data API se fetch karta hai
   */
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // STEP 1: Analytics API call karo
        const analyticsResponse = await apiClient.get('/api/admin/analytics');
        
        // STEP 2: Services fetch karo (category ke liye)
        const servicesResponse = await apiClient.get('/api/services');
        
        // STEP 3: Analytics data ko state mein save karo
        if (analyticsResponse.data.success && analyticsResponse.data.analytics) {
          const analytics = analyticsResponse.data.analytics;
          
          // Monthly revenue format karo
          const revenueData = analytics.monthlyRevenue || [];
          setMonthlyRevenue(revenueData.map((item: any) => ({
            month: item.month,
            revenue: item.revenue || 0,
          })));

          // Service popularity format karo
          const popularityData = analytics.servicePopularity || [];
          setServicePopularity(popularityData.map((item: any) => ({
            name: item.service || 'Unknown',
            bookings: item.bookings || 0,
            revenue: 0, // Revenue calculation abhi nahi hai API mein
          })));
        }

        // STEP 4: Services data save karo (category distribution ke liye)
        if (servicesResponse.data.success && servicesResponse.data.services) {
          const servicesList = servicesResponse.data.services.map((service: any) => ({
            id: service.id,
            category: service.category || 'unknown',
          }));
          setServices(servicesList);
        }
      } catch (error: any) {
        console.error('Fetch Analytics Error:', error);
        // Error case mein empty arrays
        setMonthlyRevenue([]);
        setServicePopularity([]);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []); // Sirf ek baar page load par fetch karo

  // Service popularity - Agar API se data nahi aaya, to bookings se calculate karo
  const calculatedServicePopularity = servicePopularity.length > 0 
    ? servicePopularity 
    : (() => {
        const popularityMap: { [key: string]: { name: string; bookings: number } } = {};
        bookings.forEach(booking => {
          if (!popularityMap[booking.serviceId]) {
            popularityMap[booking.serviceId] = {
              name: booking.serviceName,
              bookings: 0,
            };
          }
          popularityMap[booking.serviceId].bookings += 1;
        });
        return Object.values(popularityMap).map(item => ({
          name: item.name,
          bookings: item.bookings,
          revenue: 0,
        })).sort((a, b) => b.bookings - a.bookings);
      })();

  // Monthly revenue - Agar API se data nahi aaya, to empty array
  const displayMonthlyRevenue = monthlyRevenue.length > 0 
    ? monthlyRevenue 
    : [
        { month: 'Jan', revenue: 0 },
        { month: 'Feb', revenue: 0 },
        { month: 'Mar', revenue: 0 },
        { month: 'Apr', revenue: 0 },
        { month: 'May', revenue: 0 },
        { month: 'Jun', revenue: 0 },
      ];

  // Status distribution
  const statusDistribution = [
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  // Category distribution - Services data se calculate karo
  const categoryData = [
    {
      name: 'Electrician',
      bookings: bookings.filter(b => {
        const service = services.find(s => s.id === b.serviceId);
        return service?.category === 'electrician';
      }).length,
    },
    {
      name: 'AC Services',
      bookings: bookings.filter(b => {
        const service = services.find(s => s.id === b.serviceId);
        return service?.category === 'ac';
      }).length,
    },
  ];

  // Revenue by service - Calculated from service popularity
  const revenueByService = calculatedServicePopularity.slice(0, 5).map(service => ({
    name: service.name.length > 15 ? service.name.substring(0, 15) + '...' : service.name,
    revenue: service.revenue || 0,
  }));

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
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-primary-100">Comprehensive insights and statistics</p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading analytics data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue */}
            <ChartCard title="Monthly Revenue">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={displayMonthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Revenue (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Service Popularity */}
            <ChartCard title="Top Services by Bookings">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calculatedServicePopularity.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Status Distribution */}
            <ChartCard title="Booking Status Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution.filter(s => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Category Distribution */}
            <ChartCard title="Bookings by Category">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Revenue by Service */}
            <ChartCard title="Top Services by Revenue">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByService}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Service Popularity Table */}
            <ChartCard title="Service Performance">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Service</th>
                      <th className="text-right py-2 px-2">Bookings</th>
                      <th className="text-right py-2 px-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculatedServicePopularity.slice(0, 5).map((service, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-2">{service.name}</td>
                        <td className="text-right py-2 px-2">{service.bookings}</td>
                        <td className="text-right py-2 px-2">₹{service.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}


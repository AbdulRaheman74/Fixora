'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import ChartCard from '@/components/ChartCard';
import { useBooking } from '@/context/BookingContext';
import servicesData from '@/data/services.json';
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

export default function AnalyticsPage() {
  const { bookings } = useBooking();

  // Monthly revenue data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, bookings: 25 },
    { month: 'Feb', revenue: 52000, bookings: 30 },
    { month: 'Mar', revenue: 48000, bookings: 28 },
    { month: 'Apr', revenue: 61000, bookings: 35 },
    { month: 'May', revenue: 55000, bookings: 32 },
    { month: 'Jun', revenue: 67000, bookings: 38 },
  ];

  // Service popularity
  const servicePopularity = servicesData.map(service => ({
    name: service.title,
    bookings: bookings.filter(b => b.serviceId === service.id).length,
    revenue: bookings
      .filter(b => b.serviceId === service.id && (b.status === 'completed' || b.status === 'confirmed'))
      .reduce((sum) => sum + service.price, 0),
  })).sort((a, b) => b.bookings - a.bookings);

  // Status distribution
  const statusDistribution = [
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  // Category distribution
  const categoryData = [
    {
      name: 'Electrician',
      bookings: bookings.filter(b => {
        const service = servicesData.find(s => s.id === b.serviceId);
        return service?.category === 'electrician';
      }).length,
    },
    {
      name: 'AC Services',
      bookings: bookings.filter(b => {
        const service = servicesData.find(s => s.id === b.serviceId);
        return service?.category === 'ac';
      }).length,
    },
  ];

  // Revenue by service
  const revenueByService = servicesData.map(service => ({
    name: service.title.length > 15 ? service.title.substring(0, 15) + '...' : service.title,
    revenue: bookings
      .filter(b => b.serviceId === service.id && (b.status === 'completed' || b.status === 'confirmed'))
      .reduce((sum) => sum + service.price, 0),
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue & Bookings */}
            <ChartCard title="Monthly Revenue & Bookings">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Revenue (₹)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Service Popularity */}
            <ChartCard title="Top Services by Bookings">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicePopularity.slice(0, 5)}>
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
                    {servicePopularity.slice(0, 5).map((service, index) => (
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
        </div>
      </main>
      <Footer />
    </>
  );
}


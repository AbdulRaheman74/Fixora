'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Wrench, Users, Calendar, TrendingUp, 
  DollarSign, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';
import ChartCard from '@/components/ChartCard';
import Footer from '@/components/Footer';
import RevenueChart from '@/components/charts/RevenueChart';
import ServicePopularityChart from '@/components/charts/ServicePopularityChart';
import { useBooking } from '@/context/BookingContext';
import servicesData from '@/data/services.json';
import usersData from '@/data/users.json';

export default function AdminDashboard() {
  const { bookings } = useBooking();

  // Calculate statistics
  const stats = {
    totalServices: servicesData.length,
    totalUsers: usersData.filter(u => u.role === 'user').length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    totalRevenue: bookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, booking) => {
        const service = servicesData.find(s => s.id === booking.serviceId);
        return sum + (service?.price || 0);
      }, 0),
  };

  // Monthly revenue data (sample)
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  // Service popularity data
  const servicePopularity = servicesData.slice(0, 5).map(service => ({
    service: service.title,
    bookings: bookings.filter(b => b.serviceId === service.id).length,
  }));

  const statCards = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: Wrench,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/services',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/users',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/bookings',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const bookingStats = [
    {
      title: 'Pending',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Confirmed',
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

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
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-primary-100">Manage your service booking platform</p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const CardContent = (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </motion.div>
              );

              return stat.href ? (
                <Link key={index} href={stat.href}>
                  {CardContent}
                </Link>
              ) : (
                CardContent
              );
            })}
          </div>

          {/* Booking Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {bookingStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Monthly Revenue">
              <RevenueChart data={monthlyRevenue} />
            </ChartCard>

            <ChartCard title="Service Popularity">
              <ServicePopularityChart data={servicePopularity} />
            </ChartCard>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


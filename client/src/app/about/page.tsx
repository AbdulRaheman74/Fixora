'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const stats = [
    { icon: Users, value: '5000+', label: 'Happy Customers' },
    { icon: Award, value: '10+', label: 'Years Experience' },
    { icon: CheckCircle, value: '10000+', label: 'Services Completed' },
    { icon: Clock, value: '24/7', label: 'Support Available' },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We never compromise on quality. Every service is delivered with the highest standards.',
      icon: '⭐',
    },
    {
      title: 'Customer Satisfaction',
      description: 'Your satisfaction is our priority. We go the extra mile to ensure you\'re happy.',
      icon: '😊',
    },
    {
      title: 'Expert Team',
      description: 'Our technicians are certified, experienced, and continuously trained.',
      icon: '👨‍🔧',
    },
    {
      title: 'Affordable Pricing',
      description: 'Transparent pricing with no hidden charges. Quality service at fair prices.',
      icon: '💰',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-6">About ServicePro</h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Your trusted partner for professional electrician and AC services in Nanded
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  ServicePro was founded with a simple mission: to provide reliable, professional, and affordable
                  electrician and AC services to the residents of Nanded. What started as a small local business
                  has grown into one of the most trusted service providers in the region.
                </p>
                <p className="mb-4">
                  Over the years, we&apos;ve built a team of certified technicians who are not just skilled professionals
                  but also committed to delivering exceptional customer service. We understand that electrical and
                  AC issues can be stressful, and we&apos;re here to make the process as smooth and hassle-free as possible.
                </p>
                <p>
                  Our commitment to quality, transparency, and customer satisfaction has earned us the trust of
                  thousands of customers. We&apos;re proud to be your go-to service provider for all your home service needs.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">What drives us every day</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


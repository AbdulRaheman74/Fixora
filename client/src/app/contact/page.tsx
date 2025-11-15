'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { getWhatsAppLink } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const whatsappMessage = `Hello! I need help with: ${formData.message || 'General inquiry'}`;
  const whatsappLink = getWhatsAppLink('+919876543210', whatsappMessage);

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
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-primary-100">
                Get in touch with us. We&apos;re here to help!
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <Phone className="w-8 h-8 text-primary-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
                    <a href="tel:+919876543210" className="text-gray-600 hover:text-primary-600">
                      +91 98765 43210
                    </a>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <Mail className="w-8 h-8 text-primary-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                    <a href="mailto:info@servicepro.com" className="text-gray-600 hover:text-primary-600">
                      info@servicepro.com
                    </a>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <MapPin className="w-8 h-8 text-primary-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-600">
                      Nanded, Maharashtra, India
                    </p>
                  </div>

                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-green-500 text-white p-6 rounded-xl shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-8 h-8 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                      <p>Chat with us instantly</p>
                    </motion.div>
                  </a>
                </motion.div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-md"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
                    >
                      Thank you! Your message has been sent successfully.
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your message..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        size="lg"
                        className="flex-1"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button type="button" variant="outline" size="lg" className="w-full">
                          <MessageCircle className="w-5 h-5 mr-2" />
                          WhatsApp
                        </Button>
                      </a>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


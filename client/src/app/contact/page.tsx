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
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * ============================================
   * HANDLE FORM SUBMIT - Contact Form Submit Handler
   * ============================================
   * 
   * PURPOSE:
   * - Jab user form submit kare, yeh function API ko call karta hai
   * - API message ko database mein save karega aur admin ko email bhejega
   * 
   * HOW IT WORKS:
   * 1. Form submit event ko prevent karo (page reload nahi hoga)
   * 2. Loading state true karo (button disabled ho jayega)
   * 3. API endpoint ko POST request bhejo (/api/contact)
   * 4. Response check karo - success ya error
   * 5. Success ho to success message dikhao aur form clear karo
   * 6. Error ho to error message dikhao
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Page reload nahi hoga
    
    console.log('📝 Form submit started...', formData); // Debug log
    
    // Loading state start karo (button disabled ho jayega)
    setIsSubmitting(true);
    setErrorMessage(''); // Pehle se koi error hai to clear karo
    
    try {
      // STEP 1: Validation check (extra safety)
      if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        setErrorMessage('Please fill all fields');
        setIsSubmitting(false);
        return;
      }

      console.log('📤 Sending request to /api/contact...', formData); // Debug log
      
      // STEP 2: API endpoint ko POST request bhejo
      // fetch() function browser ka built-in function hai API calls ke liye
      const response = await fetch('/api/contact', {
        method: 'POST', // POST request bhej rahe hain
        headers: {
          'Content-Type': 'application/json', // JSON data bhej rahe hain
        },
        body: JSON.stringify(formData), // Form data ko JSON format mein convert karke bhejo
      });

      console.log('📥 Response received:', response.status, response.statusText); // Debug log

      // STEP 3: Response ko JSON format mein convert karo
      const data = await response.json();
      console.log('📦 Response data:', data); // Debug log

      // STEP 4: Check karo response success hai ya error
      if (data.success) {
        // Success case - Message successfully submit ho gaya
        console.log('✅ Message sent successfully!'); // Debug log
        setIsSubmitted(true); // Success message dikhane ke liye
        setFormData({ name: '', email: '', phone: '', message: '' }); // Form clear karo
        
        // 5 seconds baad success message hide ho jayega
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        // Error case - API se error aaya hai
        console.error('❌ API Error:', data.error); // Debug log
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error: any) {
      // Network error ya koi aur error (try-catch se catch hoga)
      console.error('❌ Contact form error:', error); // Debug log
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      // Loading state end karo (button enabled ho jayega)
      // finally block hamesha run hoga, success ya error dono case mein
      console.log('🏁 Form submit finished'); // Debug log
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hello! I need help with: ${formData.message || 'General inquiry'}`;
  const whatsappLink = getWhatsAppLink('+917448058032', whatsappMessage);

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
                    <a href="tel:+917448058032" className="text-gray-600 hover:text-primary-600">
                      +91 7448058032
                    </a>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <Mail className="w-8 h-8 text-primary-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                    <a href="mailto:abraheman.744@gmail.com" className="text-gray-600 hover:text-primary-600">
                    abraheman.744@gmail.com
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

                  {/* Success Message - Jab message successfully submit ho jaye */}
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
                    >
                      ✅ Thank you! Your message has been sent successfully. We will contact you soon.
                    </motion.div>
                  )}

                  {/* Error Message - Agar koi error aaye */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                    >
                      ❌ {errorMessage}
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
                      {/* Submit Button - Form submit karne ke liye */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
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


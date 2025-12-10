'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Clock, IndianRupee, ArrowRight, CheckCircle } from 'lucide-react';
import { Service } from '@/types';
import { formatCurrency } from '@/lib/utils';

/**
 * ============================================
 * SERVICE CARD COMPONENT - Professional Official Design
 * ============================================
 * 
 * PURPOSE:
 * - Ek service ko professional card format mein dikhata hai
 * - Clean, official, aur business-like design
 * - Click karne par service details page pe jata hai
 */

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
      }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300"
      onClick={() => router.push(`/services/${service.id}`)}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-md text-xs font-bold ${
            service.category === 'electrician'
              ? 'bg-blue-600 text-white'
              : 'bg-green-600 text-white'
          }`}>
            {service.category === 'electrician' ? '⚡ Electrician' : '❄️ AC Service'}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-900">{service.rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Features List - First 2 features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-4 space-y-2">
            {service.features.slice(0, 2).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Price and Duration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-1">
            <IndianRupee className="w-5 h-5 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(service.price)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{service.duration}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(service.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-300 text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({service.reviews})
            </span>
          </div>

          {/* View Button */}
          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-1 text-primary-600 font-semibold text-sm"
          >
            <span>View</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

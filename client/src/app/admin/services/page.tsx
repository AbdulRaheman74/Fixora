'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Service } from '@/types';
import { formatCurrency } from '@/lib/utils';
import apiClient from '@/lib/api/axios';

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // For initial page load
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electrician' as 'electrician' | 'ac',
    price: '',
    duration: '',
    image: '',
    features: '',
    rating: '4.5',
    reviews: '0',
  });

  /**
   * ============================================
   * FETCH ALL SERVICES - Page Load Par
   * ============================================
   * Yeh function page load par sabhi services fetch karta hai
   * Refresh ke baad bhi services automatically load ho jayengi
   */
  const fetchServices = async () => {
    setIsFetching(true);
    setError('');
    
    try {
      // STEP 1: API call karo - GET /api/services
      const response = await apiClient.get('/api/services');
      
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
      setError('Failed to load services. Please refresh the page.');
    } finally {
      setIsFetching(false);
    }
  };

  // Page load par automatically services fetch karo
  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      category: 'electrician',
      price: '',
      duration: '',
      image: '',
      features: '',
      rating: '4.5',
      reviews: '0',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration,
      image: service.image,
      features: service.features.join(', '),
      rating: service.rating.toString(),
      reviews: service.reviews.toString(),
    });
    setIsModalOpen(true);
  };

  /**
   * ============================================
   * DELETE SERVICE - API Integration
   * ============================================
   * Yeh function service delete karne ke liye API call karta hai
   */
  const handleDelete = async (id: string) => {
    // Confirmation dialog
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // STEP 1: API call karo - DELETE /api/services/[id]
      const response = await apiClient.delete(`/api/services/${id}`);
      
      // STEP 2: Agar success hai, to service ko list se remove karo
      if (response.data.success) {
        setServices(services.filter(s => s.id !== id));
        setSuccess('Service deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error: any) {
      console.error('Delete Service Error:', error);
      setError(error.error || error.message || 'Failed to delete service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ============================================
   * CREATE SERVICE - API Integration
   * ============================================
   * Yeh function service create karne ke liye API call karta hai
   * Simple aur beginner-friendly implementation
   */
  /**
   * ============================================
   * CREATE/UPDATE SERVICE - API Integration
   * ============================================
   * Yeh function service create/update karne ke liye API call karta hai
   * Simple aur beginner-friendly implementation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Loading start karo
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // STEP 1: Features ko array mein convert karo (comma se separated string se)
      const featuresArray = formData.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0); // Empty features remove karo

      // STEP 2: Check karo edit mode hai ya create mode
      if (editingService) {
        // EDIT MODE: PUT API call karo
        const response = await apiClient.put(`/api/services/${editingService.id}`, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          price: Number(formData.price),
          duration: formData.duration.trim(),
          image: formData.image.trim(),
          features: featuresArray,
        });

        // STEP 3: Agar success hai, to service ko update karo
        if (response.data.success && response.data.service) {
          const updatedService: Service = {
            id: response.data.service.id,
            title: response.data.service.title,
            description: response.data.service.description,
            category: response.data.service.category,
            price: response.data.service.price,
            duration: response.data.service.duration,
            image: response.data.service.image,
            features: response.data.service.features,
            rating: response.data.service.rating || 0,
            reviews: response.data.service.reviews || 0,
          };

          // Services list mein service ko update karo
          setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
          setSuccess('Service updated successfully!');
          setIsModalOpen(false);
          setTimeout(() => setSuccess(''), 3000);
        }
      } else {
        // CREATE MODE: POST API call karo
        const response = await apiClient.post('/api/services', {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          price: Number(formData.price),
          duration: formData.duration.trim(),
          image: formData.image.trim(),
          features: featuresArray,
        });

        // STEP 4: Agar success hai, to response se service data lo
        if (response.data.success && response.data.service) {
          const newService: Service = {
            id: response.data.service.id,
            title: response.data.service.title,
            description: response.data.service.description,
            category: response.data.service.category,
            price: response.data.service.price,
            duration: response.data.service.duration,
            image: response.data.service.image,
            features: response.data.service.features,
            rating: response.data.service.rating || 0,
            reviews: response.data.service.reviews || 0,
          };

          // STEP 5: Services list mein naya service add karo
          setServices([...services, newService]);
          setSuccess('Service created successfully!');

          // STEP 6: Form reset karo
          setFormData({
            title: '',
            description: '',
            category: 'electrician',
            price: '',
            duration: '',
            image: '',
            features: '',
            rating: '4.5',
            reviews: '0',
          });

          // STEP 7: Modal close karo
          setIsModalOpen(false);
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    } catch (error: any) {
      // STEP 8: Agar error aaye, to error message dikhao
      console.error(editingService ? 'Update Service Error:' : 'Create Service Error:', error);
      setError(error.error || error.message || `Failed to ${editingService ? 'update' : 'create'} service. Please try again.`);
    } finally {
      // STEP 9: Loading complete
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="pt-16 min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2">Manage Services</h1>
                <p className="text-primary-100">Add, edit, or delete services</p>
              </div>
              <Button onClick={handleAdd} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Service
              </Button>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
            >
              {success}
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Loading State */}
          {isFetching && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          )}

          {/* Services Grid */}
          {!isFetching && filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No services found.</p>
              <Button onClick={handleAdd} className="mt-4">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Service
              </Button>
            </div>
          )}

          {!isFetching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      service.category === 'electrician'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {service.category}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'electrician' | 'ac' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="electrician">Electrician</option>
                <option value="ac">AC Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 2-3 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated) *</label>
            <input
              type="text"
              required
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reviews</label>
              <input
                type="number"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Error message in modal */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setError('');
                setSuccess('');
              }} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading 
                ? (editingService ? 'Updating...' : 'Creating...') 
                : (editingService ? 'Update' : 'Add')} Service
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </>
  );
}


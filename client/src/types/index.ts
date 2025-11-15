// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'electrician' | 'ac';
  price: number;
  duration: string;
  image: string;
  features: string[];
  rating: number;
  reviews: number;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  address: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string;
  image?: string;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Analytics Types
export interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  monthlyRevenue: { month: string; revenue: number }[];
  servicePopularity: { service: string; bookings: number }[];
}


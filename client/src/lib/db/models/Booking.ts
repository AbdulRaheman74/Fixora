import mongoose from 'mongoose';

/**
 * Booking Model
 * Yeh file Booking ka database structure define karti hai
 * Matlab: Booking table mein kya kya fields honge
 */

// Booking Schema Define Karo (Table ka structure)
const BookingSchema = new mongoose.Schema(
  {
    // Kis user ne booking ki (User table se link)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // User model se link
      required: true,
    },

    // Kaunsi service book hui (Service table se link)
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service', // Service model se link
      required: true,
    },

    // Service ka naam (backup ke liye)
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    // Booking ki date (example: "2024-12-25")
    date: {
      type: String,
      required: true,
      trim: true,
    },

    // Booking ka time (example: "10:00 AM")
    time: {
      type: String,
      required: true,
      trim: true,
    },

    // Booking ki status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending', // Default status 'pending' hai
    },

    // Service karne ka address
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // Contact phone number
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Additional notes (optional)
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    // Automatically createdAt aur updatedAt fields add ho jayengi
    timestamps: true,
  }
);

// Model Banayo aur Export Karo
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

export default Booking;

import mongoose from 'mongoose';

/**
 * Service Model
 * Yeh file Service ka database structure define karti hai
 * Matlab: Service table mein kya kya fields honge
 */

// Service Schema Define Karo (Table ka structure)
const ServiceSchema = new mongoose.Schema(
  {
    // Service ka naam (example: "AC Installation")
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Service ka description (details)
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Service ka category (electrician ya AC)
    category: {
      type: String,
      required: true,
      enum: ['electrician', 'ac'], // Sirf yeh 2 categories allowed
    },

    // Service ki price (rupees mein)
    price: {
      type: Number,
      required: true,
      min: 0, // Price negative nahi ho sakti
    },

    // Service ki duration (example: "2-3 hours")
    duration: {
      type: String,
      required: true,
      trim: true,
    },

    // Service ki image URL
    image: {
      type: String,
      required: true,
      trim: true,
    },

    // Service ki features (array of strings)
    features: {
      type: [String], // Array of strings
      default: [], // Default empty array
    },

    // Service ki rating (0 se 5 tak)
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Kitne reviews aaye hain
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    // Automatically createdAt aur updatedAt fields add ho jayengi
    timestamps: true,
  }
);

// Model Banayo aur Export Karo
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

export default Service;

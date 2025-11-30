import mongoose from 'mongoose';

/**
 * User Model
 * Yeh file User ka database structure define karti hai
 * Matlab: User ki table mein kya kya fields honge
 */

// User Schema Define Karo (Table ka structure)
const UserSchema = new mongoose.Schema(
  {
    // User ka naam
    name: {
      type: String,
      required: true, // Zaroori field hai
      trim: true, // Spaces hatane ke liye
    },

    // User ka email
    email: {
      type: String,
      required: true, // Zaroori field hai
      unique: true, // Har user ka email alag hona chahiye
      lowercase: true, // Chhote letters mein convert
      trim: true, // Spaces hatane ke liye
    },

    // User ka phone number
    phone: {
      type: String,
      required: true, // Zaroori field hai
      trim: true,
    },

    // User ka password (hamesha hash karke store hoga)
    password: {
      type: String,
      required: true, // Zaroori field hai
      select: false, // Password response mein nahi jayega (security)
    },

    // User ka role (user ya admin)
    role: {
      type: String,
      enum: ['user', 'admin'], // Sirf yeh 2 values allowed hain
      default: 'user', // Default role 'user' hai
    },
  },
  {
    // Automatically createdAt aur updatedAt fields add ho jayengi
    timestamps: true,
  }
);

// Model Banayo aur Export Karo
// Agar model already exist karta hai to wahi use karo, warna naya banao
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

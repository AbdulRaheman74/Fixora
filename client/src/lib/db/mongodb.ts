import mongoose from 'mongoose';

/**
 * MongoDB Database Connection
 * Yeh file database se connect karne ke liye hai
 */

// Environment variable se MongoDB URL lo
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fixora';

// Check karo URL mili ya nahi
if (!MONGODB_URI) {
  throw new Error('❌ MongoDB URL nahi mili. .env.local file mein MONGODB_URI add karo.');
}

// Connection status track karne ke liye
let isConnected = false;

/**
 * Database Connect Function
 * Yeh function database se connect karta hai
 */
async function connectDB() {
  // Agar already connected hai, to dobara connect mat karo
  if (isConnected) {
    console.log('✅ Database already connected');
    return;
  }

  try {
    // Database se connect karo
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    // Agar error aaye to dikhao
    console.error('❌ Database Connection Error:', error);
    isConnected = false;
    throw error;
  }
}

// Export karo taaki dusre files mein use kar sako
export { connectDB };
export default connectDB;

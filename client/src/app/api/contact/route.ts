import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Contact from '@/lib/db/models/Contact';
import { sendContactFormEmail } from '@/lib/email/email';

/**
 * ============================================
 * CONTACT FORM API - Purpose & Working
 * ============================================
 * 
 * PURPOSE:
 * - Contact form ke messages ko handle karne ke liye
 * - User ka message database mein save hota hai
 * - Admin ko email notification jata hai
 * 
 * ENDPOINT:
 * POST /api/contact
 * 
 * HOW IT WORKS:
 * 1. Frontend se form data aata hai (name, email, phone, message)
 * 2. Data validation check hota hai (sab fields zaroori hain)
 * 3. Database mein message save hota hai
 * 4. Admin ko email notification jata hai (background mein)
 * 5. Success response frontend ko jata hai
 */

// IMPORTANT: Yeh route dynamic hai (build time par pre-render nahi hoga)
export const dynamic = 'force-dynamic';

/**
 * GET /api/contact - Test endpoint (optional)
 * API route kaam kar raha hai ya nahi test karne ke liye
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: true,
      message: 'Contact API is working!',
      endpoint: 'POST /api/contact',
    },
    { status: 200 }
  );
}

/**
 * POST /api/contact - Contact Form Submit
 * User contact form submit karta hai, message save hota hai aur admin ko email jata hai
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📬 Contact API called - POST /api/contact'); // Debug log
    
    // STEP 1: Request se data lo (frontend se aaya hua form data)
    const body = await request.json();
    console.log('📥 Received data:', body); // Debug log
    
    const { name, email, phone, message } = body;

    // STEP 2: Validation - sab fields zaroori hain
    // Agar koi field missing hai to error return karo
    if (!name || !email || !phone || !message) {
      console.log('❌ Validation failed - missing fields'); // Debug log
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required (name, email, phone, message)',
        },
        { status: 400 } // 400 = Bad Request (client ne galat data bheja)
      );
    }

    console.log('✅ Validation passed'); // Debug log

    // STEP 3: Database se connect karo
    console.log('🔌 Connecting to database...'); // Debug log
    try {
      await connectDB();
      console.log('✅ Database connected for contact form');
    } catch (dbError: any) {
      console.error('❌ Database connection error:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed. Please try again later.',
        },
        { status: 500 }
      );
    }

    // STEP 4: Contact message ko database mein save karo
    // Contact.create() automatically database mein save kar dega
    const contact = await Contact.create({
      name: name.trim(), // Spaces hatane ke liye trim()
      email: email.trim().toLowerCase(), // Email ko lowercase mein convert karo
      phone: phone.trim(), // Phone number mein se spaces hatao
      message: message.trim(), // Message mein se extra spaces hatao
      isRead: false, // Abhi message read nahi hua hai (default false)
    });

    console.log('✅ Contact message saved to database:', contact._id);

    // STEP 5: Admin ko email send karo (background mein, non-blocking)
    // Email fail ho to bhi message save ho jayega (kyunki await nahi kiya)
    // Agar await karein to email fail hone par form bhi fail ho jayega
    sendContactFormEmail({
      userName: name,
      userEmail: email,
      userPhone: phone,
      message: message,
    })
      .then((result) => {
        if (result.success) {
          console.log('✅ Contact email sent to admin successfully');
        } else {
          console.error('❌ Contact email failed:', result.error);
        }
      })
      .catch((error) => {
        // Email error ko log karo, but form submit ko fail mat karo
        console.error('❌ Email sending error (non-blocking):', error);
      });

    // STEP 6: Success response bhejo frontend ko
    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! We will contact you soon.',
        contactId: contact._id.toString(), // Optional: contact ID (debugging ke liye)
      },
      { status: 201 } // 201 = Created (successfully created resource)
    );
  } catch (error: any) {
    // STEP 7: Agar koi error aaye to handle karo
    console.error('❌ Contact form API error:', error);

    // Error ka type check karo
    // Agar duplicate email error hai to special message do
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'This email has already been used. Please use a different email.',
        },
        { status: 400 }
      );
    }

    // General error message
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send message. Please try again.',
      },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}


import nodemailer from 'nodemailer';

/**
 * ============================================
 * EMAIL UTILITY - Purpose & Working
 * ============================================
 * 
 * PURPOSE:
 * - Booking confirmations, status updates, etc. ke liye emails send karta hai
 * 
 * HOW IT WORKS:
 * 1. Email transporter setup karta hai (Gmail, SMTP, etc.)
 * 2. Email template banata hai
 * 3. Email send karta hai
 */

// Email transporter setup (Gmail ke liye)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ya koi bhi SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Aapka Gmail email
    pass: process.env.EMAIL_PASSWORD, // Gmail app password
  },
});

/**
 * ============================================
 * SEND BOOKING CONFIRMATION EMAIL
 * ============================================
 * User ko booking confirmation email send karta hai
 */
export async function sendBookingConfirmationEmail({
  userEmail,
  userName,
  serviceName,
  date,
  time,
  address,
  bookingId,
}: {
  userEmail: string;
  userName: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  bookingId: string;
}) {
  try {
    // STEP 1: Email content banayein
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: userEmail, // Receiver email
      subject: `Booking Confirmed: ${serviceName} - Fixora`, // Email subject
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 15px 0; padding: 10px; border-left: 4px solid #667eea; background: #f0f0f0; }
            .label { font-weight: bold; color: #667eea; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
              <p>Your service booking has been successfully confirmed</p>
            </div>
            
            <div class="content">
              <p>Hello <strong>${userName}</strong>,</p>
              
              <p>Thank you for choosing Fixora! Your booking has been confirmed. We'll be there to serve you.</p>
              
              <div class="booking-details">
                <h2>Booking Details</h2>
                
                <div class="detail-row">
                  <span class="label">Service:</span> ${serviceName}
                </div>
                
                <div class="detail-row">
                  <span class="label">Date:</span> ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                
                <div class="detail-row">
                  <span class="label">Time:</span> ${time}
                </div>
                
                <div class="detail-row">
                  <span class="label">Address:</span> ${address}
                </div>
                
                <div class="detail-row">
                  <span class="label">Booking ID:</span> ${bookingId}
                </div>
              </div>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Our technician will arrive at the scheduled time</li>
                <li>You'll receive a reminder 1 hour before the appointment</li>
                <li>If you need to reschedule, please contact us</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile" class="button">View My Bookings</a>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Fixora. All rights reserved.</p>
              <p>For support, contact us at: info@fixora.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // STEP 2: Email send karo
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ============================================
 * SEND BOOKING STATUS UPDATE EMAIL
 * ============================================
 * Booking status change par email send karta hai (confirmed, completed, etc.)
 */
export async function sendBookingStatusUpdateEmail({
  userEmail,
  userName,
  serviceName,
  status,
  date,
  time,
}: {
  userEmail: string;
  userName: string;
  serviceName: string;
  status: string;
  date: string;
  time: string;
}) {
  try {
    const statusMessages: { [key: string]: { subject: string; message: string } } = {
      confirmed: {
        subject: `Booking Confirmed: ${serviceName}`,
        message: 'Your booking has been confirmed. Our technician will arrive at the scheduled time.',
      },
      completed: {
        subject: `Service Completed: ${serviceName}`,
        message: 'Your service has been completed. Thank you for choosing Fixora!',
      },
      cancelled: {
        subject: `Booking Cancelled: ${serviceName}`,
        message: 'Your booking has been cancelled. If you need to reschedule, please contact us.',
      },
    };

    const statusInfo = statusMessages[status] || {
      subject: `Booking Update: ${serviceName}`,
      message: `Your booking status has been updated to ${status}.`,
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: statusInfo.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${status === 'completed' ? '#10b981' : status === 'cancelled' ? '#ef4444' : '#667eea'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { display: inline-block; padding: 8px 16px; background: ${status === 'completed' ? '#10b981' : status === 'cancelled' ? '#ef4444' : '#667eea'}; color: white; border-radius: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Status Update</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${userName}</strong>,</p>
              <p>${statusInfo.message}</p>
              <p><span class="status-badge">${status.toUpperCase()}</span></p>
              <p><strong>Service:</strong> ${serviceName}</p>
              <p><strong>Date:</strong> ${date} at ${time}</p>
              <p>If you have any questions, please contact us.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ============================================
 * SEND CONTACT FORM EMAIL TO ADMIN
 * ============================================
 * 
 * PURPOSE:
 * - Jab koi user contact form submit kare, admin ko email jayega
 * - Admin ko instant notification milega ki naya message aaya hai
 * 
 * HOW IT WORKS:
 * 1. User ka naam, email, phone, message email mein include hota hai
 * 2. Admin ke email address par email jata hai
 * 3. Email fail ho to bhi form submit success rahega (non-blocking)
 */
export async function sendContactFormEmail({
  userName,
  userEmail,
  userPhone,
  message,
}: {
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
}) {
  try {
    // STEP 1: Admin ka email address define karo
    // Pehle ADMIN_EMAIL check karo, agar nahi hai to EMAIL_USER use karo
    // Ya phir default admin@fixora.com use karo
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@fixora.com';

    // STEP 2: Email ka content banayein
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender (aapka email)
      to: adminEmail, // Receiver (admin ka email)
      subject: `📧 New Contact Form Message from ${userName} - Fixora`, // Email ka subject line
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 30px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .content { 
              background: #f9f9f9; 
              padding: 30px; 
              border-radius: 0 0 10px 10px; 
            }
            .detail-row { 
              margin: 15px 0; 
              padding: 15px; 
              background: white; 
              border-left: 4px solid #667eea; 
              border-radius: 5px; 
            }
            .label { 
              font-weight: bold; 
              color: #667eea; 
              display: block; 
              margin-bottom: 5px; 
            }
            .message-box { 
              background: white; 
              padding: 20px; 
              border-radius: 5px; 
              margin: 20px 0; 
              border: 2px solid #e0e0e0; 
            }
            .actions {
              margin-top: 30px;
              padding: 20px;
              background: white;
              border-radius: 5px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Email Header -->
            <div class="header">
              <h1>📧 New Contact Form Message</h1>
              <p>You have received a new message from your website</p>
            </div>
            
            <!-- Email Content -->
            <div class="content">
              <p>Hello Admin,</p>
              <p>A new message has been submitted through the contact form on your website.</p>
              
              <!-- User Details -->
              <div class="detail-row">
                <span class="label">Name:</span>
                ${userName}
              </div>
              
              <div class="detail-row">
                <span class="label">Email:</span>
                <a href="mailto:${userEmail}">${userEmail}</a>
              </div>
              
              <div class="detail-row">
                <span class="label">Phone:</span>
                <a href="tel:${userPhone}">${userPhone}</a>
              </div>
              
              <!-- User Message -->
              <div class="message-box">
                <span class="label">Message:</span>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <!-- Quick Actions -->
              <div class="actions">
                <p><strong>Quick Actions:</strong></p>
                <a href="mailto:${userEmail}" class="button">📧 Reply via Email</a>
                <a href="tel:${userPhone}" class="button">📞 Call ${userPhone}</a>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                This email was sent automatically from your Fixora website contact form.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // STEP 3: Email send karo
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact form email sent to admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    // STEP 4: Agar error aaye to log karo, but fail nahi karo
    // Kyunki email fail ho to bhi message database mein save ho jayega
    console.error('❌ Contact email sending error:', error);
    return { success: false, error: error.message };
  }
}

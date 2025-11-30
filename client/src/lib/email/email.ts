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


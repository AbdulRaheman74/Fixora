# 📧 Email Notification Setup Guide

## ✅ Implementation Complete!

Email notification system successfully implement ho gaya hai. Ab aapko sirf email credentials add karne hain.

---

## 📋 Step 1: Install Dependencies

Terminal mein yeh command run karo:

```bash
cd client
npm install nodemailer
npm install --save-dev @types/nodemailer
```

---

## 📋 Step 2: Gmail App Password Setup

### A. Enable 2-Step Verification

1. Google Account Settings kholo: https://myaccount.google.com/security
2. "2-Step Verification" section mein jao
3. Enable karo (agar already enabled hai to skip karo)

### B. Generate App Password

1. Same security page par, "App passwords" section mein jao
2. "Select app" → "Mail" choose karo
3. "Select device" → "Other (Custom name)" → "Fixora" type karo
4. "Generate" button click karo
5. 16-character password copy karo (example: `abcd efgh ijkl mnop`)

**Important:** Spaces hatake use karo: `abcdefghijklmnop`

---

## 📋 Step 3: Update .env.local File

Aapki `.env.local` file (client folder mein) mein yeh add/update karo:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password

# App URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Example:

```env
EMAIL_USER=mybusiness@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** Production mein `NEXT_PUBLIC_APP_URL` ko aapki actual website URL se replace karo.

---

## 📋 Step 4: Restart Server

Email configuration add karne ke baad server restart karo:

```bash
# Server stop karo (Ctrl+C)
# Phir restart karo
npm run dev
```

---

## 🧪 Step 5: Testing

### Test Booking Creation Email:

1. User login karo
2. Koi service book karo
3. Email check karo (Inbox ya Spam folder mein)

### Test Status Update Email:

1. Admin login karo
2. Admin bookings page pe jao
3. Kisi booking ki status update karo (confirmed, completed, etc.)
4. User ka email check karo

---

## 📧 Email Features

### ✅ Implemented:

1. **Booking Confirmation Email** - Booking create hote hi user ko email
2. **Status Update Email** - Admin status change kare to user ko email
3. **Beautiful HTML Templates** - Professional looking emails
4. **Error Handling** - Email fail hone se booking nahi rukti

### 📧 Email Content:

- Booking confirmation email mein:
  - Service name
  - Date & Time
  - Address
  - Booking ID
  - "View My Bookings" button

- Status update email mein:
  - Updated status (confirmed, completed, cancelled)
  - Service details
  - Date & Time

---

## 🐛 Troubleshooting

### Problem 1: Email nahi ja raha

**Solution:**
- Check karo `.env.local` file mein credentials sahi hain
- Gmail App Password correctly copy kiya hai (no spaces)
- Server restart kiya hai

### Problem 2: "Invalid login" error

**Solution:**
- Normal Gmail password use mat karo, App Password use karo
- 2-Step Verification enabled hai confirm karo

### Problem 3: Email Spam mein ja raha hai

**Solution:**
- Email ko Spam se Inbox mein move karo
- Gmail settings mein "Less secure app access" check karo (agar available ho)

---

## 🔧 Alternative: Custom SMTP

Agar Gmail use nahi karna, to kisi bhi SMTP service use kar sakte ho:

### `.env.local` mein:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

Aur `client/src/lib/email/email.ts` file mein transporter update karo:

```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

---

## ✅ Summary

1. ✅ Email utility function created
2. ✅ Booking creation email integrated
3. ✅ Status update email integrated
4. ⏳ Email credentials add karni hain (`.env.local`)
5. ⏳ Dependencies install karni hain (nodemailer)

**Next Steps:**
1. Install dependencies (`npm install nodemailer`)
2. Gmail App Password generate karo
3. `.env.local` file update karo
4. Server restart karo
5. Test karo!

---

## 📞 Support

Agar koi problem ho to:
- Console logs check karo (email sending status)
- `.env.local` file verify karo
- Gmail App Password regenerate karo

Happy Coding! 🚀


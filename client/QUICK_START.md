# Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

### Admin Login
- **URL**: `/admin/login`
- **Email**: `admin@servicebooking.com`
- **Password**: `admin123`

### User Login
- **URL**: `/login`
- You can create a new account or use any email/password (dummy authentication)

## Project Structure

```
src/
├── app/              # Next.js 14 App Router pages
│   ├── admin/        # Admin panel pages
│   ├── services/     # Service pages
│   └── ...           # Other user pages
├── components/       # Reusable React components
├── context/          # Context API providers
├── data/             # Dummy JSON data
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── styles/           # Global styles
└── types/            # TypeScript definitions
```

## Features

✅ **User Side:**
- Home page with hero, services, testimonials
- Services listing with category filters
- Service detail pages
- About and Contact pages
- User authentication (Login/Signup)
- User profile with bookings
- WhatsApp integration
- Fully responsive design

✅ **Admin Panel:**
- Admin authentication
- Dashboard with statistics and charts
- Manage Services (CRUD operations)
- Manage Users (view all users)
- Manage Bookings (view and update status)
- Analytics dashboard with charts

✅ **Design:**
- Blue/White/Gray color theme
- Framer Motion animations
- Mobile-first responsive design
- Smooth page transitions
- Modern UI components

## TODO: Backend Integration

The following areas need backend integration (marked with `// TODO:` comments):

1. **Authentication** (`src/context/AuthContext.tsx`)
   - Replace dummy login/register with API calls
   - Implement JWT token management
   - Add password hashing

2. **Bookings** (`src/context/BookingContext.tsx`)
   - Connect to booking API
   - Real-time booking updates
   - Email/SMS notifications

3. **Services** (`src/app/admin/services/page.tsx`)
   - API endpoints for CRUD operations
   - Image upload functionality
   - Service availability management

4. **Users** (`src/app/admin/users/page.tsx`)
   - User management API
   - User activity tracking

5. **Analytics** (`src/app/admin/analytics/page.tsx`)
   - Real-time data from database
   - Advanced analytics queries

6. **Contact Form** (`src/app/contact/page.tsx`)
   - Email sending functionality
   - Form submission API

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Recharts** - Chart library for analytics
- **Lucide React** - Icon library
- **Context API** - State management

## Building for Production

```bash
npm run build
npm start
```

## Notes

- All data is currently stored in JSON files and localStorage
- Images are loaded from Unsplash (external URLs)
- WhatsApp links use the phone number: +91 98765 43210
- All authentication is dummy (no real validation)
- Bookings are stored in localStorage (persists across sessions)


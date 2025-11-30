# Fixora Backend API Documentation

Complete backend structure for Fixora service booking application.

## 📁 Backend Structure

```
src/
├── lib/
│   ├── db/
│   │   ├── mongodb.ts              # Database connection
│   │   └── models/
│   │       ├── User.ts             # User model
│   │       ├── Service.ts          # Service model
│   │       ├── Booking.ts          # Booking model
│   │       └── index.ts            # Models export
│   │
│   ├── auth/
│   │   ├── jwt.ts                  # JWT token utilities
│   │   ├── password.ts             # Password hashing utilities
│   │   └── middleware.ts           # Authentication middleware
│   │
│   └── validators/
│       ├── auth.validator.ts       # Auth validation schemas
│       ├── service.validator.ts    # Service validation schemas
│       └── booking.validator.ts    # Booking validation schemas
│
└── app/
    └── api/
        ├── auth/
        │   ├── login/route.ts      # POST - User login
        │   ├── register/route.ts   # POST - User registration
        │   ├── logout/route.ts     # POST - User logout
        │   └── me/route.ts         # GET - Get current user
        │
        ├── services/
        │   ├── route.ts            # GET, POST - List/Create services
        │   └── [id]/route.ts       # GET, PUT, DELETE - Service CRUD
        │
        ├── bookings/
        │   ├── route.ts            # GET, POST - List/Create bookings
        │   └── [id]/route.ts       # GET, PUT, DELETE - Booking CRUD
        │
        └── admin/
            ├── analytics/route.ts  # GET - Dashboard analytics
            ├── users/route.ts      # GET - List all users
            └── bookings/route.ts   # GET - List all bookings
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `zod` - Schema validation
- `dotenv` - Environment variables

### 2. Setup MongoDB

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env.local` with: `MONGODB_URI=mongodb://localhost:27017/fixora`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `.env.local` with your connection string

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your values:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string (generate using: `openssl rand -base64 32`)
- `JWT_EXPIRES_IN` - Token expiry time (default: 7d)

### 4. Run Development Server

```bash
npm run dev
```

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Services Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/services` | Get all services | No |
| GET | `/api/services?category=electrician` | Filter by category | No |
| GET | `/api/services/[id]` | Get single service | No |
| POST | `/api/services` | Create service | Admin |
| PUT | `/api/services/[id]` | Update service | Admin |
| DELETE | `/api/services/[id]` | Delete service | Admin |

### Bookings Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/bookings` | Get user bookings | Yes |
| GET | `/api/bookings?status=pending` | Filter by status | Yes |
| GET | `/api/bookings/[id]` | Get single booking | Yes |
| POST | `/api/bookings` | Create booking | Yes |
| PUT | `/api/bookings/[id]` | Update booking | Yes |
| DELETE | `/api/bookings/[id]` | Cancel booking | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/analytics` | Get dashboard analytics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/bookings` | Get all bookings | Admin |

## 🔐 Authentication

### How Authentication Works

1. **Registration/Login**: User receives JWT token
2. **Token Storage**: Token stored in HTTP-only cookie (secure)
3. **Protected Routes**: Token verified via middleware
4. **Token Expiry**: Configurable (default: 7 days)

### Example Request with Auth

```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

// Protected API call (cookie sent automatically)
const bookings = await fetch('/api/bookings', {
  method: 'GET',
  credentials: 'include', // Important for cookies
});
```

## 📊 Database Models

### User Model
```typescript
{
  name: string;
  email: string (unique);
  phone: string;
  password: string (hashed);
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Model
```typescript
{
  title: string;
  description: string;
  category: 'electrician' | 'ac';
  price: number;
  duration: string;
  image: string;
  features: string[];
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Booking Model
```typescript
{
  userId: ObjectId (ref: User);
  serviceId: ObjectId (ref: Service);
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  address: string;
  phone: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🛡️ Security Features

1. **Password Hashing**: Bcrypt with salt rounds (10)
2. **JWT Tokens**: Secure token-based authentication
3. **HTTP-only Cookies**: Tokens stored in secure cookies
4. **Input Validation**: Zod schema validation
5. **Role-based Access**: Admin vs User permissions
6. **SQL Injection Protection**: MongoDB ODM handles escaping

## 🔍 Error Handling

All API routes return consistent error responses:

```json
{
  "error": "Error message",
  "details": [] // Validation errors (if any)
}
```

Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## 📝 Example API Usage

### Register User
```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    password: 'password123'
  })
});

const data = await response.json();
// { user: {...}, token: "..." }
```

### Create Booking
```typescript
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    serviceId: 'service-id-here',
    serviceName: 'AC Installation',
    date: '2024-12-25',
    time: '10:00 AM',
    address: '123 Main St, City',
    phone: '+91 9876543210',
    notes: 'Please call before arrival'
  })
});
```

## 🧪 Testing

Test API endpoints using:
- **Postman** - API testing tool
- **Thunder Client** - VS Code extension
- **curl** - Command line
- **Frontend** - Integrate with React components

## 🚀 Production Checklist

- [ ] Change `JWT_SECRET` to secure random string
- [ ] Use MongoDB Atlas (cloud database)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Add request logging
- [ ] Set up error monitoring
- [ ] Database backups configured

## 📚 Next Steps

1. **Connect Frontend**: Update AuthContext and BookingContext to use APIs
2. **Seed Database**: Create script to populate initial services
3. **Add Features**: Payment integration, email notifications, etc.
4. **Testing**: Write unit and integration tests
5. **Deployment**: Deploy to Vercel, AWS, etc.

## 🆘 Troubleshooting

**Database Connection Error**
- Check MongoDB URI in `.env.local`
- Ensure MongoDB is running (if local)
- Verify network access (if cloud)

**Authentication Not Working**
- Check JWT_SECRET is set
- Verify cookie settings
- Check token expiry time

**API Returns 401**
- User not logged in
- Token expired
- Invalid token

**API Returns 403**
- User doesn't have required role
- Admin endpoint accessed by regular user

## 📞 Support

For issues or questions, check:
- MongoDB Documentation
- Next.js API Routes Documentation
- JWT Documentation

---

**Built with ❤️ for Fixora**



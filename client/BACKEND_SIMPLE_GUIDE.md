# 🎯 Fixora Backend - Simple Guide (Very Beginner Friendly)

## 📚 Ye Guide Kya Hai?

Yeh guide aapko samjhayegi ki backend ka code kaise kaam karta hai - **bahut hi simple tarike se!**

---

## 🗂️ Backend Ka Structure (Simple Explanation)

### **1. Database (Database)** 
**Location:** `src/lib/db/`

```
db/
├── mongodb.ts      → Database se connect karne ke liye
└── models/
    ├── User.ts     → User ki table (name, email, password, etc.)
    ├── Service.ts  → Services ki table (AC, Electrician, etc.)
    └── Booking.ts  → Bookings ki table (kisne booking ki, kab, etc.)
```

**Kaise Kaam Karta Hai:**
- `mongodb.ts` → Database se connection banata hai
- `models/` → Database ki tables define karte hain (kya fields honge)

---

### **2. Authentication (Login/Security)**
**Location:** `src/lib/auth/`

```
auth/
├── jwt.ts          → Login tokens banane/verify karne ke liye
├── password.ts     → Password ko secure karne ke liye (hash)
└── middleware.ts   → Check karta hai user logged in hai ya nahi
```

**Kaise Kaam Karta Hai:**
- `jwt.ts` → User ko token deta hai login ke baad
- `password.ts` → Password ko encrypt karta hai (security)
- `middleware.ts` → Protected routes ke liye check karta hai

---

### **3. Validators (Input Check)**
**Location:** `src/lib/validators/`

```
validators/
├── auth.validator.ts    → Login/Register data check
├── service.validator.ts → Service data check
└── booking.validator.ts → Booking data check
```

**Kaise Kaam Karta Hai:**
- User jo data bhejta hai, wo sahi hai ya nahi - yeh check karta hai

---

### **4. API Routes (Backend Endpoints)**
**Location:** `src/app/api/`

```
api/
├── auth/              → Login, Register, Logout
│   ├── login/route.ts
│   ├── register/route.ts
│   └── logout/route.ts
│
├── services/          → Services (List, Create, Update, Delete)
│   ├── route.ts
│   └── [id]/route.ts
│
├── bookings/          → Bookings (List, Create, Update, Delete)
│   ├── route.ts
│   └── [id]/route.ts
│
└── admin/             → Admin only (Analytics, Users)
    ├── analytics/route.ts
    ├── users/route.ts
    └── bookings/route.ts
```

**Kaise Kaam Karta Hai:**
- Har folder = Ek API endpoint
- `route.ts` file = API ka code
- File naam se hi URL ban jata hai!

---

## 📝 Example: Register API (Step by Step)

**File:** `src/app/api/auth/register/route.ts`

```typescript
// STEP 1: Frontend se data lo
const { name, email, phone, password } = body;

// STEP 2: Validate karo (check karo sab sahi hai)
if (!name || !email) {
  return error;
}

// STEP 3: Database se connect karo
await connectDB();

// STEP 4: Check karo email pehle se hai ya nahi
const existingUser = await User.findOne({ email });
if (existingUser) {
  return error; // Email already exists
}

// STEP 5: Password ko hash karo (secure karne ke liye)
const hashedPassword = await hashPassword(password);

// STEP 6: Database mein naya user banao
const newUser = await User.create({
  name, email, phone,
  password: hashedPassword
});

// STEP 7: Token generate karo (login ke liye)
const token = generateToken(userId, email, role);

// STEP 8: Success response bhejo
return { success: true, user, token };
```

**Yeh sab steps line-by-line mein comments ke saath likhe hain!**

---

## 🔄 Complete Flow Example

### **User Registration Flow:**

```
1. Frontend → POST /api/auth/register
   ↓
2. API Route → Data receive karta hai
   ↓
3. Validation → Check karta hai sab sahi hai
   ↓
4. Database → Connect karta hai
   ↓
5. Check → Email pehle se hai ya nahi
   ↓
6. Password → Hash karta hai (secure)
   ↓
7. Database → User create karta hai
   ↓
8. Token → Generate karta hai
   ↓
9. Response → Frontend ko bhejta hai
```

---

## 📖 Code Mein Comments

**Har file mein:**
- ✅ Step-by-step comments
- ✅ Hindi/English mix explanations
- ✅ Simple variable names
- ✅ Easy to understand logic

**Example:**
```typescript
// STEP 1: Frontend Se Data Lo
const body = await request.json();

// STEP 2: Database Se Connect Karo
await connectDB();

// STEP 3: User Ko Database Mein Dhundho
const user = await User.findOne({ email });
```

---

## 🚀 Quick Start Guide

### **1. Install Dependencies**
```bash
cd client
npm install
```

### **2. Setup MongoDB**
- Local MongoDB ya MongoDB Atlas (cloud)

### **3. Create `.env.local`**
```env
MONGODB_URI=mongodb://localhost:27017/fixora
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### **4. Run Server**
```bash
npm run dev
```

### **5. Test API**
- Open: `http://localhost:3000/api/auth/register`
- Use Postman ya Thunder Client to test

---

## 📋 API Endpoints List

### **Authentication APIs**
- `POST /api/auth/register` → User register
- `POST /api/auth/login` → User login
- `POST /api/auth/logout` → User logout
- `GET /api/auth/me` → Current user info

### **Services APIs**
- `GET /api/services` → All services
- `GET /api/services/[id]` → One service
- `POST /api/services` → Create service (Admin)
- `PUT /api/services/[id]` → Update service (Admin)
- `DELETE /api/services/[id]` → Delete service (Admin)

### **Bookings APIs**
- `GET /api/bookings` → User bookings
- `POST /api/bookings` → Create booking
- `GET /api/bookings/[id]` → One booking
- `PUT /api/bookings/[id]` → Update booking
- `DELETE /api/bookings/[id]` → Cancel booking

### **Admin APIs**
- `GET /api/admin/analytics` → Dashboard analytics
- `GET /api/admin/users` → All users
- `GET /api/admin/bookings` → All bookings

---

## 💡 Important Concepts (Simple Explanation)

### **1. Database Connection**
```typescript
// Simple: Database se connect karo
await connectDB();
```

### **2. Find Data**
```typescript
// Simple: Database se data lo
const user = await User.findOne({ email: 'test@example.com' });
```

### **3. Create Data**
```typescript
// Simple: Database mein naya data banao
const newUser = await User.create({ name, email, password });
```

### **4. Update Data**
```typescript
// Simple: Database mein data update karo
await User.findByIdAndUpdate(id, { name: 'New Name' });
```

### **5. Delete Data**
```typescript
// Simple: Database se data delete karo
await User.findByIdAndDelete(id);
```

---

## 🎓 Learning Path

### **Beginner Level:**
1. ✅ Read comments in code
2. ✅ Understand step-by-step flow
3. ✅ Test APIs using Postman
4. ✅ See how data flows

### **Intermediate Level:**
1. ✅ Modify existing APIs
2. ✅ Add new fields to models
3. ✅ Create new API endpoints
4. ✅ Add custom validations

### **Advanced Level:**
1. ✅ Optimize database queries
2. ✅ Add caching
3. ✅ Implement rate limiting
4. ✅ Add file uploads

---

## ❓ Common Questions

### **Q: Database se kaise connect karein?**
**A:** `src/lib/db/mongodb.ts` file mein `connectDB()` function hai. API route mein `await connectDB()` call karo.

### **Q: User ko kaise verify karein?**
**A:** `src/lib/auth/middleware.ts` mein `requireAuth()` function use karo.

### **Q: Password ko kaise hash karein?**
**A:** `src/lib/auth/password.ts` mein `hashPassword()` function use karo.

### **Q: Token kaise generate karein?**
**A:** `src/lib/auth/jwt.ts` mein `generateToken()` function use karo.

---

## 📚 File Structure Summary

```
Backend Files:
├── Database
│   ├── mongodb.ts (Connection)
│   └── models/ (Tables: User, Service, Booking)
│
├── Authentication
│   ├── jwt.ts (Tokens)
│   ├── password.ts (Password hash)
│   └── middleware.ts (Auth check)
│
├── Validators
│   └── *.validator.ts (Input validation)
│
└── API Routes
    ├── auth/ (Login, Register)
    ├── services/ (Services CRUD)
    ├── bookings/ (Bookings CRUD)
    └── admin/ (Admin APIs)
```

---

## ✅ Features

- ✅ **Very Simple Code** - Step-by-step comments
- ✅ **Easy to Understand** - Hindi/English mix
- ✅ **Beginner Friendly** - No complex patterns
- ✅ **Well Documented** - Every step explained
- ✅ **Production Ready** - All features working

---

## 🎉 Summary

Backend code **bahut simple** format mein likha gaya hai:
- Har step explain kiya gaya hai
- Comments Hindi/English mix mein hain
- Easy variable names
- Simple logic
- Beginner-friendly structure

**Aap easily samajh aur modify kar sakte ho!**

---

**Happy Coding! 🚀**



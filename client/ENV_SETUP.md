# Environment Variables Setup

Create a `.env.local` file in the `client/` directory with the following variables:

```env
# Database Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/fixora

# For MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fixora?retryWrites=true&w=majority

# JWT Configuration
# Generate a secure random string for production (e.g., using: openssl rand -base64 32)
JWT_SECRET=your-super-secret-key-change-this-in-production-use-random-string
JWT_EXPIRES_IN=7d

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Quick Setup

1. Copy the content above
2. Create `.env.local` file in `client/` directory
3. Update `MONGODB_URI` with your MongoDB connection string
4. Generate a secure `JWT_SECRET` (use: `openssl rand -base64 32`)
5. Save the file

**Important:** Never commit `.env.local` to git (it's already in `.gitignore`)



import jwt from 'jsonwebtoken';

/**
 * JWT Token Functions
 * Yeh file login tokens create aur verify karne ke liye hai
 */

// Secret key (environment variable se lo)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Token kitne din tak valid rahega
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Function: Token Create Karo
 * Jab user login/register karta hai, to uska token banaya jata hai
 */
export function generateToken(userId: string, email: string, role: string): string {
  // Token mein user ki basic info store karo
  const tokenData = {
    userId: userId,
    email: email,
    role: role,
  };

  // JWT library se token banao
  const token = jwt.sign(tokenData, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, // 7 din tak valid
  });

  return token;
}

/**
 * Function: Token Verify Karo
 * Check karo ki token valid hai ya nahi
 */
export function verifyToken(token: string) {
  try {
    // Token ko verify karo
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Agar valid hai to user data return karo
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    // Agar invalid hai to null return karo
    return null;
  }
}

/**
 * Function: Request Se Token Nikalo
 * Request ke cookies ya headers se token extract karo
 */
export function getTokenFromRequest(request: Request): string | null {
  // Pehle cookie se token dhundho
  const cookieHeader = request.headers.get('cookie');

  if (cookieHeader) {
    // Cookies ko parse karo
    const cookies = cookieHeader.split(';');

    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'token' && value) {
        return value; // Token mil gaya
      }
    }
  }

  // Agar cookie mein nahi mila, to header se check karo
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // "Bearer " ke baad ki value
  }

  return null; // Token nahi mila
}

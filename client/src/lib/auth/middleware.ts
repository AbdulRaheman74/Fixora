import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './jwt';

/**
 * Authentication Middleware
 * Yeh file check karti hai ki user logged in hai ya nahi
 */

/**
 * Function: Check Karo User Logged In Hai Ya Nahi
 * Agar user logged in nahi hai to error return karo
 */
export async function requireAuth(request: NextRequest) {
  // STEP 1: Request se token nikalo
  const token = getTokenFromRequest(request);

  // STEP 2: Agar token nahi mila, to user logged in nahi hai
  if (!token) {
    return NextResponse.json(
      { error: 'Please login first' },
      { status: 401 }
    );
  }

  // STEP 3: Token verify karo
  const userData = verifyToken(token);

  // STEP 4: Agar token invalid hai, to error return karo
  if (!userData) {
    return NextResponse.json(
      { error: 'Invalid token. Please login again' },
      { status: 401 }
    );
  }

  // STEP 5: Sab kuch theek hai, user data return karo
  return userData;
}

/**
 * Function: Check Karo User Admin Hai Ya Nahi
 * Sirf admin users ko access dene ke liye
 */
export async function requireAdmin(request: NextRequest) {
  // STEP 1: Pehle check karo user logged in hai ya nahi
  const authResult = await requireAuth(request);

  // STEP 2: Agar logged in nahi hai, to error return karo
  if (authResult instanceof NextResponse) {
    return authResult; // Yeh error response hai
  }

  // STEP 3: Check karo user admin hai ya nahi
  if (authResult.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required. Only admins can access this.' },
      { status: 403 }
    );
  }

  // STEP 4: User admin hai, to user data return karo
  return authResult;
}

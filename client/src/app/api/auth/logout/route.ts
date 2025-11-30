import { NextRequest, NextResponse } from "next/server";

/**
 * Logout API
 * POST /api/auth/logout
 * Purpose: User ko logout karna (token delete karna)
 */

// IMPORTANT: Yeh route dynamic hai (cookies modify karne ke liye)
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // STEP 1: Success response banao
    const res = NextResponse.json(
      {
        success: true,
        message: "Logout successful!",
      },
      { status: 200 }
    );

    // STEP 2: Token cookie ko delete karo (empty string set karke)
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // 0 = delete immediately
    });

    return res;
  } catch (error: any) {
    console.error("❌ Logout Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

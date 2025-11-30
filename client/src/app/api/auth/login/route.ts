import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { comparePassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";

/**
 * Login API
 * POST /api/auth/login
 * Purpose: User ko login karna
 */

// IMPORTANT: Yeh route dynamic hai (cookies set karne ke liye)
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // STEP 1: Frontend se email aur password lo
    const { email, password } = await req.json();

    // STEP 2: Validation - check karo fields mil rahe hain
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // STEP 3: Database se connect karo
    await connectDB();

    // STEP 4: Database mein user dhundho (password field bhi lo)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    // STEP 5: Check karo user exist karta hai ya nahi
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // STEP 6: Password verify karo (database wale password se match karta hai ya nahi)
    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // STEP 7: Login token generate karo
    const token = generateToken(
      user._id.toString(),
      user.email,
      user.role
    );

    // STEP 8: Success response banao (password ko hata kar)
    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );

    // STEP 9: Token ko cookie mein store karo
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error: any) {
    console.error("❌ Login Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

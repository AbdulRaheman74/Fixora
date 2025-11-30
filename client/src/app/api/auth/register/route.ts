import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { hashPassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";

/**
 * Register API
 * POST /api/auth/register
 * Purpose: Normal user OR admin register karne ke liye
 */
export async function POST(req: NextRequest) {
  try {
    // STEP 1: Frontend se data lo
    const { name, email, phone, password, adminSecret } = await req.json();

    // STEP 2: Validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // STEP 3: DB connect
    await connectDB();

    // STEP 4: Email exists?
    const userExist = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExist) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // STEP 5: Password Hash
    const hashedPwd = await hashPassword(password);

    // STEP 6: Role decide (admin ya user)
    const userRole =
      adminSecret === process.env.ADMIN_SECRET_KEY ? "admin" : "user";

    // STEP 7: User Create
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPwd,
      role: userRole,
    });

    // STEP 8: Token
    const token = generateToken(
      newUser._id.toString(),
      newUser.email,
      newUser.role
    );

    // STEP 9: Response Ready
    const res = NextResponse.json(
      {
        success: true,
        message:
          userRole === "admin"
            ? "Admin registered successfully!"
            : "User registered successfully!",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
        token,
      },
      { status: 201 }
    );

    // STEP 10: Cookie Set
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error: any) {
    console.error("❌ Registration Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

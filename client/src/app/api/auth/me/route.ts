import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";

/**
 * Get Current User API
 * GET /api/auth/me
 * Purpose: Currently logged in user ki info dikhana
 */
export async function GET(req: NextRequest) {
  try {
    // STEP 1: Check karo user logged in hai ya nahi
    const authResult = await requireAuth(req);

    // Agar error aaya (user logged in nahi hai)
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // STEP 2: User ID lo
    const { userId } = authResult;

    // STEP 3: Database se connect karo
    await connectDB();

    // STEP 4: Database se user ki full info lo
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // STEP 5: User data banao (password ko hata kar)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };

    // STEP 6: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get User Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Booking from "@/lib/db/models/Booking";
import { requireAdmin } from "@/lib/auth/middleware";

/**
 * Admin Users API
 * GET /api/admin/users
 * Purpose: Sabhi users ki list dikhana (Admin only)
 */
export async function GET(req: NextRequest) {
  try {
    // STEP 1: Check karo user admin hai ya nahi
    const adminCheck = await requireAdmin(req);
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    // STEP 2: Database se connect karo
    await connectDB();

    // STEP 3: Query parameters lo (optional filter)
    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role"); // 'user' ya 'admin'

    // STEP 4: Query build karo
    const query: any = {};
    if (role && (role === "user" || role === "admin")) {
      query.role = role;
    }

    // STEP 5: Database se users lo (password ko hata kar)
    const users = await User.find(query)
      .select("-password") // Password field exclude karo
      .sort({ createdAt: -1 });

    // STEP 6: Har user ke saath booking count add karo
    const usersWithBookings = await Promise.all(
      users.map(async (user: any) => {
        const bookingCount = await Booking.countDocuments({ userId: user._id });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          bookings: bookingCount,
          createdAt: user.createdAt,
        };
      })
    );

    // STEP 7: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        users: usersWithBookings,
        total: usersWithBookings.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get Users Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Booking from "@/lib/db/models/Booking";
import { requireAdmin } from "@/lib/auth/middleware";

/**
 * Admin Bookings API
 * GET /api/admin/bookings
 * Purpose: Sabhi bookings ki list dikhana (Admin only)
 */

// IMPORTANT: Yeh route dynamic hai (build time par pre-render nahi hoga)
export const dynamic = 'force-dynamic';

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
    const status = searchParams.get("status");

    // STEP 4: Query build karo
    const query: any = {};
    if (status && ["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      query.status = status;
    }

    // STEP 5: Database se sabhi bookings lo (service aur user info bhi)
    const bookings = await Booking.find(query)
      .populate("serviceId", "title description category price image")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    // STEP 6: Response format mein convert karo
    const bookingsData = bookings.map((booking: any) => ({
      id: booking._id.toString(),
      userId: booking.userId._id?.toString() || booking.userId.toString(),
      userName: booking.userId?.name || "Unknown",
      userEmail: booking.userId?.email || "Unknown",
      userPhone: booking.userId?.phone || "Unknown",
      serviceId: booking.serviceId._id?.toString() || booking.serviceId.toString(),
      serviceName: booking.serviceName,
      service: booking.serviceId._id
        ? {
            id: booking.serviceId._id.toString(),
            title: booking.serviceId.title,
            description: booking.serviceId.description,
            category: booking.serviceId.category,
            price: booking.serviceId.price,
            image: booking.serviceId.image,
          }
        : null,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      address: booking.address,
      phone: booking.phone,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    // STEP 7: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        bookings: bookingsData,
        total: bookingsData.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get Admin Bookings Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

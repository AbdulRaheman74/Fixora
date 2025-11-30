import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Booking from "@/lib/db/models/Booking";
import Service from "@/lib/db/models/Service";
import User from "@/lib/db/models/User";
import { requireAdmin } from "@/lib/auth/middleware";

/**
 * Admin Analytics API
 * GET /api/admin/analytics
 * Purpose: Admin dashboard ke liye analytics data
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

    // STEP 3: Total counts lo
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalServices = await Service.countDocuments();

    // STEP 4: Bookings by status count karo
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });

    // STEP 5: Total revenue calculate karo (completed bookings se)
    const completedBookingsList = await Booking.find({ status: "completed" }).populate("serviceId", "price");

    let totalRevenue = 0;
    completedBookingsList.forEach((booking: any) => {
      if (booking.serviceId && booking.serviceId.price) {
        totalRevenue += booking.serviceId.price;
      }
    });

    // STEP 6: Monthly revenue calculate karo (last 12 months)
    const monthlyRevenue = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthBookings = await Booking.find({
        status: "completed",
        createdAt: { $gte: monthStart, $lte: monthEnd },
      }).populate("serviceId", "price");

      let monthRevenue = 0;
      monthBookings.forEach((booking: any) => {
        if (booking.serviceId && booking.serviceId.price) {
          monthRevenue += booking.serviceId.price;
        }
      });

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        revenue: monthRevenue,
      });
    }

    // STEP 7: Service popularity calculate karo
    const serviceStats: any = {};
    const allBookings = await Booking.find().populate("serviceId", "title");

    allBookings.forEach((booking: any) => {
      if (booking.serviceId) {
        const serviceId = booking.serviceId._id.toString();
        if (!serviceStats[serviceId]) {
          serviceStats[serviceId] = {
            service: booking.serviceId.title,
            bookings: 0,
          };
        }
        serviceStats[serviceId].bookings++;
      }
    });

    const servicePopularity = Object.values(serviceStats)
      .sort((a: any, b: any) => b.bookings - a.bookings)
      .slice(0, 10);

    // STEP 8: Recent bookings lo (last 10)
    const recentBookings = await Booking.find()
      .populate("serviceId", "title category price")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    const recentBookingsData = recentBookings.map((booking: any) => ({
      id: booking._id.toString(),
      serviceName: booking.serviceName,
      userName: booking.userId?.name || "Unknown",
      userEmail: booking.userId?.email || "Unknown",
      status: booking.status,
      date: booking.date,
      time: booking.time,
      createdAt: booking.createdAt,
    }));

    // STEP 9: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        analytics: {
          totalBookings,
          totalUsers,
          totalServices,
          totalRevenue,
          bookingsByStatus: {
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
          },
          monthlyRevenue,
          servicePopularity,
          recentBookings: recentBookingsData,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get Analytics Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Booking from "@/lib/db/models/Booking";
import Service from "@/lib/db/models/Service";
import User from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { sendBookingConfirmationEmail } from "@/lib/email/email";

/**
 * Bookings API
 * GET /api/bookings - User ki bookings dikhana
 * POST /api/bookings - Naya booking banana
 */

// IMPORTANT: Yeh route dynamic hai (build time par pre-render nahi hoga)
export const dynamic = 'force-dynamic';

// GET: User Ki Bookings
export async function GET(req: NextRequest) {
  try {
    // STEP 1: Check karo user logged in hai ya nahi
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId, role } = authResult;

    // STEP 2: Database se connect karo
    await connectDB();

    // STEP 3: Query build karo
    const query: any = {};

    // Admin sabhi bookings dekh sakta hai, normal user sirf apni
    if (role !== "admin") {
      query.userId = userId;
    }

    // Status filter (optional)
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    if (status && ["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      query.status = status;
    }

    // STEP 4: Database se bookings lo (service info bhi)
    const bookings = await Booking.find(query)
      .populate("serviceId", "title description category price image")
      .sort({ createdAt: -1 });

    // STEP 5: Response format mein convert karo
    const bookingsData = bookings.map((booking: any) => ({
      id: booking._id.toString(),
      userId: booking.userId.toString(),
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

    // STEP 6: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        bookings: bookingsData,
        total: bookingsData.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get Bookings Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// POST: Naya Booking Create Karo
export async function POST(req: NextRequest) {
  try {
    // STEP 1: Check karo user logged in hai ya nahi
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;

    // STEP 2: Frontend se booking data lo
    const { serviceId, serviceName, date, time, address, phone, notes } = await req.json();

    // STEP 3: Validation - check karo sab required fields mil rahe hain
    if (!serviceId || !serviceName || !date || !time || !address || !phone) {
      return NextResponse.json(
        { error: "All required fields are missing" },
        { status: 400 }
      );
    }

    // STEP 4: Database se connect karo
    await connectDB();

    // STEP 5: Check karo service exist karti hai ya nahi
    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // STEP 6: Naya booking database mein create karo
    const newBooking = await Booking.create({
      userId: userId,
      serviceId: serviceId,
      serviceName: serviceName.trim(),
      date: date.trim(),
      time: time.trim(),
      address: address.trim(),
      phone: phone.trim(),
      notes: notes?.trim() || "",
      status: "pending",
    });

    // STEP 7: Service info bhi load karo
    await newBooking.populate("serviceId", "title description category price image");

    // STEP 8: User info fetch karo (email ke liye)
    const user = await User.findById(userId);

    // STEP 9: Booking confirmation email send karo
    if (user && user.email) {
      try {
        await sendBookingConfirmationEmail({
          userEmail: user.email,
          userName: user.name,
          serviceName: newBooking.serviceName,
          date: newBooking.date,
          time: newBooking.time,
          address: newBooking.address,
          bookingId: newBooking._id.toString(),
        });
        console.log('✅ Booking confirmation email sent to:', user.email);
      } catch (emailError: any) {
        // Email fail hone se booking create nahi rukega
        console.error('❌ Email sending failed (booking still created):', emailError.message);
      }
    }

    // STEP 10: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully!",
        booking: {
          id: newBooking._id.toString(),
          userId: newBooking.userId.toString(),
          serviceId: newBooking.serviceId._id.toString(),
          serviceName: newBooking.serviceName,
          service: {
            id: newBooking.serviceId._id.toString(),
            title: newBooking.serviceId.title,
            description: newBooking.serviceId.description,
            category: newBooking.serviceId.category,
            price: newBooking.serviceId.price,
            image: newBooking.serviceId.image,
          },
          date: newBooking.date,
          time: newBooking.time,
          status: newBooking.status,
          address: newBooking.address,
          phone: newBooking.phone,
          notes: newBooking.notes,
          createdAt: newBooking.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Create Booking Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

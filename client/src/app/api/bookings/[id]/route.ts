import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Booking from "@/lib/db/models/Booking";
import User from "@/lib/db/models/User";
import { requireAuth } from "@/lib/auth/middleware";
import { sendBookingStatusUpdateEmail } from "@/lib/email/email";

/**
 * Single Booking API
 * GET /api/bookings/[id] - Ek booking dikhana
 * PUT /api/bookings/[id] - Booking update karna
 * DELETE /api/bookings/[id] - Booking cancel karna
 */

// GET: Ek Booking
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STEP 1: Check karo user logged in hai ya nahi
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId, role } = authResult;
    const { id } = params;

    // STEP 2: Database se connect karo
    await connectDB();

    // STEP 3: Database se booking dhundho
    const booking = await Booking.findById(id).populate("serviceId", "title description category price image");

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // STEP 4: Check karo user ko access hai ya nahi (admin sab dekh sakta hai)
    if (role !== "admin" && booking.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "Access denied. This is not your booking." },
        { status: 403 }
      );
    }

    // STEP 5: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        booking: {
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
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get Booking Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT: Booking Update Karo
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STEP 1: Check karo user logged in hai ya nahi
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId, role } = authResult;
    const { id } = params;

    // STEP 2: Frontend se update data lo
    const body = await req.json();
    const updates: any = {};

    // Sirf jo fields diye gaye hain, unhe update karo
    if (body.date) updates.date = body.date.trim();
    if (body.time) updates.time = body.time.trim();
    if (body.address) updates.address = body.address.trim();
    if (body.phone) updates.phone = body.phone.trim();
    if (body.notes !== undefined) updates.notes = body.notes.trim();

    // Status sirf admin change kar sakta hai
    if (body.status && role === "admin") {
      updates.status = body.status;
    }

    // STEP 3: Database se connect karo
    await connectDB();

    // STEP 4: Database se booking dhundho
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // STEP 5: Check karo user ko access hai ya nahi
    if (role !== "admin" && booking.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "Access denied. You can only update your own bookings." },
        { status: 403 }
      );
    }

    // STEP 6: Booking ko update karo
    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, {
      new: true, // Updated booking return karo
    }).populate("serviceId", "title description category price image");

    // STEP 7: Agar status update hua hai, to email send karo
    if (body.status && role === "admin" && updatedBooking) {
      // User info fetch karo
      const bookingUser = await User.findById(updatedBooking.userId);
      
      if (bookingUser && bookingUser.email) {
        try {
          await sendBookingStatusUpdateEmail({
            userEmail: bookingUser.email,
            userName: bookingUser.name,
            serviceName: updatedBooking.serviceName,
            status: body.status,
            date: updatedBooking.date,
            time: updatedBooking.time,
          });
          console.log('✅ Status update email sent to:', bookingUser.email);
        } catch (emailError: any) {
          // Email fail hone se booking update nahi rukega
          console.error('❌ Email sending failed (booking still updated):', emailError.message);
        }
      }
    }

    // STEP 8: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        message: "Booking updated successfully!",
        booking: {
          id: updatedBooking!._id.toString(),
          userId: updatedBooking!.userId.toString(),
          serviceId: updatedBooking!.serviceId._id.toString(),
          serviceName: updatedBooking!.serviceName,
          service: {
            id: updatedBooking!.serviceId._id.toString(),
            title: updatedBooking!.serviceId.title,
            description: updatedBooking!.serviceId.description,
            category: updatedBooking!.serviceId.category,
            price: updatedBooking!.serviceId.price,
            image: updatedBooking!.serviceId.image,
          },
          date: updatedBooking!.date,
          time: updatedBooking!.time,
          status: updatedBooking!.status,
          address: updatedBooking!.address,
          phone: updatedBooking!.phone,
          notes: updatedBooking!.notes,
          createdAt: updatedBooking!.createdAt,
          updatedAt: updatedBooking!.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Update Booking Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE: Booking Cancel Karo
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STEP 1: Check karo user logged in hai ya nahi
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId, role } = authResult;
    const { id } = params;

    // STEP 2: Database se connect karo
    await connectDB();

    // STEP 3: Database se booking dhundho
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // STEP 4: Check karo user ko access hai ya nahi (admin sab delete kar sakta hai)
    if (role !== "admin" && booking.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "Access denied. You can only cancel your own bookings." },
        { status: 403 }
      );
    }

    // STEP 5: Booking ko delete karo
    await Booking.findByIdAndDelete(id);

    // STEP 6: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        message: "Booking cancelled successfully!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Delete Booking Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

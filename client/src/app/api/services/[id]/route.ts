import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Service from "@/lib/db/models/Service";
import { requireAdmin } from "@/lib/auth/middleware";

/**
 * Single Service API
 * GET /api/services/[id] - Ek service dikhana
 * PUT /api/services/[id] - Service update karna (Admin only)
 * DELETE /api/services/[id] - Service delete karna (Admin only)
 */

// IMPORTANT: Yeh route dynamic hai (build time par pre-render nahi hoga)
export const dynamic = 'force-dynamic';

// GET: Ek Service
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STEP 1: Service ID lo
    const { id } = params;

    // STEP 2: Database se connect karo
    await connectDB();

    // STEP 3: Database se service dhundho
    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // STEP 4: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        service: {
          id: service._id.toString(),
          title: service.title,
          description: service.description,
          category: service.category,
          price: service.price,
          duration: service.duration,
          image: service.image,
          features: service.features,
          rating: service.rating,
          reviews: service.reviews,
          createdAt: service.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get Service Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT: Service Update Karo (Admin Only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STEP 1: Check karo user admin hai ya nahi
    const adminCheck = await requireAdmin(req);
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    // STEP 2: Service ID lo
    const { id } = params;

    // STEP 3: Frontend se update data lo
    const body = await req.json();
    const updates: any = {};

    // Sirf jo fields diye gaye hain, unhe update karo
    if (body.title) updates.title = body.title.trim();
    if (body.description) updates.description = body.description.trim();
    if (body.category) updates.category = body.category;
    if (body.price !== undefined) updates.price = body.price;
    if (body.duration) updates.duration = body.duration.trim();
    if (body.image) updates.image = body.image.trim();
    if (body.features) updates.features = body.features;

    // STEP 4: Database se connect karo
    await connectDB();

    // STEP 5: Service ko update karo
    const updatedService = await Service.findByIdAndUpdate(id, updates, {
      new: true, // Updated service return karo
    });

    if (!updatedService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // STEP 6: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        message: "Service updated successfully!",
        service: {
          id: updatedService._id.toString(),
          title: updatedService.title,
          description: updatedService.description,
          category: updatedService.category,
          price: updatedService.price,
          duration: updatedService.duration,
          image: updatedService.image,
          features: updatedService.features,
          rating: updatedService.rating,
          reviews: updatedService.reviews,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Update Service Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE: Service Delete Karo (Admin Only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STEP 1: Check karo user admin hai ya nahi
    const adminCheck = await requireAdmin(req);
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    // STEP 2: Service ID lo
    const { id } = params;

    // STEP 3: Database se connect karo
    await connectDB();

    // STEP 4: Service ko delete karo
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // STEP 5: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        message: "Service deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Delete Service Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

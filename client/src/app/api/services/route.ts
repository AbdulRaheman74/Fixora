import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Service from "@/lib/db/models/Service";
import { requireAdmin } from "@/lib/auth/middleware";

/**
 * Services API
 * GET /api/services - Sabhi services dikhana
 * POST /api/services - Naya service banana (Admin only)
 */

// IMPORTANT: Yeh route dynamic hai (build time par pre-render nahi hoga)
export const dynamic = 'force-dynamic';

// GET: Sabhi Services
export async function GET(req: NextRequest) {
  try {
    // STEP 1: Database se connect karo
    await connectDB();

    // STEP 2: Query parameters lo (optional filters)
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category"); // electrician ya ac

    // STEP 3: Query build karo
    const query: any = {};
    if (category && (category === "electrician" || category === "ac")) {
      query.category = category;
    }

    // STEP 4: Database se services lo
    const services = await Service.find(query).sort({ createdAt: -1 });

    // STEP 5: Response format mein convert karo
    const servicesData = services.map((service) => ({
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
    }));

    // STEP 6: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        services: servicesData,
        total: servicesData.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get Services Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// POST: Naya Service Create Karo (Admin Only)
export async function POST(req: NextRequest) {
  try {
    // STEP 1: Check karo user admin hai ya nahi
    const adminCheck = await requireAdmin(req);
    if (adminCheck instanceof NextResponse) {
      return adminCheck; // Error response
    }

    // STEP 2: Frontend se service data lo
    const { title, description, category, price, duration, image, features } = await req.json();

    // STEP 3: Validation - check karo sab required fields mil rahe hain
    if (!title || !description || !category || !price || !duration || !image) {
      return NextResponse.json(
        { error: "All required fields are missing" },
        { status: 400 }
      );
    }

    // STEP 4: Database se connect karo
    await connectDB();

    // STEP 5: Naya service database mein create karo
    const newService = await Service.create({
      title: title.trim(),
      description: description.trim(),
      category: category,
      price: price,
      duration: duration.trim(),
      image: image.trim(),
      features: features || [],
      rating: 0,
      reviews: 0,
    });

    // STEP 6: Success response bhejo
    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully!",
        service: {
          id: newService._id.toString(),
          title: newService.title,
          description: newService.description,
          category: newService.category,
          price: newService.price,
          duration: newService.duration,
          image: newService.image,
          features: newService.features,
          rating: newService.rating,
          reviews: newService.reviews,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Create Service Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

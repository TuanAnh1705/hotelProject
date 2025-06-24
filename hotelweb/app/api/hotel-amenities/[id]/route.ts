/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper để parse ID từ params
function getAmenityId(params: { id: string }) {
  const amenityId = Number(params.id);
  if (isNaN(amenityId)) throw new Error("Invalid amenity ID");
  return amenityId;
}

// GET - Lấy thông tin tiện ích và các khách sạn đang sử dụng
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const amenityId = getAmenityId(params);

    const amenity = await prisma.hotelAmenity.findUnique({
      where: { id: amenityId },
      include: {
        hotels: {
          include: {
            hotel: {
              select: { id: true, name: true, city: true },
            },
          },
        },
      },
    });

    if (!amenity) {
      return NextResponse.json({ success: false, error: "Amenity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: amenity });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT - Cập nhật tiện ích
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const amenityId = getAmenityId(params);
    const { amenityName, description } = await request.json();

    const updated = await prisma.hotelAmenity.update({
      where: { id: amenityId },
      data: { amenityName, description },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update amenity" }, { status: 500 });
  }
}

// DELETE - Xoá tiện ích và các liên kết
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const amenityId = getAmenityId(params);

    await prisma.hotelAmenitiesLink.deleteMany({ where: { amenityId } });
    await prisma.hotelAmenity.delete({ where: { id: amenityId } });

    return NextResponse.json({ success: true, message: "Amenity and links deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete" }, { status: 500 });
  }
}

// PATCH - Tạo hoặc xoá liên kết hotel-amenity
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const amenityId = getAmenityId(params);
    const { hotelId, action } = await request.json();

    if (!hotelId || !["link", "unlink"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    if (action === "link") {
      const exists = await prisma.hotelAmenitiesLink.findFirst({
        where: { amenityId, hotelId },
      });

      if (exists) {
        return NextResponse.json({ success: false, error: "Link already exists" }, { status: 409 });
      }

      const link = await prisma.hotelAmenitiesLink.create({
        data: { amenityId, hotelId },
      });

      return NextResponse.json({ success: true, data: link });
    }

    if (action === "unlink") {
      await prisma.hotelAmenitiesLink.deleteMany({
        where: { amenityId, hotelId },
      });

      return NextResponse.json({ success: true, message: "Link removed" });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to process link/unlink" }, { status: 500 });
  }
}

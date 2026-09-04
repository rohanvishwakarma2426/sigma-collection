import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request, { params }) {
  const { id } = await params;
  const { sizeId, colorId, stockQuantity } = await request.json();

  try {
    const variant = await prisma.productVariant.create({
      data: {
        productId: id,
        sizeId: sizeId || null,
        colorId: colorId || null,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
      },
      include: { size: true, color: true },
    });
    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "This size/color combination already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add variant" }, { status: 500 });
  }
}
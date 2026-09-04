import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(request, { params }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body, // e.g. { status: "AVAILABLE" }
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
export async function GET(request, { params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: { include: { size: true, color: true } },
      category: true,
      brand: true,
    },
  });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}
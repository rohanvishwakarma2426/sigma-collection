import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, message, productId, variantId, quantity } = body;

    if (!customerName || !customerPhone || !productId) {
      return NextResponse.json(
        { error: "Name, phone, and product are required" },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        message: message || null,
        items: {
          create: [
            {
              productId,
              variantId: variantId || null,
              quantity: quantity || 1,
            },
          ],
        },
      },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error("Enquiry error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
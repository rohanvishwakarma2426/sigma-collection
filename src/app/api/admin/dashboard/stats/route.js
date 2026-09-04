import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [totalProducts, available, incoming, outOfStock, totalEnquiries, newEnquiries] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: "AVAILABLE" } }),
        prisma.product.count({ where: { status: "INCOMING" } }),
        prisma.product.count({ where: { status: "OUT_OF_STOCK" } }),
        prisma.enquiry.count(),
        prisma.enquiry.count({ where: { status: "NEW" } }),
      ]);

    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, status: true, price: true },
    });

    const recentEnquiries = await prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, customerName: true, customerPhone: true, status: true, createdAt: true },
    });

    return NextResponse.json({
      totalProducts,
      available,
      incoming,
      outOfStock,
      totalEnquiries,
      newEnquiries,
      recentProducts,
      recentEnquiries,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
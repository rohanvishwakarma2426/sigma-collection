import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
  return NextResponse.json(enquiries);
}
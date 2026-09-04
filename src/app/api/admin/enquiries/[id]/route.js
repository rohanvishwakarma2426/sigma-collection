import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json(enquiry);
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(request, { params }) {
  const { id } = await params;
  await prisma.productVariant.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
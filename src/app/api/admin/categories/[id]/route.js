import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(request, { params }) {
  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
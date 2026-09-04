import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sizes = await prisma.size.findMany({ orderBy: { label: "asc" } });
  return NextResponse.json(sizes);
}

export async function POST(request) {
  const { label } = await request.json();
  if (!label) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }
  const size = await prisma.size.create({ data: { label } });
  return NextResponse.json(size, { status: 201 });
}
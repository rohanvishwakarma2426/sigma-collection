import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(colors);
}

export async function POST(request) {
  const { name, hexCode } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const color = await prisma.color.create({ data: { name, hexCode: hexCode || null } });
  return NextResponse.json(color, { status: 201 });
}
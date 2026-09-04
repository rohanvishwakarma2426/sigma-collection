import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(brands);
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const brand = await prisma.brand.create({
      data: { name, slug: slugify(name) },
    });
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}